const cdk = require('@aws-cdk/core');
const lambda = require('@aws-cdk/aws-lambda');
const apigw = require('@aws-cdk/aws-apigateway');

class ApplicationStack extends cdk.Stack {

  constructor(scope, id, props) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'Worker', {
      description: 'Responds to API Gateway requests and executes some work',
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'worker.handler',
      code: lambda.Code.fromAsset('lambda')
    });

    const api = new apigw.LambdaRestApi(this, 'API', {
      restApiName: `${scope.stageName}-Worker`,
      description: 'Web service endpoint to execute some work',
      handler: handler
    });

    this.ApiGatewayUrl = new cdk.CfnOutput(this, 'APIGatewayURL', {
      description: 'API Gateway-generated endpoint URL',
      value: api.url
    });
  }
}

module.exports = { ApplicationStack };
