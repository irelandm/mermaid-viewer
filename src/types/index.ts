// Status Message Type
export type StatusType = 'success' | 'error' | 'warning' | 'info'

export interface StatusMessage {
  type: StatusType
  message: string
}

// Node Metadata for Side Panel (Story 5.6)
export interface NodeConnection {
  edgeSource: string
  edgeTarget: string
  targetLabel: string
  direction: 'outgoing' | 'incoming'
}

export interface NodeMetadata {
  bareId: string
  label: string
  connections: NodeConnection[]
}
