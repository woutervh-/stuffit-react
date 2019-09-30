import * as React from 'react';
import { Store, Subscription } from 'stuffit';

export const connectStore = <T extends {}>(store: Store<T>) => <P extends T>(Component: React.ComponentType<P>) =>
    class extends React.PureComponent<Omit<P, keyof T>, T> {
        public state = store.state;

        private subscription: Subscription | undefined = undefined;

        public componentDidMount() {
            if (!this.subscription) {
                this.subscription = store.subscribe(this.handleChange);
            }
        }

        public componentWillUnmount() {
            if (this.subscription) {
                this.subscription.unsubscribe();
                this.subscription = undefined;
            }
        }

        public render() {
            return <Component {...this.props as P} {...this.state} />;
        }

        private handleChange = (value: T) => {
            this.setState(value);
        }
    } as React.ComponentClass<Omit<P, keyof T>, T>;
