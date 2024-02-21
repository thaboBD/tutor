const uuid = require("uuid");
const sessionId = uuid.v4();
const dialogflow = require("@google-cloud/dialogflow");

const catchAsync = require("../utils/catchAsync");
const twilio = require("./twilio");

const projectId = process.env.DIALOGFLOW_PROJECTID;
const keyFilePath = process.env.DIALOGFLOW_CREDENTIALS_PATH;
const { struct } = require("pb-util");

const redis = require("./redis");

exports.requestDialogFlow = catchAsync(
  async (phoneNumber, query, mediaUrl, startTime) => {
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: keyFilePath,
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    twilio
      .imageS3Path(mediaUrl)
      .then((imageS3Path) => {
        if (imageS3Path) {
          if(mediaUrl) redis.set(phoneNumber, imageS3Path);

          const request = {
            session: sessionPath,
            queryInput: {
              text: {
                text: query,
                languageCode: "en-US",
              },
            },
            queryParams: {
              contexts: [
                {
                  name: `projects/${projectId}/agent/sessions/thabochatbot/contexts/specialidentifier<[]()[]>${phoneNumber}`,
                  lifespanCount: 5,
                },
              ],
            },
          };

          sessionClient
            .detectIntent(request)
            .then((responses) => {
              const result = responses[0].queryResult.fulfillmentText;
              twilio.sendTwilioResponse(result, phoneNumber);
            })
            .catch((error) => {
              console.error("Error detecting intent:", error);
            });
        } else {
          console.log("S3 image path not found");
        }
      })
      .catch((error) => {
        console.error("Error getting S3 image path:", error);
      });
  }
);
