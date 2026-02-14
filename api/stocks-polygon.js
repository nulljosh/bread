// Polygon.io API - Free tier: 5 calls/minute, reliable
// Sign up: https://polygon.io (free tier sufficient for hobby use)

export default async function handler(req, res) {
  const symbols = req.query.symbols || 'AAPL,MSFT,GOOGL,AMZN,META,TSLA,NVDA';
  const symbolList = symbols.split(',').filter(s => s.trim());

  if (symbolList.length > 50) {
    return res.status(400).json({ error: 'Too many symbols (max 50)' });
  }

  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ 
      error: 'Missing API key', 
      details: 'Set POLYGON_API_KEY in Vercel environment variables' 
    });
  }

  try {
    // Fetch all quotes in parallel
    const promises = symbolList.map(async (symbol) => {
      const url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/prev?adjusted=true&apiKey=${apiKey}`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Polygon API error for ${symbol}: ${response.status}`);
        return null;
      }
      
      const data = await response.json();
      
      if (!data.results || data.results.length === 0) {
        return null;
      }
      
      const quote = data.results[0];
      const price = quote.c; // Close price
      const open = quote.o;
      const change = price - open;
      const changePercent = (change / open) * 100;
      
      return {
        symbol: symbol,
        price: price,
        change: change,
        changePercent: changePercent,
        volume: quote.v,
        high: quote.h,
        low: quote.l,
        open: open,
        prevClose: open, // Previous day's close
        fiftyTwoWeekHigh: null, // Not available in free tier
        fiftyTwoWeekLow: null,
      };
    });

    const results = await Promise.all(promises);
    const stocks = results.filter(r => r !== null);

    if (stocks.length === 0) {
      throw new Error('No valid stock data received');
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(stocks);
  } catch (error) {
    console.error('Polygon API error:', error);
    
    if (error.name === 'AbortError') {
      return res.status(504).json({ error: 'Request timeout' });
    }

    res.status(500).json({
      error: 'Failed to fetch stock data',
      details: error.message
    });
  }
}
