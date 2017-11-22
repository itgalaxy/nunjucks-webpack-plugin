const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");

class NunjucksWebpackPlugin {
    constructor(options = {}) {
        this.options = Object.assign(
            {},
            {
                configure: {
                    options: {},
                    path: ""
                },
                templates: [],
                writeToFileWhenMemoryFs: false
            },
            options
        );

        const { templates } = this.options;

        if (!Array.isArray(templates) || templates.length === 0) {
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

            const {
                templates,
                context: globalContext,
                callback: globalCallback
            } = this.options;
            const renderTemplates = {};

            templates.forEach(template => {
                if (!template.from) {
                    throw new Error("Each template should have `from` option");
                }

                if (!template.to) {
                    throw new Error("Each template should have `to` option");
                }

                if (fileDependencies.indexOf(template.from) === -1) {
                    fileDependencies.push(template.from);
                }

                const localContext = template.context
                    ? template.context
                    : globalContext;
                const localCallback = template.callback
                    ? template.callback
                    : globalCallback;

                const res = nunjucks.render(
                    template.from,
                    Object.assign({}, localContext),
                    localCallback
                );

                let webpackTo = template.to;

                if (path.isAbsolute(webpackTo)) {
                    webpackTo = path.relative(output, webpackTo);
                }

                renderTemplates[webpackTo] = {
                    rawSource: {
                        size: () => res.length,
                        source: () => res
                    },
                    writeToFileWhenMemoryFs: template.writeToFileWhenMemoryFs
                        ? template.writeToFileWhenMemoryFs
                        : this.options.writeToFileWhenMemoryFs
                };
            });

            const isMemoryFileSystem =
                compiler.outputFileSystem.constructor.name ===
                "MemoryFileSystem";
            const promises = [];

            Object.keys(renderTemplates).forEach(dest => {
                const templateObj = renderTemplates[dest];

                if (templateObj.writeToFileWhenMemoryFs && isMemoryFileSystem) {
                    promises.push(
                        new Promise((resolve, reject) => {
                            const fileDest = path.join(output, dest);

                            return fs.writeFile(
                                fileDest,
                                templateObj.rawSource.source(),
                                error => {
                                    if (error) {
                                        return reject(error);
                                    }

                                    return resolve();
                                }
                            );
                        })
                    );
                } else {
                    compilation.assets[dest] = templateObj.rawSource;
                }
            });

            // eslint-disable-next-line promise/no-callback-in-promise
            return Promise.all(promises).then(() => callback());
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
