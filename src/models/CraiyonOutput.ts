import CraiyonImage from './CraiyonImage';

/**
 * @api public
 * @class CraiyonOutput
 * @classdesc Represents a Craiyon response.
 */
class CraiyonOutput {
  private readonly _images: CraiyonImage[];
  private readonly _version: string;

  /**
   * @constructor
   * @param {CraiyonImage[]} images An array of image objects.
   * @param {string} version The version of the Craiyon model used to generate
   *                         the images.
   */
  constructor(images: CraiyonImage[], version: string) {
    this._images = images;
    this._version = version;
  }

  /**
   * A factory function that will create a CraiyonOutput instance from the given
   * JSON response.
   *
   * @param {object} json The JSON response to parse.
   * @returns {CraiyonOutput} The parsed CraiyonOutput instance.
   */
  static fromJSON(json: any): CraiyonOutput {
    const images = json.images.map((image: string) => new CraiyonImage(image));
    return new CraiyonOutput(images, json.version);
  }

  /**
   * Will return the base64 representation of the images in the output.
   *
   * @returns {string[]} An array of base64-encoded images.
   */
  asBase64(): string[] {
    return this._images.map((image: CraiyonImage) => image.asBase64());
  }

  /**
   * Will return an array of buffers containing the images in the output.
   *
   * @returns {Buffer[]} An array of buffers containing the image data.
   */
  asBuffers(): Buffer[] {
    return this._images.map((image: CraiyonImage) => image.asBuffer());
  }

  /**
   * Getter for the array of Craiyon image objects.
   *
   * @returns {CraiyonImage[]} The array of Craiyon image objects.
   */
  get images(): CraiyonImage[] {
    return this._images;
  }

  /**
   * Getter for the version of the Craiyon model used to generate the images.
   *
   * @returns {string} The version of the Craiyon model.
   */
  get version(): string {
    return this._version;
  }
}

export default CraiyonOutput;
