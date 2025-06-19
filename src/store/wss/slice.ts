import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define a type for the slice state
export interface WssState {
  live: boolean;
  nTryTimes: number;
}

// Define the initial state using that type
const initialState: WssState = {
  live: false,
  nTryTimes: 0,
};

export const wssSlice = createSlice({
  name: 'wss',
  initialState,
  reducers: {
    setLive: (state, action: PayloadAction<boolean>) => {
      state.live = action.payload;
    },
    setNTryTimes: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        nTryTimes: action.payload,
      };
    },
  },
});

export default wssSlice.reducer;
