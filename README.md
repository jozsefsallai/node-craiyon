# node-craiyon

Unofficial Node.js API client for [Craiyon][craiyon-url] (formerly DALL-E Mini).

## Getting Started

Install the module using npm:

```
npm install craiyon
```

or Yarn:

```
yarn add craiyon
```

## Basic Usage

```js
const { Client } = require('craiyon');

const craiyon = new Client();
const result = await craiyon.generate({
  prompt: 'Painting of a dachshund drinking water in the style of Van Gogh',
});
```

You can then use any of the methods available in `result` to get the generated
images in any way you want.

You can learn more about the supported methods in the [documentation][docs-url].

## Customization

By default, the library will retry a request 3 times if something goes wrong.
You may change this behavior either by instantiating the client with a custom
number of maximum retries (for all generations):

```js
const craiyon = new Client().withMaxRetries(5);
```

or by setting a custom number of retries for a specific generation:

```js
const result = await craiyon.generate({
  prompt: 'Painting of a dachshund drinking water in the style of Van Gogh',
  maxRetries: 5,
});
```

## Notice

Please note that this is using a reverse-engineered backend endpoint provided by
Craiyon. The endpoint could, at any point in time, change the request and/or
response, or become unavailable for public use altogether. If you encounter any
problems with the library, please open an issue on [GitHub][github-issues-url].

## For Contributors

`node-craiyon` is written in TypeScript, therefore, you have to compile it to
JavaScript if you'd like to test your changes. You may do so using the following
command:

```
npm run build
```

The library does not currently employ any unit testing measures, however, if you
would like to contribute to the library, please make sure that your changes pass
linting. You can run the following command to check:

```
npm run lint
```

## License

MIT. Please read the LICENSE file for more information.

[craiyon-url]: https://www.craiyon.com/
[docs-url]: https://jozsefsallai.github.io/node-craiyon/
[github-issues-url]: https://github.com/jozsefsallai/node-craiyon/issues
