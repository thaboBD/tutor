const Redis = require("ioredis");

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
    let { result, From: senderNumber, query } = data;

    console.log(`Received message from channel ${channel}: ${data}`);

    let phoneNumber = From?.includes("whatsapp")
      ? senderNumber
      : `whatsapp${senderNumber}`;

    twilio.sendTwilioResponse(result, phoneNumber, query);
  });

  subscriber.on("error", function(error) {
    console.error("Redis error:", error);
  });
};

module.exports = {setupFastApiListerners, redis};
