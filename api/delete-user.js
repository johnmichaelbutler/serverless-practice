const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log({ event });
  let response = {};
  try {
    if (event.path.includes('users') && event.httpMethod === 'DELETE') {
      let userId = event.pathParameters.id;

      let data = JSON.stringify(await exports.handleDeleteUserById(userId));
      response.body = data;
      response.statusCode = 200;
      return response;
    }
  } catch (e) {
    console.log('Error in handler', e);
    response.body = e;
    response.statusCode = 500;
  }
};

exports.handleDeleteUserById = async (userId) => {
  let params = {
    Key: {
      user_id: {
        S: userId,
      },
    },
    TableName: TABLE_NAME,
    ReturnConsumedCapacity: 'TOTAL',
  };
  let data = await dynamodb.deleteItem(params).promise();
  return data;
};
