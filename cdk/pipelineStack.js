const cdk = require('@aws-cdk/core');
const codepipeline = require('@aws-cdk/aws-codepipeline');
const cpactions = require('@aws-cdk/aws-codepipeline-actions');
const pipelines = require('@aws-cdk/pipelines');

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
      synthAction: new pipelines.SimpleSynthAction({
        sourceArtifact: sourceArtifact,
        cloudAssemblyArtifact: cloudAssemblyArtifact,
        installCommands: ['npm install -g aws-cdk && npm install'],
        synthCommand: 'cdk synth'
      })
    });

  }
}

module.exports = PipelineStack;
