import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, Metric } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import { Card, CardContent } from '@material-ui/core';
import MetricSelector from '../../components/MetricSelector';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
  getMetrics
  heartBeat
}
`;

const subscription = `
subscription onDataUpdate {
  newMeasurement {
    metric
    unit
    at
    value
  }
}
`

const getAvailableMetrics = (state: IState) => {
  const { availableMetrics } = state.metric;
  return {
    ...state,
    availableMetrics
  };
};

const getSelectedMetrics = (state: IState) => {
  const actives = state.metric.availableMetrics.filter((x: Metric) => x.liveSelected);
  return {
    ...state,
    actives
  }
}

export default () => {
  return (
    <Provider value={client}>
      <MetricsContainer />
    </Provider>
  );
};

// This is our smart component
const MetricsContainer = () => {
  const dispatch = useDispatch();
  const { weather, availableMetrics } = useSelector(getAvailableMetrics);
  const { actives } = useSelector(getSelectedMetrics);

  const [result] = useQuery({
    query
  });
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data) return;
    const { getMetrics, heartBeat } = data;
    dispatch(actions.allMetricsReceived(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  const handleChildClick = (childData: any) => {
    // We're going to toggle the selected state for the one clicked
    let updated = {...childData}; // Copy from memory
    updated.liveSelected = !updated.liveSelected;
    dispatch(actions.updateSelectedMetrics(updated));
  }

  return (
    <Card>
      <CardContent>
        <MetricSelector metrics={availableMetrics} onClick={(e: any) => handleChildClick(e)}/>
      </CardContent>
    </Card>
  )
};
