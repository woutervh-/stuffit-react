import { Store } from 'stuffit';
import { Connect } from './connect';

type InferredManualProps<T extends { [Key: string]: string }> = { [Key in keyof T]: Store<unknown> };
type InferredConnectedState<P extends { [Key: string]: Store<unknown> }> = { [Key in keyof P]: P[Key] extends Store<infer V> ? V : never };

/**
 * Injects state into the component from the given stores.
 *
 * ```typescript
 * interface Props {
 *   store: Store<number>;
 * }
 *
 * interface State {
 *   counter: number;
 * }
 *
 * @ManualConnect({ store: 'counter' })
 * class MyComponent extends React.PureComponent<Props, State> {
 *   render() {
 *     return <span>Number: {this.state.counter}</span>;
 *   }
 * }
 * ```
 */
export const ManualConnect = <T extends { [Key: string]: string }>(storeKeys: T) => {
    return Connect(function () {
        const stores = {} as InferredManualProps<T>;
        for (const key of Object.keys(storeKeys)) {
            stores[storeKeys[key] as keyof InferredManualProps<T>] = (this.props as { [Key: string]: Store<unknown> })[key];
        }
        return stores;
    }) as <P extends InferredManualProps<T>, U extends React.ComponentClass<P, InferredConnectedState<P>>>(constructor: U) => void;
};
