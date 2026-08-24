# Deploying RSDN-QR to Cloudflare Pages

This document outlines the steps to deploy this Vite React application to Cloudflare Pages.

## Prerequisites
- A GitHub/GitLab account where this repository is hosted.
- A Cloudflare account.

## Step-by-Step Guide

1. **Log in to Cloudflare**
   Go to the [Cloudflare Dashboard](https://dash.cloudflare.com/) and log in.

2. **Navigate to Pages**
   On the left sidebar, click on **Workers & Pages**.

3. **Create a new Project**
   Click on the **Create application** button, then select the **Pages** tab.
   Click on **Connect to Git**.

4. **Connect your Repository**
   Select your Git provider (GitHub or GitLab) and authorize Cloudflare to access your repositories.
   Select the `RSDN-QR` repository from the list and click **Begin setup**.

5. **Configure Build Settings**
   In the **Set up builds and deployments** section, configure the following:

   - **Project name**: `rsdn-qr` (or your preferred name)
   - **Production branch**: `main` (or `master`, depending on your default branch)
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`

6. **Environment Variables (Optional)**
   If you have any environment variables defined in your `.env` file (such as API keys), you need to add them here.
   - Click on **Environment variables (advanced)**.
   - Add your variables (e.g., `VITE_API_URL`, etc.).

7. **Deploy**
   Click **Save and Deploy**. Cloudflare will now clone your repository, run the build command, and deploy your site.

## Post-Deployment
Once the deployment is complete, Cloudflare will provide you with a `*.pages.dev` URL where your site is live. 
You can configure a custom domain in the project settings under the **Custom Domains** tab.

## Note on Routing
Vite produces a Single Page Application (SPA). By default, Cloudflare Pages handles SPA routing automatically, so you shouldn't need a `_redirects` file for basic client-side routing to work.
