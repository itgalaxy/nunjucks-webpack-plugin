# nunjucks-webpack-plugin

[![NPM version](https://img.shields.io/npm/v/nunjucks-webpack-plugin.svg)](https://www.npmjs.org/package/nunjucks-webpack-plugin)
[![Travis Build Status](https://img.shields.io/travis/itgalaxy/nunjucks-webpack-plugin/master.svg?label=build)](https://travis-ci.org/itgalaxy/nunjucks-webpack-plugin)
[![devDependencies Status](https://david-dm.org/itgalaxy/nunjucks-webpack-plugin/dev-status.svg)](https://david-dm.org/itgalaxy/nunjucks-webpack-plugin?type=dev)
[![peerDependencies Status](https://david-dm.org/itgalaxy/nunjucks-webpack-plugin/peer-status.svg)](https://david-dm.org/itgalaxy/nunjucks-webpack-plugin?type=peer)
[![Greenkeeper badge](https://badges.greenkeeper.io/itgalaxy/nunjucks-webpack-plugin.svg)](https://greenkeeper.io)

A webpack plugin for nunjucks.

## Install

```shell
npm install --save-dev nunjucks-webpack-plugin
```

## Usage

```js
import NunjucksWebpackPlugin from "nunjucks-webpack-plugin";

export default {
  plugins: [
    new NunjucksWebpackPlugin({
      templates: [
        {
          from: "/path/to/template.njk",
          to: "template.html"
        }
      ]
    })
  ]
};
```

It is possible to use multiple templates:

```js
import NunjucksWebpackPlugin from "nunjucks-webpack-plugin";

export default {
  plugins: [
    new NunjucksWebpackPlugin({
      templates: [
        {
          from: "/path/to/template.njk",
          to: "template.html"
        },
        {
          from: "/path/to/next-template.njk",
          to: "next-template.html"
        }
      ]
    })
  ]
};
```

## Options

* `templates` - (require) `array` list of templates.

  * `from` - (require) `string` path to template.

  * `to` - (require) `string` destination path include filename and extension
    (relative `output` webpack option).

  * `context` - (optional) instead global `context` (see above), see
    [render](https://mozilla.github.io/nunjucks/api.html#render) second
    argument. The following webpack compilation variables are also sent
    through to the template under the `__webpack__` object:

    * hash

  * `callback` - (optional) instead global `callback` (see above), see
    [render](https://mozilla.github.io/nunjucks/api.html#render) third argument.

  * `writeToFileEmit` - (optional, default: false) - If set to `true` will emit
    to build folder and memory in combination with `webpack-dev-server`

* `configure` - (optional) `object` or `nunjucks.Environment` see
  [configure](https://mozilla.github.io/nunjucks/api.html#configure) options.

## Contribution

Feel free to push your code if you agree with publishing under the MIT license.

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
