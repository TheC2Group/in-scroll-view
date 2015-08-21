/*!
 * scroll-view
 * version: 1.0.0
 * https://stash.c2mpg.com:8443/projects/C2/repos/scroll-view
 */

/* exported VIEW */

var VIEW = (function ($) {
    'use strict';

    function debounce(fn) {
        if (typeof requestAnimationFrame === 'undefined') {
            return fn;
        }

        var id = null;
        return function () {
            var args = arguments;
            if (id !== null) {
                cancelAnimationFrame(id);
            }
            id = requestAnimationFrame(function () {
                fn.apply(null, args);
                id = null;
            });
        };
    }

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

    var measure = debounce(function () {
        height = $w.height();

        collection.forEach(function (item) {
            item.top = item.$el.offset().top;
            item.height = item.$el.outerHeight();
        });

        scroll();
    });

    var scroll = debounce(function () {
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

    var removeItem = function (item) {
        var index = collection.indexOf(item);

        if (index > -1) {
            collection.splice(index, 1);
        }
    };

    var windowBound = false;

    var bindWindow = function () {
        if (windowBound) return;

        $w.on('resize load', measure);
        $w.on('scroll', scroll);

        windowBound = true;
    };

    var unbindWindow = function () {
        if (!windowBound) return;

        $w.off('resize load', measure);
        $w.off('scroll', scroll);

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

    return view;
}(jQuery));
