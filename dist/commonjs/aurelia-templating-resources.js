'use strict';

exports.__esModule = true;

var _compose = require('./compose');

var _if = require('./if');

var _with = require('./with');

var _repeat = require('./repeat');

var _show = require('./show');

var _globalBehavior = require('./global-behavior');

var _sanitizeHtml = require('./sanitize-html');

var _replaceable = require('./replaceable');

var _focus = require('./focus');

var _compileSpy = require('./compile-spy');

var _viewSpy = require('./view-spy');

function configure(config) {
  config.globalResources('./compose', './if', './with', './repeat', './show', './replaceable', './global-behavior', './sanitize-html', './focus', './compile-spy', './view-spy');
}

exports.Compose = _compose.Compose;
exports.If = _if.If;
exports.With = _with.With;
exports.Repeat = _repeat.Repeat;
exports.Show = _show.Show;
exports.SanitizeHtmlValueConverter = _sanitizeHtml.SanitizeHtmlValueConverter;
exports.GlobalBehavior = _globalBehavior.GlobalBehavior;
exports.Replaceable = _replaceable.Replaceable;
exports.Focus = _focus.Focus;
exports.CompileSpy = _compileSpy.CompileSpy;
exports.ViewSpy = _viewSpy.ViewSpy;
exports.configure = configure;