import { Store } from 'stuffit';
import { Connect } from './connect';

type InferredManualProps<T extends string> = { [Key in T]: Store<unknown> };
type InferredConnectedState<T extends { [Key: string]: Store<unknown> }> = { [Key in keyof T]: T[Key] extends Store<infer V> ? V : never };

export const ManualConnect = <T extends string>(...storeKeys: T[]) => {
    return Connect(function () {
        const stores = {} as InferredManualProps<T>;
        for (const key of storeKeys) {
            stores[key] = (this.props as { [Key in T]: Store<unknown> })[key];
        }
        return stores;
    }) as <U extends React.ComponentClass<InferredManualProps<T>, InferredConnectedState<{ [Key in T]: Store<unknown> }>>>(constructor: U) => void;
};
