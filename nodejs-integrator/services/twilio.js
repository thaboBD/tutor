const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");

exports.sendTwilioResponse = catchAsync(async (message, responseNumber) => {
  console.log("*********TWILIO*********");

  if (!message) return;

  const maxRetries = 3;
  let retryDelay = 1000;

  async function attemptSend(retriesLeft) {
    try {
      await client.messages.create({
        from: twilioNumber,
        body: message,
        to: responseNumber,
      });
      console.log("Message sent successfully");
    } catch (error) {
      if (error.code === 429 && retriesLeft > 0) {
        console.log(
          `Rate limited. Retrying in ${retryDelay / 1000} seconds...`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        retryDelay *= 2;
        await attemptSend(retriesLeft - 1);
      } else {
        console.error("Error sending message:", error);
      }
    }
  }

  await attemptSend(maxRetries);
});

exports.imageS3Path = catchAsync(async (url) => {
  const auth = {
    username: accountSid,
    password: authToken,
  };

  axios
    .get(url, { auth })
    .then((response) => {
      console.log("Response:", response.data);
    })
    .catch((error) => {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
    });
});
