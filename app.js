const { App } = require('@aws-cdk/core');
const { PipelineStack, ApplicationStage } = require('./cdk/deployment');

const app = new App();

// Deploy the pipeline to the production account and region
new PipelineStack(app, 'PipelineStack', {
  env: {
    account: '812643611113',
    region: 'us-east-1'
  },
});

// Deploy an additional independent Dev stage to the locally configured account and region
new ApplicationStage(app, 'Dev', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION
  },
});