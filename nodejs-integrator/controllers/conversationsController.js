const { requestDialogFlow } = require("../services/dialogflow");
const { uploadFile } = require("../services/s3");

const catchAsync = require("../utils/catchAsync");
const { MessagingResponse } = require("twilio").twiml;
const twilio = require("../services/twilio");

exports.twilioRequestHook = catchAsync(async (req, res, next) => {
  const startTime = Date.now();

  const { body } = req;
  const { NumMedia, From: senderNumber, MessageSid, Body } = body;
  const mediaUrl = body[`MediaUrl${0}`];
  const response = new MessagingResponse();

  if (!req.user) {
    message =
      "This phone number is not registered for conversation, please get yourself registered first. Thanks";

    twilio.sendTwilioResponse(message, senderNumber, Body);
    return res.send(response.toString()).status(200);
  }

  const query = NumMedia > 0 ? "image" : Body;
  const result = requestDialogFlow(senderNumber, query, mediaUrl, startTime);
  if (result) twilio.sendTwilioResponse(result, senderNumber, query);

  return res.send(response.toString()).status(200);
});

exports.fastApiResponseHook = catchAsync(async (req, res, next) => {
  const { query, result, From: senderNumber } = req.body;

  let phoneNumber = senderNumber.includes("whatsapp")
    ? senderNumber
    : `whatsapp${senderNumber}`;

  if (result) twilio.sendTwilioResponse(result, phoneNumber, query);

  res.type("text/xml").send("success");
});
