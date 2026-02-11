# Tweet Ideas for Implementation

## Prediction Market Trading Agent
**Source:** https://x.com/argona0x/status/2021232172753936470

**Concept:**
Autonomous agent that trades on prediction markets (Polymarket, Kalshi, Metaculus) using edge detection and Kelly criterion position sizing.

**Features:**
- Real-time terminal dashboard
- Starting balance: $50
- Edge detection (find mispriced markets)
- Fractional Kelly betting strategy
- Live metrics: balance, P&L, win rate, API costs, runway
- Activity log stream
- Survival mode (track runway days based on API costs)

**Tech Stack:**
- Python
- Rich/Textual (terminal UI)
- Polymarket/Kalshi APIs
- SQLite (trade history)
- Kelly criterion math

**MVP:**
- Connect to Polymarket
- Simple odds comparison edge detector
- Manual bet approval
- Basic dashboard with balance/P&L

**Status:** Idea captured
