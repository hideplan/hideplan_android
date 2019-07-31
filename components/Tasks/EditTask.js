import React from "react";
//import "./Register.css";
import { Alert, Keyboard, BackHandler, ViewPagerAndroid, Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList, TimePickerAndroid, DatePickerAndroid } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, addHours, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, subMinutes, setMinutes, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon } from '../../customComponents.js';
import { encryptData, encryptDataPromise } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { createId } from '../../functions';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get('window').width;


class TaskInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      hasChanged: false,
      reminder: false,
      reminderValue: "",
    };
  }
    
  componentWillMount() {
    this.setState({ text: this.props.item.text, reminderValue: this.props.item.reminder })
    if (this.props.item.reminder) {
      this.setState({reminder: true})
    }
  }
  toogleSwitchReminder = () => {
    this.state.reminder
    ? this.setState({ reminder: false, reminderValue: "", hasChanged: true })
    : this.setState({ reminder: true }, this.formatTime())  
  }
  
  formatTime = () => {
    let tomorrow = addDays(new Date, 1)
    let formatedMinutes = setMinutes(tomorrow, "00");
    let reminder = addHours(formatedMinutes, 1);
    this.setState({ reminderValue: reminder })
    
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
        this.setState({ reminderValue: newDateFrom, hasChanged: true })

       
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

          this.setState({ reminderValue: dateWithTimeFrom, hasChanged: true })
          
      }
    } catch ({code, message}) {
      console.warn('Cannot open time picker', message);
    }
  }
  triggerChange = () => {
    this.setState({ hasChanged: true })
  }
  convertToText = (time) => {
    let valueForEncryption = {reminder: this.state.reminderValue.toString(), text: this.state.text, list: this.props.tagName.uuid, timestamp: time, isChecked: this.props.item.isChecked};

    return valueForEncryption;
  }
  editTask = () => {
    let dataForEncryption
    let encryptedData
    let timestamp = new Date().getTime()
    let listId = this.props.tagName.uuid
        if (this.props.tagName.shared == true) {
    
          this.props.findPassword(this.props.tagName.uuid).then(data => 
            encryptDataPromise(`{"reminder": "${this.state.reminderValue.toString()}", "text": "${this.state.text}", "list": "${this.props.tagName.uuid}", "isChecked": ${this.props.item.isChecked}, "isFavourite": ${this.props.item.isFavourite}, "updated": "${timestamp}", "shared": "true" }`, data.password).then(encResult => {
              this.props.editItem({
                "uuid": this.props.item.uuid, "data": encResult, "updated": timestamp, "parrent": listId, "shared": "true", "type": "tasks", "needSync": "true"}, {"dateFrom": "", "uuid": this.props.item.uuid, "text": this.state.text, "isChecked": this.props.item.isChecked, "isFavourite": this.props.item.isFavourite, "list": listId, "reminder": this.state.reminderValue.toString() }, "tasks", "Task created")
            })
          )
        } else {
           dataForEncryption = this.convertToText(timestamp)
           encryptedData = encryptData(`{"reminder": "${this.state.reminderValue.toString()}", "text": "${this.state.text}", "list": "${this.props.tagName.uuid}", "isChecked": ${this.props.item.isChecked}, "isFavourite": ${this.props.item.isFavourite}, "updated": "${timestamp}", "shared": "false"}`, this.props.cryptoPassword)
           this.props.editItem({
            "uuid": this.props.item.uuid, "data": encryptedData, "updated": timestamp, "parrent": listId, "shared": "false", "type": "tasks", "needSync": "true"}, {"dateFrom": "", "uuid": this.props.item.uuid, "text": this.state.text, "isChecked": this.props.item.isChecked, "isFavourite": this.props.item.isFavourite, "list": listId, "reminder": this.state.reminderValue.toString() }, "tasks", "Task created")
         
        }
  }
  
    render() {

      const textBoxStyle = {
        width: "100%",
        padding: 8

      }
      const textStyle = {
        color: this.props.darkTheme ? "white" : "black",
        fontSize: 18,
        padding: 4,
      }
  
      return (
        <View style={{ flex: 1, }}>
        <View style={textBoxStyle}>
         <TextInput
              placeholderTextColor="gray"
              style={textStyle}
              placeholder="Add new list"
              autoFocus={true}
              type="text"
              name="text"
              numberOfLines = {1}
              value={this.state.text}
              onChangeText={(text) => {this.setState({ text }), this.setState({ hasChanged: true })}}
              />
              </View>
              <View style={{borderBottom: "solid", borderBottomWidth: 0.4, borderBottomColor: "gray"}} />
              <View style={{ flexDirection: "row", width: "100%", paddingLeft: 8, paddingRight: 8, paddingBottom: 8}}>
        <View style={{width: "30%", padding: 6}}>
        <TouchableNativeFeedback onPress={() => this.toogleSwitchReminder() }>
          {this.state.reminder 
          ? <View style={{borderWidth: 1, borderRadius: 4, width: "100%", borderColor: "dodgerblue", alignItems: "center", justifyContent: "center", padding: 8, flexDirection: "row"}}>
          <Ionicons name="md-notifications" size={14} color="dodgerblue"/>
          <Text style={{marginLeft: 4, color: "dodgerblue" }}>
          Remind me
          </Text>
          </View>
          : <View style={{borderWidth: 1, borderRadius: 4, width: "100%", borderColor: "gray", alignItems: "center", justifyContent: "center", padding: 8, flexDirection: "row"}}>
          <Ionicons name="md-notifications" size={14} color="gray"/>
          <Text style={{marginLeft: 4, color: "gray"}}>
          Remind me
          </Text>
          </View>
          }
         
        </TouchableNativeFeedback>
        </View>
        {this.state.reminder && this.state.reminderValue
        ? <View style={{width: "30%", padding: 6}}>
          <TouchableNativeFeedback onPress={() => this.datePicker() }>
          <View style={{borderWidth: 1, borderRadius: 4, width: "100%", borderColor: "dodgerblue", alignItems: "center", justifyContent: "center", padding: 8 }}>
          <Text style={{ color: "dodgerblue" }}>
          {this.state.reminderValue.toString().slice(4,15)}
          </Text>
          </View>
          </TouchableNativeFeedback>
          </View>
        : null
        }
         {this.state.reminder && this.state.reminderValue
        ? <View style={{width: "30%", padding: 6}}>
          <TouchableNativeFeedback onPress={() => this.timePicker() }>
          <View style={{borderWidth: 1, borderRadius: 4, width: "100%", borderColor: "dodgerblue", alignItems: "center", justifyContent: "center", padding: 8 }}>
          <Text style={{ color: "dodgerblue" }}>
          {this.state.reminderValue.toString().slice(16,21)}
          </Text>
          </View>
          </TouchableNativeFeedback>
          </View>
        : null
        }
        

     </View>
        </View>
      )
  
    }
  }



