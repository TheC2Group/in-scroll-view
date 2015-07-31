/**
 * event-handler - create event emitters
 * version: 2.1.0
 * https://stash.c2mpg.com:8443/projects/C2/repos/event-handler
 * @preserve
 */

var eventHandler = (function () {
    'use strict';

    var on = function (event, fn) {
        if (typeof event !== 'string' || !event.length || typeof fn === 'undefined') return;

        if (event.indexOf(' ') > -1) {
            event.split(' ').forEach(function (eventName) {
                on.call(this, eventName, fn);
            }, this);
            return;
        }

        this._events = this._events || {};
        this._events[event] = this._events[event] || [];
        this._events[event].push(fn);
    };

    var off = function (event, fn) {
        if (typeof event !== 'string' || !event.length) return;

        if (event.indexOf(' ') > -1) {
            event.split(' ').forEach(function (eventName) {
                off.call(this, eventName, fn);
            }, this);
            return;
        }

        this._events = this._events || {};

        if (event in this._events === false) return;

        if (typeof fn === 'undefined') {
            delete this._events[event];
            return;
        }

        var index = this._events[event].indexOf(fn);
        if (index > -1) {
            if (this._events[event].length === 1) {
                delete this._events[event];
            } else {
                this._events[event].splice(index, 1);
            }
        }
    };

    var emit = function (event /* , args... */) {
        this._events = this._events || {};
        if (event in this._events === false) return;
        var args = Array.prototype.slice.call(arguments, 1);
        this._events[event].forEach(function (fn) {
            fn.apply(this, args);
        }, this);
    };

    var handler = function (_class) {

        // constructor
        if (arguments.length === 0) {
            if (this instanceof handler) return;
            return new handler();
        }

        // mixin
        if (typeof _class === 'function') {
            _class.prototype.on = on;
            _class.prototype.off = off;
            _class.prototype.emit = emit;
        }

        if (typeof _class === 'object') {
            _class.on = on;
            _class.off = off;
            _class.emit = emit;
        }
    };

    var proto = handler.prototype;

    proto.on = on;
    proto.off = off;
    proto.emit = emit;

    // legacy extensions
    proto.bind = on;
    proto.unbind = off;
    proto.trigger = emit;

    return handler;
}());

// export commonjs
if (typeof module !== 'undefined' && ('exports' in module)) {
    module.exports = eventHandler;
}
