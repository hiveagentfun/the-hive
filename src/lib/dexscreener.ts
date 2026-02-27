import { MAIN_TOKEN_CA } from "./constants";

const FETCH_TIMEOUT = 8000;

export async function getMarketCap(): Promise<number | null> {
  if (!MAIN_TOKEN_CA) return null;
  try {
    const res = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${MAIN_TOKEN_CA}`,
      { signal: AbortSignal.timeout(FETCH_TIMEOUT) }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pair = data.pairs?.[0];
    if (!pair) return null;
    return pair.marketCap ?? pair.fdv ?? null;
  } catch {
    return null;
  }
}
