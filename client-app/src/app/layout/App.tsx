import React, { Fragment, useEffect } from 'react';
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
import LoginForm from '../../features/Users/LoginForm';
import { useStore } from '../stores/store';
import Loading from './LoadingComponents';
import ModalContainer from '../common/modals/ModalContainer';

function App() {

  const location = useLocation()
  const { serverStore, userStore } = useStore();

  useEffect(() => {
    if (serverStore.token) {
      userStore.getUser().finally(() => serverStore.setAppLoaded())
    } else {
      serverStore.setAppLoaded()
    }
  }, [serverStore, userStore])

  // if (!serverStore.appLoaded) return <Loading content='Loading...' />
  
  return (
    <Fragment>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer/>
      <Route exact path='/' component={homePage} />
      <Route path='/(.+)' render={() => (
        <>
          <NavBar />
          <Container style={{ marginTop: '7em' }}>

            <Switch>
              <Route exact path='/activities' component={ActivityDashboard} />
              <Route key={location.key} path={['/createActivity', '/manage/:id']} component={ActivityForm} />
              <Route exact path='/activities/:id' component={ACtivityDeatils} />
              <Route exact path='/errors' component={TestErrors} />
              <Route exact path='/servererror' component={ServerError} />
              <Route exact path='/login' component={LoginForm} />
              <Route component={NotFound} />
            </Switch>

          </Container>
        </>
      )} />

    </Fragment>
  );
}
export default observer(App);
