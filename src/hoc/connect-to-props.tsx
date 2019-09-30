import * as React from 'react';
import { Store, Subscription } from 'stuffit';

export const connectToProps = <T, U extends { [Key: string]: unknown }>(store: Store<T>, mapToProps: (state: T) => U) => <P extends U>(Component: React.ComponentType<P>) =>
    class extends React.PureComponent<Omit<P, keyof U>, U> {
        public state = mapToProps(store.state);

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
            this.setState(mapToProps(value));
        }
    } as React.ComponentClass<Omit<P, keyof U>, U>;
