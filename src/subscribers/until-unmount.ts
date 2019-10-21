import { Store } from 'stuffit';

export const subscribeUntilUnmount = <T>(component: React.Component, store: Store<T>, callback: (value: T) => void) => {
    const subscription = store.subscribe(callback);
    const originalComponentWillUnmount = component.componentWillUnmount;
    component.componentWillUnmount = function () {
        subscription.unsubscribe();
        if (originalComponentWillUnmount) {
            originalComponentWillUnmount.apply(this);
        }
    };
};
