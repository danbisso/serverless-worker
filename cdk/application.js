const { Stack, CfnOutput } = require('@aws-cdk/core');
const { Function, Runtime, Code } = require('@aws-cdk/aws-lambda');
const { LambdaRestApi } = require('@aws-cdk/aws-apigateway');

class ApplicationStack extends Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const handler = new Function(this, 'Worker', {
      description: 'Responds to API Gateway requests and executes some work',
      runtime: Runtime.NODEJS_14_X,
      handler: 'worker.handler',
      code: Code.fromAsset('lambda')
    });

    const api = new LambdaRestApi(this, 'API', {
      restApiName: `${scope.stageName}-Worker`,
      description: 'Web service endpoint to execute some work',
      handler: handler,
      deployOptions: {
        stageName: scope.stageName.toLowerCase()
      }
    });

    this.ApiGatewayUrl = new CfnOutput(this, 'APIGatewayURL', {
      description: 'API Gateway-generated endpoint URL',
      value: api.url
    });
  }
}

module.exports = { ApplicationStack };
