// eslint-disable-next-line @typescript-eslint/no-require-imports,@typescript-eslint/no-var-requires
const { execSync } = require("child_process");
console.log('configure');
execSync("yarn install --prod", { stdio: "inherit" });
console.log('configure - ok');
