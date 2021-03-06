import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/Form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup'
import ValidationError from "../errors/ValidationErrors";
import ValidationErrors from "../errors/ValidationErrors";

export default observer(function RegisterForm() {
    const { userStore } = useStore()
    return (
        <Formik
            validationSchema={Yup.object(
                {
                    displayName: Yup.string().required("This field is required"),
                    username: Yup.string().required("This field is required"),
                    email: Yup.string().required("This field is required").email(),
                    password: Yup.string().required("This field is required"),
                }
            )}
            initialValues={{ displayName: '', username: '', email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.register(values).catch(error => setErrors({ error }))}
        >
            {({ handleSubmit, isSubmitting, errors, isValid, dirty }) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off' >
                    <Header as='h2' content='Sign Up' color='teal' textAlign='center' />
                    <MyTextInput name='displayName' placeholder='Display Name' />
                    <MyTextInput name='username' placeholder='Username' />
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage name='error' render={() =>
                        <ValidationErrors errors={ errors.error}/>}
                    />
                    <Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting} positive content='Register' type='Submit' fluid />
                </Form>
            )}
        </Formik>

    )
})