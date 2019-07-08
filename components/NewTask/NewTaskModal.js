import React from "react";
//import "./Register.css";
import { View, Text, TextInput, StyleSheet, TouchableHiglight, Alert, Picker, TouchableNativeFeedback, Button, TimePickerAndroid, DatePickerAndroid, Switch, Dimensions, TouchableWithoutFeedback, ScrollView } from "react-native"
import { Keyboard } from 'react-native'
import { sendPost, hashForComparingChanges } from '../../functions.js';
import dateFns, {getYear, getDate, getMonth, addHours, addDays, setMinutes, subMinutes, getHours, getMinutes } from "date-fns";
var PushNotification = require('react-native-push-notification');
import NavigationService from '../../NavigationService.js';
import { List, ListItem,} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { encryptData, encryptDataPromise } from '../../encryptionFunctions';
import {BottomSheet} from '../../bottomSheet.js';
import { createId } from '../../functions';

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
      fontSize: 18,
      padding: 4
    }

    const data = this.props.data.map(item => {

    const colorDot = {
      height: 10,
      width: 10,
      borderRadius: 5,
      color: item.color
    }
      return <TouchableNativeFeedback onPress={() => {this.props.selectList(item)}}> 
      <View style={{display: "flex", flexDirection: "row", width: "100%" }}>
      <View style={colorDot}></View>
      <Text style={textStyle}>{item.list}</Text>
      </View>
      </TouchableNativeFeedback>
    })
    return (
      <TouchableWithoutFeedback onPress={() => {this.props.openModal()}}>
      <View style={wrapper}>
      <View style={body}>
      <ScrollView style={scroll}>
      {data}
      </ScrollView>
      </View>
      </View>
      </TouchableWithoutFeedback>
    )
  }
}


class NewTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      date: "",
      reminder: false,
      currentDate: "",
      encryptedText: ``,
      decryptedText: ``,
      textFormValue: "",
      dataset: [],
      encryptedArray: [],
      decryptedArray: [],
      foundTags: [],
      isInFocus: false,
      list: "",
      modalIsOpen: "",
      reminderValue: "",
    };

  }

 
  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    this.setState({[name]: event.target.value});
  }

  getEventReminder = () => {
    if (this.state.reminder) {
    return this.state.reminderValue;
  } else {
    return false;
  }
}

toogleSwitchReminder = () => {
  this.state.reminder
  ? this.setState({ reminder: false, reminderValue: "" })
  : this.setState({ reminder: true }, this.formatTime())  
}

