# nunjucks-webpack-plugin

[![NPM version](https://img.shields.io/npm/v/nunjucks-webpack-plugin.svg)](https://www.npmjs.org/package/nunjucks-webpack-plugin) 
[![Travis Build Status](https://img.shields.io/travis/itgalaxy/nunjucks-webpack-plugin/master.svg?label=build)](https://travis-ci.org/itgalaxy/nunjucks-webpack-plugin) 
[![devDependencies Status](https://david-dm.org/itgalaxy/nunjucks-webpack-plugin/dev-status.svg)](https://david-dm.org/itgalaxy/nunjucks-webpack-plugin?type=dev)
[![peerDependencies Status](https://david-dm.org/itgalaxy/nunjucks-webpack-plugin/peer-status.svg)](https://david-dm.org/itgalaxy/nunjucks-webpack-plugin?type=peer)

A webpack plugin for nunjucks.

## Install

```shell
npm install --save-dev nunjucks-webpack-plugin
```

## Usage

```js
import NunjucksWebpackPlugin from 'nunjucks-webpack-plugin';

export default {
  plugins: [
    new NunjucksWebpackPlugin({
        template: {
            from: '/path/to/template.njk',
            to: 'template.html'
        }
    })
  ]
};
```

## Options

-   `template` - (require) `object` or `array` paths (`from`, `to` and etc.) to templates.

    -   `from` - (require) `string` path to template.
    
    -   `to` - (require) `string` destination path include filename and extension (relative `output` webpack option).
    
    -   `context` - (optional) instead global context (see above), 
        see [render](https://mozilla.github.io/nunjucks/api.html#render) second argument.
    
    -   `callback` - (optional) instead global callback (see above), 
        see [render](https://mozilla.github.io/nunjucks/api.html#render) third argument.

-   `context` - (optional) use if template `context` is null or undefined, 
    see [render](https://mozilla.github.io/nunjucks/api.html#render) second argument.

-   `callback` - (optional) use if template `callback` is null or undefined,
    see [render](https://mozilla.github.io/nunjucks/api.html#render) third argument.

-   `configure` - (optional) see [configure](https://mozilla.github.io/nunjucks/api.html#configure) options.

-   `writeToFileWhenMemoryFs` - (optional, default: true) - write templates to disk when using Memory filesystem,
    useful when use `watch`.

## Contribution

Feel free to push your code if you agree with publishing under the MIT license.

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
