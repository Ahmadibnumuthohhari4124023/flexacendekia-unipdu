/**
 * Fungsi pembantu untuk membaca seluruh baris data dari sheet tertentu sebagai array of objects.
 */
function getRecords(tableName) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName(tableName);
  if (!sheet) return [];
<<<<<<< HEAD
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Hanya header atau kosong
  
  const headers = data[0];
  const records = [];
  
=======

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Hanya header atau kosong

  const headers = data[0];
  const records = [];

>>>>>>> d9987a26ee64d14bf5c2746ff3efc2d734945487
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const record = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = row[j];
    }
    // Tambahkan rowIndex untuk referensi saat update/delete
    record._rowIndex = i + 1;
    records.push(record);
  }
  return records;
}

/**
 * Fungsi pembantu untuk menambah record baru.
 */
function addRecord(tableName, recordObj) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName(tableName);
  if (!sheet) throw new Error("Table " + tableName + " not found.");
<<<<<<< HEAD
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = [];
  
=======

  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = [];

>>>>>>> d9987a26ee64d14bf5c2746ff3efc2d734945487
  // Pastikan ada ID unik jika tabel membutuhkan
  if (headers.includes('id') && !recordObj.id) {
    recordObj.id = Utilities.getUuid();
  }
<<<<<<< HEAD
  
  for (let i = 0; i < headers.length; i++) {
    rowData.push(recordObj[headers[i]] !== undefined ? recordObj[headers[i]] : "");
  }
  
=======

  for (let i = 0; i < headers.length; i++) {
    rowData.push(recordObj[headers[i]] !== undefined ? recordObj[headers[i]] : "");
  }

>>>>>>> d9987a26ee64d14bf5c2746ff3efc2d734945487
  sheet.appendRow(rowData);
  return recordObj;
}

/**
 * Fungsi pembantu untuk mengupdate record berdasarkan field id.
 */
function updateRecord(tableName, id, updateObj) {
  const records = getRecords(tableName);
  const recordIndex = records.findIndex(r => r.id === id);
<<<<<<< HEAD
  
  if (recordIndex === -1) throw new Error("Record with id " + id + " not found in " + tableName);
  
=======

  if (recordIndex === -1) throw new Error("Record with id " + id + " not found in " + tableName);

>>>>>>> d9987a26ee64d14bf5c2746ff3efc2d734945487
  const record = records[recordIndex];
  const ss = getDatabase();
  const sheet = ss.getSheetByName(tableName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
<<<<<<< HEAD
  
  const rowIndex = record._rowIndex;
  
=======

  const rowIndex = record._rowIndex;

>>>>>>> d9987a26ee64d14bf5c2746ff3efc2d734945487
  for (let key in updateObj) {
    const colIndex = headers.indexOf(key);
    if (colIndex !== -1) {
      sheet.getRange(rowIndex, colIndex + 1).setValue(updateObj[key]);
    }
  }
  return true;
}

/**
 * Mendapatkan satu record berdasarkan field spesifik.
 */
function getRecordByField(tableName, fieldName, value) {
  const records = getRecords(tableName);
  return records.find(r => r[fieldName] === value) || null;
}