formatTime = () => {
  let tomorrow = addDays(new Date, 1)
  let formatedMinutes = setMinutes(tomorrow, "00");
  let reminder = addHours(formatedMinutes, 1);
  this.setState({ reminderValue: reminder })
  
}




  convertToText = () => {
  
    let eventReminder = this.getEventReminder();
    Keyboard.dismiss()
    let valueForEncryption = `{"reminder": "${this.state.reminderValue.toString()}", "text": "${this.state.text}", "list": "${this.props.tagName.uuid}", "isChecked": false, "isFavourite": false }`;
    return valueForEncryption;
  }

  convertToJson = (string) => {
    let eventData = JSON.parse(string)
    return eventData;
  }



  saveTask = () => {
    Keyboard.dismiss()
    let dataForEncryption
    let encryptedData
    let timestamp = new Date().getTime()
    let uuid = createId("tasks")
    let listId = this.props.tagName.uuid

    if (this.props.tagName.shared == true) {

      this.props.findPassword(this.props.tagName.uuid).then(data => 
        encryptDataPromise(`{"reminder": "${this.state.reminderValue.toString()}", "text": "${this.state.text}", "list": "${this.props.tagName.uuid}", "isChecked": false, "updated": "${timestamp}", "shared": "true", "isFavourite": false }`, data.password).then(encResult => {
          this.props.saveNewItem({
            "uuid": uuid, "data": encResult, "updated": timestamp, "parrent": listId, "shared": "true", "type": "tasks", "needSync": "true"}, {"dateFrom": this.state.date.toString(), "uuid": uuid, "text": this.state.text, "isChecked": false, "list": listId, "reminder": this.state.reminderValue.toString(),"isFavourite": false }, "tasks", "Task created")
        })
      )
    } else {
       dataForEncryption = this.convertToText()
       encryptedData = encryptData(`{"reminder": "${this.state.reminderValue.toString()}", "text": "${this.state.text}", "list": "${this.props.tagName.uuid}", "isChecked": false, "updated": "${timestamp}", "shared": "false", "isFavourite": false}`, this.props.cryptoPassword)
       this.props.saveNewItem({
        "uuid": uuid, "data": encryptedData, "updated": timestamp, "parrent": listId, "shared": "false", "type": "tasks", "needSync": "true"}, {"dateFrom": this.state.date.toString(), "uuid": uuid, "text": this.state.text, "isChecked": false, "list": listId, "reminder": this.state.reminderValue.toString(),"isFavourite": false }, "tasks", "Task created")
     
    }
   
    this.props.hideSheet()

  }


  createNotification = (message, time) => {
    if (this.state.reminder) {
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
    createNotification;
    reloadView
  }



  onFocus = () => {
    this.setState({ isInFocus: true })
  }

  onBlur = () => {
    this.setState({ isInFocus: false })
  }

compareWords = (text, searchText) => {
  let wordsInText = text.split(" ");

  if (searchText.indexOf(" ") < 1 ) {
    for (let i=0; i<wordsInText.length; i++) {  
      if (wordsInText[i].slice(0, searchText.length).toLowerCase() === searchText.toLowerCase()) {
        return true
      }
    }
  } else {
    //split text in search to words
    let wordsInSearchText = searchText.split(" ");
    for (let i=0; i<wordsInText.length; i++) {
      for (let j=0; j<wordsInSearchText.length; j++) {
        if (wordsInText[i].slice(0, wordsInSearchText[j].length).toLowerCase() === wordsInSearchText[j].toLowerCase() && wordsInSearchText[j].length > 1 ) {
          return true
        }
      }
    }
  }

}

  searchTags = (text) => {
    //Search all stored data in state
    let filteredTags = this.props.listsData.filter(item => {
      return this.compareWords(item.list, text) 
    })
    this.setState({ foundTags: filteredTags, isInFocus: true })
  }

  componentWillMount() {
    let formatedMinutes = setMinutes(new Date(), "00");
    let dateNow = addHours(formatedMinutes, 1);
    this.setState({ date: dateNow })
  }

  renderTags = () => {
    return this.state.foundTags.map(list => {
      return <TouchableNativeFeedback 
      onPress={() => { Keyboard.dismiss(), this.setState({ list: list.list, isInFocus: false }) }}
      background={TouchableNativeFeedback.Ripple('gray', true)}
      >
      <ListItem style={{ flex: 1, paddingLeft: 5, paddingRight: 5 }}>
      <Text style={{ fontSize: 18, color: "white" }}>
      {list.list}
      </Text>
      </ListItem>
      </TouchableNativeFeedback>
    })
  }

  datePicker = async() => {
    try {
      const {action, year, month, day} = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day,
        let newDateFrom = new Date(year, month, day, getHours(this.state.reminderValue), getMinutes(this.state.reminderValue))
        this.setState({ reminderValue: newDateFrom })

       
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }
  timePicker = async() => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: getHours(this.state.reminderValue),
        minute: getMinutes(this.state.reminderValue), 
        is24Hour: true, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        let dateFrom = this.state.reminderValue
        let dateWithTimeFrom = new Date(getYear(dateFrom), getMonth(dateFrom), getDate(dateFrom), hour, minute)
        let dateWithTimeTill;

          this.setState({ reminderValue: dateWithTimeFrom })
        
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }

  
  openModal = () => {
    this.state.modalIsOpen
    ? this.setState({ modalIsOpen: false })
    : this.setState({ modalIsOpen: true }, Keyboard.dismiss())
  }

  selectList = (selectedList) => {
    this.setState({ list: selectedList, modalIsOpen: false })
  }

  setData = () => {
    let defaultList = this.props.lists.filter(list => {
      return list.uuid == this.props.tagName.uuid
    })
    this.setState({ list: defaultList[0] })

  }

  waitForData = () => {
    this.props.lists.length > 0 && this.props.defaultList
    ? this.setData()
    : setTimeout(() => {this.waitForData()}, 200)
  }

  componentDidMount() {
      this.waitForData()


  }
 
  render() {
  
    return (
      <View style={{ flex: 1, width: WIDTH, backgroundColor: this.props.darkTheme ? "#17191d" : "lavenderblush" }}>

      <View style={{  padding: 8, backgroundColor: this.props.darkTheme ? "#17191d" : "lavenderblush", color: this.props.darkTheme ? "mintcream" : "black", paddingLeft: 12, paddingRight: 12, flex: 1 }} >
        <View style={{ flexDirection: "row"}}>
        <View style={{ width: "70%", justifyContent: "center", paddingLeft: 20, paddingRight: 20 }}>
        <TextInput 
        placeholder="Add task"
        placeholderTextColor="dimgray"
        autoFocus={true}
        onSubmitEditing={() => this.refs.tagInput.focus()}
        style={{ fontSize: 18, color: this.props.darkTheme ? "mintcream" : "licorice"}}
        onChangeText={(text) => this.setState({ text })} />
        </View>
        {this.state.text.length > 0
        ?<TouchableNativeFeedback onPress={() => this.saveTask()}>
        <View style={{ width: "30%", justifyContent: "center", alignItems: "center", padding: 14 }}>
        <Text style={{ color: this.props.darkTheme ? "dodgerblue" : "royalblue", fontSize: 18}}>Save</Text>
        </View>
        </TouchableNativeFeedback>
        :  <View style={{ width: "30%", justifyContent: "center", alignItems: "center", padding: 14 }}>
        <Text style={{ color: "dimgray", fontSize: 18}}>Save</Text>
        </View>
        }
     </View>

     <View style={{ flexDirection: "row", width: "100%", paddingLeft: 8, paddingRight: 8, paddingBottom: 8}}>
        <View style={{width: "30%", padding: 6}}>
        <TouchableNativeFeedback onPress={() => this.toogleSwitchReminder() }>
          {this.state.reminder
          ? <View style={{borderWidth: 1, borderRadius: 4, width: "100%", borderColor: this.props.darkTheme ? "dodgerblue" : "royalblue", alignItems: "center", justifyContent: "center", padding: 8, flexDirection: "row"}}>
          <Ionicons name="md-notifications" size={14} color="dodgerblue"/>
          <Text style={{marginLeft: 4, color: "dodgerblue" }}>
          Remind me
          </Text>
          </View>
          : <View style={{borderWidth: 1, borderRadius: 4, width: "100%", borderColor: "dimgray", alignItems: "center", justifyContent: "center", padding: 8, flexDirection: "row"}}>
          <Ionicons name="md-notifications" size={14} color="dimgray"/>
          <Text style={{marginLeft: 4, color: "dimgray"}}>
          Remind me
          </Text>
          </View>
          }
         
        </TouchableNativeFeedback>
        </View>
        {this.state.reminder
        ? <View style={{width: "30%", padding: 6}}>
          <TouchableNativeFeedback onPress={() => this.datePicker() }>
          <View style={{borderWidth: 1, borderRadius: 4, width: "100%", borderColor: this.props.darkTheme ? "dodgerblue" : "royalblue", alignItems: "center", justifyContent: "center", padding: 8 }}>
          <Text style={{ color: this.props.darkTheme ? "dodgerblue" : "royalblue" }}>
          {this.state.reminderValue.toString().slice(4,15)}
          </Text>
          </View>
          </TouchableNativeFeedback>
          </View>
        : null
        }
         {this.state.reminder
        ? <View style={{width: "30%", padding: 6}}>
          <TouchableNativeFeedback onPress={() => this.timePicker() }>
          <View style={{borderWidth: 1, borderRadius: 4, width: "100%", borderColor:this.props.darkTheme ? "dodgerblue" : "royalblue", alignItems: "center", justifyContent: "center", padding: 8 }}>
          <Text style={{ color: this.props.darkTheme ? "dodgerblue" : "royalblue" }}>
          {this.state.reminderValue.toString().slice(16,21)}
          </Text>
          </View>
          </TouchableNativeFeedback>
          </View>
        : null
        }
        

     </View>

      </View>
      </View>
    
   
      
    );
  }
}



