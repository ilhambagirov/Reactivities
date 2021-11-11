import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import Loading from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";
import ActivityList from "./ActivityList";


export default observer(function ActivityDashboard() {//destructuring
    const { activitystore } = useStore();
    const { SelectedActivity, editMode, activityRegistry, loadActivities } = activitystore

    useEffect(() => {
        if (activityRegistry.size <= 1) loadActivities()

    }, [activityRegistry.size, loadActivities])

    if (activitystore.loadingInitial) return <Loading content='Loading...' />

    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width='6'>
                <h1>Activity Filters</h1>
            </Grid.Column>
        </Grid>
    )
})