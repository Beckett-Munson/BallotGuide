// HSL color values for each topic — used for inline styles (backgrounds, borders, gradients)
export const TOPIC_COLORS: Record<string, { h: number; s: number; l: number }> = {
  healthcare:    { h: 155, s: 50, l: 38 },
  taxes:         { h: 42,  s: 65, l: 48 },
  environment:   { h: 215, s: 60, l: 45 },
  foreign_policy:{ h: 260, s: 45, l: 52 },
  education:     { h: 280, s: 45, l: 55 },
  housing:       { h: 25,  s: 75, l: 50 },
  jobs:          { h: 35,  s: 70, l: 45 },
  civil_rights:  { h: 340, s: 55, l: 50 },
  public_safety: { h: 0,   s: 55, l: 48 },
  transit:       { h: 185, s: 55, l: 42 },
  government:    { h: 220, s: 20, l: 40 },
  family:        { h: 320, s: 50, l: 55 },
  water:         { h: 195, s: 65, l: 45 },
  immigration:   { h: 270, s: 45, l: 50 },
  technology:    { h: 200, s: 70, l: 48 },
  office:        { h: 220, s: 15, l: 35 },
};

/** Party colors for candidate cards and race connector dots (D=blue, R=red, etc.) */
export const PARTY_COLORS: Record<string, { h: number; s: number; l: number }> = {
  D: { h: 215, s: 60, l: 45 },
  R: { h: 0, s: 55, l: 48 },
  I: { h: 270, s: 45, l: 50 },
  L: { h: 280, s: 40, l: 55 },
};

export function partyBorderColor(party: string): string {
  const color = PARTY_COLORS[party];
  return color ? hsl(color) : hsl({ h: 220, s: 15, l: 35 });
}

export function hsl(color: { h: number; s: number; l: number }) {
  return `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
}

export function hslAlpha(color: { h: number; s: number; l: number }, alpha: number) {
  return `hsla(${color.h}, ${color.s}%, ${color.l}%, ${alpha})`;
}

/** Returns a CSS background for a set of topic IDs — solid for one, gradient for multiple */
export function topicBackground(topicIds: string[], alpha = 0.15): string {
  const colors = topicIds
    .map((id) => TOPIC_COLORS[id])
    .filter(Boolean);

  if (colors.length === 0) return `hsla(220, 15%, 35%, ${alpha})`;
  if (colors.length === 1) return hslAlpha(colors[0], alpha);

  const stops = colors
    .map((c, i) => `${hslAlpha(c, alpha)} ${(i / (colors.length - 1)) * 100}%`)
    .join(", ");
  return `linear-gradient(135deg, ${stops})`;
}

/** Returns a solid HSL string for the primary topic, or blended for display */
export function topicBorderColor(topicIds: string[]): string {
  const colors = topicIds
    .map((id) => TOPIC_COLORS[id])
    .filter(Boolean);

  if (colors.length === 0) return hsl({ h: 220, s: 15, l: 35 });
  if (colors.length === 1) return hsl(colors[0]);

  // Average the hues for a blended border color
  const avgH = colors.reduce((sum, c) => sum + c.h, 0) / colors.length;
  const avgS = colors.reduce((sum, c) => sum + c.s, 0) / colors.length;
  const avgL = colors.reduce((sum, c) => sum + c.l, 0) / colors.length;
  return hsl({ h: avgH, s: avgS, l: avgL });
}