export default class NewTaskModal extends React.Component {

  render() {
    return (
      <NewTask ref={this.child}
      cryptoPassword={this.props.cryptoPassword}
      fetchEventsFromServer={this.props.fetchEventsFromServer} 
      saveEventsDataToLocal={this.props.saveEventsDataToLocal}
      saveTaskAfterPost={this.props.saveTaskAfterPost}
      tagsData={this.props.tagsData}
      lists={this.props.lists}
      defaultList={this.props.defaultList}
      saveNewItem={this.props.saveNewItem}
      darkTheme={this.props.darkTheme}
      hideSheet={this.props.hideSheet}
      tagName={this.props.tagName}
      passwords={this.props.passwords}
      sqlFind={this.props.sqlFind}
      findPassword={this.props.findPassword}
      />
    )
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
      borderWidth: 0.5,
      borderColor: "gray",
    },
    inputText: {
      fontSize: 22
    },
    optionsText: {
      fontSize: 20
    },
    oneColumn: {
      flexDirection: "row",
      paddingTop: 2,
      width: "100%",
      borderWidth: 0.5,
      borderColor: "gray",
    },
    twoColumn: {
      flexDirection: "row",
      paddingTop: 2,
  
    
    },
    leftColumn: {
      width: "25%",
      paddingLeft: "4%",
      paddingTop: 6
    },
    rightColumn: {
      width: "75%",
      alignItems: "center",
      paddingTop: 6
    },
    rightColumnPicker: {
      width: "75%",
      alignItems: "center",
    },
    datePicker: {
      paddingLeft: "25%",
      width: "75%",
      paddingTop: 6,
  
    },
    picker: {
      padding: 0,
      margin: 0,
      width: "50%",
      alignSelf: 'center',
      alignItems: "center"
  
  
    }
  })
  

