import { Grid } from '@material-ui/core';
import { LineChart, XAxis, Tooltip, Line, CartesianGrid, Legend, YAxis } from 'recharts'; // recharts still using legacy react lifecycle hooks
import React from 'react';
import { Metric } from '../Features/Metrics/reducer';
import ErrorBoundary from './ErrorBoundary';

// While this is a 'dumb' component, it has significant enough children to have an ErrorBoundary
const ChartingContainer = (props: any) => {
  const timestampFormatter = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Bug in here somewhere, maybe when we've marked it active but no value is in the array?
  // Put into a grid for more situational awareness. We could merge plots, but with different scaling could be a ux issue
  return (
    <ErrorBoundary name="charting">
      <Grid container direction="row" justify="flex-start" alignItems="center" spacing={3}>
        {props.actives.map((activeMetric: Metric) => (
          <Grid item key={props.metrics.indexOf(activeMetric) || -1}>
            {activeMetric.name.toLocaleUpperCase()} :{' '}
            {activeMetric.historicalValues[activeMetric.historicalValues.length - 1].value || -1} {activeMetric.unit}
            <LineChart
              width={400}
              height={400}
              data={activeMetric.historicalValues.map((entry) => {
                return { time: entry.at, value: entry.value };
              })}
              margin={{ bottom: 5 }}
            >
              <CartesianGrid />
              <XAxis dataKey="time" interval="preserveStartEnd" scale="time" tickFormatter={timestampFormatter} />
              <YAxis dataKey="value" unit={activeMetric.unit} scale="linear" />
              <Tooltip />
              <Legend />
              <Line
                name={activeMetric.name.toLocaleUpperCase() + ' ' + activeMetric.unit}
                type="monotone"
                dataKey="value"
                stroke="#0000ff"
                yAxisId={0}
              />
            </LineChart>
          </Grid>
        ))}
      </Grid>
    </ErrorBoundary>
  );
};

export default ChartingContainer;
