import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { IActivity } from "../models/activity";

export default class Activitystore {

    activities: IActivity[] = []
    SelectedActivity: IActivity | null = null;
    editMode = false;
    loading = false;
    loadingInitial = false;
    constructor() {
        makeAutoObservable(this)
    }

    loadActivities = async () => {
        this.loadingInitial = true;
        try {
            const activities = await agent.Activities.list();
            activities.forEach(a => {
                a.date = a.date.split('T')[0]
                this.activities.push(a)
            })
            this.loadingInitial = false;
        } catch (error) {
            console.log(error)
            this.loadingInitial = false;
        }
    }
   
}