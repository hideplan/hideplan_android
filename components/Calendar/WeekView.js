import React from "react";
//import "./Register.css";
import { PanResponder, Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, Easing, } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays, startOfISOWeek, addHours } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';

const WIDTH = Dimensions.get('window').width;


class Event extends React.PureComponent {
      /*
    Dragging func
  constructor(props) {
    super(props);
    this.state = {
      dragging: false,
      initialTop: 0,
      initialLeft: 0,
      offsetTop: 0,
      offsetLeft: 0,
    }

  }
  panResponder = {}
  
  componentWillMount() {
 
    this.setState({ initialTop: this.props.offsetTop, initialLeft: this.props.offsetLeft })
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
    })
    */
  

  render () {
        /*
    Dragging func
    const {dragging, initialTop, initialLeft, offsetTop, offsetLeft} = this.state
    */

    const style = {
      position: "absolute", height: this.props.eventHeight, width: this.props.eventWidth, borderWidth: 1, borderColor: this.props.calendarColor, borderRadius: 12, alignItems: "center", zIndex: 2, elevation: this.props.eventElevation,
      backgroundColor: /*dragging ? 'blue' : */this.props.calendarColor,
      top: this.props.offsetTop,
      left: this.props.offsetLeft,
    }

    return (
      
      
      <View     //Dragging func {...this.panResponder.panHandlers}
          style={ style }>
             <TouchableWithoutFeedback
      onPress={() => { NavigationService.navigate('EventDetails', { text: this.props.event.text, id: this.props.event.uuid, dateFrom: this.props.event.dateFrom, dateTill: this.props.event.dateTill, location: this.props.event.location, notes: this.props.event.notes, reminder: this.props.event.reminder, calendar: this.props.event.calendar }) }}
    >
             <Text numberOfLines={2} style={{ color: "white", fontSize: 15 }}>{this.props.offsetLeft.toString()}{this.props.event.text} </Text>
             </TouchableWithoutFeedback>
             </View>
            
            
    )
  }
}

      /*
    Dragging func
  handleStartShouldSetPanResponder = () => {
    return true
  }

  // We were granted responder status! Let's update the UI
  handlePanResponderGrant = () => {
    this.setState({dragging: true})
  }

  // Every time the touch/mouse moves
  handlePanResponderMove = (e, gestureState) => {
  
    // Keep track of how far we've moved in total (dx and dy)



    this.setState({
      offsetTop: gestureState.dy,
      offsetLeft: gestureState.dx,
    })
  }

  getDayIndex = (xPosition) => {
    oneDay = (WIDTH / 7) 
    if (xPosition <= oneDay) {
      return 0
    } else if (xPosition <= oneDay * 2) {
      return 1
    } else if (xPosition <= oneDay * 3) {
      return 2 
    } else if (xPosition <= oneDay * 4) {
      return 3 
    } else if (xPosition <= oneDay * 5) {
      return 4 
    } else if (xPosition <= oneDay * 6) {
      return 5 
    } else if (xPosition <= oneDay * 7) {
      return 6 
    }
  }
  


  convertToText(newDateFrom, newDateTill) {

    //let eventReminder = this.getEventReminder();
    let valueForEncryption = `{"dateFrom": "${newDateFrom}", "dateTill": "${newDateTill}", "text": "${this.props.event.text}", "location": "${this.props.event.location}", "notes": "${this.props.event.notes}", "reminder": "", "calendar": "${this.props.event.calendar}"}`;
    console.log(valueForEncryption)
    return valueForEncryption;
  }

  saveEvent(dayIndex, hourIndex) {
    let newDate = this.getNewDate(dayIndex, hourIndex)
    let dateFrom = newDate.dateFrom
    let dateTill = newDate.dateTill
    let timestamp = new Date().getTime()

    let dataForEncryption = this.convertToText(dateFrom, dateTill);
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    sendPost("https://api.hideplan.com/edit/event", {
      id: this.props.event.uuid,
      dateFrom: dateFrom,
      timestamp: timestamp,
      data: encryptedData
    }, () => {this.getEventId(encryptedData, dateFrom, dateTill)}, this.resetStateAfterFail)
  }

  getEventId(encryptedData, dateFrom, dateTill) {
    //this.props.removeOldEvent(this.props.eventData.uuid)
    this.props.editEvent("eventId" + this.props.event.uuid, { "id": this.props.event.uuid, "encryptedText": encryptedData }, {"dateFrom": dateFrom.toString(), "dateTill": dateTill.toString(), "id": this.props.event.uuid, "text": this.props.event.text, "location": this.state.location, "notes": this.props.event.notes, "reminder": ""//this.getEventReminder(), "calendar": this.props.event.calendar })
}

getNewDate = (dayIndex, hour) => {
  let formerDateFrom = this.props.event.dateFrom
  let firstDay = startOfISOWeek(formerDateFrom)
  let firstDayWithTime = new Date(getYear(firstDay), getMonth(firstDay), getDate(firstDay), 0, 0, 0)
  firstDayWithTime = addMinutes(firstDayWithTime, hour)
  console.log(hour)
  console.log(firstDayWithTime)
  let newDateFrom = addDays(firstDayWithTime, dayIndex)
  let newDateTill = addMinutes(newDateFrom, differenceInMinutes(this.props.event.dateTill, formerDateFrom))
  return {dateFrom: newDateFrom, dateTill: newDateTill}
}

 resetStateAfterFail = () => {
  this.setState({
    dragging: false,
    initialTop: this.props.offsetTop,
    initialLeft: this.props.offsetLeft,
    offsetTop: 0,
    offsetLeft: 0,
  }
  )
}

  // When the touch/mouse is lifted
  handlePanResponderEnd = (e, gestureState) => {
    const {initialTop, initialLeft} = this.state
    let dayIndex = this.getDayIndex(gestureState.moveX)
    let hourIndex = (gestureState.moveY - 131) * 2
    console.log(gestureState.moveY)
    console.log(gestureState.moveX)
    // The drag is finished. Set the initialTop and initialLeft so that
    // the new position sticks. Reset offsetTop and offsetLeft for the next drag.
    this.setState({
      dragging: false,
      initialTop: initialTop + gestureState.dy,
      initialLeft: initialLeft + gestureState.dx,
      offsetTop: 0,
      offsetLeft: 0,
    }, this.saveEvent(dayIndex, hourIndex)
    )
    

  }
  
}*/

