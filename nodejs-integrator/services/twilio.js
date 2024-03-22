const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);
const catchAsync = require("../utils/catchAsync");
const axios = require("axios");
const util = require("util");

const {redis} = require("./redis");
const getAsync = util.promisify(redis.get).bind(redis);

exports.sendTwilioResponse = catchAsync(async (message, responseNumber, query) => {
  console.log("*********TWILIO*********");
  if (!message || !responseNumber) {
    console.log(message)
    console.log(responseNumber)
    console.error("EMPTY MESSAGE OR RESPONSE NUMBER");
    return;
  }

  // donot send reponse if already sent, expires after 5 seconds
  const uniqueKey = `${query}:${responseNumber}`;
  const isAlreadySent = await getAsync(uniqueKey);

  if(isAlreadySent){
    console.log("RESPONSE IS ALREADY SENT < 5 seconds")
    return;
  }
  redis.set(uniqueKey, true , "EX", 5);

  const isAlreadyCached = await getAsync(query);
  if(!isAlreadyCached){
    redis.set(query, message, "EX", 60);
  }

  const maxRetries=3
  const retryDelay = 1000;
  await attemptSend(maxRetries, message, responseNumber, retryDelay);
});


const attemptSend = async (retriesLeft, message, responseNumber) => {
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
        await attemptSend(retriesLeft -1 , message, responseNumber, retryDelay* 2);
      } else {
        console.error("Error sending message:", error);
      }
    }
}

exports.imageS3Path = async (url) => {
  if(!url) return Promise.resolve('no-image-attached');

  const auth = {
    username: accountSid,
    password: authToken,
  };

  return new Promise((resolve, reject) => {
    axios
      .get(url, { auth })
      .then((response) => {
        console.log(response.request.res.responseUrl);
        resolve(response.request.res.responseUrl);
      })
      .catch((error) => {
        console.error("Error fetching image from S3:", error);
        reject(error);
      });
  });
};
