import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";

interface Props {
    activity: IActivity | undefined;
    closeForm: () => void;
    createorEdit: (activity: IActivity) => void;
    submitting: boolean;
}
export default function ActivityForm({ activity: selectedActivity,
    closeForm, createorEdit
    , submitting }: Props) {

    const initialState = selectedActivity ?? {
        id: '',
        description: '',
        title: '',
        category: '',
        date: '',
        city: '',
        venue: ''
    }

    const [activity, setActivity] = useState(initialState)
    function handleSubmit() {
        createorEdit(activity)
    }

    function handleOnChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target

        setActivity({ ...activity, [name]: value })
    }
    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleOnChange} />
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleOnChange} />
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleOnChange} />
                <Form.Input placeholder='Date' type='date' value={activity.date} name='date' onChange={handleOnChange} />
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleOnChange} />
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleOnChange} />
                <Button loading={submitting} floated='right' positive type='submit' content='Submit' />
                <Button onClick={() => closeForm()} floated='right' type='button' content='Cancel' />
            </Form>

        </Segment>
    )
}