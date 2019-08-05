import { Store } from 'stuffit';
import { Connect } from './connect';

type InferredConnectedState<P extends { [Key: string]: Store<unknown> }> = { [Key in keyof P]: P[Key] extends Store<infer V> ? V : never };

/**
 * Injects state into the component from the given stores.
 *
 * ```typescript
 * declare const store: Store<number>;
 *
 * interface State {
 *   counter: number;
 * }
 *
 * @ExplicitConnect({ counter: store })
 * class MyComponent extends React.PureComponent<{}, State> {
 *   render() {
 *     return <span>Number: {this.state.counter}</span>;
 *   }
 * }
 * ```
 */
export const ExplicitConnect = <T extends { [Key: string]: Store<unknown> }>(stores: T) => {
    return Connect(() => stores) as <U extends React.ComponentClass<{}, InferredConnectedState<T>>>(constructor: U) => void;
};
