# Dexlink Social Trading V2 - Feature Checklist

## 🧱 Core Stack & Tools

| Area | Stack |
|------|-------|
| Framework | Next.js 14 (app directory) ✅ |
| Styling | Tailwind CSS + shadcn/ui ✅ |
| Wallets | wagmi, viem, RainbowKit ✅ |
| DEX API | 0x API or Uniswap SDK |
| Backend Bot | FastAPI (Python) or Node.js (Express) |
| Realtime | Socket.IO or Supabase Realtime |
| Data Fetching | SWR or React Query |
| Charts | Lightweight Charts ✅ |

## 🧭 Brand Identity

### 🎯 Brand Values
- Decentralized empowerment
- Transparency with edge
- Innovation through AI and automation
- Community-driven finance

### 🎨 Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Purple | #7C3AED | Highlights, call-to-action, branding |
| Dark Charcoal | #0F0F0F | Background (dark mode base) |
| Slate Grey | #1E1E2F | Panel, cards, chat boxes |
| Accent Teal | #00D8A4 | AI interactions, hover states |
| Signal Red/Green | #EF4444 / #22C55E | PnL, trading signals, bot logs |

- Typography: Inter or Satoshi for clean, modern feel
- Icon Set: Lucide or Feather Icons

## 📅 Development Phases & Milestones

### Phase 1: Foundation (Weeks 1-2) ✅
- [x] Project setup with Next.js 14
- [x] Implement Tailwind CSS + shadcn/ui
- [x] Set up development environment
- [x] Create basic app structure
- [x] Implement dark mode theming
- [x] Set up wallet connection (wagmi + RainbowKit)

### Phase 2: Core Features (Weeks 3-4) 🔄
- [ ] Develop landing page
- [x] Build trade interface
- [x] Implement token list and price fetching
- [x] Create basic portfolio view
- [x] Set up social feed structure
- [x] Implement settings page

### Phase 3: Backend Integration (Weeks 5-6)
- [ ] Set up FastAPI/Node.js backend
- [ ] Implement HFT bot functionality
- [ ] Create WebSocket server
- [ ] Integrate real-time updates
- [ ] Set up database/JSON storage
- [ ] Implement trade logging system

### Phase 4: Social Features (Weeks 7-8)
- [ ] Build comment system
- [ ] Implement copy trade functionality
- [ ] Create leaderboard
- [ ] Add user profiles
- [ ] Implement notifications
- [ ] Add sentiment analysis

### Phase 5: Polish & Launch Prep (Weeks 9-10)
- [ ] Mobile responsiveness
- [ ] Performance optimization
- [ ] Security audits
- [ ] Documentation
- [ ] Testing and bug fixes
- [ ] Launch preparation

## 🧱 UX Structure Overview

| Section | Purpose |
|---------|---------|
| Landing Page | Communicate Dexlink's vision, AI + HFT edge, and social component. Encourage wallet connect and community signups. |
| App Shell | Consistent sidebar layout with animated transitions. Includes nav, theme toggle, user settings. |
| Trade Terminal | High-performance swap interface, AI signals, chart, and HFT logs. Minimalist but powerful. |
| Portfolio Tracker | Clean UI for asset breakdown, ROI trends, trade history. Add "AI Optimization Suggestions" pane. |
| Social Feed | Posts per token, sentiment tags, copy-trade prompts, user reactions. Feels like Discord meets Twitter. |
| Settings Page | Dark/light mode, preferred tokens, bot behavior (aggressive/passive), notification preferences. |

## 💡 Page-by-Page Design

### 1. 🌍 Landing Page
- Hero with Dexlink logo + slogan ("Trade Smarter. Together.")
- Animated illustrations of AI agent + real-time trading
- Feature grid (HFT Bot, Social Trading, Portfolio AI)
- "How It Works" steps (connect, analyze, trade)
- Early Access or Connect Wallet CTA
- Full-bleed dark background with Lottie animations
- Smooth scroll with section fades
- Mobile-first: one column, sticky CTA

### 2. 📊 Trade Page
- Left: Token selector + AI insights
- Center: TradingView chart + order book
- Right: Trade box (swap input/output, slippage)
- Bottom drawer: Real-time HFT bot logs
- "AI Suggests" banner above trade box
- Trade history popout
- Framer Motion slide-in for bot events

### 3. 🧠 Social Page
- Coin-filtered discussion threads
- Trade share cards (symbol, PnL, reason)
- Copy-trade button with confirmation modal
- Leaderboard (ROI, Most Copied, Most Engaged)
- Avatar + token logo in posts
- Like/reply/share buttons with animations
- Color-coded sentiment tags

### 4. 📈 Portfolio Page
- Wallet-connected dashboard
- Token table: holdings, PnL, ROI
- Trend chart (7d, 30d, all-time)
- "AI Rebalance Suggestion" block
- Export to CSV / Share feature
- Card-based layout
- Radial progress bars for asset weight
- Toggle between wallet view and performance mode

### 5. ⚙️ Settings Page
- General: Theme, Language, Units
- AI Agent Config:
  - Behavior toggle: Passive, Moderate, Aggressive
  - Allowed tokens
  - Notification channels (UI, email, Discord)
- Privacy: Disconnect wallet, data export

## ✨ Microinteractions & UX Details
- Button hovers = glowing outline effect
- Trade confirmed = green check flash + sound (optional toggle)
- HFT logs = terminal-style typewriter animation
- Page transitions = Framer Motion fade/slide
- AI responses = chatbot animation with typing dots
- Token rows = expand on hover for action buttons

