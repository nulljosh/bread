// Alternative: Financial Modeling Prep API (free tier: 250 req/day)
// Use this if Yahoo Finance continues returning 401

export default async function handler(req, res) {
  const symbols = req.query.symbols || 'AAPL,MSFT,GOOGL,AMZN,META,TSLA,NVDA';
  const symbolList = symbols.split(',');

  if (symbolList.length > 50) {
    return res.status(400).json({ error: 'Too many symbols (max 50)' });
  }

  try {
    // Note: 'demo' API key has severe rate limits
    // For production, sign up at https://financialmodelingprep.com
    const apiKey = process.env.FMP_API_KEY || 'demo';
    
    const url = `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${apiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`FMP API returned ${response.status}`);
    }

    const data = await response.json();

    const stocks = data.map(q => ({
      symbol: q.symbol,
      price: q.price ?? null,
      change: q.change ?? null,
      changePercent: q.changesPercentage ?? null,
      volume: q.volume ?? null,
      high: q.dayHigh ?? null,
      low: q.dayLow ?? null,
      open: q.open ?? null,
      prevClose: q.previousClose ?? null,
      marketCap: q.marketCap ?? null,
      fiftyTwoWeekHigh: q.yearHigh ?? null,
      fiftyTwoWeekLow: q.yearLow ?? null,
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(stocks);
  } catch (error) {
    console.error('FMP API error:', error);
    res.status(500).json({
      error: 'Failed to fetch stock data from FMP',
      details: error.message
    });
  }
}
