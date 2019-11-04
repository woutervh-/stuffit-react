import { Store } from 'stuffit';

export const subscribeUntilUnmount = <T>(component: React.Component, store: Store<T>, callback: (value: T) => void, immediate?: boolean) => {
    const subscription = store.subscribe(callback, immediate);
    const originalComponentWillUnmount = component.componentWillUnmount;
    component.componentWillUnmount = function () {
        subscription.unsubscribe();
        if (originalComponentWillUnmount) {
            originalComponentWillUnmount.apply(this);
        }
    };
};
