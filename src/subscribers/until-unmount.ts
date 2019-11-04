import { Store } from 'stuffit';

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
