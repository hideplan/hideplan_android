import React from "react";
//import "./Register.css";
import { Dimensions, Button, View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Picker } from "react-native"
import { Keyboard } from 'react-native'
import CryptoJS from "crypto-js";
import {sendPost} from '../../functions.js';
import dateFns, { addHours, setMinutes, subMinutes } from "date-fns";
var PushNotification = require('react-native-push-notification');
import NavigationService from '../../NavigationService.js';

import { AsyncStorage } from "react-native";
import "core-js/es6/weak-set";
var WeakSet = require('weakset');
const WIDTH = Dimensions.get('window').width;

<script src="http://localhost:8097"></script>



export class EventDetails extends React.Component {


  
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
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "column",
    flex: 1,
    width: "100%",
    paddingTop: 10,
    justifyContent: "flex-start"

  },
  inputStyle: {
    flex: 0.1,
    width: "100%",
    paddingLeft: 40,
    paddingRight: 40,
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
  },
  twoColumnStyle: {
    flexDirection: "row",
    paddingTop: 2,
  },
  leftColumnStyle: {
    width: WIDTH / 3 - 40,
    paddingLeft: 40,
    paddingTop: 6
  },
  rightColumnStyle: {
    width: (WIDTH / 3) * 2,
    alignItems: "center",
    paddingTop: 6
  },
  rightColumnStylePicker: {
    width: "75%",
    alignItems: "center",
  },
})


