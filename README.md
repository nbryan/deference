# Deference

Deference is a set of three utility methods for use with
[jQuery's Deferred ojbect](http://api.jquery.com/category/deferred-object/). They're similar to
jQuery's built in `$.when()` method in that they simply compose more complex deferred patterns into
simple and reusable methods.

## Installation

Require jQuery like you normall would, then include Deference.

```html
<script type="text/javascript" src="jquery.js"></script>
<script type="text/javascript" src="deference.js"></script>
```

## Usage

Deference simply adds three functions to the jQuery object: parallel, serial, and wait.

Parallel and serial are similar to `$.each()` in that they iterate through an array passing each
item to a function. The main difference is that the function must return a deferred object (or a
promise). When all the inner deferreds are resolved, then the outer deferred is resolved
(or rejected). After each iteration the outer deferred is also notified with the number of
iterations completed.

### Parallel

As you might expect, parallel executes all the function calls at once in parallel. This is useful
when many tasks must be completed before moving on.

```javascript
var items = [1, 2, 3, 4];

$.parallel(items, function(i) {
  return $.wait(500); // Do something more interesting here
}).progress(function(completed, total, percentage) {
  console.log(percentage + '%'); // 25%, 50%, 75%, and 100% will be logged simultaneously
}).done(function() {
  console.log('done!')
});
```

### Serial

Again, as you might expect, serial waits for each iteration to complete before starting the next.
This is useful if each iteration is dependent on one the previous or if the order of execution is
important.

```javascript
var items = [1, 2, 3, 4];

$.serial(items, function(i) {
  return $.wait(500); // Do something more interesting here
}).progress(function(completed, total, percentage) {
  console.log(percentage + '%'); // 25%, 50%, 75%, and 100% will be logged one at a time
}).done(function() {
  console.log('done!');
});
```

### Wait

Wait waits for a specified period of time before resolving. The default is 1000ms. If you'd like to
execute some logic after another deferred finishes _and_ after a specified period of time, use wait.

Sound pretty useless? Imagine a case where you need to post many things to Facebook at a time
without getting rate-limited. Using serial in combination with wait would prevent Facebook from
rate-limiting your posts.

```javascript
var items = [1, 2, 3, 4];

$.serial(items, function(i) {
  return $.when(postToFacebook(i), $.wait(500));
})
```

## About

Deference was written and is maintained by [Nathan Bryan](https://github.com/nbryan). It is freely
available under the MIT license. If you find it useful, let me know! Or submit a pull request if
you can improve it.
