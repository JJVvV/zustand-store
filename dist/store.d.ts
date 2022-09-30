import * as zustand from 'zustand';
import { immerable } from 'immer';
import type { Draft } from 'immer';
declare const createStore: {
    <T, Mos extends ["zustand/immer", unknown][] = []>(initializer: zustand.StateCreator<T, [], Mos, T>): zustand.Mutate<zustand.StoreApi<T>, Mos>;
    <T_1>(): <Mos_1 extends ["zustand/immer", unknown][] = []>(initializer: zustand.StateCreator<T_1, [], Mos_1, T_1>) => zustand.Mutate<zustand.StoreApi<T_1>, Mos_1>;
}, create: {
    <T, Mos extends ["zustand/immer", unknown][] = []>(initializer: zustand.StateCreator<T, [], Mos, T>): zustand.UseBoundStore<zustand.Mutate<zustand.StoreApi<T>, Mos>>;
    <T_1>(): <Mos_1 extends ["zustand/immer", unknown][] = []>(initializer: zustand.StateCreator<T_1, [], Mos_1, T_1>) => zustand.UseBoundStore<zustand.Mutate<zustand.StoreApi<T_1>, Mos_1>>;
    <S extends zustand.StoreApi<unknown>>(store: S): zustand.UseBoundStore<S>;
}, useStore: typeof zustand.useStore;
export { create, createStore, useStore };
declare type StoreImmer<S> = S extends {
    getState: () => infer T;
    setState: infer SetState;
} ? SetState extends (...a: any[]) => infer Sr ? (nextStateOrUpdater: T | Partial<T> | ((state: Draft<T>) => void), shouldReplace?: boolean | undefined) => Sr : never : never;
export declare function loading(loadingName?: string): (_: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare class BaseStore<T extends object = any> {
    set: StoreImmer<{
        getState(): T;
        setState(): T;
    }>;
    get: () => T;
    loading: {
        [key: string]: boolean;
    };
    [immerable]: boolean;
    constructor(set: StoreImmer<{
        getState(): T;
        setState(): T;
    }>, get: () => T);
}
declare type FilterPromiseKeys<T extends object> = {
    [K in keyof T]-?: T[K] extends (...args: any[]) => Promise<any> ? K : never;
}[keyof T];
declare type LoadingKeys<T extends object> = Exclude<FilterPromiseKeys<T>, 'set'>;
export default class Store {
    static BaseStore: typeof BaseStore;
    static loading: typeof loading;
    static create<T extends new (set: any, get: any) => BaseStore<any>>(Clazz: T): zustand.UseBoundStore<Omit<zustand.StoreApi<InstanceType<T> & {
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
