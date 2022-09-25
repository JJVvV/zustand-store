# zustand-store

[![NPM](https://img.shields.io/npm/v/zustand-store.svg)](https://www.npmjs.com/package/zustand-store) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A zustand store with immer, which makes zustand support class pattern.

## Install

```bash
npm install --save zustand-store
```

## Usage

```tsx
import React from 'react';
import { useStore } from './store';

const App = () => {
  const store = useStore();
  const onClick = () => {
    store.updateTime(Date.now());
  };
  const isLoading = store.loading.updateTime;

  return (
    <div>
      <div>current time: {isLoading ? 'loading...' : store.time} 😄"</div>
      <button onClick={onClick}>click me</button>
    </div>
  );
};

export default App;
```

./store.tsx

```tsx
import Store from 'zustand-store';

class StoreClass extends Store.BaseStore<StoreClass> {
  public time = Date.now();

  @Store.loading()
  public async updateTime(time: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.set((state) => {
          state.time = time;
        });
        resolve();
      }, 2000);
    });
  }
}
export const useStore = Store.create(StoreClass);
```

## License

MIT © [JJVvV](https://github.com/JJVvV)
