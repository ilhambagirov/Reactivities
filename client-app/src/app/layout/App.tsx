import React, { Fragment, useEffect, useState } from 'react';
import { Container } from 'semantic-ui-react';
import { IActivity } from '../models/activity';
import NavBar from './NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivitiesDashboard';
import { v4 as uuid } from 'uuid';
import agent from '../api/agent';
import Loading from './LoadingComponents';
import { useStore } from '../stores/store';
import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

function App() {

  const {activitystore }=useStore()


  const [activities, setActivities] = useState<IActivity[]>([])
  const [selectedActivity, setSelectedActivity] = useState<IActivity | undefined>(undefined)
  const [editMode, setEditMode] = useState(false)
  const [Submitting, setSubmitting] = useState(false)

  useEffect(() => {
    activitystore.loadActivities()
  }, [activitystore])

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

  if (activitystore.loadingInitial) return <Loading content='Loading...' />
  return (
    <Fragment>
      <NavBar
        openForm={handleFormOpen} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard activities={toJS(activitystore.activities)}
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
export default observer(App);
