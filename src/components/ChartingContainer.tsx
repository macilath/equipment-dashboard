import { ListItem, List } from "@material-ui/core"
import React from "react"
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { Metric } from "../Features/Metrics/reducer";

const styleHorizontalContainer: CSSProperties = {
    'display': 'flex',
    'flexDirection': 'row',
    'padding': 0,
};

// Given a list of metrics (props), provide ability to select none/one/many and emit selected value
const ChartingContainer = (props: any) => {
    console.log('props', props);
    return (
        <List style={styleHorizontalContainer}>
            {props.actives.map((activeMetric: Metric) => (
                <ListItem key={props.metrics.indexOf(activeMetric)}>
                        {activeMetric.name} - {activeMetric.historicalValues[activeMetric.historicalValues.length - 1].value}
                </ListItem>
            ))}
        </List>
    )
}

export default ChartingContainer
