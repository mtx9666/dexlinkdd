# Dexlink Platform

A decentralized social trading platform with AI-powered HFT bot integration.

## 🚀 Deployment Guide for Vercel

### Prerequisites
- A GitHub account
- A Vercel account (you can sign up with your GitHub account)
- Node.js installed on your local machine
- Git installed on your local machine

### Step 1: Prepare Your Application

1. Clone the repository:
   ```bash
   git clone https://github.com/mtx9666/dexlink-platform.git
   cd dexlink-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Test locally:
   ```bash
   npm run dev
   ```

### Step 2: Push to GitHub

1. Create a new repository on GitHub
2. Initialize git and push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/mtx9666/dexlink-platform.git
   git push -u origin main
   ```

### Step 3: Deploy on Vercel

1. Go to [Vercel](https://vercel.com) and sign in with your GitHub account
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `next build`
   - Output Directory: .next
   - Install Command: `npm install`

### Step 4: Configure Environment Variables

1. In your Vercel project dashboard, go to "Settings" > "Environment Variables"
2. Add the following variables:
   ```
   NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
   ```
3. Add any other environment variables your application needs

### Step 5: Configure Domain (Optional)

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to configure your DNS settings
4. Vercel will automatically provision an SSL certificate

### Step 6: Deploy

1. Click "Deploy" in the Vercel dashboard
2. Vercel will automatically build and deploy your application
3. You'll get a deployment URL (e.g., `https://dexlink-platform.vercel.app`)

### Step 7: Set Up Continuous Deployment

- Every push to your main branch will automatically trigger a new deployment
- Pull requests will get preview deployments automatically
- You can configure branch protection rules in GitHub for additional security

### Step 8: Monitor Your Deployment

1. Use Vercel Analytics to monitor:
   - Page views
   - Performance metrics
   - Error rates
   - User behavior

2. Check deployment logs in the Vercel dashboard if you encounter any issues

### Step 9: Configure Web3 Features

1. Add your Web3 configuration to environment variables:
   ```
   NEXT_PUBLIC_RPC_URL=your_rpc_url
   NEXT_PUBLIC_CHAIN_ID=1
   ```

2. Configure CORS settings if needed in your API routes

### Troubleshooting

- **Build Failures**: Check the build logs in Vercel dashboard
- **Environment Variables**: Ensure all required variables are set
- **API Routes**: Verify your API routes are in the correct location (`/app/api/`)
- **Web3 Issues**: Check your RPC configuration and network settings

### Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

## 🧱 Core Stack & Tools

| Area | Stack |
|------|-------|
| Framework | Next.js 14 (app directory) |
| Styling | Tailwind CSS + shadcn/ui |
| Wallets | wagmi, viem, RainbowKit |
| DEX API | 0x API or Uniswap SDK |
| Backend Bot | FastAPI (Python) or Node.js (Express) |
| Realtime | Socket.IO or Supabase Realtime |
| Data Fetching | SWR or React Query |
| Charts | Lightweight Charts or TradingView widget |

## 📅 Development Timeline

See [tasks.md](tasks.md) for the complete development plan and feature checklist. 