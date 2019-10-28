import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import { AppState, AsyncStorage, NativeModules, TouchableNativeFeedback } from "react-native"
import { BottomTabBar, createAppContainer } from "react-navigation";
import { NetInfo } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CalendarScreen from "./components/Calendar/Calendar"
import CalendarsSettingsScreen from "./components/Calendar/CalendarsSettings"
import NewCalendarScreen from "./components/Calendar/NewCalendar"
import EditCalendarScreen from "./components/Calendar/EditCalendar"
import LandingScreen from "./components/Landing/Landing"
import ErrorScreen from "./components/Error/Error"
import NotificationsScreen from "./components/Notifications/Notifications"

import LoginScreen from "./components/Login/Login"
import SettingsScreen from "./components/Settings/Settings"
import NewEventScreen from "./components/NewEvent/NewEvent"
import NotesScreen from "./components/Notes/Notes"
import NewNoteScreen from "./components/NewNote/NewNote"
import NewListScreen from "./components/Tasks/NewList"
import EditListScreen from "./components/Tasks/EditList"
import ListsSettingsScreen from "./components/Tasks/ListsSettings"

import EditTaskScreen from "./components/Tasks/EditTask"
import PropTypes from 'prop-types';
import SecuredScreen from "./components/Secured/Secured"

import NewNotebookScreen from "./components/Notes/NewNotebook"
import EditNotebookScreen from "./components/Notes/EditNotebook"
import NotebooksSettingsScreen from "./components/Notes/NotebooksSettings"

import LoadingScreen from "./components/Loading/Loading"

import NoteDetailsScreen from "./components/NoteDetails/NoteDetails"

import EditEventScreen from "./components/EditEvent/EditEvent"
import TasksScreen from "./components/Tasks/Tasks"
import SearchScreen from "./components/Search/Search"
import ChangePasswordScreen from "./components/Settings/ChangePassword"
import NotificationsSettingsScreen from "./components/Settings/NotificationsSettings"
import AboutSettingsScreen from "./components/Settings/AboutSettings"
import AppearanceSettingsScreen from "./components/Settings/AppearanceSettings"
import SecureSettingsScreen from "./components/Settings/SecureSettings"

import AccountSettingsScreen from "./components/Settings/AccountScreen"
import DataSettingsScreen from "./components/Settings/DataSettings"

import SetEncryptionScreen from "./components/Settings/SetEncryption"
import ConfirmEncryptionScreen from "./components/Register/ConfirmEncryption"
import RegisterNameScreen from "./components/Register/RegisterName"
import RegisterPasswordScreen from "./components/Register/RegisterPassword"
import RegisterEncryptionScreen from "./components/Register/RegisterEncryption"
import DeleteAccountScreen from "./components/Settings/DeleteAccount"
import { loadFromKeychain, decryptData, encryptData } from './encryptionFunctions';

import dateFns, { addMinutes, isAfter, isFuture, isSameDay, addDays, addWeeks, addMonths, subMinutes } from "date-fns";
import { parse } from "./functions";

import * as Keychain from 'react-native-keychain';
import { AppThemeState } from 'react-native';
import CryptoJS from "crypto-js";
import { sendPost, sendPostAsync } from './functions.js';
var PushNotification = require('react-native-push-notification');
import NavigationService from './NavigationService';
import { initialMode } from 'react-native-dark-mode';
import 'core-js/es6/symbol';
import { eventEmitter } from 'react-native-dark-mode'
import DarkMode from './theme';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import FingerprintScanner from 'react-native-fingerprint-scanner';
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



const ACCESS_CONTROL_OPTIONS = ['None', 'Passcode', 'Password'];
const ACCESS_CONTROL_MAP = [null, Keychain.ACCESS_CONTROL.DEVICE_PASSCODE, Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD, Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET]

// TODO: temporary storing notifications count for events and task for passing to bottom navigator


//border is lighter then label
"#777777"

const lightTheme = {primary: "#3f51b5",  primaryLight: "rgba(63, 81, 181, 0.20)", primaryText: "rgba(255,255,255, 0.87)", surface: "#FFFFFF", header: "#FFFFFF", ripple: "rgba(0,0,0 0.10)", modal: "#FFFFFF", text: "rgba(0, 0, 0, 0.87)", gray: "rgba(0, 0, 0, 0.60)", border: "rgba(0, 0, 0, 0.20)", snackbar: "#1f1f1f", reversePrimary: "#9fa8da" }

const darkTheme = {primary: "#9fa8da", primaryLight: "rgba(159, 168, 218, 0.20)", primaryText: "#141414", surface: "#121212", header: "#1f1f1f", ripple: "rgba(255,255,255, 0.10)", modal: "#282828", text: "rgba(255,255,255, 0.95)", gray: "rgba(255,255,255, 0.60)", border: "rgba(255,255,255, 0.10)", snackbar: "rgba(255,255,255, 0.95)", reversePrimary: "#3f51b5" }





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
let startRoute = "Tasks"
const activeTintLabelColorLight = lightTheme.primary
const inactiveTintLabelColorLight = lightTheme.gray;
const TabBar = ({ navigation }) => {
  const { routes } = navigation.state;
  const renderIcon = (routeName, isFocused) => {
    if (routeName == "Tasks") {
      return <Icon name={"checkbox-marked"} size={24} color={isFocused ? activeTintLabelColorLight : inactiveTintLabelColorLight} />
    } else if (routeName == "Calendar") {
      return <Icon name={"calendar-text"} size={24} color={isFocused ? activeTintLabelColorLight : inactiveTintLabelColorLight} />
    } else if (routeName == "Notes") {
      return <Icon name={"note"} size={24} color={isFocused ? activeTintLabelColorLight : inactiveTintLabelColorLight} />
    }
  }
  return (
    <View style={{backgroundColor: '#FFFFFF', flexDirection: 'row', height: 56,
  alignItems: 'center',
    justifyContent: 'center', borderTopColor: "#777777",
    borderTopWidth: 0.2,
  }}>
      {routes.map((route, index) => (

        <TouchableNativeFeedback
          onPress={() => navigation.navigate(route.routeName)}
          key={route.routeName}
          background={ TouchableNativeFeedback.Ripple(lightTheme.primary, true) }

        >   
        <View style={{ flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 56,
          flexDirection: "column",
          borderRadius: 4,}}>
                      {renderIcon(route.routeName, navigation.state.index == index)}

          <Text style={{fontFamily: "OpenSans-Bold", color: navigation.state.index == index ? activeTintLabelColorLight : inactiveTintLabelColorLight, fontSize: 14, position: "relative"}}>{route.routeName}</Text>

        </View>
        </TouchableNativeFeedback>
      ))}
    </View>
  );
};
const TabNavigator = createBottomTabNavigator(
  {
  Tasks: TasksScreen,
  Calendar: CalendarScreen,
  Notes: NotesScreen
},
{
  tabBarComponent: TabBar,
  initialRouteName: startRoute

},
{initialRouteName: startRoute},

{
    tabBarOptions: {
      activeTintColor: '#06e291',
      inactiveTintColor: '#C4C4C4',
      showIcon: false,
      labelStyle: {
        fontSize: 18,
        fontWeight: "bold"

      },
      initialRouteName: startRoute,
      style: {
        backgroundColor: '#3949ab',
        borderTop: "solid 0.1px #5E5E5E",
        borderTopColor: "#2B2B2B",
        borderTopWidth: 0.2,
        elevation: 8,
        justifyContent: "center",
        alignItems: "center",
        height: 56
      },
    },
  }
);
 
const activeTintDark = darkTheme.primary;
const inactiveTintDark = darkTheme.gray;

