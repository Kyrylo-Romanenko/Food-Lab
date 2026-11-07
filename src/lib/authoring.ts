import { execFileSync } from "node:child_process";
import {
  categories,
  difficulties,
  statuses,
  units,
  catalogSchema,
} from "../schemas/recipe";
import catalog from "../content/ingredients.json";
export function contextBuild(): string {
  try {
    const revision = execFileSync("git", ["rev-parse", "HEAD"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    const dirty = execFileSync("git", ["status", "--porcelain"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    return `${revision}${dirty ? "-dirty" : ""}`;
  } catch {
    return "unknown";
  }
}
export function buildContextPack(
  source: string,
  revision = contextBuild(),
): string {
  const inserts: Record<string, string> = {
    METADATA: `Contract: recipe-authoring\nContract version: 1\nContext build: ${revision}\nCapabilities: recipe-create, recipe-update, ingredient-propose`,
    ENUMS: `Categories: ${categories.join(", ")}.\n\nDifficulties: ${difficulties.join(", ")}.\n\nStatuses: ${statuses.join(", ")}.\n\nUnits: ${units.join(", ")}.`,
    CATALOG: catalogSchema
      .parse(catalog)
      .map((i) => `- ${i.id}: ${i.name}`)
      .join("\n"),
  };
  const result = source.replace(
    /@@([A-Z_]+)@@/g,
    (marker, key: string) => inserts[key] ?? marker,
  );
  if (/@@[A-Z_]+@@/.test(result))
    throw new Error("Unresolved Context Pack insertion marker");
  return result;
}
