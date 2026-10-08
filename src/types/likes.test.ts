import { describe, expect, it } from "vitest";
import { products } from "@/data/mock";
import { formatLikes, productLikes } from "./index";

describe("likes de destacados", () => {
  const p4 = products.find((p) => p.id === "p4") ?? products[0];

  it("usa la base sin favorito", () => {
    expect(productLikes(p4, [])).toBe(p4.likes);
  });

  it("el favorito suma +1 en vivo", () => {
    expect(productLikes(p4, [p4.id])).toBe(p4.likes + 1);
  });

  it("formatea en compacto", () => {
    expect(formatLikes(243)).toBe("243");
    expect(formatLikes(999)).toBe("999");
    expect(formatLikes(1000)).toBe("1k");
    expect(formatLikes(1240)).toBe("1.2k");
  });

  it("el ranking pone primero al de más likes", () => {
    const top = [...products]
      .sort((a, b) => productLikes(b, []) - productLikes(a, []))
      .slice(0, 6);
    expect(top).toHaveLength(6);
    for (let i = 1; i < top.length; i++) {
      expect(productLikes(top[i - 1], [])).toBeGreaterThanOrEqual(productLikes(top[i], []));
    }
  });
});
