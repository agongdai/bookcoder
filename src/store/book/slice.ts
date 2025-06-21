import _pick from 'lodash/pick';
import _uniq from 'lodash/uniq';

import { BookState, Slot } from '@/types/book';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState: BookState = {
  slots: [],
  bookingSlot: null,
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    refreshSlots: (state, action: PayloadAction<Slot[]>) => {
      return {
        ...state,
        slots: action.payload,
      };
    },
    syncBookingSlot: (state, action: PayloadAction<Slot>) => {
      return {
        ...state,
        bookingSlot: action.payload,
      };
    },
  },
});

export default bookSlice.reducer;
