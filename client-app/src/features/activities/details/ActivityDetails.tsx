import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";

export default observer(function ACtivityDeatils() {

    const { activitystore } = useStore();

    const { id } = useParams<{ id: string }>()

    useEffect(() => {
        if (id) activitystore.loadActivity(id)
    }, [id, activitystore.loadActivities])

    if (activitystore.loadingInitial || !activitystore.SelectedActivity) return <LoadingComponents content={""} />;
    return (
        <Card fluid>
            <Image src={`/assets/categoryImages/${activitystore.SelectedActivity.category}.jpg`} />
            <Card.Content>
                <Card.Header>{activitystore.SelectedActivity.title}</Card.Header>
                <Card.Meta>
                    <span>{activitystore.SelectedActivity.date}</span>
                </Card.Meta>
                <Card.Description>
                    {activitystore.SelectedActivity.description}
                </Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Button.Group widths='2'>
                    <Button as={Link} to={`/editActivity ${activitystore.SelectedActivity.id}`} basic color='blue' content='Edit' />
                    <Button as={Link} to='/activities' basic color='grey' content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
})