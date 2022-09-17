export function fetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: typeof input === 'string' ? input : input.url,
      method: init?.method?.toUpperCase() as UniApp.RequestOptions['method'],
      data: init?.body ?? undefined,
      header: init?.headers,
      success: ({ data, statusCode }) => {
        resolve({
          ok: statusCode >= 200 && statusCode < 300,
          status: statusCode,
          statusText: '',
          text: () => Promise.resolve(JSON.stringify(data)),
          json: () => Promise.resolve(data),
        } as any)
      },
      fail: reject,
    })
  })
}

export class WebSocketImpl implements WebSocket {
  static CONNECTING = 0
  static OPEN = 1
  static CLOSING = 2
  static CLOSED = 3
  readonly CONNECTING = 0
  readonly OPEN = 1
  readonly CLOSING = 2
  readonly CLOSED = 3

  private readonly socketTask: UniApp.SocketTask | undefined

  protocol!: string
  binaryType: BinaryType
  bufferedAmount!: 0
  extensions: string

  onopen!: (this: WebSocket, ev: Event) => any
  onmessage!: (this: WebSocket, ev: MessageEvent<any>) => any
  onerror!: (this: WebSocket, ev: Event) => any
  onclose!: (this: WebSocket, ev: CloseEvent) => any

  constructor(
    readonly url: string,
    readonly protocols: string | string[] = ['graphql-transport-ws'],
  ) {
    this.extensions = ''
    this.binaryType = 'blob'

    /*
      为了模拟 W3C WebSocket 的行为，protocols 的类型必须是 string | string[] | undefined。
      模拟器的 connectSocket 背后是直接就是浏览器的 WebSocket 实现，因此不会出问题。
      然而真机的 connectSocket 的 protocols 类型只能是 string[] | undefined。
      如果传入 string 类型， SocketTask 会瞬间变成 CLOSED 状态。
      所以要兼容真机，这里必须把 string 转换为 string[]。
    */
    if (!Array.isArray(protocols)) protocols = [protocols]

    this.socketTask = uni.connectSocket({ url, protocols })

    this.socketTask.onOpen(e => {
      console.groupCollapsed(
        '%csocket %copen',
        'color: gray; font-weight: lighter;',
        'color: inherit;',
      )
      console.log(e)
      console.groupEnd()

      this.onopen(e as unknown as Event)
    })

    this.socketTask.onError(e => {
      console.groupCollapsed(
        '%csocket %cerror',
        'color: gray; font-weight: lighter;',
        'color: red;',
      )
      console.error(e)
      console.groupEnd()

      this.onerror(e as unknown as Event)
    })

    this.socketTask.onClose(e => {
      console.groupCollapsed(
        '%csocket %cclose',
        'color: gray; font-weight: lighter;',
        'color: inherit;',
      )
      console.log(e)
      console.groupEnd()

      this.onclose(e as unknown as CloseEvent)
    })

    this.socketTask.onMessage(e => {
      const obj = JSON.parse(e.data as string)

      let label = `%csocket %cmessage %c${obj.type}`

      const styles = ['color: gray; font-weight: lighter;', 'color: royalblue;', 'color: inherit;']

      if (obj.type === 'next') {
        label += ` %c(${obj.payload.errors ? 'err' : 'ok'})`
        styles.push(`color: ${obj.payload.errors ? 'red' : 'gray'}; font-weight: lighter;`)
      }

      console.groupCollapsed(label, ...styles)
      const output = obj.payload?.errors ? console.error : console.log
      output(obj)
      console.groupEnd()

      this.onmessage(e as unknown as MessageEvent)
    })
  }

  get readyState() {
    // @ts-expect-error
    return this.socketTask?.readyState ?? 0
  }

  close(code?: number, reason?: string) {
    this.socketTask?.close({ code, reason })
  }

  send(data: string) {
    const obj = JSON.parse(data)

    let label = `%csocket %csend %c${obj.type}`

    const styles = ['color: gray; font-weight: lighter;', 'color: pink;', 'color: inherit;']

    if (obj.type === 'subscribe') {
      label += ` %c${obj.payload.operationName}`
      styles.push('color: inherit;')
    }

    console.groupCollapsed(label, ...styles)
    console.log(obj)
    console.groupEnd()

    this.socketTask?.send({ data })
  }

  ping(data: any, mask: any, cb: any) {
    console.log('socket not sure how to deal with ping', data, mask, cb)
  }

  pong(data: any, mask: any, cb: any) {
    console.log('socket not sure how to deal with pong', data, mask, cb)
  }

  terminate() {
    throw new Error('socket: method not implemented.')
  }

  addEventListener(_type: any, _listener: any, _options: any) {
    throw new Error('socket: method not implemented.')
  }

  removeEventListener(_type: any, _listener: any, _options: any) {
    throw new Error('socket: method not implemented.')
  }

  setMaxListeners(_n: number): this {
    throw new Error('socket: method not implemented.')
  }

  getMaxListeners(): number {
    throw new Error('socket: method not implemented.')
  }

  rawListeners(_event: string | symbol): Function[] {
    throw new Error('socket: method not implemented.')
  }

  prependListener(_event: string | symbol, _listener: (...args: any[]) => void): this {
    throw new Error('socket: method not implemented.')
  }

  prependOnceListener(_event: string | symbol, _listener: (...args: any[]) => void): this {
    throw new Error('socket: method not implemented.')
  }

  dispatchEvent(_event: Event): boolean {
    throw new Error('socket: method not implemented.')
  }
}
