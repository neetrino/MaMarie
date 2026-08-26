import { describe, it, expect } from "vitest";
import { extractMediaUrl } from "./extractMediaUrl";

describe("extractMediaUrl", () => {
  it("returns null for null or undefined", () => {
    expect(extractMediaUrl(null)).toBe(null);
    expect(extractMediaUrl(undefined)).toBe(null);
  });

  it("returns null for non-array", () => {
    expect(extractMediaUrl("")).toBe(null);
    expect(extractMediaUrl({})).toBe(null);
    expect(extractMediaUrl(0)).toBe(null);
  });

  it("returns null for empty array", () => {
    expect(extractMediaUrl([])).toBe(null);
  });

  it("returns first element when it is a valid URL string", () => {
    expect(extractMediaUrl(["https://example.com/img.jpg"])).toBe("https://example.com/img.jpg");
  });

  it('rewrites data URLs when productId is provided', () => {
    const dataUrl = 'data:image/png;base64,abc';
    expect(extractMediaUrl([dataUrl], 'prod_1')).toBe(
      '/api/v1/products/media/prod_1/0/image',
    );
  });

  it("returns url when first element is object with url", () => {
    expect(extractMediaUrl([{ url: "https://cdn.example/1.jpg" }])).toBe("https://cdn.example/1.jpg");
  });

  it("returns src when first element is object with src", () => {
    expect(extractMediaUrl([{ src: "https://cdn.example/2.jpg" }])).toBe("https://cdn.example/2.jpg");
  });

  it("prefers url over src when both present", () => {
    expect(extractMediaUrl([{ url: "/u.jpg", src: "/s.jpg" }])).toBe("/u.jpg");
  });

  it("returns null when first element has no url/src string", () => {
    expect(extractMediaUrl([{}])).toBe(null);
    expect(extractMediaUrl([{ url: 123 }])).toBe(null);
    expect(extractMediaUrl([{ src: null }])).toBe(null);
  });
});
