import { NextApiRequest, NextApiResponse } from 'next';

export function setSSEHeaders(res: NextApiResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('X-Accel-Buffering', 'no');
}

export function initInterval(res: NextApiResponse, callback: () => void, interval: number = 5000) {
    return setInterval(() => {
        callback();
    }, interval);
}

function sendSSEEvent(res: NextApiResponse, event: string, data: string) {
    res.write(`event: ${event}\ndata: ${data}\n\n`);
}

export function sendSSEEnd(res: NextApiResponse, data: string = 'end', intervalID?: NodeJS.Timer) {
    sendSSEEvent(res, 'end', data);
    if (intervalID) {
        clearInterval(intervalID);
    }
    res.end();
}

export function sendSSEError(res: NextApiResponse, error: string) {
    sendSSEEvent(res, 'error', error);
    res.end();
}

export function sendSSEPercentage(res: NextApiResponse, count: number, total: number) {
    sendSSEEvent(res, 'percentage', `${count / total}`);
}
