import NunjucksWebpackPlugin from "../NunjucksWebpackPlugin";
import fs from "fs";
import path from "path";
import pify from "pify";
import tempy from "tempy";
import test from "ava";
import webpack from "webpack";
import webpackConfigBase from "./config/config-base";

const fixturesDir = path.resolve(__dirname, "fixtures");

test("should execute successfully when option `templates` is passed", t => {
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
        templates: [
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
          path.join(tmpDirectory, path.basename(templateName1, ".njk"))
        )
      )
      .then(data => {
        const contents = data.toString();

        t.true(contents.trim() === "false");

        return true;
      });
  });
});

test("should execute successfully when option `templates` with `context` are passed", t => {
  const tmpDirectory = tempy.directory();
  const templateName = "test2.njk";
  const webpackConfig = Object.assign({}, webpackConfigBase, {
    output: {
      filename: "bundle.js",
      path: tmpDirectory
    },
    plugins: [
      new NunjucksWebpackPlugin({
        templates: [
          {
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
            from: path.join(fixturesDir, templateName),
            to: path.basename(templateName, ".njk")
          }
        ]
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

test("should execute successfully when option `templates` is passed and `template.to` is absolute", t => {
  const tmpDirectory = tempy.directory();
  const templateName = "test.njk";
  const webpackConfig = Object.assign({}, webpackConfigBase, {
    output: {
      filename: "bundle.js",
      path: tmpDirectory
    },
    plugins: [
      new NunjucksWebpackPlugin({
        templates: [
          {
            from: path.join(fixturesDir, templateName),
            to: path.join(tmpDirectory, path.basename(templateName, ".njk"))
          }
        ]
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

test("should execute successfully when using props from '__webpack__' base context object", t => {
  const tmpDirectory = tempy.directory();
  const templateName = "test3.njk";
  const webpackConfig = Object.assign({}, webpackConfigBase, {
    output: {
      filename: "bundle.js",
      path: tmpDirectory
    },
    plugins: [
      new NunjucksWebpackPlugin({
        templates: [
          {
            from: path.join(fixturesDir, templateName),
            to: path.join(tmpDirectory, path.basename(templateName, ".njk"))
          }
        ]
      })
    ]
  });

  return pify(webpack)(webpackConfig).then(stats => {
    t.true(stats.compilation.errors.length === 0, "no compilation error");

    return pify(fs.readFile)(
      path.join(tmpDirectory, path.basename(templateName, ".njk"))
    ).then(data => {
      const contents = data.toString();

      t.true(
        contents.trim() === '<script src="029f359d6e9653eafd07.js"></script>'
      );

      return true;
    });
  });
});

test("should execute successfully when option `templates` with `minify` are passed", t => {
  const tmpDirectory = tempy.directory();
  const templateName = "test2.njk";
  const webpackConfig = Object.assign({}, webpackConfigBase, {
    output: {
      filename: "bundle.js",
      path: tmpDirectory
    },
    plugins: [
      new NunjucksWebpackPlugin({
        templates: [
          {
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
            from: path.join(fixturesDir, templateName),
            minify: {
              collapseWhitespace: true
            },
            to: path.basename(templateName, ".njk")
          }
        ]
      })
    ]
  });

  return pify(webpack)(webpackConfig).then(stats => {
    t.true(stats.compilation.errors.length === 0, "no compilation error");

    return pify(fs.readFile)(
      path.join(tmpDirectory, path.basename(templateName, ".njk"))
    ).then(data => {
      const contents = data.toString();

      t.regex(contents, /<h1>Posts<\/h1><ul><li>foo<\/li><li>bar<\/li><\/ul>/);

      return true;
    });
  });
});
