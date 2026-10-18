// Reproducible adaptation: official React source + namespaced, precompiled CSS.
// Consumers need neither Tailwind nor a global reset. Hand-written ROC behavior
// refinements are applied after this import step; do not regenerate blindly.
import ts from "typescript";
import { compile } from "tailwindcss";
import postcss from "postcss";
import selectorParser from "postcss-selector-parser";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
const names =
  "alert-dialog aspect-ratio attachment bubble button-group calendar carousel chart code-block collapsible combobox command context-menu direction drawer empty field hover-card input-group input-otp item kbd label marker menubar message message-scroller native-select navigation-menu questionnaire resizable select sheet spinner table toast trace".split(
    " ",
  );
const theme = await readFile("node_modules/tailwindcss/theme.css", "utf8");
const extra = `@theme { --color-background:var(--roc-paper,#fff);--color-foreground:#252525;--color-card:#fff;--color-card-foreground:#252525;--color-popover:#fff;--color-popover-foreground:#252525;--color-primary:var(--roc-accent,#252525);--color-primary-foreground:#fff;--color-secondary:#f3f3f3;--color-secondary-foreground:#252525;--color-muted:#f5f5f5;--color-muted-foreground:#737373;--color-accent:#f3f3f3;--color-accent-foreground:#252525;--color-destructive:#b42318;--color-border:#e5e5e5;--color-input:#dedede;--color-ring:#737373;--radius-xs:3px;--radius-sm:5px;--radius-md:7px;--radius-lg:var(--roc-radius,9px);--radius-xl:12px;--radius-2xl:16px; }`;
const h = (s) =>
  "roc-s-" + createHash("sha256").update(s).digest("hex").slice(0, 12);
