const { fix } = require('./dist/index.js');

async function test() {
  const code = `
graph TD
  A[Start] --> B[End]；
  `;
  
  const result = await fix(code);
  console.log('✅ Fixed:', result.code);
  console.log('🔧 Fixes:', result.fixes);
}

test();

