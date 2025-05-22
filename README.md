# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/af2706f6-61c9-4e5a-a90e-0ee11e849b89

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/af2706f6-61c9-4e5a-a90e-0ee11e849b89) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Stripe Integration Configuration
To use the Stripe payment functionality during development, you need to set up your local environment variables:

1.  **Create `.env.local` File:**
    In the root directory of the project, create a file named `.env.local`. This file is for your local development keys and will not be committed to the repository (it's covered by `*.local` in `.gitignore`).

2.  **Copy from Example:**
    Copy the contents of the `.env.example` file (also in the root directory) into your newly created `.env.local` file.

3.  **Add Your Stripe Keys:**
    Replace the placeholder values in `.env.local` with your actual Stripe **Test** Publishable Key and Price IDs. You can find these in your Stripe Dashboard.

    The required environment variables are:
    *   `VITE_APP_STRIPE_PUBLISHABLE_KEY`: Your Stripe Test Publishable Key (e.g., `pk_test_xxxxxxxxxxxx`).
    *   `VITE_APP_STRIPE_SINGLE_LICENSE_PRICE_ID`: The Price ID for the "Single License" product tier.
    *   `VITE_APP_STRIPE_SIBLINGS_ACCESS_PRICE_ID`: The Price ID for the "Siblings Access" product tier.
    *   `VITE_APP_STRIPE_LEGACY_FOUNDER_PRICE_ID`: The Price ID for the "Legacy Founder" product tier.

    **What are Price IDs?** Price IDs (e.g., `price_xxxxxxxxxxxx`) are unique identifiers for specific prices of products you set up in your Stripe Dashboard. Each Price ID corresponds to a defined product and its associated cost, currency, and billing interval (if applicable).

4.  **Important Note:**
    Ensure that `.env.local` is listed in your `.gitignore` file (it should be by default with `*.local`). **Never commit your `.env.local` file or your secret Stripe keys to the repository.**

After setting these variables, restart your development server for the changes to take effect.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/af2706f6-61c9-4e5a-a90e-0ee11e849b89) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
