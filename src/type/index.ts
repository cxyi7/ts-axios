export type Method = 'get' | 'GET' | 'delete' | 'DELETE' | 'HEAD' | 'head' | 'options' | 'OPTIONS' | 'post' | 'POST' | 'put' | 'PUT' | 'PATCH' | 'patch'

export interface AxiosRequestConfig {
    url: string
    method?: Method
    data?: any
    params?: any
    headers?: any
    responseType?: XMLHttpRequestResponseType
}

export interface AxiosResponse {
    data: any
    status: number
    statusText: string
    headers: any
    config: AxiosRequestConfig
    request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {

}