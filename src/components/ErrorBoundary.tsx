import React from 'react'

export default class ErrorBoundary extends React.Component<{name:string}, {hasError: boolean}> {
    // Don't brick the app! Use as simple wrapper
    constructor(props: any) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: any) {
        return { hasError: true }
    }

    componentDidCatch(error: Error, errorInfo: any) {
        console.error(this.props.name, error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Here we put a trace back to our logging/feedback mechanism (i.e. Sentry)
            return (
                <h2>A critical error occurred</h2>
            )
        }
        return this.props.children;
    }
}