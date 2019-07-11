import React from "react";
//import "./Register.css";
import { Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, Easing, DrawerLayoutAndroid, UIManager } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon } from '../../customComponents.js';
import WeekView from "./WeekView.js"
import WeekSwipe from "./WeekSwipe.js"
import MonthView from "./MonthView.js"
import ErrorMsg from "../Error/ErrorMsg.js"
import { DrawerActions } from 'react-navigation';
import DayView from "./DayView.js"
import Agenda from "./Agenda.js"
import { Toast } from '../../customComponents.js';
import { Keyboard } from 'react-native'
import { encryptData } from '../../encryptionFunctions';
import { sendPost } from '../../functions.js';
import { Container, Header, Left, Body, Right, Icon, Title, Radio, Fab, Picker, Spinner } from 'native-base';
import { createId } from '../../functions';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Drawer from '../../drawer/Drawer.js';
import { BottomSheet, BottomSheetExpanded } from '../../bottomSheet/BottomSheet.js';

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



class RadioCalendar extends React.Component {

  render() {

    const radioOffOutline = {
      width: 22,
      height: 22,
      border: "solid",
      borderColor: "gray",
      borderWidth: 2,
      borderRadius: 11,
      position: "relative",
      margin: 0,
      padding: 0,
    }


    const radioOnOutline = {
      width: 22,
      height: 22,
      border: "solid",
      borderColor: this.props.color,
      borderWidth: 2,
      borderRadius: 11,
      position: "relative",
      margin: 0,
      padding: 0,
      alignItems: "center"
    }

    const radioOnInline = {
      width: 12,
      height: 12,
      borderRadius: 7,
      position: "absolute",
      left: 3,
      top: 3,
      backgroundColor: this.props.color,

    }



    return (
      <View style={{ margin: 0, padding: 0, justifyContent: "center", marginRight: 7 }}>
        {this.props.isChecked
          ? <View style={radioOnOutline}><View style={radioOnInline} /></View>
          : <View style={radioOffOutline}></View>
        }
      </View>
    )
  }
}



