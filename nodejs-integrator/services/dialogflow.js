const dialogflow = require("@google-cloud/dialogflow");
const fs = require("fs");

const uuid = require("uuid");
const catchAsync = require("../utils/catchAsync");

exports.requestDialogflow = catchAsync(async (query) => {
  const projectId = process.env.DIALOGFLOW_PROJECTID;
  const keyFilePath = process.env.DIALOGFLOW_CREDENTIALS_PATH;
  const sessionId = uuid.v4();

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
  };

  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult.fulfillmentText;
  const queryText = responses[0].queryResult.queryText;

  console.log(result);
  if (result) return result;

  return null;
});
