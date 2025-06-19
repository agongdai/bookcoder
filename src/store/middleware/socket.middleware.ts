import _isArray from 'lodash/isArray';

import { setLive, setNTryTimes } from '@/store/wss/actions';
import { selectWssNTryTimes } from '@/store/wss/selectors';

import { Socket } from '../Socket';
import { BookTimeSlotPayload, BookState } from '@/types/book';
import {
  refreshTimeSlots,
  timeSlotBooked,
  timeSlotNotBooked,
} from '@/store/book/actions';

export const socketMiddleware =
  (socket: Socket) => (params: any) => (next: any) => (action: any) => {
    const { dispatch, getState } = params;
    const { type } = action;
    const state = getState();

    switch (type) {
      case 'socket/connect':
        console.log('connecting to socket');
        socket.connect(process.env.NEXT_PUBLIC_API_WSS || '');

        socket.on('open', () => {
          console.log('socket opened');
          dispatch(setNTryTimes(0));
          dispatch(setLive(true));
        });

        socket.on('message', message => {
          const data = JSON.parse(message?.data || '{}');

          if (data?.event === 'booked') {
            dispatch(timeSlotBooked(data as BookTimeSlotPayload));
          }

          if (data?.event === 'not-booked') {
            dispatch(timeSlotNotBooked(data as number));
          }

          if (data?.event === 'update') {
            dispatch(refreshTimeSlots(data as BookState));
          }
        });

        socket.on('close', () => {
          console.log('socket closed');
          socket.disconnect();
          dispatch(setNTryTimes(selectWssNTryTimes(state) + 1));
          dispatch(setLive(false));
        });
        break;

      case 'socket/disconnect':
        if (socket.disconnect()) {
          dispatch(setLive(false));
        }
        break;

      default:
        break;
    }

    return next(action);
  };
