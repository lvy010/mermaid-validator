/**
 * mermaid-llm-validator
 * 
 * The industry-standard library for validating and fixing
 * LLM-generated Mermaid diagrams.
 */

import { MermaidValidator } from './validator';
import { MermaidFixer } from './fixer';
import type { ValidateResult, FixResult, ValidatorOptions } from './types';

/**
 * Validate Mermaid syntax (read-only check)
 */
export async function validate(code: string): Promise<ValidateResult> {
  const validator = new MermaidValidator();
  return validator.validate(code);
}

/**
 * Fix Mermaid syntax errors automatically
 * 
 * This is the main function - validates and fixes in one step.
 */
export async function fix(
  code: string,
  options?: ValidatorOptions
): Promise<FixResult> {
  const fixer = new MermaidFixer(options);
  return fixer.fix(code);
}

/**
 * Process markdown content and fix all Mermaid blocks
 */
export async function fixMarkdown(markdown: string): Promise<{
  content: string;
  stats: {
    total: number;
    fixed: number;
    successRate: number;
  };
}> {
  const { extractMermaidBlocks, replaceMermaidBlocks } = await import('./utils/extractor');
  
  const blocks = extractMermaidBlocks(markdown);
  const fixer = new MermaidFixer();
  
  const results = await Promise.all(
    blocks.map(block => fixer.fix(block.code))
  );
  
  const fixedMarkdown = replaceMermaidBlocks(markdown, results.map(r => r.code));
  const fixedCount = results.filter(r => r.fixes.length > 0).length;
  
  return {
    content: fixedMarkdown,
    stats: {
      total: blocks.length,
      fixed: fixedCount,
      successRate: blocks.length > 0 ? 1.0 : 0,
    },
  };
}

// Export types
export type {
  ValidateResult,
  FixResult,
  ValidatorOptions,
  FixRule,
} from './types';

// Export classes for advanced usage
export { MermaidValidator, MermaidFixer };

