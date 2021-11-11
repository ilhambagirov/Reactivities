import axios, { AxiosResponse } from "axios";
import { IActivity } from "../models/activity";

const sleep = (delay: number) => {
    return new Promise(resolve => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'https://localhost:44364/api'

axios.interceptors.response.use(async response => {
    try {
        await sleep(1000);
        return response;
    } catch (error) {
        console.log(error);
        Promise.reject(error);
    }
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
    details: (id: string) => request.get<IActivity[]>(`/activities/${id}`),
    create: (activity: IActivity) => axios.post<void>('/activities', activity),
    edit: (activity: IActivity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`),

}

const agent = {
    Activities
}

export default agent