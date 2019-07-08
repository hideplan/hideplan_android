import React from "react";
//import "./Register.css";
import { StatusBar, View, Text, TextInput, StyleSheet, ScrollView, TouchableHighlight, Alert, TouchableNativeFeedback, TouchableWithoutFeedback, Button, TimePickerAndroid, DatePickerAndroid, Switch, Dimensions } from "react-native"
import { Keyboard } from 'react-native'
import CryptoJS from "react-native-crypto-js";
import { sendPost, hashForComparingChanges } from '../../functions.js';
import dateFns, { addHours, setMinutes, subMinutes, subHours, getYear, getMonth, getHours, getDate, isBefore, getMinutes } from "date-fns";
var PushNotification = require('react-native-push-notification');
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from "native-base";
import { encryptData } from '../../encryptionFunctions';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { HeaderIcon, Modal } from '../../customComponents.js';
import { createId } from '../../functions';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import { AsyncStorage } from "react-native";
import "core-js/es6/weak-set";
var WeakSet = require('weakset');

<script src="http://localhost:8097"></script>

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;




class EventIntput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      location: "",
      notes: "",
      date: "",
      datePickerFromIsVisible: false,
      datePickerTillIsVisible: false,
      dateFrom: "",
      dateTill: "",
      currentDate: "",
      pubkey:``,
      privkey: ``,
      passphrase: `testtest`,
      reminder: false,
      reminderValue: "5 minutes before",
      repeat: false,
      repeatValue: "",
      repeatCount: "",
      encryptedText: ``,
      decryptedText: ``,
      textFormValue: "",
      dataset: [],
      encryptedArray: [],
      decryptedArray: [],
      modalIsOpen: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.showDatePickerFrom = this.showDatePickerFrom.bind(this);
    this.showDatePickerTill = this.showDatePickerTill.bind(this);


  }


  showDatePickerFrom() {
    Keyboard.dismiss()
    this.state.datePickerFromIsVisible
    ? this.setState({ datePickerFromIsVisible: false})
    : this.setState({ datePickerFromIsVisible: true, datePickerTillIsVisible: false })
  }

  showDatePickerTill() {
    Keyboard.dismiss()
    this.state.datePickerTillIsVisible
    ? this.setState({ datePickerTillIsVisible: false })
    : this.setState({ datePickerTillIsVisible: true, datePickerFromIsVisible: false })
  }

  datePickerFrom = async() => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day,
        let newDateFrom = new Date(year, month, day, getHours(this.state.dateFrom), getMinutes(this.state.dateFrom))
        this.setState({ dateFrom: newDateFrom })

        if (isBefore(this.state.dateTill, newDateFrom)) {
          this.setState({ dateTill: addHours(newDateFrom, 1)})
        }
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }
  
  
  timePickerFrom = async() => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: getHours(this.state.dateFrom),
        minute: getMinutes(this.state.dateFrom), 
        is24Hour: true, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        let dateFrom = this.state.dateFrom
        let dateWithTimeFrom = new Date(getYear(dateFrom), getMonth(dateFrom), getDate(dateFrom), hour, minute)
        let dateWithTimeTill;
        if (isBefore(this.state.dateTill, dateWithTimeFrom)) {
          dateWithTimeTill = addHours(dateWithTimeFrom, 1)
          this.setState({ dateFrom: dateWithTimeFrom, dateTill: dateWithTimeTill })
        } else {
          this.setState({ dateFrom: dateWithTimeFrom })
        }
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  datePickerTill = async() => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let newDateTill = new Date(year, month, day, getHours(this.state.dateTill), getMinutes(this.state.dateTill))


        this.setState({ dateTill: newDateTill })
        if(isBefore(newDateTill, this.state.dateFrom)) {
          let newDateFrom = subHours(newDateTill, 1) 
          this.setState({ dateFrom: newDateFrom })
        }
      }
      

    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }
  
  
  timePickerTill = async() => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: getHours(this.state.dateTill),
        minute: getMinutes(this.state.dateTill),
        is24Hour: true, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        let oldDateTill = this.state.dateTill
        let dateWithTimeTill = new Date(getYear(oldDateTill), getMonth(oldDateTill), getDate(oldDateTill), hour, minute)

        this.setState({ dateTill: dateWithTimeTill })

        if (isBefore(dateWithTimeTill, this.state.dateFrom)) {
          this.setState({ dateFrom: subHours(dateWithTimeTill, 1) })
        }
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
    
  }
  toogleSwitchReminder = () => {
    this.state.reminder
    ? this.setState({ reminder: false })
    : this.setState({ reminder: true })  
  }

  toogleSwitchRepeat = () => {
    this.state.repeat
    ? this.setState({ repeat: false })
    : this.setState({ repeat: true })
  }

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({[name]: event.target.value});
  }

  getEventReminder = () => {if (this.state.reminder) {
    return subMinutes(this.state.dateFrom, this.state.reminderValue);
  } else {
    return "";
  }
}

  convertToText() {

    let repeatedValue

    if (this.state.repeat) {
      repeatedValue = {value: this.state.repeatValue, count: this.state.repeatCount}
    }
  
    let eventReminder = this.getEventReminder();
    Keyboard.dismiss()
    let valueForEncryption = {dateFrom: this.state.dateFrom.toString(), dateTill: this.state.dateTill.toString(), text: this.state.text, location: this.state.location, notes: this.state.notes, reminder: eventReminder.toString(), calendar: this.props.event.calendar, repeat: this.state.repeat, repeated: repeatedValue}
    return valueForEncryption;
  }

  convertToJson(string) {
    let eventData = JSON.parse(string)
    return eventData;
  }

  editEvent = () => {

    let dataForEncryption = JSON.stringify(this.convertToText());
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    let timestamp = new Date().getTime()

    this.props.editItem({
      "uuid": this.props.event.uuid, "data": encryptedData, "updated": timestamp, "parrent": this.props.event.calendar, "shared": "", type: "events", "isLocal": "true", "needSync": "true" }, {
        "dateFrom": this.state.dateFrom.toString(), "dateTill": this.state.dateTill.toString(), "uuid": this.props.event.uuid, "text": this.state.text, "location": this.state.location, "notes": this.state.notes, "reminder": this.getEventReminder(), "calendar": this.props.event.calendar, "updated": timestamp, repeat: this.state.repeat
      }, "events", "Event created")
      NavigationService.navigate('Calendar')

  
  }
  
  fetchEvents() {
    const url = "http://localhost:3001/fetch/events";
 
    fetch(url, 
      {method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(
        data =>
        {return}
      );
  }

  createNotification = (message, time) => {
    if (time) {
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        message: message, // (required)
        date: time // in 60 secs
      });
    } else {
      return
    }
  }


  
  componentWillMount () {
    this.setState({ 
      text: this.props.event.text,
      location: this.props.event.location,
      notes: this.props.event.notes,
      dateFrom: this.props.event.dateFrom,
      dateTill: this.props.event.dateTill,
      reminder: this.props.event.reminder,
      repeat: this.props.event.repeat,
      calendar: this.props.event.calendar
    })
  }

  componentDidMount () {
  }

  render() {
   

    return (
        <View style={{ flex: 1, width: "100%" }}>
          <View style={{ borderBottomWidth: 0.4, borderBottomColor: "gray", padding: 8 }} >
        <TextInput 
        placeholder="Title"
        placeholderTextColor={this.props.darkTheme ? "#C7D2D6" : "#677477"}
        autoFocus={false}
        value={this.state.text}
        style={{ fontSize: 28, paddingTop: 8, paddingBottom: 8, paddingLeft: 52, paddingRight: 20, color: this.props.darkTheme ? "white" : "black" }}
        onChangeText={(text) => this.setState({ text })} />
     
      </View>
      <View>
      <View style={{ flexDirection: "row", width: "100%", }}>

      <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center"}}>
      <Ionicons name="md-calendar" size={24} color="dodgerblue"/>
      </View>

      <TouchableNativeFeedback 
      onPress={() => { this.datePickerFrom() }}
      background={TouchableNativeFeedback.Ripple('gray', true)}
      >
      <Text style={{fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }} >{(this.state.dateFrom.toString()).slice(4,15)}</Text></TouchableNativeFeedback>

      <TouchableNativeFeedback 
      onPress={() => { this.timePickerFrom() }}
      background={TouchableNativeFeedback.Ripple('gray', true)}
      >
      <Text style={{fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: WIDTH / 4, paddingRight: 20, color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }}>{(this.state.dateFrom.toString()).slice(16,21)}</Text></TouchableNativeFeedback>
      </View>
      <View style={{ flexDirection: "row", width: "100%", borderBottomWidth: 0.4, borderBottomColor: "#90A3A8", }}>

      <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 38, paddingRight: 20, justifyContent: "center"}}>
      </View>

      <TouchableNativeFeedback 
      onPress={() => { this.datePickerTill() }}
      background={TouchableNativeFeedback.Ripple('gray', true)}
      >
      <Text style={{fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }} >{(this.state.dateTill.toString()).slice(4,15)}</Text></TouchableNativeFeedback>

      <TouchableNativeFeedback 
      onPress={() => { this.timePickerTill() }}
      background={TouchableNativeFeedback.Ripple('gray', true)}
      >
      <Text style={{fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: WIDTH / 4, paddingRight: 20, color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }}>{(this.state.dateTill.toString()).slice(16,21)}</Text></TouchableNativeFeedback>
      </View>

      </View>
  

      <View style={{flexDirection: "column", width: "100%", borderBottomWidth: 0.4, borderBottomColor: "#C7D2D6", }}>
   <View style={{ flexDirection: "row",}} >

   <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>
      <Ionicons name="md-notifications" size={24} color="dodgerblue"/>
      </View>

      <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }}>Notification</Text>

      <View style={{  paddingTop: 8, paddingBottom: 8, position: "absolute", right: WIDTH / 4 / 2,  }}>
      <Switch name="reminder" value={this.state.reminder} onValueChange={() => {this.toogleSwitchReminder() }}/>
      </View>
      </View> 
      {this.state.reminder
      ? 
      <View style={{ flexDirection: "row", borderBottomWidth: 0.4, borderBottomColor: "#C7D2D6",}} >
   
      <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>
         <Ionicons name="md-time" size={24} color="dodgerblue"/>
         </View>
   
         <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }}>Remind me</Text>
   
         <View style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: WIDTH / 4, }}>
        <Picker
        style={{ width: 220, paddingRight: 20, color: this.props.darkTheme ? "#C7D2D6" : "#2F3344"   }}
        selectedValue={this.state.reminderValue}
        onValueChange={(itemValue, itemIndex) => this.setState({reminderValue: itemValue})}>
        <Picker.Item label="On start" value="0" />
        <Picker.Item label="5 minutes before" value="5" />
        <Picker.Item label="15 minutes before" value="15" />
        <Picker.Item label="Hour before" value="60" />
        <Picker.Item label="6 hours before" value="360" />
        <Picker.Item label="Day before" value="1440" />
        <Picker.Item label="Week before" value="10080" />

      </Picker>
         </View>
         </View> 
         

      : null
     }
      </View> 

      <View style={{flexDirection: "column", width: "100%", borderBottomWidth: 0.4, borderBottomColor: "#C7D2D6", }}>
   <View style={{ flexDirection: "row",}} >

   <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>
      <Ionicons name="md-repeat" size={24} color="dodgerblue"/>
      </View>

      <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }}>Repeat</Text>

      <View style={{ paddingTop: 8, paddingBottom: 8, position: "absolute", right: WIDTH / 4 / 2,  }}>
      <Switch name="repeat" value={this.state.repeat} onValueChange={() => {this.toogleSwitchRepeat() }}/>
      </View>
      </View> 
      {this.state.repeat
      ? 
      <View>
      <View style={{ flexDirection: "row"}} >
   
      <View style={{paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>
         <Ionicons name="md-time" size={24} color="dodgerblue"/>
         </View>
   
         <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#677477" }}>Every</Text>
   
         <View style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: WIDTH / 2, }}>
        <Picker
        style={{ width: 220, paddingRight: 20, color: this.props.darkTheme ? "#C7D2D6" : "#2F3344"    }}
        selectedValue={this.state.repeatValue}
        onValueChange={(itemValue, itemIndex) => this.setState({repeatValue: itemValue})}>
        <Picker.Item label="day" value="day" />
        <Picker.Item label="week" value="week" />
        <Picker.Item label="2 weeks" value="15" />
        <Picker.Item label="month" value="month" />
        <Picker.Item label="3 months" value="360" />
 

      </Picker>
         </View>
         </View> 
         
         <View style={{ flexDirection: "row", borderBottomWidth: 0.4, borderBottomColor: "gray",}} >
   
      <View style={{paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>
      <Ionicons name="md-time" size={24} color="dodgerblue"/>

         </View>
   
         <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#677477" }}>How long</Text>
   
         <View style={{ paddingTop: 8, paddingLeft: WIDTH / 4, }}>
        <Picker
        style={{ width: 220, paddingRight: 20, color: this.props.darkTheme ? "#C7D2D6" : "#2F3344"    }}
        selectedValue={this.state.repeatCount}
        onValueChange={(itemValue, itemIndex) => this.setState({repeatCount: itemValue})}>
        <Picker.Item label="2" value="2" />
        <Picker.Item label="3" value="3" />
        <Picker.Item label="4" value="4" />
        <Picker.Item label="5" value="5" />
        <Picker.Item label="6" value="6" />
 

      </Picker>
         </View>
         </View> 
         
         </View>

      : null
     }
      </View> 

    

      <View style={{ borderBottomWidth: 0.4, borderBottomColor: "gray", flexDirection: "row"}} >
      <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center" }}>
      <Ionicons name="md-pin" size={24} color="dodgerblue"/>
      </View>
        <TextInput
        ref="locationInput"
        placeholder="Location"
        placeholderTextColor={this.props.darkTheme ? "#C7D2D6" : "#677477"}
        style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, color: this.props.darkTheme ? "white" : "black" }}
          onChangeText={(location) => this.setState({ location })}
          value={this.state.location}
          />
      </View>

      <View style={{ borderBottomWidth: 0.4, borderBottomColor: "gray", flexDirection: "row"}} >
      <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center" }}>
      <Ionicons name="md-create" size={24} color="dodgerblue"/>
      </View>
        <TextInput
        ref="notesInput"
        placeholder="Notes"
        placeholderTextColor={this.props.darkTheme ? "#C7D2D6" : "#677477"}
        multiline = {true}
        numberOfLines = {1}
        style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, color: this.props.darkTheme ? "white" : "black" }}
          onChangeText={(notes) => this.setState({ notes })}
          value={this.state.notes}
          />
      </View>
      </View>


    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    width: "100%",
    justifyContent: "flex-start"

  },
  input: {
    width: "100%",
    paddingLeft: "2%",
    paddingRight: "2%",
    borderWidth: 0.5,
    borderColor: "gray",
  },
  inputText: {
    fontSize: 20,
    color: "white"
  },
  optionsText: {
    fontSize: 20,
    color: "#929390"
  },
  picker: {
    padding: 0,
    margin: 0,
    width: "50%",
    alignSelf: 'center',
    alignItems: "center"


  }
})


