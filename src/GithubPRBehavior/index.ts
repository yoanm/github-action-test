import {PackageManagerType} from "PackageManager";
import {File} from "GithubApi";
import logger from "../logger";
import {PackageVersionDiff} from "PackageVersionDiffListCreator";
import {GithubPRCommentManager} from "../GithubPRCommentManager";
import {GithubFileManager} from "../GithubFileManager";
import PackageManager from "../PackageManager";
import PackageVersionDiffListCreator from "../PackageVersionDiffListCreator";
import {packageManagerFactory} from "../utils";
import {WebhookPayload} from "@actions/github/lib/interfaces";

export class GithubPRBehavior {
    private readonly prId: number;
    private readonly baseCommitSha: string;
    private readonly headCommitSha: string;
    private readonly force: boolean;
    private readonly packageManager: PackageManager<any, any, any>;
    private readonly githubFileManager: GithubFileManager;
    private readonly githubCommentManager: GithubPRCommentManager;

    constructor(
        repositoryOwner: string,
        repositoryName: string,
        payload: WebhookPayload['pull_request'],
        packageManagerType: PackageManagerType,
        postComment: boolean,
        force: boolean,
    ) {
        if (undefined === payload) {
            throw new Error('Pull Request context is undefined !');
        }

        this.prId = payload.number;
        this.baseCommitSha = payload.base.sha;
        this.headCommitSha = payload.head.sha;
        this.force = force;
        this.packageManager = packageManagerFactory(packageManagerType);
        this.githubFileManager = new GithubFileManager(repositoryOwner, repositoryName);
        this.githubCommentManager = new GithubPRCommentManager(
            repositoryOwner,
            repositoryName,
            this.prId,
            packageManagerType,
            postComment
        );
    }

    public async execute(): Promise<PackageVersionDiff[]> {
        logger.debug('Creating diff ...');
        if (await this.shouldCreateDiff()) {
            logger.info(this.packageManager.getLockFilename() + ' updated ! Gathering data ...');
            const packageVersionDiffListCreator = new PackageVersionDiffListCreator(
                this.packageManager,
                this.githubFileManager,
                this.baseCommitSha,
                this.headCommitSha
            );

            logger.debug('Creating diff ...');
            const packagesDiff = await packageVersionDiffListCreator.createPackageVersionList();

            await this.manageDiffNotification(packagesDiff);

            return packagesDiff;
        }

        return [];
    }

    public async manageDiffNotification(packagesDiff: PackageVersionDiff[]): Promise<void> {
        if (packagesDiff.length) {
            return this.githubCommentManager.createNewIfNeeded(this.headCommitSha, packagesDiff);
        }

        return this.githubCommentManager.deletePreviousIfExisting();
    }

    protected  async shouldCreateDiff(): Promise<boolean> {
        let lockFile: File | undefined;
        const previousComment = await this.githubCommentManager.getPrevious();
        logger.debug(`Previous comment found ? ${previousComment === undefined ? 'N' : 'Y'}`);
        console.log({previousComment});

        const isJobRestartedOnSameCommitAsPreviousComment: boolean = previousComment?.commitRef === this.headCommitSha;
        logger.debug(`Job restarted on same commit as previous comment ? ${isJobRestartedOnSameCommitAsPreviousComment ? 'Y' : 'N'}`);

        if (!this.force && previousComment !== undefined && !isJobRestartedOnSameCommitAsPreviousComment) {
            logger.debug('Checking if lock file has been updated since last PR comment ...');
            lockFile = await this.githubFileManager.getFileBetween(
                this.packageManager.getLockFilename(),
                previousComment.commitRef,
                this.headCommitSha,
                ['modified', 'added', 'removed']
            );

            if (lockFile === undefined) {
                logger.info(this.packageManager.getLockFilename() + ' not updated since last review !');
            }
        } else {
            logger.debug('Checking if lock file has been updated on PR ...');
            lockFile = await this.githubFileManager.getPRFile(
                this.packageManager.getLockFilename(),
                this.prId,
                ['modified', 'added', 'removed']
            );

            if (lockFile === undefined) {
                logger.info(this.packageManager.getLockFilename() + ' not updated on that PR !');
            }
        }

        return lockFile !== undefined;
    }
}
