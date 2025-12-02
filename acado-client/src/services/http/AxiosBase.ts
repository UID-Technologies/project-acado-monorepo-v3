import axios from 'axios'
import AxiosResponseIntrceptorErrorCallback from './AxiosResponseIntrceptorErrorCallback'
import AxiosRequestIntrceptorConfigCallback from './AxiosRequestIntrceptorConfigCallback'
import appConfig from '@app/config/app.config'
import envConfig from '@app/config/env.config'
import type { AxiosError } from 'axios'

const normalizedBaseUrl = envConfig.apiBaseUrl.replace(/\/$/, '')

const AxiosBase = axios.create({
    timeout: 60000,
    baseURL: `${normalizedBaseUrl}${appConfig.apiPrefix}`,
    withCredentials: true, // Enable cookies for refresh tokens
})

AxiosBase.interceptors.request.use(
    (config) => {
        return AxiosRequestIntrceptorConfigCallback(config)
    },
    (error) => {
        return Promise.reject(error)
    },
)

AxiosBase.interceptors.response.use(
    (response) => {
        // replace all acado.ai with elist.acado.ai
        response.data = JSON.parse(JSON.stringify(response.data).replace(/https:\/\/acado.ai/g, 'https://elist.acado.ai'))
        return response
    },
    (error: AxiosError) => {
        AxiosResponseIntrceptorErrorCallback(error)
        return Promise.reject(error)
    },
)

export default AxiosBase
