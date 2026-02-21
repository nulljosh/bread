import { useState, useEffect, useCallback } from 'react';

const POLL_INTERVAL = 30_000;

export function useBroker() {
  const [positions, setPositions] = useState([]);
  const [account, setAccount] = useState(null);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPositions = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/broker/positions');
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const data = await r.json();
      setPositions(data.positions || []);
      setAccount(data.account || null);
      setConfigured(data.configured ?? false);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [fetchPositions]);

  return { positions, account, configured, loading, error, refetch: fetchPositions };
}
