import { RootState } from '@/store';

export const selectAvailableTimeSlots = (state: RootState) =>
  state.book.availableTimeSlots;
export const selectBookedTimeSlots = (state: RootState) =>
  state.book.bookedTimeSlots;
export const selectBookingTimeSlot = (state: RootState) =>
  state.book.bookingTimeSlot;
