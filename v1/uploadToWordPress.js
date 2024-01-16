function uploadToWordPress(data) {
  try {
    // Configuración de la API de WordPress
    const wordpressApiUrl = 'https://tudominio.com/wp-json/wp/v2/media';
    const wordpressUsername = 'tu_usuario';
    const wordpressPassword = 'tu_contraseña';

    // Crear el archivo en WordPress
    const fileContent = Utilities.base64Encode(data.fileImage.getBytes());
    const headers = {
      'Authorization': 'Basic ' + Utilities.base64Encode(wordpressUsername + ':' + wordpressPassword),
      'Content-Type': 'application/json'
    };
    const payload = {
      file: fileContent,
      title: data.fileName,
      alt_text: data.fileName,
      caption: 'Subido el ' + new Date().toLocaleString()
    };
    const options = {
      'method': 'post',
      'headers': headers,
      'payload': JSON.stringify(payload)
    };
    const response = UrlFetchApp.fetch(wordpressApiUrl, options);
    const responseData = JSON.parse(response.getContentText());

    // Construir la respuesta con la URL y estado
    const wordpressUrl = responseData.link;
    const wordpressResponse = {
      url: wordpressUrl,
      status: true
    };

    // Registrar la información en la hoja de cálculo
    const ss = SpreadsheetApp.openById(data.spreadsheetId);
    const sheet = ss.getSheetByName(data.sheetName);
    const newRowData = [data.fileName, wordpressUrl, new Date()];
    sheet.appendRow(newRowData);

    // Devolver la respuesta
    return wordpressResponse;
  } catch (error) {
    // Manejar errores y devolver una respuesta con estado false
    return {
      status: false,
      error: error.message
    };
  }
}