import { Store } from 'stuffit';
import { Connect } from './connect';

/**
 * Will trigger forceUpdate whenever any of the given stores update.
 *
 * ```typescript
 * declare const store: Store<number>;
 *
 * @ExplicitConnect(store)
 * class MyComponent extends React.PureComponent {
 *   render() {
 *     return <span>Number: {store.state}</span>;
 *   }
 * }
 * ```
 */
export const ExplicitConnect = <T extends Store<unknown>>(...stores: T[]) => {
    return Connect(() => stores);
};
