define("app/index/admin/list-debug.handlebars", [ "gallery/handlebars/1.0.2/runtime-debug" ], function(require, exports, module) {
    var Handlebars = require("gallery/handlebars/1.0.2/runtime-debug");
    var template = Handlebars.template;
    module.exports = template(function(Handlebars, depth0, helpers, partials, data) {
        this.compilerInfo = [ 3, ">= 1.0.0-rc.4" ];
        helpers = helpers || {};
        for (var key in Handlebars.helpers) {
            helpers[key] = helpers[key] || Handlebars.helpers[key];
        }
        data = data || {};
        var stack1, stack2, options, functionType = "function", escapeExpression = this.escapeExpression, helperMissing = helpers.helperMissing, self = this;
        function program1(depth0, data) {
            return '\r\n    <div class="nodata-box">\r\n        <img src="http://ue1.17173cdn.com/a/2035/open/2014/img/nodata.jpg" alt="暂无服务号" width="84" height="90">\r\n        <div class="tit">暂无数据</div>\r\n    </div>\r\n';
        }
        function program3(depth0, data, depth1) {
            var buffer = "", stack1;
            buffer += "\r\n    ";
            stack1 = helpers["if"].call(depth0, depth1.isAll, {
                hash: {},
                inverse: self.program(18, program18, data),
                fn: self.program(4, program4, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += "\r\n";
            return buffer;
        }
        function program4(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n        <div class="mod-hd">\r\n            <div class="tit tit-name">服务号名称</div>\r\n            <div class="tit tit-name">申请人</div>\r\n            <div class="tit w-1">当前状态</div>\r\n            <div class="tit w-1">资料审核</div>\r\n            <div class="tit">操作时间</div>\r\n        </div>\r\n        <div class="comm-bd">\r\n            <ul class="comm-list">\r\n                ';
            stack1 = helpers.each.call(depth0, depth0.listData, {
                hash: {},
                inverse: self.noop,
                fn: self.program(5, program5, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '\r\n            </ul>\r\n            <ul class="pagination" id="J_Page"></ul>\r\n        </div>\r\n    ';
            return buffer;
        }
        function program5(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n                    <li class="list-item" data-id="';
            if (stack1 = helpers.id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n                        <div class="pic-box"><img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.serviceTagImg, options) : helperMissing.call(depth0, "getImage", depth0.serviceTagImg, options))) + '?w=50&h=50&q=75" width="40" height="40" alt="" class="pic-service"></div>\r\n                        <div class="info name" title="';
            if (stack2 = helpers.serviceTagName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.serviceTagName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '">';
            if (stack2 = helpers.serviceTagName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.serviceTagName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '</div>\r\n                        <div class="info name" title="';
            if (stack2 = helpers.userName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.userName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.userName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.userName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + "</div>\r\n                        ";
            options = {
                hash: {},
                inverse: self.program(8, program8, data),
                fn: self.program(6, program6, data),
                data: data
            };
            stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, depth0.status, "11", options) : helperMissing.call(depth0, "judge", depth0.status, "11", options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '\r\n                        <div class="info w-1">';
            stack2 = helpers["if"].call(depth0, depth0.secondCheckStatusName, {
                hash: {},
                inverse: self.program(12, program12, data),
                fn: self.program(10, program10, data),
                data: data
            });
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '</div>\r\n                        <div class="info">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.fDate, stack1 ? stack1.call(depth0, depth0.updateTime, options) : helperMissing.call(depth0, "fDate", depth0.updateTime, options))) + "</div>\r\n                        ";
            options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(14, program14, data),
                data: data
            };
            stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, depth0.status, "10", options) : helperMissing.call(depth0, "judge", depth0.status, "10", options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += "\r\n                        ";
            options = {
                hash: {},
                inverse: self.noop,
                fn: self.program(16, program16, data),
                data: data
            };
            stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, depth0.status, "11", options) : helperMissing.call(depth0, "judge", depth0.status, "11", options));
            if (stack2 || stack2 === 0) {
                buffer += stack2;
            }
            buffer += '\r\n                        <a href="javascript:;" class="btn comm-btn2" data-role="get">查看</a>\r\n                    </li>\r\n                ';
            return buffer;
        }
        function program6(depth0, data) {
            return '\r\n                            <div class="info w-1 c-tx1">停用</div>\r\n                        ';
        }
        function program8(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n                            <div class="info w-1">';
            if (stack1 = helpers.statusName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.statusName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + "</div>\r\n                        ";
            return buffer;
        }
        function program10(depth0, data) {
            var stack1;
            if (stack1 = helpers.secondCheckStatusName) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.secondCheckStatusName;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            return escapeExpression(stack1);
        }
        function program12(depth0, data) {
            return "&nbsp;";
        }
        function program14(depth0, data) {
            return '\r\n                            <a href="javascript:;" class="btn comm-btn2" data-role="stop">停用</a>\r\n                        ';
        }
        function program16(depth0, data) {
            return '\r\n                            <a href="javascript:;" class="btn comm-btn2" data-role="start">启用</a>\r\n                        ';
        }
        function program18(depth0, data) {
            var buffer = "", stack1;
            buffer += '\r\n        <div class="mod-hd">\r\n            <div class="tit tit-name">服务号名称</div>\r\n            <div class="tit tit-name">申请人</div>\r\n            <div class="tit">操作时间</div>\r\n        </div>\r\n        <div class="comm-bd">\r\n            <ul class="comm-list">\r\n                ';
            stack1 = helpers.each.call(depth0, depth0.listData, {
                hash: {},
                inverse: self.noop,
                fn: self.program(19, program19, data),
                data: data
            });
            if (stack1 || stack1 === 0) {
                buffer += stack1;
            }
            buffer += '\r\n            </ul>\r\n            <ul class="pagination" id="J_Page"></ul>\r\n        </div>\r\n    ';
            return buffer;
        }
        function program19(depth0, data) {
            var buffer = "", stack1, stack2, options;
            buffer += '\r\n                    <li class="list-item" data-id="';
            if (stack1 = helpers.id) {
                stack1 = stack1.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack1 = depth0.id;
                stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1;
            }
            buffer += escapeExpression(stack1) + '">\r\n                        <div class="pic-box"><img src="';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.getImage, stack1 ? stack1.call(depth0, depth0.serviceTagImg, options) : helperMissing.call(depth0, "getImage", depth0.serviceTagImg, options))) + '?w=50&h=50&q=75" width="40" height="40" alt="" class="pic-service"></div>\r\n                        <div class="info name" title="';
            if (stack2 = helpers.serviceTagName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.serviceTagName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.serviceTagName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.serviceTagName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                        <div class="info name" title="';
            if (stack2 = helpers.createUserName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.createUserName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '">';
            if (stack2 = helpers.createUserName) {
                stack2 = stack2.call(depth0, {
                    hash: {},
                    data: data
                });
            } else {
                stack2 = depth0.createUserName;
                stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2;
            }
            buffer += escapeExpression(stack2) + '</div>\r\n                        <div class="info">';
            options = {
                hash: {},
                data: data
            };
            buffer += escapeExpression((stack1 = helpers.fDate, stack1 ? stack1.call(depth0, depth0.createTime, options) : helperMissing.call(depth0, "fDate", depth0.createTime, options))) + '</div>\r\n                        <a href="javascript:;" class="btn comm-btn2" data-role="get">审核</a>\r\n                    </li>\r\n                ';
            return buffer;
        }
        options = {
            hash: {},
            inverse: self.programWithDepth(3, program3, data, depth0),
            fn: self.program(1, program1, data),
            data: data
        };
        stack2 = (stack1 = helpers.judge, stack1 ? stack1.call(depth0, (stack1 = depth0.listData, 
        stack1 == null || stack1 === false ? stack1 : stack1.length), 0, options) : helperMissing.call(depth0, "judge", (stack1 = depth0.listData, 
        stack1 == null || stack1 === false ? stack1 : stack1.length), 0, options));
        if (stack2 || stack2 === 0) {
            return stack2;
        } else {
            return "";
        }
    });
});

define("gallery/handlebars/1.0.2/runtime-debug", [], function(require, exports, module) {
    /*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
    // lib/handlebars/browser-prefix.js
    var Handlebars = {};
    (function(Handlebars, undefined) {
        // lib/handlebars/base.js
        Handlebars.VERSION = "1.0.0-rc.4";
        Handlebars.COMPILER_REVISION = 3;
        Handlebars.REVISION_CHANGES = {
            1: "<= 1.0.rc.2",
            // 1.0.rc.2 is actually rev2 but doesn't report it
            2: "== 1.0.0-rc.3",
            3: ">= 1.0.0-rc.4"
        };
        Handlebars.helpers = {};
        Handlebars.partials = {};
        var toString = Object.prototype.toString, functionType = "[object Function]", objectType = "[object Object]";
        Handlebars.registerHelper = function(name, fn, inverse) {
            if (toString.call(name) === objectType) {
                if (inverse || fn) {
                    throw new Handlebars.Exception("Arg not supported with multiple helpers");
                }
                Handlebars.Utils.extend(this.helpers, name);
            } else {
                if (inverse) {
                    fn.not = inverse;
                }
                this.helpers[name] = fn;
            }
        };
        Handlebars.registerPartial = function(name, str) {
            if (toString.call(name) === objectType) {
                Handlebars.Utils.extend(this.partials, name);
            } else {
                this.partials[name] = str;
            }
        };
        Handlebars.registerHelper("helperMissing", function(arg) {
            if (arguments.length === 2) {
                return undefined;
            } else {
                throw new Error("Could not find property '" + arg + "'");
            }
        });
        Handlebars.registerHelper("blockHelperMissing", function(context, options) {
            var inverse = options.inverse || function() {}, fn = options.fn;
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (context === true) {
                return fn(this);
            } else if (context === false || context == null) {
                return inverse(this);
            } else if (type === "[object Array]") {
                if (context.length > 0) {
                    return Handlebars.helpers.each(context, options);
                } else {
                    return inverse(this);
                }
            } else {
                return fn(context);
            }
        });
        Handlebars.K = function() {};
        Handlebars.createFrame = Object.create || function(object) {
            Handlebars.K.prototype = object;
            var obj = new Handlebars.K();
            Handlebars.K.prototype = null;
            return obj;
        };
        Handlebars.logger = {
            DEBUG: 0,
            INFO: 1,
            WARN: 2,
            ERROR: 3,
            level: 3,
            methodMap: {
                0: "debug",
                1: "info",
                2: "warn",
                3: "error"
            },
            // can be overridden in the host environment
            log: function(level, obj) {
                if (Handlebars.logger.level <= level) {
                    var method = Handlebars.logger.methodMap[level];
                    if (typeof console !== "undefined" && console[method]) {
                        console[method].call(console, obj);
                    }
                }
            }
        };
        Handlebars.log = function(level, obj) {
            Handlebars.logger.log(level, obj);
        };
        Handlebars.registerHelper("each", function(context, options) {
            var fn = options.fn, inverse = options.inverse;
            var i = 0, ret = "", data;
            if (options.data) {
                data = Handlebars.createFrame(options.data);
            }
            if (context && typeof context === "object") {
                if (context instanceof Array) {
                    for (var j = context.length; i < j; i++) {
                        if (data) {
                            data.index = i;
                        }
                        ret = ret + fn(context[i], {
                            data: data
                        });
                    }
                } else {
                    for (var key in context) {
                        if (context.hasOwnProperty(key)) {
                            if (data) {
                                data.key = key;
                            }
                            ret = ret + fn(context[key], {
                                data: data
                            });
                            i++;
                        }
                    }
                }
            }
            if (i === 0) {
                ret = inverse(this);
            }
            return ret;
        });
        Handlebars.registerHelper("if", function(context, options) {
            var type = toString.call(context);
            if (type === functionType) {
                context = context.call(this);
            }
            if (!context || Handlebars.Utils.isEmpty(context)) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        });
        Handlebars.registerHelper("unless", function(context, options) {
            return Handlebars.helpers["if"].call(this, context, {
                fn: options.inverse,
                inverse: options.fn
            });
        });
        Handlebars.registerHelper("with", function(context, options) {
            if (!Handlebars.Utils.isEmpty(context)) return options.fn(context);
        });
        Handlebars.registerHelper("log", function(context, options) {
            var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
            Handlebars.log(level, context);
        });
        // lib/handlebars/utils.js
        var errorProps = [ "description", "fileName", "lineNumber", "message", "name", "number", "stack" ];
        Handlebars.Exception = function(message) {
            var tmp = Error.prototype.constructor.apply(this, arguments);
            // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
            for (var idx = 0; idx < errorProps.length; idx++) {
                this[errorProps[idx]] = tmp[errorProps[idx]];
            }
        };
        Handlebars.Exception.prototype = new Error();
        // Build out our basic SafeString type
        Handlebars.SafeString = function(string) {
            this.string = string;
        };
        Handlebars.SafeString.prototype.toString = function() {
            return this.string.toString();
        };
        var escape = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;"
        };
        var badChars = /[&<>"'`]/g;
        var possible = /[&<>"'`]/;
        var escapeChar = function(chr) {
            return escape[chr] || "&amp;";
        };
        Handlebars.Utils = {
            extend: function(obj, value) {
                for (var key in value) {
                    if (value.hasOwnProperty(key)) {
                        obj[key] = value[key];
                    }
                }
            },
            escapeExpression: function(string) {
                // don't escape SafeStrings, since they're already safe
                if (string instanceof Handlebars.SafeString) {
                    return string.toString();
                } else if (string == null || string === false) {
                    return "";
                }
                // Force a string conversion as this will be done by the append regardless and
                // the regex test will do this transparently behind the scenes, causing issues if
                // an object's to string has escaped characters in it.
                string = string.toString();
                if (!possible.test(string)) {
                    return string;
                }
                return string.replace(badChars, escapeChar);
            },
            isEmpty: function(value) {
                if (!value && value !== 0) {
                    return true;
                } else if (toString.call(value) === "[object Array]" && value.length === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        };
        // lib/handlebars/runtime.js
        Handlebars.VM = {
            template: function(templateSpec) {
                // Just add water
                var container = {
                    escapeExpression: Handlebars.Utils.escapeExpression,
                    invokePartial: Handlebars.VM.invokePartial,
                    programs: [],
                    program: function(i, fn, data) {
                        var programWrapper = this.programs[i];
                        if (data) {
                            programWrapper = Handlebars.VM.program(i, fn, data);
                        } else if (!programWrapper) {
                            programWrapper = this.programs[i] = Handlebars.VM.program(i, fn);
                        }
                        return programWrapper;
                    },
                    programWithDepth: Handlebars.VM.programWithDepth,
                    noop: Handlebars.VM.noop,
                    compilerInfo: null
                };
                return function(context, options) {
                    options = options || {};
                    var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);
                    var compilerInfo = container.compilerInfo || [], compilerRevision = compilerInfo[0] || 1, currentRevision = Handlebars.COMPILER_REVISION;
                    if (compilerRevision !== currentRevision) {
                        if (compilerRevision < currentRevision) {
                            var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision], compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
                            throw "Template was precompiled with an older version of Handlebars than the current runtime. " + "Please update your precompiler to a newer version (" + runtimeVersions + ") or downgrade your runtime to an older version (" + compilerVersions + ").";
                        } else {
                            // Use the embedded version info since the runtime doesn't know about this revision yet
                            throw "Template was precompiled with a newer version of Handlebars than the current runtime. " + "Please update your runtime to a newer version (" + compilerInfo[1] + ").";
                        }
                    }
                    return result;
                };
            },
            programWithDepth: function(i, fn, data) {
                var args = Array.prototype.slice.call(arguments, 3);
                var program = function(context, options) {
                    options = options || {};
                    return fn.apply(this, [ context, options.data || data ].concat(args));
                };
                program.program = i;
                program.depth = args.length;
                return program;
            },
            program: function(i, fn, data) {
                var program = function(context, options) {
                    options = options || {};
                    return fn(context, options.data || data);
                };
                program.program = i;
                program.depth = 0;
                return program;
            },
            noop: function() {
                return "";
            },
            invokePartial: function(partial, name, context, helpers, partials, data) {
                var options = {
                    helpers: helpers,
                    partials: partials,
                    data: data
                };
                if (partial === undefined) {
                    throw new Handlebars.Exception("The partial " + name + " could not be found");
                } else if (partial instanceof Function) {
                    return partial(context, options);
                } else if (!Handlebars.compile) {
                    throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
                } else {
                    partials[name] = Handlebars.compile(partial, {
                        data: data !== undefined
                    });
                    return partials[name](context, options);
                }
            }
        };
        Handlebars.template = Handlebars.VM.template;
    })(Handlebars);
    module.exports = Handlebars;
});
