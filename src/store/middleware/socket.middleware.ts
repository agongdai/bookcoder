import _isArray from 'lodash/isArray';

import { setLive, setNTryTimes } from '@/store/wss/actions';
import { selectWssNTryTimes } from '@/store/wss/selectors';

import { Socket } from '../Socket';
import { Slot } from '@/types/book';
import { refreshSlots, syncBookingSlot } from '@/store/book/actions';

export const socketMiddleware =
  (socket: Socket) => (params: any) => (next: any) => (action: any) => {
    const { dispatch, getState } = params;
    const { type } = action;
    const state = getState();

    switch (type) {
      case 'socket/connect':
        console.log('connecting to socket');
        socket.connect(
          process.env.NEXT_PUBLIC_API_WSS || 'ws://localhost:8080'
        );

        socket.on('open', () => {
          console.log('socket opened');
          dispatch(setNTryTimes(0));
          dispatch(setLive(true));
        });

        socket.on('message', message => {
          const data = JSON.parse(message?.data || '{}');

          if (data?.event === 'booked') {
            dispatch(syncBookingSlot(data.payload as Slot));
          }

          if (data?.event === 'error') {
            dispatch(syncBookingSlot(data.payload as Slot));
          }

          if (data?.event === 'sync') {
            dispatch(refreshSlots(data.payload as Slot[]));
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

      case 'socket/bookSlot':
        console.log('bookSlot', action.payload);
        if (socket.isConnected) {
          socket.send({
            event: 'bookSlot',
            payload: {
              slotId: action.payload.slotId,
              userEmail: action.payload.userEmail,
            },
          });
        }
        break;

      default:
        break;
    }

    return next(action);
  };
