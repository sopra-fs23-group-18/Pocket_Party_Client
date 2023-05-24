import React from "react";
import ErrorScreen from "components/views/ErrorScreen";

export default class StandardErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: undefined
        };
    }

    static getDerivedStateFromError(error) {
        return {
            hasError: true,
            error: error
        };
    }

    componentDidCatch(error, errorInfo) {
        console.error(error);
        console.error(errorInfo);

        // record the error in an APM tool...
    }

    render() {
        if (this.state.hasError) {
            return <ErrorScreen msg={this.state.error && this.state.error.toString()} />;
        } else {
            return this.props.children;
        }
    }
}
