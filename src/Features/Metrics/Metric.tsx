import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import { IState } from '../../store';
import { Card, CardContent } from '@material-ui/core';
import MetricSelector from '../../components/MetricSelector';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

const query = `
query {
  getMetrics
}
`;

const getMetrics = (state: IState) => {
  const { metrics } = state.metric;
  return {
    metrics
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Metric />
    </Provider>
  );
};

// This is our smart component
const Metric = () => {
  const dispatch = useDispatch();
  const { metrics } = useSelector(getMetrics);

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
    const { getMetrics } = data;
    dispatch(actions.metricDataReceived(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return (
    <Card>
      <CardContent>
        <Chip label={`Metrics ${metrics}`} />
        <MetricSelector metrics={metrics}/>
      </CardContent>
    </Card>
  )
};
