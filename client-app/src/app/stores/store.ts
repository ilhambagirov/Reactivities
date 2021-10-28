import { createContext, useContext } from "react";
import Activitystore from "./activitystore";

interface Store {
    activitystore: Activitystore
}

export const store: Store = {
    activitystore: new Activitystore()
}

export const StoreContext = createContext(store)

export function useStore() {
    return useContext(StoreContext)
}