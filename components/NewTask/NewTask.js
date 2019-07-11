import React from "react";
//import "./Register.css";
import { View, Text, TextInput, StyleSheet, TouchableHiglight, Alert, Picker, TouchableNativeFeedback, Button, TimePickerAndroid, DatePickerAndroid, Switch, Dimensions, TouchableWithoutFeedback, ScrollView } from "react-native"
import { Keyboard } from 'react-native'
import { sendPost, createLocalId } from '../../functions.js';
import dateFns, {getYear, getDate, getMonth, addHours, setMinutes, subMinutes } from "date-fns";
var PushNotification = require('react-native-push-notification');
import NavigationService from '../../NavigationService.js';
import { List, ListItem,} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { encryptData } from '../../encryptionFunctions';
import {BottomSheet} from '../../bottomSheet.js';

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
    };

  }
  
  showDatePicker =() => {
    Keyboard.dismiss()
    this.state.datePickerTillIsVisible
    ? this.setState({ datePickerIsVisible: false })
    : this.setState({ datePickerIsVisible: true })
  }
 
  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    this.setState({[name]: event.target.value});
  }

  getEventReminder = () => {
    if (this.state.reminder !== "") {
    return this.state.dateFormValue;
  } else {
    return "";
  }
}

  toogleSwitch = () => {
    this.state.reminder
    ? this.setState({ reminder: false })
    : this.setState({ reminder: true })
  }


 datePicker = async() => {
  try {
    const {action, year, month, day} = await DatePickerAndroid.open({
      // Use `new Date()` for current date.
      // May 25 2020. Month 0 is January.
      date: new Date()
    });
    if (action !== DatePickerAndroid.dismissedAction) {
      // Selected year, month (0-11), day
      this.setState({ date: new Date(year, month, day )})
    }
  } catch ({code, message}) {
    console.warn('Cannot open date picker', message);
  }
}


