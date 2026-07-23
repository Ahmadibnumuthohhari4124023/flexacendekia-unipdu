/**
 * Fungsi pembantu untuk membaca seluruh baris data dari sheet tertentu sebagai array of objects.
 */
function getRecords(tableName) {
  const ss = getDatabase();
  const sheet = ss.getSheetByName(tableName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return []; // Hanya header atau kosong
  
  const headers = data[0];
  const records = [];
  
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
  
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const rowData = [];
  
  // Pastikan ada ID unik jika tabel membutuhkan
  if (headers.includes('id') && !recordObj.id) {
    recordObj.id = Utilities.getUuid();
  }
  
  for (let i = 0; i < headers.length; i++) {
    rowData.push(recordObj[headers[i]] !== undefined ? recordObj[headers[i]] : "");
  }
  
  sheet.appendRow(rowData);
  return recordObj;
}

/**
 * Fungsi pembantu untuk mengupdate record berdasarkan field id.
 */
function updateRecord(tableName, id, updateObj) {
  const records = getRecords(tableName);
  const recordIndex = records.findIndex(r => r.id === id);
  
  if (recordIndex === -1) throw new Error("Record with id " + id + " not found in " + tableName);
  
  const record = records[recordIndex];
  const ss = getDatabase();
  const sheet = ss.getSheetByName(tableName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  const rowIndex = record._rowIndex;
  
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
