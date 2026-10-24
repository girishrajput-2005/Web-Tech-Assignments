// ─── Layout Constants ─────────────────────────────────────────────────────
export const NODE_WIDTH = 200;
export const ROW_HEIGHT = 22;
export const HEADER_PADDING = 8;
export const MIN_SECTION_H = 30;

// ─── Node Height Calculation ─────────────────────────────────────────────
export function calcNodeHeight(cls) {
  const hasStereotype = cls.stereotype && cls.stereotype !== "class";
  const headerH = hasStereotype ? 58 : 38;
  const fieldsH = Math.max(MIN_SECTION_H, cls.fields.length * ROW_HEIGHT + HEADER_PADDING * 2);
  const methodsH = Math.max(MIN_SECTION_H, cls.methods.length * ROW_HEIGHT + HEADER_PADDING * 2);
  return { headerH, fieldsH, methodsH, total: headerH + fieldsH + methodsH };
}

// ─── Anchor Points ───────────────────────────────────────────────────────
export function getAnchors(cls) {
  const { x, y } = cls.position;
  const w = NODE_WIDTH;
  const { total } = calcNodeHeight(cls);
  return {
    top:    { x: x + w / 2, y },
    right:  { x: x + w,     y: y + total / 2 },
    bottom: { x: x + w / 2, y: y + total },
    left:   { x,            y: y + total / 2 },
  };
}

export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function nearestAnchor(cls, point) {
  const anchors = getAnchors(cls);
  let best = null, bestDist = Infinity;
  for (const [side, anchor] of Object.entries(anchors)) {
    const d = dist(anchor, point);
    if (d < bestDist) { bestDist = d; best = { side, ...anchor }; }
  }
  return best;
}

export function getBestAnchors(srcCls, tgtCls) {
  const srcAnchors = getAnchors(srcCls);
  const tgtAnchors = getAnchors(tgtCls);
  let best = null, bestDist = Infinity;
  for (const s of Object.values(srcAnchors)) {
    for (const t of Object.values(tgtAnchors)) {
      const d = dist(s, t);
      if (d < bestDist) { bestDist = d; best = { s, t }; }
    }
  }
  return best;
}

export function buildPath(s, t) {
  const mx = (s.x + t.x) / 2;
  return `M ${s.x} ${s.y} C ${mx} ${s.y}, ${mx} ${t.y}, ${t.x} ${t.y}`;
}

export const VISIBILITY_SYMBOL = {
  public: "+", private: "-", protected: "#", package: "~",
};

export function stereotypeLabel(s) {
  if (!s || s === "class") return null;
  return `\u00ab${s}\u00bb`;
}
