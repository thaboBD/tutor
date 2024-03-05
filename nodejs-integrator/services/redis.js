const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

const setupFastApiListerners = async () => {
  console.log("SETTING UP LISTENERS");

  redis.subscribe("fastapi-response");

  redis.on("message", function(channel, data) {
    let { result, From, query } = data;

    let phoneNumber = From.includes("whatsapp")
    ? senderNumber
    : `whatsapp${senderNumber}`;

    twilio.sendTwilioResponse(result, phoneNumber, query);
    console.log(`Received message from channel ${channel}: ${data}`);
  });

  redis.on("error", function(error) {
    console.error("Redis error:", error);
  });
};

module.exports = {setupFastApiListerners, redis};
