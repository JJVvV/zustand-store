import * as zustand from 'zustand';
import shallow from 'zustand/shallow';
import { immer } from 'zustand/middleware/immer';
import { immerable } from 'immer';
// eslint-disable-next-line no-unused-vars
import type { Draft } from 'immer';

const { createStore, default: create, useStore } = zustand;
export { create, createStore, useStore };

type StoreImmer<S> = S extends {
  getState: () => infer T;
  setState: infer SetState;
}
  ? SetState extends (...a: any[]) => infer Sr
    ? (
        nextStateOrUpdater: T | Partial<T> | ((state: Draft<T>) => void),
        shouldReplace?: boolean | undefined,
      ) => Sr
    : never
  : never;

/**
 * loading 装饰器
 * @param loadingName 自定义 loading key => store.loading[loadingName]
 */
export function loading(loadingName?: string) {
  return function (
    _: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;
    const loadingKey = loadingName || propertyKey;
    descriptor.value = function (...args: any[]) {
      this.set!((state: any) => {
        state.loading[loadingKey] = true;
      });
      const ret = original.call(this, ...args);
      if (ret.finally) {
        ret.finally(() => {
          this.set!((state: any) => {
            state.loading[loadingKey] = false;
          });
        });
      }
      return ret;
    };
  };
}

export class BaseStore<T extends object = any> {
  set: StoreImmer<{
    getState(): T;
    setState(): T;
  }>;
  get: () => T;

  loading: { [key: string]: boolean };
  [immerable] = true;
  constructor(
    set: StoreImmer<{
      getState(): T;
      setState(): T;
    }>,
    get: () => T,
  ) {
    this.set = set;
    this.get = get;
    this.loading = {};
  }
}

type FilterPromiseKeys<T extends object> = {
  [K in keyof T]-?: T[K] extends (...args: any[]) => Promise<any> ? K : never;
}[keyof T];

type LoadingKeys<T extends object> = Exclude<FilterPromiseKeys<T>, 'set'>;

export default class Store {
  static BaseStore = BaseStore;
  static loading = loading;
  static create<T extends new (set: any, get: any) => BaseStore<any>>(
    Clazz: T,
  ) {
    const realRet = create(
      immer<
        InstanceType<T> & {
          loading: {
            // eslint-disable-next-line no-unused-vars
            [key in LoadingKeys<InstanceType<T>>]: boolean | undefined;
          };
          set: StoreImmer<{
            getState(): InstanceType<T>;
            setState(): InstanceType<T>;
          }>;
        }
      >((set, get) => {
        const ret: any = new Clazz(set, get);
        loopPrototype(ret, (key, proto) => {
          const descriptor = Object.getOwnPropertyDescriptor(proto, key);
          if (!descriptor?.get) {
            if (typeof (proto as any)[key] === 'function') {
              (ret as any)[key] = function (...args: unknown[]) {
                return (proto as any)[key].call(realRet.getState(), ...args);
              };
            } else {
              Object.defineProperty(ret, key, {
                enumerable: true,
                get() {
                  return (realRet.getState() as any)[key];
                },
              });
            }
          } else {
            Object.defineProperty(ret, key, {
              enumerable: true,
              get() {
                return descriptor.get!.call(realRet.getState());
              },
            });
          }
        });
        return ret;
      }),
    );
    const ret = function (a: any, b: any) {
      return realRet(a, b || shallow);
    };
    Object.assign(ret, realRet);
    return ret as typeof realRet;
  }
}

function loopPrototype<T extends object>(
  obj: T,
  callback: (key: string, proto: T) => void,
) {
  const p: string[] = [];
  let proto = obj;
  while (proto != null) {
    proto = Object.getPrototypeOf(proto);
    if (proto == null) {
      break;
    }
    const op = Object.getOwnPropertyNames(proto);
    for (let i = 0; i < op.length; i++) {
      if (p.indexOf(op[i]) === -1) {
        callback(op[i], proto);
      }
    }
    if (proto === BaseStore.prototype) {
      break;
    }
  }
}
