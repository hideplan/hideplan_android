import React from "react";
//import "./Register.css";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  Alert,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TimePickerAndroid,
  DatePickerAndroid,
  Dimensions,
  StatusBar,
  Modal,
} from "react-native";
import { Keyboard } from "react-native";
import CryptoJS from "crypto-js";
import { sendPost, hashForComparingChanges } from "../../functions.js";
import dateFns, {
  addHours,
  setMinutes,
  subMinutes,
  subHours,
  getYear,
  getMonth,
  getHours,
  getDate,
  isBefore,
  getMinutes,
  parseISO
} from "date-fns";
import { parse } from "../../functions";
var PushNotification = require("react-native-push-notification");
import NavigationService from "../../NavigationService.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "native-base";
import { encryptData } from "../../encryptionFunctions";
import SearchTimezones from ".././Search/SearchTimezones";

import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  Fab,
  ListItem,
  CheckBox,
  Tab,
  Tabs,
  TabHeading
} from "native-base";
import { MyDialog, HeaderIcon, HeaderIconMenu, HeaderIconEmpty, AppHeader } from "../../customComponents.js";
import { createId } from "../../functions";
import { MenuItem } from "../Moduls/react-native-material-menu/src/Menu.js";
import { MyModal } from "../../customComponents.js";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Switch } from 'react-native-paper';
import { IconButton, Button, Paragraph, Dialog, RadioButton } from 'react-native-paper';
import { Menu } from "../Moduls/react-native-material-menu/src/Menu.js";
import { AsyncStorage } from "react-native";

<script src="http://localhost:8097"></script>;

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;



class ViewContent extends React.Component {

  action = (item) => {
      this.props.func(this.props.stateName, item), this.props.hideModal()
  }

