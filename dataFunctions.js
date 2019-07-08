
export const saveEventAfterPost = async (key, data, stateData) => {
    // Save encrypted data to local storage
    this.setState(prevState => ({
      events: [...prevState.events, stateData]
    }))
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data), (err) => {
       
      this.createToast("Event created", "normal", 4000)
      this.setDataToArray(new Date())
      })
    } catch (error) {
      // Error saving data
    }
  }
  
  export const editEvent = async (dataset, key, data, stateData) => {
    let newEventsArray = dataset.map(event => {
    
      if (`eventId${event.uuid}` === key) {
          return Object.assign({}, stateData )
        }
       else {
        return event
       }
      })
    
    this.setState({ events: newEventsArray })
    this.createToast("Event edited", "normal", 4000)
  
    // Save edited event to local storage and state
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data), (err) => {
        this.setDataToArray(new Date())
  
      })
    } catch (error) {
      // Error saving data 
    }
  }
  
  
  
  
  export const saveTaskAfterPost = async (key, data, stateData) => {
    // Save encrypted data to local storage
    this.setState(prevState => ({
      tasks: [...prevState.tasks, stateData]
    }))
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data), (err) => {
  
      this.createToast("Task created", "normal", 4000)
      })
    } catch (error) {
      // Error saving data
    }
  }
  
export const eventWasDeleted = async (key) => {
    this.setState({events: this.state.events.filter(function(item) { 
      return item.uuid !== key 
  })})
    try {
      await AsyncStorage.removeItem(`eventId${key}`, (err) => {
        //alert("Event was deleted")
        //NavigationService.navigate('EventListScreen')
  
        //Delete event from state
        this.setDataToArray(new Date())
        this.createToast("Event deleted", "normal", 4000)
  
  
    })
        /*
        let newArray = []
        let mapOverOldData = this.state.events.map(event => {
          if (event.uuid !== key) {
            newArray.concat(event)
          }
        })
        this.setState({events: newArray })
        })
        */
      
  
    } catch (error) {
      // Error saving data
    }
  
  }