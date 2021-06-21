'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event, context) => {
  const timestamp = new Date().getTime();
  let response;
  console.log(event);

  try {

    const data = JSON.parse(event.body);

    if (typeof data.text !== 'string') {
      const miError = new Error('No se pudo agregar');
      miError.statusCode = 400;
      throw miError;
    }

    const params = {
      TableName: "things",
      Item: {
        id: uuid.v1(),
        text: data.text,
        createdAt: timestamp,
        updatedAt: timestamp,
      },
    };

    const putResult = await dynamoDb.put(params).promise();

    console.log("PUT RESULT");
    console.log(putResult);

    response = {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        error: false,
        data: params.Item

      })
    };

    console.log("RESPUESTA");
    console.log(response);

  } catch (error) {
    console.log("ERROR");
    console.log(error);

    response = {
      statusCode: error.statusCode || 501,
      body: JSON.stringify(error.message)
    };
  }

  console.log("DEVOLVIENDO RESPUESTA");
  console.log(response);

  response.headers = {
    'Access-Control-Allow-Origin': '*'
  };
  return response;

};


