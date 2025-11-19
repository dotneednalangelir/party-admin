import { apiService } from './ApiService'
import { ENDPOINTS } from './config'
import type { ApiResponse, Job, JobListRequest, JobListResponse, JobStatus } from '../types/api'

export const jobService = {
  async getJobs(params?: JobListRequest): Promise<ApiResponse<JobListResponse>> {
    const queryParams = new URLSearchParams()

    if (params?.pageIndex !== undefined) {
      queryParams.append('PageIndex', params.pageIndex.toString())
    }
    if (params?.pageSize !== undefined) {
      queryParams.append('PageSize', params.pageSize.toString())
    }
    if (params?.jobStatus !== undefined) {
      queryParams.append('Filter.Field', 'JobStatus')
      queryParams.append('Filter.Operator', 'eq')
      queryParams.append('Filter.Value', params.jobStatus.toString())
    }

    const endpoint = `${ENDPOINTS.application.jobs.list}?${queryParams.toString()}`
    return apiService.get<ApiResponse<JobListResponse>>(endpoint)
  },

  async getJobById(id: string): Promise<ApiResponse<Job>> {
    return apiService.get<ApiResponse<Job>>(ENDPOINTS.application.jobs.get(id))
  },

  async updateJobStatus(id: string, status: JobStatus): Promise<ApiResponse<any>> {
    return apiService.patch<ApiResponse<any>>(
      ENDPOINTS.application.jobs.updateStatus(id, status)
    )
  },
}
