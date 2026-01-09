import { io, Socket } from 'socket.io-client'

class SocketClient {
  private socket: Socket | null = null
  private token: string | null = null

  connect(token: string) {
    if (this.socket?.connected) {
      this.disconnect()
    }

    this.token = token
    this.socket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id)
    })

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }

  isConnected() {
    return this.socket?.connected || false
  }
}

export const socketClient = new SocketClient()