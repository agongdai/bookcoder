export enum SlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  UNAVAILABLE = 'unavailable',
  PENDING = 'pending',
}

export type Slot = {
  id: string;
  time: number;
  status: SlotStatus;
  userEmail: string;
  bookedAt: number;
};

export type BookState = {
  slots: Slot[];
  bookingSlot: Slot | null;
};