  renderContent = () => {
    return (
      this.props.options.map(item => {
        return (
          <TouchableNativeFeedback onPress={() =>this.action(item)}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
          >
          <View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-start", paddingTop: 16, paddingBottom: 16,paddingLeft: 20, paddingRight: 20, }}>
          { this.props.currentValue.value == item.value
                ?<Icon name="radiobox-marked" size={24} color={this.props.colors.primary} />
                :<Icon name="radiobox-blank" size={24} color={this.props.colors.gray} />
              }
    
    <Text style={{color: this.props.colors.text, fontSize: 16, paddingLeft: 16,includeFontPadding: false,
  fontFamily: "OpenSans" }}>{`${item.label}`}</Text>
          </View>
          </TouchableNativeFeedback>
        )
      })
    )
  }
  render() {


      return (
        <ScrollView style={{ width: "100%",  height: "auto", }}>
        {this.renderContent()}
        </ScrollView>
      )
    }
  }

  class ViewContentCalendar extends React.Component {



    action = (item) => {
        this.props.func(this.props.stateName, item), this.props.hideModal()
    }
  
    renderContent = () => {
      return (
        
        this.props.options.map(item => {
          let calendarColor;

          if (item.color.s200) {
            if (this.props.darkTheme) {
              calendarColor = item.color.s200;
            } else {
              calendarColor = item.color.s600;
            }
          } else {
            calendarColor = item.color;
          }

          return (
            <TouchableNativeFeedback onPress={() =>this.action(item)}
            background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
              this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            >
            <View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-start", paddingTop: 16, paddingBottom: 16,paddingLeft: 20, paddingRight: 20, }}>
            <Icon
                    name="checkbox-blank-circle"
                    size={24}
                    color={calendarColor
                    }
                  />
      
      <Text style={{color: this.props.colors.text, fontSize: 16, paddingLeft: 16,includeFontPadding: false,
    fontFamily: "OpenSans" }}>{item.calendar}</Text>
            </View>
            </TouchableNativeFeedback>
          )
        })
      )
    }
    render() {
  
  
        return (
          <ScrollView style={{ width: "100%",  height: "auto", }}>
          {this.renderContent()}
          </ScrollView>
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
      allDay: false,
      currentDate: "",
      pubkey: ``,
      privkey: ``,
      passphrase: `testtest`,
      reminder: false,
      reminderValue: { label: "5 minutes before", value: "5" },
      repeat: { label: "No repeat", value: false },
      repeatCount: { label: "2", value: "2" },
      encryptedText: ``,
      decryptedText: ``,
      textFormValue: "",
      dataset: [],
      encryptedArray: [],
      decryptedArray: [],
      selectedCalendar: "",
      timezone: "",
      modalTimeVisible: false,
      modalVisible: false,
      dialogCalendarVisible: false,
      dialogReminderVisible: false,
      dialogRepeatVisible: false,
      dialogRepeatCountVisible: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.showDatePickerFrom = this.showDatePickerFrom.bind(this);
    this.showDatePickerTill = this.showDatePickerTill.bind(this);
    this.saveEvent = this.saveEvent.bind(this);
    this.fetchEvents = this.fetchEvents.bind(this);
  }

  showDialog = (dialogName) => {
    this.setState({ [dialogName]: true })
  }
  hideModal = () => {
    this.setState({ dialogCalendarVisible: false, dialogReminderVisible: false,dialogRepeatCountVisible: false, dialogRepeatVisible: false })
  }
  hideModalTime = () => {
    this.setState({ modalTimeVisible: false })
  }
  showModalTime = () => {
    this.setState({ modalTimeVisible: true })
  }

  showDatePickerFrom() {
    Keyboard.dismiss();
    this.state.datePickerFromIsVisible
      ? this.setState({ datePickerFromIsVisible: false })
      : this.setState({
          datePickerFromIsVisible: true,
          datePickerTillIsVisible: false
        });
  }

  showDatePickerTill() {
    Keyboard.dismiss();
    this.state.datePickerTillIsVisible
      ? this.setState({ datePickerTillIsVisible: false })
      : this.setState({
          datePickerTillIsVisible: true,
          datePickerFromIsVisible: false
        });
  }

  datePickerFrom = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day,
        let newDateFrom = parse(new Date(
          year,
          month,
          day,
          getHours(parse(this.state.dateFrom)),
          getMinutes(parse(this.state.dateFrom))
        ));
        this.setState({ dateFrom: newDateFrom });

        if (isBefore(parse(this.state.dateTill), parse(newDateFrom))) {
          this.setState({ dateTill: addHours(parse(newDateFrom), 1) });
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  timePickerFrom = async () => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: getHours(parse(this.state.dateFrom)),
        minute: getMinutes(parse(this.state.dateFrom)),
        is24Hour: true // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        let dateFrom = this.state.dateFrom;
        let dateWithTimeFrom = parse(new Date(
          getYear(parse(dateFrom)),
          getMonth(parse(dateFrom)),
          getDate(parse(dateFrom)),
          hour,
          minute
        ));
        let dateWithTimeTill;
        if (isBefore(parse(this.state.dateTill), parse(dateWithTimeFrom))) {
          dateWithTimeTill = addHours(parse(dateWithTimeFrom), 1);
          this.setState({
            dateFrom: dateWithTimeFrom,
            dateTill: dateWithTimeTill
          });
        } else {
          this.setState({ dateFrom: dateWithTimeFrom });
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  };

  datePickerTill = async () => {
    try {
      const { action, year, month, day } = await DatePickerAndroid.open({
        // Use `new Date()` for current date.
        // May 25 2020. Month 0 is January.
        date: new Date()
      });
      if (action !== DatePickerAndroid.dismissedAction) {
        // Selected year, month (0-11), day
        let newDateTill = parse(new Date(
          year,
          month,
          day,
          getHours(parse(this.state.dateTill)),
          getMinutes(parse(this.state.dateTill))
        ));

        this.setState({ dateTill: newDateTill });
        if (isBefore(parse(newDateTill), parse(this.state.dateFrom))) {
          let newDateFrom = subHours(parse(newDateTill), 1);
          this.setState({ dateFrom: newDateFrom });
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open date picker", message);
    }
  };

  timePickerTill = async () => {
    try {
      const { action, hour, minute } = await TimePickerAndroid.open({
        hour: getHours(parse(this.state.dateTill)),
        minute: getMinutes(parse(this.state.dateTill)),
        is24Hour: true // Will display '2 PM'
      });
      if (action !== TimePickerAndroid.dismissedAction) {
        // Selected hour (0-23), minute (0-59)
        let oldDateTill = this.state.dateTill;
        let dateWithTimeTill = parse(new Date(
          getYear(parse(oldDateTill)),
          getMonth(parse(oldDateTill)),
          getDate(parse(oldDateTill)),
          hour,
          minute
        ));

        this.setState({ dateTill: dateWithTimeTill });

        if (isBefore(parse(dateWithTimeTill), parse(this.state.dateFrom))) {
          this.setState({ dateFrom: subHours(parse(dateWithTimeTill), 1) });
        }
      }
    } catch ({ code, message }) {
      console.warn("Cannot open time picker", message);
    }
  };

  
  toogleSwitchReminder = () => {
    this.state.reminder
      ? this.setState({ reminder: false })
      : this.setState({ reminder: true });
  };
  setAllDay = () => {
    let dateFormat = parse(new Date(getYear(parse(this.state.dateFrom)), getMonth(parse(this.state.dateFrom)), getDate(parse(this.state.dateFrom)), "0", "0"))
    return dateFormat

}
toogleSwitchAllDay = () => {
  this.state.allDay
    ? this.setState({ allDay: false })
    : this.setState({ allDay: true, dateFrom: this.setAllDay() })
};
  toogleSwitchRepeat = () => {
    this.state.repeat
      ? this.setState({ repeat: false })
      : this.setState({ repeat: true });
  };

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }

  getEventReminder = () => {
    if (this.state.reminder) {
      return subMinutes(parse(this.state.dateFrom), this.state.reminderValue.value);
    } else {
      return "";
    }
  };

  convertToText(itemUuid, timestamp) {


    let eventReminder = this.getEventReminder();
    Keyboard.dismiss();
    let valueForEncryption = {
      uuid: itemUuid,
      dateFrom: this.state.dateFrom.toString(),
      dateTill: this.state.dateTill.toString(),
      allDay: this.state.allDay.toString(),
      timezone: this.state.timezone.toString(),
      text: this.state.text,
      location: this.state.location,
      notes: this.state.notes,
      reminder: eventReminder.toString(),
      calendar: this.state.selectedCalendar.uuid,
      repeat: this.state.repeat.value ? this.state.repeat : "",
      repeatCount: this.state.repeat.value ? this.state.repeatCount : "",
      remindBefore: this.state.reminderValue,
      isFavourite: "false",
      updated: timestamp.toString()
    };
    return valueForEncryption;
  }

  convertToJson(string) {
    let eventData = JSON.parse(string);
    return eventData;
  }

  saveEvent() {
    let uuid = createId("events");
    let timestamp = parse(new Date())

    let dataForEncryption = JSON.stringify(this.convertToText(uuid, timestamp));
  
    let encryptedData = encryptData(
      dataForEncryption,
      this.props.cryptoPassword
    );

    this.props.saveNewItem(
      {
        uuid: uuid,
        data: encryptedData,
        updated: timestamp.toString(),
        parrent: this.state.selectedCalendar.uuid,
        shared: "",
        type: "events",
        isLocal: "true",
        needSync: "true"
      },
      {
        uuid: uuid,
        dateFrom: this.state.dateFrom.toString(),
        dateTill: this.state.dateTill.toString(),
        allDay: this.state.allDay.toString(),
      timezone: this.state.timezone.toString(),
        uuid: uuid,
        text: this.state.text,
        location: this.state.location,
        notes: this.state.notes,
        reminder: this.getEventReminder().toString(),
        calendar: this.state.selectedCalendar.uuid,
        updated: timestamp.toString(),
        repeat: this.state.repeat.value ? this.state.repeat : "",
        repeatCount: this.state.repeat.value ? this.state.repeatCount : "",
        remindBefore: this.state.reminderValue,
        isFavourite: "false"
      },
      "events",
      "Event created"
    );
    NavigationService.navigate("Calendar")
  }

  fetchEvents() {
    const url = "https://api.hideplan.com/fetch/events";

    fetch(url, { method: "GET", credentials: "include" })
      .then(response => response.json())
      .then(data => {
        return;
      });
  }




  componentWillMount() {
    let formatedMinutes = setMinutes(parse(new Date()), "00");
    let dateNow;
    let dateTill;
    if (this.props.dataFromAgenda) {
      dateNow = this.props.dataFromAgenda.date;
      dateTill = addHours(parse(dateNow), 1);
      this.setState({ dateFrom: dateNow, dateTill: dateTill });
    } else {
      dateNow = addHours(parse(formatedMinutes), 1);
      dateTill = addHours(parse(formatedMinutes), 2);
      this.setState({ dateFrom: dateNow, dateTill: dateTill });
    }
    this.setState({ selectedCalendar: this.props.calendars[0] });
  }

  selectOption = (optionName, option) => {
    this.setState({ [optionName]: option });
  };
/*   getTimezone = () => {
    let timezone
    let time
    if (this.state.timezone == "device") {
      let localDate = parse(new Date())
      timezone = format(localDate, 'zzzz')
      time = format(localDate, 'zzz')
    } else {
      timezone = this.state.timezone.name
      time = this.state.timezone.value
    }
    return {name: timezone, value: time}
  }

  parseDate = (date) => {
    let formatedDate
    if (this.state.timezone == "device") {
      formatedDate = parse(date)
    } else {
      formatedDate = format(new Date(date), "yyyy-MM-dd HH:mm:ssXXX", { timeZone: this.state.timezone.name })
      formatedDate = parseISO(formatedDate)
    }
    console.log(this.state.timezone.name)
    console.log(formatedDate)
    return formatedDate
  }
*/

  selectTimezone = (item) => {
    this.setState({ timezone: item, modalTimeVisible: false })
  }

  getRepeatCountOptions = () => {
    const options = []
    for (let i=1; i<41; i++) {
      let item
      if (i == 1) {
        item = {label: i.toString() + " time", value: i.toString()}
      } else {
        item = {label: i.toString() + " times", value: i.toString()}
      }
      options.push(item)
    }
    return options
  }


 

  getReapeatOptions = () => {
    const options = [
      { label: "No repeat", value: false },
      { label: "day", value: "day" },
      { label: "week", value: "week" },
      { label: "month", value: "month" },
      { label: "year", value: "year" },
    ];
    return options
  }


  getReminderOptions = () => {
    let options = [
      { label: "on start", value: "0" },
      { label: "5 minutes before", value: "5" },
      { label: "15 minutes before", value: "15" },
      { label: "hour before", value: "60" },
      { label: "6 hours before", value: "360" },
      { label: "day before", value: "1440" },
      { label: "week before", value: "10080" }
    ];
    return options
  }

  componentDidMount() {
    this.setState({ timezone: this.props.timezone})
  }

  render() {
    let calendarColor;
    let rowWidth = WIDTH - 58;
    if (this.state.selectedCalendar.color.s200) {
      if (this.props.darkTheme) {
        calendarColor = this.state.selectedCalendar.color.s200;
      } else {
        calendarColor = this.state.selectedCalendar.color.s600;
      }
    } else {
      calendarColor = this.state.selectedCalendar.color;
    }
    //let timezone = this.getTimezone()

    return (
      <View style={{ flex: 1, width: "100%" }}>
       
          {this.state.dialogReminderVisible
? <MyDialog
colors={this.props.colors}
darkTheme={this.props.darkTheme}
hide={this.hideModal}
title={"Remind me"}
content={() => {return  <ViewContent 
  stateName={"reminderValue"}
  currentValue={this.state.reminderValue}
  colors={this.props.colors}
  darkTheme={this.props.darkTheme}
  options={this.getReminderOptions()}
  hideModal={this.hideModal}
  func={this.selectOption}
  />
  }}
/>
: null
}
      {this.state.dialogRepeatVisible
? <MyDialog
colors={this.props.colors}
darkTheme={this.props.darkTheme}
hide={this.hideModal}
title={"Repeat every"}
content={() => {return  <ViewContent 
  stateName={"repeat"}
  currentValue={this.state.repeat}
  colors={this.props.colors}
  darkTheme={this.props.darkTheme}
  options={this.getReapeatOptions()}
  hideModal={this.hideModal}
  func={this.selectOption}
  />
  }}
/>
: null
}
      {this.state.dialogRepeatCountVisible
? <MyDialog
colors={this.props.colors}
darkTheme={this.props.darkTheme}
hide={this.hideModal}
title={"Set occurrence"}
content={() => {return  <ViewContent 
  stateName={"repeatCount"}
  currentValue={this.state.repeatCount}
  colors={this.props.colors}
  darkTheme={this.props.darkTheme}
  options={this.getRepeatCountOptions()}
  hideModal={this.hideModal}
  func={this.selectOption}
  />
  }}
/>
: null
}
      {this.state.dialogCalendarVisible
? <MyDialog
colors={this.props.colors}
darkTheme={this.props.darkTheme}
hide={this.hideModal}
title={"Select calendar"}
content={() => {return  <ViewContentCalendar
  stateName={"selectedCalendar"}
  colors={this.props.colors}
  darkTheme={this.props.darkTheme}
  options={this.props.calendars}
  hideModal={this.hideModal}
  func={this.selectOption}
  />
  }}
/>
: null
}
      

        <ScrollView style={{ flex: 1 }}>
          {/*TITLE
         minHeight: HEIGHT + (HEIGHT / 2 ) 
        */}
          <View
            style={{
              padding: 16
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 26,
                  marginRight: 16
                }}
              >
                <Icon name="clock" size={26} color={"transparent"} />
              </View>
              <TextInput
                placeholder="Title"
                placeholderTextColor={this.props.colors.gray}
                autoFocus={true}
                multiline={true}
                style={{
                  fontSize: 24,
                  color: this.props.colors.text,
                  paddingRight: 16,
                  width: WIDTH - 74
                }}
                value={this.state.text}
                onChangeText={text => this.setState({ text })}
              />
            </View>
          </View>

          <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />

          {/*CALENDAR*/}
          <TouchableNativeFeedback onPress={() => this.showDialog("dialogCalendarVisible")}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
            <View
              style={{
                padding: 16
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 26,
                    marginRight: 16
                  }}
                >
                  <Icon
                    name="checkbox-blank-circle"
                    size={24}
                    color={calendarColor}
                  />
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    color: this.props.colors.text
                  }}
                >
                  {this.state.selectedCalendar.calendar}
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

          <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />
          {/*DATEFROM*/}
          <TouchableNativeFeedback onPress={() => this.toogleSwitchAllDay()}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16
              }}
            >
              <View style={{ flexDirection: "row", width: "100%" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 26,
                    marginRight: 16
                  }}
                >
                  <Icon
                  name="calendar-range-outline"
                  size={26}
                    color={this.props.colors.gray}
                  />
                </View>

                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 8,
                    paddingBottom: 8,
                    width: WIDTH / 2 - 38
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: this.props.colors.text
                    }}
                  >
                    All day
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                    width: WIDTH / 2 - 38
                  }}
                >
                  <Switch
                                       color={this.props.colors.primary}

                    name="allDay"
                    value={this.state.allDay}
                    onValueChange={() => {
                      this.toogleSwitchAllDay();
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>
          <View
            style={{
              paddingLeft: 16,
              paddingRight: 16,
              
            }}
          >
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 26,
                  marginRight: 16
                }}
              >
                <Icon
                  name="calendar-range-outline"
                  size={26}
                  color={"transparent"}
                />
              </View>
              <TouchableNativeFeedback onPress={() => this.datePickerFrom()}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 8,
                    paddingBottom: 8,
                    width: WIDTH / 2 - 38
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: this.props.colors.text
                    }}
                  >
                    {this.state.dateFrom.toString().slice(4, 15)}
                  </Text>
                </View>
              </TouchableNativeFeedback>
              {!this.state.allDay
              ? <TouchableNativeFeedback onPress={() => this.timePickerFrom()}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
                <View
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                    width: WIDTH / 2 - 38
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: this.props.colors.text
                    }}
                  >
                    {this.state.dateFrom.toString().slice(16, 21)}
                  </Text>
                </View>
              </TouchableNativeFeedback>
                            : null
                          }
            </View>
          </View>

          {/*DATETILL*/}

          <View
            style={{
              paddingLeft: 16,
              paddingRight: 16
            }}
          >
            <View style={{ flexDirection: "row", width: "100%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 26,
                  marginRight: 16
                }}
              >
                <Icon
                  name="calendar-range-outline"
                  size={26}
                  color={"transparent"}
                />
              </View>
              <TouchableNativeFeedback onPress={() => this.datePickerTill()}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 8,
                    paddingBottom: 8,
                    width: WIDTH / 2 - 38
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: this.props.colors.text
                    }}
                  >
                    {this.state.dateTill.toString().slice(4, 15)}
                  </Text>
                </View>
              </TouchableNativeFeedback>
              {!this.state.allDay
              ? <TouchableNativeFeedback onPress={() => this.timePickerTill()}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
                <View
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                    width: WIDTH / 2 - 38
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: this.props.colors.text
                    }}
                  >
                    {this.state.dateTill.toString().slice(16, 21)}
                  </Text>
                </View>
              </TouchableNativeFeedback>
              : null
                  }
            </View>
          
          </View>
          
                  {/*TIMEZONE
                  {!this.state.allDay
              ? <TouchableNativeFeedback
              onPress={() =>  this.showModalTime()}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            >
            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16
              }}
            >
              <View style={{ flexDirection: "row", width: "100%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 26,
                  marginRight: 16
                }}
              >
                    <Icon name="earth" size={26}                   color={this.props.colors.gray}
 />
                  </View>

                  <View
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: 16,
                      paddingBottom: 16,
                      flexDirection: "column",
                    }}
                  >
                    <Text
                      style={{
                        color: this.props.colors.text,
    fontSize: 16,
    fontFamily: 'Poppins-Regular', 
    includeFontPadding: false
                      }}
                    >
                      {timezone.name}
                    </Text>
                    <Text style={{
  color: this.props.colors.gray,
  fontSize: 14,
  fontFamily: 'Poppins-Regular', 
  includeFontPadding: false
                    }}>
                      {timezone.value}
                    </Text>
                  </View>

                  
                </View>
              </View>
            </TouchableNativeFeedback>
                  : null
                  }*/}
          <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />
          {/*REPEAT */}
          <TouchableNativeFeedback
              onPress={() => this.showDialog("dialogRepeatVisible")}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            >
            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16
              }}
            >
              <View style={{ flexDirection: "row", width: "100%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 26,
                  marginRight: 16
                }}
              >
                    <Icon name="reload" size={26}                   color={this.props.colors.gray}
 />
                  </View>

                  <View
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: 16,
                      paddingBottom: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: this.props.colors.text
                      }}
                    >
                      {this.state.repeat.value ? `Repeat every ${this.state.repeat.label}` : this.state.repeat.label}
                    </Text>
                  </View>

                  
                </View>
              </View>
            </TouchableNativeFeedback>
            {this.state.repeat.value
          ? <TouchableNativeFeedback
              onPress={() => this.showDialog("dialogRepeatCountVisible")}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            >
            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16
              }}
            >
              <View style={{ flexDirection: "row", width: "100%" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 26,
                  marginRight: 16
                }}
              >
                    <Icon name="reload" size={26}                   color="transparent"
 />
                  </View>

                  <View
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: 16,
                      paddingBottom: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: this.props.colors.text
                      }}
                    >
                      {this.state.repeatCount.value ? `For ${this.state.repeatCount.label} times` : this.state.repeatCount.label}
                    </Text>
                  </View>


                </View>
              </View>
            </TouchableNativeFeedback>
            : null
                    }
          <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />
          {/*NOTIFICATION*/}
          <TouchableNativeFeedback onPress={() => this.toogleSwitchReminder()}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
            <View
              style={{
                paddingLeft: 16,
                paddingRight: 16
              }}
            >
              <View style={{ flexDirection: "row", width: "100%" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 26,
                    marginRight: 16
                  }}
                >
                  <Icon
                    name="bell-outline"
                    size={26}
                    color={this.props.colors.gray}
                  />
                </View>

                <View
                  style={{
                    alignItems: "flex-start",
                    justifyContent: "center",
                    paddingTop: 8,
                    paddingBottom: 8,
                    width: WIDTH / 2 - 38
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      color: this.props.colors.text
                    }}
                  >
                    Notification
                  </Text>
                </View>

                <View
                  style={{
                    alignItems: "flex-end",
                    justifyContent: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                    width: WIDTH / 2 - 38
                  }}
                >
                  <Switch
                                       color={this.props.colors.primary}

                    name="reminder"
                    value={this.state.reminder}
                    onValueChange={() => {
                      this.toogleSwitchReminder();
                    }}
                  />
                </View>
              </View>
            </View>
          </TouchableNativeFeedback>

          {/*REMINDER*/}
          {this.state.reminder ? (
            <TouchableNativeFeedback
              onPress={() => this.showDialog("dialogReminderVisible")}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            >
              <View
                style={{
                  paddingLeft: 16,
                  paddingRight: 16
                }}
              >
                <View style={{ flexDirection: "row", width: "100%" }}>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      width: 26,
                      marginRight: 16
                    }}
                  >
                    <Icon name="bell-outline" size={26} color={"transparent"} />
                  </View>

                  <View
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      paddingTop: 8,
                      paddingBottom: 8,
                      width: WIDTH / 2 - 38
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: this.props.colors.text
                      }}
                    >
                      Alert
                    </Text>
                  </View>

                  <View
                    style={{
                      alignItems: "flex-end",
                      justifyContent: "center",
                      paddingTop: 16,
                      paddingBottom: 16,
                      width: WIDTH / 2 - 38
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        color: this.props.colors.text
                      }}
                    >
                      {this.state.reminderValue.label}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableNativeFeedback>
          ) : null}

          <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />

          {/*LOCATION*/}
          <View
            style={{
              padding: 16
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  width: 26,
                  marginRight: 16
                }}
              >
                <Icon
                  name="map-marker-outline"
                  size={26}
                  color={this.props.colors.gray}
                />
              </View>
              <TextInput
                placeholder="Add location"
                placeholderTextColor={this.props.colors.gray}
                autoFocus={false}
                style={{
                  fontSize: 16,
                  margin: 0,
                  padding: 0,
                  color: this.props.colors.text,
                  paddingRight: 16,
                  width: WIDTH - 74
                }}
                value={this.state.location}
                onChangeText={location => this.setState({ location })}
              />
            </View>
          </View>

          <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />

          {/*NOTES*/}
          <View
            style={{
              padding: 16
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  justifyContent: "flex-start",
                  alignItems: "center",
                  width: 26,
                  marginRight: 16
                }}
              >
                <Icon
                  name="note-outline"
                  size={26}
                  color={this.props.colors.gray}
                />
              </View>
              <TextInput
                placeholder="Add notes"
                placeholderTextColor={this.props.colors.gray}
                autoFocus={false}
                multiline={true}
                style={{
                  fontSize: 16,
                  margin: 0,
                  padding: 0,
                  color: this.props.colors.text,
                  paddingRight: 16,
                  width: WIDTH - 74
                }}
                value={this.state.notes}
                onChangeText={notes => this.setState({ notes })}
              />
            </View>
          </View>
          <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />

        </ScrollView>
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
    borderColor: "gray"
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
    alignSelf: "center",
    alignItems: "center"
  }
});

