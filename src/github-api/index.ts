import {GitHub} from "@actions/github/lib/utils"
import {getInput} from "@actions/core";
import {getOctokit} from "@actions/github";

const ghToken = getInput('gh-token', {required: true, trimWhitespace: true});

export default getOctokit(ghToken) as InstanceType<typeof GitHub>;
