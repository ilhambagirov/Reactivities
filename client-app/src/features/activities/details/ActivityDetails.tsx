import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import {Grid } from "semantic-ui-react";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";
import ActivityDetailedInfo from "./AcrivityDetailedInfo";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";

export default observer(function ACtivityDeatils() {

    const { activitystore } = useStore();

    const {SelectedActivity,loadActivities} = activitystore

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        if (id) activitystore.loadActivity(id)
    }, [id, loadActivities])

    if (activitystore.loadingInitial || !SelectedActivity) return <LoadingComponents content={""} />;
    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={SelectedActivity}/>
                <ActivityDetailedInfo activity={SelectedActivity}/>
                <ActivityDetailedChat/>
            </Grid.Column>
            <Grid.Column width={6}>
                <ActivityDetailedSidebar/>
            </Grid.Column>
        </Grid>
    )
})