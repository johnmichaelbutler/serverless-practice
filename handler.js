'use strict';

module.exports.hello = async (event) => {
  console.log({ event });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'You fun the function dude!!',
        input: event,
        function_var: process.env.HELLO_VAR,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
