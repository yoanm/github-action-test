import {PackageManagerType} from "PackageManager";
import Composer from "./PackageManager/Composer";
import {GithubPRBehavior} from "./GithubPRBehavior";
import {PayloadRepository, WebhookPayload} from "@actions/github/lib/interfaces";
import logger from "./logger";

export function behaviorFactory(
    contextType: string,
    repositoryData: PayloadRepository,
    webHookPayload: WebhookPayload,
    packageManagerType: PackageManagerType,
    postComment: boolean,
    force: boolean,
) {
  switch (contextType) {
    case 'PR':
      logger.debug('Using PR behavior!');
      return new GithubPRBehavior(
          repositoryData.owner.login,
          repositoryData.name,
          webHookPayload.pull_request,
          packageManagerType,
          postComment,
          force,
      );
  }

  throw new Error('Context type "'+contextType+'" is not supported !');
}

export function packageManagerFactory(packageManagerType: PackageManagerType): Composer {
  switch (packageManagerType) {
    case 'composer':
      logger.debug('Using Composer package manager!');
      return new Composer();
  }

  throw new Error('Package manager type "'+packageManagerType+'" is not supported !');
}

