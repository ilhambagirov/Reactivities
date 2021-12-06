import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/Form/MyTextInput";
import { useStore } from "../../app/stores/store";
import * as Yup from 'yup'
import ValidationError from "../errors/ValidationErrors";


export default observer(function LoginForm() {
    const { userStore } = useStore()
    return (
        <Formik

            initialValues={{ email: '', password: '', error: null }}
            onSubmit={(values, { setErrors }) => userStore.login(values).catch(error => setErrors({ error: 'Invalid Email or Password' }))}
        >
            {({ handleSubmit, isSubmitting, errors }) => (
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off' >
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Password' type='password' />
                    <ErrorMessage name='error' render={() =>
                        <Label basic color='red' style={{marginBottom:10}} content={errors.error} />}
                    />
                    <Button loading={isSubmitting} positive content='Login' type='Submit' fluid />
                </Form>
            )}
        </Formik>

    )
})