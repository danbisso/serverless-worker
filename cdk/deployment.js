const { Stack, SecretValue, Stage } = require('@aws-cdk/core');
const { GitHubTrigger } = require('@aws-cdk/aws-codepipeline-actions');
const { CodePipeline, ShellStep, ManualApprovalStep, CodePipelineSource } = require('@aws-cdk/pipelines');
const { ApplicationStack } = require('./application');

class PipelineStack extends Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'ServerlessWorkerPipeline', {
      pipelineName: 'ServerlessWorkerPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('danbisso/serverless-worker', 'master', {
          authentication: SecretValue.secretsManager('github-danbisso'),
          trigger: GitHubTrigger.WEBHOOK
        }),
        commands: [
          'npm ci',
          'npm test unit',
          'npx cdk synth',
        ],
      })
    });

    const testAppStage = new ApplicationStage(this, 'Test');
    pipeline.addStage(testAppStage, {
      post: [
        new ShellStep('IntegrationTest', {
          commands: [
            'npm ci',
            'npm test integration'
          ],
          envFromCfnOutputs: {
            ENDPOINT_URL: testAppStage.ApiGatewayUrl
          }
        }),
        // new ManualApprovalStep('ManualApproval')
      ]
    });

    pipeline.addStage(new ApplicationStage(this, 'Prod'), {
      pre: [
        new ManualApprovalStep('ManualApproval')
      ]
    });
  }
}

class ApplicationStage extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    const stack = new ApplicationStack(this, 'ApplicationStack');
    this.ApiGatewayUrl = stack.ApiGatewayUrl;
  }
}

module.exports = { PipelineStack, ApplicationStage };
