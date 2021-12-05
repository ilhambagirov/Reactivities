import { observer } from "mobx-react-lite";
import React from "react";
import { Container, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

export default observer(function ServerErros() {
    const { serverStore } = useStore()
    return (
        <Container>
            <Header as='h1' content='Server Error' />
            <Header sub as='h5' content={serverStore.error?.message} />

            {serverStore.error?.details &&

                <Segment>
                    <Header as='h1' content='Stack Trace' color='teal' />
                    <code style={{ marginTop: 10 }}>{serverStore.error?.details}</code>
                </Segment>
            }
        </Container>
    )
})