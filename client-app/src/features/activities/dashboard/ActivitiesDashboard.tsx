import React from "react";
import { Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props {
    activities: IActivity[];
    selectedActivity: IActivity | undefined;
    selectActivity: (id: string) => void;
    cancelSelectActivity: () => void;
    openForm: (id: string) => void;
    closeForm: () => void;
    editMode: boolean
    createorEdit: (activity: IActivity) => void;
    handleDelete: (id: string) => void;


}
export default function ActivityDashboard({ activities, selectedActivity,
    selectActivity, cancelSelectActivity,
    openForm, closeForm,
    editMode, createorEdit,
    handleDelete }: Props) {//destructuring
    return (
        <Grid>
            <Grid.Column width='10'>
                <ActivityList
                    activities={activities}
                    selectActivity={selectActivity}
                    deleteActivity={handleDelete} />

            </Grid.Column>
            <Grid.Column width='6'>
                {selectedActivity && !editMode &&
                    <ActivityDetails
                        activity={selectedActivity}
                        cancelSelectActivity={cancelSelectActivity}
                        openForm={openForm}
                    />}
                {editMode &&
                    <ActivityForm
                        closeForm={closeForm}
                        activity={selectedActivity}
                        createorEdit={createorEdit} />}
            </Grid.Column>
        </Grid>
    )
}