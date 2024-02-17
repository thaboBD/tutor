const uuid = require("uuid");
const sessionId = uuid.v4();
const dialogflow = require("@google-cloud/dialogflow");

const catchAsync = require("../utils/catchAsync");
const sendTwilioResponse = require("./twilio");

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

    console.log("MEDIA URL", mediaUrl);
    console.log(query);

    const encodedString = encodeURIComponent(mediaUrl);
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
            name: `projects/${projectId}/agent/sessions/thabochatbot/contexts/specialidentifier-${phoneNumber}-${encodedString}`,
            lifespanCount: 5,
          },
        ],
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult.fulfillmentText;

    sendTwilioResponse(result, phoneNumber);
  }
);
