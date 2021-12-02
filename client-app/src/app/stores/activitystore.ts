import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { IActivity } from "../models/activity";


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
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    }

    get groupedActivities() {
        return Object.entries(
            this.activitesByDate.reduce((activities, activity) => {
                const date = activity.date
                activities[date] = activities[date] ? [...activities[date], activity] : [activity]
                return activities;
            }, {} as { [key: string]: IActivity[] })
        )
    }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            const activities = await agent.Activities.list();
            activities.forEach(a => {
                this.setActivity(a)
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
    createActivity = async (activity: IActivity) => {
        this.loading = true;
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
                this.loading = false;
            })
        } catch (error) {
            this.loading = false;
        }
    }

    loadActivity = async (id: string) => {
        let activity = this.getActivity(id)

        if (activity) {
            runInAction(() => {
                this.SelectedActivity = activity;
            })
            return activity;
        } else {
            this.setLoadingInitial(true)

            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    this.SelectedActivity = activity;
                })
                this.setActivity(activity)
                this.setLoadingInitial(false)
                return activity;
            } catch (error) {
                this.setLoadingInitial(false)
            }
        }
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id)
    }

    private setActivity = (a: IActivity) => {
        a.date = a.date.split('T')[0]
        this.activityRegistry.set(a.id, a);
    }


}