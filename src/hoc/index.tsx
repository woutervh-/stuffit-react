import * as React from 'react';
import { Store, Subscription } from 'stuffit';

type InferredState<T extends { [Key: string]: Store<unknown> }> = { [Key in keyof T]: T[Key] extends Store<infer U> ? U : never };

function initialState<T extends { [Key: string]: Store<unknown> }>(stores: T) {
    const initialState: { [Key: string]: unknown } = {};
    for (const key of Object.keys(stores)) {
        initialState[key as string] = stores[key].state;
    }
    return initialState as InferredState<T>;
}

export const connect = <T extends { [Key: string]: Store<unknown> }>(stores: T) => <P extends InferredState<T>>(Component: React.ComponentType<P>) =>
    class extends React.PureComponent<Omit<P, keyof T>, InferredState<T>> {
        public state = initialState(stores);

        private subscriptions: Subscription[] | undefined = undefined;

        public componentDidMount() {
            if (!this.subscriptions) {
                this.subscriptions = Object.keys(this.state).map(this.subscribeTo);
            }
        }

        public componentWillUnmount() {
            if (this.subscriptions) {
                for (const subscription of this.subscriptions) {
                    subscription.unsubscribe();
                }
                this.subscriptions = undefined;
            }
        }

        public render() {
            return <Component {...this.props as P} {...this.state} />;
        }

        private subscribeTo = (key: string) => {
            return stores[key].subscribe(this.handleChange(key));
        }

        private handleChange = (key: string) => (value: unknown) => {
            this.setState({ [key]: value } as InferredState<T>);
        }
    } as React.ComponentClass<Omit<P, keyof T>, InferredState<T>>;
