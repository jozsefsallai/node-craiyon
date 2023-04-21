import axios from 'axios';
import CraiyonOutput from '../models/CraiyonOutput';
import sleep from '../utils/sleep';

/**
 * Contains the options for a Craiyon image generation request.
 *
 * @typedef {Object} CraiyonOptions
 * @property {string} [prompt] The prompt to generate an image for.
 * @property {number?} [maxRetries] The maximum number of retries to attempt.
 */
export interface CraiyonGenerateRequestOptions {
  prompt: string;
  maxRetries?: number;
}

/**
 * @api public
 * @class CraiyonClient
 * @classdesc An API client for Craiyon.
 */
class Client {
  static GENERATE_IMAGES_URL = '/generate';
  static VERSION = 1;

  private baseUrl: string;
  private maxRetries: number;

  constructor() {
    this.baseUrl = 'https://backend.craiyon.com';
    this.maxRetries = 3;
  }

  /**
   * A builder function that sets the base URL of the Craiyon backend instance.
   *
   * @param baseUrl The base URL to use. Must not include the `/generate`
   *                endpoint.
   * @returns {CraiyonClient} The modified client instance.
   */
  withBaseUrl(baseUrl: string): Client {
    this.baseUrl = baseUrl;
    return this;
  }

  /**
   * A builder function that sets the maximum number of retries to attempt.
   *
   * @param maxRetries The maximum number of retries to attempt.
   * @returns {CraiyonClient} The modified client instance.
   */
  withMaxRetries(maxRetries: number): Client {
    this.maxRetries = maxRetries;
    return this;
  }

  /**
   * Generates an image for the given prompt. The retries will be throttled by
   * 10 seconds if an HTTP Too Many Requests error is returned.
   *
   * @param {CraiyonOptions} options The options to use for the request.
   * @returns {Promise<CraiyonOutput>} A promise that resolves to the output of
   *                                   the image generation.
   * @throws {Error} If the request fails after the maximum number of retries.
   */
  async generate({
    prompt,
    maxRetries,
  }: CraiyonGenerateRequestOptions): Promise<CraiyonOutput> {
    const url = this.makeGenerateImagesUrl();
    const retries = maxRetries ?? this.maxRetries;

    try {
      const response = await axios.post(
        url,
        { prompt },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        },
      );

      const output = CraiyonOutput.fromJSON(response.data);
      return output;
    } catch (err: any) {
      if (retries > 0) {
        if (err.response && err.response.status === 429) {
          await sleep(10000);
        }

        return this.generate({ prompt, maxRetries: retries - 1 });
      }

      throw err;
    }
  }

  private makeGenerateImagesUrl(): string {
    return `${this.baseUrl}${Client.GENERATE_IMAGES_URL}`;
  }
}

export default Client;
