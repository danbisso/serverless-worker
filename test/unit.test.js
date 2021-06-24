const { App } = require('@aws-cdk/core');
const { expect: expectCdk, countResources, haveOutput } = require('@aws-cdk/assert');
const { ApplicationStack } = require('../cdk/application');
const { PipelineStack } = require('../cdk/deployment');
const { handler } = require('../lambda/worker');

test('Lambda worker returns status 200.', async () => {
  // WHEN
  const response = await handler();
  // THEN
  expect(response.statusCode).toEqual(200);
});

test('Pipeline Stack contains exactly 1 Pipeline.', () => {
  // GIVEN
  const app = new App({ context: { '@aws-cdk/core:newStyleStackSynthesis': true } });
  // WHEN
  const stack = new PipelineStack(app, 'MyTestStack');
  // THEN
  expectCdk(stack).to(countResources('AWS::CodePipeline::Pipeline', 1));
});

test('Application Stack contains exactly 1 Function and 1 API.', () => {
  // GIVEN  
  const app = new App();
  // WHEN
  const stack = new ApplicationStack(app, 'MyTestStack');
  // THEN
  expectCdk(stack).to(countResources('AWS::ApiGateway::RestApi', 1));
  expectCdk(stack).to(countResources('AWS::Lambda::Function', 1));
});

test('Application Stack contains the APIGatewayURL output.', () => {
  // GIVEN
  const app = new App();
  // WHEN
  const stack = new ApplicationStack(app, 'MyTestStack');
  // THEN
  expectCdk(stack).to(haveOutput({
    outputName: 'APIGatewayURL'
  }));
});
