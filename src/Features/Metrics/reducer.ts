import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metric = {
  name: string
  historicalValues: number[]
  lastSeen: string // timestamp of last value
  liveSelected: boolean
}

export type Metrics = {
  availableMetrics: Metric[]
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  availableMetrics: [] as any // workaround issue with empty array being declared never[] - come back
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
          lastSeen: '0'
        }; return metric;
      });
      state.availableMetrics = metrics;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
    updateSelectedMetrics: (state, action: PayloadAction<Metric>) => {
      const metricToUpdate = action.payload;
      const allMetrics = state.availableMetrics;
      const idx = allMetrics.findIndex((metric: Metric) => metric.name === metricToUpdate.name);
      allMetrics[idx] = metricToUpdate;
      state.availableMetrics = allMetrics;
    },
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
