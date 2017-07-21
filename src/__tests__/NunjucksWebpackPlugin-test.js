import * as nunjucks from "nunjucks";
import NunjucksWebpackPlugin from "../NunjucksWebpackPlugin";
import fs from "fs";
import path from "path";
import pify from "pify";
import tempy from "tempy";
import test from "ava";
import webpack from "webpack";
import webpackConfigBase from "./config/config-base";

const fixturesDir = path.resolve(__dirname, "fixtures");

test("should execute successfully when option `template` is object", t => {
    const tmpDirectory = tempy.directory();
    const templateName = "test.njk";
    const webpackConfig = Object.assign({}, webpackConfigBase, {
        output: {
            filename: "bundle.js",
            path: tmpDirectory
        },
        plugins: [
            new NunjucksWebpackPlugin({
                template: {
                    from: path.join(fixturesDir, templateName),
                    to: path.basename(templateName, ".njk")
                }
            })
        ]
    });

    return pify(webpack)(webpackConfig).then(stats => {
        t.true(stats.compilation.errors.length === 0, "no compilation error");

        return pify(fs.readFile)(
            path.join(tmpDirectory, path.basename(templateName, ".njk"))
        ).then(data => {
            const contents = data.toString();

            t.true(contents.trim() === "12345");

            return true;
        });
    });
});

test("should execute successfully when option `template` is array", t => {
    const tmpDirectory = tempy.directory();
    const templateName = "test.njk";
    const templateName1 = "test1.njk";
    const webpackConfig = Object.assign({}, webpackConfigBase, {
        output: {
            filename: "bundle.js",
            path: tmpDirectory
        },
        plugins: [
            new NunjucksWebpackPlugin({
                template: [
                    {
                        from: path.join(fixturesDir, templateName),
                        to: path.basename(templateName, ".njk")
                    },
                    {
                        from: path.join(fixturesDir, templateName1),
                        to: path.basename(templateName1, ".njk")
                    }
                ]
            })
        ]
    });

    return pify(webpack)(webpackConfig).then(stats => {
        t.true(stats.compilation.errors.length === 0, "no compilation error");

        return pify(fs.readFile)(
            path.join(tmpDirectory, path.basename(templateName, ".njk"))
        )
            .then(data => {
                const contents = data.toString();

                t.true(contents.trim() === "12345");

                return true;
            })
            .then(() =>
                pify(fs.readFile)(
                    path.join(
                        tmpDirectory,
                        path.basename(templateName1, ".njk")
                    )
                )
            )
            .then(data => {
                const contents = data.toString();

                t.true(contents.trim() === "false");

                return true;
            });
    });
});

test("should execute successfully when option `template` and `context` are passed", t => {
    const tmpDirectory = tempy.directory();
    const templateName = "test2.njk";
    const webpackConfig = Object.assign({}, webpackConfigBase, {
        output: {
            filename: "bundle.js",
            path: tmpDirectory
        },
        plugins: [
            new NunjucksWebpackPlugin({
                context: {
                    items: [
                        {
                            id: 1,
                            title: "foo"
                        },
                        {
                            id: 2,
                            title: "bar"
                        }
                    ]
                },
                template: {
                    from: path.join(fixturesDir, templateName),
                    to: path.basename(templateName, ".njk")
                }
            })
        ]
    });

    return pify(webpack)(webpackConfig).then(stats => {
        t.true(stats.compilation.errors.length === 0, "no compilation error");

        return pify(fs.readFile)(
            path.join(tmpDirectory, path.basename(templateName, ".njk"))
        ).then(data => {
            const contents = data.toString();

            t.regex(contents, /<li>foo<\/li>/);
            t.regex(contents, /<li>bar<\/li>/);

            return true;
        });
    });
});

test("should execute successfully when option `template` is object and `template.to` is absolute", t => {
    const tmpDirectory = tempy.directory();
    const templateName = "test.njk";
    const webpackConfig = Object.assign({}, webpackConfigBase, {
        output: {
            filename: "bundle.js",
            path: tmpDirectory
        },
        plugins: [
            new NunjucksWebpackPlugin({
                template: {
                    from: path.join(fixturesDir, templateName),
                    to: path.join(
                        tmpDirectory,
                        path.basename(templateName, ".njk")
                    )
                }
            })
        ]
    });

    return pify(webpack)(webpackConfig).then(stats => {
        t.true(stats.compilation.errors.length === 0, "no compilation error");

        return pify(fs.readFile)(
            path.join(tmpDirectory, path.basename(templateName, ".njk"))
        ).then(data => {
            const contents = data.toString();

            t.true(contents.trim() === "12345");

            return true;
        });
    });
});

test("should execute successfully when provided a Nunjucks environment", t => {
    const env = new nunjucks.Environment(
        new nunjucks.FileSystemLoader(fixturesDir)
    );

    // Add test filter
    env.addFilter("testFilter", () => "success");

    const tmpDirectory = tempy.directory();
    const templateName = "test3.njk";
    const webpackConfig = Object.assign({}, webpackConfigBase, {
        output: {
            filename: "bundle.js",
            path: tmpDirectory
        },
        plugins: [
            new NunjucksWebpackPlugin({
                environment: env,
                template: {
                    from: templateName,
                    to: path.basename(templateName, ".njk")
                }
            })
        ]
    });

    return pify(webpack)(webpackConfig).then(stats => {
        t.true(stats.compilation.errors.length === 0, "no compilation error");

        return pify(fs.readFile)(
            path.join(tmpDirectory, path.basename(templateName, ".njk"))
        ).then(data => {
            const contents = data.toString();

            t.true(contents.trim() === "success");

            return true;
        });
    });
});
