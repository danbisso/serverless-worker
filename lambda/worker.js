const { Stage } = require("@aws-cdk/core");

// Event handler.
module.exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        body: 'Hello World! Updated to 1.129'
    }
};


// Function without deps: handler 
// Function with deps: handler + node_modules
// Functions with shared deps: handlers + Layer with node_modules
// Functions with deps with compiled dependencies: handler + node_modules + docker bundling

// can we test if api endpoint urls changed? 

// I just did some refactoring of the pipeline code and now I'm scared it'll break the live Stage. Can tests be added for this?

// NodeJSFunction bundles which should make the --watch updates fast, and it also has the optional docker bundling for compiled deps. 


// NOTE: SNS and SQS have a 256kb payload limit, this is around 50 line items per oder. Unlikely but not impossible. 
// With this apigw > sqs < lambda arquitecture it might be good to only send SQS the necessary data.


// Parameter store has a 40/sec request throughput. more than enough.

// Also, it would be great to make my quick-dev setup not be so ad-hoc but rather some kind of npm package that just plugs into the default cdk app structure.
// Play around with AWS CDK nodejs defaults/example: https://docs.aws.amazon.com/cdk/latest/guide/serverless_example.html

// Shared lambda code and modules should go in Lambda Layers

// Projects should include a cdkpipeline. Easy CI/CD.

// Lambdas can be updated via re-deploy (slow), the console UI (bad), or uploading .zip (non-linux built binaries won't run).
// Many people like local emulation (like serverless-local or sam-local), and there's also 
// a new fancy sst live lambda dev that tunnels lambda traffic into the local machine which is blegh.

// My approach to watch and re-upload isn't bad. But I could improve: 
// Don't depend on aws-cli, but use the JS SDK instead. This is what the serverless framework does for "logs" and "update-lambda" cmds.
// See sls framework's source lib/plugins/aws folder for implementation.
// You can deploy node modules or bundle with esbuild, but native modules won't run, they need to be built via amazon linux container.
// This is not a big deal atm but might cause issues down the line.
// Get the dev helper scripts (and probably a few constructs, idempotency and SQS query code as well) 
// into a dependency https://stackoverflow.com/questions/10386310/how-to-install-a-private-npm-module-without-my-own-registry


// In this version, I'm committing the app's node_modules. Maybe look at what default cdk apps do to structure infra / app code / multiple functions?
// Also, should there be 1 repo for infra + app (might be hard for non-aws devs) 
// or 2 repos for infra and then also app-only code updates (easy for non aws devs but should infrastructure be tightly coupled to app code (env vars, parameter store)?

// If I can somehow separate app logic / repo from infrastructure (is this even possible/desireable though?) that could make other devs more comfortable tweaking app logic.

// Lastly, it would be interesting to see what a heroku-ish option would look like in AWS with elastic beanstalk. See if it would really make things simpler for a multi-dev team.


// Verify that a webhook was fired by Shopify
// function verifyWebhook(message, hmac) {
//   const generatedHash = crypto
//     // .createHmac('sha256', secrets.SHOPIFY_ADMIN_WEBHOOK_KEY)
//     .createHmac('sha256', 'eae92acaaee8b8569ca3864dbd6129f4e3460cc885ac09b9941433e1cf54764d')
//     .update(message)
//     .digest('base64');
//   return crypto.timingSafeEqual(Buffer.from(generatedHash), Buffer.from(hmac));
// }

// TODO: this doesn't log any request side errors. Maybe do log something? Errors, and The order number or something?
// TODO: this doesn't log any request side errors. Maybe do log something? Errors, and The order number or something?
// TODO: this doesn't log any request side errors. Maybe do log something? Errors, and The order number or something?
// TODO: this doesn't log any request side errors. Maybe do log something? Errors, and The order number or something?



// Check SSM parameter store throughput/pricing, that could be the weak point in a DDOS / pricing attack.





// Systems Manager. This handles secure parameters like API keys.
// const ssm = new AWS.SSM({ apiVersion: '2014-11-06' });

// Get deploy-time config from environment variables. These are set by the CDK during deployment.
// const {
//   STAGE,
//   SNS_TOPIC_ARN,
//   SECRETS_PARAM_NAME,
//   CONFIG_PARAM_NAME
// } = process.env;

// Get Secrets and Config from SSM Parameter Store. 
// NOTE: We can't await for the promise() calls to resolve here, so we use an init() function and await inside it.
// const secretParamPromise = ssm.getParameter({
//   Name: SECRETS_PARAM_NAME,
//   WithDecryption: true
// }).promise();

// const configParamPromise = ssm.getParameter({
//   Name: CONFIG_PARAM_NAME
// }).promise();
