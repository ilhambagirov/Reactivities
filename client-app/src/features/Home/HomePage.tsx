import { observer } from "mobx-react-lite";
import React from "react";
import { Link } from "react-router-dom";
import { Button, Container, Header, Image, Segment } from "semantic-ui-react";
import { store, useStore } from "../../app/stores/store";
import LoginForm from "../Users/LoginForm";
import RegisterForm from "../Users/RegisterForm";

export default observer(function HomePage() {
    const { modalStore } = useStore()
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1' inverted>
                    <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: 12 }} />
                </Header>
                {store.userStore.isLoggedIn ? (
                    <>
                        <Header as='h2' content='Welcome to MeetUp' />
                        <Button as={Link} to='/activities' size='huge' inverted>Start Now!</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => modalStore.openModal(<LoginForm />)} size='huge' inverted>Login</Button>
                        <Button onClick={() => modalStore.openModal(<RegisterForm />)} size='huge' inverted>Register</Button>
                    </>
                )}
            </Container>
        </Segment>

    )
})