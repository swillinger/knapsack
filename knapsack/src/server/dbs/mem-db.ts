import md5 from 'md5';

/**
 * Creates an in-memory database for temporary storage
 */
export class MemDb {
  db: Record<any, any>;

  constructor() {
    this.db = new Map();
  }

  /**
   * @param data - data to store, must be serializable
   * @returns md5 hash used to retrieve data later
   */
  addData(data: object): string {
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
   * @param hash - md5 hash of data to retrieve
   * @returns if data is found, then it's returned, if not then `null`
   */
  getData(hash: string): null | object {
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
