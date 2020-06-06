import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Metric from '../Features/Metrics/Metric';
import { Container } from '@material-ui/core';

const useStyles = makeStyles({
  card: {
    margin: '5% 25%',
  },
});

export default () => {
  const classes = useStyles();
  return (
    <Container>
      <Metric />
    </Container>
  );
};
