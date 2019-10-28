import React from "react";
//import "./Register.css";
import { View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, LayoutAnimation, UIManager, Easing, } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isSameISOWeek, isToday, isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, differenceInCalendarDays } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FabIcon } from '../../customComponents.js';
import { Button, Spinner } from 'native-base';
import Carousel from 'react-native-looped-carousel';

import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);


const CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  }
};



class Header extends React.Component {

  findEvents = (baseDate, eventDate) => {

    return areIntervalsOverlapping({start: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 0, 0)), end: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 23, 30))}, {start: parse(eventDate.dateFrom), end: parse(eventDate.dateTill)})  }
  filteredEventsDots = (week) => {
    let dots = [false, false, false, false, false, false, false]
    this.props.allData.map(event => {
      for (let i=0; i<week.length; i++) {
        if (this.findEvents(week[i], event)) {
          dots[i] = true
        }
      }
    })
    return dots
  }

  render() {
    const column = (WIDTH - 30) / 7
    
    const headerStyle = {
      flex: 1,
      flexDirection: "column",
      margin: 0,
      elevation: 8,
    }
    const headerRow = {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }
    const dataRow = {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
    }
    const dayColumn = {
      alignSelf: "center",
      width: column,
      alignItems: "center",
      justifyContent: "center", 
    }
    const todayDay = {
      alignSelf: "center",
      width: column,
      alignItems: "center",
      justifyContent: "center", 

    }
    const dayEvent = {
      width: column,
      height: 30,
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "center", 
    }
    const dayTextColumn = {
      alignSelf: "center",
      width: column,
    }
    const dayText = {
      margin: 0, 
      padding: 1,
      color: this.props.colors.text,
      fontSize: 18,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      alignSelf: "center",
      textAlign: "center",
    }
    const dayTextToday= {
      margin: 0, 
      padding: 1,
      color: this.props.colors.primaryText,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      fontSize: 16,
      alignSelf: "center",
      textAlign: "center",
    }
    const dayTextWhite = {
      margin: 0, 
      padding: 1,
      color: this.props.colors.primaryText,
      fontSize: 18,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      alignSelf: "center",
      textAlign: "center",
    }
    const circleColumn = {
      height: column / 6 * 4,
      width: column / 6 * 4,
      borderRadius: column / 6 * 4 / 2,
      backgroundColor: "rgba(0, 0, 0, 0)",
      alignItems: "center",
      justifyContent: "center", 
    }
    const circleColumnBlue = {
      height: column / 6 * 4,
      width: column / 6 * 4,
      borderRadius: column / 6 * 4 / 2,
      backgroundColor: this.props.colors.primary,
      alignItems: "center",
      justifyContent: "center", 
    }
    const circleColumnBlack = {
      height: column / 6 * 4,
      width: column / 6 * 4,
      borderRadius: column / 6 * 4 / 2,
      backgroundColor: this.props.colors.text,
      color: "#232323",
      alignSelf: "center",
      justifyContent: "center", 
    }
    const dayTextSmall = {
      margin: 0, 
      padding: 1,
      color: this.props.colors.gray,
      fontSize: 14,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      alignSelf: "center",
      textAlign: "center"
    }
  
    const dotStyle = {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: this.props.colors.primary,
      alignSelf: "center",
      justifyContent: "center", 
    }
    const emptyDotStyle = {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: "rgba(0, 0, 0, 0)",
      alignItems: "center",
      justifyContent: "center", 
    }
    const daysText = this.props.daysText.map(day => {
      return <View style={dayTextColumn}>
        <Text style={dayTextSmall}>{day}</Text>
      </View>
    })
    const daysNumbers = this.props.weekDays.map((day, index) => {
      if (isToday(parse(day))) {
        return <View style={dataRow}>
      <View style={headerRow}>
      <View style={todayDay}>
      <TouchableNativeFeedback
        onPress={() => { this.props.getDays(day)
        }}
        background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
          this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
      >
              <View style={circleColumnBlue}>
      <Text style={dayTextToday}>{getDate(day)}</Text>
      </View>
      </TouchableNativeFeedback>
      </View>
      </View>
      <View style={dayEvent}>
      {dots[index]
      ? <View style={dotStyle}></View>
      : <View style={emptyDotStyle}></View>
      }
      </View>
      </View>
      
      } else if (isSameDay(this.props.selectedDay, day)) {
        return <View style={dataRow}>
      <View style={headerRow}>
      <View style={todayDay}>
      <TouchableNativeFeedback
        onPress={() => { this.props.getDays(day)}}
        background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
          this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
      >
              <View style={circleColumnBlack}>
      <Text style={dayTextWhite}>{getDate(day)}</Text>
      </View>
      </TouchableNativeFeedback>
      </View>
      </View>
      <View style={dayEvent}>
      {dots[index]
      ? <View style={dotStyle}></View>
      : <View style={emptyDotStyle}></View>
      }
      </View>
      </View>
      } else {
        return <View style={dataRow}>
      <View style={headerRow}>
      <View style={todayDay}>
      <TouchableNativeFeedback
        onPress={() => { this.props.getDays(day)}}
        background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
          this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
      ><View style={circleColumn}>
      <Text style={dayText}>{getDate(day)}</Text>
      </View>
      </TouchableNativeFeedback>
      </View>
  
      </View>
     
      </View>
      }
    })

    return (
      <View style={headerStyle}>
        <View style={headerRow}>
          {daysText}
        </View>
        <View style={headerRow}>
          {daysNumbers}
        </View>
      </View>
    )
  }
}







