import React from "react";
//import "./Register.css";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableHighlight, Alert, TouchableNativeFeedback, TouchableWithoutFeedback, Button, TimePickerAndroid, DatePickerAndroid, Switch, Dimensions } from "react-native"
import { Keyboard } from 'react-native'
import CryptoJS from "crypto-js";
import { sendPost, hashForComparingChanges } from '../../functions.js';
import dateFns, { addHours, setMinutes, subMinutes, subHours, getYear, getMonth, getHours, getDate, isBefore, getMinutes } from "date-fns";
var PushNotification = require('react-native-push-notification');
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from "native-base";
import { encryptData } from '../../encryptionFunctions';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { HeaderIcon } from '../../customComponents.js';
import { createId } from '../../functions';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

import { AsyncStorage } from "react-native";
import "core-js/es6/weak-set";
var WeakSet = require('weakset');

<script src="http://localhost:8097"></script>

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



class Modal extends React.Component {
  render () {

    const wrapper = {
      display: "flex",
      position: "absolute",
      height: "100%",
      width: "100%", 
      backgroundColor: "rgba(27, 23, 37, 0.473)",
      justifyContent: "center",
      alignItems: "center"

    }

    const body = {
      padding: 20,
      backgroundColor: "#202526",
      display: "flex",
      width: (WIDTH / 3) * 2,
      height: (HEIGHT / 3 ),
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      elevation: 5,
    }

    const scroll = {
      width: "100%"
    }

    const textStyle = {
      color: "white",
      fontSize: 22,
      padding: 8
    }
    const data = this.props.data.map(item => {

      const colorDot = {
        height: 30,
        width: 30,
        borderRadius: 15,
        padding: 4,
        marginRight: 10,
      }
        return <TouchableNativeFeedback onPress={() => {this.props.selectCalendar(item)}}> 
        <View style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center" }}>
        <View style={colorDot}></View>
        <Text style={textStyle}>{item.calendar}</Text>
        </View>
        </TouchableNativeFeedback>
      })
    return (
      <View style={wrapper}>
      <View style={body}>
      <ScrollView style={scroll}>
      {data}
      </ScrollView>
      </View>
      </View>
    )
  }
}

