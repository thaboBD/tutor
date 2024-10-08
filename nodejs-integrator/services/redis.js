const Redis = require("ioredis");
const twilio = require("./twilio")

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const setupFastApiListerners = async () => {
  const subscriber = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  });

  subscriber.subscribe("fastapi-response");

  subscriber.on("message", function(channel, data) {
    console.log(`Received message from channel ${channel}: ${data}`);
    let validJsonString = data.replace(/'/g, '"');
    let parsedData = JSON.parse(validJsonString);
    let { result, From: senderNumber, query } = parsedData;


    let phoneNumber = senderNumber?.includes("whatsapp")
      ? senderNumber
      : `whatsapp${senderNumber}`;

    twilio.sendTwilioResponse(result, phoneNumber, query);
  });

  subscriber.on("error", function(error) {
    console.error("Redis error:", error);
  });
};

module.exports = {setupFastApiListerners, redis};
