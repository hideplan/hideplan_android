import React from "react";
//import "./Register.css";
import { StatusBar, View, Text, TextInput, StyleSheet, ScrollView, TouchableHighlight, Alert, TouchableNativeFeedback, TouchableWithoutFeedback, Button, TimePickerAndroid, DatePickerAndroid, Dimensions } from "react-native"
import { Keyboard } from 'react-native'
import CryptoJS from "crypto-js";
import { sendPost, hashForComparingChanges } from '../../functions.js';
import dateFns, { addHours, setMinutes, subMinutes, subHours, getYear, getMonth, getHours, getDate, isBefore, getMinutes } from "date-fns";
import { parse } from "../../functions";
var PushNotification = require('react-native-push-notification');
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Picker } from "native-base";
import { encryptData } from '../../encryptionFunctions';
import { Container, Header, Left, Body, Right, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { HeaderIcon, Modal } from '../../customComponents.js';
import { createId } from '../../functions';
import {MenuItem} from '../Moduls/react-native-material-menu/src/Menu.js';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MyModal } from "../../customComponents.js";
import { Switch } from 'react-native-paper';

import {Menu} from '../Moduls/react-native-material-menu/src/Menu.js';
import { AsyncStorage } from "react-native";

<script src="http://localhost:8097"></script>

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

