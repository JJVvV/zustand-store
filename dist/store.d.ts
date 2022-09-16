import { immerable } from 'immer';
import type { Draft } from 'immer';
declare type StoreImmer<S> = S extends {
    getState: () => infer T;
    setState: infer SetState;
} ? SetState extends (...a: any[]) => infer Sr ? (nextStateOrUpdater: T | Partial<T> | ((state: Draft<T>) => void), shouldReplace?: boolean | undefined) => Sr : never : never;
/**
 * loading 装饰器
 * @param loadingName 自定义 loading key => store.loading[loadingName]
 */
export declare function loading(loadingName?: string): (_: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare class BaseStore<T extends object = any> {
    set: StoreImmer<{
        getState(): T;
        setState(): T;
    }>;
    loading: {
        [key: string]: boolean;
    };
    [immerable]: boolean;
    constructor(set: StoreImmer<{
        getState(): T;
        setState(): T;
    }>);
}
declare type FilterPromiseKeys<T extends object> = {
    [K in keyof T]-?: T[K] extends (...args: any[]) => Promise<any> ? K : never;
}[keyof T];
declare type LoadingKeys<T extends object> = Exclude<FilterPromiseKeys<T>, 'set'>;
export default class Store {
    static BaseStore: typeof BaseStore;
    static loading: typeof loading;
    static create<T extends new (set: any) => BaseStore<any>>(Clazz: T): import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<InstanceType<T> & {
        loading: { [key in Exclude<FilterPromiseKeys<InstanceType<T>>, "set">]: boolean | undefined; };
        set: StoreImmer<{
            getState(): InstanceType<T>;
            setState(): InstanceType<T>;
        }>;
    }>, "setState"> & {
        setState(nextStateOrUpdater: (InstanceType<T> & {
            loading: { [key in Exclude<FilterPromiseKeys<InstanceType<T>>, "set">]: boolean | undefined; };
            set: StoreImmer<{
                getState(): InstanceType<T>;
                setState(): InstanceType<T>;
            }>;
        }) | Partial<InstanceType<T> & {
            loading: { [key in Exclude<FilterPromiseKeys<InstanceType<T>>, "set">]: boolean | undefined; };
            set: StoreImmer<{
                getState(): InstanceType<T>;
                setState(): InstanceType<T>;
            }>;
        }> | ((state: Draft<InstanceType<T> & {
            loading: { [key in Exclude<FilterPromiseKeys<InstanceType<T>>, "set">]: boolean | undefined; };
            set: StoreImmer<{
                getState(): InstanceType<T>;
                setState(): InstanceType<T>;
            }>;
        }>) => void), shouldReplace?: boolean | undefined): void;
    }>;
}
export {};
