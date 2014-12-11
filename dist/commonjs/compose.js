"use strict";

var Container = require('aurelia-dependency-injection').Container;
var CustomElement = require('aurelia-templating').CustomElement;
var ResourceCoordinator = require('aurelia-templating').ResourceCoordinator;
var Property = require('aurelia-templating').Property;
var ViewSlot = require('aurelia-templating').ViewSlot;
var NoView = require('aurelia-templating').NoView;
var UseView = require('aurelia-templating').UseView;
var ViewEngine = require('aurelia-templating').ViewEngine;
var Compose = (function () {
  var Compose = function Compose(container, resourceCoordinator, viewEngine, viewSlot) {
    this.container = container;
    this.resourceCoordinator = resourceCoordinator;
    this.viewEngine = viewEngine;
    this.viewSlot = viewSlot;
  };

  Compose.annotations = function () {
    return [new CustomElement("compose"), new Property("model"), new Property("view"), new Property("viewModel"), new NoView()];
  };

  Compose.inject = function () {
    return [Container, ResourceCoordinator, ViewEngine, ViewSlot];
  };

  Compose.prototype.bind = function (executionContext) {
    this.executionContext = executionContext;
    processInstruction(this, {
      view: this.view,
      viewModel: this.viewModel,
      model: this.model
    });
  };

  Compose.prototype.modelChanged = function (newValue, oldValue) {
    if (this.viewModel && this.viewModel.activate) {
      this.viewModel.activate(newValue);
    }
  };

  Compose.prototype.viewChanged = function (newValue, oldValue) {
    processInstruction(this, { view: newValue });
  };

  Compose.prototype.viewModelChanged = function (newValue, oldValue) {
    processInstruction(this, { viewModel: newValue });
  };

  return Compose;
})();

exports.Compose = Compose;


function swap(composer, behavior) {
  behavior.bind(behavior.executionContext);
  composer.viewSlot.swap(behavior.view);

  if (composer.current) {
    composer.current.unbind();
  }

  composer.current = behavior;
}

function processBehavior(composer, instruction, behavior) {
  if (instruction.model && "activate" in instruction.viewModel) {
    var activated = instruction.viewModel.activate(instruction.model) || Promise.resolve();
    activated.then(function () {
      return swap(composer, behavior);
    });
  } else {
    swap(composer, behavior);
  }
}

function processInstruction(composer, instruction) {
  var useView, result, options, childContainer;

  if (typeof instruction.viewModel == "string") {
    composer.resourceCoordinator.loadAnonymousElement(composer.viewModel, null, instruction.view).then(function (type) {
      childContainer = composer.container.createChild();
      options = { suppressBind: true };
      result = type.create(childContainer, options);
      instruction.viewModel = result.executionContext;
      processBehavior(composer, instruction, result);
    });
  } else {
    if (instruction.view) {
      useView = new UseView(instruction.view);
    }

    if (instruction.viewModel) {
      CustomElement.anonymous(composer.container, instruction.viewModel, useView).then(function (type) {
        childContainer = composer.container.createChild();
        options = { executionContext: instruction.viewModel, suppressBind: true };
        result = type.create(childContainer, options);
        processBehavior(composer, instruction, result);
      });
    } else if (useView) {
      useView.loadViewFactory(composer.viewEngine).then(function (viewFactory) {
        childContainer = composer.container.createChild();
        result = viewFactory.create(childContainer, composer.executionContext);
        composer.viewSlot.swap(result);
      });
    }
  }
}