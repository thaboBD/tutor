const { requestDialogFlow } = require("../services/dialogflow");
const { uploadFile } = require("../services/s3");

const catchAsync = require("../utils/catchAsync");
const { MessagingResponse } = require("twilio").twiml;
const sendTwilioResponse = require("../services/twilio");

exports.twilioRequestHook = catchAsync(async (req, res, next) => {
  const { body } = req;
  const { NumMedia, From: senderNumber, MessageSid, Body } = body;
  const mediaUrl = body[`MediaUrl${0}`];
  const response = new MessagingResponse();

  console.log("CURENT USER", req.user)

  if (!req.user) {
    (message =
      "This phone number is not registered for conversation, please get yourself registered first. Thanks"),
      (message, senderNumber);
  }

  // will upload to s3 if required
  // const imageLocation = uploadFile(mediaItem);
  const query = NumMedia > 0 ? "image" : Body;

  const result = requestDialogFlow(senderNumber, query, mediaUrl);

  if (result) sendTwilioResponse(result, senderNumber);

  return res.send(response.toString()).status(200);
});

exports.fastApiResponseHook = catchAsync(async (req, res, next) => {
  const { result, From: senderNumber } = req.body;

  let phoneNumber = senderNumber.includes("whatsapp")
    ? senderNumber
    : `whatsapp${senderNumber}`;

  if (result) sendTwilioResponse(result, phoneNumber);

  res.type("text/xml").send("success");
});