const TabBarDark = ({ navigation }) => {
  const { routes } = navigation.state;
  const renderIcon = (routeName, isFocused) => {
   if (routeName == "Tasks") {
      return <Icon name={"checkbox-marked"} size={24} color={isFocused ? activeTintDark : inactiveTintDark} />
    } else if (routeName == "Calendar") {
      return <Icon name={"calendar-text"} size={24} color={isFocused ? activeTintDark : inactiveTintDark} />
    } else if (routeName == "Notes") {
      return <Icon name={"note"} size={24} color={isFocused ? activeTintDark : inactiveTintDark} />
    }
  }
  return (
    <View style={{backgroundColor: darkTheme.header, flexDirection: 'row', height: 56,
    alignItems: 'center',
    justifyContent: 'center', 
  }}>
    
   

      {routes.map((route, index) => (

        <TouchableNativeFeedback
          onPress={() => navigation.navigate(route.routeName)}
          background={ TouchableNativeFeedback.Ripple(darkTheme.primary, true) }
          key={route.routeName}
          style={{borderRadius: 4, borderWidth: 1, borderColor: "transparent"}}
        >
          <View style={{ flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: 56,
          flexDirection: "column",
          borderRadius: 4,}}>
          {renderIcon(route.routeName, navigation.state.index == index)}
          <Text style={{color: navigation.state.index == index ? activeTintDark : inactiveTintDark, fontSize: 14,  fontFamily: 'OpenSans-Bold', includeFontPadding: false, }}>{route.routeName}</Text>

        </View>
        </TouchableNativeFeedback>
      ))}
    </View>
  );
};

//DARK
const TabNavigatorDark = createBottomTabNavigator(
  {
  Tasks: TasksScreen,
  Calendar: CalendarScreen,
  Notes: NotesScreen
  },
  {
    tabBarComponent: TabBarDark,
    initialRouteName:  startRoute,

  },
  {initialRouteName: startRoute},

  {
    tabBarOptions: {
      activeTintColor: '#06e291',
      inactiveTintColor: '#C4C4C4',
      showIcon: false,
      labelStyle: {
        fontSize: 18,
        fontWeight: "bold"

      },
      initialRouteName: startRoute,

      style: {
        borderTop: "solid 0.1px #5E5E5E",
        borderTopColor: "#2B2B2B",
        borderTopWidth: 0.2,
        elevation: 8,
        justifyContent: "center",
        alignItems: "center",
        height: 56
      },
    },
  }
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
    CalendarsSettings: {
      screen: CalendarsSettingsScreen,
    },
    NewEvent: {
      screen: NewEventScreen,
    },

    EditEvent: {
      screen: EditEventScreen,
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
    ListsSettings : {
      screen: ListsSettingsScreen
    },
    NewNotebook: {
      screen: NewNotebookScreen,
    },
    EditNotebook: {
      screen: EditNotebookScreen,
    },
    NotebooksSettings: {
      screen: NotebooksSettingsScreen,
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
    AccountSettings: {
      screen: AccountSettingsScreen,
    },
    DeleteAccount: {
      screen: DeleteAccountScreen,
    },
    NotificationsSettings: {
      screen: NotificationsSettingsScreen,
    },
    DataSettings: {
      screen: DataSettingsScreen,
    },
    AboutSettings: {
      screen: AboutSettingsScreen,
    },
    AppearanceSettings: {
      screen: AppearanceSettingsScreen,
    },
    SecureSettings: {
      screen: SecureSettingsScreen
    },
    Notifications: {
      screen: NotificationsScreen,
    },
    Error: {
      screen: ErrorScreen,
    },

  },
  {
    defaultNavigationOptions: {
      
    },
  },

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
    CalendarsSettings: {
      screen: CalendarsSettingsScreen,
    },
    NewEvent: {
      screen: NewEventScreen,
    },

    EditEvent: {
      screen: EditEventScreen,
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
    ListsSettings : {
      screen: ListsSettingsScreen
    },
    NewNotebook: {
      screen: NewNotebookScreen,
    },
    EditNotebook: {
      screen: EditNotebookScreen,
    },
    NotebooksSettings: {
      screen: NotebooksSettingsScreen,
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
    AccountSettings: {
      screen: AccountSettingsScreen,
    },
    DeleteAccount: {
      screen: DeleteAccountScreen,
    },
    NotificationsSettings: {
      screen: NotificationsSettingsScreen,
    },
    AboutSettings: {
      screen: AboutSettingsScreen,
    },
    DataSettings: {
      screen: DataSettingsScreen,
    },
    AppearanceSettings: {
      screen: AppearanceSettingsScreen,
    },
    SecureSettings: {
      screen: SecureSettingsScreen
    },
    Notifications: {
      screen: NotificationsScreen,
    },
    Error: {
      screen: ErrorScreen,
    },
  },      

  {
    cardStyle: {
      animation: "none",
      opacity: 1,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 0,  // Set the animation duration time as 0 !!
      },
    }),
  }

)
const LoadingStack = createStackNavigator({
  Loading: {
    screen: LoadingScreen,
  }
})
const LockedStack = createStackNavigator({
  Secured: {
    screen: SecuredScreen,
  }
}
)

