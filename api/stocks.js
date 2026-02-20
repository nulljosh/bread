// Yahoo Finance bulk quote API — single request for all symbols
const YAHOO_URL = 'https://query1.finance.yahoo.com/v7/finance/quote';
const TIMEOUT_MS = 10000;
const DEFAULT_SYMBOLS = 'AAPL,MSFT,GOOGL,AMZN,META,TSLA,NVDA';

export default async function handler(req, res) {
  const raw = req.query.symbols || DEFAULT_SYMBOLS;
  const symbolList = raw.split(',').map(s => s.trim()).filter(Boolean);

  // Validate symbols — alphanumeric plus . - = ^ (covers BRK-B, GC=F, ^GSPC, etc.)
  if (symbolList.some(s => !/^[A-Za-z0-9.\-=^]+$/.test(s))) {
    return res.status(400).json({ error: 'Invalid symbols format' });
  }

  if (symbolList.length > 50) {
    return res.status(400).json({ error: 'Too many symbols' });
  }

  try {
    const url = `${YAHOO_URL}?symbols=${symbolList.join(',')}&fields=regularMarketPrice,regularMarketChange,regularMarketChangePercent,regularMarketVolume,fiftyTwoWeekHigh,fiftyTwoWeekLow`;

    const timeout = new Promise((_, reject) =>
      setTimeout(() => {
        const err = new Error('Request timeout');
        err.name = 'TimeoutError';
        reject(err);
      }, TIMEOUT_MS)
    );

    const fetchPromise = fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
    }).then(async response => {
      if (!response.ok) {
        throw new Error(`Yahoo Finance API returned ${response.status}: ${response.statusText}`);
      }
      return response.json();
    });

    const data = await Promise.race([fetchPromise, timeout]);

    const results = data?.quoteResponse?.result;
    if (!Array.isArray(results)) {
      throw new Error('Invalid response format: expected quoteResponse.result array');
    }

    const stocks = results
      .filter(q => q.symbol && typeof q.regularMarketPrice === 'number')
      .map(q => ({
        symbol: q.symbol,
        price: q.regularMarketPrice,
        change: q.regularMarketChange ?? 0,
        changePercent: q.regularMarketChangePercent ?? 0,
        volume: q.regularMarketVolume ?? 0,
        fiftyTwoWeekHigh: q.fiftyTwoWeekHigh ?? null,
        fiftyTwoWeekLow: q.fiftyTwoWeekLow ?? null,
      }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(stocks);
  } catch (err) {
    if (err.name === 'TimeoutError' || err.message === 'Request timeout') {
      return res.status(504).json({
        error: 'Request timeout',
        details: 'Yahoo Finance did not respond in time',
      });
    }
    return res.status(500).json({
      error: 'Failed to fetch stock data',
      details: err.message,
    });
  }
}
