import * as Stuffit from 'stuffit';

export class PropsStore<T> extends Stuffit.PushStore<T> {
    public constructor(element: React.Component<T>) {
        super(element.props);
        const original = element.componentDidUpdate;
        element.componentDidUpdate = (...args) => {
            if (this.state !== element.props) {
                this.setState(element.props);
            }
            if (original) {
                original.apply(element, args);
            }
        };
    }
}
