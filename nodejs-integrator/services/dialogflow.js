const uuid = require("uuid");
const sessionId = uuid.v4();
const dialogflow = require("@google-cloud/dialogflow");

const catchAsync = require("../utils/catchAsync");
const twilio = require("./twilio");

const projectId = process.env.DIALOGFLOW_PROJECTID;
const keyFilePath = process.env.DIALOGFLOW_CREDENTIALS_PATH;

exports.requestDialogFlow = catchAsync(
  async (phoneNumber, query, mediaUrl, callback) => {
    const sessionClient = new dialogflow.SessionsClient({
      keyFilename: keyFilePath,
    });

    const sessionPath = sessionClient.projectAgentSessionPath(
      projectId,
      sessionId
    );

    const imageS3Path = twilio.imageS3Path(mediaUrl);
    const encodedString = encodeURIComponent(mediaUrl);

    console.log("MEDIA URL", encodedString);
    console.log(query);

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
            name: `projects/${projectId}/agent/sessions/thabochatbot/contexts/specialidentifier<[]()[]>${phoneNumber}<[]()[]>${encodedString}`,
            lifespanCount: 5,
          },
        ],
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;

    twilio.sendTwilioResponse(result, phoneNumber);
  }
);
