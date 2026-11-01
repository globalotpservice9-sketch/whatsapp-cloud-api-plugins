// 5MinutesAPI - Google Sheets 2-Way Integration
var API_KEY = "YOUR_5MINUTESAPI_KEY_HERE";
var TEMPLATE_NAME = "appointment_reminder"; // Update as needed

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('WhatsApp 5MinAPI')
      .addItem('Send Alerts to New Rows', 'sendWhatsAppAlerts')
      .addToUi();
}

function sendWhatsAppAlerts() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  
  // Assuming Phone is in Column A (0), Status in Column E (4)
  for (var i = 1; i < data.length; i++) {
    var phone = data[i][0];
    var status = data[i][4];
    
    if (phone && status == "") {
      var payload = {
        "to": phone.toString().replace(/[^0-9]/g, ""),
        "whatsapp_template": TEMPLATE_NAME,
        "record_id": (i + 1).toString(), // Send Row Number as Record ID
        "callback_url": ScriptApp.getService().getUrl() // Your Web App URL
      };
      
      var options = {
        "method": "post",
        "contentType": "application/json",
        "headers": { "Authorization": "Bearer " + API_KEY },
        "payload": JSON.stringify(payload)
      };
      
      try {
        UrlFetchApp.fetch("https://api.5minutesapi.com/v1/send-message", options);
        sheet.getRange(i + 1, 5).setValue("SENT"); // Mark as sent in Col E
      } catch (e) {
        Logger.log(e);
      }
    }
  }
}

// Handle 2-Way Callback from 5MinutesAPI (Button Click)
function doPost(e) {
  var data = JSON.parse(e.postData.contents);
  if (data.event == "button_clicked") {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rowNum = parseInt(data.record_id);
    
    // Update Row Status
    sheet.getRange(rowNum, 5).setValue(data.button_clicked);
    
    if(data.button_clicked.includes("Confirm")) {
        sheet.getRange(rowNum, 1, 1, 5).setBackground("#d4edda"); // Make row Green
    } else {
        sheet.getRange(rowNum, 1, 1, 5).setBackground("#f8d7da"); // Make row Red
    }
  }
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
