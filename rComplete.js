/**
 * rComplete 1.0.0
 * FYHPL: http://ranmocy.info/piece/FYHPL.txt
 * Copyright (c) 2014 Ranmocy Sheng
 * Be good.
 **/
 function rComplete (root, user_config) {
    "use strict";

    // helpers
    Object.prototype.bindFunctions = function(functions) {
        var self = this;
        Object.keys(functions).forEach(function(name) {
            self[name] = functions[name].bind(self);
        });
        return this;
    };
    Object.prototype.bindProperties = function(properties) {
        var self = this;
        Object.keys(properties).forEach(function(name) {
            if (properties[name].constructor === Object) { // it's a hash
                self[name].bindProperties(properties[name]);
            } else {
                self[name] = properties[name];
            };
        });
        return this;
    };
    HTMLElement.prototype.classes = function() {
        return this.className.split(/\s+/);
    }
    HTMLElement.prototype.addClass = function(name) {
        var classes = this.classes();
        if (classes.indexOf(name) === -1) {
            classes.push(name);
            this.className = classes.join(' ');
        };
        return this;
    };
    HTMLElement.prototype.removeClass = function(name) {
        var re = new RegExp(name, "i");
        this.className = this.className.replace(re, '').replace(/\s+/, ' ');
        return this;
    };

    // default configs
    var config = {
        dropdownZIndex: 100,
        placeholder: "Placeholder",
        matcher: function(a, b) { return new RegExp("^" + a, "i").test(b); }
    };
    // merge user defined configs
    if (user_config) {
        Object.keys(user_config).forEach(function(key) {
            config[key] = user_config[key];
        });
    };

    // create elements
    var wrapper = document.createElement('div').bindProperties({
        className: "complete-wrapper",
        style: {
            border: '0',
            margin: '0',
            outline: '0',
            padding: '0',
            position: 'relative'
        }
    });

    var input = document.createElement('input').bindProperties({
        className: "complete-input",
        type: 'text',
        value: '',
        spellcheck: false,
        Options: [],
        Matches: [],
        style: {
            position: 'relative',
            width: '100%',
            border: '0',
            margin: '0',
            outline: '0',
            padding: '0',
            verticalAlign: 'top',
            backgroundColor: 'transparent'
        }
    });

    var hint = input.cloneNode().bindProperties({
        className: "complete-hint",
        disabled: true,
        value: config.placeholder,
        realValue: '',
        style: {
            position: 'absolute',
            top: 0,
            left: 0,
            boxShadow: 'none',
            borderColor: 'transparent'
        }
    });

    var dropdown = document.createElement('div').bindProperties({
        className: 'complete-dropdown',
        Index: 0,
        style: {
            zIndex: config.dropdownZIndex,
            display: 'none',
            position: 'absolute',
            cursor: 'default'
        }
    });


    // create methods

    // DropdownItem factory
    var DropdownItem = function() {
        var item = document.createElement('div');
        item.className = 'complete-dropdown-item';

        item.bindFunctions({
            Hover: function() {
                // all items should leave now
                dropdown.LeaveAllItem();
                this.addClass('hovered');
                // update hint
                hint.Render(this.textContent);
            },
            Leave: function() {
                this.removeClass('hovered');
            },
            onmouseover: function() {
                this.Hover();
            },
            onmouseout:  function() {
                this.Leave();
            },
            onmousedown: function() {
                input.Complete(this.textContent);
                setTimeout(function() { input.focus(); }, 0);  // for IE
            }
        });

        return item;
    };

    dropdown.bindFunctions({
        Empty: function() {
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
        },
        CurrentItem: function() {
            return this.childNodes[this.Index];
        },
        // move the hightlighted item
        Move: function(offset) {
            this.CurrentItem().Leave();
            // should limited inside of the range
            var index = this.Index + offset;
            if ((0 <= index) && (index < this.childNodes.length)) {
                this.Index = index;
            };
            this.CurrentItem().Hover();
        },
        Render: function(matches) {
            this.Empty();

            var self = this;
            matches.forEach(function(d) {
                var item = DropdownItem();
                item.innerHTML = d;
                self.appendChild(item);
            });

            if (this.childNodes.length <= 1) {
                this.Hide();
            };
        },
        LeaveAllItem: function() {
            // node list is not array, so I can't use forEach
            for (var i = 0; i < this.childNodes.length; i++) {
                this.childNodes[i].Leave();
            };
        },
        Show: function() {
            if (this.childNodes.length > 1) {
                this.style.display = null;
            };
        },
        Hide: function() {
            this.style.display = 'none';
        }
    });

    hint.bindFunctions({
        Show: function() {
            this.style.display = null;
        },
        Hide: function() {
            if (input.value === '') {
                this.realValue = '';
                this.value = config.placeholder;
            } else {
                this.style.display = 'none';
            };
        },
        isShow: function() {
            return !this.isHide();
        },
        isHide: function() {
            return this.style.display === 'none';
        },
        Render: function(realValue) {
            var token = input.value;
            this.realValue = realValue || '';
            this.value = token + this.realValue.substring(token.length);
        }
    });

    input.bindFunctions({
        // update matches options
        Match: function() {
            var self = this;
            var token = this.value;

            this.Matches = [];
            this.Options.forEach(function(opt) {
                if (config.matcher(token, opt)) {
                    self.Matches.push(opt);
                }
            });

            dropdown.Render(this.Matches);
            // first result as hint, and make it hovered
            hint.Render(this.Matches[0]);
            if (dropdown.childNodes[0]) {
                dropdown.childNodes[0].Hover();
            };
        },
        // complete input to TEXT
        Complete: function(text) {
            this.value = text;
            this.Match();
            this.Hide();
        },
        isCompleted: function() {
            return this.value === hint.value;
        },
        notCompleted: function() {
            return !this.isCompleted();
        },
        Show: function() {
            hint.Show();
            dropdown.Show();
        },
        Hide: function() {
            hint.Hide();
            dropdown.Hide();
        },
        hasVisibleHint: function() {
            return this.notCompleted() && hint.isShow();
        },
        onchange: function() {
            this.Match();
            this.Show();
        },
        oninput: function() {
            this.onchange();
        },
        onfocus: function() {
            this.Match();
            this.Show();
        },
        onblur: function() {
            this.Hide();
        },
        onkeydown: function(event) {
            var keyCode = (event || window.event).keyCode;

            switch(keyCode) {
                case 27: // esc
                    if (this.hasVisibleHint()) {
                        this.Hide();
                        this.focus();
                        // disable jump out(default action) for the first time
                        event.preventDefault();
                        event.stopPropagation();
                    };
                    break;
                case 33: // page up
                case 34: // page down
                    return;
                case 38: // up
                    dropdown.Move(-1);
                    return;
                case 40: // down
                    dropdown.Move(+1);
                    return;
                case  9: // tab
                case 13: // enter
                case 35: // end
                case 39: // right
                    // auto complete
                    if (this.hasVisibleHint()) {
                        this.Complete(hint.realValue);
                        // disable submit(default action) for the first time
                        event.preventDefault();
                        event.stopPropagation();
                    };
                    return;
            };
        }
    });

    // add to the document
    wrapper.appendChild(hint);
    wrapper.appendChild(input);
    wrapper.appendChild(dropdown);
    root.appendChild(wrapper);

    // return the rComplete obj
    return {
        wrapper: wrapper,
        input: input,
        hint: hint,
        dropdown: dropdown,

        setOptions: function(options) {
            input.Options = options;
            return this;
        },
        getOptions: function() {
            return input.Options;
        },
        setText: function(text) {
            input.Complete(text);
            return this;
        },
        getText: function() {
            return input.value;
        }
    };
};
