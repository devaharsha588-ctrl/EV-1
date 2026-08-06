export type UnknownRecord = Readonly<Record<string, unknown>>

export interface ApiEnvelope<TData> {
  readonly data: TData
  readonly meta?: UnknownRecord
}

export interface ApiErrorResponse {
  readonly message: string
  readonly code?: string
  readonly details?: UnknownRecord
}
