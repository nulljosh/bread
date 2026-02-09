# The Soul of Bread

> "Build fast, not bloated."

## The 10MB Dashboard

Most financial terminals are slow, bloated, and expensive:
- **Bloomberg Terminal**: $24,000/year, 100MB+ memory, ugly UI
- **MetaTrader**: 200MB+ install, cluttered interface, Windows-only
- **TradingView**: 50MB+ page load, slow charts, premium paywalls

Bread is different:
- **Memory**: <10MB runtime footprint
- **Bundle**: 233KB (target <200KB)
- **Speed**: Sub-60s to run $1 → $1B simulation
- **Cost**: Free, open source

**The constraint is the point.** Every feature must justify its bytes.

---

## Philosophy

### 1. Speed is Sacred
Latency kills alpha. Every millisecond between signal and execution is money left on the table.

**Design decisions:**
- 50ms tick rate (Bloomberg: 250ms)
- Delta-Threshold updates (only render on >0.5% moves)
- Vectorized Monte Carlo (SIMD-optimized)
- Binary payloads (14 bytes vs 100+ bytes JSON)

**What we don't do:**
- Heavy animations (compositor-only transforms)
- Large images (SVG icons, no PNGs)
- Unnecessary API calls (aggressive caching)
- Bloated dependencies (React only, no jQuery/Lodash)

### 2. Nothing Ever Happens
Markets are boring 95% of the time. UI should reflect this.

**Philosophy:**
- Silent by default
- Only alert on >3% moves
- Big red banner when VIX spikes
- Contrarian mindset (fade the hype)

**This is a feature, not a bug.** Most traders overtrade and lose money. Bread encourages patience.

### 3. Education Over Gambling
Bread is a simulator, not a casino.

**Why simulation matters:**
- Test strategies risk-free
- Learn position sizing and risk management
- Understand volatility and correlation
- Build intuition before risking real money

**We show:**
- Win rate (not just balance)
- Max drawdown (reality check)
- Stopped out count (losses matter)
- Time-weighted returns (luck vs skill)

**We don't:**
- Gamify losses (no "try again" dopamine hits)
- Hide risk (show full trade history)
- Promise returns (disclaimer everywhere)
- Encourage overtrading (pause button exists)

### 4. Transparency
Code is open source. Algorithms are documented. No black boxes.

**What you can see:**
- Trading algorithm logic (momentum detection, position sizing)
- Monte Carlo parameterization (drift, volatility calculations)
- Performance metrics (Sharpe ratio, Sortino, Calmar)
- Historical backtest results (not cherry-picked)

**What we don't do:**
- Hide losing trades
- Fake live data (everything is real)
- Manipulate simulations (RNG is seeded, reproducible)
- Overpromise (past performance ≠ future results)

### 5. Efficiency as Craft
Every optimization is a puzzle worth solving.

**Obsessions:**
- Memory footprint (target <10MB)
- Bundle size (target <200KB)
- API latency (target <100ms)
- Render performance (60 FPS minimum)

**Tools:**
- Lighthouse (performance audit)
- Chrome DevTools (memory profiling)
- Webpack Bundle Analyzer (find bloat)
- React DevTools Profiler (optimize re-renders)

**Future:**
- C++ core (10x performance)
- WebAssembly bridge (compile to browser)
- Custom RTOS (bare-metal OS for trading)

---

## Design Principles

### Instant Feedback
No spinners. No loading states. Data appears immediately from cache, updates in background.

**Implementation:**
- Vercel Blob cache for instant dashboard load
- Optimistic UI updates (assume success)
- Stale-while-revalidate pattern

### Fail Gracefully
If API breaks, show cached data + error banner. Never leave user stranded.

**Example:**
- Polymarket API down → Show last cached markets + "Live data unavailable" banner
- Yahoo Finance timeout → Use fallback API (Finnhub/IEX)
- Monte Carlo fails → Show error + last successful simulation

### Dark Mode Default
Traders stare at screens for hours. Light mode burns retinas.

