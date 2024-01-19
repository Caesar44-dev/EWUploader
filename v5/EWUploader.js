function onOpen() {
  SpreadsheetApp.getUi().createMenu('EWUploader').addItem('Abrir EWUploader', 'openEWUploader').addToUi();
}

function openEWUploader() {
  var output = HtmlService.createHtmlOutputFromFile('EWUploaderApp')
    .setWidth(420)
    .setHeight(600);
  // SpreadsheetApp.getUi().showModelessDialog(output, 'EWUploader');
  SpreadsheetApp.getUi().showSidebar(output)
}

function uploadToDriveAndWordpress(data) {
  try {
    // bearer token
    const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25hbnNvbHVjaW9uZXMuY29tL3BydWViYURFIiwiaWF0IjoxNzA1NTA1ODQ2LCJuYmYiOjE3MDU1MDU4NDYsImV4cCI6MTcwNjExMDY0NiwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMiJ9fX0.gu6-dBUGkKhRHWZ8w8pgzS_0PIA3h-3Kc5LqF9e6mOA'
    const wordpressApiUrl = `https://nansoluciones.com/pruebaDE/wp-json/wp/v2/media`; // api
    const folderId = '10NXqk793lm7HRStv7xVrYhYtk_0SGOIA'; // id carpeta
    const spreadsheetId = '1pjZyieQjI3alcWCBh6pv8rfK-ySbGH78fSbRh9A-qVc'; // id hoja de excel
    const sheetName = 'Hoja 1'; // nombre de hoja

    const driveResponse = uploadToDrive(data, folderId);
    const wordpressResponse = uploadToWordPress(data, authToken, wordpressApiUrl);
    const fileNameWithExtension = data.file.getName();
    const fileNameWithoutExtension = fileNameWithExtension.replace(/\.[^/.]+$/, "");
    // const fileName2WithExtension = data.file2.getName();
    // const fileName2WithoutExtension = fileName2WithExtension.replace(/\.[^/.]+$/, "");
    const ss = SpreadsheetApp.openById(spreadsheetId);
    const sheet = ss.getSheetByName(sheetName);
    const newRowData = [
      fileNameWithoutExtension, driveResponse.url, wordpressResponse.url
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

function uploadToDrive(data, folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
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

function uploadToWordPress(data, authToken, wordpressApiUrl) {
  try {
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