class Event extends React.Component {
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
      reminderValue: {label: "5 minutes before", value: "5"},
      repeat: false,
      repeatValue: "month",
      repeatCount: {label: "two", value: "2"},
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
    this.saveEvent = this.saveEvent.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
    this.getEventId = this.getEventId.bind(this);


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
    return subMinutes(this.state.dateFrom, this.state.reminderValue.value);
  } else {
    return "";
  }
}

  convertToText() {

    let repeatedValue

    if (this.state.repeat) {
      repeatedValue = {value: this.state.repeatValue, count: this.state.repeatCount.value}
    }
  
    let eventReminder = this.getEventReminder();
    console.log(eventReminder)
    Keyboard.dismiss()
    let valueForEncryption = {dateFrom: this.state.dateFrom.toString(), dateTill: this.state.dateTill.toString(), text: this.state.text, location: this.state.location, notes: this.state.notes, reminder: eventReminder.toString(), calendar: this.props.selectedCalendar.uuid, repeat: this.state.repeat, repeated: repeatedValue, remindBefore: this.state.reminderValue, isFavourite: false}
    return valueForEncryption;
  }

  convertToJson(string) {
    let eventData = JSON.parse(string)
    return eventData;
  }

  saveEvent() {

    let dataForEncryption = JSON.stringify(this.convertToText());
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    let timestamp = new Date().getTime()
    let uuid = createId("events")

    this.props.saveNewItem({
      "uuid": uuid, "data": encryptedData, "updated": timestamp, "parrent": this.props.selectedCalendar.uuid, "shared": "", type: "events", "isLocal": "true", "needSync": "true" }, {"uuid": uuid, "dateFrom": this.state.dateFrom.toString(), "dateTill": this.state.dateTill.toString(), "uuid": uuid, "text": this.state.text, "location": this.state.location, "notes": this.state.notes, "reminder": this.getEventReminder(), "calendar": this.props.selectedCalendar.uuid, "updated": timestamp, repeat: this.state.repeat, remindBefore: this.state.reminderValue, isFavourite: false
      }, "events", "Event created")
      NavigationService.navigate('Calendar')

  
  }
  
  fetchEvents() {
    const url = "https://api.hideplan.com/fetch/events";
 
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

  finishSavingEvent = (createNotification, reloadView) => {

  }

  getEventId(encryptedData) {


    const url = "https://api.hideplan.com/fetch/event/id";
 
    fetch(url, 
      {method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(
        data =>

        this.props.saveEventAfterPost("eventId" + data.eventId, { "id": data.eventId, "data": encryptedData }, {"dateFrom": this.state.dateFrom.toString(), "dateTill": this.state.dateTill.toString(), "id": data.eventId, "text": this.state.text, "location": this.state.location, "notes": this.state.notes, "reminder": this.getEventReminder(), "calendar": this.props.selectedCalendar.uuid }),
        (this.finishSavingEvent(this.createNotification(this.state.text, this.getEventReminder()))),
        NavigationService.navigate('Calendar') 

         
      
      );
  }
  
 

  openModal = () => {
    this.state.modalIsOpen
    ? this.setState({ modalIsOpen: false })
    : this.setState({ modalIsOpen: true }, Keyboard.dismiss())
  }



  componentWillMount() {
    let formatedMinutes = setMinutes(new Date(), "00");
    let dateNow;
    let dateTill;
    if (this.props.dataFromAgenda) {
      dateNow = this.props.dataFromAgenda.date
      dateTill = addHours(dateNow, 1)
      this.setState({ dateFrom: dateNow, dateTill: dateTill })
    } else {
      dateNow = addHours(formatedMinutes, 1);
      dateTill = addHours(formatedMinutes, 2)
      this.setState({ dateFrom: dateNow, dateTill: dateTill })
    }
  }
  setMenuRefNotification = ref => {
    this._menuNotification = ref;
  };

  hideMenuNotification = () => {
    this._menuNotification.hide();
  };

  showMenuNotification = () => {
    Keyboard.dismiss()
    this._menuNotification.show();
  };
  selectNotification = (option) => {
    this.setState({ reminderValue: option})
    this.hideMenuNotification()
  }

  renderMenuNotification = () => {
    const options = [{label: "on start", value: "0"}, {label: "5 minutes before", value: "5"}, {label: "15 minutes before", value: "15"}, {label: "hour before", value: "60"}, {label: "6 hours before", value: "360"}, {label: "day before", value: "1440"}, {label: "week before", value: "10080"}]
    return (
      options.map(item => {

        return (
          <TouchableNativeFeedback onPress={() => this.selectNotification(item)}>
          <View style={{display: "flex", width: "100%", padding: 8}}>
          <Text 
            style={{color: "mintcream", fontSize: 20 }}> 
            {item.label}
            </Text>
            </View>
            </TouchableNativeFeedback>

        )
      })
    )
  }
  setMenuRefRepeatEvery = ref => {
    this._menuRepeatEvery = ref;
  };

  hideMenuRepeatEvery = () => {
    this._menuRepeatEvery.hide();
  };

  showMenuRepeatEvery = () => {
    Keyboard.dismiss()
    this._menuRepeatEvery.show();
  };
  selectRepeatEvery = (option) => {
    this.setState({ repeatValue: option})
    this.hideMenuRepeatEvery()
  }

  renderMenuRepeatEvery = () => {
    const options = [{label: "day", value: "day"}, {label: "week", value: "week"}, {label: "month", value: "month"}]
    return (
      options.map(item => {

        return (
          <TouchableNativeFeedback onPress={() => this.selectRepeatEvery(item.value)}>
          <View style={{display: "flex", width: "100%", padding: 8}}>
          <Text 
            style={{color: "mintcream", fontSize: 20 }}> 
            {item.label}
            </Text>
            </View>
            </TouchableNativeFeedback>

        )
      })
    )
  }
  setMenuRefRepeatCount = ref => {
    this._menuRepeatCount = ref;
  };

  hideMenuRepeatCount= () => {
    this._menuRepeatCount.hide();
  };

  showMenuRepeatCount = () => {
    Keyboard.dismiss()
    this._menuRepeatCount.show();
  };
  selectRepeatCount = (option) => {
    this.setState({ repeatCount: option})
    this.hideMenuRepeatCount()
  }

  renderMenuRepeatCount = () => {
    const options = [{label: "two", value: "2"}, {label: "three", value: "3"}, {label: "four", value: "4"}, {label: "five", value: "5"}, {label: "six", value: "6"}, {label: "seven", value: "7"}]
    return (
      options.map(item => {

        return (
          <TouchableNativeFeedback onPress={() => this.selectRepeatCount(item)}>
          <View style={{display: "flex", width: "100%", padding: 8}}>
          <Text 
            style={{color: "mintcream", fontSize: 20 }}> 
            {item.label}
            </Text>
            </View>
            </TouchableNativeFeedback>

        )
      })
    )
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
        autoFocus={true}
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
         <Ionicons name="md-time" size={24} color="#ffffff00"/>
         </View>
   
         <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }}>Remind me </Text>
   
         <View style={{paddingTop: 8, paddingBottom: 8 }}>
         <Menu
      ref={this.setMenuRefNotification}
      style={{ backgroundColor: "#373E40", elevation: 8,fontSize: 22, color: "mintcream"
    }}
    button={<Text style={{color: "dodgerblue", fontSize: 22}} onPress={() => this.showMenuNotification()}>{this.state.reminderValue.label}</Text>}
    >
    {this.renderMenuNotification()}
        </Menu>
         </View>
         </View> 
         

      : null
     }
      </View> 
      {/*
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
         <Ionicons name="md-time" size={24} color="#ffffff00"/>
         </View>
   
         <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#677477" }}>Schedule every </Text>
   
         <View style={{paddingTop: 8, paddingBottom: 8 }}>
         <Menu
      ref={this.setMenuRefRepeatEvery}
      style={{ backgroundColor: "#373E40", elevation: 8,fontSize: 22, color: "mintcream"
    }}
    button={<Text style={{color: "dodgerblue", fontSize: 22}} onPress={() => this.showMenuRepeatEvery()}>{this.state.repeatValue}</Text>}
    >
    {this.renderMenuRepeatEvery()}
        </Menu>
         </View>
         </View> 
         
         <View style={{ flexDirection: "row", borderBottomWidth: 0.4, borderBottomColor: "gray",}} >
   
      <View style={{paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>
      <Ionicons name="md-time" size={24} color="#ffffff00"/>

         </View>
   
         <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6,  alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#677477" }}>for </Text>
   
         <View style={{paddingTop: 8, paddingBottom: 8 }}>
         <Menu
      ref={this.setMenuRefRepeatCount}
      style={{ backgroundColor: "#373E40", elevation: 8,fontSize: 22, color: "mintcream"
    }}
    button={<Text style={{color: "dodgerblue", fontSize: 22}} onPress={() => this.showMenuRepeatCount()}>{this.state.repeatCount.label}</Text>}
    >
    {this.renderMenuRepeatCount()}
        </Menu>

         </View>
         <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6,  alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#677477" }}>times</Text>

         </View> 
         
         </View>

      : null
     }
      </View> 
      */
    }

    

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


export default class NewEventScreen extends React.Component {
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
    setMenuRef = ref => {
      this._menu = ref;
    };
  
    hideMenu = () => {
      this._menu.hide();
    };
  
    showMenu = () => {
      this._menu.show();
    };
    setData = () => {
      this.setState({ selectedCalendar: this.props.screenProps.calendars[0] })
    }
  
    waitForData = () => {
      this.props.screenProps.calendars.length > 0
      ? this.setData()
      : setTimeout(() => {this.waitForData()}, 400)
    }
    selectCalendar = (calendar) => {
      this.setState({ selectedCalendar: calendar})
      this.hideMenu()
    }

    renderMenuItems = () => {

     

      return (
        this.props.screenProps.calendars.map(item => {
          const colorDot = {
            height: 18,
            width: 18,
            borderRadius: 9,
            marginRight: 8,
            backgroundColor: item.color,
          }
    
          return (
            <TouchableNativeFeedback onPress={() => this.selectCalendar(item)}>
            <View style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", padding: 8}}>
              <View style={colorDot}>
              </View>
            <Text 
              style={{color: this.props.screenProps.darkTheme ? "white" : "black", fontSize: 20 }}> 
              {item.calendar}
              </Text>
              </View>
              </TouchableNativeFeedback>

          )
        })
      )
    }

    componentWillMount() {
      this.waitForData()
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
   androidStatusBarColor={darkTheme ? "#17191d" : "#F7F5F4"}
   >
     <Left>
    <HeaderIcon headerIcon="md-close" color={darkTheme ? "white" : "black"} headerFunction={() => {this.props.navigation.goBack(null)
    }}/>

      </Left> 
      <TouchableNativeFeedback onPress={() => this.showMenu()}>
     <Body>
     <Title style={{color: darkTheme ? "white" : "black"}}>New event</Title>
       {this.props.screenProps.calendars.length > 0 
      ?       <Menu
      ref={this.setMenuRef}
      style={{ backgroundColor: darkTheme ? "#373E40" : "#485154", elevation: 8,fontSize: 18, color: darkTheme ? "white" : "black"
    }}
    button={<Text style={{color: darkTheme ? "white" : "black"}} onPress={() => this.showMenu()}>{this.state.selectedCalendar.calendar}</Text>}
    >
     {this.renderMenuItems()}
    </Menu>
      : null
      }

        
     </Body>
     </TouchableNativeFeedback>
     <Right>
     <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {this.refs.NewEvent.saveEvent()
      }} />
     
     
       </Right>
  
    

</Header>
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: this.props.screenProps.darkTheme ? "#202124" : "#F7F5F4" }}>
      <Event ref="NewEvent"
      cryptoPassword={this.props.screenProps.cryptoPassword}
      dataFromAgenda={this.props.navigation.state.params}
      fetchEventsFromServer={this.props.screenProps.fetchEventsFromServer} 
      saveeventsToLocal={this.props.screenProps.saveEventsDataToLocal}
      saveEventAfterPost={this.props.screenProps.saveEventAfterPost}
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



module.exports = NewEventScreen;
