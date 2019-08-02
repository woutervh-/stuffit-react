import { Store } from 'stuffit';
import { Connect } from './connect';

/**
 * Will trigger forceUpdate whenever any of the given stores update.
 */
export const ExplicitConnect = <T extends Store<unknown>>(...stores: T[]) => {
    return Connect(() => stores);
};