export default class NewEventScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null
  };

  componentWillMount() {}
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,

      color: this.props.screenProps.colors.text,
      elevation: 0
    };
    const darkTheme = this.props.screenProps.darkTheme;

    return (
      <Container>

<StatusBar
            backgroundColor={this.props.screenProps.colors.surface
            }
            barStyle={darkTheme ? "light-content" : "light-content"}
          />

<AppHeader style={headerStyle}
        screen="events"
        darkTheme={this.props.screenProps.darkTheme}
        colors={this.props.screenProps.colors}
        title={""}
        hasHeaderShadow={false}
        menuIcon={() => { return (
          <IconButton 
          icon="arrow-left"
          theme={{dark: this.props.screenProps.darkTheme}}
          color={this.props.screenProps.colors.gray}
          size={24}
          onPress={() => this.props.navigation.goBack(null)}
        />)}}
        icons={[ <Button dark={!this.props.screenProps.darkTheme} style={{marginRight: 16}} uppercase={false} mode="contained" color={this.props.screenProps.colors.primary} onPress={() => this.refs.NewEvent.saveEvent()}
        >Save</Button>]}
        />
       
        <View
          style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: this.props.screenProps.colors.surface
          }}
        >
          {this.props.screenProps.calendars ? (
            <Event
              ref="NewEvent"
              cryptoPassword={this.props.screenProps.cryptoPassword}
              dataFromAgenda={this.props.navigation.state.params}
              fetchEventsFromServer={
                this.props.screenProps.fetchEventsFromServer
              }
              saveeventsToLocal={this.props.screenProps.saveEventsDataToLocal}
              saveEventAfterPost={this.props.screenProps.saveEventAfterPost}
              calendars={this.props.screenProps.calendars}
              darkTheme={this.props.screenProps.darkTheme}
              saveNewItem={this.props.screenProps.saveNewItem}
              primaryColor={this.props.screenProps.primaryColor}
              colors={this.props.screenProps.colors}
              timezone={this.props.screenProps.timezone}
            />
          ) : null}
        </View>
      </Container>
    );
  }
}

module.exports = NewEventScreen;
