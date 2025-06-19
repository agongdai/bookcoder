import { bookSlice } from './slice';

export const {
  timeSlotBooked,
  timeSlotNotBooked,
  bookTimeSlot,
  refreshTimeSlots,
} = bookSlice.actions;