export default class EditTaskScreen extends React.Component {
  constructor(props) {
    super(props);

    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };

    showModal = () => {
      Keyboard.dismiss()
      this.state.modalIsShown 
      ? this.setState({ modalIsShown: false })
      : this.setState({ modalIsShown: true })
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    handleBackPress = () => {
      if(this.refs.TaskInput.state.hasChanged) {
        this.refs.TaskInput.editTask()
      }

      NavigationService.navigate('Tasks')    
      return true;
    }

    deleteItem = () => {
      this.props.screenProps.deleteItem(this.props.navigation.state.params)
      NavigationService.navigate('Tasks')
    }
    deleteAlert = (taskName, func) => {
      Alert.alert(
        'Delete task',
        `Do you want to delete task "${taskName}"?`,
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
          <HeaderIcon headerIcon="md-arrow-back" color={darkTheme ? "white" : "black"} headerFunction={() => {
        this.handleBackPress()
        }} />
            </Left>
          <Body>
          <Title style={{color: darkTheme ? "white" : "black"}}>Edit task</Title>
            <Text style={{color: darkTheme ? "white" : "black"}}>{this.props.screenProps.tagName.list}</Text>
          </Body>
          <Right>
          <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {
          this.handleBackPress()
        }} />
            </Right>

</Header>
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4" }}>
      <View style={{ flex: 1}}>

      <TaskInput 
      ref={"TaskInput"}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      editItem={this.props.screenProps.editItem}
      darkTheme={this.props.screenProps.darkTheme}
      user={this.props.screenProps.user}
      filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
      item={this.props.navigation.state.params}
      tagName={this.props.screenProps.tagName}
      findPassword={this.props.screenProps.findPassword}

      />
      </View>
      
      </View>
      </Container>

    );
  }
}


module.exports = EditTaskScreen;

