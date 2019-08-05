import { Store, Subscription } from 'stuffit';

/**
 * Modifies the given component such that when it did mount (componentDidMount), it will start to listen to the given stores.
 * When one of the given stores updates, the component will be called to forceUpdate.
 * Subscriptions are cancelled when the component will unmount (componentWillUnmount).
 * This function must be called from the constructor of the component.
 */
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
