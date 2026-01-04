import {io} from 'socket.io-client'

export function connectSocket()
{
    return io('http://localhost:5000')
}