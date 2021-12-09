import React from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { format } from 'date-fns'
import ActivityListItemAttendee from "./ActivityListItemAttendee";
import { observer } from "mobx-react-lite";

interface Props {
    activity: IActivity
}

export default observer(function ActivityListItem({ activity }: Props) {

    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>
                                Hosted by {activity.host?.displayName}
                                {activity.isHost &&
                                    <Item.Description>
                                        <Label basic color='orange'>
                                            You are hosting this event
                                        </Label>
                                    </Item.Description>
                                }
                                 {activity.isGoing && !activity.isHost &&
                                    <Item.Description>
                                        <Label basic color='orange'>
                                            You are going this event
                                        </Label>
                                    </Item.Description>
                                }
                            </Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>

            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!, ('dd MMM yyyy h:mm aa'))}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>

            <Segment secondary>
                <ActivityListItemAttendee attendees={activity.attendees!} />
            </Segment>
            <Segment clearing>
                {activity.description}
                <Button as={Link} to={`/activities/${activity.id}`} color='teal' floated='right' content='View' />
            </Segment>
        </Segment.Group>
    )
})