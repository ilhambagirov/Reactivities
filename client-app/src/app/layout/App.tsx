import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import Loading from './LoadingComponents';

function App() {

  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)
  const [LoadingMode, setLoadingMode] = useState(true)
  const [Submitting, setSubmitting] = useState(false)

  useEffect(() => {
    agent.Activities.list().then(response => {
      let activities: IActivity[] = []
      response.forEach(a => {
        a.date = a.date.split('T')[0]
        activities.push(a)
      })
      setActivities(activities)
      setLoadingMode(false)
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

    setSubmitting(true);
    if (activity.id) {
      agent.Activities.edit(activity).then(() => {
        setActivities([...activities.filter(a => a.id !== activity.id), activity])
        setSelectedActivity(activity)
        setEditMode(false)
        setSubmitting(false)
      })
    } else {
      activity.id = uuid()
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setSelectedActivity(activity)
        setEditMode(false)
        setSubmitting(false)
      })

    }




  }

  function handleDelete(id: string) {

    setSubmitting(true)
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter(x => x.id !== id)])
      setSubmitting(false)
    })
   
  }

  if (LoadingMode) return <Loading content='Loading...' />
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
          submitting={Submitting}
        />
      </Container>
    </Fragment>
  );
}
export default App;
