import 'babel-polyfill';
import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import { AsyncStorage, NativeModules } from "react-native"
import { createBottomTabNavigator, createAppContainer, createStackNavigator } from "react-navigation";
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { NetInfo } from 'react-native';


import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarScreen from "./components/Calendar/Calendar"
import NewCalendarScreen from "./components/Calendar/NewCalendar"
import EditCalendarScreen from "./components/Calendar/EditCalendar"
import LandingScreen from "./components/Landing/Landing"
import ErrorScreen from "./components/Error/Error"

import LoginScreen from "./components/Login/Login"
import SettingsScreen from "./components/Settings/Settings"
import NewEventScreen from "./components/NewEvent/NewEvent"
import EventDetailsScreen from "./components/EventDetails/EventDetails"
import NotesScreen from "./components/Notes/Notes"
import NewNoteScreen from "./components/NewNote/NewNote"
import NewListScreen from "./components/Tasks/NewList"
import EditListScreen from "./components/Tasks/EditList"

import EditTaskScreen from "./components/Tasks/EditTask"

import HomeScreen from "./components/Home/Home"
import NewNotebookScreen from "./components/Notes/NewNotebook"
import EditNotebookScreen from "./components/Notes/EditNotebook"

import LoadingScreen from "./components/Loading/Loading"

import NoteDetailsScreen from "./components/NoteDetails/NoteDetails"

import EditEventScreen from "./components/EditEvent/EditEvent"
import TasksScreen from "./components/Tasks/Tasks"
import NewTaskScreen from "./components/NewTask/NewTask"
import SearchScreen from "./components/Search/Search"
import ChangePasswordScreen from "./components/Settings/ChangePassword"
import SetEncryptionScreen from "./components/Settings/SetEncryption"
import ConfirmEncryptionScreen from "./components/Register/ConfirmEncryption"
import RegisterNameScreen from "./components/Register/RegisterName"
import RegisterPasswordScreen from "./components/Register/RegisterPassword"
import RegisterEncryptionScreen from "./components/Register/RegisterEncryption"
import DeleteAccountScreen from "./components/Settings/DeleteAccount"
import { loadFromKeychain, decryptData, encryptData } from './encryptionFunctions';

import dateFns, { isAfter, isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, addMonths, getTime, differenceInCalendarDays } from "date-fns";

import * as Keychain from 'react-native-keychain';

import CryptoJS from "react-native-crypto-js";
import { sendPost, sendPostAsync } from './functions.js';
var PushNotification = require('react-native-push-notification');
import NavigationService from './NavigationService';

import 'core-js/es6/symbol';

import 'core-js/fn/symbol/iterator';

import "core-js/es6/set";
import "core-js/es6/weak-set";

function errorCB (err) {
  console.log("SQL Error: " + err);
};

function successCB () {
  console.log("SQL executed fine");
};

function openCB () {
  console.log("Database OPENED");
};

var SQLite = require('react-native-sqlite-storage')
let db = SQLite.openDatabase({name : "test", createFromLocation : "~sqlite.db"}, openCB, errorCB);



var WeakSet = require('weakset');
const ACCESS_CONTROL_OPTIONS = ['None', 'Passcode', 'Password'];
const ACCESS_CONTROL_MAP = [null, Keychain.ACCESS_CONTROL.DEVICE_PASSCODE, Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD, Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET]

// TODO: temporary storing notifications count for events and task for passing to bottom navigator

const initialState = {
  eventsCount: 0,
  tasksCount: 0
};
window.state = initialState;

let darkThemeGlobal = false

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
    console.log('TOKEN:', token);
  },
  // (required) Called when a remote or local notification is opened or received
  onNotification: function (notification) {
    console.log('NOTIFICATION:', notification);
    // process the notification
  },
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
  /**
    * (optional) default: true
    * - Specified if permissions (ios) and token (android and ios) will requested or not,
    * - if not, you must call PushNotificationsHandler.requestPermissions() later
    */
  requestPermissions: true,
});


const IconBadge = props => (
  props.count > 0 ?
    <Text style={{
      color: 'white',
      position: 'absolute',
      top: 1,
      right: -15,
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'black',
      textAlign: "center",
      fontSize: 14
    }}>{props.count}</Text>

    : null


)

let arr = []

const activeTintLabelColorLight = "royalblue"
const inactiveTintLabelColorLight = 'dimgray';

const TabNavigator = createMaterialBottomTabNavigator({
  Home: {
    screen: createStackNavigator({ HomeScreen: HomeScreen }),
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular" }}>Home</Text>,
    tabBarIcon: ({ focused }) => (
      <Ionicons name='md-home' color={focused ? activeTintLabelColorLight : inactiveTintLabelColorLight} size={24} />
    )
    }
  },

  Tasks: {
    screen: createStackNavigator({ TasksScreen: TasksScreen }),
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular" }}>Tasks</Text>,
      tabBarIcon: ({ focused }) => (
        <Ionicons name='md-checkbox-outline' color={focused ? activeTintLabelColorLight : inactiveTintLabelColorLight} size={24} />
      )
      }
    },
  Calendar: {
    screen: createStackNavigator({ CalendarScreen: CalendarScreen }),
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular" }}>Calendar</Text>,
      tabBarIcon: ({ focused }) => (
        <Ionicons name='md-calendar' color={focused ? activeTintLabelColorLight : inactiveTintLabelColorLight} size={24} />
      )
      }
    },

  Notes: {
    screen: createStackNavigator({ NotesScreen: NotesScreen }),
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular" }}>Notes</Text>,
      tabBarIcon: ({ focused }) => (
        <Ionicons name='md-clipboard' color={focused ? activeTintLabelColorLight : inactiveTintLabelColorLight} size={24} />
      )
      }
    },

}, {
  initialRouteName: 'Tasks',
 
  activeColor: "royalblue",
  inactiveColor: 'dimgray',
      shifting: false,
      showLabel: true,
      style: {
        backgroundColor: darkThemeGlobal ? "black" : "#F7F5F4",
        elevation: 12, height: 56, border: "gray", borderWidth: 1
      },
      barStyle: { backgroundColor: 'mintcream', fontFamily: 'Poppins-Regular', height: 56, elevation: 12, borderTop: "dimgray", borderTopWidth: 0.7 },
    
    },
);
const activeTintLabelColor = 'dodgerblue';
const inactiveTintLabelColor = '#929390';
const TabNavigatorDark = createMaterialBottomTabNavigator({
  Home: {
    screen: createStackNavigator({ HomeScreen: HomeScreen }),
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular" }}>Home</Text>,
    tabBarIcon: ({ focused }) => (
      <Ionicons name='md-home' color={focused ? activeTintLabelColor : inactiveTintLabelColor} size={24} />
    )
    }
  },

  Tasks: {
    screen: createStackNavigator({ TasksScreen: TasksScreen }),
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular" }}>Tasks</Text>,
      tabBarIcon: ({ focused }) => (
        <Ionicons name='md-checkbox-outline' color={focused ? activeTintLabelColor : inactiveTintLabelColor} size={24} />
      )
      }
    },
  Calendar: {
    screen: createStackNavigator({ CalendarScreen: CalendarScreen }),
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 12, fontFamily: "Poppins-Bold" }}>Calendar</Text>,
      tabBarIcon: ({ focused }) => (
        <Ionicons name='md-calendar' color={focused ? activeTintLabelColor : inactiveTintLabelColor} size={24} />
      )
      }
    },

  Notes: {
    screen: createStackNavigator({ NotesScreen: NotesScreen }),
    navigationOptions: {
      tabBarLabel: <Text style={{ fontSize: 12, fontFamily: "Poppins-Regular" }}>Notes</Text>,
      tabBarIcon: ({ focused }) => (
        <Ionicons name='md-clipboard' color={focused ? activeTintLabelColor : inactiveTintLabelColor} size={24} />
      )
      }
    },

}, {
  initialRouteName: 'Tasks',
 
  activeColor: 'dodgerblue',
  inactiveColor: '#929390',
      shifting: false,
      showLabel: true,
      style: {
        backgroundColor: darkThemeGlobal ? "black" : "#F7F5F4",
        elevation: 12, height: 56
      },
      barStyle: { backgroundColor: '#17191d', fontFamily: 'Poppins-Regular', height: 56, borderTop: "dimgray", borderTopWidth: 0.7},
    
    },
);

const AnonymUserStack = createStackNavigator({
  Landing: {
    screen: LandingScreen,
  },
  Login: {
    screen: LoginScreen,
  },
  RegisterName: {
    screen: RegisterNameScreen,
  },
  RegisterPassword: {
    screen: RegisterPasswordScreen,
  },
  RegisterEncryption: {
    screen: RegisterEncryptionScreen,
  },
  ConfirmEncryption: {
    screen: ConfirmEncryptionScreen,
  },
  Error: {
    screen: ErrorScreen
  }
}
);

