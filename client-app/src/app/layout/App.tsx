import React, { Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import { observer } from 'mobx-react-lite';
import { Route, useLocation } from 'react-router';
import homePage from '../../features/Home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ACtivityDeatils from '../../features/activities/details/ActivityDetails';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import { Switch } from 'react-router-dom';
import ServerError from '../../features/errors/ServerError';

function App() {

  const location = useLocation()
  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route exact path='/' component={homePage} />
      <Route path='/(.+)' render={() => (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>

            <Switch>
              <Route exact path='/activities' component={ActivityDashboard} />
              <Route key={location.key} path={['/createActivity', '/editActivity:id']} component={ActivityForm} />
              <Route exact path='/activities/:id' component={ACtivityDeatils} />
              <Route exact path='/errors' component={TestErrors} />
              <Route exact path='/servererror' component={ServerError} />
              <Route component={NotFound} />
            </Switch>

          </Container>
        </>
      )} />

    </Fragment>
  );
}
export default observer(App);
