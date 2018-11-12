# Change Log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org).

## 5.0.0

* Feat: make webpack compilation hash value available to templates.
* Changed: drop support `node@4`.

## 4.0.1 - 2018-04-23

* Fixed: support `webpack@4`.

## 4.0.0 - 2017-11-22

* Feature: adds ability to pass `configure` as `nunjucks.Environment`.
* Fixed: all errors are sent into `compilation.errors` now.
* Fixed: use `fs-extra` to output file when `writeToFileEmit: true`.
* Changed: rename option from `writeToFileWhenMemoryFs` to `writeToFileEmit`.
* Changed: all `templates` now always emitted in webpack assets.
* Changed: rename options from `template` to `templates`.
* Changed: option `templates` should be always array.
* Removed: `webpack@1` support.
* Refactor: simplify code.

## 3.0.0 - 2017-06-20

* Chore: support `webpack` v3.
* Changed: minimum required `nodejs` version is now `4.3`

## 2.0.2 - 2017-04-13

* Fixed: now templates is written at the first start in `watch`.

## 2.0.1 - 2017-04-07

* Fixed: don't write templates in memory filesystem when they writes on disk.

## 2.0.0 - 2017-04-07

* Added: support `writeToFileWhenMemoryFs` option for each template.
* Changed: `writeToFileWhenMemoryFs` default false.
* Fixed: option `writeToFileWhenMemoryFs` now works right.
* Fixed: memory leak in watch mode.
* Fixed: rendered templates don't overwrite if not changed source.

## 1.0.0 - 2017-04-06

* Initial public release.
