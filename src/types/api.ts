export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface LoginByPhoneRequest {
  phoneNumber: string
}

export interface LoginByPhoneResponse {
  isMessageSent: boolean
}

export interface ValidateLoginCodeRequest {
  phoneNumber: string
  validationCode: string
}

export interface ValidateLoginCodeResponse {
  accessToken: string
}

export interface Job {
  id: string
  planName: string
  addressTitle: string
  jobDefinationTranslations: Record<string, string>
  personnelNeedCount: number
  workStartDate: string
  workEndDate: string
  hourlyPrice: number
  tenantName: string
  applicationCount: number
  approvedApplicationCount: number
  tagIds: string[]
  jobTagInfos: JobTagInfo[]
  latitude: number | null
  longitude: number | null
  distance: number
  createdTime: string
}

export interface JobTagInfo {
  tagId: string
  tagNames: Record<string, string>
}

export enum JobStatus {
  Draft = 0,
  WaitingApprove = 1,
  Approved = 2,
  WaitingApplicationApprove = 3,
  ProvisionCompleted = 4,
  ProvisionFailed = 5,
  CaptureCompleted = 6,
  CaptureFailed = 7,
  PlatformTransferWaiting = 8,
  PlatformTransferCompleted = 9,
  PlatformTransferFailed = 10,
  Cancelled = 11
}

export interface DynamicFilter {
  field?: string
  operator?: string
  value?: string
  logic?: string
  filters?: DynamicFilter[]
}

export interface PageRequest {
  pageIndex?: number
  pageSize?: number
}

export interface JobListRequest {
  pageIndex?: number
  pageSize?: number
  jobStatus?: JobStatus
  filter?: DynamicFilter
}

export interface JobListResponse {
  items: Job[]
  index: number
  size: number
  count: number
  pages: number
  hasPrevious: boolean
  hasNext: boolean
}
