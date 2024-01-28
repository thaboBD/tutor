const { requestDialogflow } = require("../services/dialogflow");
const catchAsync = require("../utils/catchAsync");
const { MessagingResponse } = require("twilio").twiml;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);

exports.twilioRequestHook = catchAsync(async (req, res, next) => {
  const twiml = new MessagingResponse();

  if (!req.user) {
    await client.messages.create({
      from: twilioNumber,
      body:
        "This phone number is not registered for conversation, please get yourself registered first. Thanks",
      to: req.body.From,
    });
  }

  if (req.body.Body) {
    const result = await requestDialogflow(req.body.Body, req.user.phoneNumber);

    if (result) {
      await client.messages.create({
        from: twilioNumber,
        body: result,
        to: req.user.phoneNumber,
      });
    }
  }

  res.type("text/xml").send(twiml.toString());
});

exports.fastApiResponseHook = catchAsync(async (req, res, next) => {
  console.log(req.body);

  const result = req.body.result;
  const responseNumber = req.body.From;

  if (result) {
    await client.messages.create({
      from: twilioNumber,
      body: result,
      to: responseNumber,
    });
  }
  res.type("text/xml").send("success");
});
