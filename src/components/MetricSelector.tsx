import { ListItem, List, Switch } from "@material-ui/core"
import React from "react"
import { CSSProperties } from "@material-ui/core/styles/withStyles";

interface MetricSelectorProps {
    metrics: string[]
    onClick: any
}

const styleHorizontalContainer: CSSProperties = {
    'display': 'flex',
    'flexDirection': 'row',
    'padding': 0,
};


// Given a list of metrics (props), provide ability to select none/one/many and emit selected value
class MetricSelector extends React.Component <MetricSelectorProps> {

    render() {
        return (
            <List style={styleHorizontalContainer}>
                {this.props.metrics.map((metric) => (
                    <ListItem key={this.props.metrics.indexOf(metric)} onClick={e => this.props.onClick(metric)}>
                         <Switch checked={false} name={metric} />
                         {metric}
                    </ListItem>
                ))}
            </List>
        )
    }
}

export default MetricSelector
