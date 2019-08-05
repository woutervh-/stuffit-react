import { Store } from 'stuffit';
import { Connect } from './connect';

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
 * @ExplicitState({ counter: store })
 * class MyComponent extends React.PureComponent<{}, State> {
 *   render() {
 *     return <span>Number: {this.state.counter}</span>;
 *   }
 * }
 * ```
 */
export const ExplicitConnect = <T extends { [Key: string]: Store<unknown> }>(stores: T) => {
    return Connect(() => stores);
};
