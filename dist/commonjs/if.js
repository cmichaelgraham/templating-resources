'use strict';

exports.__esModule = true;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _aureliaTemplating = require('aurelia-templating');

var _aureliaDependencyInjection = require('aurelia-dependency-injection');

var _aureliaTaskQueue = require('aurelia-task-queue');

var If = (function () {
  function If(viewFactory, viewSlot, taskQueue) {
    _classCallCheck(this, _If);

    this.viewFactory = viewFactory;
    this.viewSlot = viewSlot;
    this.showing = false;
    this.taskQueue = taskQueue;
  }

  If.prototype.bind = function bind(executionContext) {
    this.$parent = executionContext;
    this.valueChanged(this.value);
  };

  If.prototype.valueChanged = function valueChanged(newValue) {
    var _this = this;

    if (!newValue) {
      if (this.view && this.showing) {
        this.taskQueue.queueMicroTask(function () {
          _this.viewSlot.remove(_this.view);
          _this.view.unbind();
        });
      }

      this.showing = false;
      return;
    }

    if (!this.view) {
      this.view = this.viewFactory.create(this.$parent);
    }

    if (!this.showing) {
      this.showing = true;

      if (!this.view.isBound) {
        this.view.bind();
      }

      this.viewSlot.add(this.view);
    }
  };

  var _If = If;
  If = _aureliaDependencyInjection.inject(_aureliaTemplating.BoundViewFactory, _aureliaTemplating.ViewSlot, _aureliaTaskQueue.TaskQueue)(If) || If;
  If = _aureliaTemplating.templateController(If) || If;
  If = _aureliaTemplating.customAttribute('if')(If) || If;
  return If;
})();

exports.If = If;