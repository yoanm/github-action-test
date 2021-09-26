declare module "PackageManager" {
    import {PackageVersion} from "PackageVersionDiffListCreator";

    import {File} from "GithubApi";

    export type LockFile = {};

    export type RequirementFile = {};

    export type LockPackage = {};

    export type PackageList<T extends LockPackage> = {
        [packageName: string]: T | undefined;
    };

    export interface PackageInfos {
        isRootRequirement: boolean,
        isRootDevRequirement: boolean,
        sourceLink?: string,
    }

    export type PackageManagerType = 'composer'/* | 'npm' | 'yarn'*/;

    export class PackageManager {
        constructor(packageManagerName: string, packageManagerFileName: string, packageManagerLockFileName: string, repositoryOwner: string, repositoryName: string);
        getPackageManagerName(): string;
        getPackageManagerFileName(): string;
        getPackageManagerLockFileName(): string;
        isLockFileUpdatedOnPr(prNumber: number): Promise<boolean>;
        getLockFileContentAt(commitSha: string): Promise<string>;
        getRequirementFileContentAt(commitSha: string): Promise<string>;
        isLockFileUpdatedOnList(fileList: File[]): boolean;
        loadLockFile(content: string): Promise<LockFile>;
        loadRequirementFile(content: string): Promise<RequirementFile>;
        extractLockPackageList(lockFile: LockFile): Promise<PackageList<LockPackage>>;
        extractPackageVersion(lockPackage: LockPackage | undefined): Promise<PackageVersion | undefined>;
        getPackageInfos(lockPackage: LockPackage | undefined, file: RequirementFile): Promise<PackageInfos | undefined>;
    }

}