const AppContainer = createAppContainer(StackNavigator);
const AppContainerDark = createAppContainer(StackNavigatorDark);
const AppContainerAnonym = createAppContainer(AnonymUserStack);
const AppContainerLoading = createAppContainer(LoadingStack);
const AppContainerSecured = createAppContainer(LockedStack);



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      timeInBackground: "",
      //Fingerprint lock
      isLocked: false,
      lockTimeout: "",
      useFingerprint: false,
      //
      sqlLoaded: false,
      darkTheme: false,
      themeSettings: "",
      primaryColor: "#00F798", //OLD GREEN LIGHTER "#06E292", //red E2315B
      version: "0.1.0",
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
      calendarView: "agenda",
      customCalendar: "2",
      timezone: "",
      initialRoute: "",
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
      isLoadingDataToast: false,
      //#############
      //Calendar state
      currentWeek: new Date(),
      currentDay: "",
      selectedDate: new Date(),
      testArray: [],
      selectedIndex: "",
      //##############
      updatesSettings: "",
      infoSettings: "",
      plansSettings: "",
      notificationsUpdate: "",
      notificationsInfo: "",
      colors: darkTheme,
      ///
      sqlItemRevert: "",
      stateItemRevert: "",


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
 
  getNotifications = () => {
    return new Promise((resolve, reject) => {

    const url = "https://api.hideplan.com/get/notifications";

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
          data.map((item, index) => {
            


            if (item.type == "update") {
              let newItem = item
              //Notification about recent update
              this.sqlFindSome("notifications", `uuid='${item.uuid}'`).then(data => {
                if (data.length > 0 ) {
                //This notification is already in local storage
                let oldItem = data[0]
                
                //First check if notification from server is newer than local version
                if (isAfter(parse(newItem.updated), parse(oldItem.updated))) {
                  //Replace older notification
                  this.sqlUpdate("notifications", `uuid = '${newItem.uuid}', status = 'new', updated = '${newItem.updated}', data = '${newItem.data}'`, `uuid = '${oldItem.uuid}'` ).then(() => {
                    this.setState({ notificationsUpdate: newItem })
                  })
                } else if (oldItem.status == "new") {
                  //Hide hidden notifications

                  this.setState({ notificationsUpdate: oldItem })
                }
                 else if (oldItem.status == "hidden") {
                }
                 } else {
                  //Insert notification to local storage if it is not there already
                  this.sqlInsert("notifications", "uuid, data, type, status, updated, needSync, isLocal", [newItem.uuid, newItem.data, newItem.type, "new", newItem.updated, "false", "false"])
                  this.setState({ notificationsUpdate: newItem })
                }
              }) 

              } else if (item.type == "info") {
                let newItem = item
                //Notification about recent update
                this.sqlFindSome("notifications", `uuid='${newItem.uuid}'`).then(data => {
                  if (data.length > 0 ) {
                  //This notification is already in local storage
                  let oldItem = data[0]
                  
                  //First check if notification from server is newer than local version
                  if (isAfter(parse(newItem.updated), parse(oldItem.updated))) {
                    //Replace older notification
                    this.sqlUpdate("notifications", `uuid = '${newItem.uuid}', status = 'new', updated = '${newItem.updated}', data = '${newItem.data}'`, `uuid = '${oldItem.uuid}'` ).then(() => {
                      this.setState({ notificationsInfo: newItem })
                    })
                  } else if (oldItem.status == "new") {
                    //Hide hidden notifications
  
                    this.setState({ notificationsInfo: oldItem })
                  } else if (oldItem.status == "hidden") {
                  }
                  } 
                   else {
                    //Insert notification to local storage if it is not there already
                    this.sqlInsert("notifications", "uuid, data, type, status, updated, needSync, isLocal", [newItem.uuid, newItem.data, newItem.type, "new", newItem.updated, "false", "false"])
                    this.setState({ notificationsInfo: newItem })
                  }
                }) 
  
                }  
              resolve()

            }

            )}
          )  
      })
  }

  hideNotification = (statusItem, item) => {
    this.sqlUpdate("notifications", `status = 'hidden'`, `uuid = '${item.uuid}'` ).then(() => {
      this.setState({ [statusItem]: "" })
    })
  }

  

  checkClientEncryption = () => {
    if (this.state.isLogged) {
      const url = "https://api.hideplan.com/encryption/check";

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
              NavigationService.navigate('ConfirmEncryption', { username: this.state.username, dummyEncryptionText: data.encryptionText.publickey, primaryColor:this.state.primaryColor })
            } else {
              this.setState({ isLoadingData: false })

              // Ask user to set encryption key for first time
              NavigationService.navigate('ConfirmEncryption', { username: this.state.username, dummyEncryptionText: null })
            }

          }
        ).catch(error => {
          console.log(error)
        })
    }

  }
  setCredentials = (myUsername, myPassword, callback) => {
    this.setState({ username: myUsername, encryptionPassword: myPassword }, callback())
  }


  checkFingerprintSettings = () => {

    this.sqlFindSome("settings", `uuid = 'useFingerprint'`).then((item => {
      if (item[0]) {
        if (item[0].data == "true") {
          this.setState({ isLocked: true })
        }
      }

    })
    )
  }

  storeCryptoPasswordInState = async (callBackIfNoCryptoPassword) => {
    //Load encryption password from keychain

    try {

      const credentials = await Keychain.getGenericPassword();

      if (credentials) {

        this.setState({ cryptoPassword: credentials.password })
              this.sqlFindSome("settings", "uuid = 'defaultCalendar'").then((item) => {
                //CHECK if there are data in local storage first
                if (item[0]) {
                  this.fetchEventsFromLocal().then(() => {
                    if (startRoute != this.state.initialRoute) {
                      NavigationService.navigate(this.state.initialRoute);
                    }

                    this.setState({ isLoadingData: false })
                    setTimeout(() => {this.refreshData()}, 1000)
                  })
                  } else {
                    //LOAD data from server
                    this.fetchEventsFromServer().then(() => {
                      this.fetchEventsFromLocal().then(() => {
                        
                        this.setState({ isLoadingData: false })
                      }).catch((error) => {
                        console.log(error)
                        this.setState({ isLoadingData: false })
          
                      })
                    }).catch((error) => {
                      console.log(error)
                      this.setState({ isLoadingData: false })
        
                    })
                }
              

            }).catch((error) => {
              console.log(error)
              this.setState({ isLoadingData: false })

            })

  
                      //this.interval = setInterval(() => {this.checkUpdates()}, 8000000)
                   

       
      

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
    }
  }
  async isLogged() {
    this.checkFingerprintSettings()

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


      console.log(error)
      // Error retrieving data]
    })
   
  }
  fetchInvites = () => {
    const url = "https://api.hideplan.com/fetch/invites";

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
      const url = "https://api.hideplan.com/fetch/passwords";

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
    }
  }
  notInLocalStorage = (idToCheck, dataset) => {
    if (dataset.length == 0) {
      return true
    } else {
      for (let i = 0; i < dataset.length; i++) {


        if (dataset[i].uuid == idToCheck) {
          //return false if already in local storage
    
          return false;
        } else {
          if (i +1 == dataset.length) {
            return true
  
          }
        }
      }
    }

    
  }


  needUpdate = (data) => {
    return new Promise((resolve, reject) => {

    this.sqlFindSome(data.type, `uuid = '${data.uuid}'`).then(item => {
      //REMOVE DOWN
      if (data.updated == "1571245679795") {
        resolve(false)
      } else {
        resolve(isAfter(parse(data.updated), parse(item[0].updated)))

      }
      //REMOVE UP
    })
    
  })
  }

  isInServerStorage = (localData, serverData) => {
    //Check if all local data are also in server storage

    let arrayForDeletion = [] //Array to store old items
    if (localData) {
      for (let i = 0; i < localData.length; i++) {
        if (serverData.find(item => item.uuid == localData[i].uuid)) {
        } else {
         // if (localData[i].isLocal !== "true") {
            this.deleteItemLocal(localData[i])

          //}

            //alert("Event was deleted")
            //NavigationService.navigate('EventListScreen')

            //Delete event from state


          }
        }
    } else { 
    }
   
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
        const url = "https://api.hideplan.com/fetch/data";

        fetch(url,
          {
            method: 'GET',
            credentials: 'include',
          }).catch ((error) => {
            console.log(error);
            reject()
          })
          
          .then(response => response.json())
          .catch ((error) => {
            console.log(error);
            reject()
          })
          .then(
            data => {

              //CHeck if local data have been loaded from storage
  
              if (data.events.length > 0) {
                data.events.map((item, index) => {
                  this.isInServerStorage(dataSql.events, data.events)
                  //add only new data to local storage
                  if (this.notInLocalStorage(item.uuid, dataSql.events)) {

                    this.sqlInsert("events", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "events", item.shared, item.parrent, "false"])
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
                                this.updateStateData("events", decryptedData)
                            }
                          )
                        })
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }
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
                  }else {
                    this.needUpdate(item).then(res => {
                      if (res) {
  
                        let querySql = `UPDATE ${item.type} SET data = '${item.data}', updated = '${item.updated}', needSync = 'false' WHERE uuid = '${item.uuid}'`
                        db.transaction(tx => {
                          tx.executeSql(
                            querySql,
                            [],
                            (tx, results) => {
                                let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                                this.updateStateData("calendars", decryptedData)
                              
                    
                             
  
  
                            }
                          )
                        })
                      }
                    }).catch(error => {
                      console.log(error)
                    })
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
                  }).catch(error => {
                    console.log(error)
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
                  }).catch(error => {
                    console.log(error)
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
                }).catch(error => {
                  console.log(error)
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
              }).catch(error => {
                console.log(error)
              })
            } 
              })
              data.notes.map((item, index) => {
                this.isInServerStorage(dataSql.notes, data.notes)

                //add only new data to local storage
                if (this.notInLocalStorage(item.uuid, dataSql.notes)) {
                  this.sqlInsert("notes", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "notes", item.shared, item.parrent, "false"])

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
                              this.updateStateData("notes", decryptedData)
                            
                  
                           


                          }
                        )
                      })
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }/*else {
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
                              this.updateStateData("notebooks", decryptedData)
                            
                  
                           


                          }
                        )
                      })
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }/*else {
              //Check if stored item was changed on server
              if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
              }
            }*/

              })
             
              data.settings2.map((item, index) => {

                this.sqlFindSome("settings", `uuid = "${item.type}"`).then(dataSettings => {
                  if (dataSettings > 0) {
                    if (index + 1 == data.settings2.length ) {
                      setTimeout(() => {resolve("DONE PROMISE")}, 50)
                    }
                   // this.sqlUpdate("settings", "calendar", [oneNote.uuid, oneNote.data, oneNote.updated, "notes", "false"])
                  } else {
  
                    this.sqlInsert("settings", "uuid, data, type, updated, needSync", [item.type, item.data, "settings", item.updated, "false"]).then(() => {
                      if (index + 1  == data.settings2.length ) {
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
            resolve()
          } else {
            this.setState({ isLoadingData: false })
          }
        })
        .catch(error => {
          this.setState({ isLoadingData: false })
    
    
          console.log(error)
          // Error retrieving data]
        })
          
        
        console.log(error);
      })

})

})

}

