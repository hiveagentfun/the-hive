export const WALLET_ADDRESS = process.env.NEXT_PUBLIC_WALLET_ADDRESS || "";

export const PUMP_FUN_PROGRAM_ID = "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P";

export const MAIN_TOKEN_CA = (process.env.NEXT_PUBLIC_MAIN_TOKEN_CA || "").trim();

export const TWITTER_HANDLE = process.env.NEXT_PUBLIC_TWITTER_HANDLE || "";

export const URLS = {
  solscan: (sig: string) => `https://solscan.io/tx/${sig}`,
  solscanAccount: (addr: string) => `https://solscan.io/account/${addr}`,
  solanaFm: (addr: string) => `https://solana.fm/address/${addr}`,
  pumpFun: (mint: string) => `https://pump.fun/coin/${mint}`,
  dexscreener: (mint: string) =>
    `https://dexscreener.com/solana/${mint}`,
  twitter: (handle: string) => `https://x.com/${handle}`,
};
