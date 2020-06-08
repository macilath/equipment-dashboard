import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, Metric } from './reducer';
import {
  Provider,
  createClient,
  useQuery,
  useSubscription,
  dedupExchange,
  fetchExchange,
  subscriptionExchange,
} from 'urql';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import LinearProgress from '@material-ui/core/LinearProgress';
import { IState } from '../../store';
import { Card, CardContent } from '@material-ui/core';
import MetricSelector from '../../components/MetricSelector';
import ChartingContainer from '../../components/ChartingContainer';
import ErrorBoundary from '../../components/ErrorBoundary';

// Would be nice to configure backoff, too
const websocketClient = new SubscriptionClient('wss://react.eogresources.com/graphql', {
  reconnect: true,
  reconnectionAttempts: 10,
});

// Wired up it works, but need to fix useeffect because we keep mutating getMetrics state too.
const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    dedupExchange,
    fetchExchange,
    subscriptionExchange({
      forwardSubscription: (operation) => websocketClient.request(operation),
    }),
  ],
});

const query = `
query {
  getMetrics
}
`;

// Risk of being a bit heavy, we should try to filter subscription contents
const subscription = `
subscription onDataUpdate {
  newMeasurement {
    metric
    unit
    at
    value
  }
}
`;

const getAvailableMetrics = (state: IState) => {
  const { availableMetrics } = state.metric;
  return {
    ...state,
    availableMetrics,
  };
};

const getSelectedMetrics = (state: IState) => {
  const actives = state.metric.availableMetrics.filter((x: Metric) => x.liveSelected);
  return {
    ...state,
    actives,
  };
};

export default () => {
  return (
    <Provider value={client}>
      <MetricsContainer />
    </Provider>
  );
};

const MetricsContainer = () => {
  const dispatch = useDispatch();
  const { availableMetrics } = useSelector(getAvailableMetrics);
  const { actives } = useSelector(getSelectedMetrics);

  const [result] = useQuery({
    query,
  });
  const { fetching, data, error } = result;
  const [sub] = useSubscription({ query: subscription });
  const { fetching: subFetch, data: subData, error: subErr } = sub;
  useEffect(() => {
    // hit each render. Heavy, should try and split the resource consumption
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      return;
    }
    if (!data && !subData) return;
    if (data && availableMetrics.length === 0) {
      //only update state if we don't have metrics
      const { getMetrics } = data;
      dispatch(actions.allMetricsReceived(getMetrics));
    }
    if (subErr) {
      dispatch(actions.streamApiErrorReceived({ error: subErr.message }));
      return;
    }
    if (subData) {
      const measurement = subData.newMeasurement;
      dispatch(actions.newMeasurementReceived(measurement));
    }
  }, [dispatch, data, subData, error, subErr, availableMetrics.length]);

  if (fetching && subFetch) return <LinearProgress />;

  const handleChildClick = (childData: any) => {
    // We're going to toggle the selected state for the one clicked
    let updated = { ...childData }; // Copy from memory
    updated.liveSelected = !updated.liveSelected;
    dispatch(actions.updateSelectedMetric(updated));
  };

  return (
    <Card style={{ width: '100vw' }}>
      <CardContent>
        <ErrorBoundary name="parentcomponent">
          <MetricSelector metrics={availableMetrics} onClick={(e: any) => handleChildClick(e)} />
          <ChartingContainer actives={actives} metrics={availableMetrics} />
        </ErrorBoundary>
      </CardContent>
    </Card>
  );
};
