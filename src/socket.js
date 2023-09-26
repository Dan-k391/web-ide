// Connect to server
import { io } from 'socket.io-client';

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:7788';

export const socket = io(URL);
