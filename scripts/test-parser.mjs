#!/usr/bin/env node

import { readFileSync } from "fs";

const fileContent = readFileSync("Riftbound Core Rules v.1.2.txt", "utf-8");
const lines = fileContent.split("\n").slice(0, 30);

lines.forEach((line, i) => {
  const trimmed = line.trim();
  const hasRulePattern = /^\d{3}\./.test(trimmed);
  const level = detectRuleLevel(trimmed);
  console.log(`${i + 1}: ${JSON.stringify(trimmed.substring(0, 60))} | Level: ${level} | Has pattern: ${hasRulePattern}`);
});

function detectRuleLevel(line) {
  const trimmed = line.trim();
  
  // Section: 000., 100., 200., etc. (exactly 3 digits)
  if (/^\d{3}\.\s/.test(trimmed)) {
    const match = trimmed.match(/^(\d{3})\.\s/);
    if (match) {
      const afterDot = trimmed.substring(match[0].length);
      // If next char is a digit, it's level 1 (e.g., "103.1")
      if (/^\d/.test(afterDot)) {
        return 1;
      }
      return 0; // Top-level section
    }
  }
  
  // Rule: 103.1., 103.2., etc.
  if (/^\d{3}\.\d+\.\s/.test(trimmed)) {
    // Check if it has letter after (103.1.a.)
    if (/^\d{3}\.\d+\.[a-z]\.\s/.test(trimmed)) {
      // Check if it has number after (103.1.a.1.)
      if (/^\d{3}\.\d+\.[a-z]\.\d+\.\s/.test(trimmed)) {
        return 3; // 103.1.a.1. - sub-detail
      }
      return 2; // 103.1.a. - detail
    }
    return 1; // 103.1. - rule
  }
  
  return -1;
}
