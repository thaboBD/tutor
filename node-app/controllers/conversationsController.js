const catchAsync = require("../utils/catchAsync");
const { MessagingResponse } = require("twilio").twiml;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);

exports.twilioRequestHook = catchAsync(async (req, res, next) => {
  //1. Parse request body and req.from to get twilio phone number and request message
  //2. Create a new conversation using requestMessage, and userId (req.user.id), let responseMessage be empty for now
  //3. Send a request to google dialogue flow
  const twiml = new MessagingResponse();

  await client.messages.create({
    from: phoneNumber,
    body: "Sending your request to dialogue flow now!",
    to: req.user.phoneNumber,
  });

  res.type("text/xml").send(twiml.toString());
});

exports.awsResponseHook = catchAsync((req, res, next) => {
  //1. Endpoint called by AWS, with conversationId, and responseMessage
  //2. Send twilio response to phoneNumber (userId.phoneNumber)
});
