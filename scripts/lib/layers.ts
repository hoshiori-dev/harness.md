// The harness layers, named exactly as the HARNESS.md sections that describe
// them (spec/spec.md section 5.1), in build order. Every layer builder skill
// is `skills/<lowercase layer>-building/` and claims its layer in its
// description with the ownership phrase; the workflow skills route by that
// phrase, so this list is the single source of truth for both sides
// (`just skills-check`).

export const LAYERS = [
  "Environment",
  "Knowledge",
  "Feedback",
  "Gates",
  "Authority",
  "Completion",
  "Entropy",
] as const;

export type Layer = (typeof LAYERS)[number];

/** The sentence a layer builder's description must carry. */
export function ownershipPhrase(layer: Layer | string): string {
  return `Owns the ${layer} layer`;
}

/** The directory name of the builder skill for a layer. */
export function builderName(layer: Layer): string {
  return `${layer.toLowerCase()}-building`;
}
