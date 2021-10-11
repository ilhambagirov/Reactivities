import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Header, List, ListItem } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivitiesDashboard';

function App() {

  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | undefined>(undefined)

  useEffect(() => {
    axios.get<IActivity[]>('http://localhost:5000/api/activities').then(response => {
      setActivities(response.data)
    })
  }, [])

  function handleSelectActivity(id: string) {
    setSelectedActivity(activities.find(x => x.id === id))
  }

  function handleCancelSelectActivity() {
    setSelectedActivity(undefined)
  }
  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities}
          // selectedActivity={selectedActivity}
          // selectActivity={handleSelectActivity}
          // cancelSelectActivity={handleCancelSelectActivity}
        />
      </Container>
    </Fragment>
  );
}
export default App;
