import type { FixResult } from '../types';

export interface MetricsStats {
  totalAttempts: number;
  successCount: number;
  failureCount: number;
  fixSuccessRate: number;
}

export class MetricsCollector {
  private attempts: FixResult[] = [];

  recordAttempt(result: FixResult) {
    this.attempts.push(result);
  }

  getStats(): MetricsStats {
    const totalAttempts = this.attempts.length;
    const successCount = this.attempts.filter(a => a.valid).length;
    const failureCount = this.attempts.filter(a => !a.valid).length;

    return {
      totalAttempts,
      successCount,
      failureCount,
      fixSuccessRate: totalAttempts > 0 ? successCount / totalAttempts : 0,
    };
  }
}

