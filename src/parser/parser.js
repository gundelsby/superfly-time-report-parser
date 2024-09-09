import { readFileSync } from "fs";

export { parseCsvFile };

const jiraIssueKeyRE = /SOFIE-\d+/gm;

function parseCsvFile(filename) {
  console.log(`Parsing ${filename}`);

  return readFileSync(filename, "utf8")
    .split(/\r?\n/)
    .filter((line) => jiraIssueKeyRE.test(line))
    .map(parse);
}

function parse(line) {
  /**
   * 0 Project/Time entry
   * 1 Task
   * 2 User
   * 3 Tags
   * 4 Start date
   * 5 Start time
   * 6 Stop date
   * 7 Stop time
   * 8 Time (h)
   * 9 Time (decimal)
   * 10 Billable
   */
  const parts = line.split(",");
  const data = {
    jiraKey: parts[0].match(jiraIssueKeyRE)[0],
    hoursWorked: Number(parts[9]),
  };

  console.log(`Parsed ${data.jiraKey}`);
  return data;
}
