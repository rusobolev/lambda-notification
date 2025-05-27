const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const snsClient = new SNSClient();

exports.handler = async (event) => {
  console.log('Received event:', JSON.stringify(event, null, 2));

  const topicArn = process.env.SNS_TOPIC_ARN;

  const messages = event.Records.map(record => {
    try {
      return JSON.parse(record.body);
    } catch (e) {
      return { error: "Invalid JSON in SQS message body ", raw: record.body };
    }
  });

  const message = `Uploaded files metadata:\n${JSON.stringify(messages, null, 2)}`;

  const params = {
    Message: message,
    TopicArn: topicArn,
  };

  const command = new PublishCommand(params);

  try {
    await snsClient.send(command);
    console.log("Message published to SNS.");
  } catch (err) {
    console.error("Failed to publish message", err);
  }
};
