#!/usr/bin/env node

/**
 * Parse Riftbound Rules Script
 * Parses the Riftbound Core Rules TXT file into JSON
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

function detectRuleLevel(line) {
  const trimmed = line.trim();
  if (!trimmed) return -1;
  
  // Top-level section: 000, 100, 200, etc. (round hundreds)
  if (/^(\d{3})\.\s/.test(trimmed)) {
    const match = trimmed.match(/^(\d{3})\.\s/);
    const num = parseInt(match[1]);
    if (num % 100 === 0) {
      return 0; // Section
    }
    return 1; // Rule
  }
  
  // Sub-rule: 103.1., 103.2., etc.
  if (/^\d{3}\.\d+\.\s/.test(trimmed)) {
    // Check if it has letter after (103.1.a.)
    if (/^\d{3}\.\d+\.[a-z]\.\s/.test(trimmed)) {
      // Check if it has number after (103.1.a.1.)
      if (/^\d{3}\.\d+\.[a-z]\.\d+\.\s/.test(trimmed)) {
        // Check if it has letter after (103.1.a.1.b.)
        if (/^\d{3}\.\d+\.[a-z]\.\d+\.[a-z]\.\s/.test(trimmed)) {
          return 5; // Very deep
        }
        return 4; // 103.1.a.1. - sub-detail
      }
      return 3; // 103.1.a. - detail
    }
    return 2; // 103.1. - sub-rule
  }
  
  return -1;
}

function extractRuleNumber(line) {
  const trimmed = line.trim();
  const match = trimmed.match(/^(\d{3}(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?)\.\s/);
  return match ? match[1] : null;
}

function extractRuleContent(line) {
  const trimmed = line.trim();
  const match = trimmed.match(/^\d{3}(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?\.\s(.+)$/);
  return match ? match[1].trim() : trimmed;
}

function extractCrossReferences(content) {
  const crossRefs = [];
  const pattern = /(?:See\s+)?rule\s+(\d{3}(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?)\./gi;
  
  let match;
  while ((match = pattern.exec(content)) !== null) {
    const refId = match[1];
    if (!crossRefs.includes(refId)) {
      crossRefs.push(refId);
    }
  }
  
  return crossRefs;
}

function findParentId(ruleNumber, numberToId) {
  const parts = ruleNumber.split(".");
  
  // Try progressively shorter parent numbers
  for (let i = parts.length - 1; i >= 1; i--) {
    const parentNumber = parts.slice(0, i).join(".");
    if (numberToId.has(parentNumber)) {
      return numberToId.get(parentNumber);
    }
  }
  
  // For rules like "001", "101", etc., find the section (000, 100, etc.)
  if (parts.length === 1) {
    const num = parseInt(parts[0]);
    const sectionNum = Math.floor(num / 100) * 100;
    const sectionId = sectionNum.toString().padStart(3, "0");
    if (numberToId.has(sectionId)) {
      return numberToId.get(sectionId);
    }
  }
  
  return undefined;
}

function parseRulesFile(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  const fileContent = readFileSync(filePath, "utf-8");
  if (!fileContent || fileContent.length === 0) {
    throw new Error(`File is empty: ${filePath}`);
  }
  
  const lines = fileContent.split(/\r?\n/); // Handle both LF and CRLF

  // Extract version
  let version = "1.2";
  let lastUpdated = "";
  const versionMatch = fileContent.match(/Last Updated: (.+)/);
  if (versionMatch) {
    lastUpdated = versionMatch[1].trim();
  }
  const versionMatch2 = filePath.match(/v\.?(\d+\.\d+)/);
  if (versionMatch2) {
    version = versionMatch2[1];
  }

  const rules = [];
  const numberToId = new Map();

  let currentRule = null;
  let currentContent = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip header lines
    if (i < 3 && (line.trim().startsWith("Riftbound Core Rules") || line.trim().startsWith("Last Updated"))) {
      continue;
    }

    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) {
      if (currentRule && currentContent.length > 0) {
        currentContent.push("");
      }
      continue;
    }

    const level = detectRuleLevel(line);

    if (level >= 0) {
      // Save previous rule if exists
      if (currentRule && currentRule.number) {
        const fullContent = currentContent.join("\n").trim();
        currentRule.content = fullContent;
        currentRule.crossRefs = extractCrossReferences(fullContent);
        rules.push(currentRule);
      }

      // Start new rule
      const ruleNumber = extractRuleNumber(line);
      if (!ruleNumber) {
        continue;
      }

      const id = ruleNumber;
      const content = extractRuleContent(line);
      
      // Find parent
      const parentId = findParentId(ruleNumber, numberToId);

      currentRule = {
        id,
        number: ruleNumber + ".",
        title: content.split("\n")[0] || content,
        content: "",
        level,
        parentId,
        children: [],
        crossRefs: [],
        version,
      };

      numberToId.set(ruleNumber, id);
      currentContent = [content];
    } else {
      // Continuation line
      if (currentRule) {
        currentContent.push(trimmed);
      }
    }
  }

  // Save last rule
  if (currentRule && currentRule.number) {
    const fullContent = currentContent.join("\n").trim();
    currentRule.content = fullContent;
    currentRule.crossRefs = extractCrossReferences(fullContent);
    rules.push(currentRule);
  }

  // Build hierarchy (set children)
  for (const rule of rules) {
    if (rule.parentId) {
      const parent = rules.find((r) => r.id === rule.parentId);
      if (parent) {
        parent.children.push(rule.id);
      }
    }
  }

  // Create index
  const index = {};
  for (const rule of rules) {
    index[rule.id] = rule;
  }

  return {
    version,
    lastUpdated,
    sections: rules,
    index,
  };
}

// Main execution
try {
  // Try multiple possible file names
  const possibleFiles = [
    "Riftbound Core Rules v.1.2.txt",
    "Riftbound Core Rules v1.2.txt",
    "Riftbound Core Rules.txt",
  ];
  
  let inputFile = null;
  for (const fileName of possibleFiles) {
    const testPath = resolve(projectRoot, fileName);
    if (existsSync(testPath)) {
      const stats = await import("fs").then(fs => fs.promises.stat(testPath));
      if (stats.size > 0) {
        inputFile = testPath;
        break;
      }
    }
  }
  
  if (!inputFile) {
    console.error("ERROR: Riftbound rules file not found or is empty.");
    console.error("Please ensure one of these files exists and is saved:");
    possibleFiles.forEach(f => console.error(`  - ${f}`));
    console.error("\nThe file may be open in your editor but not saved to disk.");
    console.error("Please save the file and try again.");
    process.exit(1);
  }
  
  const outputFile = resolve(projectRoot, "public/data/rules.json");

  console.log(`Parsing ${inputFile}...`);
  
  const data = parseRulesFile(inputFile);
  
  console.log(`Parsed ${data.sections.length} rules`);
  console.log(`Version: ${data.version}`);
  console.log(`Last Updated: ${data.lastUpdated}`);
  if (data.sections.length > 0) {
    console.log(`First rule: ${data.sections[0].number} ${data.sections[0].title}`);
    console.log(`Last rule: ${data.sections[data.sections.length - 1].number} ${data.sections[data.sections.length - 1].title}`);
  }
  
  // Ensure output directory exists
  const outputDir = dirname(outputFile);
  if (!existsSync(outputDir)) {
    const { mkdirSync } = await import("fs");
    mkdirSync(outputDir, { recursive: true });
  }
  
  writeFileSync(outputFile, JSON.stringify(data, null, 2), "utf-8");
  console.log(`Output written to ${outputFile}`);
} catch (error) {
  console.error("Error parsing rules:", error.message);
  console.error(error.stack);
  process.exit(1);
}
