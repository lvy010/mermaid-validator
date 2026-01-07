import { MermaidValidator } from './validator';
import { commonRules } from './rules/common';
import type { FixResult, ValidatorOptions, FixRule } from './types';

export class MermaidFixer {
  private validator: MermaidValidator;
  private rules: FixRule[];

  constructor(options?: ValidatorOptions) {
    this.validator = new MermaidValidator();
    this.rules = [...commonRules, ...(options?.customRules || [])];
  }

  async fix(code: string, options?: ValidatorOptions): Promise<FixResult> {
    const maxAttempts = options?.maxAttempts ?? 3;
    const fixes: string[] = [];
    let currentCode = code;
    let attempt = 0;

    for (attempt = 1; attempt <= maxAttempts; attempt++) {
      const { fixedCode, appliedFixes } = this.applyRules(currentCode);
      fixes.push(...appliedFixes);

      const validation = await this.validator.validate(fixedCode);

      if (validation.valid) {
        return {
          valid: true,
          code: fixedCode,
          originalCode: code,
          fixes,
          attempts: attempt,
        };
      }

      currentCode = fixedCode;
    }

    return {
      valid: false,
      code: currentCode,
      originalCode: code,
      fixes,
      attempts: maxAttempts,
      error: 'Failed to fix after maximum attempts',
    };
  }

  private applyRules(code: string): {
    fixedCode: string;
    appliedFixes: string[];
  } {
    let fixedCode = code;
    const appliedFixes: string[] = [];

    for (const rule of this.rules) {
      const result = rule.apply(fixedCode);
      
      if (result.modified) {
        fixedCode = result.code;
        appliedFixes.push(rule.name);
      }
    }

    return { fixedCode, appliedFixes };
  }
}

