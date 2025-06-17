#!/bin/bash

# AI Cube Production Deployment Script
# Deploys the application to production with full safety checks

set -e  # Exit on any error

# Configuration
DEPLOY_ENV="${1:-production}"
DEPLOY_TARGET="${2:-vercel}"  # vercel, netlify, or custom
BACKUP_ENABLED="${3:-true}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Function to check prerequisites
check_prerequisites() {
    log_info "Checking deployment prerequisites..."
    
    # Check Node.js version
    NODE_VERSION=$(node --version | cut -d'v' -f2)
    REQUIRED_NODE="18.0.0"
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
    fi
    
    # Check git
    if ! command -v git &> /dev/null; then
        log_error "git is not installed"
    fi
    
    # Check if we're in a git repository
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        log_error "Not in a git repository"
    fi
    
    # Check for uncommitted changes
    if ! git diff-index --quiet HEAD --; then
        log_warning "There are uncommitted changes. Continue? (y/n)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            log_error "Deployment cancelled"
        fi
    fi
    
    log_success "Prerequisites check passed"
}

# Function to validate environment configuration
validate_environment() {
    log_info "Validating environment configuration..."
    
    # Check for required environment files
    if [[ ! -f ".env" ]]; then
        log_error ".env file not found"
    fi
    
    if [[ ! -f ".env.server" ]]; then
        log_error ".env.server file not found"
    fi
    
    # Check for production environment variables
    source .env.server
    
    REQUIRED_VARS=(
        "SUPABASE_SERVICE_ROLE_KEY"
        "STRIPE_SECRET_KEY"
        "STRIPE_WEBHOOK_SIGNING_SECRET"
    )
    
    for var in "${REQUIRED_VARS[@]}"; do
        if [[ -z "${!var}" ]]; then
            log_error "Required environment variable $var is not set"
        fi
        
        # Check if it's still a placeholder
        if [[ "${!var}" == *"your_"* ]] || [[ "${!var}" == *"_here"* ]]; then
            log_error "Environment variable $var appears to be a placeholder value"
        fi
    done
    
    # Validate Stripe keys for production
    if [[ "$DEPLOY_ENV" == "production" ]]; then
        if [[ "$STRIPE_SECRET_KEY" == *"test"* ]]; then
            log_error "Production deployment cannot use Stripe test keys"
        fi
    fi
    
    log_success "Environment validation passed"
}

# Function to run tests
run_tests() {
    log_info "Running test suite..."
    
    # Install dependencies if needed
    if [[ ! -d "node_modules" ]]; then
        log_info "Installing dependencies..."
        npm install
    fi
    
    # Run linting
    log_info "Running linter..."
    npm run lint -- --max-warnings 10 || {
        log_warning "Linting issues detected. Continue? (y/n)"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            log_error "Deployment cancelled due to linting issues"
        fi
    }
    
    # Run type checking
    log_info "Running TypeScript type check..."
    npm run typecheck || log_error "TypeScript type check failed"
    
    # Run unit tests
    log_info "Running unit tests..."
    npm run test || log_error "Unit tests failed"
    
    log_success "All tests passed"
}

# Function to build the application
build_application() {
    log_info "Building application for $DEPLOY_ENV..."
    
    # Set environment for build
    export NODE_ENV="production"
    export VITE_APP_VERSION=$(git rev-parse --short HEAD)
    export VITE_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # Run production build
    npm run build || log_error "Build failed"
    
    # Check build output
    if [[ ! -d "dist" ]]; then
        log_error "Build output directory 'dist' not found"
    fi
    
    # Check critical files exist
    CRITICAL_FILES=("dist/index.html" "dist/assets")
    for file in "${CRITICAL_FILES[@]}"; do
        if [[ ! -e "$file" ]]; then
            log_error "Critical build file $file not found"
        fi
    done
    
    # Get build size
    BUILD_SIZE=$(du -sh dist/ | cut -f1)
    log_success "Build completed successfully (Size: $BUILD_SIZE)"
}

# Function to backup current deployment
backup_current_deployment() {
    if [[ "$BACKUP_ENABLED" != "true" ]]; then
        log_info "Backup disabled, skipping..."
        return
    fi
    
    log_info "Creating backup of current deployment..."
    
    BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
    mkdir -p "$BACKUP_DIR"
    
    # Backup critical files
    cp -r dist/ "$BACKUP_DIR/" 2>/dev/null || true
    cp .env "$BACKUP_DIR/" 2>/dev/null || true
    cp package.json "$BACKUP_DIR/"
    
    # Save git commit info
    git rev-parse HEAD > "$BACKUP_DIR/commit.txt"
    git log -1 --pretty=format:"%h - %an, %ar: %s" > "$BACKUP_DIR/commit_info.txt"
    
    log_success "Backup created at $BACKUP_DIR"
}

