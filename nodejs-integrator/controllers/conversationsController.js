const { requestDialogFlow } = require("../services/dialogflow");
const { uploadFile } = require("../services/s3");

const catchAsync = require("../utils/catchAsync");
const { MessagingResponse } = require("twilio").twiml;
const twilio = require("../services/twilio");

const { redis } = require("../services/redis");
const getAsync = util.promisify(redis.get).bind(redis);

exports.twilioRequestHook = catchAsync(async (req, res, next) => {
  const { body } = req;
  const { NumMedia, From: senderNumber, MessageSid, Body: query } = body;
  const mediaUrl = body[`MediaUrl${0}`];
  const response = new MessagingResponse();

  if(!req.user){
    sendError()
    return res.send(response.toString()).status(200);
  }

  message = await checkCache()
  if(message){
    twilio.sendTwilioResponse(message, senderNumber, query);
    return res.send(response.toString()).status(200);
  }

  query = NumMedia > 0 ? "image" : query;
  const result = requestDialogFlow(senderNumber, query, mediaUrl);
  if (result) twilio.sendTwilioResponse(result, senderNumber, query);

  return res.send(response.toString()).status(200);
});

const sendError = () => {
    message =
      "This phone number is not registered for conversation, please get yourself registered first. Thanks";

    twilio.sendTwilioResponse(message, senderNumber, query);
}

const checkCache = async (query) => {
  return await getAsync(query);
}