class MenuDrawer extends React.Component {
  constructor(props) {
    super(props);
   
  }
  renderCalendars = (data) => {
    const drawerRow = {
      width: "80%",
      flexDirection: "row",
      padding: 10,
      alignItems: "center"
    }
    const drawerIcon = {
      width: 40,
    }
    const drawerText = {
      width: 230,
      marginRight: 20,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    const textStyle = {
      color: this.props.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    const textStyleGray = {
      color: "gray",
      fontSize: 18,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    return data.map(item => {
      return <View style={{width: 280, flexDirection: "row" }}>
<TouchableNativeFeedback
      onPress={() => { this.props.checkCalendar(item.uuid) }}
      background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

    >
<View style={drawerRow}>
<View style={drawerIcon}>
<Radio onPress={() => { this.props.checkCalendar(item.uuid) }} selected={item.isChecked} selectedColor={item.color} color="gray"/></View>
<View style={drawerText}>
{item.isChecked 
?<Text style={textStyle}>{item.calendar}</Text>
:<Text style={textStyleGray}>{item.calendar}</Text>
}
</View>
</View>
</TouchableNativeFeedback>

<TouchableNativeFeedback
      onPress={() => { this.props.closeDrawer(),NavigationService.navigate('EditCalendar', item)  }}
      background={TouchableNativeFeedback.Ripple('#95A3A4', false)}
    >
<View style={{width: "20%", justifyContent: "center", alignItems: "center"}}>
<Ionicons name="md-settings" size={16} color={this.props.darkTheme ? "white" : "black"} />
  </View>
  </TouchableNativeFeedback>

</View>

    })
  }
  render() {
    const drawerStyle = {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-start",

    }
    const drawerBody = {
      padding: 10
    }
    const drawerRow = {
      width: 280,
      flexDirection: "row",
      padding: 10,
      alignItems: "center"
    }
    const drawerIcon = {
      width: 40,
    }
    const drawerText = {
      width: 230,
      marginRight: 20,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    const textStyle = {
      color: this.props.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    const textStyleGray = {
      color: "gray",
      fontSize: 18,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    return (
      <View style={drawerStyle}>
                <View style={drawerBody}>
                <TouchableNativeFeedback
            onPress={() => { this.props.navigateToSettings(), this.props.closeDrawer() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-settings" size={26} color={this.props.darkTheme ? "white" : "black"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Settings</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToNewCalendar(), this.props.closeDrawer() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-add" size={26} color={this.props.darkTheme ? "white" : "black"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Add new calendar</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>

       
        <View style={{ marginTop: 4, marginBottom: 8, left: 0, borderBottomWidth: 0.4, borderBottomColor: "gray", width: 300 }} />


        
        {this.props.calendars.length > 0
          ? <View style={drawerBody}>
          <Text style={{ fontSize: 16, color: "#929390",       fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,}}>Calendars:</Text>
            <ScrollView>
             {this.renderCalendars(this.props.calendars)}
                
                
              
            </ScrollView>
          </View>
          : null
        }

      </View>
    )
  }
}
    
           

class AddListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendar: "",
      color: "dodgerblue",
      colorsVisible: false

    };
  }

  showColors = () => {
    this.state.colorsVisible
      ? this.setState({ colorsVisible: false })
      : this.setState({ colorsVisible: true }, Keyboard.dismiss())
  }
  selectColor = (color) => {
    this.setState({ color: color, colorsVisible: false })
  }
  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }

  renderColors = (colorList) => {
    return colorList.map(color => {
      return <TouchableNativeFeedback onPress={() => this.selectColor(color)}>
        <View style={{
          width: 30,
          height: 30,
          borderRadius: 15,
          marginBottom: 4,
          backgroundColor: color,
          zIndex: 999999999999,
          elevation: 10,

        }}
        >
        </View>
      </TouchableNativeFeedback>
    
    })
  }


  render() {

    const wrapper = {
      display: "flex",
      position: "absolute",
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(27, 23, 37, 0.473)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20

    }

    const body = {
      padding: 20,
      backgroundColor: "#202526",
      display: "flex",
      width: (WIDTH / 3) * 2,
      top: HEIGHT / 8,
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 12,
      elevation: 5,
      zIndex: 9999999999999,
    }


    const textStyle = {
      color: "white",
      fontSize: 20,
      padding: 8,
      backgroundColor: "#373835",
      borderColor: "gray",
      borderRadius: 4,
      width: "100%",
      flex: 1,
    }
    const floatRow = {
      flex: 1,
      flexDirection: "row",
      padding: 5,
      zIndex: 9999999999999,
    }
    const floatColorBox = {
      padding: 9,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#1C1E28",
      borderBottomLeftRadius: 6,
      borderTopLeftRadius: 6,
      alignSelf: "center",
      zIndex: 9999999999999,

    }
    const floatColorContent = {
      backgroundColor: "#1C1E28",
      width: 30,
      position: "absolute",
      zIndex: 9999999999999, elevation: 4,
      height: 150
    }
    const floatColorInput = {
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: this.state.color,
      zIndex: 9999999999,
      elevation: 15,
      flex: 1,

    }


    const colorList = ["dodgerblue", "crimson", "#9B287B", "#1D84B5", "#1C448E", "#EFEF1A"]

    return (
      <TouchableWithoutFeedback onPress={() => { this.props.showAddListModal() }}>
        <View style={wrapper}>
          <TouchableWithoutFeedback>
            <View style={body}>

              <View style={{ flex: 1, width: "100%" }}>
                <Text style={{ color: "#D8D6D6", fontSize: 18, paddingBottom: 4 }}>Add new calendar</Text>
              </View>

              <View style={floatRow}>

           
                <TouchableNativeFeedback onPress={() => { this.showColors() }}>
                  <View style={floatColorBox}>

                    <View style={floatColorInput}>
                  
                    </View>
                  </View>
                </TouchableNativeFeedback>

                {this.state.colorsVisible
                      ?
                        this.renderColors(colorList)

                      : 
                      <TextInput
                        placeholderTextColor="gray"
                        style={textStyle}
                        autoFocus={true}
                        type="text"
                        name="calendar"
                        value={this.state.calendar}
                        onChangeText={(calendar) => this.setState({ calendar })}
                      />
                    }




              </View>

              <View style={{ display: "flex", justifyContent: "center" }}>
                <TouchableNativeFeedback>
                  <Button
                    style={{ color: "red" }}
                    color="#EF2647"
                    disabled={this.state.calendar.length < 1}
                    title="Save"
                    onPress={() => { this.props.saveCalendar(this.state.calendar, this.state.color) }}
                  />
                </TouchableNativeFeedback>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

class Dropdown extends React.Component {
  constructor(props) {
    super(props);
    this.top = new Animated.Value(0);
    this.topBack = new Animated.Value(0);
    this.state = {
      isShown: false,
    };
  }

  triggerMenuVisibility = () => {
    this.state.isShown
      ? (this.hideFromView(), this.setState({ isShown: false }))
      : (this.show(), this.setState({ isShown: true }))
  }


  show = () => {
    Animated.sequence([
      Animated.timing(this.top, {
        toValue: 80,
        easing: Easing.back(),
        duration: 20000,
      }),
    ]).start();
  }

  hideFromView = () => {
    Animated.sequence([
      Animated.timing(this.top, {
        toValue: 0,
        duration: 200,
      }),
    ]).start();
  }

  componentDidMount() {
    this.show()
  }

  render() {
    const wrapperStyle = {
      display: "flex",
      position: "absolute",
      height: "100%",
      width: "100%",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99999

    }
    const drawerStyle = {
      flex: 1,
      position: "absolute",
      top: 0,
      right: 0,
      padding: 14,
      backgroundColor: this.props.darkTheme ? "#373E40" : "#485154",
      elevation: 10,
      zIndex: 99991000,
      borderRadius: 4
    }

    const rowStyle = {
      flex: 1, 
      flexDirection: "row",
      padding: 6,
      width: "100%"

    }
    return (
      <View>
      {this.state.isShown
      ?  <TouchableWithoutFeedback onPress={() => this.props.openViewOptions()}>
      <View style={wrapperStyle}>
        <Animated.View style={drawerStyle}  >
          <View style={{ justifyContent: "flex-start", alignItems: "flex-start", zIndex: 9999999999999, elevation: 8 }}>
            <TouchableNativeFeedback
              activeOpacity={1}
              name="agenda"
              onPress={() => { this.props.changeView("agenda") }}
            >
              <View style={rowStyle} name="agenda">
                <Radio color={"#D6D6D6"} selectedColor={"dodgerblue"} selected={this.props.view === "agenda"} />

                <Text style={{ marginLeft: 10, fontSize: 18, color: this.props.view === "agenda" ? "dodgerblue" : "white" }}>Agenda</Text>
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback
              onPress={() => { this.props.changeView("day") }}
            >
              <View style={rowStyle} name="day">
                <Radio color={"#D6D6D6"} selectedColor={"dodgerblue"} selected={this.props.view === "day"} />

                <Text style={{ marginLeft: 10, fontSize: 18, color: this.props.view === "day" ? "dodgerblue" : "white" }}>Day</Text>
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback
              onPress={() => { this.props.changeView("week") }}
            >
              <View style={rowStyle} name="week">
                <Radio color={"#D6D6D6"} selectedColor={"dodgerblue"} selected={this.props.view === "week"} />

                <Text style={{ marginLeft: 10, fontSize: 18, color: this.props.view === "week" ? "dodgerblue" : "white" }}>Week</Text>
              </View>
            </TouchableNativeFeedback>

            <TouchableNativeFeedback
              onPress={() => { this.props.changeView("month") }}
            >
              <View style={rowStyle} name="month">
                <Radio color={"#D6D6D6"} selectedColor={"dodgerblue"} selected={this.props.view === "month"} />

                <Text style={{ marginLeft: 10, fontSize: 18, color: this.props.view === "month" ? "dodgerblue" : "white" }}>Month</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </Animated.View>
      </View>
    </TouchableWithoutFeedback>
      : null
      }
           </View>

    )
  }
}



let { width } = Dimensions.get('window');

class CalendarMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWeek: new Date(),
      currentDay: "",
      dayData: [],
      weekDays: [],
      index: "",
      weekIndex: "",
      testArray: [],
      selectedIndex: "",

    }
  }



  openDay = (day) => {
    this.setState({ selectedDate: day }, this.props.switchViewToDay())
  }




  componentDidMount() {


    //Load all events for yesterday, today and tomorrow

  }



  componentWillMount() {
    // Save current day in state for first load
    const currentDayState = new Date();
    this.setState({ currentDay: currentDayState, })
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "rgb(29, 31, 38)" }}>

        {this.props.calendarView === "agenda" && this.props.calendars
          ? <Agenda ref={(el) => this.agenda = el}
          darkTheme={this.props.darkTheme}
            decryptedData={this.props.decryptedData}
            currentDay={this.props.currentDay}
            selectedDate={this.props.selectedDate}
            selectDate={this.onDateClick}
            width={width}
            onSwipeAgendaLeft={this.onSwipeAgendaLeft}
            onSwipeAgendaRight={this.onSwipeAgendaRight}
            index={this.props.index}
            weeksData={this.props.weekDays}
            selectedIndex={this.props.selectedIndex}
            changeDate={this.props.changeDate}
            weekIndex={this.props.weekIndex}
            setDataToArray={this.props.setDataToArray}
            addNewDataToList={this.addNewDataToList}
            calendars={this.props.calendars}
            deleteItem={this.props.deleteItem}
            editItem={this.props.editItem}
            cryptoPassword={this.props.cryptoPassword}
            allData={this.props.allData}
            selectItem={this.props.selectItem}
            BottomSheet={this.props.BottomSheet}
            refreshData={this.props.refreshData}

          />
          : null
        }

        {this.props.calendarView === "day" && this.props.calendars
          ? <DayView ref={(el) => this.agenda = el}
          darkTheme={this.props.darkTheme}
            decryptedData={this.props.dayData}
            currentDay={this.props.currentDay}
            selectedDate={this.props.selectedDate}
            selectDate={this.onDateClick}
            width={width}
            onSwipeAgendaLeft={this.onSwipeAgendaLeft}
            onSwipeAgendaRight={this.onSwipeAgendaRight}
            index={this.state.index}
            weeksData={this.props.weekDays}
            selectedIndex={this.props.selectedIndex}
            changeDate={this.props.changeDate}
            weekIndex={this.props.weekIndex}
            setDataToArray={this.props.setDataToArray}
            addNewDataToList={this.addNewDataToList}
            calendars={this.props.calendars}
            allData={this.props.allData}
            changeHeaderTitle={this.props.changeHeaderTitle}
            deleteItem={this.props.deleteItem}
            editItem={this.props.editItem}
            cryptoPassword={this.props.cryptoPassword}
            selectItem={this.props.selectItem}
            BottomSheet={this.props.BottomSheet}
            resetDateFromMonth={this.props.resetDateFromMonth}
            dateFromMonth={this.props.dateFromMonth}
            refreshData={this.props.refreshData}

          />
          : null
        }


{this.props.calendarView === "week" && this.props.calendars
          ? <WeekSwipe ref={(el) => this.agenda = el}
          darkTheme={this.props.darkTheme}
            decryptedData={this.props.dayData}
            currentDay={this.props.currentDay}
            selectedDate={this.props.selectedDate}
            selectDate={this.onDateClick}
            width={width}
            onSwipeAgendaLeft={this.onSwipeAgendaLeft}
            onSwipeAgendaRight={this.onSwipeAgendaRight}
            index={this.props.index}
            weeksData={this.props.weekDays}
            selectedIndex={this.props.selectedIndex}
            changeDate={this.props.changeDate}
            weekIndex={this.props.weekIndex}
            setDataToArray={this.props.setDataToArray}
            addNewDataToList={this.addNewDataToList}
            calendars={this.props.calendars}
            openDay={this.openDay}
            editEvent={this.props.editEvent}
            cryptoPassword={this.props.cryptoPassword}
            loadMoreData={this.props.loadMoreData}
            weeksData={this.props.weekDays}
            allData={this.props.allData}
            changeHeaderTitle={this.props.changeHeaderTitle}
            deleteItem={this.props.deleteItem}
            editItem={this.props.editItem}
            selectItem={this.props.selectItem}
            BottomSheet={this.props.BottomSheet}
          />
          : null
        }

{this.props.calendarView === "month" && this.props.calendars
? <MonthView ref={(el) => this.agenda = el}
  darkTheme={this.props.darkTheme}
  decryptedData={this.props.dayData}
  currentDay={this.props.currentDay}
  selectedDate={this.props.selectedDate}
  selectDate={this.onDateClick}
  width={width}
  onSwipeAgendaLeft={this.onSwipeAgendaLeft}
  onSwipeAgendaRight={this.onSwipeAgendaRight}
  index={this.props.index}
  weeksData={this.props.weekDays}
  selectedIndex={this.props.selectedIndex}
  changeDate={this.props.changeDate}
  weekIndex={this.props.weekIndex}
  setDataToArray={this.props.setDataToArray}
  addNewDataToList={this.addNewDataToList}
  calendars={this.props.calendars}
  openDay={this.openDay}
  editEvent={this.props.editEvent}
  cryptoPassword={this.props.cryptoPassword}
  loadMoreData={this.props.loadMoreData}
  weeksData={this.props.weekDays}
  allData={this.props.allData}
  changeHeaderTitle={this.props.changeHeaderTitle}
  deleteItem={this.props.deleteItem}
  editItem={this.props.editItem}
  switchFromMonth={this.props.switchFromMonth}
/>
: null
}
      </View>
    )
  }
}


export default class CalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();

    this.state = {
      currentDay: "",
      selectedDate: new Date(),
      calendarView: "agenda",
      toastIsVisible: false,
      toastType: "",
      toastText: "",
      toastDuration: "",
      viewOptionsVisible: false,
      addListModalIsVisible: false,
      selectedItem: "",
      dateFromMonth: "",
      calendarIsMounted: false,
    }
  }
  static navigationOptions = {
    header: null,
    };
    selectItem = (item) => {
      this.setState({ selectedItem: item })
    }
    deleteItem = (item) => {
      let itemObj = {...item, ...{type: "events"}}
      this.props.screenProps.deleteItem(itemObj)
    }
    deleteAlert = (itemName, item) => {
      Alert.alert(
        'Delete event',
        `Do you want to delete event "${itemName}"?`,
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
    convertToText = (item, time) => {
      let favouriteValue;
      if (item.isFavourite) {
        favouriteValue = false
      } else {
        favouriteValue = true
      }
      let valueForEncryption = {uuid: item.uuid, dateFrom: item.dateFrom.toString(), dateTill: item.dateTill.toString(), text: item.text, location: item.location, notes: item.notes, reminder: item.reminder, calendar: item.calendar, repeat: item.repeat, repeated: item.repeated, isFavourite: favouriteValue}
      return valueForEncryption;
    }
    triggerFavourite = (item) => {
      let encryptedData
      let isFavourite;
      let timestamp = new Date().getTime()
  
      if (item.isFavourite) {
        isFavourite = false
      } else {
        isFavourite = true
      }
    
      let dataForEncryption = JSON.stringify(this.convertToText(item, timestamp));
          encryptedData = encryptData(dataForEncryption, this.props.screenProps.cryptoPassword);
      
      
          this.props.screenProps.editItem({uuid: item.uuid, data: encryptedData, updated: timestamp, type: "events", parrent: item.calendar, needSync: true}, {"uuid": item.uuid, "dateFrom": item.dateFrom.toString(), "dateTill": item.dateTill.toString(), "text": item.text, "location": item.location, "notes": item.notes, "reminder": item.reminder, "calendar": item.calendar, "repeat": item.repeat, "repeated": item.repeated, "isFavourite": isFavourite
          }, this.props.screenProps.events)
    }
  switchFromMonth = (date) => {
    //Switch view from month to day on click
    this.setState({ dateFromMonth: date, calendarView: "day"})
  }  
  resetDateFromMonth = () => {
    this.setState({dateFromMonth: ""})
  }

  changeView = (view) => {
    this._menu.hide();
    this.setState({ calendarView: view })
    if (view == "agenda") {
      this.setState({ selectedDate: {month: "Agenda", year: getYear(new Date())} })
    } else {
      this.changeHeaderTitle(new Date())
    }
  }

  switchViewToDay = () => {
    //Switch to one day view when clicking on date
    this.setState({
      calendarView: "day"
    })
  }

  openViewOptions = () => {
    this.state.viewOptionsVisible
      ? this.setState({ viewOptionsVisible: false })
      : this.setState({ viewOptionsVisible: true })
      
  }

  showAddListModal = () => {
    this.state.addListModalIsVisible
      ? this.setState({ addListModalIsVisible: false })
      : this.setState({ addListModalIsVisible: true })
  }




  
  formatDate = (dateObj) => {
    let dateFormat
    let title

    if (this.state.calendarView === "week" || this.state.calendarView === "month") {
      dateFormat = "MMMM YYYY";
      title = dateFns.format(dateObj, dateFormat)
    } else if (this.state.calendarView === "day") {
      dateFormat = "DD MMMM YYYY"
      title = dateFns.format(dateObj, dateFormat)
    } else if (this.state.calendarView === "agenda") {
      title = "Agenda"
    }
    return title
  }

  changeHeaderTitle = (date) => {

    let month = this.getTextMonth(getMonth(date)) 
    let year = getYear(date)

      this.setState({ selectedDate: {month: month, year: year} })
  }


  saveCalendar = (calendar, color) => {
    let timestamp = new Date().getTime()
    let uuid = createId("calendars")

    let dataObj = JSON.stringify({calendar: calendar, color: color, isChecked: true})
    let encryptedData = encryptData(dataObj, this.props.screenProps.cryptoPassword);
    this.props.screenProps.saveNewItem({
      "uuid": uuid, "data": encryptedData, "updated": timestamp, "type": "calendars", "parrent": "", "shared": "" }, {"uuid": uuid, "calendar": calendar, "color": color, "isChecked": true}, "calendars", "Calendar created")
      this.setState({ addListModalIsVisible: false })
  }

  getTextMonth (rawDate) {
    let date = rawDate + 1 //Bug, need +1 to get correct month
    if (date == 1) {
      return "January"
    } else if (date == 2) {
      return "February"
    } else if (date == 3) {
      return "March"
    } else if (date == 4 ) {
      return "April"
    } else if (date == 5) {
      return "May"
    } else if (date == 6) {
      return "June"
    } else if (date == 7) {
      return "July"
    } else if (date == 8) {
      return "August"
    } else if (date == 9) {
      return "September"
    } else if (date == 10) {
      return "October"
    } else if (date == 11) {
      return "November"
    } else if (date == 12) {
      return "December"
    }
  }

  componentWillMount() {
  }

  mountCalendar = {}

  componentDidMount () {
    //this.refs.drawer.openDrawer()
    this.changeHeaderTitle(new Date())
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
  render() {
   
      
    const headerStyle = {
      backgroundColor: this.props.screenProps.darkTheme ? '#17191d' : "#F7F5F4",
      color: this.props.screenProps.darkTheme ? 'white' : "black",
      elevation: 0
    }
    const navigationView = (
      <View style={{flex:1,  elevation: 12, backgroundColor: "#1C1C1C", }}>
      {this.props.screenProps.calendars
      ?      <MenuDrawer
      showAddListModal={this.showAddListModal}
      calendars={this.props.screenProps.calendars}
      checkCalendar={this.props.screenProps.checkCalendar}
    />
      : null
      }
    </View>
    );
    const darkTheme = this.props.screenProps.darkTheme
    return (


      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4" }}>
      {this.props.screenProps.defaultCalendar
      ? null
      : <View style={{height: HEIGHT, width: WIDTH, flex: 1, position: "absolute", top: 0, left: 0, backgroundColor: "#1C1C1C", elevation: 10}}><ErrorMsg logUser={this.props.screenProps.refreshData}/></View> 
      }

      <Header 
       navigation = {this.props.navigation}
        style={headerStyle}
        >
                      <StatusBar backgroundColor={darkTheme ? "#17191d" : "#F7F5F4"} barStyle={ darkTheme ? 'light-content' : 'dark-content'} />
          <Left navigation = {this.props.navigation}>
            <TouchableNativeFeedback
            onPress={() => { this.Drawer.open() }}
            background={TouchableNativeFeedback.Ripple('gray', true)}
          >
            <View style={{ alignItems: "center" }}>
              <Ionicons name="md-menu" size={30} color={darkTheme ? 'white' : "black"} />
            </View>
          </TouchableNativeFeedback>
           
 

            </Left>
          <Body>
            <Title style={{color: darkTheme ? "white" : "black",fontFamily: 'Poppins-Bold', includeFontPadding: false,padding: 0, margin: 0}}>{this.state.selectedDate.month}</Title>
            <Text style={{color: darkTheme ? "white" : "black",fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,fontSize: 14, padding: 0, margin: 0}}>{this.state.selectedDate.year}
            </Text>
          </Body>
          <Right>

          <Menu
          ref={this.setMenuRef}
          style={{ backgroundColor: this.props.darkTheme ? "#373E40" : "#485154", elevation: 8,fontSize: 18,
        }}
          button={<HeaderIcon headerIcon="md-browsers" color={darkTheme ? "white" : "black"} headerFunction={() => {
            this.showMenu()
          }} />}
        >

          <MenuItem 
          textStyle={{color: this.state.calendarView == "agenda" ? "dodgerblue" : "white", fontSize: 18 }} 
          onPress={() => this.changeView("agenda")}>Agenda</MenuItem>
          <MenuItem 
          textStyle={{color: this.state.calendarView == "day" ? "dodgerblue" : "white", fontSize: 18 }} 
          onPress={() => this.changeView("day")}>Day</MenuItem>
          <MenuItem 
          textStyle={{color: this.state.calendarView == "week" ? "dodgerblue" : "white", fontSize: 18 }} 
          onPress={() => this.changeView("week")}>Week</MenuItem>
          <MenuItem 
          textStyle={{color: this.state.calendarView == "month" ? "dodgerblue" : "white", fontSize: 18 }} 
          onPress={() => this.changeView("month")}>Month</MenuItem>
        </Menu>
          <HeaderIcon headerIcon="md-search" color={darkTheme ? "white" : "black"} headerFunction={() => {
          NavigationService.navigate('Search')
        }} />
            </Right>

</Header>
       
        {this.state.addListModalIsVisible
          ? <AddListModal
            showAddListModal={this.showAddListModal}
            saveCalendar={this.saveCalendar}
            cryptoPassword={this.props.screenProps.cryptoPassword}
          />
          : null
        }
        <Dropdown
          ref={(ref) => this.dropdown = ref}
          changeView={this.changeView}
            openViewOptions={this.openViewOptions}
            view={this.state.calendarView}
            darkTheme={darkTheme}
          />
          
        {this.props.screenProps.toastIsVisible
          ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} />
          : null
        }

        {this.props.screenProps.isLoadingData
          ? <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Spinner color='dodgerblue' />
            <Text style={{color: "mintcream", fontSize: 22, fontFamily: "Poppins-Regular"}}>Loading calendar</Text>
            </View>
          : <CalendarMain
            darkTheme={darkTheme}
            decryptedData={this.props.screenProps.decryptedData}
            calendarView={this.state.calendarView}
            calendars={this.props.screenProps.calendars}
            eventWasDeleted={this.props.screenProps.eventWasDeleted}
            isUpdating={this.props.screenProps.isUpdating}
            triggerUpdate={this.props.screenProps.triggerUpdate}
            //Calendar state from App
            currentWeek={this.props.screenProps.currentWeek}
            currentDay={this.props.screenProps.currentDay}
            selectedDate={this.state.selectedDate}
            dayData={[]}
            weekDays={this.props.screenProps.weekDays}
            index={this.props.screenProps.index}
            weekIndex={this.props.screenProps.weekIndex}
            selectedIndex={this.props.screenProps.selectedIndex}
            setDataToArray={this.props.screenProps.setDataToArray}
            switchViewToDay={this.switchViewToDay}
            editEvent={this.props.screenProps.editEvent}
            cryptoPassword={this.props.screenProps.cryptoPassword}
            saveNewData={this.props.screenProps.saveNewData}
            changeDate={this.props.screenProps.changeDate}
            loadMoreData={this.props.screenProps.loadMoreData}
            allData={this.props.screenProps.events}
            changeHeaderTitle={this.changeHeaderTitle}
            deleteItem={this.props.screenProps.deleteItem}
            editItem={this.props.screenProps.editItem}
            switchFromMonth={this.switchFromMonth}
            resetDateFromMonth={this.resetDateFromMonth}
            dateFromMonth={this.state.dateFromMonth}
            BottomSheet={this.BottomSheet}
            selectItem={this.selectItem}
            refreshData={this.props.screenProps.refreshData}
          />
        }
        <BottomSheet
ref={ref => {
  this.BottomSheet = ref;
}}          height={168}
          duration={200}
          closeOnSwipeDown={true}
          darkTheme={this.props.screenProps.darkTheme}
          customStyles={{
            container: {
              
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: this.props.screenProps.darkTheme ? "#17191d" : "white",
              elevation: 8
            }
          }}
        >
       <ScrollView style={{flex: 1, backgroundColor: this.props.screenProps.darkTheme ? "#17191d" : "white", paddingTop: 10, paddingBottom: 10}}>
       <TouchableNativeFeedback 
        onPress={() => {this.BottomSheet.close(), this.triggerFavourite(this.state.selectedItem) }}>
          <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-add" size={26} color={this.props.screenProps.darkTheme ? "white" : "black"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
         {this.state.selectedItem.isFavourite
        ?<Text style={{ color: this.props.screenProps.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Remove from favourites</Text>
      : <Text style={{ color: this.props.screenProps.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Add to favourites</Text>
         }
        </View>
        </View>
       
        </TouchableNativeFeedback>
        <TouchableNativeFeedback 
        onPress={() => {this.BottomSheet.close(), NavigationService.navigate('EditEvent', this.state.selectedItem)}}>
           <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-create" size={26} color={this.props.screenProps.darkTheme ? "white" : "black"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
        <Text style={{ color: this.props.screenProps.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Edit event</Text>
     
        </View>
        </View>
       
        </TouchableNativeFeedback>
        <TouchableNativeFeedback 
        onPress={() => {this.BottomSheet.close(), this.deleteAlert(this.state.selectedItem.text, this.state.selectedItem)}}>
                     <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-trash" size={26} color={this.props.screenProps.darkTheme ? "white" : "black"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
        <Text style={{ color: this.props.screenProps.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Delete event</Text>
     
        </View>
        </View>
       
        </TouchableNativeFeedback>
          </ScrollView>
         

        </BottomSheet>
     <Fab
      style={{ backgroundColor: 'dodgerblue', elevation: 6 }}
            position="bottomRight"
      onPress={() => { NavigationService.navigate('NewEvent') }}>
      <Icon name="add" />
      </Fab>

      <Drawer
                    ref={ref => {
                      this.Drawer = ref;
                    }}
          height={120}
          heightExpanded={300}
          duration={250}
          closeOnSwipeDown={true}
          darkTheme={this.props.screenProps.darkTheme}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: this.props.screenProps.darkTheme ? "#17191d" : "white",
              elevation: 4
            }
          }}
        >
      <View style={{flex:1,  elevation: 12, backgroundColor: this.props.screenProps.darkTheme ? "#1C1C1C" : "#F7F5F4", }}>
      {this.props.screenProps.calendars
      ?      <MenuDrawer
      darkTheme={this.props.screenProps.darkTheme}
      showAddListModal={this.showAddListModal}
      closeDrawer={() => this.Drawer.close()}
      calendars={this.props.screenProps.calendars}
      checkCalendar={this.props.screenProps.checkCalendar}
      navigateToNewCalendar={() => {NavigationService.navigate('NewCalendar')}}
      navigateToSettings={() => {NavigationService.navigate('Settings')}}
      deleteParrent={this.props.screenProps.deleteParrent}


    />
      : null
      }
    </View>
          </Drawer>
      </View>

    );
  }
}

// Styles

const calendarStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    flex: 1,
    alignSelf: 'stretch',
    padding: 0,
    margin: 0,
    height: 10,
  },
  rowmiddle: {
    alignItems: "center",
  },
  col: {
    flexGrow: 1,
    flexBasis: 0,
    maxWidth: "100%",

  },
  colstart: {
    justifyContent: "flex-start",
    textAlign: "left",
  },
  collumn: {
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  circleCollumnBlack: {
    flex: 1,
    height: 30,
    width: 30,
    borderRadius: 30,
    backgroundColor: "black",
  },
  circleCollumnBlue: {
    flex: 1,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "#EF2647",
  },
  circleCollumn: {
    flex: 1,
    height: 30,
    width: 30,
    borderRadius: 15,
  },
  colend: {
    justifyContent: "flex-end",
    textAlign: "right",
    padding: 1,
  },
  /* Calendar */
  calendar: {
    width: "100%",

  },
  header: {
    textTransform: "uppercase",

  },
  body: {
    position: "relative",

  },
  bodycell: {
    position: "relative",
    height: 2,
    overflow: "hidden",
  },
  bodycellnumber: {
    position: "absolute",
  },
  bodycellbg: {
    opacity: 0,
    position: "absolute",
  },

  calendarbodycol: {
    flexGrow: 0,
  },
  day: {
    alignItems: 'center',
    alignSelf: "center",
    color: "white"

  },
  currentDay: {
    color: "white",

    alignItems: 'center',
    alignSelf: "center"

  },
  selectedDay: {
    color: "white",
    alignItems: 'center',
    alignSelf: "center"
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row"
  },
  buttonContainer: {
    width: "30%",
    backgroundColor: "black",

  },
  buttonSwitch: {
    backgroundColor: "black",
    width: "30%"

  },
  dateText: {
    width: "30%",
    color: "white"

  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    color: "#EF2647",
    backgroundColor: "#EF2647",
  }
})

const styles = StyleSheet.create({
  containerHourStyle: {
    flexDirection: "row",
    flex: 1,
    height: 60,
  },
  containerWrapperStyle: {
    flex: 1,
  },
  hourColumnStyle: {
    width: 20,
    alignItems: "center",
  },
  hourTextStyle: {
    position: "absolute",
    top: -8,
    textAlignVertical: 'top',
    zIndex: 10,
    color: "white",
  },
  eventColumnBordersStyle: {
    width: "92%",
    borderTopWidth: 0.4,
    borderColor: "#929390"
  },
  eventColumnStyle: {
    width: "92%",
    borderTopWidth: 0.4,
    borderColor: "#929390",
  },
  eventBlockHiddenStyle: {
    display: "none",
  },
  eventContainerStyle: {
    width: "100%",

  },
  eventBlockStyle: {
    width: 50,
  },
  eventBoxStyle: {
    backgroundColor: "rgba(30, 143, 255, 0.322)",
    height: 1,
    width: "100%",
    borderWidth: 0,

  },
  eventBoxWithTextStyle: {
    backgroundColor: "rgba(30, 143, 255, 0.322)",
    height: 1,
    width: "100%",
    borderWidth: 0,
  },
  textBoxStyle: {
    fontSize: 20,
    color: "white",
    zIndex: 10,
    width: "100%",
    textAlign: "center",

  },
  emptyBoxStyle: {
    fontSize: 20,
    width: "100%",

  },
  borderTop: {
    width: "92%",
    borderTopWidth: 0.4,

  }


})

module.exports = CalendarScreen;