///Refresh function

refreshDataFromServer = () => {

  return new Promise((resolve, reject) => {
    let eventsLoaded = false
    let tasksLoaded = false
    let settingsLoaded = false
    let settingsListLoaded = false
    let settingsCalendarLoaded = false
    let settingsNotebookLoaded = false
    let settingsThemeLoaded = false
    

  this.sqlGetAll().then(dataSql => {
        const url = "https://api.hideplan.com/fetch/data";

        fetch(url,
          {
            method: 'GET',
            credentials: 'include',
          }).catch ((error) => {
            console.log(error);
            reject()
          })
          
          .then(response => response.json())
          .catch ((error) => {
            console.log(error);
            reject()
          })
          .then(
            data => {
              //this.isInServerStorage("noteId", dataSql.notes, data.notes)
            //  this.isInServerStorage("calendarId", dataSql.calendars, data.calendars)

           //   this.isInServerStorage("eventId", dataSql.events, data.events)
            //  this.isInServerStorage("taskId", dataSql.tasks, data.tasks)
            if (data.settings2.length > 0) {
    
  
              if (data.events) {
                this.isInServerStorage(dataSql.events, data.events)
              }
                data.events.map((item, index) => {
                  //add only new data to local storage
                  if (this.notInLocalStorage(item.uuid, dataSql.events)) {

                    this.sqlInsert("events", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "events", item.shared, item.parrent, "false"]).then(() => {
                      let newItem = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                      if (newItem.repeat.value) {
                        let stateData=newItem
                        for (let i=0; i<parseInt(stateData.repeatCount.value); i++) {
                          let newDateFrom = this.getRepeated(stateData.repeat.value, stateData.dateFrom, i).toString()
                          let newReminder = this.getEventReminder(stateData.reminder, newDateFrom, stateData.remindBefore)

                          //Create notification here

                
                          let newDecryptedData = {uuid: stateData.uuid, updated: stateData.updated, dateFrom: newDateFrom, dateTill: this.getRepeated(stateData.repeat.value,stateData.dateTill, i).toString(), 
                          allDay: stateData.allDay, timezone: stateData.timezone, text: stateData.text, location: stateData.location, notes: stateData.notes, reminder: newReminder, remindBefore: stateData.remindBefore, calendar: stateData.calendar, repeat: stateData.repeat, repeatCount: stateData.repeatCount}

                                       
                          if (newDecryptedData.reminder) {
                            this.createNotification(newDecryptedData)
                          }
                          this.setState(prevState => ({
                            events: [...prevState.events, newDecryptedData]
                          }))
                
                        }
                      } else {
                                                 
                        if (newItem.reminder) {
                          this.createNotification(newItem)
                        }
                        this.setState(prevState => ({
                          events: [...prevState.events, newItem]
                        }))
     
                      }
       
                    })
      

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
                                this.editNotification(decryptedData)
                                this.updateStateData("events", decryptedData)
                            }
                          )
                        })
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }
              if (index + 1 == data.events.length) {
                eventsLoaded = true
                
              }
                })
                if (data.calendars) {
                  this.isInServerStorage(dataSql.calendars, data.calendars)

                }

              data.calendars.map(item => {

                //add only new data to local storage
                  if (this.notInLocalStorage(item.uuid, dataSql.calendars)) {
                    //this.saveeventsToLocal(`calendarId${oneCalendar.uuid}`, { "id": oneCalendar.uuid, "data": oneCalendar.data, "updated": oneCalendar.updated, "type": "calendar", "needSync": false })
                    this.sqlInsert("calendars", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "calendars", item.shared, item.parrent, "false"]).then(() => {
                      let newItem = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                      this.setState(prevState => ({
                        calendars: [...prevState.calendars, newItem]
                      }))
                    })
                  }else {
                    this.needUpdate(item).then(res => {
                      if (res) {
  
                        let querySql = `UPDATE ${item.type} SET data = '${item.data}', updated = '${item.updated}', needSync = 'false' WHERE uuid = '${item.uuid}'`
                        db.transaction(tx => {
                          tx.executeSql(
                            querySql,
                            [],
                            (tx, results) => {
                                let decryptedData = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                                this.editNotification(decryptedData)
                                this.updateStateData("calendars", decryptedData)
                              
                    
                             
  
  
                            }
                          )
                        })
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  }
                })
              
                /* else {
              //Update local item if server side hash is different then local
              if (this.hasChangedOnServer(`calendarId${oneCalendar.uuid}`, oneCalendar.hash, result.rows) ){
                this.updateLocalData(`calendarId${oneCalendar.uuid}`, { "id": oneCalendar.uuid, "data": oneCalendar.calendar, hash: oneCalendar.hash })
              }
            } */

              if (data.tasks) {
                this.isInServerStorage(dataSql.tasks, data.tasks) 
              }
              if (data.tasks) {
                data.tasks.map((item, index) => {
                  //add only new data to local storage
         
                  if (this.notInLocalStorage(item.uuid, dataSql.tasks) === true) {
  
                    this.sqlInsert("tasks", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "tasks", item.shared, item.parrent, "false"]).then(() => {
                      let newItem = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)
                      this.setState(prevState => ({
                        tasks: [...prevState.tasks, newItem]
                      }))
                      if (newItem.reminder) {
                      }
                    })
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
                                this.editNotification(decryptedData)
                                this.updateStateData("tasks", decryptedData)
                              
                    
                             
  
  
                            }
                          )
                        })
                      }
                    }).catch(error => {
                      console.log(error)
                    })
                  } /*else {
                //Check if stored item was changed on server
                if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                  this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
                }
              }
              */
  
              })
              }
              
                if (data.lists) {
                  this.isInServerStorage(dataSql.lists, data.lists)

                }
              data.lists.map((item, index) => {

                //add only new data to local storage
                if (this.notInLocalStorage(item.uuid, dataSql.lists)) {

                  this.sqlInsert("lists", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "lists", item.shared, item.parrent, "false"]).then(() => {
                    let newItem = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)

                    this.setState(prevState => ({
                      lists: [...prevState.lists, newItem]
                    }))
                  })

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
                  }).catch(error => {
                    console.log(error)
                  })
                }/*else {
              //Check if stored item was changed on server
              if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
              }
            }*/
          
              }

              )
              {/*data.shared.tasks.map((item, index) => {
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
              })*/}
              if (data.notes) {
                this.isInServerStorage(dataSql.notes, data.notes)

              }
              data.notes.map((item, index) => {

                //add only new data to local storage
                if (this.notInLocalStorage(item.uuid, dataSql.notes)) {
                  this.sqlInsert("notes", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "notes", item.shared, item.parrent, "false"]).then(() => {
                    let newItem = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)

                    this.setState(prevState => ({
                      notes: [...prevState.notes, newItem]
                    }))
                  })

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
                              this.updateStateData("notes", decryptedData)
                            
                  
                           


                          }
                        )
                      })
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }/*else {
              //Check if stored item was changed on server
              if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
              }
            }*/

              })
              if (data.notebooks) {
                this.isInServerStorage(dataSql.notebooks, data.notebooks)

              }
              data.notebooks.map((item, index) => {

                //add only new data to local storage
                if (this.notInLocalStorage(item.uuid, dataSql.notebooks)) {
                  this.sqlInsert("notebooks", "uuid, data, updated, type, shared, parrent, needSync", [item.uuid, item.data, item.updated, "notebooks", item.shared, item.parrent, "false"]).then(() => {
                    let newItem = this.decryptSqlData(item.uuid, item.data, this.state.cryptoPassword)

                    this.setState(prevState => ({
                      notebooks: [...prevState.notebooks, newItem]
                    }))
                  })

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
                              this.updateStateData("notebooks", decryptedData)
                            
                  
                           


                          }
                        )
                      })
                    }
                  }).catch(error => {
                    console.log(error)
                  })
                }/*else {
              //Check if stored item was changed on server
              if (this.hasChangedOnServer(`taskId${oneTask.uuid}`, oneTask.hash, result.rows) ){
                this.updateLocalData(`taskId${oneTask.uuid}`, { "id": oneTask.uuid, "data": oneTask.task, hash: oneTask.hash })
              }
            }*/

              })
            
              data.settings2.map((item, index) => {

                this.sqlFindSome("settings", `uuid = "${item.type}"`).then(dataSettings => {
                  if (dataSettings > 0) {
                    if (index + 1 == data.settings2.length ) {
                      setTimeout(() => {resolve("DONE PROMISE")}, 50)
                    }
                      // this.sqlUpdate("settings", "calendar", [oneNote.uuid, oneNote.data, oneNote.updated, "notes", "false"])
                  } else {
  
                    this.sqlInsert("settings", "uuid, data, type, updated, needSync", [item.type, item.data, "settings", item.updated, "false"]).then(() => {
                      if (index + 1 == data.settings2.length ) {
                        settingsLoaded = true
            
                        setTimeout(() => {resolve("DONE PROMISE")}, 50)
        
                      }
                    })
  
                  }
                 
  
                })                  
                
  
        }
        )
          
      }
      }
      ).catch ((error) => {
        //Error login
        this.sqlFind("settings").then(data => {
          if (data[0] != undefined) {
            resolve()
          } else {
            this.setState({ isLoadingData: false })
          }
        })
        .catch(error => {
          this.setState({ isLoadingData: false })
    
    
          console.log(error)
          // Error retrieving data]
        })
          
        
        console.log(error);
      })
  
})

})

}
///

  
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
  cancelAllAlerts = () => {
    this.sqlFind("alerts").then(data => {
      if (data.length > 0) {
        data.forEach(item => {
          PushNotification.cancelLocalNotifications({id: item.id});
        })
      }
    })
  }
  editNotification = (item) => {
    this.removeAlert(item.uuid).then(() => {
      if (item.reminder) {
        this.createNotification(item)
      }
    })
  }

  cancelNotification = (alertId) => {
    return new Promise((resolve, reject) => {

    PushNotification.cancelLocalNotifications({id: alertId});
    this.sqlDeleteItem("alerts", `id="${alertId}"`).then(() => {
      resolve()
    })
  })

  }

  removeAlert = (itemId) => {
    return new Promise((resolve, reject) => {

    this.getNotification(itemId).then(data => {
      if (data.length>0) {
        let alertId = data[0].id
        this.cancelNotification(alertId).then(() => {
          resolve()
        })
        
      } else {
        resolve()
      }
    })
  })

  }

  getAlertId = () => {
    const getRandomInt = (min, max) => {
      var rand = min + Math.random() * (max + 1 - min);
      rand = Math.floor(rand);
      return rand;
    };
    
    const getRandomUInt32 = () => {
      const min = 0, max = 2147483647;
      return getRandomInt(min, max);
    };
    return getRandomUInt32().toString()
  }


  getNotification = (uuid) => {
    //Check for notification in storage
    return new Promise((resolve, reject) => {
    this.sqlFindSome("alerts", `uuid = "${uuid}"`).then(res => {
      if (res.length>0) {
        resolve(res)
      } else {
        resolve([])
      }
    }).catch(error => {
        console.log(error)
      })
  })
  }
  insertNotificationToDB = (id, item) => {
    return new Promise((resolve, reject) => {
    this.sqlInsert("alerts", "id, uuid, reminder, updated", [id, item.uuid, item.reminder, item.updated]).then(() => {
      resolve()
    }).catch(error => {
      console.log(error)
    })
    })
  }

  createNotification = (item) => {
    //New notification after saving event or task
    getType = () => {
      if (item.list) {
        return "Task: "
      } else if (item.calendar) {
        return "Event: "
      }
    }
    let alertId = this.getAlertId()
    let itemType = getType()
    if (item.reminder && isFuture(parse(item.reminder.toString()))) {
      //Create only alerts in future
      //Save id and uuid to DB to manage notifications later
      this.insertNotificationToDB(alertId, item).then(() => {
        //Finally, create notification

        PushNotification.localNotificationSchedule({
          id: alertId,
          message: itemType + item.text, // (required)
          date: new Date(item.reminder), // calculated alert fire
        });
      })
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

           if (this.state.events.find(stateItem => stateItem.uuid == item.uuid)) {
             return
           }
           else {

             if (decryptedData.repeat.value) {
              let stateData=decryptedData
              for (let i=0; i<parseInt(stateData.repeatCount.value); i++) {
                let newDateFrom = this.getRepeated(stateData.repeat.value, stateData.dateFrom, i).toString()
                let newReminder = this.getEventReminder(stateData.reminder, newDateFrom, stateData.remindBefore)
      
                let newDecryptedData = {uuid: stateData.uuid, updated: stateData.updated, dateFrom: newDateFrom, dateTill: this.getRepeated(stateData.repeat.value,stateData.dateTill, i).toString(), allDay: stateData.allDay, timezone: stateData.timezone, text: stateData.text, location: stateData.location, notes: stateData.notes, reminder: newReminder, remindBefore: stateData.remindBefore, calendar: stateData.calendar, repeat: stateData.repeat, repeatCount: stateData.repeatCount}
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
          
                if (this.state.tasks.find(stateItem => stateItem.uuid == item.uuid)) {
                  this.state.tasks.map(stateItem => {
                    if (item.uuid == item.uuid) {
              
                      if (isAfter(parse(item.updated), parse(stateItem.updated))) {
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
            } else if (item.type == "update") {
                //this.setState({ notificationsUpdate: item })
                //console.log("UPDATE  FETCH LOCAL")
              } else if (item.type == "settings") {
              if (item.uuid == "defaultCalendar") {
                this.setState({ defaultCalendar: item.data})
              } else if (item.uuid == "defaultList") {
                this.setState({ defaultList: item.data})
              
              } else if (item.uuid == "defaultNotebook") {
                this.setState({ defaultNotebook: item.data})
        
              } else if (item.uuid == "calendarView") {
                this.setState({ calendarView: item.data})
              } else if (item.uuid == "customCalendar") {
                this.setState({ customCalendar: item.data})
              } else if (item.uuid == "useFingerprint") {
                this.setState({ useFingerprint: item.data == "false" ? false : true })
              } else if (item.uuid == "lockTimeout") {
                this.setState({ lockTimeout: item.data })
              } else if (item.uuid == "timezone") {
                this.setState({ timezone: item.data})
              }
                else if (item.uuid == "initialRoute") {
                  this.setState({ initialRoute: item.data})
              } else if (item.uuid == "theme") {
                if (item.data == "system") {
      
                  this.setState({ darkTheme: DarkMode.currentMode == "dark" ? true : false, themeSettings: "System default" })
                  this.setState({ colors: DarkMode.currentMode == "dark" ? darkTheme : lightTheme })

                } else {
                  this.setState({ darkTheme: item.data == "dark" ? true : false, themeSettings: item.data == "dark" ? "Dark" : "Light"  })
                  this.setState({ colors: item.data == "dark" ? darkTheme : lightTheme })
                }
    
        
              } else if (item.uuid == "updatesSettings") {
                this.setState({ updatesSettings: item.data == "true" ? true : false })
        
              } else if (item.uuid == "infoSettings") {
                this.setState({ infoSettings: item.data == "true" ? true : false })
        
              } else if (item.uuid == "plansSettings") {
                this.setState({ plansSettings: item.data == "true" ? true : false })
        
              } else if (item.uuid == "updated") {
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
      // Error saving data
    }
  }
  async saveeventsToLocal(key, data) {
    // Save encrypted data to local storage
    try {

      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log(error)
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
        //alert(event was deleted")
        //NavigationService.navigate('EventListScreen')

        //Delete event from state
        this.setDataToArray(new Date())


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
  updateFoundData = (item) => {
    return new Promise((resolve, reject) => {
    let data = this.state.foundData;
    let index = data.findIndex(obj => obj.uuid == item.uuid);
    data[index] = item;
    data.splice(index, 1)

    this.setState({data}, resolve("saved"))
  })
  }
  countNotificationsForToday = (item) => {

    //TODO - filter only events in future but today

    let today = new Date()

    if (isSameDay(parse(item.dateFrom), parse(today))) {
      eventsNotifications.push("event")
    }

    if (isSameDay(parse(item.reminder), parse(today))) {
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
    this.cancelAllAlerts()
    this.setState({       sqlLoaded: false,
      darkTheme: true,
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
    }, () => toastDuration ? this.hideToast(toastDuration) : null)
  }

  hideToast = (timeout) => {
    setTimeout(() => { this.setState({ toastIsVisible: false }) }, timeout)
  }
  hideSnackbar = () => {
    this.setState({ toastIsVisible: false })
  }

  componentWillMount() {

    //Check if user is logged after opening app
    this.isLogged()

    
    
  }

  triggerTheme = (themeValue) => {

    if (themeValue == "system") {
      this.setState({ darkTheme: DarkMode.currentMode == "dark" ? true : false, themeSettings: "System default" })
      this.setState({ colors: DarkMode.currentMode == "dark" ? darkTheme : lightTheme })
  
    } else {
      this.setState({ darkTheme: themeValue == "dark" ? true : false, themeSettings: themeValue == "dark" ? "Dark" : "Light"  })
      this.setState({ colors: themeValue == "dark" ? darkTheme : lightTheme })
    }

      
      let timestamp = parse(new Date())

    
      this.sqlUpdate("settings", `data = '${themeValue}', needSync = 'true'`, `uuid = 'theme'`).then(() => {
       })
     this.updateServerDataSettings({type: "theme", data: themeValue, updated: timestamp})
  }

  triggerHomeSettings = (settingsName, settingsValue) => {
    let newValue
    if (settingsValue == "true" ||settingsValue == true && settingsValue != "false") {
      newValue = false
    } else {
      newValue = true
    }

    this.setState({ isUpdating: true, [settingsName]: newValue })
    let newSettingsName = settingsName.slice(0, settingsName.indexOf("Settings")) + "_settings"
    let timestamp = parse(new Date())

  
    this.sqlUpdate("settings", `data = '${newValue}', needSync = 'true'`, `uuid = '${settingsName}'`).then(() => {
      this.setState({ [settingsName]: newValue })
     })
   this.updateServerDataSettings2({type: `${newSettingsName}`, data: newValue, updated: timestamp}).then(() => {
    this.setState({ isUpdating: false })
  })
  }
  triggerSettings = (settingsName, settingsValue) => {
    let dbCol 
    if (settingsName == "calendarView") {
      dbCol = "calendar_view"
    } else if (settingsName == "initialRoute") {
      dbCol = "initial_route"
    } else if (settingsName == "customCalendar") {
      dbCol = "custom_calendar"
    }
    this.setState({ isUpdating: true, [settingsName]: settingsValue })
    let timestamp = parse(new Date())

    this.sqlUpdate("settings", `data = '${settingsValue}', needSync = 'true'`, `uuid = '${settingsName}'`).then(() => {
      this.setState({ [settingsName]: settingsValue })
     })
   this.updateServerDataSettings2({type: `${dbCol}`, data: settingsValue, updated: timestamp}).then(() => {
    this.setState({ isUpdating: false })
  })
  }
  triggerLocalSettings = (settingsName, settingsValue) => {
    let dbCol = settingsName

    let timestamp = parse(new Date())

    this.sqlUpdate("settings", `data = '${!settingsValue}', needSync = 'false'`, `uuid = '${settingsName}'`).then((data) => {
      this.setState({ [settingsName]: !settingsValue, isUpdating: false })
     })
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

  getRepeated = (value, date, count) => {
    let result
    if (value == "day") {
      return addDays(parse(date), count)
    } else if (value == "week") {
      return addWeeks(parse(date), count)
    } else if (value == "month") {
      return addMonths(parse(date), count)
    } else if (value == "year") {
      return addYears(parse(date), count)
    } 
  }
  getEventReminder = (reminder, dateFrom, reminderValue) => {
    if (reminder) {
      return subMinutes(parse(dateFrom), reminderValue.value);
    } else {
      return "";
    }
  };
  saveNewItem = async (data, stateData, type, toastText) => {
    // Save encrypted data to local storage

    if (type == "notes") {
      this.setState(prevState => ({
        notes: [...prevState.notes, stateData]
      }))
    } else if (type == "events") {



      if (stateData.repeat.value) {
 
        for (let i=0; i<parseInt(stateData.repeatCount.value); i++) {
          let newDateFrom = this.getRepeated(stateData.repeat.value, stateData.dateFrom, i).toString()
          let newReminder = this.getEventReminder(stateData.reminder, newDateFrom, stateData.remindBefore)

          let newDecryptedData = {uuid: stateData.uuid, updated: stateData.updated, dateFrom: newDateFrom, dateTill: this.getRepeated(stateData.repeat.value,stateData.dateTill, i).toString(), allDay: stateData.allDay, timezone: stateData.timezone, text: stateData.text, location: stateData.location, notes: stateData.notes, reminder: newReminder, remindBefore: stateData.remindBefore, calendar: stateData.calendar, repeat: stateData.repeat, repeatCount: stateData.repeatCount}

        if (stateData.reminder) {
        //Create repeated notification here with adjusted reminder
        this.createNotification(newDecryptedData)
        }


          this.setState(prevState => ({
            events: [...prevState.events, newDecryptedData]
          }))
        }
      } else {
        if (stateData.reminder) {
          //Create single notification
          this.createNotification(stateData)
        }
        this.setState(prevState => ({
          events: [...prevState.events, stateData]
        }))

      }

    } else if (type == "notebooks") {
      this.setState(prevState => ({
        notebooks: [...prevState.notebooks, stateData]
      }))
    } else if (type == "tasks") {
      if (stateData.reminder) {
        //Create single notification
        this.createNotification(stateData)
      }
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
      console.log(data)
    this.uploadOneLocalData(data)

    //if (type == "tasks") {
      //this.filterTasksOnDemand(this.state.tagName)
   // }
  })
    }
//gege
//kata
    uploadOneLocalData = async (data) => {
      //Load only one item when saving new data
          sendPostAsync(`https://api.hideplan.com/save/${data.type}`,data).then(() => 
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
         sendPost("https://api.hideplan.com/test/delete",
           {func: "deleteOneOldData", timestamp: new Date().toString(), device: "emu"}, () => {
         })
    }

    deleteOldData = async (callback) => {
      return new Promise((resolve, reject) => {

      this.sqlGetAllContent(`deleted='true'`).then(data => {
      
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
    sendPost("https://api.hideplan.com/save/note", 
      dataObj, () => {
      const baseUrl = "https://api.hideplan.com/fetch/id/";
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
    const baseUrl = "https://api.hideplan.com/fetch/id/";
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
        const url = "https://api.hideplan.com/edit/" + data.type
        sendPostAsync(url, {
          data
        }).then(() => {
          this.sqlUpdate(data.type, `needSync = 'false'`, `uuid = '${data.uuid}'`)
        }).catch((error) => {
          console.log(error)
        })
    }
    updateServerDataSettings = (data) => {
      const url = "https://api.hideplan.com/settings"
      sendPost(url, {
        data
      }, () => {
        //this.sqlUpdate(data.type, `needSync = 'false'`, `uuid = '${data.uuid}'`)
      }
  )
  }
  updateServerDataSettings2 = (data) => {
    return new Promise((resolve, reject) => {

    const url = "https://api.hideplan.com/settings2"
    sendPost(url, {
      data
    }, () => {
      //this.sqlUpdate(data.type, `needSync = 'false'`, `uuid = '${data.uuid}'`)
      resolve()
    }
)
  })
}
    editItem = async(item, stateData) => {
      if (item.type == "tasks" || item.type == "events") {
      }
      this.updateStateData(item.type, stateData).then(res => this.sqlUpdate(item.type, `data = '${item.data}', needSync = 'true', updated = '${item.updated}', parrent = '${item.parrent}'`, `uuid = '${item.uuid}'` ).then(() => {
        if (item.type == "lists") {
      this.filterTasksOnDemand(stateData)
        } else if (item.type == "notebooks") {
          this.filterNotebooksOnDemand(stateData)
        } else if (item.type == "tasks" || item.type == "events") {
          this.editNotification(stateData)
        }
       }).then(() => {
        let toastText = item.type.slice(0,1).toUpperCase() + item.type.slice(1,-1)
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
            let count = parseInt(data[index].repeatCount.value)

            for (let i=0; i<count; i++) {
              indexRepeat = data.findIndex(obj => obj.uuid == uuidState);
              data.splice(indexRepeat, 1)
              this.setState({data})
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
     
        const url = "https://api.hideplan.com/delete/" + data.type
        sendPostAsync(url, {
          data
        }).then(() => this.sqlDeleteItem(data.type, `uuid = '${data.uuid}'`).then(() => {}).catch((error) => {
          this.setState({ isLoadingData: false })
          console.log(error)
        }),
        sendPost("https://api.hideplan.com/test/delete",
          {func: "deleteServerData", timestamp: new Date().toString(), device: "emu"}, () => {
        })
        ).catch((error) => {
          this.setState({ isLoadingData: false })
          console.log(error)
        })
      }

    deleteItem = (item) => {
      this.sqlFindSome(item.type, `uuid = '${item.uuid}'`).then((item2 => {
        this.setState({ sqlItemRevert: item2[0], stateItemRevert: item })
      }))
      this.sqlUpdate(item.type, `deleted = 'true', needSync = 'true', updated = '${item.updated}'`, `uuid = '${item.uuid}'` ).then(() => {
        if (item.type == "tasks" || item.type == "events") {
          if (item.reminder) {
            this.removeAlert(item.uuid)
          }
        }

        this.deleteStateData(item.type, item.uuid).then(() => {
          this.deleteServerData(item)
         }).catch((error) => {
           console.log(error)
         })
      })
      .catch((error) => {
        console.log(error)
      })
    }

    reverteDelete = () => {
      let item = this.state.stateItemRevert
      let sqlItem = this.state.sqlItemRevert

      this.saveNewItem({
        "uuid": item.uuid, "data": sqlItem.data, "updated": sqlItem.updated, "parrent": sqlItem.parrent, "shared": sqlItem.shared, "type": sqlItem.type, "needSync": sqlItem.type}, item, item.type, "")
    }

    deleteItemLocal = (item) => {
     
      //No need to delete on server
      this.sqlDeleteItem(item.type, `uuid = '${item.uuid}'`).then(() => {
        this.deleteStateData(item.type, item.uuid)
      }).then(() => {
        if (item.type == "tasks" || item.type == "events") {
          if (item.reminder) {
            this.removeAlert(item.uuid)
          }        
        }
      })
    }
    
    deleteParrent = (parrent, parrentTable, childTable) => {
      //First delete all child items
      this.sqlFindSome(childTable, `parrent == "${parrent.uuid}"`).then(childData => {
        if (childData.length > 0) {
          childData.forEach((child, index) => {
            this.deleteItem(child)
            if (index + 1 == childData.length) {
              this.sqlFindSome(parrentTable, `uuid == "${parrent.uuid}"`).then(parrentData => {
                parrentData.forEach(parrent => {
                 this.deleteItem(parrent)
                }) 
               })
            }
          })
        } else {
          this.sqlFindSome(parrentTable, `uuid == "${parrent.uuid}"`).then(parrentData => {
            parrentData.forEach(parrent => {
             this.deleteItem(parrent)
            }) 
           })
        }

       
        //ALERT when deleting default "parrent"
        //Reselect parrent view to default (default calendar...)

       
    })
  }

  

   refreshData = () => {

    return new Promise((resolve, reject) => {
      this.deleteOldData().then(() => {
        this.uploadLocalData().then(() =>{this.refreshDataFromServer().then(() => {
          resolve()
      }).catch((error) => {
        reject()
    })
      }).catch((error) => {
        reject()
      })

    }).catch((error) => {
      reject()
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
   

    let tables = ["events", "calendars", "notes", "notebooks", "lists", "tasks", "user", "settings", "notifications", "passwords", "alerts"]
    tables.forEach((table, index) => {
      let querySql = `DELETE FROM ${table}`
      db.transaction(tx => {
        tx.executeSql(
          querySql,
          [],
          (tx, results) => {
            if (index == 10) {
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
    
    let data = []
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM ${table} WHERE ${condition}`,
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
  let notifications = new Promise((resolve, reject) => { this.sqlFind("notifications", condition).then(res => {resolve(res)})
  })
  Promise.all([events, calendars, tasks, lists, notebooks, notes, settings, notifications]).then(allData => { 

    allData.map((array, indexArray) => {
      if (array.length > 0) {
        array.map((item, indexItem) => {
          data.push(item)
          if (indexArray + 1 == allData.length) {
            if (indexItem + 1 == array.length) {

              resolve(data)
            }}})
      } else {
        if (indexArray + 1 == allData.length){
          resolve(data)
        }
      }

        }) 
})
}) 
}
sqlGetAllContent = (condition) => {
  return  new Promise((resolve, reject) => { 
  
  let data = []

  let events = new Promise((resolve, reject) => {      
  this.sqlFindSome("events", condition).then(res => {resolve(res)})
  })
  let calendars = new Promise((resolve, reject) => {      
  this.sqlFindSome("calendars", condition).then(res => {resolve(res)})
  })
  let tasks = new Promise((resolve, reject) => { this.sqlFindSome("tasks", condition).then(res => {resolve(res)})
  })
  let lists = new Promise((resolve, reject) => { this.sqlFindSome("lists", condition).then(res => {resolve(res)})
  })
  let notebooks = new Promise((resolve, reject) => { this.sqlFindSome("notebooks", condition).then(res => {resolve(res)})
})
  let notes = new Promise((resolve, reject) => { this.sqlFindSome("notes", condition).then(res => {resolve(res)})
  })

  Promise.all([events, calendars, tasks, lists, notebooks, notes]).then(allData => {

    allData.map((array, indexArray) => {
      if (array.length > 0) {
        array.map((item, indexItem) => {
          data.push(item)
          if (indexArray + 1 == allData.length) {
            if (indexItem + 1 == array.length) {
              resolve(data)
            }}})
      } else {
        if (indexArray + 1 == allData.length){
          resolve(data)
        }
      }

        }) 



    })

  /*
   
  */
})
}



checkUpdates = () => {
  const url = "https://api.hideplan.com/check/updates";

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

updateLockTimeout = (settingsValue) => {
  let timestamp = parse(new Date())

  this.sqlUpdate("settings", `data = '${settingsValue}', needSync = 'false'`, `uuid = 'lockTimeout'`).then((data) => {
    this.setState({ "lockTimeout": settingsValue, isUpdating: false })
   })
}

handleAppStateChange = (nextAppState) => {
  if (nextAppState === "inactive" || nextAppState === "background") {
    this.registerBackground()
  }
  if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
    if (this.state.useFingerprint && this.state.lockTimeout == 0) {
      this.setState({ isLocked: true })
    } else if (this.state.useFingerprint) {
      let timeBefore = addMinutes(parse(this.state.timeInBackground), parseInt(this.state.lockTimeout)) //16.22 => 16.52
      let timeForeground = parse(new Date()) //16.33 NO 16.54 lock
      if (isAfter(timeForeground, timeBefore)) {
        this.setState({ isLocked: true, timeInBackground: "" })
      }
    }
  }
  this.setState({appState: nextAppState});
}
registerBackground = () => {
  this.setState({ timeInBackground: new Date().toString() })
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
AppState.addEventListener('change', this.handleAppStateChange);





  }
  unlockApp = () => {
    this.setState({ isLocked: false })
  }
  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
    clearInterval(this.interval);
  }

  render() {
    const theme = {
      ...DefaultTheme,
      roundness: 4,
      dark: this.state.darkTheme,
      colors: {
        ...DefaultTheme.colors,
        primary: this.state.colors.primary,
        accent: '#f1c40f',
        text: this.state.colors.text,
      },
      fonts: {
        fontFamily: "OpenSans"
      }
    };
    const hadBeenAuthenticated = this.state.isLogged && this.state.cryptoPassword && this.state.defaultCalendar
    return this.state.isLoadingData == false
      ?
      (hadBeenAuthenticated
        ? (this.state.isLocked == true
          ? <AppContainerSecured 
          screenProps={{
            darkTheme: this.state.darkTheme,
            colors: this.state.colors,
            primaryColor: this.state.colors.primary,
            unlockApp: this.unlockApp
          }}
          />
        : (this.state.darkTheme == false
          ? <PaperProvider theme={theme}><AppContainer
     
        ref={navigatorRef => {
          NavigationService.setTopLevelNavigator(navigatorRef);
        }}
        navigation={this.props.navigation}
        screenProps={{
          isLocked: this.state.isLocked,
          useFingerprint: this.state.useFingerprint,
          lockTimeout: this.state.lockTimeout,
          updateLockTimeout: this.updateLockTimeout,
          triggerLocalSettings: this.triggerLocalSettings,
          //SQL
          sqlInsert: this.sqlInsert,
          sqlDelete: this.sqlDelete,
          sqlFind: this.sqlFind,
          passwords: this.state.passwords,
          findPassword: this.findPassword,
          invites: this.state.invites,
          cancelNotification: this.cancelNotification,
          triggerSettings: this.triggerSettings,
          initialRoute: this.state.initialRoute,
          //
          darkTheme: this.state.darkTheme,
          themeSettings: this.state.themeSettings,
          primaryColor: this.state.primaryColor,
          refreshData: this.refreshData,
          triggerTheme: this.triggerTheme,
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
          timezone: this.state.timezone,
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
          updateFoundData: this.updateFoundData,
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
          hideSnackbar: this.hideSnackbar,
          isLoadingDataToast: this.state.isLoadingDataToast,
          reverteDelete: this.reverteDelete,
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
          calendarView: this.state.calendarView,
          customCalendar: this.state.customCalendar,

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
          //SETTINGS 
          updatesSettings: this.state.updatesSettings,
          infoSettings: this.state.infoSettings,
          plansSettings: this.state.plansSettings,
          triggerHomeSettings: this.triggerHomeSettings,
          notificationsUpdate: this.state.notificationsUpdate,
          notificationsInfo: this.state.notificationsInfo,
          hideNotification: this.hideNotification,
          version: this.state.version,
          colors: this.state.colors,
        }}
      >
      </AppContainer></PaperProvider>
      : <PaperProvider theme={theme}><AppContainerDark
      ref={navigatorRef => {
        NavigationService.setTopLevelNavigator(navigatorRef);
      }}
      navigation={this.props.navigation}
      screenProps={{
        isLocked: this.state.isLocked,
        useFingerprint: this.state.useFingerprint,
        lockTimeout: this.state.lockTimeout,
        updateLockTimeout: this.updateLockTimeout,
        triggerLocalSettings: this.triggerLocalSettings,
        //SQL
        sqlInsert: this.sqlInsert,
        sqlDelete: this.sqlDelete,
        sqlFind: this.sqlFind,
        passwords: this.state.passwords,
        findPassword: this.findPassword,
        invites: this.state.invites,
        cancelNotification: this.cancelNotification,

        //
        triggerSettings: this.triggerSettings,
        initialRoute: this.state.initialRoute,
        darkTheme: this.state.darkTheme,
        themeSettings: this.state.themeSettings,
        primaryColor: this.state.primaryColor,
        refreshData: this.refreshData,
        triggerTheme: this.triggerTheme,
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
        timezone: this.state.timezone,
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
        updateFoundData: this.updateFoundData,
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
        hideSnackbar: this.hideSnackbar,
        isLoadingDataToast: this.state.isLoadingDataToast,
        reverteDelete: this.reverteDelete,

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
        calendarView: this.state.calendarView,
        customCalendar: this.state.customCalendar,
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
        //SETTINGS 
        updatesSettings: this.state.updatesSettings,
        infoSettings: this.state.infoSettings,
        plansSettings: this.state.plansSettings,
        triggerHomeSettings: this.triggerHomeSettings,
        notificationsUpdate: this.state.notificationsUpdate,
        notificationsInfo: this.state.notificationsInfo,
        hideNotification: this.hideNotification,
        version: this.state.version,
        colors: this.state.colors,
      }}
    >
    </AppContainerDark></PaperProvider>
        )
        )
        : <PaperProvider><AppContainerAnonym screenProps={{ isLogged: this.isLogged }}
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
          primaryColor: this.state.primaryColor,
          defaultCalendar: this.state.defaultCalendar,
            //Toast props
            toastIsVisible: this.state.toastIsVisible,
            toastType: this.state.toastType,
            toastText: this.state.toastText,
            toastDuration: this.state.toastDuration,
            createToast: this.createToast,
            hideToast: this.hideToast,
            colors: this.state.colors,

        }}
      />
      </PaperProvider>
      )

      : <AppContainerLoading 
      screenProps={{
        darkTheme: this.state.darkTheme,
        colors: this.state.colors,
        primaryColor: this.state.colors.primary,
      }}/>


  }
}