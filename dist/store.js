"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStore = exports.loading = exports.useStore = exports.createStore = exports.create = void 0;
var zustand = __importStar(require("zustand"));
var immer_1 = require("zustand/middleware/immer");
var immer_2 = require("immer");
var createStore = zustand.createStore, create = zustand.default, useStore = zustand.useStore;
exports.createStore = createStore;
exports.create = create;
exports.useStore = useStore;
function loading(loadingName) {
    return function (_, propertyKey, descriptor) {
        var original = descriptor.value;
        var loadingKey = loadingName || propertyKey;
        descriptor.value = function () {
            var _this = this;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            this.set(function (state) {
                state.loading[loadingKey] = true;
            });
            var ret = original.call.apply(original, __spreadArray([this], args, false));
            if (ret.finally) {
                ret.finally(function () {
                    _this.set(function (state) {
                        state.loading[loadingKey] = false;
                    });
                });
            }
            return ret;
        };
    };
}
exports.loading = loading;
var BaseStore = (function () {
    function BaseStore(set, get) {
        this[_a] = true;
        this.set = set;
        this.get = get;
        this.loading = {};
    }
    return BaseStore;
}());
exports.BaseStore = BaseStore;
_a = immer_2.immerable;
var Store = (function () {
    function Store() {
    }
    Store.create = function (Clazz) {
        var realRet = create((0, immer_1.immer)(function (set, get) {
            var ret = new Clazz(set, get);
            loopPrototype(ret, function (key, proto) {
                var descriptor = Object.getOwnPropertyDescriptor(proto, key);
                if (!(descriptor === null || descriptor === void 0 ? void 0 : descriptor.get)) {
                    if (typeof proto[key] === 'function') {
                        ret[key] = function () {
                            var _b;
                            var args = [];
                            for (var _i = 0; _i < arguments.length; _i++) {
                                args[_i] = arguments[_i];
                            }
                            return (_b = proto[key]).call.apply(_b, __spreadArray([realRet.getState()], args, false));
                        };
                    }
                    else {
                        Object.defineProperty(ret, key, {
                            enumerable: true,
                            get: function () {
                                return realRet.getState()[key];
                            },
                        });
                    }
                }
                else {
                    Object.defineProperty(ret, key, {
                        enumerable: true,
                        get: function () {
                            return descriptor.get.call(realRet.getState());
                        },
                    });
                }
            });
            return ret;
        }));
        return realRet;
    };
    Store.BaseStore = BaseStore;
    Store.loading = loading;
    return Store;
}());
exports.default = Store;
function loopPrototype(obj, callback) {
    var p = [];
    var proto = obj;
    while (proto != null) {
        proto = Object.getPrototypeOf(proto);
        if (proto == null) {
            break;
        }
        var op = Object.getOwnPropertyNames(proto);
        for (var i = 0; i < op.length; i++) {
            if (p.indexOf(op[i]) === -1) {
                callback(op[i], proto);
            }
        }
        if (proto === BaseStore.prototype) {
            break;
        }
    }
}
