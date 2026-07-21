/**
 * Models — Fungsi CRUD generik untuk MySQL.
 * Menggantikan Models.js + Database.js dari Google Apps Script.
 */
const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

/**
 * Mendapatkan semua record dari tabel.
 * @param {string} tableName
 * @returns {Promise<Array>}
 */
async function getRecords(tableName) {
  const [rows] = await pool.query(`SELECT * FROM \`${tableName}\``);
  return rows;
}

/**
 * Mendapatkan satu record berdasarkan field tertentu.
 * @param {string} tableName
 * @param {string} fieldName
 * @param {*} value
 * @returns {Promise<Object|null>}
 */
async function getRecordByField(tableName, fieldName, value) {
  const [rows] = await pool.query(
    `SELECT * FROM \`${tableName}\` WHERE \`${fieldName}\` = ? LIMIT 1`,
    [value]
  );
  return rows.length > 0 ? rows[0] : null;
}

/**
 * Mendapatkan record berdasarkan ID.
 * @param {string} tableName
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function getRecordById(tableName, id) {
  return getRecordByField(tableName, 'id', id);
}

/**
 * Menambahkan record baru ke tabel.
 * Otomatis generate UUID jika field 'id' tidak disediakan.
 * @param {string} tableName
 * @param {Object} recordObj
 * @returns {Promise<Object>} record yang baru ditambahkan
 */
async function addRecord(tableName, recordObj) {
  // Generate UUID jika belum ada
  if (!recordObj.id) {
    recordObj.id = uuidv4();
  }

  const columns = Object.keys(recordObj);
  const values = Object.values(recordObj);
  const placeholders = columns.map(() => '?').join(', ');
  const columnNames = columns.map(c => `\`${c}\``).join(', ');

  await pool.query(
    `INSERT INTO \`${tableName}\` (${columnNames}) VALUES (${placeholders})`,
    values
  );

  return recordObj;
}

/**
 * Mengupdate record berdasarkan ID.
 * @param {string} tableName
 * @param {string} id
 * @param {Object} updateObj — field-field yang ingin diupdate
 * @returns {Promise<boolean>}
 */
async function updateRecord(tableName, id, updateObj) {
  const columns = Object.keys(updateObj);
  const values = Object.values(updateObj);

  if (columns.length === 0) return false;

  const setClause = columns.map(c => `\`${c}\` = ?`).join(', ');
  values.push(id);

  const [result] = await pool.query(
    `UPDATE \`${tableName}\` SET ${setClause} WHERE id = ?`,
    values
  );

  return result.affectedRows > 0;
}

/**
 * Menghapus record berdasarkan ID.
 * @param {string} tableName
 * @param {string} id
 * @returns {Promise<boolean>}
 */
async function deleteRecord(tableName, id) {
  const [result] = await pool.query(
    `DELETE FROM \`${tableName}\` WHERE id = ?`,
    [id]
  );
  return result.affectedRows > 0;
}

module.exports = {
  getRecords,
  getRecordByField,
  getRecordById,
  addRecord,
  updateRecord,
  deleteRecord
};
