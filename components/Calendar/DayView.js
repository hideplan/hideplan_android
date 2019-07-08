import React from "react";
//import "./Register.css";
import { View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, Easing, } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isSameISOWeek, isToday, isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Swiper, TitleBar, TabBar } from 'react-native-awesome-viewpager';
import { FabIcon } from '../../customComponents.js';
import { Button } from 'native-base';
import { EventDetails } from '../../components/EventDetails/Event';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;






class Header extends React.Component {



  render() {

    const column = (WIDTH - 30) / 7
    
    const headerStyle = {
      flex: 1,
      flexDirection: "column",
      margin: 0,

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
      color: this.props.darkTheme ? "mintcream" : "black",
      fontSize: 18,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      alignSelf: "center",
      textAlign: "center",
    }
    const dayTextToday= {
      margin: 0, 
      padding: 1,
      color: "mintcream",
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      fontSize: 18,
      alignSelf: "center",
      textAlign: "center",
    }
    const dayTextWhite = {
      margin: 0, 
      padding: 1,
      color: this.props.darkTheme ? "black" : "mintcream",
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
      backgroundColor: "dodgerblue",
      alignItems: "center",
      justifyContent: "center", 
    }
    const circleColumnBlack = {
      height: column / 6 * 4,
      width: column / 6 * 4,
      borderRadius: column / 6 * 4 / 2,
      backgroundColor: this.props.darkTheme ? "white" : "black",
      alignSelf: "center",
      justifyContent: "center", 
    }
    const dayTextSmall = {
      margin: 0, 
      padding: 1,
      color: this.props.darkTheme ? "#D2E5F4" : "#2F3344",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      alignSelf: "center",
      textAlign: "center"
    }
  
    const dotStyle = {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: "dodgerblue",
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
      if (isToday(day)) {
        return <View style={dataRow}>
      <View style={headerRow}>
      <View style={todayDay}>
      <TouchableNativeFeedback
        onPress={() => { this.props.getDays(day)}}
      >
              <View style={circleColumnBlue}>
      <Text style={dayTextToday}>{getDate(day)}</Text>
      </View>
      </TouchableNativeFeedback>
      </View>
      </View>
      <View style={dayEvent}>
      {this.props.dots[index]
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
      >
              <View style={circleColumnBlack}>
      <Text style={dayTextWhite}>{getDate(day)}</Text>
      </View>
      </TouchableNativeFeedback>
      </View>
      </View>
      <View style={dayEvent}>
      {this.props.dots[index]
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
      ><View style={circleColumn}>
      <Text style={dayText}>{getDate(day)}</Text>
      </View>
      </TouchableNativeFeedback>
      </View>
  
      </View>
      <View style={dayEvent}>
      {this.props.dots[index]
      ? <View style={dotStyle}></View>
      : <View style={emptyDotStyle}></View>
      }
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
        <Text style={{ color: this.props.darkTheme ? "mintcream" : "black", fontFamily: 'Poppins-Regular', includeFontPadding: false,
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
          <Text style={{ color: this.props.darkTheme ? "mintcream" : "black", fontFamily: 'Poppins-Regular', includeFontPadding: false, }}>{daysText[i]}
          </Text>
        </View>
      )
    }
    return <View style={calendarStyle.row}>{days}</View>
  }

  renderDots(data) {
    // Render dots under days with events
    return (
      data.map(week => {
        if (week.data.length > 0) {
          return (<View style={calendarStyle.collumn}>
            <Text style={calendarStyle.circle}>{" "}
            </Text>
          </View>)
        } else {
          return (<View style={calendarStyle.collumn}><Text>{" "}
          </Text>
          </View>)
        }
      })
    )
  }

  getIndex = (flatlistIndex, datasetIndex) => {
    // Get index of selected day
    if (flatlistIndex === 0) {
      return datasetIndex
    } else {
      return flatlistIndex * 7 + datasetIndex
    }
  }

  renderDaysNew = (data, selectedDay, flatlistIndex, callbackFunction) => {
    // Render days and assing each of them function to scroll Agenda 
    const dateFormat = "D";
    const todayDay = new Date();
    return (data.map((week, index) => {

      if (isSameDay(week.day, todayDay)) {

        return (
          <View style={calendarStyle.collumn}>
            <TouchableOpacity
              //Scroll to index in agenda
              onPress={() => { callbackFunction(this.getIndex(flatlistIndex, index)) }}
            >
              <View style={calendarStyle.circleCollumnBlue}>
                <Text style={calendarStyle.currentDay}>{dateFns.format(week.day, dateFormat)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      } else if (isSameDay(selectedDay, week.day)) {
        return (
          <View style={calendarStyle.collumn}>
            <TouchableOpacity
              //Scroll to index in agenda
              onPress={() => { callbackFunction(this.getIndex(flatlistIndex, index)) }}
            >
              <View style={calendarStyle.circleCollumnBlack}>
                <Text style={calendarStyle.currentDay}>{dateFns.format(week.day, dateFormat)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      } else {
        return (
          <View style={calendarStyle.collumn}>
            <TouchableOpacity
              onPress={() => { callbackFunction(this.getIndex(flatlistIndex, index), week.day) }}
            >
              <View style={calendarStyle.circleCollumn}>
                <Text style={calendarStyle.day}>{dateFns.format(week.day, dateFormat)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    })
    )
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
    let basicDay = new Date(getYear(dateNow), getMonth(dateNow), getDate(dateNow), 0, 0, 0)
    if (isSameDay(day, new Date())) {
      // Offset from top is counted minutes difference from start of the day and current time
      let offsetTop = differenceInMinutes(dateNow, basicDay) / 1.5

      return <View style={{ flex: 1, left: 35, width: WIDTH - 50, backgroundColor: "mintcream", height: 2, position: "absolute", borderRadius: 6, top: offsetTop, zIndex: 9999 }}></View>
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
      borderColor: this.props.darkTheme ? "#677477" : "black"
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
      color: this.props.darkTheme ? "#CEE8EF" : "#485154",
      fontSize: 14,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      borderColor: this.props.darkTheme ? "mintcream" : "black"
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
    return areRangesOverlapping(
      firstDate.dateFrom, firstDate.dateTill, secondDate.dateFrom, secondDate.dateTill)
  }

  checkOverlappingHeaderEvents = (firstDate, secondDate) => {
    let firstDateStart = new Date(getYear(firstDate.dateFrom), getMonth(firstDate.dateFrom), getDate(firstDate.dateFrom), 0, 0, 0)
    let firstDateEnd = new Date(getYear(firstDate.dateTill), getMonth(firstDate.dateTill), getDate(firstDate.dateTill), 23, 59, 59)
    let secondDateStart = new Date(getYear(secondDate.dateFrom), getMonth(secondDate.dateFrom), getDate(secondDate.dateFrom), 0, 0, 0)
    let secondDateEnd = new Date(getYear(secondDate.dateTill), getMonth(secondDate.dateTill), getDate(secondDate.dateTill), 23, 59, 59)

    return areRangesOverlapping(
      firstDateStart, firstDateEnd, secondDateStart, secondDateEnd)
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

    let tableWidth = WIDTH - 50


    if (dataset) {
      return (dataset.map((event) => {
        let width = 1; //Full width
        let offsetLeft = 40 // Basic offset if no overlapping

        return this.props.calendars.map(calendar => {
          if (calendar.uuid == event.calendar) {
            if (calendar.isChecked) {
        if (differenceInCalendarDays(event.dateTill, event.dateFrom) > 0) {

          dataset.map(item2 => {
            if (this.checkOverlappingHeaderEvents(event, item2) && event.uuid !== item2.uuid && differenceInCalendarDays(item2.dateTill, item2.dateFrom) > 0) {
              width = width + 1 //add width for every overlapping item
              offsetCount.push(item2.uuid)
            } else if (this.checkOverlappingHeaderEvents(event, item2) && event.uuid == item2.uuid && differenceInCalendarDays(item2.dateTill, item2.dateFrom) > 0) {
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


          let offsetTop = differenceInMinutes(event.dateFrom, new Date(getYear(event.dateFrom), getMonth(event.dateFrom), getDate(event.dateFrom), 0, 0, 0)) / 1.5

          let eventHeight = differenceInMinutes(event.dateTill, event.dateFrom) / 1.5

          let eventWidth = (tableWidth / width) ///event.width.toString() + "%"
          //event.left
          // BUG/TODO break event if continues next day
          // Current status: events is displayed in wrong place

          let calendarColor
          this.props.calendars.map(item => {
            if (item.uuid == event.calendar) {
              return calendarColor = item.color
            }
          })


          offsetCount = []
          offsetCountFinal = ""
          return (
            <TouchableNativeFeedback
            onPress={() => { this.props.selectItem(event), this.props.BottomSheet.open() } }
            >
              <View style={{ position: "absolute", height: 30, top: 0, width: eventWidth, left: offsetLeft, backgroundColor: calendarColor, borderWidth: 1, borderColor: calendarColor, borderRadius: 8, alignItems: "center", zIndex: 25 }}>

                <Text style={{ fontSize: 16, color: "mintcream", fontFamily: 'Poppins-Regular', includeFontPadding: false, }}>{event.text}</Text>
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
        if (differenceInCalendarDays(event.dateTill, event.dateFrom) < 1) {

          dataset.map(item2 => {
            if (this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid && differenceInCalendarDays(item2.dateTill, item2.dateFrom) === 0) {
              width = width + 1 //add width for every overlapping item
              offsetCount.push(item2.uuid)
            } else if (this.checkOverlappingEvents(event, item2) && event.uuid == item2.uuid && differenceInCalendarDays(item2.dateTill, item2.dateFrom) === 0) {
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


          let offsetTop = differenceInMinutes(event.dateFrom, new Date(getYear(event.dateFrom), getMonth(event.dateFrom), getDate(event.dateFrom), 0, 0, 0)) / 1.5

          let eventHeight = differenceInMinutes(event.dateTill, event.dateFrom) / 1.5
          let eventWidth = (tableWidth / width) ///event.width.toString() + "%"
          //event.left
          // BUG/TODO break event if continues next day
          // Current status: events is displayed in wrong place

          let calendarColor
              this.props.calendars.map(item => {
                if (item.uuid == event.calendar) {
                  calendarColor = item.color
                }
               
              })



          offsetCount = []
          offsetCountFinal = ""
          return (
            <TouchableNativeFeedback
            onPress={() => { this.props.selectItem(event), this.props.BottomSheet.open() } }
            >
              <View style={{ position: "absolute", height: eventHeight, top: offsetTop, width: eventWidth, left: offsetLeft, backgroundColor: calendarColor, borderWidth: 1, borderColor: calendarColor, borderRadius: 12, alignItems: "center" }}>

                <Text style={{ color: "mintcream", fontFamily: 'Poppins-Regular', includeFontPadding: false, fontSize: 18 }}>{event.text}</Text>
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
    let currentTimeLine = getHours(new Date())
    this.refs.scroll.scrollTo({ x: 1300, y: 1500, animated: false })
  }



  createEvent = (hour) => {
    // Display box for new event box directly in Agenda
    //Get hour position from table and trigger rendering new event
    this.setState({ showNewEvent: hour })
  }

  calculateNewEventTime(day, hour) {
    // Get date of new event
    let selectedDate = day
    let newEventDate = new Date(getYear(selectedDate), getMonth(selectedDate), getDate(selectedDate), hour, 0, 0)
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
    ><View style={{ flex: 1, position: "absolute", height: 40, top: topOffset, width: WIDTH - 40, left: 40, backgroundColor: "seagreen", borderWidth: 1, borderColor: "seagreen", borderRadius: 8, alignItems: "center", zIndex: 20 }}>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 22 }}>New event</Text>
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
          style={{ height: 40, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "column",    elevation: 8,         backgroundColor: this.props.darkTheme ? "#17191d" : "#F7F5F4",
           }}>
          {this.renderHeaderEvents(this.props.data.eventsHeader)}
        </View>
          : null
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

            style={{ width: this.props.width,
            backgroundColor: this.props.darkTheme ? "#202124" : "#F7F5F4",
            marginBottom: 12
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
      dataset: [],
      positionY: ""

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
  filteredEvents = (day) => {
    let events = []
    let eventsHeader = []
    let filteredEvents = this.props.data.map(event => {
        if (this.findEvents(day, event)) {
          if (differenceInCalendarDays(event.dateTill, event.dateFrom) == 0) {
            events.push(event)
          } else if (differenceInCalendarDays(event.dateTill, event.dateFrom) > 0) {
            eventsHeader.push(event)
          }
        }
      
    })
    let data = {events: events, eventsHeader: eventsHeader}
    return data
  }




  findEvents = (baseDate, eventDate) => {

    return areRangesOverlapping(new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 0, 0), new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 23, 30), eventDate.dateFrom, eventDate.dateTill)
  }



  chooseWeekdays = (slideIndex, index) => {
    if (slideIndex == index) {
      return this.props.week1
    } else if (slideIndex == 0 && index == 1) {
      return this.props.week0
    } else if (slideIndex == 0 && index == 2) {
      return this.props.week2
    } else if (slideIndex == 1 && index == 0) {
      return this.props.week2
    } else if (slideIndex == 1 && index == 2) {
      return this.props.week0
    } else if (slideIndex == 2 && index == 0) {
      return this.props.week0
    } else if (slideIndex == 2 && index == 1) {
      return this.props.week2
    }
  }

  componentDidMount() {

  }
  render() {

    const timetableWrapper = {
      flex: 1,
     
    }

    return (
      <View style={timetableWrapper}>

        <Swiper
          ref='ViewPager'
          loop={true}
          autoplay={false}
          interval={2000}
          initialPage={1}
          indicator={false}
          /*
          onPageScrollStateChanged={() => {
            let index = this.refs.ViewPager._selected
          }
           
          }*/
          onPageSelected={(e) => {
          ref='ViewPager'
          this.refs.ViewPager
              ? this.props.getDaysUpdate(this.refs.ViewPager._selected)
              : null
          }
          }
          scrollEnabled={this.state.scrollEnabled}
          style={{
            flex: 1,
            flexDirection: 'column',
            
          }}>
          <View style={styles2.slide1}>
            <Body data={this.filteredEvents(this.props.days[0])} hours={this.props.hours}
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
            />
          </View>
          <View style={styles2.slide2}>
            <Body data={this.filteredEvents(this.props.days[1])} hours={this.props.hours}
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
            />
          </View>
          <View style={styles2.slide3}>
            <Body data={this.filteredEvents(this.props.days[2])} hours={this.props.hours}
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
            />
          </View>

        </Swiper >
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
      days: [],
      weeks: [],
      dots: [],

    }
  }
 
  findEvents = (baseDate, eventDate) => {

    return areRangesOverlapping(new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 0, 0), new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 23, 30), eventDate.dateFrom, eventDate.dateTill)
  }
  //Filter all events before further selection
  filteredEvents = (week) => {
    let filteredEvents = this.props.allData.filter(event => {
      for (let i = 0; i < week.length; i++) {
        if (this.findEvents(week[i], event)) {
          return event
        }
      }
    })
    return filteredEvents
  }


  getDays = (myDate) => {
    this.setState({ selectedDay: myDate })
    let date = myDate
    let day0 = subDays(date, 1)
    let day1 = date
    let day2 = addDays(date, 1)
    let days = []

    days.push(day0)
    days.push(day1)
    days.push(day2)

    this.setState({ days: days })
    this.props.changeHeaderTitle(day1) //Change month in header

  }

  swipeHeader = (currentDate) => {
    let weekIndex = this.refs.HeaderSwiper._selected-1
    let weekDate = this.state.weeks[weekIndex][1]

    //SWIPE Header if moved to next week
    if (!isSameISOWeek(currentDate, weekDate)) {
          this.getWeekDays(currentDate)
          this.refs.HeaderSwiper.refs.VIEWPAGER._setPageWithoutAnimation(2)
    }

  }
  

  getDaysUpdate = (currentIndex) => {
    let index = currentIndex - 1
    let currentDate = this.state.days[index]
    let dayBefore = subDays(currentDate, 1)
    let dayAfter = addDays(currentDate, 1)

    let newDays = []
    this.swipeHeader(currentDate)
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


  getWeekDays = (date) => {
    let week0 = []
    let week1 = []
    let week2 = []
    let weekDays = []
    let dayInWeek = getDay(date)
    let startDate = subDays(date, dayInWeek - 1)
    if (dayInWeek === 0) {
      for (let i = 6; i > 0; i--) {
        week1.push(subDays(date, i))
      }
      week1.push(date)

    } else {
      week1.push(startDate)
      for (let i = 1; i < 7; i++) {
        week1.push(addDays(startDate, i))
      }
    }

    for (let i = 7; i > 0; i--) {
      week0.push(subDays(week1[0], i))
    }
    for (let i = 1; i < 8; i++) {
      week2.push(addDays(week1[6], i))
    }
    weekDays.push(week0)
    weekDays.push(week1)
    weekDays.push(week2)
    this.filteredEventsDots(week1)
    this.setState({ weeks: weekDays })
  }

  getWeekDaysUpdated = (currentIndex) => {
    let index = currentIndex - 1
    let firstDayCurrentWeek = this.state.weeks[index][0]
    let lastDayCurrentWeek = this.state.weeks[index][6]

    let weekBefore = []
    let weekAfter = []
    let newWeekDays = []
    for (let i=7; i>0; i--) {
      weekBefore.push(subDays(firstDayCurrentWeek, i))
    }
    for (let i=1; i<8; i++) {
      weekAfter.push(addDays(lastDayCurrentWeek, i))
    }
    if (index == 2) {
      //weekBefore = 1
      //weekAfter = 0
      newWeekDays.push(weekAfter)
      newWeekDays.push(weekBefore)
      newWeekDays.push(this.state.weeks[index])
      this.filteredEventsDots(this.state.weeks[index])
      this.setState({ weeks: newWeekDays})
    } else if (index == 0) {
      //weekBefore = 2
      //weekAfter = 1
      newWeekDays.push(this.state.weeks[index])
      newWeekDays.push(weekAfter)
      newWeekDays.push(weekBefore)
      this.filteredEventsDots(this.state.weeks[index])
      this.setState({ weeks: newWeekDays})

    } else if (index == 1) {
      //weekBefore = 0
      //weekAfter = 2
      newWeekDays.push(weekBefore)
      newWeekDays.push(this.state.weeks[index])
      newWeekDays.push(weekAfter)
      this.filteredEventsDots(this.state.weeks[index])
      this.setState({ weeks: newWeekDays})
    }
    
  }

  findEvents = (baseDate, eventDate) => {
    
    return areRangesOverlapping(new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 0, 0), new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 23, 30), eventDate.dateFrom, eventDate.dateTill)
  }

  filteredEventsDots = (week) => {
    let dots = [false, false, false, false, false, false, false]
    let filteredEvents = this.props.allData.map(event => {
      for (let i=0; i<week.length; i++) {
        if (this.findEvents(week[i], event)) {
          dots[i] = true
        }
      }
    })
    this.setState({ dots: dots})
  }

  componentWillMount() {
    if (this.props.dateFromMonth) {
      this.getWeekDays(this.props.dateFromMonth)
    this.getDays(this.props.dateFromMonth)
      this.props.resetDateFromMonth()
    } else {
      this.getWeekDays(new Date())
    this.getDays(new Date())
    }
    

  }
  render() {

    const eventListStyle = {

      flex: 1,
      flexDirection: "column"
    }

    return (
      <View style={{ flex: 1, width: WIDTH, backgroundColor: this.props.darkTheme ? "#202124" : "#F7F5F4"
    }}>
              <View style={{ flex: 1, width: WIDTH, padding: 0, margin: 0, flexDirection: "column", alignItems: 'stretch', }}>

        <View style={{ flex: 1, width: WIDTH, padding: 0,  margin: 0, flexDirection: "column",  height: 40,}}>


          {this.state.weeks && this.state.dots
            ? <Swiper
              ref='HeaderSwiper'
              loop={true}
              autoplay={false}
              interval={2000}
              initialPage={1}
              indicator={false}
              /*
              onPageScrollStateChanged={() => {
                let index = this.refs.ViewPager._selected
              }
               
              }*/
              onPageSelected={(e) => {
                this.refs.HeaderSwiper
                  ? this.getWeekDaysUpdated(this.refs.HeaderSwiper._selected)
                  : null
              }
              }
              scrollEnabled={this.state.scrollEnabled}
              style={{
                height: 105, 
              }}>

<View 
         style={{ height: 40, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "column",      backgroundColor: this.props.darkTheme ? "#17191d" : "#F7F5F4",
          }}>

                <Header
                  daysText={this.state.daysText}
                  weekDays={this.state.weeks[0]}
                  hours={this.state.hours}
                  selectedDay={this.state.selectedDay}
                  getDays={this.getDays}
                  dots={this.state.dots}
                  darkTheme={this.props.darkTheme}
                  selectItem={this.props.selectItem}
                  BottomSheet={this.props.BottomSheet}

                />
                </View>
                <View 
         style={{ height: 40, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "column",      backgroundColor: this.props.darkTheme ? "#17191d" : "#F7F5F4",
          }}>
                <Header
                  daysText={this.state.daysText}
                  weekDays={this.state.weeks[1]}
                  hours={this.state.hours}                  selectedDay={this.state.selectedDay}
                  getDays={this.getDays}
                  dots={this.state.dots}
                  darkTheme={this.props.darkTheme}
                  selectItem={this.props.selectItem}
                  BottomSheet={this.props.BottomSheet}

                />
                </View>
                <View 
         style={{ height: 40, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "column",       backgroundColor: this.props.darkTheme ? "#17191d" : "#F7F5F4",
          }}>
                <Header
                  daysText={this.state.daysText}
                  weekDays={this.state.weeks[2]}
                  hours={this.state.hours}
                  selectedDay={this.state.selectedDay}
                  getDays={this.getDays}
                  dots={this.state.dots}
                  darkTheme={this.props.darkTheme}
                  selectItem={this.props.selectItem}
                  BottomSheet={this.props.BottomSheet}

                />
                </View>
            </Swiper>
            : null
          }


          {this.state.days && this.props.allData
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
            />
            : null
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


