interface Wx {
  reportEvent: (eventName: string, data: object) => void
}

declare const wx: Wx
