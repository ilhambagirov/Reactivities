import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { store } from "./store";

export default class UserStore {

    user: User | null = null

    constructor() {
        makeAutoObservable(this)
    }

    get isLoggedIn() {
        return !!this.user
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.login(creds)
            store.serverStore.setToken(user.token)
            runInAction(() => this.user = user)
            history.push("/activities")
            store.modalStore.closeModal()
        } catch (error) {
            throw error;
        }
    }

    logout = () => {
        store.serverStore.setToken(null)
        window.localStorage.removeItem('jwt')
        this.user = null
        history.push("/")
    }

    getUser = async () => {
        try {
            const user = await agent.Account.Current()
            runInAction(() => this.user = user)
        } catch (error) {
            throw error
        }
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Account.register(creds)
            store.serverStore.setToken(user.data.token)
            runInAction(() => this.user = user.data)
            history.push("/activities")
            store.modalStore.closeModal()
        } catch (error) {
            throw error;
        }
    }




}