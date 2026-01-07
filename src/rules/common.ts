import type { FixRule } from '../types';

export const commonRules: FixRule[] = [
  {
    name: 'remove-trailing-semicolons',
    description: 'Remove unnecessary trailing semicolons',
    apply: (code: string) => {
      const fixed = code.replace(/[;；]\s*$/gm, '');
      return {
        code: fixed,
        modified: fixed !== code,
      };
    },
  },

  {
    name: 'fix-chinese-parentheses',
    description: 'Replace Chinese parentheses with English ones',
    apply: (code: string) => {
      const fixed = code
        .replace(/（/g, '(')
        .replace(/）/g, ')');
      return {
        code: fixed,
        modified: fixed !== code,
      };
    },
  },

  {
    name: 'fix-arrow-syntax',
    description: 'Fix invalid arrow syntax',
    apply: (code: string) => {
      const fixed = code.replace(
        /--([^>-]+)-->/g,
        (match, label) => `-->|${label.trim()}|`
      );
      return {
        code: fixed,
        modified: fixed !== code,
      };
    },
  },

  {
    name: 'add-graph-declaration',
    description: 'Add missing graph type declaration',
    apply: (code: string) => {
      const trimmed = code.trim();
      const hasDeclaration = /^(graph|flowchart|sequenceDiagram|classDiagram|stateDiagram|erDiagram|journey|gantt|pie|gitGraph)/i.test(trimmed);
      
      if (!hasDeclaration) {
        return {
          code: `graph TD\n${trimmed}`,
          modified: true,
        };
      }
      
      return { code, modified: false };
    },
  },
];

