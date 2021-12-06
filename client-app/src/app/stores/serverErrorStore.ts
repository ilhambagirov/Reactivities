import axios from "axios";
import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class ServerErrorStore {

    error: ServerError | null = null
    token: string | null = window.localStorage.getItem('jwt')
    appLoaded = false

    constructor() {
        makeAutoObservable(this)

        reaction(
            () => this.token,
            token => {
                if (token) {
                    window.localStorage.setItem('jwt', token)
                }
                else {
                    window.localStorage.removeItem('jwt')
                }
            }
        )
    }

    setServerError = (err: ServerError) => {
        this.error = err
    }

    setToken = (token: string | null) => {
        this.token = token
    }

    setAppLoaded = () => {
        this.appLoaded = true
    }


}