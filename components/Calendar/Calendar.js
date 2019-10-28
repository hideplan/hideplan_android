import React from "react";
//import "./Register.css";
import { Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, Easing, DrawerLayoutAndroid, LayoutAnimation, UIManager } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, {format, getDate, getYear, getMonth, isPast } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import WeekView from "./WeekView.js"
import MonthView from "./MonthView.js"
import EditEventModalScreen from "../EditEvent/EditEventModal.js"

import ErrorMsg from "../Error/ErrorMsg.js"
import { DrawerActions } from 'react-navigation';
import DayView from "./DayView.js"
import Agenda from "./Agenda.js"
import CustomView from "./CustomView.js"
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

import PastEvents from "./PastEvents.js"

import { Toast, MyDialog } from '../../customComponents.js';
import { Keyboard } from 'react-native'
import { encryptData } from '../../encryptionFunctions';
import { sendPost } from '../../functions.js';
import { Container, Header, Left, Body, Right, Title, Radio, Fab, Picker, Spinner, CheckBox } from 'native-base';
import { createId } from '../../functions';
import { AppHeader, HeaderIcon, HeaderIconMenu, HeaderIconEmpty,  DrawerHeader, DrawerRow, DrawerRowGroupCalendars, DrawerSubtitle } from "../../customComponents.js";

import MyDrawer from '../../drawer/Drawer.js';import { BottomSheet, BottomSheetExpanded } from '../../bottomSheet/BottomSheet.js';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import { IconButton, Menu, Drawer, Snackbar, Divider, Dialog, Paragraph, Surface } from 'react-native-paper';

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

   


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
      <View style={{ flex: 1, width: WIDTH,}}>

        {this.props.calendarView === "agenda" && this.props.calendars
          ? <Agenda ref={(el) => this.agenda = el}
          darkTheme={this.props.darkTheme}
          primaryColor={this.props.primaryColor}
            decryptedData={this.props.decryptedData}
            currentDay={this.props.currentDay}
            selectedDate={this.props.selectedDate}
            selectDate={this.onDateClick}
            width={WIDTH}
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
            colors={this.props.colors}
            changeHeaderTitle={this.props.changeHeaderTitle}
            backgroundCalendarMain={this.props.backgroundCalendar}
            backgroundCalendarHeader={this.props.backgroundCalendarHeader}
            changeHeaderShadow={this.props.changeHeaderShadow}
            hasHeaderShadow={this.props.hasHeaderShadow}
            moveFab={this.props.moveFab}
            fabVisible={this.props.fabVisible}
            showSnackbar={this.props.showSnackbar}
            snackbarVisible={this.props.snackbarVisible}
          />
          : null
        }

        {this.props.calendarView === "day" && this.props.calendars && this.props.allData
          ? <DayView ref={(el) => this.agenda = el}
          darkTheme={this.props.darkTheme}
          primaryColor={this.props.primaryColor}
            decryptedData={this.props.dayData}
            currentDay={this.props.currentDay}
            selectedDate={this.props.selectedDate}
            selectDate={this.onDateClick}
            width={WIDTH}
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
            colors={this.props.colors}
            backgroundCalendarMain={this.props.backgroundCalendar}
            backgroundCalendarHeader={this.props.backgroundCalendarHeader}
          />
          : null
        }


{this.props.calendarView === "week" && this.props.calendars
          ? <WeekView ref={(el) => this.agenda = el}
          darkTheme={this.props.darkTheme}
          primaryColor={this.props.primaryColor}
            decryptedData={this.props.dayData}
            currentDay={this.props.currentDay}
            selectedDate={this.props.selectedDate}
            selectDate={this.onDateClick}
            width={WIDTH}
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
            colors={this.props.colors}
            backgroundCalendarMain={this.props.backgroundCalendar}
            backgroundCalendarHeader={this.props.backgroundCalendarHeader}
          />
          : null
        }