class Body extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNewEvent: false,
      calendarOffset: 0,
    }

  }
  ///
  /// CALENDAR FUNCTIONS
  ///
  showNewEvent = (day, hour) => {
    let dayIndex = getDay(day)
    let eventDay;
    if (dayIndex === 0) {
      eventDay = (6 * ((WIDTH -40) / 7)) 
    } else {
      eventDay = ((dayIndex - 1 ) * ((WIDTH -40) / 7)) 
    }
   
    this.setState({ showNewEvent: {left: eventDay, top: hour * 40, day: day, hour: hour } })
  }

  renderHeader() {
    // Show day and month under interactive list of days
    const dateFormat = "DD. MMMM";
    return (
      <View style={{ flex: 1, alignItems: "center", height: 20 }}>
        <Text style={{ color: "#F9F9F9", fontFamily: 'Poppins-Regular', includeFontPadding: false,
 }}> {dateFns.format(this.props.selectedDate, dateFormat)}</Text>
      </View>
    );
  }

  renderDays() {
    const daysText = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const days = [];
    for (let i = 0; i < daysText.length; i++) {
      days.push(
        <View style={calendarStyle.collumn}>
          <Text style={{ color: this.props.colors.gray, fontFamily: 'Poppins-Regular', includeFontPadding: false, }}>{daysText[i]}
          </Text>
        </View>
      )
    }
    return <View style={calendarStyle.row}>{days}</View>
  }



  getIndex = (flatlistIndex, datasetIndex) => {
    // Get index of selected day
    if (flatlistIndex === 0) {
      return datasetIndex
    } else {
      return flatlistIndex * 7 + datasetIndex
    }
  }

  

  checkIfSelectedDay = (selectedDay, otherDay) => {
    if (selectedDay === otherDay) {
      return true
    } else {
      return false
    }
  }

  selectDateFromIndex = (listIndex) => {
    this.props.selectIndex(listIndex)
    this.agenda.scrollToIndex({ animated: true, index: listIndex });
  }

  ///
  /// AGENDA FUNCTIONS
  ///


  renderTimeNowLine = (day) => {
    // Render red line for current time only on Today page in Agenda
    // BUG - on every page
    let dateNow = new Date()
    let basicDay = parse(new Date(getYear(parse(dateNow)), getMonth(parse(dateNow)), getDate(parse(dateNow)), 0, 0, 0))
    if (isSameDay(parse(day), parse(new Date()))) {
      // Offset from top is counted minutes difference from start of the day and current time
      let offsetTop = differenceInMinutes(parse(dateNow), parse(basicDay)) / 1.5

      return <View style={{ flex: 1, left: 35, width: WIDTH - 50, backgroundColor: this.props.colors.text, height: 2, position: "absolute", borderRadius: 6, top: offsetTop, zIndex: 9999 }}></View>
    }
  }

  renderLines = (day) => {
    // Render lines for each hour
    const dataset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    const containerHourStyle = {
      flexDirection: "row",
      flex: 1,
      height: 40,
      paddingLeft: 5,
      paddingRight: 5
    }
  
    const hourColumnStyle = {
      width: 20,
      alignItems: "center",
      justifyContent: "flex-start",
      bottom: 10
    }
  
    const eventColumnBordersStyle = {
      marginLeft: 10,
      marginRight: 10,
      width: WIDTH - 50,
      borderTopWidth: 0.4,
      borderColor: this.props.colors.border
    }
    const eventColumnStyle = {
      marginLeft: 10,
      marginRight: 10,
      width: WIDTH - 50,
      borderTopWidth: 0.4,
      borderColor: "rgba(0, 0, 0, 0)",

    }
    const hourTextStyle = {
      position: "absolute",
      textAlignVertical: 'top',
      zIndex: 10,
      color: this.props.colors.gray,
      fontSize: 14,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      borderColor: this.props.colors.border
    }
    return (dataset.map(hour => {
      
      return (
        <View style={containerHourStyle}>
          <View style={hourColumnStyle}>
            {hour == 0 || hour == 24 ? <Text style={hourTextStyle}> </Text> : <Text style={hourTextStyle}>{hour}</Text>
            }
          </View>
          {hour != 0 && hour != 24
            // Add border for every hour && add touch listener to create new events from Agenda
            ? <TouchableWithoutFeedback
              onPress={() => { this.showNewEvent(day, hour) }}>
              <View style={eventColumnBordersStyle}>
                <Text>{""}</Text>
              </View>
            </TouchableWithoutFeedback>
            : <TouchableWithoutFeedback
              onPress={() => { this.showNewEvent(day, hour) }}
            ><View style={eventColumnStyle}>
                <Text>{""}</Text>
              </View></TouchableWithoutFeedback>
          }
        </View>
      )
    }))
  }

 

    checkOverlappingEvents = (firstDate, secondDate) => {
    return areIntervalsOverlapping(
      {start: parse(firstDate.dateFrom), end: parse(firstDate.dateTill)}, {start: parse(secondDate.dateFrom), end: parse(secondDate.dateTill)})
  }
  checkOverlappingHeaderEvents = (firstDate, secondDate) => {
    let firstDateStart = parse(new Date(getYear(parse(firstDate.dateFrom)), getMonth(parse(firstDate.dateFrom)), getDate(parse(firstDate.dateFrom)), 0, 0, 0))
    let firstDateEnd = parse(new Date(getYear(parse(firstDate.dateTill)), getMonth(parse(firstDate.dateTill)), getDate(parse(firstDate.dateTill)), 23, 59, 59))
    let secondDateStart = parse(new Date(getYear(parse(secondDate.dateFrom)), getMonth(parse(secondDate.dateFrom)), getDate(parse(secondDate.dateFrom)), 0, 0, 0))
    let secondDateEnd = parse(new Date(getYear(parse(secondDate.dateTill)), getMonth(parse(secondDate.dateTill)), getDate(parse(secondDate.dateTill)), 23, 59, 59))

    return areIntervalsOverlapping(
      {start: firstDateStart, end: firstDateEnd}, {start: secondDateStart,end: secondDateEnd})
  }

  checkCollisions = (data) => {
    data.map(item => {
      let width = 1;
      data.map(item2 => {
        if (this.checkOverlappingEvents(item, item2) && item.uuid !== item2.uuid) {
          width = width + 1
        }
      })
    })
  }

  renderHeaderEvents = (dataset) => {
    let offsetCount = [] //Store every event id of overlapping items
    let offsetCountFinal; //Sort events by id number

    let tableWidth = WIDTH - 40

    if (dataset) {
      return (dataset.map((event) => {
        let width = 1; //Full width
        let offsetLeft = 0 // Basic offset if no overlapping
      
        return this.props.calendars.map(calendar => {
          if (calendar.uuid == event.calendar) {
            if (calendar.isChecked) {
        if (differenceInCalendarDays(parse(event.dateTill), parse(event.dateFrom)) > 0 || event.allDay == "true") {
          dataset.map(item2 => {
            if (this.checkOverlappingHeaderEvents(event, item2) && event.uuid !== item2.uuid && differenceInCalendarDays(parse(item2.dateTill), parse(item2.dateFrom)) > 0 || this.checkOverlappingHeaderEvents(event, item2) && event.uuid !== item2.uuid && item2.allDay == "true") {
              width = width + 1 //add width for every overlapping item
              offsetCount.push(item2.uuid)
            } else if (this.checkOverlappingHeaderEvents(event, item2) && event.uuid == item2.uuid && differenceInCalendarDays(parse(item2.dateTill), parse(item2.dateFrom)) > 0 ||item2.allDay == "true" && event.uuid == item2.uuid ) {
              offsetCount.push(event.uuid)
  
            } //BUG event width is shrinked because of multi day events
          }) 



          if (offsetCount.length > 0) {
            offsetCountFinal = offsetCount.sort((a, b) => {
              return a - b //sort items for proper calculations of offset by id
            })
          }

          if (offsetCountFinal) {
            offsetLeft = ((tableWidth / offsetCountFinal.length) * (offsetCountFinal.indexOf(event.uuid))) + 30//count offset
          }



          let eventHeight = differenceInMinutes(parse(event.dateTill), parse(event.dateFrom)) / 1.5

          let eventWidth = (tableWidth / width) ///event.width.toString() + "%"
          //event.left
          // BUG/TODO break event if continues next day
          // Current status: events is displayed in wrong place

          let calendarColor
          this.props.calendars.map(item => {
            if (item.uuid === event.calendar) {
              //TODO Temporary till migrate all old settings for calendars
              if (item.color.s200) {
                if (this.props.darkTheme) {
                  calendarColor = item.color.s200
                } else {
                  calendarColor = item.color.s600
                }
              } else {
                calendarColor = item.color
              }

               calendarColor
            }
          })




          offsetCount = []
          offsetCountFinal = ""

          return (
            <TouchableNativeFeedback
            onPress={() => { this.props.selectItem(event) } }
            background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
              this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            >
              <View style={{ position: "absolute", height: 36, width: eventWidth, left: offsetLeft, backgroundColor: calendarColor, borderWidth: 1, borderColor: "transparent", borderRadius: 4, alignItems: "flex-start", opacity: isFuture(parse(event.dateTill)) ? 1 : 0.6, }}>

              <Text numberOfLines={1} style={{ padding: 4, color: this.props.colors.primaryText, fontSize: 12, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false, opacity: 1}}>
                {event.text}</Text>
              </View>
            </TouchableNativeFeedback>

          )
        }
      }}})}))
    }
  }

  renderEvents = (dataset) => {
    let offsetCount = [] //Store every event id of overlapping items
    let offsetCountFinal; //Sort events by id number

    let tableWidth = WIDTH - 50


    if (dataset) {
      return (dataset.map((event) => {
        let width = 1; //Full width
        let offsetLeft = 40 // Basic offset if no overlapping

        return this.props.calendars.map(calendar => {
          if (calendar.uuid == event.calendar) {
            if (calendar.isChecked) {
        if (differenceInCalendarDays(parse(event.dateTill), parse(event.dateFrom)) < 1 && event.allDay == "false") {

          dataset.map(item2 => {
            if (this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid && differenceInCalendarDays(parse(item2.dateTill), parse(item2.dateFrom)) === 0 && event.allDay == "false") {
              width = width + 1 //add width for every overlapping item
              offsetCount.push(item2.uuid)
            } else if (this.checkOverlappingEvents(event, item2) && event.uuid == item2.uuid && differenceInCalendarDays(parse(item2.dateTill), parse(item2.dateFrom)) === 0 && event.allDay == "false") {
              offsetCount.push(event.uuid)

            } //BUG event width is shrinked because of multi day events
          })


          if (offsetCount.length > 0) {
            offsetCountFinal = offsetCount.sort((a, b) => {
              return a - b //sort items for proper calculations of offset by id
            })
          }

          if (offsetCountFinal) {
         
            offsetLeft = ((tableWidth / offsetCountFinal.length) * (offsetCountFinal.indexOf(event.uuid))) + 40//count offset
            

          }


          let offsetTop = differenceInMinutes(parse(event.dateFrom), parse(new Date(getYear(parse(event.dateFrom)), getMonth(parse(event.dateFrom)), getDate(parse(event.dateFrom)), 0, 0, 0))) / 1.5

          let eventHeight = differenceInMinutes(parse(event.dateTill), parse(event.dateFrom)) / 1.5
          let eventWidth = (tableWidth / width) ///event.width.toString() + "%"
          //event.left
          // BUG/TODO break event if continues next day
          // Current status: events is displayed in wrong place

          let calendarColor
          this.props.calendars.map(item => {
            if (item.uuid === event.calendar) {
              //TODO Temporary till migrate all old settings for calendars
              if (item.color.s200) {
                if (this.props.darkTheme) {
                  calendarColor = item.color.s200
                } else {
                  calendarColor = item.color.s600
                }
              } else {
                calendarColor = item.color
              }

               calendarColor
            }
          })



          offsetCount = []
          offsetCountFinal = ""
          return (
            <TouchableNativeFeedback
            onPress={() => { this.props.selectItem(event) } }
            background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
              this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            >
              <View style={{ top: offsetTop, position: "absolute", height: eventHeight,  width: eventWidth, left: offsetLeft, backgroundColor: calendarColor, borderWidth: 1, borderColor: "transparent", borderRadius: 4, alignItems: "flex-start", opacity: isFuture(parse(event.dateTill)) ? 1 : 0.6, }}>

              <Text numberOfLines={1} style={{ padding: 4, color: this.props.colors.primaryText, fontSize: 12, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false, opacity: 1}}>
                {event.text}</Text>
              </View>
            </TouchableNativeFeedback>

          )
        }
      }}})}))
    }
  }



  getItemLayout = (data, index) => (
    { length: WIDTH, offset: WIDTH * index, index }
  )

  scrollToIndexAgenda = (agendaIndex, selectedDate) => {
    //Scroll view to index
    this.agenda.scrollToIndex({ animated: true, index: agendaIndex });
    //Change date - BUG making slow scrolling -possible sollutions - separated days and dots in different components
    //this.props.changeDate(selectedDate)
    this.props.changeDate(selectedDate)
  }

  scrollToHourNow = () => {
    // NOT WORKING
    let currentTimeLine = getHours(parse(new Date()))
    this.refs.scroll.scrollTo({ x: 1300, y: 1500, animated: false })
  }



  componentDidUpdate (prevProps) {
    if (prevProps.swipeIndex != this.props.swipeIndex) {
    }
  }
  createEvent = (hour) => {
    // Display box for new event box directly in Agenda
    //Get hour position from table and trigger rendering new event
    this.setState({ showNewEvent: hour })
  }

  calculateNewEventTime(day, hour) {
    // Get date of new event
    let selectedDate = day
    let newEventDate = parse(new Date(getYear(parse(selectedDate)), getMonth(parse(selectedDate)), getDate(parse(selectedDate)), hour, 0, 0))
    return newEventDate
  }
  renderNewEvent = (hour) => {
    //Render new event box when clicked between hours in agenda
    // BUG - not hiding when scrolling to new page in agenda
    let topOffset = hour * 40
    return (
      <TouchableNativeFeedback
      onPress={() => {
        let eventTime = this.calculateNewEventTime(this.state.showNewEvent.day, this.state.showNewEvent.hour )
        this.setState({ showNewEvent: false })
        NavigationService.navigate('NewEvent', { date: eventTime }) }}
        background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
          this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
    ><View style={{ flex: 1, position: "absolute", height: 40, top: topOffset, width: WIDTH - 50, left: 40, backgroundColor: this.props.colors.primary, borderWidth: 1, borderColor: "transparent", borderRadius: 4, alignItems: "flex-start", zIndex: 20, }}>
         <Text style={{padding: 4, color: this.props.colors.primaryText, fontSize: 12, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false, opacity: 1
 }}>New event</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const decryptedData = this.props.decryptedData;

    //extraData={decryptedData} - for force refresh

    return (
      <View style={{ flex: 1, width: WIDTH, padding: 0, margin: 0, flexDirection: "column"}}>
        


        <View style={{ flex: 1, width: WIDTH, padding: 0, margin: 0, flexDirection: "column", alignItems: 'stretch', }}>

 
           {this.props.data.eventsHeader.length > 0
          ? <View 
          style={{ height: 45, width: WIDTH, padding: 0, margin: 0, flexDirection: "row", top: 0,         backgroundColor: this.props.colors.header, elevation: 8, justifyContent: "center",
           }}>
          {this.renderHeaderEvents(this.props.data.eventsHeader)}
        </View>
          : <View 
          style={{ height: this.props.darkTheme ? 0 : 2, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "column",          backgroundColor: this.props.colors.header, elevation: 8
           }}>
             </View>
          }
          
          
          <ScrollView

            ref="scroll"

            onLayout={(e) => {
              //Scroll to current hour on layout
              let y = this.props.positionY
                         this.refs.scroll.scrollWithoutAnimationTo(y, 10);
            }}
            onScrollEndDrag={(e) => {
            }}

            style={{ width: this.props.width, marginTop: 5
            }}>
            {this.renderLines(this.props.selectedDay)}
            {this.renderEvents(this.props.data.events)}
            {this.renderTimeNowLine(this.props.selectedDay)}
            {this.state.showNewEvent
              ? this.renderNewEvent(this.state.showNewEvent.hour)
              : null
            }
          </ScrollView>

        </View>


      </View>
    )

  }

}

