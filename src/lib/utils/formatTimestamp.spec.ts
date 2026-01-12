/**
 * Tests for formatTimestamp utility function
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatTimestamp } from "./formatTimestamp";

describe("formatTimestamp", () => {
  const mockNow = 1704067200000; // 2024-01-01 00:00:00 UTC

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return "Just now" for recent timestamps', () => {
    const timestamp = mockNow - 30 * 1000; // 30 seconds ago
    expect(formatTimestamp(timestamp)).toBe("Just now");
  });

  it('should return "1 minute ago" for 1 minute', () => {
    const timestamp = mockNow - 60 * 1000; // 1 minute ago
    expect(formatTimestamp(timestamp)).toBe("1 minute ago");
  });

  it("should return minutes for multiple minutes", () => {
    const timestamp = mockNow - 5 * 60 * 1000; // 5 minutes ago
    expect(formatTimestamp(timestamp)).toBe("5 minutes ago");
  });

  it('should return "1 hour ago" for 1 hour', () => {
    const timestamp = mockNow - 60 * 60 * 1000; // 1 hour ago
    expect(formatTimestamp(timestamp)).toBe("1 hour ago");
  });

  it("should return hours for multiple hours", () => {
    const timestamp = mockNow - 3 * 60 * 60 * 1000; // 3 hours ago
    expect(formatTimestamp(timestamp)).toBe("3 hours ago");
  });

  it('should return "1 day ago" for 1 day', () => {
    const timestamp = mockNow - 24 * 60 * 60 * 1000; // 1 day ago
    expect(formatTimestamp(timestamp)).toBe("1 day ago");
  });

  it("should return days for multiple days", () => {
    const timestamp = mockNow - 4 * 24 * 60 * 60 * 1000; // 4 days ago
    expect(formatTimestamp(timestamp)).toBe("4 days ago");
  });

  it('should return "1 week ago" for 7 days', () => {
    const timestamp = mockNow - 7 * 24 * 60 * 60 * 1000; // 7 days ago
    expect(formatTimestamp(timestamp)).toBe("1 week ago");
  });

  it("should return weeks for multiple weeks", () => {
    const timestamp = mockNow - 14 * 24 * 60 * 60 * 1000; // 2 weeks ago
    expect(formatTimestamp(timestamp)).toBe("2 weeks ago");
  });

  it('should return "1 month ago" for ~30 days', () => {
    const timestamp = mockNow - 30 * 24 * 60 * 60 * 1000; // 30 days ago
    expect(formatTimestamp(timestamp)).toBe("1 month ago");
  });

  it("should return months for multiple months", () => {
    const timestamp = mockNow - 90 * 24 * 60 * 60 * 1000; // ~3 months ago
    expect(formatTimestamp(timestamp)).toBe("3 months ago");
  });

  it('should return "1 year ago" for ~365 days', () => {
    const timestamp = mockNow - 365 * 24 * 60 * 60 * 1000; // 1 year ago
    expect(formatTimestamp(timestamp)).toBe("1 year ago");
  });

  it("should return years for multiple years", () => {
    const timestamp = mockNow - 730 * 24 * 60 * 60 * 1000; // 2 years ago
    expect(formatTimestamp(timestamp)).toBe("2 years ago");
  });

  it("should handle edge case at 59 seconds", () => {
    const timestamp = mockNow - 59 * 1000; // 59 seconds ago
    expect(formatTimestamp(timestamp)).toBe("Just now");
  });

  it("should handle edge case at 60 seconds", () => {
    const timestamp = mockNow - 60 * 1000; // 60 seconds ago
    expect(formatTimestamp(timestamp)).toBe("1 minute ago");
  });

  it("should handle future timestamps gracefully", () => {
    const timestamp = mockNow + 60 * 1000; // 1 minute in the future
    expect(formatTimestamp(timestamp)).toBe("Just now");
  });
});