export default class EditEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCalendar: "",
    };
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    }

   
    setData = () => {
      this.props.screenProps.calendars.map(item => {
        if (item.uuid == this.props.navigation.state.params.calendar) {
          this.setState({ selectedCalendar: item.calendar })
        }
      })
    }
  
    waitForData = () => {
      this.props.screenProps.calendars.length > 0
      ? this.setData()
      : setTimeout(() => {this.waitForData()}, 400)
    }

   

    componentWillMount() {
      this.waitForData()
    }
    deleteItem = () => {
      this.props.screenProps.deleteItem(this.props.navigation.state.params)
      NavigationService.navigate('Calendar')
    }
    deleteAlert = (eventName, func) => {
      Alert.alert(
        'Delete event',
        `Do you want to delete event "${eventName}"?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => {this.deleteItem()},
          }
          ],
      );
    }
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.darkTheme ? '#17191d' : "#F7F5F4",
      color: this.props.screenProps.darkTheme ? 'white' : "black",
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme
    

    return (
      <Container>
      <Header 
   style={headerStyle}
   >
         <StatusBar backgroundColor={darkTheme ? "#17191d" : "mintcream"} barStyle={darkTheme ? "light-content" : "dark-content"} />
     <Left>
    <HeaderIcon headerIcon="md-arrow-back" color={darkTheme ? "white" : "black"} headerFunction={() => {this.props.navigation.goBack(null)
    }}/>

      </Left> 
     <Body>
     <Title style={{color: darkTheme ? "white" : "black"}}>Edit event</Title>
      <Text style={{color: darkTheme ? "white" : "black"}}>{this.state.selectedCalendar}</Text>
     </Body>
     <Right>
     <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {this.refs.EventIntput.editEvent()
      }} />
      </Right>

</Header>
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: this.props.screenProps.darkTheme ? "#202124" : "#F7F5F4" }}>
      <EventIntput 
      ref="EventIntput"
      event={this.props.navigation.state.params}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      editItem={this.props.screenProps.editItem}
      calendars={this.props.screenProps.calendars}
      selectedCalendar={this.state.selectedCalendar}
      darkTheme={this.props.screenProps.darkTheme}
      saveNewItem={this.props.screenProps.saveNewItem}

      />
     
      </View>
      </Container>

    );
  }
}



module.exports = EditEventScreen;
