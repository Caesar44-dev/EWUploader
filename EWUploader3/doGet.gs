function doGet() {
  var output = HtmlService.createHtmlOutputFromFile('form')
      .setWidth(400)
      .setHeight(650);
  SpreadsheetApp.getUi().showModelessDialog(output, 'Subir Archivos');
}