// Receives sim signal, places Alpaca paper order
// POST { symbol, qty, side, type?, time_in_force? }
const BASE = process.env.ALPACA_BASE_URL || 'https://paper-api.alpaca.markets';

function alpacaHeaders() {
  return {
    'APCA-API-KEY-ID': process.env.ALPACA_API_KEY || '',
    'APCA-API-SECRET-KEY': process.env.ALPACA_API_SECRET || '',
    'Content-Type': 'application/json',
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { symbol, qty, side, type = 'market', time_in_force = 'day' } = req.body || {};
  if (!symbol || !qty || !side) return res.status(400).json({ error: 'Missing: symbol, qty, side' });
  if (!['buy', 'sell'].includes(side)) return res.status(400).json({ error: 'side must be buy or sell' });

  if (!process.env.ALPACA_API_KEY) {
    return res.status(503).json({ error: 'Alpaca not configured — add ALPACA_API_KEY to env' });
  }

  try {
    const r = await fetch(`${BASE}/v2/orders`, {
      method: 'POST',
      headers: alpacaHeaders(),
      body: JSON.stringify({ symbol: symbol.toUpperCase(), qty: String(qty), side, type, time_in_force }),
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.message || 'Alpaca error' });
    console.log('[BROKER/SIGNAL] Order placed:', data.id, symbol, side, qty);
    return res.status(200).json({ ok: true, order: data });
  } catch (err) {
    console.error('[BROKER/SIGNAL] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
