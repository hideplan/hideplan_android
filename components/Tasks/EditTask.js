import React from "react";
//import "./Register.css";
import { Alert, Keyboard, BackHandler,  Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList, TimePickerAndroid, DatePickerAndroid, Modal } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, addHours, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, subMinutes, setMinutes, differenceInCalendarDays } from "date-fns";
import { parse } from "../../functions";
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
    let today = addHours(parse(new Date), 1)
    let formatedMinutes = setMinutes(parse(today), "00");
    let reminder = addHours(parse(formatedMinutes), 1);
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
        let newDateFrom = parse(new Date(year, month, day, getHours(parse(this.state.reminderValue)), getMinutes(parse(this.state.reminderValue))))
        this.setState({ reminderValue: newDateFrom, hasChanged: true })

       
      }
    } catch ({code, message}) {
      console.warn('Cannot open date picker', message);
    }
  }
  timePicker = async() => {
    try {
      const {action, hour, minute} = await TimePickerAndroid.open({
        hour: getHours(parse(this.state.reminderValue)),
        minute: getMinutes(parse(this.state.reminderValue)), 
        is24Hour: true, // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        let dateFrom = this.state.reminderValue
        let dateWithTimeFrom = parse(new Date(getYear(parse(dateFrom)), getMonth(parse(dateFrom)), getDate(parse(dateFrom)), hour, minute))
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
    let valueForEncryption = {"reminder": this.state.reminderValue.toString(), "text": this.state.text, "list": this.props.tagName.uuid, "isChecked": this.props.item.isChecked, "isFavourite": this.props.item.isFavourite, "updated": time.toString(), "shared": "false"}

    return valueForEncryption;
  }
  editTask = () => {
    let dataForEncryption
    let encryptedData
    let timestamp = parse(new Date())
    let listId = this.props.tagName.uuid
    this.props.cancelNotification(this.props.item.reminder, this.state.reminder, this.props.item)
        if (this.props.tagName.shared == true) {
    
          this.props.findPassword(this.props.tagName.uuid).then(data => 
            encryptDataPromise(`{"reminder": "${this.state.reminderValue.toString()}", "text": "${this.state.text}", "list": "${this.props.tagName.uuid}", "isChecked": ${this.props.item.isChecked}, "isFavourite": ${this.props.item.isFavourite}, "updated": "${timestamp}", "shared": "true" }`, data.password).then(encResult => {
              this.props.editItem({
                "uuid": this.props.item.uuid, "data": encResult, "updated": timestamp, "parrent": listId, "shared": "true", "type": "tasks", "needSync": "true"}, {"dateFrom": "", "uuid": this.props.item.uuid, "text": this.state.text, "isChecked": this.props.item.isChecked, "isFavourite": this.props.item.isFavourite, "list": listId, "reminder": this.state.reminderValue.toString() }, "tasks", "Task created")
            })
          )
        } else {
           dataForEncryption = JSON.stringify(this.convertToText(timestamp))
           encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword)
           this.props.editItem({
            "uuid": this.props.item.uuid, "data": encryptedData, "updated": timestamp.toString(), "parrent": listId, "shared": "false", "type": "tasks", "needSync": "true"}, {"uuid": this.props.item.uuid, "text": this.state.text, "isChecked": this.props.item.isChecked, "isFavourite": this.props.item.isFavourite, "timestamp": timestamp.toString(), "list": listId, "reminder": this.state.reminderValue.toString() }, "tasks", "Task created")
         
        }
        NavigationService.navigate('Tasks')    

  }
  
    render() {

      const textBoxStyle = {
        width: "100%",
        padding: 8,
        paddingLeft: 16,
        paddingRight: 16

      }
      const textStyle = {
        color: this.props.darkTheme ? "white" : "black",
        fontSize: 28,
      }
  
      return (
        <View style={{ flex: 1, }}>
        <View style={textBoxStyle}>
         <TextInput
              placeholderTextColor={this.props.colors.gray}
              style={textStyle}
              placeholder="Write your task"
              autoFocus={false}
              type="text"
              name="text"
              value={this.state.text}
              multiline = {true}
              onChangeText={(text) => {this.setState({ text }), this.setState({ hasChanged: true })}}
              />
              </View>
              <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />
              <View style={{ flexDirection: "row", marginTop: 8,  width: "auto", paddingLeft: 16, paddingRight: 16, paddingBottom: 8}}>
        <View style={{ padding: 6}}>
        <TouchableNativeFeedback onPress={() => this.toogleSwitchReminder() } background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
  this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
>
          {this.state.reminder 
          ? <View style={{borderWidth: 1, borderRadius: 4, width: "auto", borderColor: this.props.colors.primary, alignItems: "center", justifyContent: "center", padding: 8, flexDirection: "row"}}>
          <Ionicons name="md-notifications" size={14} color={this.props.colors.primary}/>
          <Text style={{marginLeft: 4, color: this.props.colors.primary}}>
          Remind me
          </Text>
          </View>
          : <View style={{borderWidth: 1, borderRadius: 4, width: "auto", borderColor: "gray", alignItems: "center", justifyContent: "center", padding: 8, flexDirection: "row"}}>
          <Ionicons name="md-notifications" size={14} color="gray"/>
          <Text style={{marginLeft: 4, color: "gray"}}>
          Remind me
          </Text>
          </View>
          }
         
        </TouchableNativeFeedback>
        </View>
        {this.state.reminder && this.state.reminderValue
        ? <View style={{padding: 6}}>
          <TouchableNativeFeedback onPress={() => this.datePicker() } background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
  this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }

>
          <View style={{borderWidth: 1, borderRadius: 4, width: "auto", borderColor: this.props.colors.primary, alignItems: "center", justifyContent: "center", padding: 8 }}>
          <Text style={{ color: this.props.colors.primary}}>
          {this.state.reminderValue.toString().slice(4,15)}
          </Text>
          </View>
          </TouchableNativeFeedback>
          </View>
        : null
        }
         {this.state.reminder && this.state.reminderValue
        ? <View style={{ padding: 6}}>
          <TouchableNativeFeedback onPress={() => this.timePicker() } background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
  this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
>
          <View style={{borderWidth: 1, borderRadius: 4, width: "auto", borderColor: this.props.colors.primary, alignItems: "center", justifyContent: "center", padding: 8 }}>
          <Text style={{ color: this.props.colors.primary}}>
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
    convertToText2 = (task, timestamp) => {
      let favouriteValue;
      if (task.isFavourite == "true") {
        favouriteValue = "false"
      } else {
        favouriteValue = "true"
      }
      let valueForEncryption = {"uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": task.isChecked, "isFavourite": favouriteValue, "reminder": task.reminder, "updated": timestamp.toString()};
      return valueForEncryption;
    }
    triggerFavourite = (task) => {
      let dataForEncryption
      let encryptedData
      let isFavourite;
      let timestamp = parse(new Date())
  
      if (task.isFavourite == "true") {
        isFavourite = "false"
      } else {
        isFavourite = "true"
      }
      if (this.props.tagName.shared == true) {
  
        this.props.screenProps.findPassword(this.props.screenProps.tagName.uuid).then(data => 
          encryptDataPromise(JSON.stringify(this.convertToText2(task, timestamp), data.password)).then(encResult => {
            this.props.screenProps.editItem({uuid: task.uuid, data: encResult, updated: timestamp, type: "tasks", parrent: task.list, needSync: true}, {
              "uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": task.isChecked, "isFavourite": isFavourite, "reminder": task.reminder, "updated": timestamp
            }, this.props.tasks)
      })
        )} else {
          dataForEncryption = JSON.stringify(this.convertToText2(task, timestamp));
          encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
      
      
          this.props.screenProps.editItem({uuid: task.uuid, data: encryptedData, updated: timestamp.toString(), type: "tasks", parrent: task.list, needSync: true}, {
            "uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": task.isChecked, "isFavourite": isFavourite, "reminder": task.reminder, "updated": timestamp.toString()
          }, this.props.screenProps.tasks)
      }
      NavigationService.navigate('Tasks')    

    }
    componentDidMount() {
    }
  
    componentWillUnmount() {
    }
  


    saveEditTask = () => {
      this.refs.TaskInput.editTask()
      NavigationService.navigate('Tasks')    

    }


    deleteItem = (item) => {
      let itemObj = {...item, ...{type: "tasks"}}
      this.props.screenProps.deleteItem(itemObj)
      NavigationService.navigate('Tasks')    

    }
    deleteAlert = (item) => {
      Alert.alert(
        'Delete task',
        `Do you want to delete task "${item.text}"?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => {      NavigationService.navigate('Tasks')    
          , this.props.showSnackbar("Task deleted"), this.deleteItem(item)},
          }
          ],
      );
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
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.surface,
      color: this.props.screenProps.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme
    return (
       
        <View style={{ flex: 1,}}>
 <Header 
        style={headerStyle}
        >
              <StatusBar
            backgroundColor={this.props.screenProps.colors.surface}
            barStyle={darkTheme ? "light-content" : "dark-content"}
          />
            <Left>
          <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="arrow-left" color={this.props.screenProps.colors.gray}  headerFunction={() => {
        this.handleBackPress()
        }} />
            </Left>
          <Body>
          <Title style={{color: this.props.screenProps.colors.text}}></Title>
          </Body>
          <Right>
          <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="delete"color={this.props.screenProps.colors.gray}  headerFunction={() => {
          this.deleteAlert(this.props.navigation.state.params)
        }} />
                  <HeaderIcon darkTheme={this.props.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon={this.props.navigation.state.params.isFavourite == "true" ? "star" : "star-outline"} color={this.props.screenProps.colors.gray}  headerFunction={() => {
          this.triggerFavourite(this.props.navigation.state.params)
        }} />
          <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="check" color={this.props.screenProps.colors.gray}  headerFunction={() => {
          this.saveEditTask()
        }} />
            </Right>

</Header>
      <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface}}>
      <View style={{ flex: 1}}>

        {this.props.navigation.state.params
        ?
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
      primaryColor={this.props.screenProps.primaryColor}
      colors={this.props.screenProps.colors}
      cancelNotification={this.props.screenProps.cancelNotification}

      />
      : null
        }
      </View>
      
      </View>
      </View>
    );
  }
}


module.exports = EditTaskScreen;

