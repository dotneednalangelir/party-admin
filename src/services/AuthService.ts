import { apiService } from './ApiService'
import { ENDPOINTS, STORAGE_KEYS } from './config'
import type {
  ApiResponse,
  LoginByPhoneRequest,
  LoginByPhoneResponse,
  ValidateLoginCodeRequest,
  ValidateLoginCodeResponse,
} from '../types/api'

export const authService = {
  async loginByPhone(phoneNumber: string): Promise<ApiResponse<LoginByPhoneResponse>> {
    const data: LoginByPhoneRequest = { phoneNumber }
    return apiService.post<ApiResponse<LoginByPhoneResponse>>(
      ENDPOINTS.user.auth.loginByPhone,
      data,
      { requiresAuth: false }
    )
  },

  async validateLoginCode(
    phoneNumber: string,
    validationCode: string
  ): Promise<ApiResponse<ValidateLoginCodeResponse>> {
    const data: ValidateLoginCodeRequest = { phoneNumber, validationCode }
    const response = await apiService.post<ApiResponse<ValidateLoginCodeResponse>>(
      ENDPOINTS.user.auth.validateLoginCode,
      data,
      { requiresAuth: false }
    )

    if (response.data.accessToken) {
      this.setToken(response.data.accessToken)
    }

    return response
  },

  setToken(token: string): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token)
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  removeToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },

  logout(): void {
    this.removeToken()
  },
}
