const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB();
const TABLE_NAME = process.env.TABLE_NAME;

exports.handler = async (event) => {
  console.log({ event });
  let response = {};
  try {
    if (event.path.includes('users') && event.httpMethod === 'POST') {
      let data = JSON.stringify(
        await exports.handleCreateUser(JSON.parse(event.body))
      );
      response.body = data;
      response.statusCode = 200;
    }
  } catch (e) {
    console.log('Error', e);
    response.body = JSON.stringify(e);
    response.statusCode = 500;
  }
  return response;
};

exports.handleCreateUser = async (item) => {
  console.log('Item from event.body', item);
  let params = {
    Item: {
      user_id: {
        S: item.user_id,
      },
      name: {
        S: item.name,
      },
    },
    TableName: TABLE_NAME,
    ReturnConsumedCapacity: 'TOTAL',
  };
  console.log('Params: ', params);
  let data = dynamodb.putItem(params).promise();
  return data;
};
