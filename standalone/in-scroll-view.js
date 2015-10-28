(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.VIEW = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*!
 * In Scroll View
 * https://github.com/TheC2Group/in-scroll-view
 * @version 2.0.1
 * @license MIT (c) The C2 Group (c2experience.com)
 */

'use strict';

var $ = (typeof window !== "undefined" ? window['jQuery'] : typeof global !== "undefined" ? global['jQuery'] : null);
var debounce = require('bloody-debounce-af');

var view = {};
var collection = [];
var $w = $(window);
var height = 0;
var listeners = [];

var broadcastChange = function (item) {
    listeners.forEach(function (cb) {
        cb(item);
    });
};

var removeItem = function (item) {
    var index = collection.indexOf(item);

    if (index > -1) {
        collection.splice(index, 1);
    }
};

var readScroll = debounce(function () {
    var scrollTop = $w.scrollTop();

    collection.forEach(function (item) {
        var percentInView;

        var showFrom = (item.top < scrollTop) ? scrollTop - item.top : 0;
        var showTo = (item.top + item.height > scrollTop + height) ? (scrollTop + height) - item.top : item.height;

        if (showFrom > 0 && showTo < item.height) {
            percentInView = 1;
        } else {
            percentInView = (showTo - showFrom) / item.height;
        }

        var status = (percentInView >= item.opts.percentInView) ? 'in' : 'out';
        if (status !== item.status) {
            if (item.opts.attr) {
                item.$el.attr(item.opts.attr, status);
            }
            item.status = status;
            broadcastChange(item);

            if (status === item.opts.lock) {
                removeItem(item);
                tryUnbindWindow();
            }
        }
    });
});

var measure = debounce(function () {
    height = $w.height();

    collection.forEach(function (item) {
        item.top = item.$el.offset().top;
        item.height = item.$el.outerHeight();
    });

    readScroll();
});

var itemDefaults = {
    percentInView: 0.75,
    attr: 'data-view',
    lock: '' // 'in' or 'out'
};

var createItem = function ($el, opts) {

    var item = {
        $el: $el,
        opts: opts,
        top: 0,
        height: 0,
        status: $el.attr(opts.attr)
    };

    collection.push(item);
};

var windowBound = false;

var bindWindow = function () {
    if (windowBound) return;

    $w.on('resize load', measure);
    $w.on('scroll', readScroll);

    windowBound = true;
};

var unbindWindow = function () {
    if (!windowBound) return;

    $w.off('resize load', measure);
    $w.off('scroll', readScroll);

    windowBound = false;
};

var tryUnbindWindow = function () {
    if (collection.length) return;
    unbindWindow();
};

view.add = function (els, options) {
    var $els = $(els);
    var opts = $.extend({}, itemDefaults, options);

    if ($els.length === 1) {
        createItem($els, opts);
    } else {
        $els.each(function () {
            createItem($(this), opts);
        });
    }

    bindWindow();
};

view.remove = function (items) {
    if (typeof items === 'undefined') {
        collection = [];
        return;
    }

    if (Array.isArray(items)) {
        items.forEach(function (item) {
            removeItem(item);
        });
    } else {
        removeItem(items);
    }

    tryUnbindWindow();
};

view.measure = measure;
view.scroll = scroll;
view.bindWindow = bindWindow;
view.unbindWindow = unbindWindow;

view.onChange = function (cb) {
    if (typeof cb !== 'function') return;
    listeners.push(cb);
};

module.exports = view;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"bloody-debounce-af":2}],2:[function(require,module,exports){
var af = require("bloody-animationframe")

module.exports = function(fn){
  var id
  return function(){
    var args = arguments
    if(id != null) {
      af.cancelAnimationFrame(id)
    }
    id = af.requestAnimationFrame(function(){
      fn.apply(null, args)
      id = null
    })
  }
}

},{"bloody-animationframe":3}],3:[function(require,module,exports){
var animationFrame = {}
  , win = window
  , requestAnimationFrame =
      win.requestAnimationFrame ||
      win.webkitRequestAnimationFrame ||
      win.mozRequestAnimationFrame ||
      win.oRequestAnimationFrame ||
      win.msRequestAnimationFrame ||
      function(callback){
        return setTimeout(function(){
          callback()
        }, 1000 / 60)
      }
  , cancelAnimationFrame =
      win.cancelAnimationFrame ||
      win.webkitCancelAnimationFrame ||
      win.webkitCancelRequestAnimationFrame ||
      win.mozCancelAnimationFrame ||
      win.oCancelAnimationFrame ||
      win.msCancelAnimationFrame ||
      function(id){
        clearTimeout(id)
      }

module.exports = {
  requestAnimationFrame : function(){
    return requestAnimationFrame.apply(window, arguments)
  },
  cancelAnimationFrame : function(){
    return cancelAnimationFrame.apply(window, arguments)
  },
}

},{}]},{},[1])(1)
});