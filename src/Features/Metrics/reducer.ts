import { createSlice, PayloadAction } from 'redux-starter-kit';

export type Metric = {
  name: string
  historicalValues: number[]
  lastSeen: string // timestamp of last value
  liveSelected: boolean
}

export type Metrics = {
  availableMetrics: string[]
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
      state.availableMetrics = availableMetrics;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  }
});

export const reducer = slice.reducer;
export const actions = slice.actions;
