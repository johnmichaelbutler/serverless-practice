const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log({ event });
  let response = {};
  try {
    if (event.path.includes('users') && event.httpMethod === 'GET') {
      if (event.pathParameters) {
        let userId = event.pathParameters.id;
        let data = JSON.stringify(await exports.handleGetUserById(userId));
        response.body = data;
      } else {
        let data = JSON.stringify(await exports.handleGetUsers());
        response.body = data;
      }
      response.statusCode = 200;
      return response;
    }
  } catch (e) {
    console.log('Error in handler', e);
    response.body = e;
    response.statusCode = 500;
  }
};

exports.handleGetUserById = async (userId) => {
  let params = {
    Key: {
      user_id: {
        S: userId,
      },
    },
    TableName: TABLE_NAME,
    ReturnConsumedCapacity: 'TOTAL',
  };
  let data = await dynamodb.getItem(params).promise();
  return data;
};

exports.handleGetUsers = async (event) => {
  let params = {
    TableName: TABLE_NAME,
    ReturnConsumedCapacity: 'TOTAL',
  };
  let data = await dynamodb.scan(params).promise();
  return data;
};
