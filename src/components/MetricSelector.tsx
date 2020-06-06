import { ListItem, List } from "@material-ui/core"
import React from "react"

interface MetricSelectorProps {
    metrics: string[]
}

// Given a list of metrics (props), provide ability to select none/one/many and emit selected value
class MetricSelector extends React.Component <MetricSelectorProps> {
    constructor(props: any) {
        super(props);
        console.log(props);
    }

    componentDidUpdate(prevProps: any) {
        console.log(prevProps, this.props);
    }

    render() {
        return (
            <List>
                {this.props.metrics.map((metric) => (
                    <ListItem>{metric}</ListItem>
                ))}
            </List>
        )
    }
}

export default MetricSelector
