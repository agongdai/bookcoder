const now = new Date('2025-06-20T16:00:00.000Z').getTime();
const nextSlotHour = hour => {
  const nextHour = new Date(now + hour * 60 * 60 * 1000);
  return nextHour.getTime();
};

const mockData = {
  slots: [
    {
      id: '8am-slot',
      time: nextSlotHour(8),
      status: 'available',
      userEmail: '',
      bookedAt: 0,
    },
    {
      id: '9am-slot',
      time: nextSlotHour(9),
      status: 'available',
      userEmail: '',
      bookedAt: 0,
    },
    {
      id: '10am-slot',
      time: nextSlotHour(10),
      status: 'available',
      userEmail: '',
      bookedAt: 0,
    },
    {
      id: '1pm-slot',
      time: nextSlotHour(13),
      status: 'available',
      userEmail: '',
      bookedAt: 0,
    },
    {
      id: '2pm-slot',
      time: nextSlotHour(14),
      status: 'available',
      userEmail: '',
      bookedAt: 0,
    },
    {
      id: '3pm-slot',
      time: nextSlotHour(15),
      status: 'booked',
      userEmail: 'test@test.com',
      bookedAt: new Date().getTime(),
    },
    {
      id: '4pm-slot',
      time: nextSlotHour(16),
      status: 'available',
      userEmail: '',
      bookedAt: 0,
    },
    {
      id: '5pm-slot',
      time: nextSlotHour(17),
      status: 'booked',
      userEmail: 'test@test.com',
      bookedAt: new Date().getTime(),
    },
  ],
};

// Simple mutex implementation for slot booking
const slotLocks = new Map(); // slotId -> Promise
const lockTimeout = 5000; // 5 seconds timeout

// Helper function to create a mutex lock for a specific slot
const acquireSlotLock = async slotId => {
  // If there's already a lock for this slot, wait for it
  if (slotLocks.has(slotId)) {
    try {
      // wait for the lock to be released
      await slotLocks.get(slotId);
    } catch (e) {
      // Previous operation failed, continue
    }
  }

  // Create a new lock
  let resolveLock;
  const lockPromise = new Promise(resolve => {
    resolveLock = resolve;
  });

  slotLocks.set(slotId, lockPromise);

  // Auto-release lock after timeout
  setTimeout(() => {
    resolveLock();
    slotLocks.delete(slotId);
  }, lockTimeout);

  return () => {
    resolveLock();
    slotLocks.delete(slotId);
  };
};

export const getAllSlots = () => {
  return mockData.slots;
};

export const setSlot = slot => {
  mockData.slots = mockData.slots.map(s => (s.id === slot.id ? slot : s));
};

export const isSlotAvailable = slotId => {
  return mockData.slots.find(s => s.id === slotId).status === 'available';
};

// Atomic booking function that prevents race conditions
export const atomicBookSlot = async (slotId, userEmail) => {
  // Acquire lock for this specific slot
  const releaseLock = await acquireSlotLock(slotId);

  try {
    const slot = mockData.slots.find(s => s.id === slotId);

    if (!slot) {
      return { success: false, slot };
    }

    if (slot.status !== 'available') {
      return { success: false, slot };
    }

    // Atomic operation: check and set in one step
    slot.status = 'booked';
    slot.userEmail = userEmail;
    slot.bookedAt = new Date().getTime();

    return { success: true, slot };
  } finally {
    // Always release the lock
    releaseLock();
  }
};
