import { Store } from 'stuffit';

/**
 * Subscribes to the given store.
 * State changes will be dispatched to the given callback.
 * The subscription is unsubscribed from when the given component will unmount.
 * 
 * If callback is undefined, it will simply trigger a `forceUpdate` call on the given component.
 * 
 * @param options.component Component which will be checked for unmounting to cancel the subscription.
 * @param options.store Store to listen for state changes on.
 * @param options.callback Callback which receives state changes. If undefined, the state changes will trigger `forceUpdate` on the component.
 * @param options.immediate Whether or not to trigger the callback immediately after subscribing.
 */
export const subscribeUntilUnmount = <T>(options: { component: React.Component, store: Store<T>, callback?: (value: T) => void, immediate?: boolean }) => {
    const callback = options.callback || (() => options.component.forceUpdate());
    const subscription = options.store.subscribe(callback, options.immediate);
    const originalComponentWillUnmount = options.component.componentWillUnmount;
    options.component.componentWillUnmount = function () {
        subscription.unsubscribe();
        if (originalComponentWillUnmount) {
            originalComponentWillUnmount.apply(this);
        }
    };
};
