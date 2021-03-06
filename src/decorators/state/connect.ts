import { Store, Subscription } from 'stuffit';

type InferredConnectedState<T extends { [Key: string]: Store<unknown> }> = { [Key in keyof T]: T[Key] extends Store<infer V> ? V : never };

/**
 * Injects state into the component from the stores obtained from the given function.
 * The stores are obtained when the component constructor is called.
 * Subscriptions last for the life time of the component, i.e. between componentDidMount and componentWillUnmount.
 */
export const Connect = <T extends { [Key: string]: Store<unknown> }>(getStores: (this: React.Component) => T) => <U extends React.ComponentClass<{}, InferredConnectedState<T>>>(constructor: U): U => {
    const subscriptionMap: Map<unknown, Subscription[]> = new Map();
    const storesMap: Map<unknown, T> = new Map();

    return class extends (constructor as React.ComponentClass<{}, InferredConnectedState<T>>) {
        public constructor(...args: unknown[]) {
            // Bypass the argument count check.
            super(...(args as [{}, unknown]));
            if (!this.state) {
                // Ignore non-existing state because we will inject values in there.
                this.state = {} as InferredConnectedState<T>;
            }
            const stores = getStores.apply(this);
            storesMap.set(this, stores);
            for (const key of Object.keys(stores)) {
                // Ignore read-only wrapper in Component.state because it is allowed by React.
                (this.state as { [Key: string]: unknown })[key] = stores[key].state;
            }
        }

        public componentDidMount() {
            if (subscriptionMap.has(this)) {
                throw new Error('Element already in subscription map; componentDidMount was called twice?');
            }
            if (!storesMap.has(this)) {
                throw new Error('Element not in stores map; componentDidMount was called twice?');
            }
            const stores = storesMap.get(this)!;
            storesMap.delete(this);
            const handleUpdate = (key: string) => (value: unknown) => this.setState({ [key]: value } as InferredConnectedState<T>);
            const subscriptions = Object.keys(stores).map((key) => stores[key].subscribe(handleUpdate(key)));
            subscriptionMap.set(this, subscriptions);
            if (super.componentDidMount) {
                super.componentDidMount();
            }
        }

        public componentWillUnmount() {
            if (super.componentWillUnmount) {
                super.componentWillUnmount();
            }
            if (!subscriptionMap.has(this)) {
                throw new Error('Element not in subscription map; componentWillUnmount was called before componentDidMount?');
            }
            const subscriptions = subscriptionMap.get(this)!;
            for (const subscription of subscriptions) {
                subscription.unsubscribe();
            }
            subscriptionMap.delete(this);
        }
    } as unknown as U;
};
