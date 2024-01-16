function doGet() {
  return HtmlService.createHtmlOutputFromFile('form')
      .setTitle('Subir Archivo a Google Drive')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
}