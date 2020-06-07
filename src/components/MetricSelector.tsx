import { ListItem, List, Switch } from "@material-ui/core"
import React from "react"
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { Metric } from "../Features/Metrics/reducer";

const styleHorizontalContainer: CSSProperties = {
    'display': 'flex',
    'flexDirection': 'row',
    'padding': 0,
};


// Given a list of metrics (props), provide ability to select none/one/many and emit selected value
const MetricSelector = (props: any) => {
    return (
        <List style={styleHorizontalContainer}>
            {props.metrics.map((metric: Metric) => (
                <ListItem key={props.metrics.indexOf(metric)} onClick={e => props.onClick(metric)}>
                        <Switch checked={metric.liveSelected} name={metric.name} />
                        {metric.name}
                </ListItem>
            ))}
        </List>
    )
}

export default MetricSelector
