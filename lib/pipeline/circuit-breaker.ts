/**
 * Circuit breaker pattern for external API calls.
 * Prevents cascading failures and wasted tokens when services are down.
 * Adapted from AEO donor — removed ElevenLabs/HeyGen, OpenAI only.
 */

// ============================================
// Types
// ============================================

export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

export interface CircuitBreakerConfig {
  name: string;
  failureThreshold: number;
  recoveryTimeout: number; // ms before trying again (half-open)
  monitorWindow: number; // ms to track failures
}

export interface CircuitBreakerStatus {
  name: string;
  state: CircuitState;
  failureCount: number;
  lastFailure: Date | null;
  lastSuccess: Date | null;
  totalFailures: number;
  totalSuccesses: number;
}

// ============================================
// Default Configs
// ============================================

export const DEFAULT_CONFIGS: Record<string, CircuitBreakerConfig> = {
  openai: {
    name: 'openai',
    failureThreshold: 3,
    recoveryTimeout: 60000, // 1 minute
    monitorWindow: 300000, // 5 minutes
  },
};

// ============================================
// Circuit Breaker Implementation
// ============================================

class CircuitBreaker {
  private config: CircuitBreakerConfig;
  private state: CircuitState = 'CLOSED';
  private failures: Date[] = [];
  private lastFailure: Date | null = null;
  private lastSuccess: Date | null = null;
  private totalFailures = 0;
  private totalSuccesses = 0;

  constructor(config: CircuitBreakerConfig) {
    this.config = config;
  }

  getStatus(): CircuitBreakerStatus {
    this.updateState();
    return {
      name: this.config.name,
      state: this.state,
      failureCount: this.getRecentFailureCount(),
      lastFailure: this.lastFailure,
      lastSuccess: this.lastSuccess,
      totalFailures: this.totalFailures,
      totalSuccesses: this.totalSuccesses,
    };
  }

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.updateState();

    if (this.state === 'OPEN') {
      throw new CircuitBreakerOpenError(
        `Circuit breaker ${this.config.name} is OPEN. Try again after ${this.getTimeUntilRecovery()}ms`
      );
    }

    try {
      const result = await operation();
      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  canAttempt(): boolean {
    this.updateState();
    return this.state !== 'OPEN';
  }

  reset(): void {
    this.state = 'CLOSED';
    this.failures = [];
    console.log(`[CircuitBreaker] ${this.config.name}: RESET to CLOSED`);
  }

  private recordSuccess(): void {
    this.lastSuccess = new Date();
    this.totalSuccesses++;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      this.failures = [];
      console.log(`[CircuitBreaker] ${this.config.name}: CLOSED (recovered)`);
    }
  }

  private recordFailure(): void {
    const now = new Date();
    this.lastFailure = now;
    this.failures.push(now);
    this.totalFailures++;
    console.log(`[CircuitBreaker] ${this.config.name}: Failure recorded (${this.getRecentFailureCount()}/${this.config.failureThreshold})`);
    this.updateState();
  }

  private updateState(): void {
    const now = Date.now();
    this.failures = this.failures.filter(
      (f) => now - f.getTime() < this.config.monitorWindow
    );
    const recentFailures = this.getRecentFailureCount();

    switch (this.state) {
      case 'CLOSED':
        if (recentFailures >= this.config.failureThreshold) {
          this.state = 'OPEN';
          console.log(`[CircuitBreaker] ${this.config.name}: OPEN (threshold reached)`);
        }
        break;
      case 'OPEN':
        if (this.lastFailure && now - this.lastFailure.getTime() >= this.config.recoveryTimeout) {
          this.state = 'HALF_OPEN';
          console.log(`[CircuitBreaker] ${this.config.name}: HALF_OPEN (testing recovery)`);
        }
        break;
      case 'HALF_OPEN':
        break;
    }
  }

  private getRecentFailureCount(): number {
    const now = Date.now();
    return this.failures.filter(
      (f) => now - f.getTime() < this.config.monitorWindow
    ).length;
  }

  private getTimeUntilRecovery(): number {
    if (this.state !== 'OPEN' || !this.lastFailure) return 0;
    const elapsed = Date.now() - this.lastFailure.getTime();
    return Math.max(0, this.config.recoveryTimeout - elapsed);
  }
}

// ============================================
// Error Class
// ============================================

export class CircuitBreakerOpenError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CircuitBreakerOpenError';
  }
}

// ============================================
// Singleton Registry
// ============================================

const circuitBreakers = new Map<string, CircuitBreaker>();

export function getCircuitBreaker(name: keyof typeof DEFAULT_CONFIGS): CircuitBreaker {
  if (!circuitBreakers.has(name)) {
    const config = DEFAULT_CONFIGS[name];
    if (!config) throw new Error(`No circuit breaker config for: ${name}`);
    circuitBreakers.set(name, new CircuitBreaker(config));
  }
  return circuitBreakers.get(name)!;
}

export async function withCircuitBreaker<T>(
  name: keyof typeof DEFAULT_CONFIGS,
  operation: () => Promise<T>
): Promise<T> {
  const breaker = getCircuitBreaker(name);
  return breaker.execute(operation);
}

export function canAttempt(name: keyof typeof DEFAULT_CONFIGS): boolean {
  const breaker = getCircuitBreaker(name);
  return breaker.canAttempt();
}

export function getAllCircuitBreakerStatus(): Record<string, CircuitBreakerStatus> {
  const status: Record<string, CircuitBreakerStatus> = {};
  for (const name of Object.keys(DEFAULT_CONFIGS)) {
    const breaker = getCircuitBreaker(name as keyof typeof DEFAULT_CONFIGS);
    status[name] = breaker.getStatus();
  }
  return status;
}

export function resetAllCircuitBreakers(): void {
  circuitBreakers.forEach((breaker) => {
    breaker.reset();
  });
}

export function formatCircuitBreakerStatus(status: Record<string, CircuitBreakerStatus>): string {
  return Object.entries(status)
    .map(([name, s]) => {
      const indicator = s.state === 'CLOSED' ? '✓' : s.state === 'OPEN' ? '✗' : '?';
      return `${name}: ${s.state} ${indicator} (${s.failureCount} recent failures)`;
    })
    .join(' | ');
}
