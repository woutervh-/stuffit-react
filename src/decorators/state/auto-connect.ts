import { Store } from 'stuffit';
import { Connect } from './connect';

type InferredConnectedState<P extends {}> = { [Key in keyof P]: P[Key] extends Store<infer V> ? V : never };

/**
 * Injects state into the component from the given stores.
 *
 * ```typescript
 * interface Props {
 *   counter: Store<number>;
 * }
 *
 * interface State {
 *   counter: number;
 * }
 *
 * @AutoConnect
 * class MyComponent extends React.PureComponent<Props, State> {
 *   render() {
 *     return <span>Number: {this.state.counter}</span>;
 *   }
 * }
 * ```
 */
export const AutoConnect = Connect(function () {
    const stores = {} as { [Key: string]: Store<unknown> };
    for (const key of Object.keys(this.props)) {
        if ((this.props as { [Key: string]: unknown })[key] instanceof Store) {
            stores[key] = (this.props as { [Key: string]: Store<unknown> })[key];
        }
    }
    return stores;
}) as <P extends {}, U extends React.ComponentClass<P, InferredConnectedState<P>>>(constructor: U) => U;
