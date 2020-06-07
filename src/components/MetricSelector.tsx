import { ListItem, List, Switch } from "@material-ui/core"
import React from "react"
import { CSSProperties } from "@material-ui/core/styles/withStyles";

interface MetricSelectorProps {
    metrics: [] | any
    onClick: any
}

const styleHorizontalContainer: CSSProperties = {
    'display': 'flex',
    'flexDirection': 'row',
    'padding': 0,
};


// Given a list of metrics (props), provide ability to select none/one/many and emit selected value
const MetricSelector = (props: any) => {
    console.log('props', props);
    return (
        <List style={styleHorizontalContainer}>
            {props.metrics.map((metric: string) => (
                <ListItem key={props.metrics.indexOf(metric)} onClick={e => props.onClick(metric)}>
                        <Switch checked={false} name={metric} />
                        {metric}
                </ListItem>
            ))}
        </List>
    )
}

export default MetricSelector
