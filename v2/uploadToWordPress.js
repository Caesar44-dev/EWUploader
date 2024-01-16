function uploadToWordPress(data) {
  try {
    const wordpressApiUrl = `${data.url}/wp-json/wp/v2/media`;
    const wordpressUsername = data.username;
    const wordpressPassword = data.password;
    const fileContent = Utilities.base64Encode(data.fileImage2.getBytes());
    const headers = {
      'Authorization': 'Basic ' + Utilities.base64Encode(wordpressUsername + ':' + wordpressPassword),
      'Content-Type': 'application/json'
    };
    const payload = {
      file: fileContent,
      title: data.fileName2,
      alt_text: data.fileName2,
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
    const newRowData = [data.fileName2, wordpressUrl, new Date()];
    sheet.appendRow(newRowData);
    return wordpressResponse;
  } catch (error) {
    return {
      status: false,
      error: error.message
    };
  }
}