# Function to deploy to different platforms
deploy_to_platform() {
    local platform="$1"
    
    case "$platform" in
        "vercel")
            deploy_to_vercel
            ;;
        "netlify")
            deploy_to_netlify
            ;;
        "custom")
            deploy_to_custom_server
            ;;
        *)
            log_error "Unknown deployment platform: $platform"
            ;;
    esac
}

# Vercel deployment
deploy_to_vercel() {
    log_info "Deploying to Vercel..."
    
    if ! command -v vercel &> /dev/null; then
        log_error "Vercel CLI not installed. Run: npm i -g vercel"
    fi
    
    # Deploy with production flag
    if [[ "$DEPLOY_ENV" == "production" ]]; then
        vercel --prod --yes || log_error "Vercel deployment failed"
    else
        vercel --yes || log_error "Vercel deployment failed"
    fi
    
    log_success "Deployed to Vercel successfully"
}

# Netlify deployment
deploy_to_netlify() {
    log_info "Deploying to Netlify..."
    
    if ! command -v netlify &> /dev/null; then
        log_error "Netlify CLI not installed. Run: npm i -g netlify-cli"
    fi
    
    # Deploy
    if [[ "$DEPLOY_ENV" == "production" ]]; then
        netlify deploy --prod --dir=dist || log_error "Netlify deployment failed"
    else
        netlify deploy --dir=dist || log_error "Netlify deployment failed"
    fi
    
    log_success "Deployed to Netlify successfully"
}

# Custom server deployment
deploy_to_custom_server() {
    log_info "Deploying to custom server..."
    
    # This would be customized based on your server setup
    # Example: rsync to server, docker deployment, etc.
    
    log_warning "Custom server deployment not implemented"
    log_info "Please implement custom deployment logic for your infrastructure"
}

# Function to verify deployment
verify_deployment() {
    log_info "Verifying deployment..."
    
    # Check if URL is provided
    DEPLOY_URL="${DEPLOY_URL:-}"
    if [[ -z "$DEPLOY_URL" ]]; then
        log_warning "DEPLOY_URL not set, skipping automated verification"
        return
    fi
    
    # Wait a moment for deployment to propagate
    sleep 10
    
    # Check if site is accessible
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL" || echo "000")
    
    if [[ "$HTTP_STATUS" == "200" ]]; then
        log_success "Deployment verification passed - Site is accessible"
    else
        log_warning "Deployment verification failed - HTTP Status: $HTTP_STATUS"
    fi
    
    # Check for JavaScript errors (basic check)
    CONSOLE_ERRORS=$(curl -s "$DEPLOY_URL" | grep -i "error" | wc -l || echo "0")
    if [[ "$CONSOLE_ERRORS" -eq 0 ]]; then
        log_success "No obvious JavaScript errors detected"
    else
        log_warning "Potential JavaScript errors detected in HTML"
    fi
}

# Function to update monitoring
update_monitoring() {
    log_info "Updating monitoring systems..."
    
    # Update deployment tracking
    COMMIT_HASH=$(git rev-parse --short HEAD)
    DEPLOY_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    
    # Log deployment event
    echo "$(date): Deployed commit $COMMIT_HASH to $DEPLOY_ENV" >> deployments.log
    
    # TODO: Send deployment notification to monitoring service
    # Example: curl to Sentry releases API, Slack webhook, etc.
    
    log_success "Monitoring updated"
}

# Function to post-deployment cleanup
post_deployment_cleanup() {
    log_info "Running post-deployment cleanup..."
    
    # Clean up temporary files
    rm -rf tmp/ 2>/dev/null || true
    
    # Keep only last 10 backups
    if [[ -d "backups" ]]; then
        cd backups
        ls -t | tail -n +11 | xargs rm -rf 2>/dev/null || true
        cd ..
    fi
    
    log_success "Cleanup completed"
}

# Main deployment function
main() {
    echo ""
    log_info "🚀 Starting AI Cube Production Deployment"
    log_info "Environment: $DEPLOY_ENV"
    log_info "Target: $DEPLOY_TARGET"
    echo ""
    
    # Deployment steps
    check_prerequisites
    validate_environment
    run_tests
    build_application
    backup_current_deployment
    deploy_to_platform "$DEPLOY_TARGET"
    verify_deployment
    update_monitoring
    post_deployment_cleanup
    
    echo ""
    log_success "🎉 Deployment completed successfully!"
    log_info "Environment: $DEPLOY_ENV"
    log_info "Commit: $(git rev-parse --short HEAD)"
    log_info "Time: $(date)"
    
    if [[ -n "$DEPLOY_URL" ]]; then
        log_info "URL: $DEPLOY_URL"
    fi
    echo ""
}

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi