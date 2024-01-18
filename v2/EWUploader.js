function doGet() {
  var output = HtmlService.createHtmlOutputFromFile('EWUploaderApp')
    .setWidth(400)
    .setHeight(560);
  SpreadsheetApp.getUi().showModelessDialog(output, 'Subir Archivos');
}

function uploadToDriveAndWordpress(data) {
  try {

    const driveResponse = uploadToDrive(data);
    const wordpressResponse = uploadToWordPress(data);

    const fileNameWithExtension = data.file.getName();
    const fileNameWithoutExtension = fileNameWithExtension.replace(/\.[^/.]+$/, "");
    const fileName2WithExtension = data.file2.getName();
    const fileName2WithoutExtension = fileName2WithExtension.replace(/\.[^/.]+$/, "");

    const ss = SpreadsheetApp.openById(data.spreadsheetId);
    const sheet = ss.getSheetByName(data.sheetName);

    const newRowData = [
      fileNameWithoutExtension, driveResponse.url, new Date(),
      fileName2WithoutExtension, wordpressResponse.url, new Date()
    ];
    sheet.appendRow(newRowData);

    return {
      drive: driveResponse,
      wordpress: wordpressResponse
    };
  } catch (error) {
    return {
      status: false,
      error: error.message
    };
  }
}

function uploadToDrive(data) {
  try {
    const folder = DriveApp.getFolderById(data.folderId);
    const image = folder.createFile(data.file);
    image.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    const response = {
      url: image.getUrl(),
      status: true
    };
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
    const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25hbnNvbHVjaW9uZXMuY29tL3BydWViYURFIiwiaWF0IjoxNzA1NTA1ODQ2LCJuYmYiOjE3MDU1MDU4NDYsImV4cCI6MTcwNjExMDY0NiwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMiJ9fX0.gu6-dBUGkKhRHWZ8w8pgzS_0PIA3h-3Kc5LqF9e6mOA'
    const wordpressApiUrl = `https://nansoluciones.com/pruebaDE/wp-json/wp/v2/media`;

    const options = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Disposition': 'attachment; filename=' + data.file2.getName(),
      },
      payload: data.file2.getBytes(),
      contentType: data.file2.getContentType(),
    };
    const response = UrlFetchApp.fetch(wordpressApiUrl, options);
    const responseData = JSON.parse(response.getContentText());
    const wordpressUrl = responseData.source_url;
    const wordpressResponse = {
      url: wordpressUrl,
      status: true
    };
    return wordpressResponse;
  } catch (error) {
    return {
      status: false,
      error: error.message
    };
  }
}

