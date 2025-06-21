import { RootState } from '@/store';

export const selectSlots = (state: RootState) => state.book.slots;
export const selectBookingSlot = (state: RootState) => state.book.bookingSlot;
