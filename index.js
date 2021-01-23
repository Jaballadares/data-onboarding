const pathToSecrets = "";
if (!pathToSecrets) {
  console.log(
    "Please set the path to your Google Service Account JSON File - Line 1"
  );
}
const testingJson = require("./sample/sampleCsv.json");
const { google } = require("googleapis");

/**
 * Function to authenticate to Google API service
 *
 *  * @return {promise} Use `connect().then` to perform any actions within Gsuite
 *
 */

const connect = () => {
  return new Promise((resolve, reject) => {
    const scopes = [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ];
    const auth = new google.auth.JWT(
      serviceAccount.client_email,
      null,
      serviceAccount.private_key,
      scopes
    );
    auth.authorize((err) => {
      if (err) {
        console.log("BAD: Auhtorization Failed:", err);
        reject(err);
      } else {
        console.log("GOOD: Successfully connected!");
        resolve(auth);
      }
    });
  });
};

// Check whether or not we can connect to Google Drive service
connect()
  .then((auth) => {
    // TODO: move imports to sensible location
    const drive = google.drive({ version: "v3", auth });
    return drive.files.list({
      pageSize: 10,
      fields: "nextPageToken, files(id, name)",
    });
  })
  .then((driveFiles) => {
    console.log("Here are your Google Drive Files:", driveFiles);
  });

// TODO: Refactor to Async/Await
connect().then((auth) => {
  // TODO: Pass `sheetId` from sheet that will be created
  // earlier in this process

  const sheetId = "Your Google Sheet ID";
  const sheets = google.sheets({ version: "v4", auth });

  sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    valueInputOption: "USER_ENTERED",
    includeValuesInResponse: true,
    range: "A1",
    resource: {
      range: "A1",
      majorDimension: "ROWS",
      values: testingJson,
    },
  });
});
