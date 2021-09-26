declare module "PackageManager" {
    import {PackageVersion} from "PackageVersionDiffListCreator";

    import {File} from "GithubApi";

    export type LockFile = unknown;

    export type RequirementFile = unknown;

    export type LockPackage = unknown;

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
        protected constructor(packageManagerName: string, packageManagerFileName: string, packageManagerLockFileName: string, repositoryOwner: string, repositoryName: string);
        public getPackageManagerName(): string;
        public getPackageManagerFileName(): string;
        public getPackageManagerLockFileName(): string;
        public isLockFileUpdatedOnPr(prNumber: number): Promise<boolean>;
        public getLockFileContentAt(commitSha: string): Promise<string>;
        public getRequirementFileContentAt(commitSha: string): Promise<string>;
        public isLockFileUpdatedOnList(fileList: File[]): boolean;
        public loadLockFile(content: string): Promise<LockFile>;
        public loadRequirementFile(content: string): Promise<RequirementFile>;
        public extractLockPackageList(lockFile: LockFile): Promise<PackageList<LockPackage>>;
        public extractPackageVersion(lockPackage: LockPackage | undefined): Promise<PackageVersion | undefined>;
        public getPackageInfos(lockPackage: LockPackage | undefined, file: RequirementFile): Promise<PackageInfos | undefined>;
    }

}
