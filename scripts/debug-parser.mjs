#!/usr/bin/env node

import { readFileSync } from "fs";

const fileContent = readFileSync("Riftbound Core Rules v.1.2.txt", "utf-8");
const lines = fileContent.split("\n");

console.log(`Total lines: ${lines.length}`);
console.log(`First 20 lines:`);
lines.slice(0, 20).forEach((line, i) => {
  const trimmed = line.trim();
  const hasPattern = /^\d{3}\.\s/.test(trimmed);
  console.log(`${i + 1}: ${JSON.stringify(trimmed.substring(0, 50))} | Has pattern: ${hasPattern}`);
  
  // Test specific patterns
  if (trimmed) {
    const test1 = /^\d{3}\.\s/.test(trimmed);
    const test2 = /^(\d{3})\.\s/.test(trimmed);
    if (test1 || test2) {
      const match = trimmed.match(/^(\d{3})\.\s/);
      console.log(`  -> Match: ${match ? match[1] : 'none'}`);
    }
  }
});
