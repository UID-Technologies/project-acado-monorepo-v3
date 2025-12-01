import AxiosBase from './AxiosBase'
import { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import appConfig from '@app/config/app.config';
const ApiService = {
    fetchDataWithAxios<Response = unknown, Request = Record<string, unknown>>(
        param: AxiosRequestConfig<Request>,
    ) {
        return new Promise<Response>((resolve, reject) => {
            AxiosBase(param)
                .then((response: AxiosResponse<Response>) => {
                    resolve(response.data)
                })
                .catch((error: AxiosError<{ message?: string }>) => {
                    let errorMessage = appConfig?.errorMessages?.internalServerError;
                    if (appConfig.debug) {
                        if (error.response?.data?.message) {
                            errorMessage = error.response.data.message;
                        } else if (error.message) {
                            errorMessage = error.message;
                        }
                    }
                    reject(errorMessage);
                });
        })
    },
}

export default ApiService
