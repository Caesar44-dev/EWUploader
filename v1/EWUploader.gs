function doGet() {
  var output = HtmlService.createHtmlOutputFromFile('EWUploaderApp')
    .setWidth(400)
    .setHeight(650);
  SpreadsheetApp.getUi().showModelessDialog(output, 'Subir Archivos');
}

function uploadToDrive(data) {
  try {
    const folder = DriveApp.getFolderById(data.folderId);
    const image = folder.createFile(data.fileImage);
    const fileNameWithExtension = data.fileImage.getName();
    const fileNameWithoutExtension = fileNameWithExtension.replace(/\.[^/.]+$/, "");
    image.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const response = {
      url: image.getUrl(),
      status: true
    };
    const ss = SpreadsheetApp.openById(data.spreadsheetId);
    const sheet = ss.getSheetByName(data.sheetName);
    const newRowData = [fileNameWithoutExtension, response.url, new Date()];
    sheet.appendRow(newRowData);
    return response;
  } catch (error) {
    return {
      status: false,
      error: error.message
    };
  }
}

function uploadToWordPress(data) {
  try {
    const wordpressApiUrl = `${data.url}/wp-json/wp/v2/media`;
    const wordpressUsername = data.username;
    const wordpressPassword = data.password;
    const fileNameWithExtension = data.fileImage2.getName();
    const fileNameWithoutExtension = fileNameWithExtension.replace(/\.[^/.]+$/, "");
    const fileContent = Utilities.base64Encode(data.fileImage2.getBytes());
    const headers = {
      'Authorization': 'Basic ' + Utilities.base64Encode(wordpressUsername + ':' + wordpressPassword),
      'Content-Type': 'application/json'
    };
    const payload = {
      file: fileContent,
      title: fileNameWithoutExtension,
      alt_text: fileNameWithoutExtension,
      caption: 'Subido el ' + new Date().toLocaleString()
    };
    const options = {
      'method': 'post',
      'headers': headers,
      'payload': JSON.stringify(payload)
    };
    const response = UrlFetchApp.fetch(wordpressApiUrl, options);
    const responseData = JSON.parse(response.getContentText());
    const wordpressUrl = responseData.link;
    const wordpressResponse = {
      url: wordpressUrl,
      status: true
    };
    const ss = SpreadsheetApp.openById(data.spreadsheetId2);
    const sheet = ss.getSheetByName(data.sheetName2);
    const newRowData = [fileNameWithoutExtension, wordpressUrl, new Date()];
    sheet.appendRow(newRowData);
    return wordpressResponse;
  } catch (error) {
    return {
      status: false,
      error: error.message
    };
  }
}
