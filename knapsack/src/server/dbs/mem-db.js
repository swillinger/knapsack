const md5 = require('md5');

/**
 * Creates an in-memory database for temporary storage
 */
class MemDb {
  constructor() {
    this.db = new Map();
  }

  /**
   * @param {object} data - data to store, must be serializable
   * @returns {string} md5 hash used to retrieve data later
   */
  addData(data) {
    const hash = md5(JSON.stringify(data));
    if (this.db.has(hash)) return hash;
    const time = new Date().getTime();
    this.db.set(hash, {
      accessed: 0,
      dateCreated: time,
      dateLastAccessed: time,
      data,
    });
    return hash;
  }

  /**
   * @param {string} hash - md5 hash of data to retrieve
   * @returns {null|object} - if data is found, then it's returned, if not then `null`
   */
  getData(hash) {
    const item = this.db.get(hash);
    if (!item) return null;
    this.db.set(hash, {
      ...item,
      accessed: item.accessed + 1,
      dateLastAccessed: new Date().getTime(),
    });
    return item.data;
  }
}

module.exports = {
  MemDb,
};
