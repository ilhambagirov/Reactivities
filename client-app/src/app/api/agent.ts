import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { history } from "../..";
import { IActivity } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { store } from "../stores/store";

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'https://localhost:44364/api'

axios.interceptors.response.use(async response => {
    await sleep(200);
    return response;
}, (error: AxiosError) => {
    const { data, status, config } = error.response!;
    switch (status) {
        case 400:
            if(typeof data === 'string') {
                toast.error(data)
            }
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
                history.push('/notfound')
                
            }
            if (data.errors) {
                const modelStateErrors = []
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat()
            } 
            break;
        case 401: toast.error('Unauthorized'); break
        case 404: history.push('/not-found'); break;
        case 500:
            store.serverStore.setServerError(data)
            history.push('/servererror')
            break;
    }
    return Promise.reject(error)
})

const responseBody = <T>(response: AxiosResponse<T>) => response.data

const request = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, id: string, body: {}) => axios.put<T>(url, id, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

const Activities = {
    list: () => request.get<IActivity[]>('/activities'),
    details: (id: string) => request.get<IActivity>(`/activities/${id}`),
    create: (activity: IActivity) => axios.post<void>('/activities', activity),
    edit: (activity: IActivity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`),
}

const Account = {
    Current: () => request.get<User>('/account'),
    login: (user: UserFormValues) => request.post<User>(`/account`,user),
    register: (user: UserFormValues) => axios.post<void>('/account/register', user),
}

const agent = {
    Activities,
    Account
}

export default agent