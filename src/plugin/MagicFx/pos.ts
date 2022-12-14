import * as React from 'react';

export const getMonsterPos = (w: number, h: number): React.CSSProperties => {
    return {
        position: 'absolute',
        width: w,
        height: h,
        left: '50%',
        top: '50%',
        marginLeft: (w / 2) * -1,
        marginTop: (h / 2) * -1,
        overflow: 'hidden',
    };
};

export const gerFullScreenPos = (): React.CSSProperties => {
    return {
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
    };
};
