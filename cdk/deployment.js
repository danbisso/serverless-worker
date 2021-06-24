const { Stack, SecretValue, Stage } = require('@aws-cdk/core');
const { Artifact } = require('@aws-cdk/aws-codepipeline');
const { GitHubSourceAction, GitHubTrigger } = require('@aws-cdk/aws-codepipeline-actions');
const { CdkPipeline, SimpleSynthAction, ShellScriptAction } = require('@aws-cdk/pipelines');
const { ApplicationStack } = require('./application');

class PipelineStack extends Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const sourceArtifact = new Artifact();
    const cloudAssemblyArtifact = new Artifact();

    const pipeline = new CdkPipeline(this, 'ServerlessWorkerPipeline', {
      crossAccountKeys: false,
      cloudAssemblyArtifact: cloudAssemblyArtifact,
      pipelineName: 'ServerlessWorkerPipeline',
      sourceAction: new GitHubSourceAction({
        actionName: 'Github',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('github-danbisso'),
        owner: 'danbisso',
        repo: 'serverless-worker',
        trigger: GitHubTrigger.WEBHOOK
      }),
      synthAction: SimpleSynthAction.standardNpmSynth({
        sourceArtifact: sourceArtifact,
        cloudAssemblyArtifact: cloudAssemblyArtifact,
        testCommands: ['npm test unit']
        /*


        TODO: 
        TODO: 
        TODO: doing tests here might prevent pipeline from self-mutating. either thkink carefully about what kind of tests to do here 
        (like check that the pipeline and prod stages are not touched?), or do all tests after the self-mutate action.  

        Also, what happens if a stage is deleted, are all the resources deleted too??

        */
      })
    });

    const testAppStage = new ApplicationStage(this, 'Test');
    const testStage = pipeline.addApplicationStage(testAppStage);
    testStage.addActions(new ShellScriptAction({
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

class ApplicationStage extends Stage {
  constructor(scope, id, props) {
    super(scope, id, props);

    const stack = new ApplicationStack(this, 'ApplicationStage');
    this.ApiGatewayUrl = stack.ApiGatewayUrl;
  }
}

module.exports = { PipelineStack };
