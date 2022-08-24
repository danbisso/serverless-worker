// Event handler.
module.exports.handler = async (event, context) => {

    // Call APIs, transform data, etc...

    return {
        statusCode: 200,
        headers: { "content-type": "text/html"},
        body: '<h1>Hello World!</h1><p>Lambda handler called.</p>'
    }
};