import _pick from 'lodash/pick';
import _uniq from 'lodash/uniq';

import { BookTimeSlotPayload, BookState } from '@/types/book';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state using that type
const initialState: BookState = {
  availableTimeSlots: [],
  bookedTimeSlots: [],
  bookingTimeSlot: null,
};

export const bookSlice = createSlice({
  name: 'book',
  initialState,
  reducers: {
    refreshTimeSlots: (state, action: PayloadAction<BookState>) => {
      return {
        ...state,
        availableTimeSlots: action.payload.availableTimeSlots,
        bookedTimeSlots: action.payload.bookedTimeSlots,
      };
    },
    bookTimeSlot: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        bookingTimeSlot: action.payload,
      };
    },
    timeSlotBooked: (state, action: PayloadAction<BookTimeSlotPayload>) => {
      return {
        availableTimeSlots: state.availableTimeSlots.filter(
          timeSlot => timeSlot !== action.payload.timeSlot
        ),
        bookedTimeSlots: _uniq([...state.bookedTimeSlots, action.payload]),
        bookingTimeSlot: null,
      };
    },
    timeSlotNotBooked: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        bookingTimeSlot: null,
      };
    },
  },
});

export default bookSlice.reducer;
