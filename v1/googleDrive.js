function uploadToDrive(data) {
  try {
    // Obtener la carpeta de Google Drive por ID
    const folder = DriveApp.getFolderById(data.folderId);

    // Crear el archivo en la carpeta
    const image = folder.createFile(data.fileImage);

    // Construir la respuesta con la URL y estado
    const response = {
      url: image.getUrl(),
      status: true
    };

    // Abrir la hoja de cálculo por ID
    const ss = SpreadsheetApp.openById(data.spreadsheetId);
    
    // Obtener la hoja por nombre
    const sheet = ss.getSheetByName(data.sheetName);
    
    // Añadir una nueva fila con la URL, el primer dato y la fecha
    const newRowData = [data.fileName, response.url, new Date()];
    sheet.appendRow(newRowData);

    // Devolver la respuesta
    return response;
  } catch (error) {
    // Manejar errores y devolver una respuesta con estado false
    return {
      status: false,
      error: error.message
    };
  }
}