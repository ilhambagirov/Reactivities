import React from "react";
import { Button, Form, Segment } from "semantic-ui-react";

export default function ActivityForm() {
    return (
        <Segment clearing>
            <Form>
                <Form.Input placehodler='Title' />
                <Form.TextArea placehodler='Description' />
                <Form.Input placehodler='Category' />
                <Form.Input placehodler='Date' />
                <Form.Input placehodler='City' />
                <Form.Input placehodler='Vanue'/>
                <Button floated='right' positive type='submit' content='Submit' />
                <Button floated='right'  type='button' content='Cancel'/>
            </Form>

        </Segment>
    )
}