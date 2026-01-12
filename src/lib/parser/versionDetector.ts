/**
 * Version Detector for Riftbound Rules
 * Detects changes between rule versions
 */

import * as fs from "fs";
import type { RulesData, VersionDiff } from "../../types/index.js";

/**
 * Compares two RulesData objects and returns a diff
 */
export function compareVersions(
  oldData: RulesData,
  newData: RulesData,
): VersionDiff {
  const added: string[] = [];
  const modified: string[] = [];
  const removed: string[] = [];

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

  // Find modified rules (rules that exist in both but content changed)
  for (const newRule of newData.sections) {
    if (oldIds.has(newRule.id)) {
      const oldRule = oldData.index[newRule.id];
      if (oldRule) {
        // Compare content and cross-refs
        if (
          oldRule.content !== newRule.content ||
          oldRule.title !== newRule.title ||
          JSON.stringify(oldRule.crossRefs) !==
            JSON.stringify(newRule.crossRefs)
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

/**
 * Loads a rules data file from a path
 */
export function loadRulesData(filePath: string): RulesData {
  const content = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(content) as RulesData;
}

/**
 * Detects changes between two rule files
 */
export function detectChanges(
  oldFilePath: string,
  newFilePath: string,
): VersionDiff {
  const oldData = loadRulesData(oldFilePath);
  const newData = loadRulesData(newFilePath);
  return compareVersions(oldData, newData);
}

/**
 * Extracts version from filename or data
 */
export function extractVersion(filePath: string, data?: RulesData): string {
  if (data?.version) {
    return data.version;
  }
  const match = filePath.match(/v\.?(\d+\.\d+)/);
  return match ? match[1] : "unknown";
}
