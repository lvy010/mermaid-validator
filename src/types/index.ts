export interface ValidatorOptions {
  maxAttempts?: number;
  timeout?: number;
  customRules?: FixRule[];
}

export interface ValidateResult {
  valid: boolean;
  error?: string;
  rawError?: string;
}

export interface FixResult {
  valid: boolean;
  code: string;
  originalCode: string;
  fixes: string[];
  attempts: number;
  error?: string;
  duration?: number;
}

export interface FixRule {
  name: string;
  description: string;
  apply: (code: string) => {
    code: string;
    modified: boolean;
  };
  priority?: number;
}

