const uuid = require("uuid");
const dialogflow = require("@google-cloud/dialogflow");
const catchAsync = require("../utils/catchAsync");

const projectId = process.env.DIALOGFLOW_PROJECTID;
const keyFilePath = process.env.DIALOGFLOW_CREDENTIALS_PATH;
const sessionId = uuid.v4();

exports.requestDialogFlow = catchAsync(async (phoneNumber, query, mediaUrl) => {
  const sessionClient = new dialogflow.SessionsClient({
    keyFilename: keyFilePath,
  });

  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

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
          name: `projects/${projectId}/agent/sessions/thabochatbot/contexts/specialidentifier-${phoneNumber}-${mediaUrl}`,
          lifespanCount: 5,
        },
      ],
    },
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult.fulfillmentText;

  console.log(result);
  return result;
});
