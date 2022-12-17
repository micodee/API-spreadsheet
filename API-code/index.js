const express = require("express");
const { google } = require("googleapis");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/", async (req, res) => {
  const { name, harga } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1oYuILfV20NnYFzOqhKJ8rQT_M4F0NdS9UxWEmvsSRYg";

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // mengambil data spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
  });

  // menulis data ke spreadsheet
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:A",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[name, harga]],
    },
  });

  // res.render("index");
  res.send(getRows.data.values);
});

app.listen(1337, (req, res) => console.log("running on 1337"));
