import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { ActivityFormValues, IActivity } from "../models/activity";
import { format } from 'date-fns'
import { store } from "./store";
import { Profile } from "../models/profile";

export default class Activitystore {

    activityRegistry = new Map<string, IActivity>();
    SelectedActivity: IActivity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    constructor() {
        makeAutoObservable(this)
    }

    get activitesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => a.date!.getTime() - b.date!.getTime())
    }

    get groupedActivities() {
        return Object.entries(
            this.activitesByDate.reduce((activities, activity) => {
                const date = format(activity.date!, ('dd MMM yyyy'))
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
    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user
        const attendee = new Profile(user!)
        try {
            await agent.Activities.create(activity);
            const newActivity = new IActivity(activity)
            newActivity.hostUsername = user!.userName
            newActivity.attendees = [attendee]
            this.setActivity(newActivity)
            runInAction(() => {
                this.SelectedActivity = newActivity;
            })
        }
        catch (error) {
        }

    }

    updateActivity = async (activity: ActivityFormValues) => {
        this.loading = true;
        try {
            await agent.Activities.edit(activity)
            runInAction(() => {
                if (activity.id) {
                    let updatedActivity = { ...this.getActivity(activity.id), ...activity }
                    this.activityRegistry.set(activity.id, updatedActivity as IActivity)
                    this.SelectedActivity = updatedActivity as IActivity;
                }
            })
        }
        catch (error) {
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

        const user = store.userStore.user;

        if (user) {
            a.isGoing = a.attendees!.some(a => a.username === user.userName)
            a.isHost = a.hostUsername === user.userName;
            a.host = a.attendees?.find(x => x.username === a.hostUsername)
        }
        a.date = new Date(a.date!)
        this.activityRegistry.set(a.id, a);
    }

    updateAttendance = async () => {
        const user = store.userStore.user
        this.loading = true
        try {
            await agent.Activities.attend(this.SelectedActivity!.id)
            runInAction(() => {
                if (this.SelectedActivity?.isGoing) {
                    this.SelectedActivity.attendees = this.SelectedActivity.attendees?.filter(u => u.username !== user?.userName)
                    this.SelectedActivity.isGoing = false
                }
                else {
                    const attendee = new Profile(user!);
                    this.SelectedActivity?.attendees?.push(attendee)
                    this.SelectedActivity!.isGoing = true
                }
                this.activityRegistry.set(this.SelectedActivity!.id, this.SelectedActivity!)
            })
        } catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.loading = false)
        }

    }

    cancelActivityToggle = async () => {
        this.loading = true
        try {
            await agent.Activities.attend(this.SelectedActivity!.id)
            runInAction(() => {
                this.SelectedActivity!.isCancelled = !this.SelectedActivity?.isCancelled
                this.activityRegistry.set(this.SelectedActivity!.id, this.SelectedActivity!)
            })
        } catch (error) {
            console.log(error)
        } finally {
            runInAction(() => {
                this.loading = false
            })
        }
    }


}