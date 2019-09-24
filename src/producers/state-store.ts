import * as Stuffit from 'stuffit';

export class StateStore<T> extends Stuffit.PushStore<T> {
    public constructor(element: React.Component<unknown, T>) {
        super(element.state);
        const original = element.componentDidUpdate;
        element.componentDidUpdate = (...args) => {
            if (this.state !== element.state) {
                this.setState(element.state);
            }
            if (original) {
                original.apply(element, args);
            }
        };
    }
}
