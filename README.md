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

You may also wish that it looks pretty:

```CSS
.complete-hint, .complete-input, .complete-dropdown {
    font-size: 20px;
}
.complete-hint, .complete-input {
    border: 1px solid #888;
    border-radius: 8px;
    outline: none;
    padding: 0.3em 0.5em;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
}
.complete-dropdown {
    border: 1px solid #bbb;
    border-radius: 10px;
    margin: 10px 0;
    width: 100%;
    text-align: left;
}
.complete-dropdown-item {
    color: #444;
    padding: 0.3em 0.5em;
    cursor: default;
}
.complete-dropdown-item+.complete-dropdown-item {
    border-top: 1px solid #888;
}
.complete-dropdown-item.hovered {
    color: #1E98FF;
}
```

That's it!

## Customize

You can pass in personal configs as:

```javascript
var complete_obj = rComplete($('#container'), {
    placeholder: "Placeholder",
    matcher: function(a, b) { return new RegExp("^" + a, "i").test(b); }
});
```

* **placeholder**: placeholder when input is empty, default is "Placeholder".
* **matcher**: a function to compare whether input `a` matches option `b`.

And also CSS classes:

* **.complete-wrapper**: the wrapper under the container
* **.complete-input**: where user can type
* **.complete-hint**: where the hint exists
* **.complete-dropdown**: where the dropdown options exists

And manipulate with JavaScript:

```javascript
complete_obj.setOptions(options)    // set the options, OPTIONS is a array of strings
complete_obj.getOptions()           // returns the options
complete_obj.setText(text)          // manually set the input text to TEXT
complete_obj.getText()              // returns the value of the input

complete_obj.wrapper    // access to the wrapper node
complete_obj.input      // access to the input node
complete_obj.hint       // access to the hint node
complete_obj.dropdown   // access to the dropdown node
```

## Dev

* [UglifyJS2](https://github.com/mishoo/UglifyJS2): `npm install uglify-js -g`
