import { describe, it, expect } from 'vitest';
import { fix, validate } from './index';

describe('mermaid-llm-validator', () => {
  it('should fix trailing semicolons', async () => {
    const code = `
graph TD
  A[Start] --> B[End]；
    `;
    
    const result = await fix(code);
    
    expect(result.valid).toBe(true);
    expect(result.fixes).toContain('remove-trailing-semicolons');
    expect(result.code).not.toContain('；');
  });

  it('should validate correct mermaid code', async () => {
    const code = `
graph TD
  A[Start] --> B[End]
    `;
    
    const result = await validate(code);
    
    expect(result.valid).toBe(true);
  });

  it('should add graph declaration if missing', async () => {
    const code = 'A --> B';
    
    const result = await fix(code);
    
    expect(result.code).toContain('graph TD');
  });
});

