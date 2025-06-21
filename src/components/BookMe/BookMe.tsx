'use client';

import React, { useEffect } from 'react';
import { useMyDispatch, useMySelector } from '@/store';
import { WSS_CONNECTION_TRY_TIMES } from '@/config';
import { selectWssNTryTimes, selectWssLive } from '@/store/wss/selectors';
import { selectBookingSlot, selectSlots } from '@/store/selectors';
import dayjs from 'dayjs';
import { syncBookingSlot } from '@/store/book/actions';
import clsx from 'clsx';

const userEmail = Math.random().toString(36).substring(2, 15) + '@test.com';

export const BookMe = () => {
  const dispatch = useMyDispatch();
  const wssNTryTimes = useMySelector(selectWssNTryTimes);
  const isLive = useMySelector(selectWssLive);
  const slots = useMySelector(selectSlots);
  const bookingSlot = useMySelector(selectBookingSlot);

  // When page loads, connect to the websocket, and keep it connected
  useEffect(() => {
    if (wssNTryTimes < WSS_CONNECTION_TRY_TIMES && !isLive) {
      setTimeout(
        () =>
          dispatch({
            type: 'socket/connect',
          }),
        wssNTryTimes === 0 ? 0 : 3000
      );
    }
  }, [dispatch, wssNTryTimes, isLive]);

  if (!isLive) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <div>
        <h1 className='text-2xl font-bold my-8'>
          Book a slot (user: {userEmail})
        </h1>
      </div>
      <div>
        <ul>
          {slots.map(slot => {
            const isBooking =
              slot.id === bookingSlot?.id && bookingSlot.status === 'available';
            return (
              <li
                key={slot.id}
                className={clsx('text-lg my-2', {
                  'text-green-500 cursor-pointer':
                    slot.status === 'available' && !isBooking,
                  'text-gray-500': slot.status !== 'available' || isBooking,
                })}
                onClick={() => {
                  if (isBooking || slot.status !== 'available') {
                    return;
                  }

                  dispatch(syncBookingSlot(slot));
                  dispatch({
                    type: 'socket/bookSlot',
                    payload: {
                      slotId: slot.id,
                      userEmail: userEmail,
                    },
                  });
                }}
              >
                {dayjs(slot.time).format('HH:mm')} - {slot.id} - {slot.status}{' '}
                {slot.userEmail ? `by ${slot.userEmail}` : ''}
                {isBooking && ' (booking ...)'}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
