import { observer } from "mobx-react-lite";
import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Item, Segment, Button, Label } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";

export default observer(function ActivityList() {
    const { activitystore } = useStore();

    const { deleteActivity, loading, activitesByDate } = activitystore

    const [target, setTarget] = useState('')

    function handleDeleteActivity(event: SyntheticEvent<HTMLButtonElement>, id: string) {

        setTarget(event.currentTarget.name)
        deleteActivity(id)

    }
    return (
        <Segment>
            <Item.Group divided>
                {activitesByDate.map(activity => (
                    <Item key={activity.id}>
                        <Item.Content>
                            <Item.Header as='a'>{activity.title} </Item.Header>
                            <Item.Meta>{activity.date} </Item.Meta>
                            <Item.Description>
                                <div>{activity.description}</div>
                                <div>{activity.city},{activity.venue}</div>
                            </Item.Description>
                            <Item.Extra>
                                <Button as={Link} to={`/activities/${activity.id}`} floated='right' content='View' color='blue' />
                                <Button
                                    name={activity.id}
                                    loading={loading && target === activity.id}
                                    onClick={(event) => handleDeleteActivity(event, activity.id)}
                                    floated='right'
                                    content='Delete'
                                    color='red' />
                                <Label basic content={activity.category} />
                            </Item.Extra>
                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
})