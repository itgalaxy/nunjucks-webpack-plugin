"use strict";

const fs = require("fs-extra");
const path = require("path");
const nunjucks = require("nunjucks");

class NunjucksWebpackPlugin {
  constructor(options) {
    this.options = Object.assign(
      {},
      {
        configure: {
          options: {},
          path: ""
        },
        templates: []
      },
      options || {}
    );

    if (
      !Array.isArray(this.options.templates) ||
      this.options.templates.length === 0
    ) {
      throw new Error("Options `templates` must be an empty array");
    }
  }

  apply(compiler) {
    const fileDependencies = [];

    let output = compiler.options.output.path;

    if (
      output === "/" &&
      compiler.options.devServer &&
      compiler.options.devServer.outputPath
    ) {
      output = compiler.options.devServer.outputPath;
    }

    compiler.plugin("emit", (compilation, callback) => {
      nunjucks.configure(
        this.options.configure.path,
        this.options.configure.options
      );

      const promises = [];

      this.options.templates.forEach(template => {
        if (!template.from) {
          throw new Error("Each template should have `from` option");
        }

        if (!template.to) {
          throw new Error("Each template should have `to` option");
        }

        if (fileDependencies.indexOf(template.from) === -1) {
          fileDependencies.push(template.from);
        }

        const localContext = template.context ? template.context : null;
        const localCallback = template.callback ? template.callback : null;

        const res = nunjucks.render(
          template.from,
          Object.assign({}, localContext),
          localCallback
        );

        let webpackTo = template.to;

        if (path.isAbsolute(webpackTo)) {
          webpackTo = path.relative(output, webpackTo);
        }

        const source = {
          size: () => res.length,
          source: () => res
        };

        compilation.assets[webpackTo] = source;

        if (template.writeToFileEmit) {
          const fileDest = path.join(output, webpackTo);

          promises.push(fs.outputFile(fileDest, source.source()));
        }
      });

      return (
        Promise.all(promises)
          // eslint-disable-next-line promise/no-callback-in-promise
          .then(() => callback())
          .catch(error => {
            compilation.errors.push(error);

            // eslint-disable-next-line promise/no-callback-in-promise
            return callback();
          })
      );
    });

    compiler.plugin("after-emit", (compilation, callback) => {
      fileDependencies.forEach(file => {
        if (compilation.fileDependencies.indexOf(file) === -1) {
          compilation.fileDependencies.push(file);
        }
      });

      return callback();
    });
  }
}

module.exports = NunjucksWebpackPlugin;
