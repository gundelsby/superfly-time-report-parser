import fg from "fast-glob";
import { writeFileSync } from "fs";
import { parseCsvFile } from "./parser/parser.js";

const inputFolderName = process.argv[2];

if (!inputFolderName) {
  console.log(
    `usage: node ${process.argv[1]} <folder name to find CSVs to process>`,
  );
  process.exit();
}

const summarized = new Map();
const csvFiles = await fg(`${inputFolderName}/*.csv`, {
  absolute: true,
});
console.log(`Files: ${csvFiles.join(",")}`);

for (const fileName of csvFiles) {
  const parsedEntries = parseCsvFile(fileName);

  for (const entry of parsedEntries) {
    if (summarized.has(entry.jiraKey)) {
      const issue = summarized.get(entry.jiraKey);
      issue.hoursWorked += entry.hoursWorked;
    } else {
      summarized.set(entry.jiraKey, { ...entry });
    }
  }
  const summarizedOutputFileName = `${fileName}-summarized.txt`;

  writeFileSync(
    summarizedOutputFileName,
    Array.from(summarized).map(JSON.stringify).join("\n"),
    "utf-8",
  );
}
