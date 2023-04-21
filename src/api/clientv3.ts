import axios from 'axios';
import CraiyonOutput from '../models/CraiyonOutput';
import sleep from '../utils/sleep';

/**
 * Contains the different models Craiyon can use for its drawing.
 * @enum
 */
export enum CraiyonModel {
  None = 'none',
  Art = 'art',
  Drawing = 'drawing',
  Photo = 'photo',
}

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
  negative_prompt?: string;
  model?: CraiyonModel;
}

/**
 * @api public
 * @class CraiyonClient
 * @classdesc An API client for Craiyon.
 */
class Client {
  static GENERATE_IMAGES_URL = '/v3';
  static VERSION = 3;
  static MODELS = CraiyonModel;

  private baseUrl: string;
  private maxRetries: number;
  private apiToken?: string;
  private modelVersion: string;

  constructor() {
    this.baseUrl = 'https://api.craiyon.com';
    this.maxRetries = 3;
    this.apiToken = undefined;
    this.modelVersion = '35s5hfwn9n78gb06';
  }

  /**
   * A builder function that sets the base URL of the Craiyon backend instance.
   *
   * @param baseUrl The base URL to use. Must not include the `/draw`
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
   * A builder function that sets the model version.
   *
   * @param modelVersion The craiyon model to use.
   * @returns {CraiyonClient} The modified client instance.
   */
  withModelVersion(modelVersion: string): Client {
    this.modelVersion = modelVersion;
    return this;
  }

  /**
   * A builder function that sets the model version.
   *
   * @param modelVersion The craiyon model to use.
   * @returns {CraiyonClient} The modified client instance.
   */
  withApiToken(apiToken: string): Client {
    this.apiToken = apiToken;
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
    negative_prompt,
    model,
  }: CraiyonGenerateRequestOptions): Promise<CraiyonOutput> {
    const url = this.makeGenerateImagesUrl();
    const retries = maxRetries ?? this.maxRetries;
    model = model ?? CraiyonModel.None;
    negative_prompt = negative_prompt ?? '';
    const data = {
      prompt,
      version: this.modelVersion,
      token: this.apiToken,
      model,
      negative_prompt,
    };
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      const image_responses = await Promise.all(
        response.data.images.map(async (item: string) => {
          return await axios.get(`https://img.craiyon.com/${item}`, {
            responseType: 'arraybuffer',
          });
        }),
      );
      const output = CraiyonOutput.fromJSON({
        images: image_responses.map((r: any) => {
          return Buffer.from(r.data, 'binary').toString('base64');
        }),
      });
      return output;
    } catch (err: any) {
      if (retries > 0) {
        if (err.response && err.response.status === 429) {
          await sleep(10000);
        }

        return this.generate({
          prompt,
          maxRetries: retries - 1,
          negative_prompt,
          model,
        });
      }

      throw err;
    }
  }

  private makeGenerateImagesUrl(): string {
    return `${this.baseUrl}${Client.GENERATE_IMAGES_URL}`;
  }
}

export default Client;
