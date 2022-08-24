import * as fs from 'fs';

/**
 * @api public
 * @class CraiyonImage
 * @classdesc Represents a single image from a Craiyon image generation output.
 */
class CraiyonImage {
  private base64: string;

  /**
   * @constructor
   * @param {string} base64 The base64-encoded image data.
   */
  constructor(base64: string) {
    this.base64 = base64.replace(/\n/g, '');
  }

  /**
   * Will return the base64 representation of the image.
   *
   * @returns {string} The base64-encoded string.
   */
  asBase64(): string {
    return this.base64;
  }

  /**
   * Will create a buffer from the base64 representation of the image.
   *
   * @returns {Buffer} The buffer containing the image data.
   */
  asBuffer(): Buffer {
    return Buffer.from(this.base64, 'base64');
  }

  /**
   * Will write the image to the given path asynchronously.
   *
   * @param {string} path The path to write the image to.
   */
  async saveToFile(path: string): Promise<void> {
    await fs.promises.writeFile(path, this.asBuffer());
  }

  /**
   * Will write the image to the given path synchronously.
   *
   * @param {string} path The path to write the image to.
   */
  saveToFileSync(path: string): void {
    fs.writeFileSync(path, this.asBuffer());
  }

  /**
   * Will create a read stream from the image.
   *
   * @returns {Readable} The readable stream.
   */
  stream(): fs.ReadStream {
    return fs.createReadStream(this.asBuffer());
  }
}

export default CraiyonImage;
