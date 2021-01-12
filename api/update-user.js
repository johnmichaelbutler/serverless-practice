const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log({ event });
  let response = {};
  try {
    if (event.path.includes('users') && event.httpMethod === 'PUT') {
      let userId = event.pathParameters.id;

      let data = JSON.stringify(
        await exports.handleUpdateUserById(userId, JSON.parse(event.body))
      );
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

exports.handleUpdateUserById = async (userId, item) => {
  let { name } = item;
  let params = {
    ExpressionAttributeNames: {
      '#n': 'name',
    },
    ExpressionAttributeValues: {
      ':n': {
        S: name,
      },
    },
    Key: {
      user_id: {
        S: userId,
      },
    },
    UpdateExpression: 'SET #n = :n',
    ReturnValues: 'UPDATED_NEW',
    TableName: TABLE_NAME,
    ReturnConsumedCapacity: 'TOTAL',
  };
  let data = await dynamodb.updateItem(params).promise();
  return data;
};
