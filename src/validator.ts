import { JSDOM } from 'jsdom';
import type { ValidateResult } from './types';

export class MermaidValidator {
  private initialized = false;

  constructor(private options?: { timeout?: number }) {
    this.setupEnvironment();
  }

  private setupEnvironment() {
    if (typeof window === 'undefined') {
      const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
      
      (global as any).window = dom.window;
      (global as any).document = dom.window.document;
      (global as any).navigator = dom.window.navigator;
    }
  }

  private async initialize() {
    if (this.initialized) return;

    try {
      const mermaid = await import('mermaid');
      await mermaid.default.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      });
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Mermaid:', error);
      throw error;
    }
  }

  async validate(code: string): Promise<ValidateResult> {
    await this.initialize();

    try {
      const trimmedCode = code.trim();
      const mermaid = await import('mermaid');
      
      const parser = mermaid.default.parse || (mermaid as any).parse;
      
      if (typeof parser !== 'function') {
        throw new Error('Mermaid parser not available');
      }

      await Promise.race([
        parser(trimmedCode),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error('Validation timeout')),
            this.options?.timeout ?? 5000
          )
        ),
      ]);

      return { valid: true };
    } catch (error) {
      const errorMessage = (error as Error).message;
      
      return {
        valid: false,
        error: this.parseError(errorMessage),
        rawError: errorMessage,
      };
    }
  }

  private parseError(errorMessage: string): string {
    return errorMessage
      .replace(/^Syntax error in text\s*/i, '')
      .replace(/^Parse error\s*/i, '')
      .replace(/Line:\s*\d+,?\s*/g, '')
      .trim();
  }
}

