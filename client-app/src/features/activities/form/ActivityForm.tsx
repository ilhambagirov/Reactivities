import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { useStore } from "../../../app/stores/store";
import { Link } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from 'yup'
import MyTextInput from "../../../app/common/Form/MyTextInput";
import MyTextArea from "../../../app/common/Form/MyTextArea";
import MySelectInput from "../../../app/common/Form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/Form/MyDateInput";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from 'uuid';


export default observer(function ActivityForm() {

    const { activitystore } = useStore();

    const history = useHistory()

    const { createActivity, updateActivity, loading, loadActivity, loadingInitial } = activitystore

    const { id } = useParams<{ id: string }>()
    const [activity, setActivity] = useState<IActivity>(
        {
            id: '',
            description: '',
            title: '',
            category: '',
            date: null,
            city: '',
            venue: ''
        }
    )

    const validationSchema = Yup.object(
        {
            title: Yup.string().required("The title is required"),
            description: Yup.string().required("The description is required"),
            category: Yup.string().required("The category is required"),
            date: Yup.string().required("The date is required").nullable(),
            city: Yup.string().required("The city is required"),
            venue: Yup.string().required("The Title is required")
        }
    )

    useEffect(() => {
        if (id) loadActivity(id).then(activity => setActivity(activity!))
    }, [id, loadActivity])


    function handleFormSubmit(activity: IActivity) {
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

    if (loadingInitial) return <LoadingComponents content='Loading...' />
    return (
        <Segment clearing>
            <Header content='Activity Details' sub color='teal' />
            <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity}
                onSubmit={values => handleFormSubmit(values)} >
                {({ handleSubmit, isValid, isSubmitting, dirty }) => (
                    <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                        <MyTextInput placeholder='Title' name='title' />
                        <MyTextArea placeholder='Description' name='description' rows={3} />
                        <MySelectInput placeholder='Category' name='category' options={categoryOptions} />
                        <MyDateInput placeholderText='Date' name='date' showTimeSelect timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa' />
                        <Header content='Location Details' sub color='teal' />
                        <MyTextInput placeholder='City' name='city' />
                        <MyTextInput placeholder='Venue' name='venue' />
                        <Button
                            disabled={isSubmitting || !dirty || !isValid}
                            loading={loading} floated='right' positive type='submit' content='Submit' />
                        <Button as={Link} to='/activities' floated='right' type='button' content='Cancel' />
                    </Form>
                )}
            </Formik>


        </Segment>
    )
})