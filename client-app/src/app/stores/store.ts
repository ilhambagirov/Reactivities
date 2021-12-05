import { createContext, useContext } from "react";
import Activitystore from "./activitystore";
import ServerErrorStore from "./serverErrorStore";

interface Store {
    activitystore: Activitystore
    serverStore:ServerErrorStore
}

export const store: Store = {
    activitystore: new Activitystore(),
    serverStore: new ServerErrorStore
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}