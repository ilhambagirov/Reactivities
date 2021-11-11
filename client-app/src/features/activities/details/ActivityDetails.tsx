import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";

export default function ACtivityDeatils() {

    const { activitystore } = useStore();

    if (!activitystore.SelectedActivity) return <LoadingComponents content={""}/>;
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
                    <Button onClick={() => activitystore.openForm(activitystore.SelectedActivity?.id)} basic color='blue' content='Edit' />
                    <Button onClick={() => activitystore.cancelSelectedActivity()} basic color='grey' content='Cancel' />
                </Button.Group>
            </Card.Content>
        </Card>
    )
}