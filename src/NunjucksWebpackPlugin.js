const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

class NunjucksWebpackPlugin {
    constructor(options = {}) {
        this.options = Object.assign({}, {
            callback: null,
            configure: {
                options: {},
                path: ''
            },
            context: {},
            template: null,
            to: null,
            writeToFileWhenMemoryFs: true
        }, options);

        const { template } = this.options;

        if (!template) {
            throw new Error('Options `template` must be a string or an array');
        }

        if ((Array.isArray(template) && template.length === 0)
            || (template !== null && typeof template === 'object' && Object.keys(template).length === 0)
        ) {
            throw new Error('Options `template` should be not empty');
        }

        if (!Array.isArray(template)) {
            this.options.template = [template];
        }
    }

    apply(compiler) {
        const assets = {};
        const fileDependencies = [];

        let output = compiler.options.output.path;

        if (output === '/'
            && compiler.options.devServer
            && compiler.options.devServer.outputPath
        ) {
            output = compiler.options.devServer.outputPath;
        }

        compiler.plugin('compilation', (compilation) => {
            compilation.plugin('module-asset', (module, hashedFile) => {
                const file = path.join(path.dirname(hashedFile), path.basename(module.userRequest));

                assets[file] = path.join(output, hashedFile);
            });
        });

        compiler.plugin('emit', (compilation, callback) => {
            nunjucks.configure(this.options.configure.path, this.options.configure.options);

            const {
                template: templates,
                context: globalContext,
                callback: globalCallback
            } = this.options;
            const renderTemplates = {};

            templates.forEach((template) => {
                if (!template.from) {
                    throw new Error('Each template should have `from` option');
                }

                if (!template.to) {
                    throw new Error('Each template should have `to` option');
                }

                const localContext = template.context ? template.context : globalContext;
                const localCallback = template.callback ? template.callback : globalCallback;

                const res = nunjucks.render(template.from, Object.assign({}, {
                    assets
                }, localContext), localCallback);

                fileDependencies.push(template.from);

                let webpackTo = template.to;

                if (path.isAbsolute(webpackTo)) {
                    webpackTo = path.relative(output, webpackTo);
                }

                renderTemplates[webpackTo] = {
                    size: () => res.length,
                    source: () => res
                };
            });

            const isMemoryFileSystem = compiler.outputFileSystem.constructor.name === 'MemoryFileSystem';
            const promises = [];

            Object.keys(renderTemplates).forEach((dest) => {
                const templateSource = renderTemplates[dest];

                compilation.assets[dest] = templateSource;

                if (isMemoryFileSystem) {
                    promises.push(new Promise(
                        (resolve, reject) => {
                            const fileDest = path.join(output, dest);

                            return fs.writeFile(fileDest, templateSource.source(), (error) => {
                                if (error) {
                                    return reject(error);
                                }

                                return resolve();
                            });
                        }
                    ));
                }
            });

            // eslint-disable-next-line promise/no-callback-in-promise
            return Promise.all(promises).then(() => callback());
        });

        compiler.plugin('after-emit', (compilation, callback) => {
            fileDependencies.forEach((file) => {
                if (compilation.fileDependencies.indexOf(file) === -1) {
                    compilation.fileDependencies.push(file);
                }
            });

            return callback();
        });
    }
}

module.exports = NunjucksWebpackPlugin;
