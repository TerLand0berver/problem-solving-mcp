#!/usr/bin/env node

import { ProblemSolvingServer } from './server.js';

async function main() {
  const server = new ProblemSolvingServer();
  await server.run();
}

main().catch((error) => {
  console.error('服务器启动失败:', error);
  process.exit(1);
}); 