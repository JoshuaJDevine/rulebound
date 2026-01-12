#!/usr/bin/env node

/**
 * Detect Changes Script
 * Compares two versions of parsed rules to detect changes
 */

import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

function compareVersions(oldData, newData) {
  const added = [];
  const modified = [];
  const removed = [];

  // Create sets for quick lookup
  const oldIds = new Set(oldData.sections.map((r) => r.id));
  const newIds = new Set(newData.sections.map((r) => r.id));

  // Find added rules
  for (const newRule of newData.sections) {
    if (!oldIds.has(newRule.id)) {
      added.push(newRule.id);
    }
  }

  // Find removed rules
  for (const oldRule of oldData.sections) {
    if (!newIds.has(oldRule.id)) {
      removed.push(oldRule.id);
    }
  }

  // Find modified rules
  for (const newRule of newData.sections) {
    if (oldIds.has(newRule.id)) {
      const oldRule = oldData.index[newRule.id];
      if (oldRule) {
        if (
          oldRule.content !== newRule.content ||
          oldRule.title !== newRule.title ||
          JSON.stringify(oldRule.crossRefs) !== JSON.stringify(newRule.crossRefs)
        ) {
          modified.push(newRule.id);
        }
      }
    }
  }

  return {
    oldVersion: oldData.version,
    newVersion: newData.version,
    changes: {
      added,
      modified,
      removed,
    },
  };
}

function loadRulesData(filePath) {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const content = readFileSync(filePath, "utf-8");
  return JSON.parse(content);
}

// Main execution
try {
  const currentFile = resolve(projectRoot, "public/data/rules.json");
  
  console.log("Change Detection");
  console.log("================");
  console.log(`Current file: ${currentFile}`);
  
  if (!existsSync(currentFile)) {
    console.error(`ERROR: Current rules file not found: ${currentFile}`);
    console.error("Please run 'npm run parse-rules' first to generate the rules file.");
    process.exit(1);
  }
  
  const currentData = loadRulesData(currentFile);
  console.log(`Current version: ${currentData.version}`);
  console.log(`Current rules count: ${currentData.sections.length}`);
  console.log();
  console.log("To compare with a previous version:");
  console.log("  1. Copy the current rules.json to public/data/versions/v{version}.json");
  console.log("  2. Run 'npm run parse-rules' to update rules.json");
  console.log("  3. Run 'npm run detect-changes' to see changes");
  console.log();
  console.log("Example:");
  console.log("  cp public/data/rules.json public/data/versions/v1.2.json");
  console.log("  # ... make changes ...");
  console.log("  npm run parse-rules");
  console.log("  npm run detect-changes");
  
} catch (error) {
  console.error("Error detecting changes:", error.message);
  console.error(error.stack);
  process.exit(1);
}
