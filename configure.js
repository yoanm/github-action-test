const { execSync } = require("child_process");

execSync("yarn install --prod", { stdio: "inherit" });
