import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from 'uuid';
import { Link } from "react-router-dom";


export default observer(function ActivityForm() {

    const { activitystore } = useStore();

    const history = useHistory()

    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activitystore

    const { id } = useParams<{ id: string }>()
    const [activity, setActivity] = useState(
        {
            id: '',
            description: '',
            title: '',
            category: '',
            date: '',
            city: '',
            venue: ''
        }
    )

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity])


    function handleSubmit() {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`))
        } else {

            updateActivity(activity).then(() => history.push(`/activities/${activity.id}`))
        }
    }

    function handleOnChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = event.target

        setActivity({ ...activity, [name]: value })
    }

    if (loadingInitial) return <LoadingComponents content='Loading...' />
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
                <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
            </Form>

        </Segment>
    )
})