import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { IActivity } from "../models/activity";
import { v4 as uuid } from 'uuid';

export default class Activitystore {

    activityRegistry = new Map<string, IActivity>();
    SelectedActivity: IActivity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;
    constructor() {
        makeAutoObservable(this)
    }

    get activitesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date)- Date.parse(b.date))
    }

    loadActivities = async () => {
        try {
            const activities = await agent.Activities.list();
            activities.forEach(a => {
                a.date = a.date.split('T')[0]
                this.activityRegistry.set(a.id, a);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error)
            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id: string) => {
        this.SelectedActivity = this.activityRegistry.get(id);
    }

    cancelSelectedActivity() {
        this.SelectedActivity = undefined;
    }
    openForm = (id?: string) => {
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }

    createActivity = async (activity: IActivity) => {
        this.loading = true;
        activity.id = uuid()
        try {
            await agent.Activities.create(activity).then(() => {
                runInAction(() => {
                    this.activityRegistry.set(activity.id, activity);
                    this.SelectedActivity = activity;
                    this.editMode = false;
                    this.loading = false;
                })
            })
        }
        catch (error) {
            runInAction(() => {
                this.loading = false;
            })
        }

    }

    updateActivity = async (activity: IActivity) => {
        this.loading = true;
        try {
            await agent.Activities.edit(activity).then(() => {
                runInAction(() => {
                    this.activityRegistry.set(activity.id, activity)
                    this.SelectedActivity = activity;
                    this.editMode = false;
                    this.loading = false;
                })
            })
        }
        catch (error) {
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id)
                if (this.SelectedActivity?.id === id) this.cancelSelectedActivity();
                this.loading = false;
            })
        } catch (error) {
            this.loading = false;
        }
    }
}