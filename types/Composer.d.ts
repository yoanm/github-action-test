declare module "Composer" {
    import {LockFile, LockPackage, RequirementFile} from "PackageManager";

    export interface ComposerFile extends RequirementFile {
        require?: RequirementList,
        'require-dev'?: RequirementList,
    }

    export interface ComposerLockFile extends LockFile {
        packages?: ComposerLockPackage[],
        'packages-dev'?: ComposerLockPackage[],
    }

    export interface ComposerLockPackage extends LockPackage {
        name: string,
        version: string,
        dist: {
            reference: string,
        },
        support?: {
            source?: string | undefined;
        }
    }

    export type MetaComposerLockPackage = ComposerLockPackage & {
        isDevRequirement: boolean;
        sourceLink: string | undefined;
    };

    export type RequirementList = {
        [key: string]: string | undefined
    };
}
