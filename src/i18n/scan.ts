import ts from "typescript";

/**
 * Finds every string in the shipped source that reads like English for a player.
 * Used by the coverage test, so nothing ships untranslated by accident.
 */

/** Dev-only screens and older code the game no longer uses. */
export const SKIPPED_FILES: readonly string[] = [
  "src/ui/Sandbox.tsx",
  "src/ui/CodeMinigame.tsx",
  "src/ui/WorkScreen.tsx",
  "src/ui/FriendlyTask.tsx",
  "src/ui/RoomView.tsx",
  "src/ui/DeskScene.tsx",
  "src/ui/Workstation.tsx",
  "src/game/engine.ts",
  "src/content/days.ts",
  "src/content/midDays.ts",
  "src/content/activities.ts",
  "src/content/config.ts",
  "src/content/puzzles.ts",
  "src/content/workPool.ts",
  "src/content/sceneLayout.ts",
  "src/content/sceneVideo.ts",
  "src/i18n/scan.ts",
  "src/game/sandbox.ts",
];

export type Found = {
  file: string;
  line: number;
  text: string;
  /** Set for tc(context, text): the dictionary key is "text|context". */
  context?: string;
};

/** The context of a tc(context, text) call this literal is the text of. */
function contextOf(node: ts.Node): string | undefined {
  const call = node.parent;
  if (!call || !ts.isCallExpression(call) || call.expression.getText() !== "tc") return undefined;
  const [context, text] = call.arguments;
  return text === node && context && ts.isStringLiteral(context) ? context.text : undefined;
}

/** Looks like words a player reads: a space between letters, or a capitalized word. */
function readsLikeText(text: string): boolean {
  if (!/[a-z]/.test(text)) return false;
  if (/^[\w.-]+\/[\w./-]+$/.test(text)) return false;
  if (/^[a-z][\w-]*$/.test(text)) return false;
  if (/^--|^#|^\.|^\(|^url\(|px$|%$/.test(text)) return false;
  return /[A-Za-z] [A-Za-z]/.test(text) || /^[A-Z][a-z]/.test(text);
}

const SKIP_CALLS = new Set([
  "require",
  "import",
  "querySelector",
  "getItem",
  "setItem",
  "removeItem",
  "matchMedia",
  "addEventListener",
  "removeEventListener",
]);

/** Inside a className attribute or an Error, anywhere up the expression. */
function insideClassOrError(node: ts.Node): boolean {
  for (let up: ts.Node | undefined = node.parent; up; up = up.parent) {
    if (ts.isJsxAttribute(up)) return up.name.getText() === "className" || up.name.getText() === "style";
    if (ts.isNewExpression(up) && up.expression.getText() === "Error") return true;
    if (ts.isStatement(up)) return false;
  }
  return false;
}

function isSkippedContext(node: ts.Node): boolean {
  const parent = node.parent;
  if (!parent) return false;
  if (insideClassOrError(node)) return true;
  if (ts.isImportDeclaration(parent) || ts.isExportDeclaration(parent))
    return true;
  if (ts.isLiteralTypeNode(parent)) return true;
  if (ts.isPropertyAssignment(parent) && parent.name === node) return true;
  if (
    ts.isElementAccessExpression(parent) &&
    parent.argumentExpression === node
  )
    return true;
  if (ts.isJsxAttribute(parent)) {
    const name = parent.name.getText();
    return (
      name === "className" ||
      name === "key" ||
      name === "id" ||
      name === "role" ||
      name === "type"
    );
  }
  if (ts.isCallExpression(parent)) {
    const callee = parent.expression.getText();
    if (SKIP_CALLS.has(callee.split(".").at(-1) ?? "")) return true;
  }
  if (
    ts.isBinaryExpression(parent) &&
    /[=!]==?/.test(parent.operatorToken.getText())
  )
    return true;
  if (ts.isCaseClause(parent)) return true;
  return false;
}

export function findText(file: string, source: string): Found[] {
  const tree = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const found: Found[] = [];
  const visit = (node: ts.Node) => {
    if (
      (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) &&
      readsLikeText(node.text) &&
      !isSkippedContext(node)
    ) {
            const line = tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1;
      found.push({ file, line, text: node.text, context: contextOf(node) });
    }
    if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, " ").trim();
      if (readsLikeText(text)) {
        const line =
          tree.getLineAndCharacterOfPosition(node.getStart(tree)).line + 1;
        found.push({ file, line, text: `JSX: ${text}` });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(tree);
  return found;
}
