/*!
 * in-scroll-view
 * https://github.com/TheC2Group/in-scroll-view
 * @version 2.2.1
 * @license MIT (c) The C2 Group (c2experience.com)
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('jquery'), require('c2-debounce-af')) :
    typeof define === 'function' && define.amd ? define(['jquery', 'c2-debounce-af'], factory) :
    (global = global || self, global.VIEW = factory(global.jQuery, global.c2DebounceAf));
}(this, function ($, debounce) { 'use strict';

    $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
    debounce = debounce && debounce.hasOwnProperty('default') ? debounce['default'] : debounce;

    var view = {};
    var collection = [];
    var $w = $(window);
    var height = 0;
    var listeners = [];

    var broadcastChange = function broadcastChange(item) {
      listeners.forEach(function (cb) {
        cb(item);
      });
    };

    var removeItem = function removeItem(item) {
      var index = collection.indexOf(item);

      if (index > -1) {
        collection.splice(index, 1);
      }
    };

    var readScroll = debounce(function () {
      var scrollTop = $w.scrollTop();
      collection.forEach(function (item) {
        var percentInView;
        var showFrom = item.top < scrollTop ? scrollTop - item.top : 0;
        var showTo = item.top + item.height > scrollTop + height ? scrollTop + height - item.top : item.height;

        if (showFrom > 0 && showTo < item.height) {
          percentInView = 1;
        } else {
          percentInView = (showTo - showFrom) / item.height;
        }

        var status = percentInView >= item.opts.percentInView ? 'in' : 'out';

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

    var createItem = function createItem($el, opts) {
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

    var bindWindow = function bindWindow() {
      if (windowBound) return;
      $w.on('resize load', measure);
      $w.on('scroll', readScroll);
      windowBound = true;
    };

    var unbindWindow = function unbindWindow() {
      if (!windowBound) return;
      $w.off('resize load', measure);
      $w.off('scroll', readScroll);
      windowBound = false;
    };

    var tryUnbindWindow = function tryUnbindWindow() {
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

    return view;

}));
