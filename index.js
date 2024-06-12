
// This line declares a variable called "app" and assigns it a reference to a Google Spreadsheet specified by its URL
let app = SpreadsheetApp.openByUrl("Your_Google_Sheet_URL");
// This line declares a variable called "sheet" and assigns it a reference to a specific sheet within the spreadsheet specified by its name
let sheet = app.getSheetByName("Your_Google_Sheet_Name");

// This function is called when a POST request is made to the URL of the script
function doPost(e){
  try{
    // This line parses the request data as a JSON object and assigns it to a variable called "obj"
    let obj = JSON.parse(e.postData.contents);
    // This line decodes the base64-encoded image data and assigns it to a variable called "dcode"
    let dcode = Utilities.base64Decode(obj.base64);
    // This line creates a new blob from the decoded data, with the specified MIME type and filename, and assigns it to a variable called "blob"
    let blob = Utilities.newBlob(dcode,obj.type,obj.name);
    // This line creates a new file in the user's Google Drive from the blob data and assigns it to a variable called "newFile"
    let newFile = DriveApp.createFile(blob);
    // This line sets the sharing permissions of the new file to "anyone with the link can view", and gets a URL for downloading the file, which is assigned to a variable called "link"
    let link = newFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK,DriveApp.Permission.VIEW).getDownloadUrl();
    // This line gets the index of the last row in the sheet and assigns it to a variable called "lr"
    let lr = sheet.getLastRow();
    // This line sets a formula in the first column of the next row after the last row, which displays the image using the specified URL, and assigns it to a range
    sheet.getRange(lr+1,1).setFormula(`=IMAGE("${link}")`);
    // This line returns a plain text response indicating that the image was uploaded
    return ContentService.createTextOutput("image uploaded")
  }catch(err){
    // This line returns an error message as a plain text response if there was an error during the upload process
    return ContentService.createTextOutput(err)
  }
}