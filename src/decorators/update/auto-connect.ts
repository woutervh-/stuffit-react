import { Store } from 'stuffit';
import { Connect } from './connect';

/**
 * Will automatically detect stores given in props and trigger forceUpdate whenever a store updates.
 *
 * ```typescript
 * interface Props {
 *   store: Store<number>;
 * }
 *
 * @AutoConnect
 * class MyComponent extends React.PureComponent<Props> {
 *   render() {
 *     return <span>Number: {this.props.store.state}</span>;
 *   }
 * }
 * ```
 */
export const AutoConnect = Connect(function () {
    return Object.keys(this.props)
        .filter((key) => (this.props as { [Key: string]: unknown })[key] instanceof Store)
        .map((key) => (this.props as { [Key: string]: Store<unknown> })[key]);
});
