#!/bin/bash

# AI Cube Deployment Verification Script
# Comprehensive verification of deployed application

set -e

# Configuration
DEPLOY_URL="${1:-https://app.aicube.ai}"
TIMEOUT="${2:-30}"
MAX_RETRIES="${3:-5}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
log_success() { echo -e "${GREEN}✅ $1${NC}"; }
log_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
log_error() { echo -e "${RED}❌ $1${NC}"; }

# Test results tracking
TESTS_PASSED=0
TESTS_FAILED=0
FAILED_TESTS=()

# Function to run a test with retry logic
run_test() {
    local test_name="$1"
    local test_command="$2"
    local retry_count=0
    
    while [[ $retry_count -lt $MAX_RETRIES ]]; do
        if eval "$test_command"; then
            log_success "$test_name"
            ((TESTS_PASSED++))
            return 0
        else
            ((retry_count++))
            if [[ $retry_count -lt $MAX_RETRIES ]]; then
                log_warning "$test_name failed, retrying ($retry_count/$MAX_RETRIES)..."
                sleep 2
            fi
        fi
    done
    
    log_error "$test_name failed after $MAX_RETRIES attempts"
    FAILED_TESTS+=("$test_name")
    ((TESTS_FAILED++))
    return 1
}

# Test: Basic connectivity
test_basic_connectivity() {
    local status_code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$DEPLOY_URL" || echo "000")
    [[ "$status_code" == "200" ]]
}

# Test: Health check endpoint
test_health_endpoint() {
    local health_response
    health_response=$(curl -s --max-time "$TIMEOUT" "$DEPLOY_URL/api/health" || echo "error")
    echo "$health_response" | jq -e '.status == "healthy" or .status == "degraded"' > /dev/null 2>&1
}

# Test: Readiness endpoint
test_readiness_endpoint() {
    local ready_response
    ready_response=$(curl -s --max-time "$TIMEOUT" "$DEPLOY_URL/api/health/ready" || echo "error")
    echo "$ready_response" | jq -e '.status == "ready"' > /dev/null 2>&1
}

# Test: Static assets loading
test_static_assets() {
    local js_status css_status
    
    # Get main HTML and extract asset URLs
    local html_content
    html_content=$(curl -s --max-time "$TIMEOUT" "$DEPLOY_URL" || echo "")
    
    # Extract first JavaScript file
    local js_file
    js_file=$(echo "$html_content" | grep -o '/assets/[^"]*\.js' | head -1)
    
    if [[ -n "$js_file" ]]; then
        js_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$DEPLOY_URL$js_file" || echo "000")
    else
        js_status="404"
    fi
    
    # Extract first CSS file
    local css_file
    css_file=$(echo "$html_content" | grep -o '/assets/[^"]*\.css' | head -1)
    
    if [[ -n "$css_file" ]]; then
        css_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$DEPLOY_URL$css_file" || echo "000")
    else
        css_status="404"
    fi
    
    [[ "$js_status" == "200" && "$css_status" == "200" ]]
}

# Test: API endpoints accessibility
test_api_endpoints() {
    local endpoints=(
        "/api/health"
        "/api/health/ready" 
        "/api/health/live"
    )
    
    for endpoint in "${endpoints[@]}"; do
        local status_code
        status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$DEPLOY_URL$endpoint" || echo "000")
        if [[ "$status_code" != "200" ]]; then
            return 1
        fi
    done
    
    return 0
}

# Test: Payment page accessibility (should load without errors)
test_payment_page() {
    local status_code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$DEPLOY_URL/payment" || echo "000")
    [[ "$status_code" == "200" ]]
}

# Test: Login page accessibility
test_login_page() {
    local status_code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$DEPLOY_URL/login" || echo "000")
    [[ "$status_code" == "200" ]]
}

# Test: 404 handling
test_404_handling() {
    local status_code
    status_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$DEPLOY_URL/nonexistent-page-12345" || echo "000")
    [[ "$status_code" == "404" || "$status_code" == "200" ]] # SPA might return 200 and handle 404 in JS
}

# Test: Security headers
test_security_headers() {
    local headers
    headers=$(curl -s -I --max-time "$TIMEOUT" "$DEPLOY_URL" || echo "")
    
    # Check for basic security headers
    echo "$headers" | grep -qi "x-frame-options" && \
    echo "$headers" | grep -qi "x-content-type-options"
}

# Test: SSL/TLS (if HTTPS)
test_ssl_certificate() {
    if [[ "$DEPLOY_URL" == https://* ]]; then
        local ssl_info
        ssl_info=$(curl -s -I --max-time "$TIMEOUT" "$DEPLOY_URL" 2>&1 || echo "")
        ! echo "$ssl_info" | grep -qi "certificate"
    else
        # Skip test for HTTP URLs
        return 0
    fi
}

# Test: Performance basic check
test_performance() {
    local response_time
    response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" "$DEPLOY_URL" || echo "999")
    
    # Check if response time is under 3 seconds
    awk -v time="$response_time" 'BEGIN { exit (time > 3.0) }'
}

# Test: Content validation
test_content_validation() {
    local content
    content=$(curl -s --max-time "$TIMEOUT" "$DEPLOY_URL" || echo "")
    
    # Check for essential content
    echo "$content" | grep -qi "AI Cube" && \
    echo "$content" | grep -qi "html" && \
    ! echo "$content" | grep -qi "error"
}

# Main verification function
main() {
    echo ""
    log_info "🔍 Starting AI Cube Deployment Verification"
    log_info "Target URL: $DEPLOY_URL"
    log_info "Timeout: ${TIMEOUT}s | Max Retries: $MAX_RETRIES"
    echo ""
    
    # Check if curl and jq are available
    if ! command -v curl &> /dev/null; then
        log_error "curl is required but not installed"
        exit 1
    fi
    
    if ! command -v jq &> /dev/null; then
        log_warning "jq is not installed, some tests will be skipped"
    fi
    
    # Run all tests
    run_test "Basic Connectivity" "test_basic_connectivity"
    run_test "Health Endpoint" "test_health_endpoint"
    run_test "Readiness Endpoint" "test_readiness_endpoint"
    run_test "Static Assets Loading" "test_static_assets"
    run_test "API Endpoints" "test_api_endpoints"
    run_test "Payment Page" "test_payment_page"
    run_test "Login Page" "test_login_page"
    run_test "404 Handling" "test_404_handling"
    run_test "Security Headers" "test_security_headers"
    run_test "SSL Certificate" "test_ssl_certificate"
    run_test "Performance Check" "test_performance"
    run_test "Content Validation" "test_content_validation"
    
    # Summary
    echo ""
    log_info "📊 Verification Summary"
    echo "Tests Passed: $TESTS_PASSED"
    echo "Tests Failed: $TESTS_FAILED"
    
    if [[ $TESTS_FAILED -eq 0 ]]; then
        log_success "🎉 All verification tests passed!"
        echo ""
        log_info "Deployment URL: $DEPLOY_URL"
        log_info "Status: ✅ VERIFIED"
        exit 0
    else
        log_error "❌ Some verification tests failed"
        echo "Failed tests:"
        for test in "${FAILED_TESTS[@]}"; do
            echo "  - $test"
        done
        echo ""
        log_warning "Please review and fix the issues before considering the deployment complete"
        exit 1
    fi
}

# Run verification if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi