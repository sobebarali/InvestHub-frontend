import AWS from "aws-sdk";
import { config } from "../config/config";

AWS.config.update({
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey,
  region: config.aws.region,
});

const sns = new AWS.SNS();

// Create an SNS topic for a company
const createSnsTopic = async (companyName: string): Promise<any> => {
  const params = {
    Name: `${companyName}-topic`,
  };
  const { TopicArn } = await sns.createTopic(params).promise();
  return TopicArn;
};

const subscribeToSnsTopic = async (
  topicArn: string,
  protocol: string,
  endpoint: string
): Promise<void> => {
  const params = {
    TopicArn: topicArn,
    Protocol: protocol,
    Endpoint: endpoint,
  };
  await sns.subscribe(params).promise();
};

export { createSnsTopic, sns, subscribeToSnsTopic };
