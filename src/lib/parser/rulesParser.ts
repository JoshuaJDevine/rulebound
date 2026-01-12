/**
 * Parser for Riftbound Core Rules TXT file
 * Converts flat TXT structure into hierarchical JSON
 */

import * as fs from "fs";
import type { RuleSection, RulesData } from "../../types/index.js";

/**
 * Detects the hierarchy level of a rule line
 * Returns: 0=section, 1=rule, 2=detail, 3=sub-detail, etc.
 */
export function detectRuleLevel(line: string): number {
  const trimmed = line.trim();

  // Section: 000., 100., 200., etc. (exactly 3 digits)
  if (/^\d{3}\.\s/.test(trimmed)) {
    // Check if it's NOT followed by more numbers (i.e., not 103.1)
    const match = trimmed.match(/^(\d{3})\.\s/);
    if (match) {
      // Check if next part is a number - if so, it's level 1
      const rest = trimmed.substring(match[0].length);
      if (/^\d/.test(rest)) {
        return 1; // It's like "103.1" - level 1
      }
      // Check if it's a letter - if so, it's level 2
      if (/^[a-z]/.test(rest)) {
        return 2; // It's like "103.a" - level 2 (but this pattern doesn't exist in the file)
      }
      return 0; // Top-level section
    }
  }

  // Rule: 103.1., 103.2., etc. (3 digits + . + number + .)
  if (/^\d{3}\.\d+\.\s/.test(trimmed)) {
    // Check if it has more parts
    const match = trimmed.match(/^(\d{3}\.\d+)\.[a-z]\.\s/);
    if (match) {
      return 2; // 103.1.a. - detail level
    }
    return 1; // 103.1. - rule level
  }

  // Detail: 103.1.a., 103.1.b., etc.
  if (/^\d{3}\.\d+\.[a-z]\.\s/.test(trimmed)) {
    // Check if it has number after
    const match = trimmed.match(/^(\d{3}\.\d+\.[a-z])\.\d+\.\s/);
    if (match) {
      return 3; // 103.1.a.1. - sub-detail
    }
    return 2; // 103.1.a. - detail
  }

  // Sub-detail: 103.1.b.1., 103.1.b.2., etc.
  if (/^\d{3}\.\d+\.[a-z]\.\d+\.\s/.test(trimmed)) {
    // Check if it has letter after
    const match = trimmed.match(/^(\d{3}\.\d+\.[a-z]\.\d+)\.[a-z]\.\s/);
    if (match) {
      return 4; // 103.1.b.1.a. - deeper
    }
    return 3; // 103.1.b.1. - sub-detail
  }

  // Even deeper: 103.1.b.1.a., etc.
  if (/^\d{3}\.\d+\.[a-z]\.\d+\.[a-z]\.\s/.test(trimmed)) {
    return 4;
  }

  return -1; // Not a rule line
}

/**
 * Extracts the rule number from a line (e.g., "103.1.b.2" from "103.1.b.2. Text")
 */
export function extractRuleNumber(line: string): string | null {
  const trimmed = line.trim();
  // Match: 3 digits, optionally followed by .number, .letter, .number, .letter, .number
  const match = trimmed.match(
    /^(\d{3}(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?)\.\s/,
  );
  if (match) {
    return match[1];
  }
  return null;
}

/**
 * Extracts the title/content from a rule line (everything after the number)
 */
export function extractRuleContent(line: string): string {
  const trimmed = line.trim();
  // Remove the rule number prefix
  const match = trimmed.match(
    /^\d{3}(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?\.\s(.+)$/,
  );
  if (match) {
    return match[1].trim();
  }
  return trimmed;
}

/**
 * Extracts cross-references from content (e.g., "See rule 346. Playing Cards")
 */
export function extractCrossReferences(content: string): string[] {
  const crossRefs: string[] = [];
  // Pattern: "See rule 346." or "See rule 346. Playing Cards" or just "rule 346."
  const pattern =
    /(?:See\s+)?rule\s+(\d{3}(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?(?:\.[a-z])?(?:\.\d+)?)\./gi;

  let match;
  while ((match = pattern.exec(content)) !== null) {
    const refId = match[1];
    if (!crossRefs.includes(refId)) {
      crossRefs.push(refId);
    }
  }

  return crossRefs;
}

/**
 * Finds the parent ID for a given rule number based on hierarchy
 */
export function findParentId(
  ruleNumber: string,
  numberToId: Map<string, string>,
): string | undefined {
  const parts = ruleNumber.split(".");

  // Remove last segment and try to find parent
  for (let i = parts.length - 1; i >= 1; i--) {
    const parentNumber = parts.slice(0, i).join(".");
    if (numberToId.has(parentNumber)) {
      return numberToId.get(parentNumber);
    }
  }

  return undefined;
}

/**
 * Parses a Riftbound Core Rules TXT file into structured JSON
 */
export function parseRulesFile(filePath: string): RulesData {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");

  // Extract version from first lines
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

  const rules: RuleSection[] = [];
  const numberToId = new Map<string, string>(); // Maps "103.1.b" to ID

  let currentRule: Partial<RuleSection> | null = null;
  let currentContent: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip empty lines
    if (!line) {
      if (currentRule && currentContent.length > 0) {
        // Add empty line to content for formatting
        currentContent.push("");
      }
      continue;
    }

    // Skip header lines
    if (
      i < 3 &&
      (line.startsWith("Riftbound Core Rules") ||
        line.startsWith("Last Updated"))
    ) {
      continue;
    }

    const level = detectRuleLevel(line);

    if (level >= 0) {
      // Save previous rule if exists
      if (currentRule && currentRule.number) {
        const fullContent = currentContent.join("\n").trim();
        currentRule.content = fullContent;
        currentRule.crossRefs = extractCrossReferences(fullContent);
        rules.push(currentRule as RuleSection);
      }

      // Start new rule
      const ruleNumber = extractRuleNumber(line);
      if (!ruleNumber) {
        continue;
      }

      const id = ruleNumber; // Use rule number as ID
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
      // Continuation line - append to current content
      if (currentRule) {
        currentContent.push(line);
      }
    }
  }

  // Save last rule
  if (currentRule && currentRule.number) {
    const fullContent = currentContent.join("\n").trim();
    currentRule.content = fullContent;
    currentRule.crossRefs = extractCrossReferences(fullContent);
    rules.push(currentRule as RuleSection);
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

  // Create index for fast lookup
  const index: Record<string, RuleSection> = {};
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

/**
 * Builds hierarchy relationships between rules
 */
export function buildHierarchy(flatRules: RuleSection[]): RuleSection[] {
  // Hierarchy is already built in parseRulesFile
  return flatRules;
}
