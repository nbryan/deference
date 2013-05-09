/*
    Deference 1.0.0
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
    parallel: function(items, fn) {
      return jQuery.Deferred(function(d) {
        var completed = 0;

        if (items.length > 0) {
          for (var i = 0; i < items.length; i++) {
            fn(items[i]).done(function() {
              completed++;
              d.notify(completed, items.length, completed / items.length * 100);
              if (completed == items.length) {
                d.resolve();
              }
            }).fail(function() {
              d.reject();
            });
          }
        } else {
          d.resolve();
        }

        return d.promise();
      });
    },

    serial: function(items, fn, i, d) {
      if (i == null) {
        i = 0;
      }
      if (d == null) {
        d = jQuery.Deferred();
      }

      if (items.length > 0) {
        if (items[i]) {
          fn(items[i]).done(function() {
            i++;
            d.notify(i, items.length, i / items.length * 100);
            if (i == items.length) {
              d.resolve()
            } else {
              jQuery.serial(items, fn, i, d);
            }
          }).fail(function() {
            d.reject();
          });
        }
      } else {
        d.resolve();
      }

      return d.promise();
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
