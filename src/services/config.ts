type Environment = 'development' | 'test' | 'production'

const VALID_ENVIRONMENTS = ['development', 'test', 'production'] as const

export const CURRENT_ENVIRONMENT: Environment = (VALID_ENVIRONMENTS.includes(
  import.meta.env.VITE_ENVIRONMENT as any
)
  ? (import.meta.env.VITE_ENVIRONMENT as Environment)
  : 'test')

type Config = {
  baseUrl: string
  timeout: number
  headers: Record<string, string>
}

const createConfig = (baseUrl: string, timeout = 30000): Config => ({
  baseUrl,
  timeout,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Accept-Language': 'tr-TR'
  },
})

const CONFIGS: Record<Environment, Config> = {
  development: createConfig(
    import.meta.env.VITE_DEV_BASE_URL || 'https://9395950ad98b.ngrok-free.app',
    parseInt(import.meta.env.VITE_DEV_TIMEOUT || '30000')
  ),
  test: createConfig(
    import.meta.env.VITE_TEST_BASE_URL || 'https://apigw-test-819608842954.europe-west1.run.app',
    parseInt(import.meta.env.VITE_TEST_TIMEOUT || '30000')
  ),
  production: createConfig(
    import.meta.env.VITE_PROD_BASE_URL || 'https://produrl',
    parseInt(import.meta.env.VITE_PROD_TIMEOUT || '30000')
  ),
}

export const API_CONFIG = CONFIGS[CURRENT_ENVIRONMENT]
export const API_BASE_URL = API_CONFIG.baseUrl

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
}

const withId = (path: string) => (id: string) => path.replace('{id}', id)

export const ENDPOINTS = {
  user: {
    auth: {
      loginByPhone: '/user/auth/loginbyphone',
      validateLoginCode: '/user/auth/validatelogincode',
    },
  },
  application: {
    jobs: {
      updateStatus: (id: string, status: number) => `/application/jobs/${id}/${status}`,
      get: withId('/application/jobs/{id}'),
      list: '/application/jobs/list',
    },
  },
}
