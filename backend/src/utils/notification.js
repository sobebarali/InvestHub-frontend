"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribeToSnsTopic = exports.sns = exports.createSnsTopic = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = require("../config/config");
aws_sdk_1.default.config.update({
    accessKeyId: config_1.config.aws.accessKeyId,
    secretAccessKey: config_1.config.aws.secretAccessKey,
    region: config_1.config.aws.region,
});
const sns = new aws_sdk_1.default.SNS();
exports.sns = sns;
// Create an SNS topic for a company
const createSnsTopic = (companyName) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Name: `${companyName}-topic`,
    };
    const { TopicArn } = yield sns.createTopic(params).promise();
    return TopicArn;
});
exports.createSnsTopic = createSnsTopic;
const subscribeToSnsTopic = (topicArn, protocol, endpoint) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TopicArn: topicArn,
        Protocol: protocol,
        Endpoint: endpoint,
    };
    yield sns.subscribe(params).promise();
});
exports.subscribeToSnsTopic = subscribeToSnsTopic;
