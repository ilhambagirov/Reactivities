import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";


export default observer(function ActivityForm() {

    const { activitystore } = useStore();

    const { SelectedActivity, createActivity, updateActivity, loading } = activitystore

    const initialState = SelectedActivity ?? {
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
        activity.id ?
            updateActivity(activity)
            : createActivity(activity)
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
                <Button loading={loading} floated='right' positive type='submit' content='Submit' />
                <Button onClick={() => activitystore.closeForm()} floated='right' type='button' content='Cancel' />
            </Form>

        </Segment>
    )
})