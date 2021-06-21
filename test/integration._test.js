const axios = require('axios');

test('Endpoint responds with status 200.', async () => {

  // GIVEN  
  const url = process.env.ENDPOINT_URL;

  // WHEN
  const response = await axios.get(url);

  // THEN
  expect(response.status).toEqual(200);
});

