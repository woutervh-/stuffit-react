import * as React from 'react';
import { Store, Subscription } from 'stuffit';

// TODO: better folder name/filename/function name.

export const connect = <T extends Store<unknown>>(...stores: T[]) => <U extends React.Component>(component: U) => {
    let subscriptions: Subscription[] | undefined = undefined;
    const handleUpdate = () => component.forceUpdate();
    const originalComponentDidMount = component.componentDidMount;
    const originalComponentWillUnmount = component.componentWillUnmount;
    component.componentDidMount = function () {
        if (originalComponentDidMount) {
            originalComponentDidMount.apply(this);
        }
        if (subscriptions) {
            throw new Error('Subscriptions already exist; componentDidMount was called twice?');
        }
        subscriptions = stores.map((store) => store.subscribe(handleUpdate));
    };
    component.componentWillUnmount = function () {
        if (!subscriptions) {
            throw new Error('Subscriptions do not exist; either "connect" was called after mounting or componentWillUnmount was called twice.');
        }
        for (const subscription of subscriptions) {
            subscription.unsubscribe();
        }
        subscriptions = undefined;
        if (originalComponentWillUnmount) {
            originalComponentWillUnmount.apply(this);
        }
    };
};
