'use client';

import React, { useEffect } from 'react';
import { useMyDispatch, useMySelector } from '@/store';
import { WSS_CONNECTION_TRY_TIMES } from '@/config';
import { selectWssNTryTimes, selectWssLive } from '@/store/wss/selectors';

export const Calendar = () => {
  const dispatch = useMyDispatch();
  const wssNTryTimes = useMySelector(selectWssNTryTimes);
  const isLive = useMySelector(selectWssLive);

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

  return <div>Calendar isLive: {isLive.toString()}</div>;
};