const StackNavigator = createStackNavigator(
  {
    Root: {
      screen: TabNavigator,
      navigationOptions: {
        header: null,
      },
    },
    NewCalendar: {
      screen: NewCalendarScreen,
    },
    EditCalendar: {
      screen: EditCalendarScreen,
    },
    NewEvent: {
      screen: NewEventScreen,
    },
    EventDetails: {
      screen: EventDetailsScreen,
    },
    EditEvent: {
      screen: EditEventScreen,
    },
    NewTask: {
      screen: NewTaskScreen,
    },
    EditTask: {
      screen: EditTaskScreen,
    },
    NewList: {
      screen: NewListScreen,
    },
    EditList: {
      screen: EditListScreen,
    },
    NewNotebook: {
      screen: NewNotebookScreen,
    },
    EditNotebook: {
      screen: EditNotebookScreen,
    },
    NewNote: {
      screen: NewNoteScreen,
    },
    NoteDetails: {
      screen: NoteDetailsScreen,
    },
    SetEncryption: {
      screen: SetEncryptionScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Search: {
      screen: SearchScreen,
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
    },
    DeleteAccount: {
      screen: DeleteAccountScreen,
    },
    Error: {
      screen: ErrorScreen,
    },
  },
  {
    defaultNavigationOptions: {
      
    },
  }
)
const StackNavigatorDark = createStackNavigator(
  {
    Root: {
      screen: TabNavigatorDark,
      navigationOptions: {
        header: null,
      },
    },
    NewCalendar: {
      screen: NewCalendarScreen,
    },
    EditCalendar: {
      screen: EditCalendarScreen,
    },
    NewEvent: {
      screen: NewEventScreen,
    },
    EventDetails: {
      screen: EventDetailsScreen,
    },
    EditEvent: {
      screen: EditEventScreen,
    },
    NewTask: {
      screen: NewTaskScreen,
    },
    EditTask: {
      screen: EditTaskScreen,
    },
    NewList: {
      screen: NewListScreen,
    },
    EditList: {
      screen: EditListScreen,
    },
    NewNotebook: {
      screen: NewNotebookScreen,
    },
    EditNotebook: {
      screen: EditNotebookScreen,
    },
    NewNote: {
      screen: NewNoteScreen,
    },
    NoteDetails: {
      screen: NoteDetailsScreen,
    },
    SetEncryption: {
      screen: SetEncryptionScreen,
    },
    Settings: {
      screen: SettingsScreen,
    },
    Search: {
      screen: SearchScreen,
    },
    ChangePassword: {
      screen: ChangePasswordScreen,
    },
    DeleteAccount: {
      screen: DeleteAccountScreen,
    },
    Error: {
      screen: ErrorScreen,
    },
  },
  {
    defaultNavigationOptions: {
      
    },
  }
)
const LoadingStack = createStackNavigator({
  Loading: {
    screen: LoadingScreen,
  }
})

const AppContainer = createAppContainer(StackNavigator);
const AppContainerDark = createAppContainer(StackNavigatorDark);
const AppContainerAnonym = createAppContainer(AnonymUserStack);
const AppContainerLoading = createAppContainer(LoadingStack);



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sqlLoaded: false,
      darkTheme: false,
      isLogged: "",
      isUpdating: false,
      user: "",
      username: "",
      cryptoPassword: "",
      status: '',
      updated: "",
      biometryType: null,
      accessControl: null,
      defaultCalendar: "",
      defaultList: "",
      defaultNotebook: "",
      events: [],
      notebooks: [],
      notebookName: "",
      notes: [],
      tasks: [],
      lists: [],
      shared: [],
      passwords: [],
      invites: [],
      filteredTasks: [],
      tagName: "",
      calendars: [],
      isLoadingData: false,
      dataForSearch: [],
      sharedLists: [],
      foundData: { foundEvents: [], foundTasks: [], foundNotes: [] },
      //Toast state
      toastIsVisible: false,
      toastType: "",
      toastText: "",
      toastDuration: "",
      //#############
      //Calendar state
      currentWeek: new Date(),
      currentDay: "",
      selectedDate: new Date(),
      testArray: [],
      selectedIndex: "",
      //##############

    }
    this.isLogged = this.isLogged.bind(this);
    this.fetchEventsFromServer = this.fetchEventsFromServer.bind(this);
    this.fetchEventsFromLocal = this.fetchEventsFromLocal.bind(this);
    this.removeAll = this.removeAll.bind(this);
    this.checkIfEventInLocalStorage = this.checkIfEventInLocalStorage.bind(this);
    this.convertToJson = this.convertToJson.bind(this);
    this.saveeventsToLocal = this.saveeventsToLocal.bind(this);
    this.eventWasDeleted = this.eventWasDeleted.bind(this);
    this.saveEventAfterPost = this.saveEventAfterPost.bind(this);

  }
  ///####x

  checkClientEncryption = () => {
    if (this.state.isLogged) {
      const url = "http://localhost:3001/encryption/check";

      fetch(url,
        {
          method: 'GET',
          credentials: 'include',
        })
        .then(response => response.json())

        .then(
          data => {
            if (data.encryptionText) {
              this.setState({ isLoadingData: false })

              // Ask user for his encryption password 
              NavigationService.navigate('ConfirmEncryption', { username: this.state.username, dummyEncryptionText: data.encryptionText.publickey })
            } else {
              this.setState({ isLoadingData: false })

              // Ask user to set encryption key for first time
              NavigationService.navigate('ConfirmEncryption', { username: this.state.username, dummyEncryptionText: null })
            }

          }
        ).catch(error => {
          this.createToast("Connection error", "warning", 4000)
          console.log(error)
        })
    }

  }
  setCredentials = (myUsername, myPassword, callback) => {
    this.setState({ username: myUsername, encryptionPassword: myPassword }, callback())
  }


  storeCryptoPasswordInState = async (callBackIfNoCryptoPassword) => {
    //Load encryption password from keychain
    try {

      const credentials = await Keychain.getGenericPassword();

      if (credentials) {
        console.log("CREDENTIALS FOUND")
        this.setState({ cryptoPassword: credentials.password })
        NetInfo.isConnected.fetch().then((isConnected) => {
          if (isConnected) {
            this.deleteOldData().then(() => {
              this.uploadLocalData().then(() => {
                this.fetchEventsFromServer().then(() => {
                  this.fetchEventsFromLocal().then(() => this.interval = setInterval(() => {this.checkUpdates()}, 8000000)
                  ).catch((error) => {
                    console.log(error)
                    this.setState({ isLoadingData: false })
                    this.createToast("Connection error", "warning", 4000)
      
                  })

                }).catch((error) => {
                  console.log(error)
                  this.setState({ isLoadingData: false })
     
                  this.createToast("Connection error", "warning", 4000)
                  this.fetchEventsFromLocal().then(() => {
                    this.interval = setInterval(() => {this.checkUpdates()}, 8000000)
                  }).catch((error) => {
                    console.log(error)
     
                    this.setState({ isLoadingData: false })
                    this.createToast("Connection error", "warning", 4000)
      
                  })
                })
              }).catch((error) => {
                console.log(error)
                this.setState({ isLoadingData: false })
                this.createToast("Connection error", "warning", 4000)

              })
            }).catch((error) => {
              this.setState({ isLoadingData: false })
              this.createToast("Connection error", "warning", 4000)

              console.log(error)
            })
 
          } else {
            this.setState({ isLoadingData: false })
            this.createToast("Connection error", "warning", 4000)
            this.fetchEventsFromLocal().then(() => console.log("DONE"))
          }
       
        })
      /*
        this.fetchPasswords(credentials.password).then(() => 
        {
          
          this.fetchInvites(),
          this.fetchEventsFromServer().then(() => {
            this.fetchEventsFromLocal(), this.interval = setInterval(() => {this.checkUpdates()}, 8000000)
        })
      })*/
      } else {
        this.checkClientEncryption()

      }
    } catch (err) {

      console.log(err)
      this.createToast("Connection error", "warning", 4000)
    }
  }
  async isLogged() {
    this.setState({ isLoadingData: true })
    this.sqlFind("user").then(data => {
      if (data[0] != undefined) {
        this.setState({ user: data[0].username, isLogged: true, username: data[0].username})
        
        this.storeCryptoPasswordInState()
      } else {
        this.setState({ user: "", isLogged: false, isLoadingData: false })
        return false
      }
    })
    .catch(error => {
      this.setState({ isLoadingData: false })

      this.createToast("Connection error", "warning", 4000)

      console.log(error)
      // Error retrieving data]
    })
   
  }
  fetchInvites = () => {
    const url = "http://localhost:3001/fetch/invites";

    fetch(url,
      {
        method: 'GET',
        credentials: 'include',
      }).catch ((error) => {
        console.log(error);
      })
      
      .then(response => response.json())
      .catch ((error) => {
        console.log(error);
      })
      .then(
        data => {
         this.setState({ invites: data })
        }
          )  
  }

  fetchPasswords = (cryptoPassword) => {
    return new Promise((resolve, reject) => {

    this.sqlFind("passwords", "type = 'passwords'").then(passwordsData => { 
      const url = "http://localhost:3001/fetch/passwords";

      fetch(url,
        {
          method: 'GET',
          credentials: 'include',
        }).catch ((error) => {
          this.createToast("Connection error", "warning", 4000)
          console.log(error);
        })
        
        .then(response => response.json())
        .catch ((error) => {
          this.createToast("Connection error", "warning", 4000)
          console.log(error);
        })
        .then(
          data => {
            data.map((item, index) => {
              //add only new data to local storage
              if (this.notInLocalStorage(item.uuid, passwordsData)) {
                this.sqlInsert("passwords", "uuid, data, updated, type, needSync", [item.uuid, item.data, item.updated, "passwords", "false"])
              }
    }
        )
      }).then(() => {
        this.sqlFind("passwords", "type = 'passwords'").then(passwords => {
          passwords.map(pass => {
            let decryptedData = this.decryptSqlData(pass.uuid, pass.data, cryptoPassword)
            if (this.state.passwords.find(item2 => item2.uuid == pass.uuid)) {
              return
            }
            else {
              this.setState(prevState => ({
                passwords: [...prevState.passwords, decryptedData]
              }))
            }
          })
        })
        }).then(resolve())
    }
      )
  })
    }


  convertToJson(string) {
    let eventData = JSON.parse(string)
    return eventData;
  }

  hasChangedOnServer = (idToCheck, timestampServer, dataset) => {
    for (let i = 0; i < dataset.length; i++) {
      let timestampLocal = dataset[i].doc.timestamp

      if (dataset[i].uuid === idToCheck && timestampServer !== timestampLocal) {
        //return false if already in local storage
        //UPDATE LOCAL DB
        return true

      } else {
      }
    }
  }

  async checkIfEventInLocalStorage(idToCheck) {
    try {
      await AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, (err, stores) => {

          for (let i = 0; i < stores.length; i++) {
            if (stores[i][0] === idToCheck) {
              //return false if already in local storage
              return false;
            }
          }
          //else return true 
          return true;
        });
      });
    } catch (error) {
      console.log(error)
      this.createToast("Connection error", "warning", 4000)
    }
  }
  notInLocalStorage = (idToCheck, dataset) => {
    for (let i = 0; i < dataset.length; i++) {
      if (dataset[i].uuid == idToCheck) {
        //return false if already in local storage
        return false;
      }
    }
    return true
  }

  isInServerStorage = (localData, serverData) => {
    //Check if all local data are also in server storage
    /*
    let arrayForDeletion = [] //Array to store old items
    for (let i=0; i<localData.length; i++) {
      for (let j=0; j<serverData.length; j++) {
        if (localData[i].uuid == serverData[j].uuid) {
          console.log("Found: " + localData[i].uuid)
          return true
        } else {
          if (i + 1 == serverData.length && )
          console.log("DELETED")
        }
      }
    }
      
    */
    let arrayForDeletion = [] //Array to store old items

    for (let i = 0; i < localData.length; i++) {

        if (serverData.find(item => item.uuid === localData[i].uuid)) {
        } else {
          this.deleteItemLocal(localData[i])
            //alert("Event was deleted")
            //NavigationService.navigate('EventListScreen')

            //Delete event from state


          }
        }
      }

  


  needUpdate = (data) => {
    return new Promise((resolve, reject) => {

    this.sqlFindSome(data.type, `uuid = '${data.uuid}'`).then(item => {
      resolve(isAfter(parseInt(data.updated), parseInt(item[0].updated))
      )
    })
  })
  }

  isPromiseFinished = (array) => {
    return new Promise((resolve, reject) => {

    for (let i=0; i<array.length; i++) {
      if (array[i] == false) {
        return false
      } else if (i+1 == array.length ) {
        resolve("DONE")
        return true
      }
  }
})

}