timePicker = async() => {
  try {
    const {action, hour, minute} = await TimePickerAndroid.open({
      
      is24Hour: true, // Will display '2 PM'
    });
    if (action !== TimePickerAndroid.dismissedAction) {
      // Selected hour (0-23), minute (0-59)
      let date = this.state.date
      let dateWithTime = new Date(getYear(date), getMonth(date), getDate(date), hour, minute)
      this.setState({ date: dateWithTime })
    }
  } catch ({code, message}) {
    console.warn('Cannot open time picker', message);
  }
  
}



  convertToText = () => {
  
    let eventReminder = this.getEventReminder();
    Keyboard.dismiss()
    let valueForEncryption = {reminder: this.state.reminder, text: this.state.text, list: this.state.list.uuid, isChecked: false }
    return valueForEncryption;
  }

  convertToJson = (string) => {
    let eventData = JSON.parse(string)
    return eventData;
  }

  saveTask = () => {

    let dataForEncryption = JSON.stringify(this.convertToText());
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    let timestamp = new Date().getTime()
    let listId = this.state.list.uuid
    this.props.saveNewItem({
      "id": createLocalId(), "data": encryptedData, "updated": timestamp, "parrent": listId, "type": "tasks", "isLocal": "true"}, {"dateFrom": this.state.date.toString(), "id": createLocalId(), "text": this.state.text, "isChecked": false, "list": this.state.list.uuid, "reminder": this.getEventReminder() }, "tasks", "Task created")
      NavigationService.navigate('Tasks')
  }
    /*
    sendPost("https://api.hideplan.com/save/task", {
      data: encryptedData, timestamp: timestamp, listid: listId
    }, () => {this.getId(encryptedData, timestamp, dataForEncryption)})
    */
  
  
  getId = (encryptedData, itemTimestamp, stringData) => {
    const baseUrl = "https://api.hideplan.com/fetch/id/";
    let type = "typetasks/" //NS as notes
    let timestamp = "timestamp/" + itemTimestamp + "/"
    let encryptedString = "encryptedData/" + encryptedData
    
    const url = baseUrl + type + timestamp + encryptedString
    fetch(url, 
      {method: 'GET',
      credentials: 'include',
    })
      .then(response => response.json())
      .then(id => {
        this.props.saveNewData("taskId" + id.uuid, {
          "id": id.uuid, "data": encryptedData, "timestamp": itemTimestamp }, {"dateFrom": this.state.date.toString(), "id": id.uuid, "text": this.state.text, "isChecked": false, "list": this.state.list, "reminder": this.getEventReminder() }, "task", "Task created")
          NavigationService.navigate('Tasks')
      })
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
      return list.uuid == this.props.defaultList
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
      <View style={{ flex: 1, width: "100%" }}>

      <View style={{ borderBottomWidth: 0.4, borderBottomColor: "gray", padding: 8 }} >
        <TextInput 
        placeholder="Title"
        autoFocus={true}
        onSubmitEditing={() => this.refs.tagInput.focus()}
        style={{ fontSize: 28, paddingTop: 8, paddingBottom: 8, paddingLeft: 52, paddingRight: 20, color: "#EDE8E9" }}
        onChangeText={(text) => this.setState({ text })} />
     
      </View>

      <View style={{flexDirection: "column", width: "100%", borderBottomWidth: 0.4, borderBottomColor: "#C7D2D6", }}>
   <View style={{ flexDirection: "row",}} >

   <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>
      <Ionicons name="md-calendar" size={24} color="#C7D2D6"/>
      </View>

      <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, color: "#C7D2D6" }}>List</Text>
      <TouchableNativeFeedback 
      onPress={() => { this.openModal() }}
      background={TouchableNativeFeedback.Ripple('gray', true)}
      >
      <View style={{  paddingTop: 8, paddingBottom: 8, paddingLeft: WIDTH / 4, paddingRight: 20 }}>
      <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, color: "#C7D2D6" }}>
      {this.state.list.list}
      </Text>
      </View>
      </TouchableNativeFeedback>
      </View>
      </View>
   <View style={{flex:1, flexDirection: "column", width: "100%", borderBottomWidth: 0.4, borderBottomColor: "gray", }}>
   <View style={{ flexDirection: "row", borderBottomWidth: 0.4, borderBottomColor: "gray",}} >

   <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>
      <Ionicons name="md-notifications" size={24} color="#EF2647"/>
      </View>

      <Text style={{ fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20, color: "#EDE8E9" }}>Remind me</Text>

      <View style={{  paddingTop: 8, paddingBottom: 8, paddingLeft: WIDTH / 4, paddingRight: 20 }}>
      <Switch value={this.state.reminder} onValueChange={() => {this.toogleSwitch() }}/>
      </View>

      </View>

      {this.state.reminder
      ? 
      <View style={{ flexDirection: "row", width: "100%", borderBottomWidth: 0.4, borderBottomColor: "gray", }}>

      <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center"}}>
      <Ionicons name="md-calendar" size={24} color="#EF2647"/>
      </View>

      <TouchableNativeFeedback 
      onPress={() => { this.datePicker() }}
      background={TouchableNativeFeedback.Ripple('gray', true)}
      >
      <Text style={{fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: 6, paddingRight: 20}} >{(this.state.date.toString()).slice(4,15)}</Text></TouchableNativeFeedback>

      <TouchableNativeFeedback 
      onPress={() => { this.timePicker() }}
      background={TouchableNativeFeedback.Ripple('gray', true)}
      >
      <Text style={{fontSize: 22, paddingTop: 8, paddingBottom: 8, paddingLeft: WIDTH / 4, paddingRight: 20}}>{(this.state.date.toString()).slice(16,21)}</Text></TouchableNativeFeedback>
      </View>
      : null
      }
           </View>
      
           {this.state.modalIsOpen
      ? <Modal 
        data={this.props.lists}
        openModal={this.openModal} 
        selectList={this.selectList}
        />
      : null
      }
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



export default class NewTaskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {title: 'New Task',
    headerStyle: {
      backgroundColor: "#EF2647",
      color: "white"
    },
    headerRight: (
      <View style ={{ paddingRight: 20 }}>

      <Button
        onPress={() => {params.handleSave()}}
        title="Save"
        color="#EF2647"
      />
      </View>
    )
  
  }
}
 

  save = () => {
  }

  componentDidMount() {
    this.props.navigation.setParams({ handleSave: this.child.current.saveTask });
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "rgb(29, 31, 38)" }}>
      <NewTask ref={this.child}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      eventData={this.props.navigation.state.params}
      fetchEventsFromServer={this.props.screenProps.fetchEventsFromServer} 
      saveEventsDataToLocal={this.props.screenProps.saveEventsDataToLocal}
      saveTaskAfterPost={this.props.screenProps.saveTaskAfterPost}
      tagsData={this.props.screenProps.tagsData}
      lists={this.props.screenProps.lists}
      defaultList={this.props.screenProps.defaultList}
      saveNewItem={this.props.screenProps.saveNewItem}

      />
           
      </View>
    );
  }
}



module.exports = NewTaskScreen;
