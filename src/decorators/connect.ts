import { Store, Subscription } from 'stuffit';

/**
 * Will forceUpdate whenever one of the stores obtained from the given function updates.
 * The stores are obtained when the component did mount (componentDidMount in React).
 * Subscriptions last for the life time of the component, i.e. between componentDidMount and componentWillUnmount.
 */
export const Connect = <T extends Store<unknown>>(getStores: (this: React.Component) => T[]) => <U extends React.ComponentClass>(constructor: U) => {
    const originalComponentDidMount = constructor.prototype.componentDidMount;
    const originalComponentWillUnmount = constructor.prototype.componentWillUnmount;
    const subscriptionMap: Map<unknown, Subscription[]> = new Map();
    constructor.prototype.componentDidMount = function (...args: unknown[]) {
        if (subscriptionMap.has(this)) {
            throw new Error('Element already in subscription map; componentDidMount was called twice?');
        }
        const handleUpdate = () => this.forceUpdate();
        const subscriptions = getStores.apply(this).map((store) => store.subscribe(handleUpdate));
        subscriptionMap.set(this, subscriptions);
        if (originalComponentDidMount) {
            originalComponentDidMount.apply(this, args);
        }
    };
    constructor.prototype.componentWillUnmount = function (...args: unknown[]) {
        if (originalComponentWillUnmount) {
            originalComponentWillUnmount.apply(this, args);
        }
        if (!subscriptionMap.has(this)) {
            throw new Error('Element not in subscription map; componentWillUnmount was called before componentDidMount?');
        }
        const subscriptions = subscriptionMap.get(this)!;
        for (const subscription of subscriptions) {
            subscription.unsubscribe();
        }
        subscriptionMap.delete(this);
    };
};