fetchEventsFromServer = () => {

  return new Promise((resolve, reject) => {
    let eventsLoaded = false
    let tasksLoaded = false
    let settingsLoaded = false
    let settingsListLoaded = false
    let settingsCalendarLoaded = false
    let settingsNotebookLoaded = false
    let settingsThemeLoaded = false
  this.sqlGetAll().then(dataSql => {

        const url = "http://localhost:3001/fetch/data";

        fetch(url,
          {
            method: 'GET',
            credentials: 'include',
          }).catch ((error) => {
            this.createToast("Connection error", "warning", 4000)
            console.log(error);
            reject()
          })
          
          .then(response => response.json())
          .catch ((error) => {
            this.createToast("Connection error", "warning", 4000)
            console.log(error);
            reject()
          })
          .then(
            data => {
              console.log(data)
              //this.isInServerStorage("noteId", dataSql.notes, data.notes)
            //  this.isInServerStorage("calendarId", dataSql.calendars, data.calendars)

           //   this.isInServerStorage("eventId", dataSql.events, data.events)
            //  this.isInServerStorage("taskId", dataSql.tasks, data.tasks)
              if (data.events.length > 0) {
                data.events.map((item, index) => {
                  this.isInServerStorage(dataSql.events, data.events)
                  //add only new data to local storage
                  if (this.notInLocalStorage(item.uuid, dataSql.events)) {

                    this.sqlInsert("events", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "events", item.shared, item.parrent, "false"])
                  } /*else {
                //Update local item if server side hash is different then local
                
                if (this.hasChangedOnServer(`eventId${oneEvent.uuid}`, oneEvent.hash, result.rows) ){
                  this.updateLocalData(`eventId${oneEvent.uuid}`, { "id": oneEvent.uuid, dateFrom: oneEvent.dateFrom, "data": oneEvent.event, hash: oneEvent.hash })
                }
              } */
              if (index + 1 == data.events.length) {
                eventsLoaded = true
                
              }
                })
              } else {
                eventsLoaded = true
                
              }
              
              data.calendars.map(item => {
                this.isInServerStorage(dataSql.calendars, data.calendars)

                //add only new data to local storage
                  if (this.notInLocalStorage(item.uuid, dataSql.calendars)) {
                    //this.saveeventsToLocal(`calendarId${oneCalendar.uuid}`, { "id": oneCalendar.uuid, "data": oneCalendar.data, "updated": oneCalendar.updated, "type": "calendar", "needSync": false })
                    this.sqlInsert("calendars", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "calendars", item.shared, item.parrent, "false"])
                  }
                })
              
                /* else {
              //Update local item if server side hash is different then local
              if (this.hasChangedOnServer(`calendarId${oneCalendar.uuid}`, oneCalendar.hash, result.rows) ){
                this.updateLocalData(`calendarId${oneCalendar.uuid}`, { "id": oneCalendar.uuid, "data": oneCalendar.calendar, hash: oneCalendar.hash })
              }
            } */

            if (data.tasks.length > 0) {
              this.isInServerStorage(dataSql.tasks, data.tasks)

              data.tasks.map((item, index) => {
                //add only new data to local storage
                if (this.notInLocalStorage(item.uuid, dataSql.tasks)) {

                  this.sqlInsert("tasks", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "tasks", item.shared, item.parrent, "false"])
                } else {
                  this.needUpdate(item).then(res => {
                    if (res) {

                      let querySql = `UPDATE ${item.type} SET data = '${item.data}', updated = '${item.updated}', needSync = 'false' WHERE uuid = '${item.uuid}'`
                      db.transaction(tx => {
                        tx.executeSql(
                          querySql,
                          [],
                          (tx, results) => {
                              let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                              this.updateStateData("tasks", decryptedData)
                            
                  
                           


                          }
                        )
                      })
                    }
                  })
                } /*else {
              //Check if stored item was changed on server
              if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
              }
            }
            */
           if (index + 1 == data.tasks.length) {
            tasksLoaded = true
  
          }
            })
          } else {
            {
              tasksLoaded = true
             
          }
        }
              data.lists.map((item, index) => {
                this.isInServerStorage(dataSql.lists, data.lists)

                //add only new data to local storage
                if (this.notInLocalStorage(item.uuid, dataSql.lists)) {

                  this.sqlInsert("lists", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "lists", item.shared, item.parrent, "false"])

                }  else {
                  this.needUpdate(item).then(res => {
                    if (res) {

                      let querySql = `UPDATE ${item.type} SET data = '${item.data}', updated = '${item.updated}', needSync = 'false' WHERE uuid = '${item.uuid}'`
                      db.transaction(tx => {
                        tx.executeSql(
                          querySql,
                          [],
                          (tx, results) => {
                            let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                            this.updateStateData("lists", decryptedData)


                          }
                        )
                      })
                    }
                  })
                }/*else {
              //Check if stored item was changed on server
              if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
              }
            }*/
          
              }

              )
              data.shared.tasks.map((item, index) => {
                this.isInServerStorage(dataSql.tasks, data.shared.tasks)

                let decryptedData
                //add only new data to local storage
             if (this.notInLocalStorage(item.uuid, dataSql.tasks)) {
              this.sqlInsert("tasks", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "tasks", item.shared, item.parrent, "false"])

            }
              else {
                this.needUpdate(item).then(res => {
                  if (res) {
            
                    let querySql = `UPDATE ${item.type} SET data = '${item.data}', updated = '${item.updated}', needSync = 'false' WHERE uuid = '${item.uuid}'`
                    db.transaction(tx => {
                      tx.executeSql(
                        querySql,
                        [],
                        (tx, results) => {

                          this.findPassword(item.parrent).then(passwordData => {
                            decryptedData = this.decryptSqlData(item.uuid, item.data, passwordData.password)
                            this.updateStateData("tasks", decryptedData)
                          })
                        


                        }
                      )
                    })
                  }
                })
              }
            
              })
              data.shared.lists.map((item, index) => {
                this.isInServerStorage(dataSql.lists, data.shared.lists)

                //add only new data to local storage
             if (this.notInLocalStorage(item.uuid, dataSql.tasks)) {
              this.sqlInsert("lists", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "lists", item.shared, item.parrent, "false"])

            } else {
              this.needUpdate(item).then(res => {
                if (res) {

                  let querySql = `UPDATE ${item.type} SET data = '${item.data}', updated = '${item.updated}', needSync = 'false' WHERE uuid = '${item.uuid}'`
                  db.transaction(tx => {
                    tx.executeSql(
                      querySql,
                      [],
                      (tx, results) => {
                        let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                        this.updateStateData("lists", decryptedData)


                      }
                    )
                  })
                }
              })
            } 
              })
              data.notes.map((item, index) => {
                this.isInServerStorage(dataSql.notes, data.notes)

                //add only new data to local storage
                if (this.notInLocalStorage(item.uuid, dataSql.notes)) {
                  this.sqlInsert("notes", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "notes", item.shared, item.parrent, "false"])

                } /*else {
              //Check if stored item was changed on server
              if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
              }
            }*/

              })
              data.notebooks.map((item, index) => {
                this.isInServerStorage(dataSql.notebooks, data.notebooks)

                //add only new data to local storage
                if (this.notInLocalStorage(item.uuid, dataSql.notebooks)) {
                  this.sqlInsert("notebooks", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "notebooks", item.shared, item.parrent, "false"])

                } /*else {
              //Check if stored item was changed on server
              if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
              }
            }*/

              })
             
              data.settings2.map((item, index) => {
                this.sqlFindSome("settings", `uuid = "${item.type}"`).then(data => {
                  if (data.length > 0) {
                   // this.sqlUpdate("settings", "calendar", [oneNote.uuid, oneNote.data, oneNote.updated, "notes", "false"])
                  } else {
  
                    this.sqlInsert("settings", "uuid, data, type, updated, needSync", [item.type, item.data, "settings", item.updated, "false"]).then(() => {
                      if (index == 4 ) {
                        settingsLoaded = true
            
                        setTimeout(() => {resolve("DONE PROMISE")}, 50)
        
                      }
                    })
  
                  }
                 
  
                })                  
                
  
        }
        )
          

      }
      ).catch ((error) => {
        //Error login
        this.sqlFind("settings").then(data => {
          if (data[0] != undefined) {
            this.createToast("Connection error", "warning", 4000)
            resolve()
          } else {
            this.setState({ isLoadingData: false })
            NavigationService.navigate('Error')
          }
        })
        .catch(error => {
          this.setState({ isLoadingData: false })
    
          this.createToast("Connection error", "warning", 4000)
    
          console.log(error)
          // Error retrieving data]
        })
          
        
        console.log(error);
      })

})

})

}



  
  decryptSqlData = (id, data, password) => {
    let decryptedData = JSON.parse(decryptData(data, password))
    let finalData = {...decryptedData, ...{"uuid": id}};
    return finalData
  }

  findPassword = (sharedItem) => {
    return new Promise((resolve, reject) => {
      this.state.passwords.map(passwordItem => {

          if(passwordItem.uuidShared == sharedItem) {

            resolve(passwordItem)
          }
      })
    })
  }

  getRepeated = (value, date, count) => {
    let result
    if (value == "day") {
      return addDays(date, count)
    } else if (value == "week") {
      return addWeeks(date, count)
    } else if (value == "month") {
      return addMonths(date, count)
    }
  }

  createNotification = (item) => {
    //Cancel any previous notification before creating new 
    PushNotification.cancelLocalNotifications({id: `${item.uuid.slice(0,9)}`});
    if (item.reminder && isFuture(item.reminder)) {
  
      PushNotification.localNotificationSchedule({
        id: `${item.uuid.slice(0,9)}`,
        //... You can use all the options from localNotifications
        message: item.text, // (required)
        date: new Date(item.reminder) // in 60 secs
      });
    } else {
      return
    }
  }
  
  fetchEventsFromLocal = (callback) => {
    return new Promise((resolve, reject) => {
      let eventsLoaded = false
      let tasksLoaded = false
      let settingsLoaded = false
    let today = new Date()
    let eventsCount = [];
    let tasksCount = [];
    this.sqlGetAllRaw().then(dataSql => {
      dataSql.forEach((item, index) => {
        if (item.type == "events") {
          let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
          this.createNotification(decryptedData)
   
           if (this.state.events.find(stateItem => stateItem.uuid == item.uuid)) {
             return
           }
           else {
             
             if (decryptedData.repeated) {
              console.log(decryptedData)
               for (let i=0; i<parseInt(decryptedData.repeated.count); i++) {
                 let newDecryptedData = {uuid: decryptedData.uuid, updated: decryptedData.updated, dateFrom: this.getRepeated(decryptedData.repeated.value, decryptedData.dateFrom, i).toString(), dateTill: this.getRepeated(decryptedData.repeated.value,decryptedData.dateTill, i).toString(), text: decryptedData.text, location: decryptedData.location, notes: decryptedData.notes, reminder: decryptedData.reminder, calendar: decryptedData.calendar, repeat: true, repeated: decryptedData.repeated}
                 console.log(newDecryptedData)
                 this.setState(prevState => ({
                   events: [...prevState.events, newDecryptedData]
                 }))
               }
             } else {
               this.setState(prevState => ({
                 events: [...prevState.events, decryptedData]
               }))
             }
           }


             } 
             else if (item.type == "tasks") {
              let decryptedData

              if (item.shared == "true") {
          
                this.findPassword(item.parrent).then(data => 
                  
                  decryptedData = this.decryptSqlData(item.uuid, item.data, data.password),
                 // this.createNotification(decryptedData)
          
                  )
                  .catch ((error) => {
                    console.log(error);
                  })
                  .then(() => {
                    if (this.state.tasks.find(stateItem => stateItem.uuid == item.uuid)) {
                      
                      return
                    }
                    else {
                      this.setState(prevState => ({
                        tasks: [...prevState.tasks, decryptedData]
                      }))
                    }
                  })
                  .catch ((error) => {
                    console.log(error);
                  })
                  
               
              } else {
                decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                this.createNotification(decryptedData)
          
                if (this.state.tasks.find(stateItem => stateItem.uuid == item.uuid)) {
                  this.state.tasks.map(stateItem => {
                    if (item.uuid == item.uuid) {
              
                      if (isAfter(parseInt(item.updated), parseInt(stateItem.updated))) {
                        //UPDATE STATE
                      this.updateStateData("tasks", decryptedData)
                      } else {
                        return
                      }
                    } 
                })
                } else {
                  this.setState(prevState => ({
                    tasks: [...prevState.tasks, decryptedData]
                  }))
                }
             }
             } else if (item.type == "calendars") {
              let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
              if (this.state.calendars.find(stateItem => stateItem.uuid == item.uuid)) {
                return
              }
              else {
                this.setState(prevState => ({
                  calendars: [...prevState.calendars, decryptedData]
                }))
              }
             } else if (item.type == "lists") {
              let decryptedData
              if (item.shared == "true") {
                this.findPassword(item.uuid).then(data => 
        
                  decryptedData = this.decryptSqlData(item.uuid, item.data, data.password)
                  ).catch ((error) => {
                    console.log(error);
                  })
                  .then(() => {
                    if (this.state.lists.find(stateItem => stateItem.uuid == item.uuid)) {
                      return
                    }
                    else {
                      this.setState(prevState => ({
                        lists: [...prevState.lists, decryptedData]
                      }))
                    }
                  })
                  .catch ((error) => {
                    console.log(error);
                  })        
             } else {
              decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
              if (this.state.lists.find(stateItem => stateItem.uuid == item.uuid)) {
                return
              }
              else {
                this.setState(prevState => ({
                  lists: [...prevState.lists, decryptedData]
                }))
              }
             }
            } else if (item.type == "notebooks") {
              let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
              if (this.state.notebooks.find(stateItem => stateItem.uuid == item.uuid)) {
                return
              }
              else {
                this.setState(prevState => ({
                  notebooks: [...prevState.notebooks, decryptedData]
                }))
              }
            } else if (item.type == "notes") {
              let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
      if (this.state.notes.find(stateItem => stateItem.uuid == item.uuid)) {
        return
      }
      else {
        this.setState(prevState => ({
          notes: [...prevState.notes, decryptedData]
        }))
      }
            } else if (item.type == "settings") {
              if (item.uuid == "defaultCalendar") {
                this.setState({ defaultCalendar: item.data})
              } else if (item.uuid == "defaultList") {
                this.setState({ defaultList: item.data})
              
              } else if (item.uuid == "defaultNotebook") {
                this.setState({ defaultNotebook: item.data})
        
              } else if (item.uuid == "theme") {
                this.setState({ darkTheme: item.data == "true" ? true : false })
        
              }  else if (item.uuid == "updated") {
                this.setState({ updated: item.updated })
        
              }
            }
            if (index + 1 == dataSql.length) {
              this.filterTasksOnLoad()
              this.filterNotebooksOnLoad()
              this.setState({ isLoadingData: false })
          resolve("DONE PROMISE")
            }
            
            //END LOOP
            })


           }).catch ((error) => {
            console.log(error);
          })


  })
  }

  async saveeventsToLocal(key, data) {
    // Save encrypted data to local storage
    try {

      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log(error)
      this.createToast("Connection error", "warning", 4000)
      // Error saving data
    }
  }
  async saveeventsToLocal(key, data) {
    // Save encrypted data to local storage
    try {

      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log(error)
      this.createToast("Connection error", "warning", 4000)
      // Error saving data
    }
  }

  triggerUpdate = (status) => {
    this.setState({ isUpdating: status })
  }

  saveEventAfterPost = async (key, data, stateData) => {
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


  async eventWasDeleted(key) {
    this.setState({
      events: this.state.events.filter(function (item) {
        return item.uuid !== key
      })
    })
    try {
      await AsyncStorage.removeItem(`eventId${key}`, (err) => {
        //alert("Event was deleted")
        //NavigationService.navigate('EventListScreen')

        //Delete event from state
        this.setDataToArray(new Date())
        this.createToast("Event deleted", "normal", 4000)


      })
    

    } catch (error) {
      // Error saving data
    }

  }

  
  findDefaultList = () => {
    let allLists = this.state.lists

    let defaultListId = this.state.defaultList
    allLists.map(list => {
      if (list.uuid == defaultListId.uuid) {
        this.setState({ tagName: list })

      }
    })
  }

  checkCalendar = (calendarId) => {
    let newCalendarArray = this.state.calendars.map((calendar, index) => {
      if (calendar.uuid === calendarId) {
        indexOfChange = index
        if (calendar.isChecked) {
          myCalendar = calendar
          return Object.assign({}, calendar, { isChecked: false })
        } else {
          myCalendar = calendar
          return Object.assign({}, calendar, { isChecked: true })
        }
      } else {
        return calendar
      }
    })
    this.setState({ calendars: newCalendarArray })


  }

  compareWords = (text, searchText) => {
    let wordsInText = text.split(" ");

    if (searchText.indexOf(" ") < 1) {
      for (let i = 0; i < wordsInText.length; i++) {
        if (wordsInText[i].slice(0, searchText.length).toLowerCase() === searchText.toLowerCase()) {
          return true
        }
      }
    } else {
      //split text in search to words
      let wordsInSearchText = searchText.split(" ");
      for (let i = 0; i < wordsInText.length; i++) {
        for (let j = 0; j < wordsInSearchText.length; j++) {
          if (wordsInText[i].slice(0, wordsInSearchText[j].length).toLowerCase() === wordsInSearchText[j].toLowerCase() && wordsInSearchText[j].length > 1) {
            return true
          }
        }
      }
    }

  }

  searchData = (text) => {
    //Search all stored data in state

    let allData = []

    let filteredEvents = this.state.events.filter(item => {
      return this.compareWords(item.text, text)
    })

    let sortedEvents = filteredEvents.sort((a, b) => {
      return (b.uuid - a.uuid)
    })

    let filteredTasks = this.state.tasks.filter(item => {
      return this.compareWords(item.text, text)
    })

    let sortedTasks = filteredTasks.sort((a, b) => {
      return (b.uuid - a.uuid)
    })

    let filteredNotes = this.state.notes.filter(item => {
      return this.compareWords(item.title, text)
    })

    let sortedNotes = filteredNotes.sort((a, b) => {
      return (b.uuid - a.uuid)
    })

    allData = allData.concat(sortedEvents).concat(sortedTasks).concat(sortedNotes)
    this.setState({ foundData: allData })
  }

  countNotificationsForToday = (item) => {

    //TODO - filter only events in future but today

    let today = new Date()

    if (isSameDay(item.dateFrom, today)) {
      eventsNotifications.push("event")
    }

    if (isSameDay(item.reminder, today)) {
      tasksNotifications.push("task")
    }

    /*
    let eventsNotifications = this.state.events.filter(event => {
      return isSameDay(event.dateFrom, today)
    })
  
    let tasksNotifications = this.state.tasks.filter(task => {
      return isSameDay(task.reminder, today)
    })
    console.log(today, eventsNotifications)
    */
    this.setState({ notificationsCountEvents: eventsNotifications.length, notificationsCountTasks: tasksNotifications.length })
    eventsCount = eventsNotifications.length
    tasksCount = tasksNotifications.length

  }



  async removeAll() {
    let keys = 'taskId7';
    await AsyncStorage.removeItem(keys, (err) => {
    });
  }

  changeDate = (targetDay) => {
    //Click on date changes selected date and push new events to array
    this.setState({
      selectedDate: targetDay,
    })
  };


  mapTags = (callback) => {
    let listsData = this.state.lists
    let tasks = this.state.tasks

    let listCount = []
    for (let i = 0; i < listsData.length; i++) {
      let listObj = { id: listsData[i].uuid, list: listsData[i].list, count: 0 }
      for (let j = 0; j < tasks.length; j++) {
        if (tasks[j].list == listsData[i].uuid) {
          listObj.count = listObj.count + 1
        }
      }

      listCount.push(listObj)
    }


    this.setState({ tagsData: listCount }, this.filterTasksOnLoad())
  }

  mapTagsOnDemand = (list) => {
    let listsData = this.state.lists
    let tasks = this.state.tasks
    let listCount = []
    for (let i = 0; i < listsData.length; i++) {
      let listObj = { id: listsData[i].uuid, list: listsData[i].list, count: 0 }
      for (let j = 0; j < tasks.length; j++) {
        if (tasks[j].list == listsData[i].uuid) {
          listObj.count = listObj.count + 1
        }
      }
      listCount.push(listObj)
    }


    this.setState({ tagsData: listCount }, this.filterTasksOnDemand(list))
  }

  triggerMarked = (markedId, task) => {
    let indexOfChange;
    let newTaskArray = this.state.tasks.map((task, index) => {
      if (task.uuid === markedId) {
        indexOfChange = index
        if (task.isChecked) {
          return Object.assign({}, task, { isChecked: false })
        } else {
          return Object.assign({}, task, { isChecked: true })
        }
      } else {
        return task
      }
    })
    //() => { this.editTask(newTaskArray[indexOfChange]) }
    this.setState({ tasks: newTaskArray }, this.filterTasksOnLoad())
  }

  findDefaultLista = () => {
    return new Promise((resolve, reject) => {
    this.state.lists.filter(list => {
      if (list.uuid == this.state.defaultList) {
        resolve(list)
      }
    })
  })
}

  filterTasksOnLoad = () => {
    if (this.state.tagName) {
      this.filterTasksOnDemand(this.state.tagName)
    } else {
      this.findDefaultLista().then(defaultList => {
        this.filterTasksOnDemand(defaultList)
      }
      )
    }

  }

  filterTasksOnDemand = (listObj) => {
    this.setState({ tagName: listObj })

  }
  filterNotebooksOnLoad = () => {
    if (this.state.notebookName) {
      this.filterNotebooksOnDemand(this.state.notebookName)
    } else {
      this.findDefaultNotebook().then(defaultNotebook => {
        this.filterNotebooksOnDemand(defaultNotebook)
      }
      )
    }
  }
  filterNotebooksOnDemand = (notebookObj) => {
    this.setState({ notebookName: notebookObj })
  }
  findDefaultNotebook = () => {
    return new Promise((resolve, reject) => {
      this.state.notebooks.filter(notebook => {
        if (notebook.uuid == this.state.defaultNotebook) {
          resolve(notebook)
        }
      })
    })
  }

  loadAppData = () => {

    //Load data only if password is correct
    this.isLogged()
    //this.fetchEventsFromLocal();  
  }


  clearCryptoPassword = () => {
    this.setState({       sqlLoaded: false,
      darkTheme: false,
      isLogged: "",
      isUpdating: false,
      user: "",
      username: "",
      cryptoPassword: "",
      status: '',
      updated: "",
      biometryType: null,
      accessControl: null,
      defaultCalendar: "",
      defaultList: "",
      defaultNotebook: "",
      events: [],
      notebooks: [],
      notebookName: "",
      notes: [],
      tasks: [],
      lists: [],
      shared: [],
      passwords: [],
      invites: [],
      filteredTasks: [],
      tagName: "",
      calendars: [],
      isLoadingData: false,
      dataForSearch: [],
      sharedLists: [],
      foundData: { foundEvents: [], foundTasks: [], foundNotes: [] },
      //Toast state
      toastIsVisible: false,
      toastType: "",
      toastText: "",
      toastDuration: "",
      //#############
      //Calendar state
      currentWeek: new Date(),
      currentDay: "",
      selectedDate: new Date(),
      testArray: [],
      selectedIndex: "",})
      this.sqlDelete().then(() => {
        this.isLogged()
  
      })
   

  }

  logUser = () => {
    this.setState({ isLoadingData: true })
    this.isLogged()
  }


  createToast = (toastText, toastType, toastDuration) => {
    this.setState({
      toastIsVisible: true,
      toastType: toastType,
      toastText: toastText,
      toastDuration: toastDuration
    }, () => this.hideToast())
    
  }

  hideToast = (timeout) => {
    setTimeout(() => { this.setState({ toastIsVisible: false }) }, 6000)
  }

  componentWillMount() {

    //Check if user is logged after opening app
    this.isLogged()
    
  }

  triggerDarkTheme = (themeValue) => {
      this.setState({ darkTheme: themeValue == "true" ? true : false })

      let timestamp = new Date().getTime()

    
      this.sqlUpdate("settings", `data = '${themeValue}', needSync = 'true'`, `uuid = 'theme'`).then(() => {
        
        // this.createToast(item.type + " edited", "normal", 4000)
       })
     this.updateServerDataSettings({type: "theme", data: themeValue, updated: timestamp})
  }

  removeOldEvent = (key) => {
    //Remove old event from state
    this.setState({
      events: this.state.events.filter(function (item) {
        return item.uuid !== key
      })
    })
  }

  removeAsync = async (key) => {
   
    try {
      await AsyncStorage.removeItem(key, (err) => {
      })
    } catch (error) {
      // Error saving data
    }
  }


  saveNewItem = async (data, stateData, type, toastText) => {
    // Save encrypted data to local storage
    if (type == "notes") {
      this.setState(prevState => ({
        notes: [...prevState.notes, stateData]
      }))
    } else if (type == "events") {
      if (stateData.repeated) {
        console.log(repeated)
        for (let i=0; i<parseInt(stateData.repeated.count); i++) {
          let newDecryptedData = {uuid: stateData.uuid, updated: stateData.updated, dateFrom: this.getRepeated(stateData.repeated.value, stateData.dateFrom, i).toString(), dateTill: this.getRepeated(stateData.repeated.value,stateData.dateTill, i).toString(), text: stateData.text, location: stateData.location, notes: stateData.notes, reminder: stateData.reminder, calendar: stateData.calendar, repeat: true, repeated: stateData.repeated}
          this.setState(prevState => ({
            events: [...prevState.events, newDecryptedData]
          }))
          this.createNotification(newDecryptedData)

        }
      } else {
        this.setState(prevState => ({
          events: [...prevState.events, stateData]
        }))
        this.createNotification(stateData)

      }

    } else if (type == "notebooks") {
      this.setState(prevState => ({
        notebooks: [...prevState.notebooks, stateData]
      }))
    } else if (type == "tasks") {
      this.createNotification(stateData)

     this.setState(prevState => ({
        tasks: [...prevState.tasks, stateData]
      }))
    }  else if (type == "lists") {
     this.setState(prevState => ({
        lists: [...prevState.lists, stateData]
      }))
      
    } else if (type == "calendars") {
      this.setState(prevState => ({
        calendars: [...prevState.calendars, stateData]
      }))
    }
    else if (type == "passwords") {
      this.setState(prevState => ({
        passwords: [...prevState.passwords, stateData]
      }))
    }
    this.sqlInsert(type, "uuid, data, updated, type, parrent, shared, isLocal, needSync", [data.uuid, data.data, data.updated, data.type, data.parrent, data.shared, "true", "true"]).then(() => {
      NetInfo.isConnected.fetch().then((isConnected) => {
        if (isConnected) {
    this.uploadOneLocalData(data)
        }
      })
    //if (type == "tasks") {
      //this.filterTasksOnDemand(this.state.tagName)
   // }
  })
    }
//gege
//kata
    uploadOneLocalData = async (data) => {
      //Load only one item when saving new data
          sendPostAsync(`http://localhost:3001/save/${data.type}`,data).then(() => 
                  this.sqlUpdate(data.type, "isLocal = 'false', needSync = 'false'", `uuid = '${data.uuid}'` )
                  ).catch ((error) => {
                    console.log(error);
                  })
    }
  
    uploadLocalData = async (callback) => {
      return new Promise((resolve, reject) => {

      this.sqlGetAllRaw("isLocal = 'true'").then(data => {
        if (data.length > 0) {
          data.map((item, index) => {
            this.uploadOneLocalData(item)
            if (index + 1 == data.length) {
              resolve()
            }
        })
        } else {
          resolve()
        }

    })
  })
    }   
    deleteOneOldData = async (data) => {
      //Load only one item when saving new data
         this.deleteServerData(data)
    }
  
    deleteOldData = async (callback) => {
      return new Promise((resolve, reject) => {

      this.sqlGetAllContent("deleted = 1").then(data => {
        if (data.length > 0) {
          data.map((item, index) => {
            this.deleteOneOldData(item)
            if (index + 1 == data.length) {
              resolve()
            }
        })
        } else {
          resolve()
        }

    })
  })
    }

  saveOnServer = async (dataType, dataObj, timestamp) => {
    sendPost("http://localhost:3001/save/note", 
      dataObj, () => {
      const baseUrl = "http://localhost:3001/fetch/id/";
      let type = dataType + "/" //data type
      let timestamp = "timestamp/" + dataObj.updated + "/"
      let encryptedString = "encryptedData/" + dataObj.data

      const url = baseUrl + type + timestamp + encryptedString
      fetch(url, 
      {method: 'GET',
      credentials: 'include',
      }).then(response => {
        response.json().then(id => {
          return Promise.resolve(id)
        })
      } 
       )
      }
    )}

fetchId = (dataType, dataObj,) => {
  return new Promise((resolve, reject) => {
    const baseUrl = "http://localhost:3001/fetch/id/";
    let type = dataType + "/" //data type
    let timestamp = "timestamp/" + dataObj.updated + "/"
    let encryptedData = "encryptedData/" + dataObj.data

  const url = baseUrl + type + timestamp + encryptedData
  fetch(url, 
  {method: 'GET',
  credentials: 'include',
  }).then(data => {
    resolve(data);
  })
})
}

replaceAsyncItem = async (itemKey, newItemKey, data) => {
  this.setAsync(newItemKey, data).then(() => {
    this.removeAsync(itemKey)
  })
}
updateLocalData = async (itemKey, data) => {
  try {
    await AsyncStorage.getItem(itemKey, (err) => {
      AsyncStorage.setItem(itemKey, data, (err) => {
      })
    })
  } catch (error) {
    console.log(error)
      this.createToast("Connection error", "warning", 4000)
    // Error saving data
  }
}
updateStateId = (myState, storeKey, newId) => {
  let data = this.state[myState];
  let index = data.findIndex(obj => obj.uuid == storeKey);
  data[index].uuid = newId;
  this.setState({data});
}

 

    updateStateData = (type, stateData) => {
      return new Promise((resolve, reject) => {
      let data = this.state[type];
      let index = data.findIndex(obj => obj.uuid == stateData.uuid);
      data[index] = stateData;
      this.setState({data}, resolve("saved"))
    })
    }
    updateServerData = (data) => {
        const url = "http://localhost:3001/edit/" + data.type
        sendPostAsync(url, {
          data
        }).then(() => {
          this.sqlUpdate(data.type, `needSync = 'false'`, `uuid = '${data.uuid}'`)
        }).catch((error) => {
          console.log(error)
        })
    }
    updateServerDataSettings = (data) => {
      const url = "http://localhost:3001/settings"
      sendPost(url, {
        data
      }, () => {
        //this.sqlUpdate(data.type, `needSync = 'false'`, `uuid = '${data.uuid}'`)
      }
  )
  }
    editItem = async(item, stateData) => {
      if (item.type == "tasks" || item.type == "events") {
        this.createNotification(stateData)
      }
      this.updateStateData(item.type, stateData).then(res => this.sqlUpdate(item.type, `data = '${item.data}', needSync = 'true', updated = '${item.updated}', parrent = '${item.parrent}'`, `uuid = '${item.uuid}'` ).then(() => {
        // this.createToast(item.type + " edited", "normal", 4000)
       }).then(() => {
        let toastText = item.type.slice(0,1).toUpperCase() + item.type.slice(1,-1)
        this.createToast(toastText + " saved", "normal", 4000)
         this.updateServerData(item)
       }))

      
    }

    deleteStateData = (type, uuidState) => {
      return new Promise((resolve, reject) => {
        let data = this.state[type];
        let index = data.findIndex(obj => obj.uuid == uuidState);
        let indexRepeat

        if (data[index] != undefined) {
          if (data[index].repeat) {
            let count = parseInt(data[index].repeated.count)

            for (let i=0; i<count; i++) {
              indexRepeat = data.findIndex(obj => obj.uuid == uuidState);
              data.splice(indexRepeat, 1)
            }
          } else {
            data.splice(index, 1)
  
          }
          }else {
            data.splice(index, 1)
  
          }
 
  
       
        this.setState({data}, resolve("saved"))
    })
    }

    deleteServerData = (data) => {
        const url = "http://localhost:3001/delete/" + data.type
        sendPostAsync(url, {
          data
        }).then(() => this.sqlDeleteItem(data.type, `uuid = '${data.uuid}'`)
        ).catch((error) => {
          this.setState({ isLoadingData: false })
          this.createToast("Connection error", "warning", 4000)
          console.log(error)
        })
      }

    deleteItem = (item) => {
      this.sqlUpdate(item.type, `deleted = 1, needSync = 'true', updated = '${item.updated}'`, `uuid = '${item.uuid}'` ).then(() => {
        this.deleteStateData(item.type, item.uuid)
        let toastText = item.type.slice(0,1).toUpperCase() + item.type.slice(1,-1)
        this.createToast(toastText + " deleted", "normal", 4000)
      }).then(() => {
       this.deleteServerData(item)
      })
    }
    deleteItemLocal = (item) => {
      //No need to delete on server
      this.sqlDeleteItem(item.type, `uuid = '${item.uuid}'`).then(() => {
        this.deleteStateData(item.type, item.uuid)
      }).then(() => {
      })
    }
    deleteParrent = (parrent, parrentTable, childTable) => {
      //First delete all child items
      this.sqlFindSome(childTable, `parrent == "${parrent.uuid}"`).then(childData => {
        childData.forEach(child => {
          this.deleteItem(child)
        })
        this.sqlFindSome(parrentTable, `uuid == "${parrent.uuid}"`).then(parrentData => {
         parrentData.forEach(parrent => {
          this.deleteItem(parrent)
         }) 
        })
        //ALERT when deleting default "parrent"
        //Reselect parrent view to default (default calendar...)
      })
    }
  

   refreshData = () => {
    return new Promise((resolve, reject) => {

     this.fetchEventsFromServer().then(() => {
      this.fetchEventsFromLocal().then(
        resolve()
      )
     })
    })
}

  sqlValuesCount = (valuesArray) => {
    let valuesCount = ""
    valuesArray.map((value, index) => {
      if (index +1 == valuesArray.length) {
        valuesCount = valuesCount + "?"
      } else {
        valuesCount = valuesCount + "?,"
      }
    })
    return valuesCount
  }

  sqlInsert = (table, columns, valuesArray) => {
    return new Promise((resolve, reject) => {

    let valusCount = this.sqlValuesCount(valuesArray)
    let querySql = `INSERT INTO ${table} (${columns}) VALUES (${valusCount})`

    db.transaction(tx => {
      tx.executeSql(
        querySql,
        valuesArray,
        (tx, results) => {
          resolve(results)
       
        }
      )
    })
  })
  }

  sqlDeleteItem = (table, values) => {
    return new Promise((resolve, reject) => {

      let querySql = `DELETE FROM ${table} WHERE ${values}`
     
      let data = []
      db.transaction(tx => {
        tx.executeSql(
          querySql,
          [],
          (tx, results) => {
           resolve()
           
          }
        );
      })
    })
  }

  sqlUpdate = (table, columns, condition) => {
    return new Promise((resolve, reject) => {

    let querySql = `UPDATE ${table} SET ${columns} WHERE ${condition}`
    db.transaction(tx => {
      tx.executeSql(
        querySql,
        [],
        (tx, results) => {
          resolve(results)
          
        }
      )
    })
  })
  }

  sqlDelete = () => {
    return new Promise((resolve, reject) => {

    let tables = ["events", "calendars", "notes", "notebooks", "lists", "tasks", "user", "settings"]
   
    tables.forEach((table, index) => {
      let querySql = `DELETE FROM ${table}`
      db.transaction(tx => {
        tx.executeSql(
          querySql,
          [],
          (tx, results) => {
            if (index == 7) {
              resolve()
            }
          }
        )
      })
    })
  })
  }

  sqlFind = (table, condition) => {
    return new Promise((resolve, reject) => {

    let querySql = `SELECT * FROM ${table}`
    if (condition) {
      querySql = querySql + ` WHERE ${condition}`
    }
    let data = []
    db.transaction(tx => {
      tx.executeSql(
        querySql,
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            for (let i=0; i<results.rows.length; i++) {
              data.push(results.rows.item(i))
              if (i + 1 == results.rows.length ) {
                resolve(data)
              }
            }
          } else {
            resolve([])
          }
         
        }
      );
    })
  })
  }
  sqlFindSome = (table, condition) => {
    return new Promise((resolve, reject) => {

    let querySql = `SELECT * FROM ${table} WHERE ${condition}`
    let data = []
    db.transaction(tx => {
      tx.executeSql(
        querySql,
        [],
        (tx, results) => {
          if (results.rows.length > 0) {
            for (let i=0; i<results.rows.length; i++) {
              data.push(results.rows.item(i))
              if (i + 1 == results.rows.length ) {
                resolve(data)
              }
            }
          } else {
            resolve([])
          }

        }
      );
    })
  })
  .catch ((error) => {
    console.log(error);
  })
  }
  sqlGetAll = (condition) => {
    return  new Promise((resolve, reject) => { 
    let data = {events: [], calendars: [], tasks: [], lists: [], notes: [], settings: []}

    let events = new Promise((resolve, reject) => {      
    this.sqlFind("events", condition).then(res => {resolve(res)})
    })
    let calendars = new Promise((resolve, reject) => {      
    this.sqlFind("calendars", condition).then(res => {resolve(res)})
    })
    let tasks = new Promise((resolve, reject) => { this.sqlFind("tasks", condition).then(res => {resolve(res)})
    })
    let lists = new Promise((resolve, reject) => { this.sqlFind("lists", condition).then(res => {resolve(res)})
    })
    let notebooks = new Promise((resolve, reject) => { this.sqlFind("notebooks", condition).then(res => {resolve(res)})
  })
    let notes = new Promise((resolve, reject) => { this.sqlFind("notes", condition).then(res => {resolve(res)})
    })
    let settings = new Promise((resolve, reject) => { this.sqlFind("settings").then(res => {resolve(res)})
    })
    
    Promise.all([events, calendars, tasks, lists, notebooks, notes, settings]).then(allData => { resolve({events: allData[0], calendars: allData[1], tasks: allData[2], lists: allData[3], notebooks: allData[4], notes: allData[5], settings: allData[6],})

  })})
}
sqlGetAllRaw = (condition) => {
  return  new Promise((resolve, reject) => { 
  
  data = []

  let events = new Promise((resolve, reject) => {      
  this.sqlFind("events", condition).then(res => {resolve(res)})
  })
  let calendars = new Promise((resolve, reject) => {      
  this.sqlFind("calendars", condition).then(res => {resolve(res)})
  })
  let tasks = new Promise((resolve, reject) => { this.sqlFind("tasks", condition).then(res => {resolve(res)})
  })
  let lists = new Promise((resolve, reject) => { this.sqlFind("lists", condition).then(res => {resolve(res)})
  })
  let notebooks = new Promise((resolve, reject) => { this.sqlFind("notebooks", condition).then(res => {resolve(res)})
})
  let notes = new Promise((resolve, reject) => { this.sqlFind("notes", condition).then(res => {resolve(res)})
  })
  let settings = new Promise((resolve, reject) => { this.sqlFind("settings", condition).then(res => {resolve(res)})
  })

  Promise.all([events, calendars, tasks, lists, notebooks, notes, settings]).then(allData => { allData.map(array => {
    array.map(item => {
      data.push(item)
    }) 
  })
}).then(() => resolve(data))
}) 
}
sqlGetAllContent = (condition) => {
  return  new Promise((resolve, reject) => { 
  
  data = []

  let events = new Promise((resolve, reject) => {      
  this.sqlFind("events", condition).then(res => {resolve(res)})
  })
  let calendars = new Promise((resolve, reject) => {      
  this.sqlFind("calendars", condition).then(res => {resolve(res)})
  })
  let tasks = new Promise((resolve, reject) => { this.sqlFind("tasks", condition).then(res => {resolve(res)})
  })
  let lists = new Promise((resolve, reject) => { this.sqlFind("lists", condition).then(res => {resolve(res)})
  })
  let notebooks = new Promise((resolve, reject) => { this.sqlFind("notebooks", condition).then(res => {resolve(res)})
})
  let notes = new Promise((resolve, reject) => { this.sqlFind("notes", condition).then(res => {resolve(res)})
  })

  Promise.all([events, calendars, tasks, lists, notebooks, notes]).then(allData => { allData.map(array => {
    array.map(item => {
      data.push(item)
    }) 
  })
}).then(() => resolve(data))
}) 
}
checkUpdates = () => {
  const url = "http://localhost:3001/check/updates";

  fetch(url,
    {
      method: 'GET',
      credentials: 'include',
    }).catch ((error) => {
      console.log(error);
    })
    
    .then(response => response.json())
    .catch ((error) => {
      console.log(error);
    })
    .then(
      data => {
        if (data.updated != this.state.updated) {
          this.refreshData()
        } else {
        }
      }
        )  
}

  componentDidMount () {
    //setTimeout(() => this.uploadLocalData(), 600)
    /*setTimeout(() =>       this.sqlGetAllRaw("isLocal = 'true'").then(data => {
      console.log(data)}), 2000)
    setTimeout(() => {
      this.sqlGetAll().then(dataSql => {
        console.log(dataSql)
      })
    }, 6000)

*/


      
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {

    const hadBeenAuthenticated = this.state.isLogged && this.state.cryptoPassword
    return this.state.isLoadingData == false
      ?
      (hadBeenAuthenticated
        ? (this.state.darkTheme
          ?<AppContainerDark
     
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
          navigation={this.props.navigation}
          screenProps={{
            //SQL
            sqlInsert: this.sqlInsert,
            sqlDelete: this.sqlDelete,
            sqlFind: this.sqlFind,
            passwords: this.state.passwords,
            findPassword: this.findPassword,
            invites: this.state.invites,
            //
            darkTheme: this.state.darkTheme,
            refreshData: this.refreshData,
            triggerDarkTheme: this.triggerDarkTheme,
            saveNewData: this.saveNewData,
            storeCryptoPasswordInState: this.storeCryptoPasswordInState,
            eventsCount: this.state.notificationsCountEvents,
            user: this.state.user,
            cryptoPassword: this.state.cryptoPassword,
            save: this.save,
            load: this.load,
            reset: this.reset,
            setCredentials: this.setCredentials,
            isLogged: this.isLogged,
            decryptedData: this.state.events,
            calendars: this.state.calendars,
            notes: this.state.notes,
            fetchEventsFromServer: this.fetchEventsFromServer,
            eventWasDeleted: this.eventWasDeleted,
            saveEventAfterPost: this.saveEventAfterPost,
            saveeventsToLocal: this.saveeventsToLocal,
            saveTaskAfterPost: this.saveTaskAfterPost,
            editEvent: this.editEvent,
            isLoadingData: this.state.isLoadingData,
            removeOldEvent: this.removeOldEvent,
            tasks: this.state.tasks,
            searchData: this.searchData,
            foundData: this.state.foundData,
            tagsData: this.state.tagsData,
            loadAppData: this.loadAppData,
            clearCryptoPassword: this.clearCryptoPassword,
            logUser: this.logUser,
            isUpdating: this.state.isUpdating,
            triggerUpdate: this.triggerUpdate,
            //Toast props
            toastIsVisible: this.state.toastIsVisible,
            toastType: this.state.toastType,
            toastText: this.state.toastText,
            toastDuration: this.state.toastDuration,
            createToast: this.createToast,
            hideToast: this.hideToast,
            //Calendar props
            currentWeek: this.state.currentWeek,
            currentDay: this.state.currentDay,
            selectedDate: this.state.selectedDate,
            changeDate: this.changeDate,
            dayData: this.state.dayData,
            weekDays: this.state.weekDays,
            index: this.state.index,
            weekIndex: this.state.weekIndex,
            selectedIndex: this.state.selectedIndex,
            setDataToArray: this.setDataToArray,
            defaultCalendar: this.state.defaultCalendar,
            checkCalendar: this.checkCalendar,
            calendars: this.state.calendars,
            loadMoreData: this.loadMoreData,
            events: this.state.events,
            //########x
            //TASKS
            editTask: this.editTask,
            filteredTasks: this.state.filteredTasks,
            mapTags: this.mapTags,
            tagName: this.state.tagName,
            filterTasksOnDemand: this.filterTasksOnDemand,
            filterTasksOnLoad: this.filterTasksOnLoad,
            triggerMarked: this.triggerMarked,
            lists: this.state.lists,
            defaultList: this.state.defaultList,
            findDefaultList: this.findDefaultList,
            //Notes
            notebooks: this.state.notebooks,
            saveNewItem: this.saveNewItem,
            editNote: this.editNote,
            editItem: this.editItem,
            deleteItem: this.deleteItem,
            filterNotebooksOnDemand: this.filterNotebooksOnDemand,
            filterNotebooksOnLoad: this.filterNotebooksOnLoad,
            findDefaultNotebook: this.findDefaultNotebook,
            defaultNotebook: this.state.defaultNotebook,
            notebookName: this.state.notebookName,
            deleteParrent: this.deleteParrent,
            findDefaultLista: this.findDefaultLista,
          }}
        >
        </AppContainerDark>
        : <AppContainer
     
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
        navigation={this.props.navigation}
        screenProps={{
          //SQL
          sqlInsert: this.sqlInsert,
          sqlDelete: this.sqlDelete,
          sqlFind: this.sqlFind,
          passwords: this.state.passwords,
          findPassword: this.findPassword,
          invites: this.state.invites,
          //
          darkTheme: this.state.darkTheme,
          refreshData: this.refreshData,
          triggerDarkTheme: this.triggerDarkTheme,
          saveNewData: this.saveNewData,
          storeCryptoPasswordInState: this.storeCryptoPasswordInState,
          eventsCount: this.state.notificationsCountEvents,
          user: this.state.user,
          cryptoPassword: this.state.cryptoPassword,
          save: this.save,
          load: this.load,
          reset: this.reset,
          setCredentials: this.setCredentials,
          isLogged: this.isLogged,
          decryptedData: this.state.events,
          calendars: this.state.calendars,
          notes: this.state.notes,
          fetchEventsFromServer: this.fetchEventsFromServer,
          eventWasDeleted: this.eventWasDeleted,
          saveEventAfterPost: this.saveEventAfterPost,
          saveeventsToLocal: this.saveeventsToLocal,
          saveTaskAfterPost: this.saveTaskAfterPost,
          editEvent: this.editEvent,
          isLoadingData: this.state.isLoadingData,
          removeOldEvent: this.removeOldEvent,
          tasks: this.state.tasks,
          searchData: this.searchData,
          foundData: this.state.foundData,
          tagsData: this.state.tagsData,
          loadAppData: this.loadAppData,
          clearCryptoPassword: this.clearCryptoPassword,
          logUser: this.logUser,
          isUpdating: this.state.isUpdating,
          triggerUpdate: this.triggerUpdate,
          //Toast props
          toastIsVisible: this.state.toastIsVisible,
          toastType: this.state.toastType,
          toastText: this.state.toastText,
          toastDuration: this.state.toastDuration,
          createToast: this.createToast,
          hideToast: this.hideToast,
          //Calendar props
          currentWeek: this.state.currentWeek,
          currentDay: this.state.currentDay,
          selectedDate: this.state.selectedDate,
          changeDate: this.changeDate,
          dayData: this.state.dayData,
          weekDays: this.state.weekDays,
          index: this.state.index,
          weekIndex: this.state.weekIndex,
          selectedIndex: this.state.selectedIndex,
          setDataToArray: this.setDataToArray,
          defaultCalendar: this.state.defaultCalendar,
          checkCalendar: this.checkCalendar,
          calendars: this.state.calendars,
          loadMoreData: this.loadMoreData,
          events: this.state.events,
          //########x
          //TASKS
          editTask: this.editTask,
          filteredTasks: this.state.filteredTasks,
          mapTags: this.mapTags,
          tagName: this.state.tagName,
          filterTasksOnDemand: this.filterTasksOnDemand,
          filterTasksOnLoad: this.filterTasksOnLoad,
          triggerMarked: this.triggerMarked,
          lists: this.state.lists,
          defaultList: this.state.defaultList,
          findDefaultList: this.findDefaultList,
          //Notes
          notebooks: this.state.notebooks,
          saveNewItem: this.saveNewItem,
          editNote: this.editNote,
          editItem: this.editItem,
          deleteItem: this.deleteItem,
          filterNotebooksOnDemand: this.filterNotebooksOnDemand,
          filterNotebooksOnLoad: this.filterNotebooksOnLoad,
          findDefaultNotebook: this.findDefaultNotebook,
          defaultNotebook: this.state.defaultNotebook,
          notebookName: this.state.notebookName,
          deleteParrent: this.deleteParrent,
          findDefaultLista: this.findDefaultLista,


        }}
      >
      </AppContainer>
        )
        : <AppContainerAnonym screenProps={{ isLogged: this.isLogged }}
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
        navigation={this.props.navigation}
        screenProps={{
          sqlInsert: this.sqlInsert,
          storeCryptoPasswordInState: this.storeCryptoPasswordInState,
          eventsCount: this.state.notificationsCountEvents,
          user: this.state.user,
          cryptoPassword: this.state.cryptoPassword,
          save: this.save,
          load: this.load,
          reset: this.reset,
          setCredentials: this.setCredentials,
          isLogged: this.isLogged,
          logUser: this.logUser,
          loadAppData: this.loadAppData,
          darkTheme: this.state.darkTheme,
            //Toast props
            toastIsVisible: this.state.toastIsVisible,
            toastType: this.state.toastType,
            toastText: this.state.toastText,
            toastDuration: this.state.toastDuration,
            createToast: this.createToast,
            hideToast: this.hideToast,
        }}
      />
      
      )

      : <AppContainerLoading 
      screenProps={{
        darkTheme: this.state.darkTheme,
      }}/>


  }
}