**Design:**
- Dark background (#0a0a0a)
- Low-contrast text (#a1a1aa)
- High-contrast data (#ffffff for prices)
- No pure white (#ffffff → #f5f5f5)

### Mobile-First
Check prices on the bus. Run simulations in bed. Desktop is secondary.

**Constraints:**
- Touch targets ≥44px (accessibility)
- No hover-only interactions
- Responsive charts (Recharts)
- Thumb-friendly navigation

---

## The Problem

### Trading is Expensive
- **Robinhood**: "Free" but sells order flow (you are the product)
- **Interactive Brokers**: $10,000 minimum, $10/mo data fees
- **Bloomberg Terminal**: $24,000/year (designed for hedge funds)

**Bread is free.** No subscriptions, no upsells, no data selling.

### Trading Simulators are Fake
- **Investopedia Simulator**: 15-minute delayed data (useless)
- **TradingView Paper Trading**: No slippage modeling (unrealistic)
- **Webull Simulator**: Gamified like a slot machine (encourages bad habits)

**Bread is realistic:**
- Live data (Yahoo Finance)
- Slippage and fees (future feature)
- Real market conditions (volatility, correlation)
- Backtesting on historical data (not cherry-picked)

### Financial Education is Broken
- **YouTube Gurus**: Selling courses, not strategies
- **Books**: Outdated (market structure changed)
- **Colleges**: Theory, no practice

**Bread is hands-on:**
- Run 100 simulations in an hour
- Test strategies immediately
- See results, learn from losses
- No paywall for knowledge

---

## The Vision

### Phase 1: Web Simulator (Current)
- Trading simulator ($1 → $1B challenge)
- Prediction markets (Polymarket + Kalshi)
- Monte Carlo simulations
- Historical analysis

### Phase 2: Quantitative Tools (Next 3 months)
- Backtesting on 1-year data
- Strategy optimizer (grid search parameters)
- News sentiment analyzer (auto-parameterize MC)
- Performance tracking (aggregate stats)
- Target: 100+ active users

### Phase 3: Broker Integration (6-12 months)
- Paper trading with Alpaca API
- Live trading with Interactive Brokers
- TradingView webhook integration
- Risk management guardrails (kill switch, position limits)
- Target: 10+ users trading live with Bread

### Phase 4: Performance Rewrite (2027)
- C++ core for compute modules
- WebAssembly bridge to React
- 10x performance improvement
- <5ms Monte Carlo simulations
- Target: Competitive with Bloomberg on speed

### Phase 5: Academic (2027+)
- White paper publication
- Algorithm documentation
- Performance benchmarks vs MetaTrader/Bloomberg
- Open source efficiency techniques

---

## Why It Will Work

### TAM (Total Addressable Market)
- **Retail Traders**: 10M+ in North America alone
- **Finance Students**: Every business school teaches trading
- **Quant Researchers**: Need fast, cheap tools
- **Algo Traders**: Want to backtest without $10k/mo subscription

### Competition
- **Bloomberg Terminal** - Too expensive ($24k/yr)
- **TradingView** - Slow, paywalled features
- **MetaTrader** - Outdated, Windows-only
- **Webull/Robinhood** - Gamified, not educational

**There is no fast, free, lightweight financial terminal.** The market is wide open.

### Founder Advantage
- **Technical skills** - Can build MVP solo
- **Finance knowledge** - Understands trading, risk, quantitative methods
- **Design taste** - UI/UX matters for financial tools
- **Open source ethos** - Community > profit

---

## What Could Go Wrong

### Technical Risks
- Yahoo Finance API gets shut down (use Finnhub/IEX fallback)
- Vercel costs explode with scale (move to Railway/self-hosted)
- Browser performance limits (Web Workers + WASM)

**Mitigation:** Multiple API fallbacks, cost monitoring, performance budgets

### Market Risks
- Users don't care about speed (most don't)
- Free tier doesn't convert to paid (monetize differently)
- Competitors copy features (open source makes this harder)

**Mitigation:** Focus on niche (quants, algo traders), build moat with performance

### Legal Risks
- Broker integration triggers financial regulations
- Users lose money and blame Bread
- SEC/FINRA compliance issues

**Mitigation:** "Not financial advice" everywhere, start with paper trading only, consult lawyer before live trading

---

## Success Metrics

Bread succeeds if:
1. **100 active users** by April 2026
2. **Sub-60s $1 → $1B** consistently (<45s average)
3. **<200KB bundle size** maintained
4. **10+ contributors** on GitHub
5. **Zero downtime** (99.9% uptime)

Bread fails if:
1. Becomes slow (>500ms API latency)
2. Becomes bloated (>500KB bundle)
3. Becomes paywalled (core features behind premium)
4. Loses focus (scope creep, feature bloat)

---

## The Bigger Picture

Financial tools should be:
- **Fast** (sub-second feedback)
- **Free** (knowledge shouldn't cost $24k/yr)
- **Open** (algorithms documented, code visible)
- **Educational** (teach, don't gamify)

Bread is proof that speed and simplicity win.

If it works for trading, it works for:
- Personal finance (budgeting, tax optimization)
- Crypto trading (DeFi, NFTs)
- Sports betting (prediction markets)
- Real estate (market analysis)

**The constraint is the point. Build fast, not bloated.**

---

**Last updated:** 2026-02-09
**Maintained by:** [@nulljosh](https://github.com/nulljosh)
**License:** MIT (open source)
