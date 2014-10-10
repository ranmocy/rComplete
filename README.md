rComplete
=========

JavaScript Auto Complete, simple and beautiful.

No dependency on any JavaScript library.
Only **4.3K** for production!

Easy to costumize style with CSS.

Easy to use, easy to hack.

[Development(9.2K)](https://raw.githubusercontent.com/ranmocy/rComplete/master/rComplete.js)
or
[Production(4.3K)](https://cdn.rawgit.com/ranmocy/rComplete/master/rComplete.min.js)

Check out the [Demo](http://complete.ranmocy.info/demo.html) here.

## Usage

Add to your HTML header:

```HTML
<script type="text/javascript" src="https://cdn.rawgit.com/ranmocy/rComplete/master/rComplete.min.js"></script>
```

And enable auto complete:

```javascript
var c = rComplete($('#container'));
c.setOptions(["option1", "option2", "option3"]);
```

You may also wish it looks normal:

```CSS
.complete-wrapper input {
    font-size: 20px;
}
.complete-dropdown {
    top: 20px;
}
.complete-dropdown-item {
    border: 1px black solid;
}
.complete-dropdown-item.hovered {
    color: #dd2222;
    background-color: #eee;
}
```

That's it!

## Customize

You can pass in personal configs as:

```javascript
var c = rComplete($('#container'), {
    dropdownZIndex: 100,
    placeholder: "Placeholder",
    matcher: function(a, b) { return new RegExp("^" + a, "i").test(b); }
});
```

* **dropdownZIndex**: z-index of dropdown list, default is 100.
* **placeholder**: placeholder when input is empty, default is "Placeholder".
* **matcher**: a function to compare whether input `a` matches option `b`.

And also CSS classes:

* **.complete-wrapper**: the wrapper under the container
* **.complete-input**: where user can type
* **.complete-hint**: where the hint exists
* **.complete-dropdown**: where the dropdown options exists

## Dev

* [UglifyJS2](https://github.com/mishoo/UglifyJS2): `npm install uglify-js -g`
