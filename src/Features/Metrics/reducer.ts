import { createSlice, PayloadAction } from 'redux-starter-kit';

export type AvailableMetrics = {
  metrics: string[]
};

export type ApiErrorAction = {
  error: string;
};

const initialState = {
  metrics: [] as any // workaround issue with empty array being declared never[] - come back
};

const slice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    metricDataReceived: (state, action: PayloadAction<AvailableMetrics>) => {
      const metrics = action.payload;
      state.metrics = metrics;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