const printer = ts.createPrinter();
for (const name of names) {
  let source = await readFile("upstream/shadcn/" + name + ".tsx", "utf8");
  source = source
    .replace(/from "cn"/g, 'from "./utils"')
    .replace(
      /from "@\/registry\/[^"\n]+\/(?:ui|hooks)\/([^"/]+)"/g,
      'from "./$1"',
    );
  const icons = new Set();
  source = source.replace(/import \{ IconPlaceholder \} from [^\n]+\n/g, "");
  source = source.replace(/<IconPlaceholder([\s\S]*?)\/>/g, (_, props) => {
    const icon = props.match(/lucide="([^"]+)"/)?.[1] || "CircleIcon";
    icons.add(icon);
    return (
      "<" +
      icon +
      props.replace(
        /\s*(lucide|tabler|hugeicons|phosphor|remixicon)="[^"]*"/g,
        "",
      ) +
      "/>"
    );
  });
  if (icons.size)
    source =
      "import { " +
      [...icons].join(", ") +
      ' } from "lucide-react";\n' +
      source;
  if (!source.includes('from "./utils"'))
    source = 'import { cn } from "./utils";\n' + source;
  const candidates = new Set();
  const sf = ts.createSourceFile(
    name + ".tsx",
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const mapLiteral = (n) => {
    const words = n.text.split(/\s+/).filter(Boolean);
    words.forEach((c) => candidates.add(c));
    return ts.factory.createStringLiteral(words.map(h).join(" "));
  };
  const transformed = ts.transform(sf, [
    (context) => {
      function cssExpr(n) {
        if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n))
          return mapLiteral(n);
        if (ts.isConditionalExpression(n))
          return ts.factory.updateConditionalExpression(
            n,
            n.condition,
            n.questionToken,
            cssExpr(n.whenTrue),
            n.colonToken,
            cssExpr(n.whenFalse),
          );
        if (
          ts.isBinaryExpression(n) &&
          [
            ts.SyntaxKind.AmpersandAmpersandToken,
            ts.SyntaxKind.BarBarToken,
          ].includes(n.operatorToken.kind)
        )
          return ts.factory.updateBinaryExpression(
            n,
            n.left,
            n.operatorToken,
            cssExpr(n.right),
          );
        return visit(n);
      }
      function visit(n) {
        if (ts.isCallExpression(n) && n.expression.getText(sf) === "cn")
          return ts.factory.updateCallExpression(
            n,
            n.expression,
            n.typeArguments,
            n.arguments.map(cssExpr),
          );
        if (ts.isCallExpression(n) && n.expression.getText(sf) === "cva") {
          const args = [...n.arguments];
          args[0] = cssExpr(args[0]);
          if (args[1])
            args[1] = ts.visitEachChild(
              args[1],
              function opts(p) {
                if (
                  ts.isPropertyAssignment(p) &&
                  p.name.getText(sf) === "variants"
                )
                  return ts.factory.updatePropertyAssignment(
                    p,
                    p.name,
                    ts.visitNode(p.initializer, function variants(q) {
                      if (
                        ts.isPropertyAssignment(q) &&
                        (ts.isStringLiteral(q.initializer) ||
                          ts.isNoSubstitutionTemplateLiteral(q.initializer))
                      )
                        return ts.factory.updatePropertyAssignment(
                          q,
                          q.name,
                          mapLiteral(q.initializer),
                        );
                      return ts.visitEachChild(q, variants, context);
                    }),
                  );
                return p;
              },
              context,
            );
          return ts.factory.updateCallExpression(
            n,
            n.expression,
            n.typeArguments,
            args,
          );
        }
        if (
          ts.isJsxAttribute(n) &&
          n.name.text === "className" &&
          n.initializer
        ) {
          const expr = ts.isStringLiteral(n.initializer)
            ? mapLiteral(n.initializer)
            : cssExpr(n.initializer.expression);
          return ts.factory.updateJsxAttribute(
            n,
            n.name,
            ts.factory.createJsxExpression(
              undefined,
              ts.factory.createCallExpression(
                ts.factory.createIdentifier("cn"),
                undefined,
                [ts.factory.createStringLiteral("roc-shadcn"), expr],
              ),
            ),
          );
        }
        return ts.visitEachChild(n, visit, context);
      }
      return (n) => ts.visitNode(n, visit);
    },
  ]);
  let result = printer.printFile(transformed.transformed[0]);
  transformed.dispose();
  result =
    '// Adapted from shadcn/ui (MIT). See SHADCN-LICENSE.txt. Scoped CSS is precompiled.\n"use client";\n' +
    result +
    '\nimport "./' +
    name +
    '.css";\n';
  await writeFile("registry/roc/" + name + ".tsx", result);
  const compiler = await compile(
    theme + "\n" + extra + "\n@tailwind utilities;",
  );
  const css = postcss.parse(compiler.build([...candidates]));
  css.walkRules((rule) => {
    if (rule.selector === ":root, :host") rule.selector = ".roc-shadcn";
    else if (rule.selector === "*, ::before, ::after, ::backdrop")
      rule.selector =
        ":where(.roc-shadcn, .roc-shadcn *, .roc-shadcn::before, .roc-shadcn::after)";
    else
      try {
        rule.selector = selectorParser((s) =>
          s.walkClasses((c) => {
            if (
              candidates.has(c.value) ||
              c.value.startsWith("group/") ||
              c.value.startsWith("peer/")
            )
              c.value = h(c.value);
          }),
        ).processSync(rule.selector);
      } catch {}
  });
  // Namespace compiler-owned variables, preserving Radix/Base UI layout variables.
  let compiled = css
    .toString()
    .replace(
      /--(tw-[\w-]+|color-[\w-]+|spacing|radius-[\w-]+|font-[\w-]+|text-[\w-]+|leading-[\w-]+|tracking-[\w-]+|ease-[\w-]+|animate-[\w-]+|default-[\w-]+|container-[\w-]+|breakpoint-[\w-]+|aspect-[\w-]+|perspective-[\w-]+|drop-shadow-[\w-]+)/g,
      "--roc-sh-$1",
    );
  compiled = compiled.replace(/\bspin\b/g, "roc-sh-spin");
  await writeFile(
    "registry/roc/" + name + ".css",
    '@import "./shadcn-base.css";\n' + compiled + "\n",
  );
  console.log(name, candidates.size);
}
