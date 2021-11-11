import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import Loading from './LoadingComponents';
import { useStore } from '../stores/store';
import { observer } from 'mobx-react-lite';

function App() {

  const { activitystore } = useStore()

  useEffect(() => {
    activitystore.loadActivities()
  }, [activitystore])

  if (activitystore.loadingInitial) return <Loading content='Loading...' />
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}
export default observer(App);
