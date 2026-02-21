// 1日あたりのAPI呼び出し回数を制限するレートリミッター
const DAILY_LIMIT = 2;

interface RateLimitState {
  count: number;
  resetDate: string;
}

// インメモリでリクエスト数を管理
let state: RateLimitState = {
  count: 0,
  resetDate: getTodayString(),
};

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function checkRateLimit(): { allowed: boolean; remaining: number } {
  const today = getTodayString();

  // 日付が変わったらリセット
  if (state.resetDate !== today) {
    state = { count: 0, resetDate: today };
  }

  if (state.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: DAILY_LIMIT - state.count };
}

export function incrementRateLimit(): void {
  const today = getTodayString();

  if (state.resetDate !== today) {
    state = { count: 0, resetDate: today };
  }

  state.count++;
}
