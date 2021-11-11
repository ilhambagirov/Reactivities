import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router';
import homePage from '../../features/Home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ACtivityDeatils from '../../features/activities/details/ActivityDetails';

function App() {

  const location = useLocation()
  return (
    <Fragment>
      <Route exact path='/' component={homePage} />
      <Route path='/(.+)' render={() => (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>
            <Route exact path='/activities' component={ActivityDashboard} />
            <Route key={location.key} path={['/createActivity', '/editActivity:id']} component={ActivityForm} />
            <Route exact path='/activities/:id' component={ACtivityDeatils} />
          </Container>
        </>
      )} />

    </Fragment>
  );
}
export default observer(App);
