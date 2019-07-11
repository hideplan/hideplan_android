import React from "react";
//import "./Register.css";
import { Button, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Picker } from "react-native"
import { Keyboard } from 'react-native'
import CryptoJS from "react-native-crypto-js";
import {sendPost} from '../../functions.js';
import dateFns, { addHours, setMinutes, subMinutes } from "date-fns";
var PushNotification = require('react-native-push-notification');
import NavigationService from '../../NavigationService.js';

import { AsyncStorage } from "react-native";
import "core-js/es6/weak-set";
var WeakSet = require('weakset');

<script src="http://localhost:8097"></script>



class Event extends React.Component {


  
  deleteEventFromServer = (id) => {
    //Send request to server to delete event based on id
    sendPost("https://api.hideplan.com/delete/event", {
      eventId: id
    }, () => { this.props.eventWasDeleted(id) })
    NavigationService.navigate('Calendar') 

  }
  

  render() {
   
    return (
      <View style={styles.containerStyle}>
      <View style={styles.inputStyle}>
      <Text style={{ fontWeight: "bold", fontSize: 22, paddingLeft: 6, paddingTop: 6 }}>{this.props.eventData.text}</Text>
    
      </View>
      <View style={styles.oneColumnStyle}>
      <View style={styles.twoColumnStyle}>
      <View style={styles.leftColumnStyle}>
      <Text style={styles.optionsTextStyle}>From</Text>
      </View>
      <View style={styles.rightColumnStyle}>
      <Text style={styles.optionsTextStyle}>{(this.props.eventData.dateFrom.toString()).slice(4,21)}</Text>
      </View>
      </View>

      </View>
        
      <View style={styles.oneColumnStyle}>
      <View style={styles.twoColumnStyle}>
      <View style={styles.leftColumnStyle}>
      <Text style={styles.optionsTextStyle}>Till</Text>
      </View>
      <View style={styles.rightColumnStyle}>
      <Text style={styles.optionsTextStyle}>{(this.props.eventData.dateTill.toString()).slice(4,21)}</Text>
      </View>
      </View>

      </View>
  
      <View style={styles.twoColumnStyle}>
      <View style={styles.leftColumnStyle}>
      <Text style={styles.optionsTextStyle}>Reminder</Text>
      </View>
      <View style={styles.rightColumnStyle}>
      {this.props.eventData.reminder
      ? <Text style={styles.optionsTextStyle}>{(this.props.eventData.reminder.toString()).slice(4,21)}</Text>
      : <Text style={styles.optionsTextStyle}>No reminder</Text>
      }
      </View>
      </View>

      <View style={styles.twoColumnStyle}>
      <View style={styles.leftColumnStyle}>
      <Text style={styles.optionsTextStyle}>Location</Text>
      </View>
      <View style={styles.rightColumnStyle}>
      <Text style={styles.optionsTextStyle}>{this.props.eventData.location}</Text>
      </View>
      </View>

      <View style={styles.twoColumnStyle}>
      <View style={styles.leftColumnStyle}>
      <Text style={styles.optionsTextStyle}>Notes</Text>
      </View>
      <View style={styles.rightColumnStyle}>
      <Text style={styles.optionsTextStyle}>{this.props.eventData.notes}</Text>
      </View>

      </View>
      <View style = {{ flex: 0.3, paddingTop: 40, alignItems: "center" }}>
      <Button title="Delete event" color="red" width="50%" onPress={() => { this.deleteEventFromServer(this.props.eventData.uuid )}} />
      </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "column",
    flex: 1,
    width: "100%",
    justifyContent: "flex-start"

  },
  inputStyle: {
    flex: 0.1,
    width: "100%",
    paddingLeft: "2%",
    paddingRight: "2%",
    borderWidth: 0.5,
    borderColor: "gray",
  },
  inputTextStyle: {
    fontSize: 20
  },
  optionsTextStyle: {
    fontSize: 20,
    color: "#C7D2D6"
  },
  oneColumnStyle: {
    flexDirection: "row",
    flex: 0.1,
    paddingTop: 2,
    width: "100%",
    borderWidth: 0.5,
    borderColor: "gray",
  },
  twoColumnStyle: {
    flexDirection: "row",
    paddingTop: 2,
  },
  leftColumnStyle: {
    width: "25%",
    paddingLeft: "4%",
    paddingTop: 6
  },
  rightColumnStyle: {
    width: "75%",
    alignItems: "center",
    paddingTop: 6
  },
  rightColumnStylePicker: {
    width: "75%",
    alignItems: "center",
  },
})



export default class EventDetailsScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {title: 'Event',
    headerStyle: {
      backgroundColor: 'white',
      justifyContent: "center",
    },
    headerRight: (
      <View style ={{ paddingRight: 12 }}>
        <Button
        onPress={() => {NavigationService.navigate('EditEvent', { text: params.text, id: params.uuid, dateFrom: params.dateFrom, dateTill: params.dateTill, location: params.location, notes: params.notes, reminder: params.reminder, calendar: params.calendar })}}
        title="Edit"
        color="dodgerblue"
      />
      </View>
      
    )
  
  }
}


 
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: "rgb(29, 31, 38)" }}>
      <Event 
      eventData={this.props.navigation.state.params}
      eventWasDeleted={this.props.screenProps.eventWasDeleted}
      />
      </View>
    );
  }
}



module.exports = EventDetailsScreen;
