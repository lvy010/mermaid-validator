export interface MermaidBlock {
  code: string;
  startIndex: number;
  endIndex: number;
}

export function extractMermaidBlocks(markdown: string): MermaidBlock[] {
  const regex = /```mermaid\n([\s\S]*?)```/g;
  const blocks: MermaidBlock[] = [];
  let match;

  while ((match = regex.exec(markdown)) !== null) {
    blocks.push({
      code: match[1],
      startIndex: match.index,
      endIndex: match.index + match[0].length,
    });
  }

  return blocks;
}

export function replaceMermaidBlocks(
  markdown: string,
  fixedCodes: string[]
): string {
  const blocks = extractMermaidBlocks(markdown);
  let result = markdown;
  let offset = 0;

  blocks.forEach((block, index) => {
    const original = markdown.substring(block.startIndex, block.endIndex);
    const replacement = `\`\`\`mermaid\n${fixedCodes[index]}\`\`\``;
    const lengthDiff = replacement.length - original.length;

    result =
      result.substring(0, block.startIndex + offset) +
      replacement +
      result.substring(block.endIndex + offset);

    offset += lengthDiff;
  });

  return result;
}

