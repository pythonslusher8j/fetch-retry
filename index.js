const DEFAULTS = {
  retries: 2,
  baseDelay: 250,
  maxDelay: 8000,
  retryOn: [408, 425, 429, 500, 502, 503, 504],
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWithRetry(url, options = {}, config = {}) {
  const cfg = { ...DEFAULTS, ...config };
  let lastError;
  for (let attempt = 0; attempt <= cfg.retries; attempt += 1) {
    try {
      const response = await fetch(url, options);
      if (!cfg.retryOn.includes(response.status) || attempt === cfg.retries) {
        return response;
      }
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === cfg.retries) throw error;
    }
    const backoff = Math.min(cfg.baseDelay * 2 ** attempt, cfg.maxDelay);
    const jitter = Math.random() * backoff * 0.3;
    await sleep(backoff + jitter);
  }
  throw lastError;
}
