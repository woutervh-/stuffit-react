import { Sinks, Store } from 'stuffit';

export const sinkUntilUnmount = <T>(component: React.Component, store: Store<T>, callback: (value: T) => void) => {
    const sink = store.compose(Sinks.simple(callback)).start();
    const originalComponentWillUnmount = component.componentWillUnmount;
    component.componentWillUnmount = function () {
        sink.stop();
        if (originalComponentWillUnmount) {
            originalComponentWillUnmount.apply(this);
        }
    };
};
