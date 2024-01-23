function onOpen() {
  SpreadsheetApp.getUi().createMenu('EWUploader').addItem('Abrir EWUploader', 'openEWUploader').addToUi();
}

function openEWUploader() {
  var output = HtmlService.createHtmlOutputFromFile('EWUploaderApp')
    .setWidth(420)
    .setHeight(600);
  SpreadsheetApp.getUi().showSidebar(output)
}

function uploadToDriveAndWordpress(data) {
  try {
    // bearer token
    const authToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL25hbnNvbHVjaW9uZXMuY29tL3BydWViYURFIiwiaWF0IjoxNzA1NTA1ODQ2LCJuYmYiOjE3MDU1MDU4NDYsImV4cCI6MTcwNjExMDY0NiwiZGF0YSI6eyJ1c2VyIjp7ImlkIjoiMiJ9fX0.gu6-dBUGkKhRHWZ8w8pgzS_0PIA3h-3Kc5LqF9e6mOA'
    const wordpressApiUrl = `https://nansoluciones.com/pruebaDE/wp-json/wp/v2/media`; // api
    const driveFolderIdTaller = '1-eA3N4IA7dR9SG1tr1ZQgYSzx8AKuiF4'; // id carpeta taller
    const driveFolderIdUsuario = '1Z-yxW8-x6jpAbfNowLnc2jTeqdJ8v29M'; // id carpeta usuario
    let driveFolderId
    const spreadsheetId = '1cTrR_u1PrigVZVTvUsI546XQSN7WnBWySBU-KAGcZIs'; // id hoja de excel
    const sheetName = 'Hoja 1'; // nombre de hoja

    var fileName1 = data.file.name;
    var fileName2 = data.file2.name;
    let file;
    let file2;
    if (fileName1.toLowerCase().includes('vista')) {
      file2 = data.file;
    } else {
      if (fileName1.toLowerCase().includes('taller')) {
        driveFolderId = driveFolderIdTaller;
      } else if (fileName1.toLowerCase().includes('usuario')) {
        driveFolderId = driveFolderIdUsuario;
      }
      file = data.file;
    }
    if (!fileName2.toLowerCase().includes('vista')) {
      if (fileName2.toLowerCase().includes('taller')) {
        driveFolderId = driveFolderIdTaller;
      } else if (fileName2.toLowerCase().includes('usuario')) {
        driveFolderId = driveFolderIdUsuario;
      }
      file = data.file2;
    } else {
      file2 = data.file2;
    }
    const driveResponse = uploadToDrive(file, driveFolderId);
    const wordpressResponse = uploadToWordPress(file2, authToken, wordpressApiUrl);
    const fileNameWithExtension = file.getName();
    const fileNameWithoutExtension = fileNameWithExtension.replace(/\.[^/.]+$/, "");
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

function uploadToDrive(file, folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const image = folder.createFile(file);
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

function uploadToWordPress(file2, authToken, wordpressApiUrl) {
  try {
    const options = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Disposition': 'attachment; filename=' + file2.getName(),
      },
      payload: file2.getBytes(),
      contentType: file2.getContentType(),
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