class FilteredView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 1,
      positionY: "",
      swipeIndex: 2,
      animatedLayout: false,

    };
  }

  componentWillMount() {
    let y = getHours(this.props.selectedDay) * 40
    this.setState({ positionY: y })
    //this.scrollView.scrollTo({x: 0, y: 900, animated: true })
  }

  updateYPosition = (newPosition) => {
    this.setState({ positionY: newPosition })
  }



  //Filter all events before further selection
  filteredEvents = (week) => {

    let weekEvents = [] //Array of events for each day
    let weekEventsHeader = [] //Array of events for each day

    let filteredEvents = this.props.data.map(event => {
      //Loop over all events
        //Loop over all days in week to filter only relevant events for that week
        if (this.findEvents(week, event)) {

          //Here we find event for each day. So it is better for performance to prepare theme for further rendering here
          if (differenceInCalendarDays(parse(event.dateTill), parse(event.dateFrom)) == 0 && event.allDay == "false") {
            weekEvents.push(event)
          } else if (differenceInCalendarDays(parse(event.dateTill), parse(event.dateFrom)) > 0 || event.allDay == "true") {
            weekEventsHeader.push(event)
          }
        }
      }
    )
    let data = {events: weekEvents, eventsHeader: weekEventsHeader}
    if (this.state.animatedLayout) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
    }

    return data
  }



  findEvents = (baseDate, eventDate) => {

  return areIntervalsOverlapping({start: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 0, 0)), end: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 23, 30))}, {start: parse(eventDate.dateFrom), end: parse(eventDate.dateTill)})  }



  changeSwipeIndex = (index) => {
    this.setState({ swipeIndex: index })
  }
  componentDidMount() {

  }
  render() {
    let emptyArray = {events: [[], [], [], [], [], [], []], eventsHeader: [[], [], [], [], [], [], []]}

    const timetableWrapper = {
      flex: 1,
     
    }
    const bodyStyle = {
      flex: 1,

    }
    return (
      <View style={timetableWrapper} onLayout={() => {
        this.setState({ animatedLayout: true })
      }}>

        <Carousel
          ref='ViewPager'
          isLooped={true}        
          autoplay={false}
          interval={2000}
          currentPage={1}
          indicator={false}
          /*
          onPageScrollStateChanged={() => {
            let index = this.refs.ViewPager._selected
          }
           
          }*/
 
          onAnimateNextPage={(index) => {
            this.props.getDaysUpdate(index)
            this.changeSwipeIndex(index)
          }}
          scrollEnabled={this.state.scrollEnabled}
          style={{
            flex: 1,
            flexDirection: 'column',
            
          }}>
          <View style={bodyStyle}>
            <Body 
      data={this.state.swipeIndex == "0" ? this.filteredEvents(this.props.days[0]) : emptyArray} 
      hours={this.props.hours}
              weekDays={this.props.days[0]}
              selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}
              calendars={this.props.calendars}
              cryptoPassword={this.props.cryptoPassword}
              eventBoxDisplay={this.props.eventBoxDisplay}
              saveEventAfterPost={this.props.saveEventAfterPost}
              showSnack={this.props.showSnack}
              daysText={this.props.daysText}
              positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              darkTheme={this.props.darkTheme}
              selectEvent={this.props.selectEvent}
              BottomSheet={this.props.BottomSheet}
              selectItem={this.props.selectItem}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              swipeIndex={this.state.swipeIndex}
            />
          </View>
          <View style={bodyStyle}>
            <Body 
            data={this.state.swipeIndex == "1" ? this.filteredEvents(this.props.days[1]) : emptyArray} 
            hours={this.props.hours}
              weekDays={this.props.days[1]}
              selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}
              calendars={this.props.calendars}
              cryptoPassword={this.props.cryptoPassword}
              eventBoxDisplay={this.props.eventBoxDisplay}
              saveEventAfterPost={this.props.saveEventAfterPost}
              showSnack={this.props.showSnack}
              daysText={this.props.daysText}
              positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              darkTheme={this.props.darkTheme}
              selectEvent={this.props.selectEvent}
              BottomSheet={this.props.BottomSheet}
              selectItem={this.props.selectItem}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              swipeIndex={this.state.swipeIndex}

            />
          </View>
          <View style={bodyStyle}>
            <Body 
            data={this.state.swipeIndex == "2" ? this.filteredEvents(this.props.days[2]) : emptyArray} 
            hours={this.props.hours}
              weekDays={this.props.days[2]}
              selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}
              calendars={this.props.calendars}
              cryptoPassword={this.props.cryptoPassword}
              eventBoxDisplay={this.props.eventBoxDisplay}
              saveEventAfterPost={this.props.saveEventAfterPost}
              showSnack={this.props.showSnack}
              daysText={this.props.daysText}
              positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              darkTheme={this.props.darkTheme}
              selectEvent={this.props.selectEvent}
              BottomSheet={this.props.BottomSheet}
              selectItem={this.props.selectItem}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              swipeIndex={this.state.swipeIndex}

            />
          </View>

        </Carousel >
      </View>

    )

  }
}




