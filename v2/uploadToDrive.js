function uploadToDrive(data) {
  try {
    const folder = DriveApp.getFolderById(data.folderId);
    const image = folder.createFile(data.fileImage);
    const response = {
      url: image.getUrl(),
      status: true
    };
    const ss = SpreadsheetApp.openById(data.spreadsheetId);
    const sheet = ss.getSheetByName(data.sheetName);
    const newRowData = [data.fileName, response.url, new Date()];
    sheet.appendRow(newRowData);
    return response;
  } catch (error) {
    return {
      status: false,
      error: error.message
    };
  }
}