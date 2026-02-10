import { io } from "socket.io-client";

export function connectSocket() {
  return io(`http://${window.location.hostname}:5000`);
}
