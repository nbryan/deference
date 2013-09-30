/*
    Deference 1.1.0
    Copyright (c) 2013 Nathan Bryan
    Released under the MIT license
    https://github.com/nbryan/deference
*/
(function() {
  var jQuery;
  if (typeof require !== 'undefined' && require !== null) {
    jQuery = require('jquery');
  } else {
    jQuery = this.jQuery;
  }

  jQuery.extend({
    parallel: function(items, fn, options) {
      return jQuery.Deferred(function(d) {
        var completed = 0
          , failures = 0
          , failure_objects = [];
        options = typeof options !== 'undefined' ? options : {};

        threshhold = typeof options.threshhold !== 'undefined' ? options.threshhold : 0;

        if (items.length > 0) {
          for (var i = 0; i < items.length; i++) {
            fn(items[i]).done(function() {
              completed++;
              d.notify(completed, items.length, completed / items.length * 100);
              if (completed == items.length) {
                d.resolve.apply(d, arguments);
              }
            }).fail(function(failure) {
              failures++;
              completed++;

              if (typeof failure !== 'undefined') {
                failure_objects.push(failure);
                arguments[0] = failure_objects;
              }

              if (failures > threshhold) {
                d.reject.apply(d, arguments);
              }
            });
          }
        } else {
          d.resolve();
        }

        return d.promise();
      });
    },

    serial: function(items, fn, options) {
      options = typeof options !== 'undefined' ? options : {};

      options.threshhold = typeof options.threshhold !== 'undefined' ? options.threshhold : 0;
      options.index = typeof options.index !== 'undefined' ? options.index : 0;
      options.deferred = typeof options.deferred !== 'undefined' ? options.deferred : jQuery.Deferred();
      options.failures = typeof options.failures !== 'undefined' ? options.failures : 0;
      options.failure_objects = typeof options.failure_objects !== 'undefined' ? options.failure_objects : [];

      var succeed = function() {
        options.index++;
        options.deferred.notify(options.index, items.length, options.index / items.length * 100);
        if (options.index == items.length) {
          options.deferred.resolve.apply(options.deferred, arguments)
        } else {
          jQuery.serial(items, fn, options);
        }
      }

      if (items.length > 0) {
        if (items[options.index]) {
          fn(items[options.index]).done(function() {
            succeed();
          }).fail(function(failure) {
            options.failures++;

            if (typeof failure !== 'undefined') {
                options.failure_objects.push(failure);
                arguments[0] = options.failure_objects;
            }

            if (options.failures > options.threshhold) {
              options.deferred.reject.apply(options.deferred, arguments);
            } else {
              succeed();
            }
          });
        }
      } else {
        options.deferred.resolve();
      }

      return options.deferred.promise();
    },

    wait: function(ms) {
      if (ms == null) {
        ms = 1000;
      }

      return jQuery.Deferred(function(d) {
        setTimeout(function() {
          d.resolve();
        }, ms);
      }).promise();
    }
  });
}).call(this);
