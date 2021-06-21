const cdk = require('@aws-cdk/core');
const { expect, countResources, haveOutput } = require('@aws-cdk/assert');
const { ApplicationStack } = require('../cdk/application');
const { PipelineStack } = require('../cdk/deployment');

test('Pipeline Stack contains expected resources.', () => {

  // GIVEN
  const app = new cdk.App({ context: { '@aws-cdk/core:newStyleStackSynthesis': true } });

  // WHEN
  const stack = new PipelineStack(app, 'MyTestStack');

  // THEN
  expect(stack).to(countResources('AWS::CodePipeline::Pipeline', 1));
});

test('Application Stack contains expected resources.', () => {

  // GIVEN  
  const app = new cdk.App();

  // WHEN
  const stack = new ApplicationStack(app, 'MyTestStack');

  // THEN
  expect(stack).to(countResources('AWS::ApiGateway::RestApi', 1));
  expect(stack).to(countResources('AWS::Lambda::Function', 1));
});

test('Application Stack contains expected outputs.', () => {

  // GIVEN
  const app = new cdk.App();

  // WHEN
  const stack = new ApplicationStack(app, 'MyTestStack');

  // THEN
  expect(stack).to(haveOutput({
    outputName: 'APIGatewayURL'
  }));
});