const { expect, matchTemplate, MatchStyle } = require('@aws-cdk/assert');
const cdk = require('@aws-cdk/core');
const Pipelines = require('../lib/pipelines-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Pipelines.PipelinesStack(app, 'MyTestStack');
    // THEN
    expect(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
