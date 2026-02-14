// Alpha Vantage API - Free tier: 25 requests/day (very limited but no credit card)
// Sign up: https://www.alphavantage.co/support/#api-key

export default async function handler(req, res) {
  const symbols = req.query.symbols || 'AAPL,MSFT,GOOGL,AMZN,META,TSLA,NVDA';
  const symbolList = symbols.split(',').filter(s => s.trim()).slice(0, 10); // Limit to 10 to save API calls

  const apiKey = process.env.ALPHAVANTAGE_API_KEY || 'demo';

  try {
    // Batch quote endpoint (more efficient)
    const url = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${symbolList.join(',')}&apikey=${apiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`Alpha Vantage API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data['Error Message']) {
      throw new Error(data['Error Message']);
    }
    
    if (data.Note) {
      // Rate limit hit
      return res.status(429).json({ 
        error: 'Rate limit exceeded', 
        details: 'Alpha Vantage free tier: 25 requests/day' 
      });
    }
    
    const quotes = data['Stock Quotes'] || [];
    
    const stocks = quotes.map(q => {
      const price = parseFloat(q['2. price']);
      const prevClose = parseFloat(q['8. previous close']);
      const change = price - prevClose;
      const changePercent = (change / prevClose) * 100;
      
      return {
        symbol: q['1. symbol'],
        price: price,
        change: change,
        changePercent: changePercent,
        volume: parseInt(q['5. volume']),
        high: null,
        low: null,
        open: null,
        prevClose: prevClose,
        fiftyTwoWeekHigh: null,
        fiftyTwoWeekLow: null,
      };
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
    res.status(200).json(stocks);
  } catch (error) {
    console.error('Alpha Vantage API error:', error);
    res.status(500).json({
      error: 'Failed to fetch stock data',
      details: error.message
    });
  }
}
