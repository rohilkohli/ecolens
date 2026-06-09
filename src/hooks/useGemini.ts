import { useState, useCallback } from 'react';
import type { Insight, EmissionSummary } from '../types';
import { fetchInsights } from '../services/gemini';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'rate_limited';

export function useGemini() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const loadInsights = useCallback(async (summary: EmissionSummary) => {
    setStatus('loading');
    setErrorMessage('');
    try {
      const data = await fetchInsights(summary);
      setInsights(data);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      if (message === 'rate_limited') {
        setStatus('rate_limited');
        setErrorMessage('Please wait a few seconds before refreshing insights.');
      } else {
        setStatus('error');
        setErrorMessage(message);
      }
    }
  }, []);

  return { insights, status, errorMessage, loadInsights };
}
