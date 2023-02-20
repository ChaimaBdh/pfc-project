import * as fs from 'fs/promises';
import { getContentTypeFrom }  from '../scripts/contentTypeUtil.js';

const BASE = 'http://localhost/';

export default class RequestController {

  #request;
  #response;
  #url;

  constructor(request, response) {
    this.#request = request;
    this.#response = response;
    this.#url = new URL(this.request.url,BASE).pathname;
  }

  get response() {
    return this.#response;
  }

  get request() {
    return this.#request;
  }

  get url() {
    return this.#url;
  }

  async handleRequest() {
    this.response.setHeader("Content-Type", getContentTypeFrom(this.url));
    this.buildResponse();
  }


  async buildResponse() {
    if (this.#url == '/'){
      this.sendResponse('./public/index.html');
    }
    else if (this.#url == '/pfc'){
      this.sendResponse('./public/pfc.html');
    }
    else if (this.#url == '/about'){
      this.sendResponse('./public/about.html');
    }
    else {
      this.sendResponse('./public/'+this.#url);
    }
  }


  async sendResponse(path) {
    try {
      const data = await fs.readFile(path);
      this.response.statusCode = 200;
      this.response.write(data);
      this.response.end();
    } catch(error) { // if resource not available
      const errData = await fs.readFile('./public/error.html');
      this.response.statusCode = 404;
      this.response.write(errData);
      this.response.end();
    }
  }

}
