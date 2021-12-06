import { createContext, useContext } from "react";
import Activitystore from "./activitystore";
import ServerErrorStore from "./serverErrorStore";
import UserStore from "./userstore";

interface Store {
    activitystore: Activitystore
    serverStore: ServerErrorStore
    userStore :UserStore
}

export const store: Store = {
    activitystore: new Activitystore(),
    serverStore: new ServerErrorStore,
    userStore : new UserStore
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}