# 🔍 mermaid-llm-validator

[![npm version](https://img.shields.io/npm/v/mermaid-llm-validator.svg)](https://www.npmjs.com/package/mermaid-llm-validator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Automatically validate and fix LLM-generated Mermaid syntax errors. Achieve 100% correct diagrams.**

Ensure 100% correct Mermaid syntax from LLM outputs (ChatGPT, Claude, Gemini, etc.). Auto-validate and fix common syntax errors in AI-generated diagrams.

---

## ✨ Features

- 🤖 **AI-Ready**: Built specifically for LLM-generated Mermaid diagrams
- 🔧 **Auto-Fix**: Automatically corrects 4+ common syntax errors
- ✅ **Validation**: Validates syntax using official Mermaid parser
- 📝 **Markdown Support**: Batch process entire markdown files
- 🚀 **Zero Config**: Works out of the box
- 📦 **TypeScript**: Full type definitions included
- 🌐 **Universal**: Supports both CommonJS and ESM

---

## 📦 Installation

```bash
npm install mermaid-llm-validator
```

Or using yarn/pnpm:

```bash
yarn add mermaid-llm-validator
# or
pnpm add mermaid-llm-validator
```

---

## 🚀 Quick Start

### Basic Usage

```javascript
const { fix } = require('mermaid-llm-validator');

async function example() {
  // LLM-generated code with errors
  const badCode = `
graph TD
  A[Start] --> B[Process]；
  B --> C[End]（完成）
  `;
  
  const result = await fix(badCode);
  
  console.log(result.valid);     // true
  console.log(result.code);      // Fixed Mermaid code
  console.log(result.fixes);     // ["remove-trailing-semicolons", "fix-chinese-parentheses"]
}

example();
```

### ES Module

```javascript
import { fix, validate } from 'mermaid-llm-validator';

const result = await fix(mermaidCode);
```

### TypeScript

```typescript
import { fix, FixResult } from 'mermaid-llm-validator';

const result: FixResult = await fix(mermaidCode);
```

---

## 📖 API Reference

### `fix(code, options?)`

Validates and fixes Mermaid syntax errors automatically.

**Parameters:**
- `code` (string): Mermaid diagram code
- `options` (optional):
  - `maxAttempts` (number): Maximum fix attempts (default: 3)
  - `timeout` (number): Validation timeout in ms (default: 5000)
  - `customRules` (FixRule[]): Custom fix rules

**Returns:** `Promise<FixResult>`

```typescript
interface FixResult {
  valid: boolean;           // Whether the code is valid
  code: string;             // Fixed Mermaid code
  originalCode: string;     // Original input code
  fixes: string[];          // Applied fix rule names
  attempts: number;         // Number of attempts made
  error?: string;           // Error message (if failed)
}
```

**Example:**

```javascript
const result = await fix(code, { maxAttempts: 5 });
```

---

### `validate(code)`

Validates Mermaid syntax without making changes (read-only).

**Parameters:**
- `code` (string): Mermaid diagram code

**Returns:** `Promise<ValidateResult>`

```typescript
interface ValidateResult {
  valid: boolean;           // Whether the code is valid
  error?: string;           // User-friendly error message
  rawError?: string;        // Original parser error
}
```

**Example:**

```javascript
const { validate } = require('mermaid-llm-validator');

const result = await validate('graph TD\n  A --> B');
console.log(result.valid);  // true
```

---

### `fixMarkdown(markdown)`

Process markdown content and fix all Mermaid code blocks.

**Parameters:**
- `markdown` (string): Markdown content with Mermaid blocks

**Returns:** `Promise<{ content: string, stats: object }>`

**Example:**

```javascript
const { fixMarkdown } = require('mermaid-llm-validator');

const markdown = `
# My Document

\`\`\`mermaid
graph TD
  A --> B；
\`\`\`
`;

const result = await fixMarkdown(markdown);

console.log(result.content);      // Fixed markdown
console.log(result.stats.total);  // 1
console.log(result.stats.fixed);  // 1
```

---

## 🔧 Built-in Fix Rules

The library automatically fixes these common LLM errors:

| Rule | Description | Example |
|------|-------------|---------|
| **remove-trailing-semicolons** | Removes unnecessary semicolons | `A --> B;` → `A --> B` |
| **fix-chinese-parentheses** | Converts Chinese to English parentheses | `A（text）` → `A(text)` |
| **fix-arrow-syntax** | Fixes invalid arrow labels | `A --text--> B` → `A -->|text| B` |
| **add-graph-declaration** | Adds missing graph type | `A --> B` → `graph TD\n A --> B` |

---

## 🤖 AI Integration Examples

### ChatGPT / Claude / Gemini

```javascript
const { fix } = require('mermaid-llm-validator');

async function generateDiagram(userPrompt) {
  // 1. Get diagram from LLM
  const llmResponse = await callLLM(userPrompt);
  
  // 2. Extract and fix Mermaid code
  const result = await fix(llmResponse);
  
  // 3. Use the validated code
  if (result.valid) {
    return result.code;
  } else {
    console.error('Failed to fix:', result.error);
    return null;
  }
}
```

### Batch Processing

```javascript
const { fix } = require('mermaid-llm-validator');

async function processMultipleDiagrams(diagrams) {
  const results = await Promise.all(
    diagrams.map(code => fix(code))
  );
  
  const validDiagrams = results
    .filter(r => r.valid)
    .map(r => r.code);
  
  return validDiagrams;
}
```

### Custom Fix Rules

```javascript
const { fix } = require('mermaid-llm-validator');

const customRule = {
  name: 'fix-my-pattern',
  description: 'Fixes my custom pattern',
  apply: (code) => {
    const fixed = code.replace(/pattern/g, 'replacement');
    return {
      code: fixed,
      modified: fixed !== code
    };
  }
};

const result = await fix(code, {
  customRules: [customRule]
});
```

---

## 🌐 Use Cases

- **AI Chatbots**: Validate diagrams generated by ChatGPT/Claude
- **Documentation Tools**: Auto-fix Mermaid in markdown files
- **Code Generators**: Ensure generated diagrams are valid
- **CI/CD Pipelines**: Validate diagrams in pull requests
- **Content Management**: Clean up user-generated diagrams

---

## 🧪 Testing

The package includes comprehensive tests:

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

---

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/lvy010/mermaid-validator.git
cd mermaid-validator

# Install dependencies
pnpm install

# Build
pnpm build

# Test locally
node test-local.js
```

---

## 📄 License

MIT © [lvy010](https://github.com/lvy010)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Issues

Found a bug? [Open an issue](https://github.com/lvy010/mermaid-validator/issues)

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!

---

## 📚 Related Projects

- [mermaid](https://github.com/mermaid-js/mermaid) - Official Mermaid library
- [mermaid-cli](https://github.com/mermaid-js/mermaid-cli) - Command-line interface for Mermaid

---

**Made with ❤️ for the AI community**