export default class WeekView extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showNewEvent: false,
      calendarOffset: 0
    }

  }
  ///
  /// CALENDAR FUNCTIONS
  ///

  renderHeader() {
    // Show day and month under interactive list of days
    const dateFormat = "DD. MMMM";
    return (
      <View style={{ flex: 1, alignItems: "center", height: 20 }}>
        <Text style={{ color: "white" }}> {dateFns.format(this.props.selectedDate, dateFormat)}</Text>
      </View>
    );
  }

  renderDays() {
    const daysText = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const days = [];

    const collumn = {
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
      marginBottom: 2
    }

    for (let i = 0; i < daysText.length; i++) {
      days.push(
        <View style={calendarStyle.collumn}>
          <Text style={{ color: "white" }}>{daysText[i]}
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

  renderDaysNew = (data, selectedDay, flatlistIndex, callbackFunction) => {
    
    // Render days and assing each of them function to scroll Agenda 
    const dateFormat = "D";
    const todayDay = new Date();

    const collumn = {
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      flex: 1,
      alignSelf: 'stretch',
      alignItems: 'center',
    }

    return (data.map((week, index) => {

      if (isSameDay(week.day, todayDay)) {
        return (
          <View style={collumn}>

          <View style={collumn}>
            <TouchableOpacity
              //Scroll to index in agenda
              onPress={() => { this.props.openDay(week.day) }}
            >
              <View style={calendarStyle.circleCollumnBlue}>
                <Text style={calendarStyle.currentDay}>{dateFns.format(week.day, dateFormat)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={collumn}>
                    {week.data.length > 0
                    ? this.renderHeaderEvents(week.data)
                    : null
                    }
                    </View>
                    </View>
        )
      } else if (isSameDay(selectedDay, week.day)) {
        return (
          <View style={collumn}>

          <View style={collumn}>
            <TouchableOpacity
              //Scroll to index in agenda
              onPress={() => { this.props.openDay(week.day) }}
            >
              <View style={calendarStyle.circleCollumnBlack}>
                <Text style={calendarStyle.currentDay}>{dateFns.format(week.day, dateFormat)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
                    <View style={collumn}>
                    {week.data.length > 0
                    ? this.renderHeaderEvents(week.data)
                    : null
                    }
                    </View>
                    </View>

        )
      } else {
        return (
          <View style={collumn}>

          <View style={collumn}>
            <TouchableOpacity
              onPress={() => { this.props.openDay(week.day) }}
              >
              <View style={calendarStyle.circleCollumn}>
                <Text style={calendarStyle.day}>{dateFns.format(week.day, dateFormat)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={collumn}>
          {week.data.length > 0
          ? this.renderHeaderEvents(week.data)
          : null
          }
          </View>
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


  renderTimeNowLine = (item) => {
    // Render red line for current time only on Today page in Agenda
    // BUG - on every page
    let dateNow = new Date()
    let basicDay = new Date(getYear(dateNow), getMonth(dateNow), getDate(dateNow), 0, 0, 0)
    if (isSameDay(dateNow, this.props.selectedDate)) {
      // Offset from top is counted minutes difference from start of the day and current time
      let offsetTop = differenceInMinutes(dateNow, basicDay)

      return <View style={{ flex: 1, right: 0, width: "95%", backgroundColor: "red", height: 2, position: "absolute", borderRadius: 6, top: offsetTop, zIndex: 9999 }}></View>
    }
  }

  renderLines = () => {
    // Render lines for each hour
    const dataset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    return (dataset.map(hour => {
      return (
        <View style={styles.containerHourStyle}>
          <View style={styles.hourColumnStyle}>
            <Text style={styles.hourTextStyle}>{hour}</Text>
          </View>
          {hour % 2 === 0
            // Add border for every hour && add touch listener to create new events from Agenda
            ? <TouchableWithoutFeedback
              onPress={() => { this.createEvent(hour) }}>
              <View style={styles.eventColumnBordersStyle}>
                <Text>{""}</Text>
              </View>
            </TouchableWithoutFeedback>
            : <TouchableWithoutFeedback
              onPress={() => { this.createEvent(hour) }}
            ><View style={styles.eventColumnStyle}>
                <Text>{""}</Text>
              </View></TouchableWithoutFeedback>
          }
        </View>
      )
    }))
  }
  renderHours = () => {
    // Render lines for each hour
    const containerHourStyle = {
      flexDirection: "row",
      flex: 1,
      height: 60,
    }

    const hourColumnStyle = {
      width: 20,
      alignItems: "center",
    }

    const hourTextStyle = {
      position: "absolute",
      zIndex: 1,
      color: "white",
      fontSize: 15,

    }

    const dataset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    return (dataset.map(hour => {
      return (
        <View style={containerHourStyle}>
          <View style={hourColumnStyle}>
          {hour == 0 ? null : <Text style={hourTextStyle}>{hour}</Text>}
            
          </View>
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

    let tableWidth = (WIDTH - 20) / 7

    if (dataset) {
      return (dataset.map((event) => {
        let width = 1; //Full width
        let offsetLeft = 0

        return this.props.calendars.map(calendar => {
          if (calendar.uuid == event.calendar) {
            if (calendar.isChecked) {
              offsetLeft = 0


              if (differenceInCalendarDays(event.dateTill, event.dateFrom)  > 0) {
                dataset.map(item2 => {

                 this.props.calendars.map(calendar2 => {
                    if (calendar2.uuid == item2.calendar && item2.uuid !== event.uuid && offsetCount.includes(item2.uuid) === false) {
                      if (calendar2.isChecked) {
                        if (this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid && offsetCount.includes(item2.uuid) === false && differenceInCalendarDays(item2.dateTill, item2.dateFrom )  === 0) {
                          width = width + 1 //add width for every overlapping item
                          offsetCount.push(item2.uuid)
                        } //BUG event width is shrinked because of multi day events //Solved with differenceInCalendarDays
                      }
                    }
                
                })
              })
         
          if (offsetCount.length > 0) {
            offsetCount.push(event.uuid)
            offsetCountFinal = offsetCount.sort((a, b) => {
              return a - b //sort items for proper calculations of offset by id
            })
          }
          let offsetLeft = 0 // Basic offset if no overlapping
          if (offsetCountFinal) {
            offsetLeft = ((tableWidth / offsetCountFinal.length) * (offsetCountFinal.indexOf(event.uuid)))//count offset
          }
          let calendarColor
          this.props.calendars.map(item => {
            if (item.uuid === event.calendar) {
              return calendarColor = item.color
            }
          })
        


          let eventWidth = (tableWidth / width) ///event.width.toString() + "%"
          //event.left
          // BUG/TODO break event if continues next day
          // Current status: events is displayed in wrong place
          offsetCount = []
          offsetCountFinal = ""

          return (
            <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('gray', false)}
            onLongPress={() => { console.log("ee") }}
            onPress={() => { NavigationService.navigate('EventDetails', { text: event.text, id: event.uuid, dateFrom: event.dateFrom, dateTill: event.dateTill, location: event.location, notes: event.notes, reminder: event.reminder, calendar: event.calendar }) }}
          >
            <View style={{ position: "absolute", height: 20, top: 0, width: eventWidth, left: offsetLeft, backgroundColor: calendarColor, borderWidth: 1, borderColor: calendarColor, borderRadius: 4, alignItems: "center", zIndex: 99999}}>
             
                <Text numberOfLines={1} style={{ color: "white", fontSize: 15, }}>{event.text}</Text>
            </View>
            </TouchableNativeFeedback>

)
                  
}
}
}})})
)
}
}

  /*
   if (dataset) {
      return (dataset.map((event) => {
        let width = 1; //Full width
        return this.props.calendars.map(calendar => {
          if (calendar.uuid == event.calendar) {
            if (calendar.isChecked) {
              console.log("SCHEEEEECK")

              if (differenceInCalendarDays(event.dateTill, event.dateFrom)  === 0) {
                dataset.map(item2 => {

                  this.props.calendars.map(calendar2 => {
                    if (calendar2.uuid == item2.calendar) {
                      if (calendar2.isChecked) {
                        if (this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid && offsetCount.includes(item2.uuid) === false && differenceInCalendarDays(item2.dateTill, item2.dateFrom )  === 0) {
                          width = width + 1 //add width for every overlapping item
                          offsetCount.push(item2.uuid)
                        } //BUG event width is shrinked because of multi day events //Solved with differenceInCalendarDays
                      }
                    }
                
                })
  */

  renderEvents = (dataset) => {
    let offsetCount = [] //Store every event id of overlapping items
    let offsetCountFinal; //Sort events by id number
    let offsetCountHeader = [] //Store every event id of overlapping items
    let offsetCountFinalHeader; //Sort events by id number
    let tableWidth = (WIDTH - 20) / 7

    if (dataset) {
      return (dataset.map((event) => {
        let width = 1; //Full width
        let offsetLeft = 0
          return this.props.calendars.map(calendar => {
            if (calendar.uuid == event.calendar) {
              if (calendar.isChecked) {
                offsetLeft = 0

                if (differenceInCalendarDays(event.dateTill, event.dateFrom)  === 0) {
                  dataset.map(item2 => {
  
                   this.props.calendars.map(calendar2 => {
                      if (calendar2.uuid == item2.calendar && item2.uuid !== event.uuid && offsetCount.includes(item2.uuid) === false) {
                        if (calendar2.isChecked) {
                          if (this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid && offsetCount.includes(item2.uuid) === false && differenceInCalendarDays(item2.dateTill, item2.dateFrom )  === 0) {
                            width = width + 1 //add width for every overlapping item
                            offsetCount.push(item2.uuid)
                          } //BUG event width is shrinked because of multi day events //Solved with differenceInCalendarDays
                        }
                      }
                  
                  })
                })

                  if (offsetCount.length > 0) {
                  offsetCount.push(event.uuid)
                  offsetCountFinal = offsetCount.sort((a, b) => {
                    return a - b //sort items for proper calculations of offset by id
                  })
                }
      
                 // Basic offset if no overlapping
                if (offsetCountFinal) {
                  offsetLeft = ((tableWidth / offsetCountFinal.length) * (offsetCountFinal.indexOf(event.uuid)))//count offset
                }
        
                let calendarColor
                this.props.calendars.map(item => {
                  if (item.uuid == event.calendar) {
                    calendarColor = item.color
                  }
                 
                })

                let offsetTop = differenceInMinutes(event.dateFrom, new Date(getYear(event.dateFrom), getMonth(event.dateFrom), getDate(event.dateFrom), 0, 0, 0)) 
      
                let eventHeight = differenceInMinutes(event.dateTill, event.dateFrom) 
                let eventWidth = (tableWidth / width) ///event.width.toString() + "%"
                //event.left
                // BUG/TODO break event if continues next day
                // Current status: events is displayed in wrong place
                offsetCount = []
                offsetCountFinal = ""
                let eventElevation = 0
                return (
      
                  <Event 
                  eventHeight={eventHeight}
                  offsetTop={offsetTop}
                  eventWidth={eventWidth}
                  offsetLeft={offsetLeft}
                  calendarColor={calendarColor}
                  eventElevation={eventElevation}
                  event={event}
                  editEvent={this.props.editEvent}
                  cryptoPassword={this.props.cryptoPassword}
      
                  />
                  )
                  
                }
          }
          }})})
      )
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

  componentDidMount() {
    //this.scrollView.scrollTo({x: 0, y: 900, animated: true })
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
    let topOffset = hour * 60
    return (
      <TouchableNativeFeedback
        onPress={() => { NavigationService.navigate('NewEvent', { date: this.calculateNewEventTime(hour) }) }}
      ><View style={{ flex: 1, position: "absolute", height: 60, top: topOffset, width: 300, left: 30, backgroundColor: "rgba(30, 143, 255, 0.479)", borderWidth: 1, borderColor: "dodgerblue", alignItems: "center" }}>
          <Text style={{ color: "black", fontWeight: "bold", fontSize: 22 }}>Create new event</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderTableHours = (day) => {
    // Render lines for each hour
    const fullBorder = {
      alignSelf: "center",
      width: (WIDTH - 20) / 7,
      height: 60,
      borderBottomWidth: 0.2,
      borderTopWidth: 0.2,
      borderTopColor: "gray",
      borderBottomColor: "gray",
      borderRightWidth: 0.2,
      borderRightColor: "gray",
      padding: 0,
      margin: 0,
    }
    const topBorder = {
      alignSelf: "center",
      width: (WIDTH - 20) / 7,
      height: 60,
      borderBottomWidth: 0.2,
      borderTopWidth: 0.2,
      borderTopColor: "gray",
      borderRightWidth: 0.2,
      borderRightColor: "gray",
      borderBottomColor: "gray",
      padding: 0,
      margin: 0,
    }

    const leftBorder = {
      alignSelf: "center",
      width: (WIDTH - 20) / 7,
      height: 60,
      borderRightWidth: 0.2,
      borderRightColor: "gray",
      padding: 0,
      margin: 0,
    }

    const noBorder = {
      alignSelf: "center",
      width: (WIDTH - 20) / 7,
      height: 60,
      borderRightWidth: 0.2,
      borderRightColor: "gray",
      padding: 0,
      margin: 0,
    }
    let dayIndex = getDay(day.day)

    const dataset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
    return (dataset.map((hour, index) => {
      if (index !== 24) {
        let style
        if (hour % 2 == 0 && dayIndex % 2 == 0) {
          style = fullBorder 
        } else if (dayIndex % 2 == 0) {
          style = leftBorder
        } else if (hour % 2 == 0) {
          style = topBorder
        } else {
          style = noBorder
        }
      return (
        <TouchableWithoutFeedback onPress={() => this.showNewEvent(day, hour)}>
        
        <View style={style}>
        
        </View>
        </TouchableWithoutFeedback>
      )}
    }))
  }

  showNewEvent = (day, hour) => {
    let dayIndex = getDay(day.day)
    let eventDay;
    if (dayIndex === 0) {
      eventDay = (6 * ((WIDTH -20) / 7)) 
    } else {
      eventDay = ((dayIndex - 1 ) * ((WIDTH -20) / 7)) 
    }
   
    this.setState({ showNewEvent: {left: eventDay, top: hour * 60, day: day.day, hour: hour } })
  }


  renderOneDay = (data, showNewEvent) => {
    return data.map(day => {
      return (
        <View style={calendarStyle.collumn}>
          {this.renderTableHours(day)}
          {this.renderEvents(day.data)}
        </View>

      )
    })


  }

  render() {

    const decryptedData = this.props.decryptedData;

    //extraData={decryptedData} - for force refresh

    return (
      <View style={{ flex: 1, width: WIDTH }}>

        <FlatList
          ref={(el) => this.calendar = el}
          initialNumToRender={5}
          windowSize={6}
          initialScrollIndex={3}
          data={this.props.weeksData}
          extraData={this.props.weeksData}
          style={{ flex: 1, width: WIDTH }}
          keyExtractor={(item, index) => item.weekId}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={true}
          removeClippedSubviews={true}
          onEndReached={(event) => {
            this.props.loadMoreData("minus")
            /*
            if (contentOffset < 400) {
              this.props.loadMoreData("minus")

            } else {
              this.props.loadMoreData("add")

            }
              */
          }}
          onMomentumScrollEnd={event => {
            let contentOffset = event.nativeEvent.contentOffset.x;
            let newDate;
            let dataset = this.props.weeksData
            let firstDay = dataset[0].data[0].day
            let lastDay = dataset[dataset.length-1].data[6].day
            this.props.loadMoreData("minus")

            console.log(contentOffset)
            console.log(this.state.calendarOffset)
            if (contentOffset > this.state.calendarOffset) {
              //Right swipe
              newDate = addDays(this.props.selectedDate, 7)
              console.log(newDate)

              this.props.changeDate(newDate)
              this.setState({ calendarOffset: contentOffset })
              console.log(differenceInCalendarDays(newDate, lastDay))

            } else if ( 0 > 10 ) {
              //Left swipe
              newDate = subDays(this.props.selectedDate, 7)
              this.props.changeDate(newDate)
              console.log(newDate)
              if (differenceInCalendarDays(newDate, firstDay) < 25) {
                this.props.loadMoreData("minus")
              }
              this.setState({ calendarOffset: contentOffset })
              console.log(differenceInCalendarDays(newDate, firstDay))
            }



          }}
          renderItem={({ index, item }) =>
            <View style={{ flex: 1, width: WIDTH, padding: 0, margin: 0, flexDirection: "column"}}>
           <View style={{ height: 70, width: WIDTH, padding: 0, margin: 0, flexDirection: "column", elevation: 12,        backgroundColor: "#EF2647",
            }}>

              <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: WIDTH - 20,
                flex: 1,
                position: "absolute",
                top: 0,
                left: 20,
                alignSelf: 'stretch',
                padding: 0,
                margin: 0,
                height: 10,
                zIndex: 10,
              }}>
                {this.renderDays()}
              </View>
              <View style={{
                flexDirection: "row",
                flexWrap: "wrap",
                width: WIDTH - 20,
                flex: 1,
                position: "absolute",
                top: 10,
                left: 20,
                alignSelf: 'stretch',
                padding: 0,
                margin: 0,
                height: 60,
                zIndex: 10,

              }}>
              {this.renderDaysNew(item.data, this.props.selectedDate, index, this.scrollToIndexAgenda)}
              </View>

              </View>
    

              <View style={calendarStyle.row}>
          
                <ScrollView

                  ref="scroll"


                  onLayout={event => {
                    const layout = event.nativeEvent.layout;
                  }}


                  style={{ width: this.props.width, }}>
                  <View style={{ flex: 1}}>

                    <View style={{ position: "absolute", width: 20, margin: 0, padding: 0,  }}>
                      {this.renderHours()}
                    </View>
                    <View style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      width: WIDTH - 20,
                      flex: 1,
                      left: 20,
                      alignSelf: 'stretch',
                      padding: 0,
                      marginTop: 0,
                      height: 1440
                    }}>

{this.state.showNewEvent
  ? <TouchableWithoutFeedback
  onPress={() => {
    let eventTime = this.calculateNewEventTime(this.state.showNewEvent.day, this.state.showNewEvent.hour )
    this.setState({ showNewEvent: false })
    NavigationService.navigate('NewEvent', { date: eventTime }) }}
><View style={{ flex: 1, position: "absolute", height: 60, top:this.state.showNewEvent.top, width: (WIDTH -20) /7 , left: this.state.showNewEvent.left, backgroundColor: "dodgerblue", borderWidth: 1, borderColor: "dodgerblue", alignItems: "center", borderRadius: 12, zIndex: 9999}}>
    <Text style={{ color: "white", fontSize: 14 }}>New</Text>
  </View>
</TouchableWithoutFeedback>
  : null
  }
                      {this.renderOneDay(item.data, this.showNewEvent)}
                      
                    </View>

                  </View>



                </ScrollView>                      

              </View>
            </View>
          }
        />

      </View>
    )
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
    backgroundColor: "gray",
  },
  circleCollumnBlue: {
    flex: 1,
    height: 30,
    width: 30,
    borderRadius: 15,
    backgroundColor: "black",
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
    color: "white",
    fontSize: 22,
  },
  currentDay: {
    color: "white",
    fontSize: 22,
    alignItems: 'center',
    alignSelf: "center"
  },
  selectedDay: {
    color: "white",
    alignItems: 'center',
    alignSelf: "center",
    fontSize: 22,
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
    zIndex: 1,
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
    width: 60,
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


