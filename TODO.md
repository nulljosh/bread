# TODO

## P0 - Critical
1. **Improve simulator win rate** - Currently ~70%, target 85%+
   - Tune position sizing, stop loss, momentum thresholds
   - Add volatility filtering to avoid choppy markets
   - Add cooldown after stop-loss hits
   - Widen take-profit at higher balances

2. **Record simulation runs** - Track performance analytics
   - Save win rate, time to target, best/worst assets
   - localStorage-based run history
   - Aggregate stats display (last N runs, overall win rate)

## P1 - High Value
3. **Sync simulator with live prices** - Currently uses random walks
4. **Automated speed test** - Verify sub-60s target programmatically
5. **Backtest on historical data** - Replay 1yr candles through simulator logic
   - Measure real-world win rate, Sharpe ratio, max drawdown
   - Test across multiple market conditions

## P2 - Features
6. **Kalshi integration** - Second prediction market source
7. **Black-Scholes options pricing** - Greeks, put hedging when VIX > 30
8. **Whale tracking** - Large position monitoring
9. **Arbitrage detection** - Cross-market price discrepancies
10. **Portfolio correlation analysis** - Asset correlation matrix
11. **Custom stock input** - Any ticker via Yahoo Finance
12. **Price alerts** - Browser notifications on >3% moves

## P3 - Infrastructure
13. **Delta-Threshold algorithm** - Only update UI when price moves >0.5%
14. **Binary payload compression** - 14 bytes vs 100+ bytes JSON
15. **WebSocket feeds** - Replace polling with push updates
16. **Vectorized Monte Carlo** - SIMD-optimized simulations

## P4 - Trading Integration
17. **Paper trading mode** - Alpaca API integration
18. **TradingView webhooks** - Alert -> Bread -> Broker pipeline
19. **Interactive Brokers API** - TWS integration for live execution
20. **Kill switch + position limits** - Risk management guardrails

## P5 - Civilian Palantir (OSINT Intelligence Layer)
Inspiration: OSINT Intelligence Platform (dark map UI, live tracking sidebar, social intel feeds)
Goal: Open-source civilian Palantir — unified geospatial + financial + social intelligence

### Map & Geospatial
25. **Live world map** - Dark-themed interactive map with clustered event pins (Leaflet/Mapbox GL)
26. **Earthquake alerts** - USGS API feed with magnitude, depth, location, coordinates, timestamp overlay
27. **Conflict/incident markers** - Color-coded pins by type (military, protest, natural disaster, infrastructure)
28. **DOT camera feeds** - Department of Transportation live traffic/highway cameras
29. **Geolocation tagging** - Auto-tag all events with lat/lng, reverse geocode to human-readable

### Social Intelligence
30. **Twitter/X feed** - Real-time filtered stream (keywords: breaking, alert, confirmed, military, earthquake)
31. **Reddit/4chan /pol/ /biz/** - Sentiment scraping, early signal detection
32. **Citizen incident reports** - Crowdsourced local event reporting (Citizen app-style)
33. **Scanner feeds** - Police/fire/EMS radio streams (Broadcastify API or similar)
34. **Engagement metrics** - Show likes/retweets/replies for credibility weighting

### Intelligence Pipeline
35. **ELINT news aggregation** - Breaking news from @ELINTNews, @Global_Intel, @IntelCrab style accounts
36. **Event → market correlation** - Map geopolitical events to market impact (Strait of Hormuz → oil, Tbilisi protests → emerging markets)
37. **Live tracking sidebar** - "8 items" style feed with real-time event count, source attribution
38. **Search & filter** - Full-text search across all intel sources, filter by region/type/severity
39. **Alert system** - Push notifications for high-severity events (>5.0 earthquake, military escalation, >3% market move)

### Data Sources
- USGS (earthquakes), GDACS (disasters), ACLED (conflict), Broadcastify (scanners)
- Twitter/X API, Reddit API, news RSS/webhooks
- DOT camera APIs (state-level), Citizen API (if available)
- Polymarket + financial feeds (already built in bread)

## P6 - Future Architecture
21. **C++ core** - Rewrite compute modules (see `c-core` branch)
22. **WebAssembly bridge** - Compile C++ to WASM for browser
23. **Custom RTOS** - Bare-metal financial OS (<5MB)
24. **White paper publication** - LaTeX template, academic validation

---

## Completed (2026-01-25)
- [x] Restored stock API with Yahoo Finance
- [x] Fixed ticker to show live stock prices
- [x] Added drag-to-scroll + auto-scroll to ticker
- [x] Fixed dark/light mode in simulator
- [x] Added comprehensive tests for 1T target
- [x] Tuned momentum thresholds (1.0% -> 0.8%)
- [x] Reduced position sizing for safety (75% -> 65% at start)
- [x] Improved risk/reward ratio (1.8%/4.2% -> 1.5%/4.5%)

## Completed (2026-01-24)
- [x] Fixed win condition - stops at exactly $1B/$1T
- [x] Progressive risk reduction
- [x] Trading simulator $1 -> $1B working
- [x] Bundle size: 577KB -> 233KB
- [x] Sub-60 second challenge
- [x] Automated testing suite
