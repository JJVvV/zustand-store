"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseStore = exports.loading = void 0;
var zustand_1 = __importDefault(require("zustand"));
var immer_1 = require("zustand/middleware/immer");
var immer_2 = require("immer");
/**
 * loading 装饰器
 * @param loadingName 自定义 loading key => store.loading[loadingName]
 */
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
var BaseStore = /** @class */ (function () {
    function BaseStore(set) {
        this[_a] = true;
        this.set = set;
        this.loading = {};
    }
    return BaseStore;
}());
exports.BaseStore = BaseStore;
_a = immer_2.immerable;
var Store = /** @class */ (function () {
    function Store() {
    }
    Store.create = function (Clazz) {
        return (0, zustand_1.default)((0, immer_1.immer)(function (set) {
            var ret = new Clazz(set);
            loopPrototype(ret, function (key, proto) {
                var descriptor = Object.getOwnPropertyDescriptor(proto, key);
                if (!(descriptor === null || descriptor === void 0 ? void 0 : descriptor.get)) {
                    ret[key] = proto[key];
                }
                else {
                    Object.defineProperty(ret, key, {
                        enumerable: true,
                        get: function () {
                            return descriptor.get.call(this);
                        },
                    });
                }
            });
            return ret;
        }));
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
