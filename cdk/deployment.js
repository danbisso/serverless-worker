const cdk = require('@aws-cdk/core');
const codepipeline = require('@aws-cdk/aws-codepipeline');
const cpactions = require('@aws-cdk/aws-codepipeline-actions');
const pipelines = require('@aws-cdk/pipelines');
const { ApplicationStack } = require('./application');

class PipelineStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new pipelines.CdkPipeline(this, 'ServerlessWorkerPipeline', {
      crossAccountKeys: false,
      cloudAssemblyArtifact: cloudAssemblyArtifact,
      pipelineName: 'ServerlessWorkerPipeline',
      sourceAction: new cpactions.GitHubSourceAction({
        actionName: 'Github',
        output: sourceArtifact,
        oauthToken: cdk.SecretValue.secretsManager('github-danbisso'),
        owner: 'danbisso',
        repo: 'serverless-worker',
        trigger: cpactions.GitHubTrigger.POLL
      }),
      synthAction: pipelines.SimpleSynthAction.standardNpmSynth({
        sourceArtifact: sourceArtifact,
        cloudAssemblyArtifact: cloudAssemblyArtifact,
        testCommands: ['npm test unit']
      })
    });

    const testAppStage = new ApplicationStage(this, 'Test');
    const testStage = pipeline.addApplicationStage(testAppStage);
    testStage.addActions(new pipelines.ShellScriptAction({
      actionName: 'IntegrationTest',
      runOrder: testStage.nextSequentialRunOrder(),
      additionalArtifacts: [sourceArtifact],
      commands: [
        'npm ci',
        'npm test integration'
      ],
      useOutputs: {
        ENDPOINT_URL: pipeline.stackOutput(testAppStage.ApiGatewayUrl)
      }
    }));

    pipeline.addApplicationStage(new ApplicationStage(this, 'Prod'));
  }
}

class ApplicationStage extends cdk.Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    const stack = new ApplicationStack(this, 'ApplicationStage');
    this.ApiGatewayUrl = stack.ApiGatewayUrl;
  }
}

module.exports = { PipelineStack };
