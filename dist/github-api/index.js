"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const github_1 = require("@actions/github");
const ghToken = core_1.getInput('gh-token', { required: true, trimWhitespace: true });
exports.default = github_1.getOctokit(ghToken);
