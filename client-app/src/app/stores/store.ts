import { createContext, useContext } from "react";
import Activitystore from "./activitystore";
import ModalStore from "./modalStore";
import ServerErrorStore from "./serverErrorStore";
import UserStore from "./userstore";

interface Store {
    activitystore: Activitystore
    serverStore: ServerErrorStore
    userStore: UserStore
    modalStore :ModalStore
}

export const store: Store = {
    activitystore: new Activitystore(),
    serverStore: new ServerErrorStore,
    userStore: new UserStore,
    modalStore : new ModalStore
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}