//TODO CLEAN MENU FUNC, REFS 


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
      reminder: "",
      remindBefore: "",
      reminderValue: { label: "5 minutes before", value: "5" },
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
      selectedCalendar: "",
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
    if (this.state.reminder) {
      return subMinutes(this.state.dateFrom, this.state.reminderValue.value);
    } else {
      return "";
    }
  };
}

  convertToText(timestamp) {

    let repeatedValue

    if (this.state.repeat) {
      repeatedValue = {value: this.state.repeatValue, count: this.state.repeatCount}
    }
  
    let eventReminder = this.getEventReminder();
    Keyboard.dismiss()
    let valueForEncryption = {uuid: this.props.event.uuid, dateFrom: this.state.dateFrom.toString(), dateTill: this.state.dateTill.toString(), text: this.state.text, location: this.state.location, notes: this.state.notes, reminder: this.state.reminder ? eventReminder.toString() : "", calendar: this.props.event.calendar, repeat: this.state.repeat, repeated: repeatedValue, remindBefore: this.state.reminderValue, updated: timestamp.toString(), isFavourite: this.props.event.isFavourite}
    return valueForEncryption;
  }

  convertToJson(string) {
    let eventData = JSON.parse(string)
    return eventData;
  }

  editEvent = () => {
    let timestamp = new Date()

    let dataForEncryption = JSON.stringify(this.convertToText(timestamp));
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);

    this.props.editItem({
      "uuid": this.props.event.uuid, "data": encryptedData, "updated": timestamp.toString(), "parrent": this.props.event.calendar, "shared": "", type: "events", "isLocal": "true", "needSync": "true" }, {
        "dateFrom": this.state.dateFrom.toString(), "dateTill": this.state.dateTill.toString(), "uuid": this.props.event.uuid, "text": this.state.text, "location": this.state.location, "notes": this.state.notes, "reminder": this.getEventReminder(), "calendar": this.props.event.calendar, "isFavourite": this.props.event.isFavourite, "updated": timestamp.toString(), repeat: this.state.repeat, remindBefore: this.state.reminderValue
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



  
  componentWillMount () {
    this.setState({ 
      text: this.props.event.text,
      location: this.props.event.location,
      notes: this.props.event.notes,
      dateFrom: this.props.event.dateFrom,
      dateTill: this.props.event.dateTill,
      reminder: this.props.event.reminder ? true : false,
      remindBefore: this.props.event.remindBefore.value ? this.props.event.remindBefore :  null,
      
      repeat: this.props.event.repeat,
      calendar: this.props.event.calendar,
      selectedCalendar: this.props.selectedCalendar
    })

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
  }
  renderMenuNotification = () => {
    const options = [
      { label: "on start", value: "0" },
      { label: "5 minutes before", value: "5" },
      { label: "15 minutes before", value: "15" },
      { label: "hour before", value: "60" },
      { label: "6 hours before", value: "360" },
      { label: "day before", value: "1440" },
      { label: "week before", value: "10080" }
    ];
    return options.map(item => {
      return (
        <TouchableNativeFeedback
          onPress={() => {
            this.selectNotification(item), this.MyModalReminder.close();
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              padding: 16
            }}
          >
            <View
              style={{
                marginRight: 15
              }}
            >
              {this.state.reminderValue.value == item.value ? (
                <Icon
                  name="radiobox-marked"
                  size={24}
                  color={
                    this.props.colors.primary
                  }
                />
              ) : (
                <Icon
                  name="radiobox-blank"
                  size={24}
                  color={this.props.colors.gray }
                />
              )}
            </View>
            <Text
              style={{
                color: this.props.colors.gray,
                fontSize: 18
              }}
            >
              {item.label}
            </Text>
          </View>
        </TouchableNativeFeedback>
      );
    });
  };
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
  }

  renderMenuRepeatCount = () => {
    const options = [{label: "two", value: "2"}, {label: "three", value: "3"}, {label: "four", value: "4"}, {label: "five", value: "5"}, {label: "six", value: "6"}, {label: "seven", value: "7"}]
    return (
      options.map(item => {

        return (
          <TouchableNativeFeedback onPress={() => this.selectRepeatCount(item)}>
          <View style={{display: "flex", width: "100%", padding: 8}}>
          <Text 
            style={{color: this.props.colors.text, fontSize: 20 }}> 
            {item.label}
            </Text>
            </View>
            </TouchableNativeFeedback>

        )
      })
    )
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
  selectCalendar = (calendar) => {
    this.setState({ selectedCalendar: calendar})
  }

  renderMenuItems = () => {
    return this.props.calendars.map(item => {
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

      const colorDot = {
        height: 18,
        width: 18,
        borderRadius: 9,
        marginRight: 15,
        backgroundColor: calendarColor
      };

      return (
        <TouchableNativeFeedback
          onPress={() => {
            this.selectCalendar(item), this.MyModal.close();
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              width: "100%",
              padding: 16
            }}
          >
            <View style={colorDot}></View>
            <Text
              style={{
                color: this.props.colors.gray,
                fontSize: 18
              }}
            >
              {item.calendar}
            </Text>
          </View>
        </TouchableNativeFeedback>
      );
    });
  };
  getCalendarColor = () => {
    if (this.state.selectedCalendar.color.s200) {
      if (this.props.darkTheme) {
        calendarColor = this.state.selectedCalendar.color.s200;
      } else {
        calendarColor = this.state.selectedCalendar.color.s600;
      }
    } else {
      calendarColor = this.state.selectedCalendar.color;
    }
    return calendarColor
  }

  componentDidMount () {
   
  }
//s200
  render() {
    let rowWidth = WIDTH - 58;

    let calendarColor = this.getCalendarColor()


    return (
      <View style={{ flex: 1, width: "100%" }}>
        <MyModal
          ref={ref => {
            this.MyModal = ref;
          }}
          itemCount={this.props.calendars.length}
          darkTheme={this.props.darkTheme}
        >
          <View style={{ flex: 1, width: "100%" }}>
            <ScrollView style={{ flex: 1, width: "100%" }}>
              {this.renderMenuItems()}
            </ScrollView>
          </View>
        </MyModal>
        <MyModal
          ref={ref => {
            this.MyModalReminder = ref;
          }}
          itemCount={7}
          darkTheme={this.props.darkTheme}
        >
          <View style={{ flex: 1, width: "100%" }}>
            <ScrollView style={{ flex: 1, width: "100%" }}>
              {this.renderMenuNotification()}
            </ScrollView>
          </View>
        </MyModal>
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
                autoFocus={false}
                style={{
                  fontSize: 28,
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
          <TouchableNativeFeedback onPress={() => this.MyModal.open()}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
          >
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
                    fontSize: 18,
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
              <TouchableNativeFeedback onPress={() => this.datePickerFrom()}
              background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
                >
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
                      fontSize: 18,
                      color: this.props.colors.text
                    }}
                  >
                    {this.state.dateFrom.toString().slice(4, 15)}
                  </Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => this.timePickerFrom()}
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
                      fontSize: 18,
                      color: this.props.colors.text
                    }}
                  >
                    {this.state.dateFrom.toString().slice(16, 21)}
                  </Text>
                </View>
              </TouchableNativeFeedback>
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
                      fontSize: 18,
                      color: this.props.colors.text
                    }}
                  >
                    {this.state.dateTill.toString().slice(4, 15)}
                  </Text>
                </View>
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => this.timePickerTill()} background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
    this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
    >
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
                      fontSize: 18,
                      color: this.props.colors.text
                    }}
                  >
                    {this.state.dateTill.toString().slice(16, 21)}
                  </Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>

          <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />
          {/*NOTIFICATION*/}
          <TouchableNativeFeedback onPress={() => this.toogleSwitchReminder()} background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
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
                      fontSize: 18,
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
              onPress={() => this.MyModalReminder.open()}
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
                        fontSize: 18,
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
                        fontSize: 18,
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
                placeholder="Location"
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
                placeholder="Notes"
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
      selectedCalendar: ""
    };
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    }

   


   
    convertToText = (item, time) => {
      let favouriteValue;
      if (item.isFavourite == "true") {
        favouriteValue = "false"
      } else {
        favouriteValue = "true"
      }
      let valueForEncryption = {uuid: item.uuid, dateFrom: item.dateFrom.toString(), dateTill: item.dateTill.toString(), text: item.text, location: item.location, notes: item.notes, reminder: item.reminder, calendar: item.calendar, repeat: item.repeat, repeated: item.repeated, remindBefore: item.remindBefore, isFavourite: favouriteValue, updated: time.toString()}
      return valueForEncryption;
    }
    triggerFavourite = (item) => {
      let encryptedData
      let isFavourite;
      let timestamp = new Date()
  
      if (item.isFavourite) {
        isFavourite = false
      } else {
        isFavourite = true
      }
    
      let dataForEncryption = JSON.stringify(this.convertToText(item, timestamp));
          encryptedData = encryptData(dataForEncryption, this.props.screenProps.cryptoPassword);
      
      
          this.props.screenProps.editItem({uuid: item.uuid, data: encryptedData, updated: timestamp.toString(), type: "events", parrent: item.calendar, needSync: true}, {"uuid": item.uuid, "dateFrom": item.dateFrom.toString(), "dateTill": item.dateTill.toString(), "text": item.text, "location": item.location, "notes": item.notes, "reminder": item.reminder, "remindBefore": item.remindBefore, "calendar": item.calendar, "repeat": item.repeat, "repeated": item.repeated, "isFavourite": isFavourite
          }, this.props.screenProps.events)
          NavigationService.navigate('Calendar')

    }
    componentWillMount() {
      this.waitForData()
    }


    deleteItem = (item) => {
      let itemObj = {...item, ...{type: "events"}}
      this.props.screenProps.deleteItem(itemObj)
      NavigationService.navigate('Calendar')

    }
    deleteAlert = (item) => {
      Alert.alert(
        'Delete event',
        `Do you want to delete event "${item.text}"?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => {this.deleteItem(item)},
          }
          ],
      );
    }

    setData = () => {
      this.props.screenProps.calendars.map(item => {
        if (item.uuid == this.props.navigation.state.params.calendar) {
          this.setState({ selectedCalendar: item })
        }
      })
    }
    waitForData = () => {
      this.props.screenProps.calendars.length > 0
      ? this.setData()
      : setTimeout(() => {this.waitForData()}, 400)
    }

  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme
    

    return (
      <Container>
      <Header 
   style={headerStyle}
   >
                         <StatusBar backgroundColor={this.props.screenProps.colors.surface} barStyle={darkTheme ? "light-content" : "dark-content"} />
     <Left>
    <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="arrow-left" color={this.props.screenProps.colors.gray } headerFunction={() => {this.props.navigation.goBack(null)
    }}/>

      </Left> 
     <Body>
     <Title style={{color: this.props.screenProps.colors.text}}>Edit event</Title>
     </Body>
     <Right>
     <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="delete" color={this.props.screenProps.colors.gray } headerFunction={() => {
          this.deleteAlert(this.props.navigation.state.params)
        }} />
                  <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon={this.props.navigation.state.params.isFavourite == "true" ? "star" : "star-outline"} color={this.props.screenProps.colors.gray } headerFunction={() => {
          this.triggerFavourite(this.props.navigation.state.params)
        }} />
     <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="check" color={this.props.screenProps.colors.gray } headerFunction={() => {this.refs.EventIntput.editEvent()
      }} />
      </Right>

</Header>
<View style={{ flex: 1, alignItems: 'center', backgroundColor: this.props.screenProps.colors.surface }}>
{this.props.screenProps.calendars && this.props.navigation.state.params && this.state.selectedCalendar
        ?      <EventIntput 
      ref="EventIntput"
      event={this.props.navigation.state.params}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      editItem={this.props.screenProps.editItem}
      calendars={this.props.screenProps.calendars}
      selectedCalendar={this.state.selectedCalendar}
      darkTheme={this.props.screenProps.darkTheme}
      saveNewItem={this.props.screenProps.saveNewItem}
      primaryColor={this.props.screenProps.primaryColor}
      colors={this.props.screenProps.colors}
      routeCalendar={this.props.navigation.state.params.calendar}
      />
      : null
    }
      </View>
      </Container>

    );
  }
}



module.exports = EditEventScreen;