export default class DayView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventBoxDisplay: false,
      eventBoxObj: {},
      daysText: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      selectedDay: "",
      selectedEvent: "",
      weekDays: [],
      indexBefore: 1,
      dots: [],
      weeks: [],
      days: [],
      headerIndex: 2,
      isLoadingCalendar: true, 


    }
  }
 
  changeSwipeIndex = (index) => {
    this.setState({ headerIndex: index })
  }

  getDays = (myDate) => {
    this.setState({ selectedDay: myDate })
    let date = myDate
    let day0 = subDays(parse(date), 1)
    let day1 = date
    let day2 = addDays(parse(date), 1)
    let days = []

    days.push(day0)
    days.push(day1)
    days.push(day2)
    this.setState({ days: days, isLoadingCalendar: false })
    this.props.changeHeaderTitle(day1) //Change month in header

  }

  swipeHeader = (currentDate) => {
    let weekIndex = this.refs.HeaderSwiper._selected-1
    let weekDate = this.state.weeks[weekIndex][1]

    //SWIPE Header if moved to next week
    if (!isSameISOWeek(parse(currentDate), parse(weekDate))) {
          this.getWeekDays(currentDate)
          this.refs.HeaderSwiper.refs.VIEWPAGER._setPageWithoutAnimation(2)
    }

  }
  

  getDaysUpdate = (currentIndex) => {
    let index = currentIndex
    let currentDate = this.state.days[index]
    let dayBefore = subDays(parse(currentDate), 1)
    let dayAfter = addDays(parse(currentDate), 1)

    let newDays = []
    if (index == 2) {
      //weekBefore = 1
      //weekAfter = 0
      newDays.push(dayAfter)
      newDays.push(dayBefore)
      newDays.push(currentDate)
      this.setState({ days: newDays, selectedDay: currentDate })
    } else if (index == 0) {
      //weekBefore = 2
      //weekAfter = 1
      newDays.push(currentDate)
      newDays.push(dayAfter)
      newDays.push(dayBefore)
      this.setState({ days: newDays, selectedDay: currentDate })

    } else if (index == 1) {
      //weekBefore = 0
      //weekAfter = 2
      newDays.push(dayBefore)
      newDays.push(currentDate)
      newDays.push(dayAfter)
      this.setState({ days: newDays, selectedDay: currentDate })
    }
    this.props.changeHeaderTitle(currentDate) 
  }

  loadDates = () => {
    if (this.props.dateFromMonth) {
    this.getDays(this.props.dateFromMonth)
      this.props.resetDateFromMonth()
    } else {
    this.getDays(parse(new Date()))
    }
    
  }
  componentDidMount() {
    setTimeout(() => this.loadDates(new Date()), 10) //Need to setTimeout to prevent UI freeze when navigating to calendar


  }


  setDots = (dots) => {
    this.setState({ dots: dots })
  }

  render() {

    const eventListStyle = {

      flex: 1,
      flexDirection: "column"
    }

    return (
      <View style={{ flex: 1, width: WIDTH, 
    }}>
              <View style={{ flex: 1, width: WIDTH, padding: 0, margin: 0, flexDirection: "column", alignItems: 'stretch', }}>

        <View style={{ flex: 1, width: WIDTH, padding: 0,  margin: 0, flexDirection: "column",  height: 40,}}>

    

          {this.state.days.length >0 && this.props.allData && !this.state.isLoadingCalendar
            ?
            <FilteredView
              
              darkTheme={this.props.darkTheme}
              decryptedData={this.props.decryptedData}
              hours={this.state.hours}
              data={this.props.allData}
              selectedDay={this.state.selectedDay}
              selectEvent={this.selectEvent}
              showEvent={this.showEvent}
              calendars={this.props.calendars}
              cryptoPassword={this.props.cryptoPassword}
              eventBoxDisplay={this.state.eventBoxDisplay}
              saveEventAfterPost={this.props.saveEventAfterPost}
              showSnack={this.props.showSnack}
              daysText={this.state.daysText}
              nextWeek={this.nextWeek}
              previousWeek={this.previousWeek}
              indexBefore={this.state.indexBefore}
              days={this.state.days}
              getDaysUpdate={this.getDaysUpdate}
              getDaysInMonthUpdate={this.getDaysInMonthUpdate}
              selectItem={this.props.selectItem}
              BottomSheet={this.props.BottomSheet}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              setDots={this.setDots}
            />
            : <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Spinner color={this.props.colors.primary} />
        <Text style={{color: this.props.colors.gray, fontSize: 18, fontFamily: "OpenSans"}}>Loading calendar</Text>
        </View>
          }


</View>

        </View>
 
      
      </View>
    )
  }
}

const styles2 = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,


  },
  slide2: {
    flex: 1,
   
  },
  slide3: {
    flex: 1,


  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }
})
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
    height: 40,
  },
  containerWrapperStyle: {
    flex: 1,
  },
  hourColumnStyle: {
    width: 20,
    alignItems: "center",
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


