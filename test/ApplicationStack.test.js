const cdk = require('@aws-cdk/core');
const { expect, countResources, haveOutput } = require('@aws-cdk/assert');
const { ApplicationStack } = require('../cdk/application');

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
