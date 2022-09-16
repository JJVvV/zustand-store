import create from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { immerable } from 'immer';
// eslint-disable-next-line no-unused-vars
import type { Draft } from 'immer';

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
    };
  };
}

export class BaseStore<T extends object = any> {
  set: StoreImmer<{
    getState(): T;
    setState(): T;
  }>;

  loading: { [key: string]: boolean };
  [immerable] = true;
  constructor(
    set: StoreImmer<{
      getState(): T;
      setState(): T;
    }>,
  ) {
    this.set = set;
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
  static create<T extends new (set: any) => BaseStore<any>>(Clazz: T) {
    return create(
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
      >((set) => {
        const ret: any = new Clazz(set);
        loopPrototype(ret, (key, proto) => {
          (ret as any)[key] = (proto as any)[key];
        });
        return ret;
      }),
    );
  }
}

function loopPrototype<T extends object>(
  obj: T,
  callback: (key: string, proto: T) => void,
) {
  const p: string[] = [];
  for (
    ;
    obj != null && obj !== Store.prototype;
    obj = Object.getPrototypeOf(obj)
  ) {
    const op = Object.getOwnPropertyNames(obj);
    for (let i = 0; i < op.length; i++) {
      if (p.indexOf(op[i]) === -1) {
        callback(op[i], obj);
      }
    }
  }
}

// export const useStore = Store.create(class A extends BaseStore<A> {})

// class User extends Store.BaseStore<User> {
//   getName(){

//   }
// }