## 📱 Mobile Responsiveness Plan
- Hamburger menu for sidebar
- Trade view condensed to card with collapsible panels
- Swipeable tabs for Portfolio and Social
- Fixed bottom CTA bar on mobile: [Trade] [Portfolio] [Social]

## 🧪 Optional Add-Ons for V1.1
- Dark/light theme toggle
- Notification dropdown (bot signals, trade fills)
- AI chat modal floating on all pages (like Intercom)
- "Daily Digest" AI summary of trading + feed

## 🎯 Feature Checklist

### 🟢 Phase 1: Core Frontend

#### Landing Page
- [ ] Create landing page with Dexlink story
- [ ] Add benefits section
- [ ] Implement call-to-action (CTA) buttons

#### App Layout
- [ ] Implement dark mode theme
- [ ] Create responsive navbar
- [ ] Set up page routing

#### Wallet Integration
- [ ] Integrate wagmi for wallet connection
- [ ] Add RainbowKit UI components
- [ ] Handle wallet connection states

#### Token Management
- [ ] Create token list component
- [ ] Integrate CoinGecko API for price fetching
- [ ] Implement price updates

#### Trade Page
- [ ] Build token selector component
- [ ] Integrate chart (TradingView/Lightweight Charts)
- [ ] Implement trade execution (0x/Uniswap testnet)
- [ ] Add slippage controls
- [ ] Display gas fee estimates

### 🟠 Phase 2: HFT Bot + Backend

#### Backend Setup
- [ ] Choose and set up Python/Node.js backend
- [ ] Implement ethers.js/Web3.py integration
- [ ] Create mempool scanning system
- [ ] Build pair sniping functionality
- [ ] Add trade simulation logic

#### Data Management
- [ ] Set up local database/JSON storage
- [ ] Implement trade logging system
- [ ] Create WebSocket server (Socket.IO)
- [ ] Build real-time data broadcasting

#### Bot UI Integration
- [ ] Create bot activity feed component
- [ ] Integrate feed with /trade page
- [ ] Add real-time updates

### 🔵 Phase 3: Social & Portfolio

#### Portfolio Page
- [ ] Implement wallet token fetching
- [ ] Add balance display
- [ ] Create ROI calculator
- [ ] Build trade history display

#### Social Features
- [ ] Design trade feed UI
- [ ] Implement "Copy trade" functionality
- [ ] Add comment system (Supabase)
- [ ] Create reaction system

### ⚙️ Phase 4: Settings & Polish

#### Settings Page
- [ ] Add dark mode toggle
- [ ] Implement bot mode controls
- [ ] Create wallet disconnect option
- [ ] Add user preferences storage

#### UI/UX Polish
- [ ] Implement global error handling
- [ ] Add loading states
- [ ] Create responsive layouts
- [ ] Integrate Framer Motion animations
- [ ] Optimize mobile/tablet experience

# Project Tasks and Progress

## Current Issues
- [x] Fixed missing pino-pretty dependency
- [ ] Set up environment variables
- [ ] Implement swap logic in SwapInterface component
- [ ] Add error handling for failed transactions
- [ ] Add loading states for transactions
- [ ] Implement token balance fetching
- [ ] Add token selection functionality
- [ ] Add price impact calculation
- [ ] Add transaction confirmation modal
- [ ] Add transaction history

## Environment Variables Needed
- NEXT_PUBLIC_RPC_URL
- NEXT_PUBLIC_CHAIN_ID
- NEXT_PUBLIC_CONTRACT_ADDRESS

## Next Steps
1. Set up environment variables in .env.local file
2. Implement token balance fetching using wagmi hooks
3. Add token selection modal with search functionality
4. Implement swap logic using the appropriate DEX SDK
5. Add loading states and error handling
6. Add transaction confirmation flow
7. Implement transaction history tracking

## Completed Tasks
- [x] Initial project setup
- [x] Basic UI components created
- [x] Wallet connection implemented
- [x] Basic swap interface created

## 🔄 Recent Updates & Progress

### Trade Interface
- [x] Implemented chart component with Lightweight Charts
- [x] Added volume data visualization
- [x] Implemented timeframe selection (1D, 1W, 1M, 1Y)
- [x] Added loading and error states
- [x] Implemented sample data generation for testing
- [x] Added proper cleanup and initialization handling

### Wallet Integration
- [x] Implemented WalletFallback component
- [x] Added consistent wallet connection UI across pages
- [x] Improved error handling for wallet interactions

### Settings Page
- [x] Created comprehensive settings interface
- [x] Added theme preferences
- [x] Implemented notification settings
- [x] Added trading preferences section
- [x] Implemented wallet security section

### Environment Configuration
- [x] Set up environment variables
- [x] Added network configuration
- [x] Configured contract addresses
- [x] Added API key management

## 🎯 Next Steps Priority

1. Landing Page Development
   - [ ] Create hero section
   - [ ] Add feature highlights
   - [ ] Implement CTA sections
   - [ ] Add animations and transitions

2. Backend Integration
   - [ ] Choose and set up backend framework
   - [ ] Design API endpoints
   - [ ] Implement WebSocket connections
   - [ ] Set up database schema

3. Trade Page Enhancements
   - [ ] Implement real API data fetching
   - [ ] Add technical indicators
   - [ ] Improve error handling
   - [ ] Add price alerts

## 📝 Next Steps
- [ ] Implement landing page design
- [ ] Set up backend infrastructure
- [ ] Add real-time data integration
- [ ] Implement social features (comments, reactions)
- [ ] Add AI trading signals
- [ ] Enhance mobile responsiveness
- [ ] Set up testing infrastructure
- [ ] Add documentation 