{this.props.calendarView === "custom" && this.props.calendars
? <CustomView ref={(el) => this.agenda = el}
darkTheme={this.props.darkTheme}
primaryColor={this.props.primaryColor}
  decryptedData={this.props.dayData}
  currentDay={this.props.currentDay}
  selectedDate={this.props.selectedDate}
  selectDate={this.onDateClick}
  width={WIDTH}
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
  colors={this.props.colors}
  backgroundCalendarMain={this.props.backgroundCalendar}
  backgroundCalendarHeader={this.props.backgroundCalendarHeader}
  daysNum={this.props.customCalendar}
/>
: null
}
{this.props.calendarView === "month" && this.props.calendars
? <MonthView ref={(el) => this.agenda = el}
  darkTheme={this.props.darkTheme}
  primaryColor={this.props.primaryColor}
  decryptedData={this.props.dayData}
  currentDay={this.props.currentDay}
  selectedDate={this.props.selectedDate}
  selectDate={this.onDateClick}
  width={WIDTH}
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
  colors={this.props.colors}
  backgroundCalendarMain={this.props.backgroundCalendar}
  backgroundCalendarHeader={this.props.backgroundCalendarHeader}
  selectItem={this.props.selectItem}
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
      hasHeaderShadow: false,
      eventModalVisible: false,
      snackbarVisible: false,
      fabBottom: new Animated.Value(0),
      fabVisible: true,
      snackbarVisible: false,
      snackbarText: "",
      dropdownVisible: false,
      dropdownCalendarVisible: false,
      pastModalVisible: false,
      dialogDeleteVisible: false,
      dialogDeleteOldVisible: false,

    }
  }
  static navigationOptions = {
    header: null,
    };
    _hideDeleteDialog = () => {
      this.setState({ dialogDeleteVisible: false, selectedItem: "" })
    }
    _openDeleteDialog = () => {
      this.setState({ dialogDeleteVisible: true })
    }
    _hideDeleteOldDialog = () => {
      this.setState({ dialogDeleteOldVisible: false })
    }
    _openDeleteOldDialog = () => {
      this.setState({ dialogDeleteOldVisible: true })
    }
    _openMenu = () => this.setState({ dropdownVisible: true });

    _closeMenu = () => this.setState({ dropdownVisible: false });
    _openPastModal = () => this.setState({ pastModalVisible: true });

    _closePastModal = () => this.setState({ pastModalVisible: false });

    _openCalendarMenu = () => this.setState({ dropdownCalendarVisible: true });

    _closeCalendarMenu = () => this.setState({ dropdownCalendarVisible: false });
    selectItem = (item) => {
      
      this.setState({ selectedItem: item, eventModalVisible: true })
    }
    hideModal = () => {
      this.setState({ eventModalVisible: false })
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
      if (item.isFavourite == "true") {
        favouriteValue = "false"
      } else {
        favouriteValue = "true"
      }
      let valueForEncryption = {"uuid": item.uuid, "dateFrom": item.dateFrom.toString(), "dateTill": item.dateTill.toString(), "text": item.text, "location": item.location, "notes": item.notes, "reminder": item.reminder, "calendar": item.calendar, "repeat": item.repeat, "repeated": item.repeated, "isFavourite": favouriteValue}
      return valueForEncryption;
    }
    triggerFavourite = (item) => {
      let encryptedData
      let isFavourite;
      let timestamp = parse(new Date())
  
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
    this._closeCalendarMenu();
    this.setState({ calendarView: view })
    this.changeHeaderTitle(new Date())

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



  resetDate = () => {
    this.setState({ selectedDate: new Date() })
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
    let dateParse = parse(date)
    let month = this.getTextMonth(getMonth(dateParse)) 
    let year = getYear(dateParse)
    if (this.state.calendarView == "day") {
      month = getDate(dateParse) + ". " + month
      year = format(dateParse, "EEEE")
    }
      this.setState({ selectedDate: {month: month, year: year} })
  }


  saveCalendar = (calendar, color) => {
    let timestamp = parse(new Date())
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


  componentDidMount () {
    this.changeHeaderTitle(new Date())
    this.changeView(this.props.screenProps.calendarView)
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
  changeHeaderShadow = (value) => {
    this.setState({hasHeaderShadow: value})
  }
  moveFab = (value) => {
    if (value >= 0) {
      this.setState({ fabVisible: true })
    } else {
      this.setState({ fabVisible: false })
    }
      Animated.timing(this.state.fabBottom, {
      toValue: value,
      duration: 200
    }).start()
  }

  
  showSnackbar = (text, type, func) => {
    this.state.fabVisible 
    ? this.moveFab(50)
    : null
    this.setState({ snackbarVisible: true, snackbarText: text })
  }
  hideSnackbar = () => {
    this.state.fabVisible 
    ? this.moveFab(0)
    : null
    this.setState({ snackbarVisible: false })
  }
  triggerSpinner = () => {
    this.setState({ isLoadingData: true })
  }
  openDrawer = () => {
    this.refs['DRAWER_REF'].openDrawer();
  }
  closeDrawer = () => {
    this.refs['DRAWER_REF'].closeDrawer();
  }
  deletePastEvents = () => {
    //Filter all completed tasks
    this._hideDeleteOldDialog()
    let eventsForDeletion = this.props.screenProps.events.filter(item => {
      return isPast(parse(item.dateTill))
    })
    //Delete all completed tasks
    eventsForDeletion.forEach(item => {
      let itemObj = {...item, ...{type: "events"}}
      this.props.screenProps.deleteItem(itemObj)
    })
    
  }

  renderDrawer = () => {
    return (
      <View
      style={{
        flex: 1,
        elevation: 16,
        backgroundColor: this.props.screenProps.darkTheme
          ? "#1C1C1C"
          : "#F7F5F4"
      }}
    >
      <View
        style={{
          flex: 1,

        }}
      >
          <ScrollView style={{
          flex: 1}}>
  <Drawer.Section title={`${this.props.screenProps.user}'s account`}>
  <Drawer.Item
    label="Settings"
    icon="settings"
    onPress={() => { this.closeDrawer(), NavigationService.navigate("Settings") }}
  />
  <Drawer.Item
    label="Notifications"
    icon="bell"
    onPress={() => { this.closeDrawer(), NavigationService.navigate("Notifications") }}
  />
          <Drawer.Item
    label="Search"
    icon="magnify"
    onPress={() => { this.closeDrawer(), NavigationService.navigate("Search") }}
  />
</Drawer.Section>

{this.props.screenProps.calendars 
?<DrawerRowGroupCalendars
close={this.closeDrawer}
colors={this.props.screenProps.colors}
darkTheme={this.props.screenProps.darkTheme}
title="Calendars"
options={this.props.screenProps.calendars}
func={this.props.screenProps.checkCalendar}
/>
: null
} 


      </ScrollView>
      </View>
</View>
    )
  }
  render() {
    const snackTheme = {
      dark:true,
      colors: {
        background: this.props.screenProps.colors.snackbar,
        surface: this.props.screenProps.colors.snackbar,
        accent: this.props.screenProps.colors.snackbar,
        primary: this.props.screenProps.colors.snackbar,
        text: this.props.screenProps.colors.primaryText,
        backdrop: this.props.screenProps.colors.snackbar,
      },
    };

    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: this.state.hasHeaderShadow && this.state.calendarView == "agenda" && this.props.screenProps.darkTheme == false ? 8 : 0,
    }


 
    const darkTheme = this.props.screenProps.darkTheme
    return (

      <DrawerLayout
      ref={'DRAWER_REF'}
      backgroundColor={this.props.screenProps.colors.modal}
      drawerWidth={300}

    renderNavigationView={this.renderDrawer}
    >
      <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface}}>
      {this.props.screenProps.defaultCalendar
      ? null
      : <View style={{height: HEIGHT, width: WIDTH, flex: 1, position: "absolute", top: 0, left: 0, backgroundColor: "#1C1C1C", elevation: 8}}><ErrorMsg logUser={this.props.screenProps.refreshData}/></View> 
      } 
    <StatusBar
      backgroundColor={this.state.hasHeaderShadow ? this.props.screenProps.colors.header : this.props.screenProps.colors.surface}
      barStyle={darkTheme ? "light-content" : "dark-content"}
    />
    <AppHeader style={headerStyle}
        screen="calendar"
        darkTheme={this.props.screenProps.darkTheme}
        colors={this.props.screenProps.colors}
        title={this.state.selectedDate.month}
        
        subtitle={this.state.selectedDate.year
    }
     
           
        hasHeaderShadow={ this.state.calendarView == "week" && this.props.screenProps.darkTheme == true || this.state.calendarView == "day" && this.props.screenProps.darkTheme == true || this.state.calendarView == "month" && this.props.screenProps.darkTheme == true ? true : this.state.hasHeaderShadow || this.state.calendarView == "custom" && this.props.screenProps.darkTheme == true ? true : this.state.hasHeaderShadow }
        menuIcon={() => { return <IconButton 
          icon="menu"
          theme={{dark: this.props.screenProps.darkTheme}}
          color={this.props.screenProps.colors.gray}
          size={24}
          onPress={() => this.openDrawer()}
           /> }}
        icons={[<Menu
          visible={this.state.dropdownCalendarVisible}
          onDismiss={this._closeCalendarMenu}
          contentStyle={{backgroundColor: this.props.screenProps.colors.modal}}

          style={{backgroundColor: this.props.screenProps.colors.modal}}
          theme={{ colors: {surface: this.props.screenProps.colors.modal, text: this.props.screenProps.colors.text}}}
          anchor={
            <IconButton 
            icon="calendar-blank"
            theme={{dark: this.props.screenProps.darkTheme}}
            color={this.props.screenProps.colors.gray}
            size={24}
            onPress={() => this._openCalendarMenu()}
             />

          }
        >
          <Menu.Item 
          onPress={() => this.changeView("agenda")} title="Agenda" 
          icon={this.state.calendarView == "agenda"
          ?"radiobox-marked" : "radiobox-blank"}
          />
          <Menu.Item onPress={() => this.changeView("day")} title="Day"
          icon={this.state.calendarView == "day"
          ?"radiobox-marked" : "radiobox-blank"}
          />
          <Menu.Item onPress={() => this.changeView("custom")} title={`${this.props.screenProps.customCalendar} days`} 
          icon={this.state.calendarView == "custom"
          ?"radiobox-marked" : "radiobox-blank"}
          />
          <Menu.Item onPress={() => this.changeView("week")} title="Week" 
          icon={this.state.calendarView == "week"
          ?"radiobox-marked" : "radiobox-blank"}
          />
          <Menu.Item onPress={() => this.changeView("month")} title="Month" 
          icon={this.state.calendarView == "month"
          ?"radiobox-marked" : "radiobox-blank"}
          />
           
        </Menu>,
       <Menu
          visible={this.state.dropdownVisible}
          onDismiss={this._closeMenu}
          contentStyle={{backgroundColor: this.props.screenProps.colors.modal}}

          theme={{dark:this.props.screenProps.darkTheme, mode:"exact", colors: {surface: this.props.screenProps.colors.modal, text: this.props.screenProps.colors.text}}}
          anchor={
            <IconButton 
            icon="dots-vertical"
            theme={{dark: this.props.screenProps.darkTheme}}
            color={this.props.screenProps.colors.gray}
            size={24}
            onPress={() => this._openMenu()}
             />
          }
        ><Menu.Item
        onPress={() => {this._openPastModal(), this._closeMenu()}} title="Past events" />
        <Menu.Item 
          onPress={() => {this._openDeleteOldDialog(), this._closeMenu()}} title="Delete past events" />
                      <Divider style={{backgroundColor: this.props.screenProps.colors.border}} />
          <Menu.Item onPress={() => {NavigationService.navigate("NewCalendar"), this._closeMenu()}} title="Add calendar" />
          <Menu.Item onPress={() => {NavigationService.navigate("CalendarsSettings"), this._closeMenu()}} title="Edit calendars" />
        </Menu>]}
        />




  
          
        {this.props.screenProps.toastIsVisible
          ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} 
          primaryColor={this.props.screenProps.primaryColor}
          darkTheme={this.props.screenProps.darkTheme}
          colors={this.props.screenProps.colors}
          />
          : null
        }

        {this.props.screenProps.isLoadingData
          ? <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
            <Spinner color={this.props.screenProps.primaryColor} />
            <Text style={{color: "mintcream", fontSize: 22, fontFamily: "Poppins"}}>Loading calendar</Text>
            </View>
          : <CalendarMain
            darkTheme={darkTheme}
            primaryColor={this.props.screenProps.primaryColor}
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
            colors={this.props.screenProps.colors}
            changeHeaderShadow={this.changeHeaderShadow}
            hasHeaderShadow={this.state.hasHeaderShadow}
            moveFab={this.moveFab}
            fabVisible={this.state.fabVisible}
            showSnackbar={this.showSnackbar}
            snackbarVisible={this.state.snackbarVisible}
            customCalendar={this.props.screenProps.customCalendar}
            />
        }
    


         
                    {this.state.eventModalVisible && this.state.selectedItem
        ? <EditEventModalScreen 
                      item={this.state.selectedItem}
        hideModal={this.hideModal}
        eventModalVisible={this.state.eventModalVisible}
        showSnackbar={this.showSnackbar}
        deleteItem={this.props.screenProps.deleteItem}
        cryptoPassword={this.props.screenProps.cryptoPassword}
      editItem={this.props.screenProps.editItem}
      calendars={this.props.screenProps.calendars}
      selectedCalendar={this.state.selectedCalendar}
      darkTheme={this.props.screenProps.darkTheme}
      saveNewItem={this.props.screenProps.saveNewItem}
      primaryColor={this.props.screenProps.primaryColor}
      colors={this.props.screenProps.colors}
      cancelNotification={this.props.screenProps.cancelNotification}
      _openDeleteDialog={this._openDeleteDialog}


        />
        : null
        }
         {this.state.pastModalVisible
        ? <PastEvents 
        decryptedData={this.props.screenProps.decryptedData}
        hideModal={this._closePastModal}
        pastModalVisible={this.state.pastModalVisible}
        showSnackbar={this.showSnackbar}
        deleteItem={this.props.screenProps.deleteItem}
        cryptoPassword={this.props.screenProps.cryptoPassword}
      editItem={this.props.screenProps.editItem}
      calendars={this.props.screenProps.calendars}
      selectedCalendar={this.state.selectedCalendar}
      darkTheme={this.props.screenProps.darkTheme}
      saveNewItem={this.props.screenProps.saveNewItem}
      primaryColor={this.props.screenProps.primaryColor}
      colors={this.props.screenProps.colors}
      selectItem={this.selectItem}
      cancelNotification={this.props.screenProps.cancelNotification}
        />
        : null
        }
         <Snackbar
                  theme={snackTheme}

          style={{bottom: 0}}
          visible={this.state.snackbarVisible}
          onDismiss={() => this.hideSnackbar()}
          action={{
            label: 'Undo',
            onPress: () => {
              // Do something
              this.props.screenProps.reverteDelete()
            },
          }}
        >
          {this.state.snackbarText}
        </Snackbar>
        {this.state.calendarView == "agenda"
      ? <Animated.View style={{
        position: 'absolute',
        margin: 16,
        bottom: this.state.fabBottom,
        alignSelf: "center",
        }}>
        <FAB
           style={{
           backgroundColor: this.props.screenProps.colors.primary,
         }}
         color={this.props.screenProps.colors.primaryText}
       
         label="Add event"
           icon="plus"
           onPress={() => NavigationService.navigate('NewEvent')}
         />
         </Animated.View> 
    : null
    }
    {this.state.dialogDeleteVisible
      ?    
      <MyDialog
      colors={this.props.screenProps.colors}
      darkTheme={this.props.screenProps.darkTheme}
      hide={this._hideDeleteDialog}
      title={"Delete event"}
      text={`Do you want to delete event "${this.state.selectedItem.text}"?`}
        hide={this._hideDeleteDialog}
        confirm={() => this.deleteItem(this.state.selectedItem)}
        />
      
    
     
        : null
              }
  {this.state.dialogDeleteOldVisible
      ?    
      <MyDialog
      colors={this.props.screenProps.colors}
      darkTheme={this.props.screenProps.darkTheme}
      hide={this._hideDeleteOldDialog}
      title={"Delete past events"}
      text={`Do you want to delete all past events?`}
        hide={this._hideDeleteOldDialog}
        confirm={() => this.deletePastEvents()}
        />
      
    
     
        : null
              }

      </View>
      </DrawerLayout>

    );
  }
}


module.exports = CalendarScreen;

