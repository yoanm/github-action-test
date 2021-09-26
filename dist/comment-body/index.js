"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentPkgTypeFactory = exports.COMMENT_COMMIT_REGEXP = exports.COMMENT_HEADER = void 0;
const sections_1 = require("./sections");
const utils_1 = require("./utils");
exports.COMMENT_HEADER = '<!-- packagesVersionsChecker -->';
exports.COMMENT_COMMIT_REGEXP = '<\!\-\- commit="([^"]+)" \-\->';
const commentPkgTypeFactory = (packageManagerType) => `<!-- type="${packageManagerType}" -->`;
exports.commentPkgTypeFactory = commentPkgTypeFactory;
function createBody(packageManagerType, commit, packagesDiff) {
    const updatedPackageDiffList = packagesDiff.filter(utils_1.isDiffTypeFilter('UPDATED'));
    return `${exports.COMMENT_HEADER}${exports.commentPkgTypeFactory(packageManagerType)}<!-- commit="${commit}" --> \n`
        + `# 🔎 ${getPackageManagerName(packageManagerType)} packages versions checker 🔍 \n`
        + '\n'
        + sections_1.createRiskyUpdatesBody(updatedPackageDiffList)
        + sections_1.createMinorVersionUpdatesBody(updatedPackageDiffList)
        + sections_1.createPatchVersionUpdatesBody(updatedPackageDiffList)
        + sections_1.createAddedAndRemovedBody([
            ...packagesDiff.filter(utils_1.isDiffTypeFilter('ADDED')),
            ...packagesDiff.filter(utils_1.isDiffTypeFilter('REMOVED')),
        ])
        + sections_1.createUnknownBody(packagesDiff.filter(utils_1.isDiffTypeFilter('UNKNOWN')))
        + sections_1.createCaptionBody();
}
exports.default = createBody;
function getPackageManagerName(packageManagerType) {
    switch (packageManagerType) {
        case 'composer':
            return 'Composer';
    }
    return '';
}
