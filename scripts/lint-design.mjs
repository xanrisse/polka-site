import { readFile } from "node:fs/promises";
import process from "node:process";
import { lint } from "@google/design.md/linter";

const userArgs = process.argv.slice(2);
const filePath = userArgs.find((arg) => !arg.startsWith("--")) ?? "DESIGN.md";
const useJson = userArgs.includes("--json");

const content = await readFile(filePath, "utf8");
const report = lint(content);

if (useJson) {
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.summary.errors > 0 ? 1 : 0);
}

if (report.findings.length === 0) {
  console.log(`${filePath}: no findings`);
} else {
  for (const finding of report.findings) {
    const location = finding.path ? `${finding.path}: ` : "";
    console.log(`[${finding.severity}] ${location}${finding.message}`);
  }
}

console.log(
  `Summary: ${report.summary.errors} errors, ${report.summary.warnings} warnings, ${report.summary.infos} infos`,
);

process.exit(report.summary.errors > 0 ? 1 : 0);
