import { Store } from 'stuffit';
import { Connect } from './connect';

type InferredManualProps<T extends string> = { [Key in T]: Store<unknown> };

/**
 * Will trigger forceUpdate whenever any of the stores in the props that match the given keys update.
 *
 * ```typescript
 * interface Props {
 *   store: Store<number>;
 * }
 *
 * @ManualConnect('store')
 * class MyComponent extends React.PureComponent<Props> {
 *   render() {
 *     return <span>Number: {this.props.store.state}</span>;
 *   }
 * }
 * ```
 */
export const ManualConnect = <T extends string>(...storeKeys: T[]) => {
    return Connect(function () {
        return storeKeys.map((key) => (this.props as { [Key in T]: Store<unknown> })[key]);
    }) as <U extends React.ComponentClass<InferredManualProps<T>>>(constructor: U) => void;
};
