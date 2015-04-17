/**
 * rComplete 1.2.1
 * FYHPL: http://ranmocy.info/piece/FYHPL.txt
 * Copyright (c) 2014 Ranmocy Sheng
 * Be good.
 **/
 (function(window, document) {
     function rComplete (root, user_config) {
        "use strict";

        // helpers
        function bindFunctions(self, functions) {
            Object.keys(functions).forEach(function(name) {
                self[name] = functions[name].bind(self);
            });
            return self;
        }
        function bindProperties(self, properties) {
            Object.keys(properties).forEach(function(name) {
                if (properties[name].constructor === Object) { // it's a hash
                    bindProperties(self[name], properties[name]);
                } else {
                    self[name] = properties[name];
                }
            });
            return self;
        }
        function getClasses(self) {
            return self.className.split(/\s+/);
        }
        function addClass(self, name) {
            var classes = getClasses(self);
            if (classes.indexOf(name) === -1) {
                classes.push(name);
                self.className = classes.join(' ');
            }
            return self;
        }
        function removeClass(self, name) {
            var re = new RegExp(name, "i");
            self.className = self.className.replace(re, '').replace(/\s+/, ' ');
            return self;
        }

        // default configs
        var config = {
            placeholder: "Placeholder",
            matcher: function(a, b) { return new RegExp("^" + a, "i").test(b); }
        };
        // merge user defined configs
        if (user_config) {
            Object.keys(user_config).forEach(function(key) {
                config[key] = user_config[key];
            });
        }

        // create elements
        var wrapper = bindProperties(document.createElement('div'), {
            className: "complete-wrapper",
            style: {
                position: 'relative'
            }
        });

        var input = bindProperties(document.createElement('input'), {
            className: "complete-input",
            type: 'text',
            value: '',
            spellcheck: false,
            Options: [],
            Matches: [],
            style: {
                position: 'relative',
                width: "100%",
                verticalAlign: "top",
                backgroundColor: 'transparent'
            }
        });

        var hint = bindProperties(input.cloneNode(), {
            className: "complete-hint",
            disabled: true,
            value: config.placeholder,
            realValue: '',
            style: {
                position: 'absolute'
            }
        });

        var dropdown = bindProperties(document.createElement('div'), {
            className: 'complete-dropdown',
            Index: 0,
            style: {
                display: 'none'
            }
        });


        // create methods
        function createDropdownItem() {
            var item = document.createElement('div');
            item.className = 'complete-dropdown-item';

            bindFunctions(item, {
                Hover: function() {
                    // all items should leave now
                    dropdown.LeaveAllItem();
                    addClass(this, 'hovered');
                    // update hint
                    hint.Render(this.textContent);
                },
                Leave: function() {
                    removeClass(this, 'hovered');
                },
                onclick: function() {
                    this.onmousedown();
                },
                onmouseover: function() {
                    this.Hover();
                },
                onmouseout:  function() {
                    this.Leave();
                },
                onmousedown: function() {
                    input.Complete(this.textContent);
                }
            });

            return item;
        }

        bindFunctions(dropdown, {
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
                }
                this.CurrentItem().Hover();
            },
            Render: function(matches) {
                this.Empty();

                var self = this;
                matches.forEach(function(d) {
                    var item = createDropdownItem();
                    item.innerHTML = d;
                    self.appendChild(item);
                });

                if (this.childNodes.length <= 1) {
                    this.Hide();
                }
            },
            LeaveAllItem: function() {
                // node list is not array, so I can't use forEach
                for (var i = 0; i < this.childNodes.length; i++) {
                    this.childNodes[i].Leave();
                }
            },
            Show: function() {
                if (this.childNodes.length > 1) {
                    this.style.display = null;
                }
            },
            Hide: function() {
                this.style.display = 'none';
            }
        });

        bindFunctions(hint, {
            Show: function() {
                this.style.display = null;
            },
            Hide: function() {
                if (input.value === '') {
                    this.realValue = '';
                    this.value = config.placeholder;
                } else {
                    this.style.display = 'none';
                }
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

        bindFunctions(input, {
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
                }
            },
            oncompleteCallback: function() {
                // User defined function
            },
            // complete input to TEXT
            Complete: function(text) {
                this.value = text;
                this.Match();
                this.Hide();
                this.oncompleteCallback();
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
            onchangeCallback: function() {
                // User defined function
            },
            onchange: function() {
                this.Match();
                this.Show();
                this.onchangeCallback();
            },
            oninput: function() {
                this.onchange();
            },
            onfocusCallback: function() {
                // User defined function
            },
            onfocus: function() {
                this.Match();
                this.Show();
                this.onfocusCallback();
            },
            onblurCallback: function() {
                // User defined function
            },
            onblur: function() {
                this.Hide();
                this.onblurCallback();
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
                        }
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
                        }
                        return;
                }
            }
        });

        // add to the document
        wrapper.appendChild(hint);
        wrapper.appendChild(input);
        wrapper.appendChild(dropdown);
        if (typeof root.append === 'function') {
            // root is a jQuery object
            root.append(wrapper);
        } else {
            // default is plain JS
            root.appendChild(wrapper);
        }

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
            },

            on: function(name, callback) {
                switch(name) {
                    case "complete":
                        input.oncompleteCallback = callback;
                        break;
                    case "change":
                        input.onchangeCallback = callback;
                        break;
                    case "focus":
                        input.onfocusCallback = callback;
                        break;
                    case "leave":
                        input.onblurCallback = callback;
                        break;
                    default:
                        console.error(name + " is not a vaid event name!");
                }
                return this;
            }
        };
    }

    // expose to the global object
    window.rComplete = rComplete;

    // expose as a common js module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = rComplete;
    }

    // expose rComplete as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(function() {
            return rComplete;
        });
    }
}) (window, document);
