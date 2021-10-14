import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import { Container} from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import { v4 as uuid } from 'uuid';

function App() {

  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)

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

  function handleFormOpen(id?: string) {
    id ? handleSelectActivity(id) : handleCancelSelectActivity();
    setEditMode(true)
  }

  function handleOpenClose() {
    setEditMode(false)
  }

  function handleCreateorEditAction(activity: IActivity) {
    activity.id ? setActivities([...activities.filter(a => a.id !== activity.id), activity])
      : setActivities([...activities, { ...activity, id: uuid() }])
    setEditMode(false)
    setSelectedActivity(activity)
  }

  function handleDelete(id: string) {
    setActivities([...activities.filter(x=>x.id!==id)])
  }
  return (
    <Fragment>
      <NavBar
        openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={activities}
          selectedActivity={selectedActivity}
          selectActivity={handleSelectActivity}
          cancelSelectActivity={handleCancelSelectActivity}
          openForm={handleFormOpen}
          closeForm={handleOpenClose}
          editMode={editMode}
          createorEdit={handleCreateorEditAction}
          handleDelete={handleDelete}
        />
      </Container>
    </Fragment>
  );
}
export default App;
