import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ValueTuple = {
  value: number;
  at: string;
};

export type Metric = {
  name: string;
  historicalValues: ValueTuple[];
  lastSeen: string; // timestamp of last value
  liveSelected: boolean;
  unit: string;
};

export type Metrics = {
  availableMetrics: Metric[];
};

export type Measurement = {
  metric: string;
  at: string;
  value: number;
  unit: string;
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  availableMetrics: [] as any, // workaround issue with empty array being declared never[] - come back
};

const _expireMeasurements = () => {
  // if this isn't fast we're gonna have a bad time
  // Since it's a state mutation we need to trigger with dispatch
  console.log('remove historical measurements...');
};

const slice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    allMetricsReceived: (state, action: PayloadAction<any>) => {
      const availableMetrics = action.payload;
      // "Pure" in that it always sets the state to blank?
      const metrics = availableMetrics.map((name: any) => {
        const metric: Metric = {
          name,
          liveSelected: false,
          historicalValues: [],
          lastSeen: '0',
          unit: '',
        };
        return metric;
      });
      state.availableMetrics = metrics;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    streamApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    updateSelectedMetric: (state, action: PayloadAction<Metric>) => {
      const metricToUpdate = action.payload;
      const allMetrics: Metric[] = state.availableMetrics;
      const idx = allMetrics.findIndex((metric: Metric) => metric.name === metricToUpdate.name);
      allMetrics[idx] = metricToUpdate;
      state.availableMetrics = allMetrics;
    },
    newMeasurementReceived: (state, action: PayloadAction<Measurement>) => {
      // We want to keep the data regardless of it being selected. Max ttl would be timestamp - 30m'
      const newMeasurement = action.payload;
      // Maybe we should refactor the state
      const allMetrics = state.availableMetrics;
      const idx = allMetrics.findIndex((metric: Metric) => metric.name === newMeasurement.metric);
      let metricToUpdate = allMetrics[idx];
      const val: ValueTuple = { value: newMeasurement.value, at: newMeasurement.at };
      metricToUpdate.historicalValues.push(val);
      metricToUpdate.lastSeen = newMeasurement.at;
      if (metricToUpdate.unit === '') {
        metricToUpdate.unit = newMeasurement.unit;
      } // changing units? bigger problems
      allMetrics[idx] = metricToUpdate;
      state.availableMetrics = allMetrics;
      // We update the state, and the child component will graph only those selected
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
