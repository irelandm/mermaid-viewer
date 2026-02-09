// Status Message Type
export type StatusType = 'success' | 'error' | 'warning' | 'info'

export interface StatusMessage {
  type: StatusType
  message: string
}
