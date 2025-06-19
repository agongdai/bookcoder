export type BookState = {
  availableTimeSlots: number[];
  bookedTimeSlots: BookTimeSlotPayload[];
  bookingTimeSlot: number | null;
};

export type BookTimeSlotPayload = {
  timeSlot: number;
  userEmail: string;
  bookedAt: number;
};
