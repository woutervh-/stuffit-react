import { Store } from 'stuffit';
import { Connect } from './connect';

/**
 * Will automatically detect stores given in props and trigger forceUpdate whenever a store updates.
 */
export const AutoConnect = Connect(function () {
    return Object.keys(this.props)
        .filter((key) => (this.props as { [Key: string]: unknown })[key] instanceof Store)
        .map((key) => (this.props as { [Key: string]: Store<unknown> })[key]);
});
