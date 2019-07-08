import React from "react";
//import "./Register.css";
import { PanResponder, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, Easing, } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays, startOfISOWeek, addHours, isToday } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { Swiper, TitleBar, TabBar } from 'react-native-awesome-viewpager';
import { FabIcon } from '../../customComponents.js';
import { Button } from 'native-base';
import { EventDetails } from '../../components/EventDetails/Event';

const HEIGHT = Dimensions.get('window').height;

const WIDTH = Dimensions.get('window').width;
/*
 <Swiper 
      style={styles2.wrapper} 
      showsButtons={true}
      index={2}
      onIndexChanged={(index) => {
        let date = this.props.selectedDate
        let daysNext = addDays(date, 7)
        this.props.changeDate(daysNext)
      
        this.props.setDataToArray(daysNext)
      }}
      >
                {this.renderEvents(this.props.weeksData)}

      
      </Swiper>


}*/

//////////////////////////////úú

class Header extends React.Component {

         
  render () {

    const column = (WIDTH - 30) / 7
    
    const headerStyle = {
      flex: 1,
      flexDirection: "column",
      margin: 0,
      justifyContent: "center",

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


    const dayText = {
      margin: 0, 
      padding: 1,
      color: this.props.darkTheme ? "white" : "black",
      fontSize: 18,
      alignSelf: "center",
      textAlign: "center",
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const circleColumn = {
      height: column / 6 * 4,
      width: column / 6 * 4,
      borderRadius: column / 6 * 4 / 2,
      alignItems: "center",
      justifyContent: "center", 
    }
    const circleColumnBlack = {
      height: column / 6 * 4,
      width: column / 6 * 4,
      borderRadius: column / 6 * 4 / 2,
      backgroundColor: "dodgerblue",
      alignItems: "center",
      justifyContent: "center", 
      color: "white",
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    dayTextWhite = {
      margin: 0, 
      padding: 1,
      fontSize: 18,
      alignSelf: "center",
      textAlign: "center",
      color: "white",
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }


    const daysNumbers = this.props.weekDays.map(day => {
      
      if (isToday(day)) {
        return <View style={dataRow}>
        <View style={headerRow}>
        <View style={todayDay}>
                <View style={circleColumnBlack}>
        <Text style={dayTextWhite}>{getDate(day)}</Text>
        </View>
        </View>
        </View>

        
      </View>
      } else {
        return <View style={dataRow}>
        <View style={headerRow}>
        <View style={todayDay}>
        <View style={circleColumn}>
        <Text style={dayText}>{getDate(day)}</Text>
        </View>
        </View>
        </View>
        </View>

      }

    })


    return (
      <View style={headerStyle}>
     
      <View style={headerRow}>

        {daysNumbers}
        </View>

      </View>
    )
  }
}

class HeaderEvents extends React.Component {

 
  checkOverlappingEvents = (firstDate, secondDate) => {
    return areRangesOverlapping(
      firstDate.dateFrom, firstDate.dateTill, secondDate.dateFrom, secondDate.dateTill)
  }
    findEvents = (baseDate, eventDate) => {
      
      return areRangesOverlapping(new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 0, 0), new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 23, 30), eventDate.dateFrom, eventDate.dateTill)
    }
  
    checkOverlappingHeaderEvents = (firstDate, secondDate) => {
      let firstDateStart = new Date(getYear(firstDate.dateFrom), getMonth(firstDate.dateFrom), getDate(firstDate.dateFrom), 0, 0, 0)
      let firstDateEnd = new Date(getYear(firstDate.dateTill), getMonth(firstDate.dateTill), getDate(firstDate.dateTill), 23, 59, 59)
      let secondDateStart = new Date(getYear(secondDate.dateFrom), getMonth(secondDate.dateFrom), getDate(secondDate.dateFrom), 0, 0, 0)
      let secondDateEnd = new Date(getYear(secondDate.dateTill), getMonth(secondDate.dateTill), getDate(secondDate.dateTill), 23, 59, 59)
  
      return areRangesOverlapping(
        firstDateStart, firstDateEnd, secondDateStart, secondDateEnd)
    }
  
    renderEvents = (dataset) => {
      let offsetCount = [] //Store every event id of overlapping items
      let offsetCountFinal; //Sort events by id number
      let offsetCountHeader = [] //Store every event id of overlapping items
      let offsetCountFinalHeader; //Sort events by id number
      let tableWidth = (WIDTH - 30) / 7
    
    if (dataset) {
      return (dataset.map(event => {
  
      let width = 1; //Full width
      let offsetLeft = 0
      return this.props.calendars.map(calendar => {
        if (calendar.uuid == event.calendar) {
          if (calendar.isChecked) {
      if (differenceInCalendarDays(event.dateTill, event.dateFrom) > 0) {

        dataset.map(item2 => {
          if (this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid && differenceInCalendarDays(item2.dateTill, item2.dateFrom) > 0 && offsetCount.includes(item2.uuid) == false) {
            width = width + 1 //add width for every overlapping item
            offsetCount.push(item2.uuid)
          } else if (this.checkOverlappingEvents(event, item2) && event.uuid == item2.uuid && differenceInCalendarDays(item2.dateTill, item2.dateFrom) > 0 && offsetCount.includes(event.uuid) == false) {
            offsetCount.push(event.uuid)

          } //BUG event width is shrinked because of multi day events
        })

  
            if (offsetCount.length > 0) {
              offsetCountFinal = offsetCount.sort((a, b) => {
                return a - b //sort items for proper calculations of offset by id
              })
            }
  
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
        
                  let eventHeight = 20
                  let eventWidth = (tableWidth / width) ///event.width.toString() + "%"
                  //event.left
                  // BUG/TODO break event if continues next day
                  // Current status: events is displayed in wrong place
                  offsetCount = []
                  offsetCountFinal = ""
                  let eventElevation = 0
                  return (
                    <EventHeader
                    eventHeight={eventHeight}
                    offsetTop={offsetTop}
                    eventWidth={eventWidth}
                    offsetLeft={offsetLeft}
                    calendarColor={calendarColor}
                    eventElevation={eventElevation}
                    event={event}
                    editEvent={this.props.editEvent}
                    cryptoPassword={this.props.cryptoPassword}
                    selectEvent={this.props.selectEvent}
                    selectItem={this.props.selectItem}
                    BottomSheet={this.props.BottomSheet}
                    />
                    )
                    
                  }
            }
            }})})
        )
              }
            }
          
            componentWillMount() {
            }
    render () {
  
      const column = (WIDTH - 30) / 7
      
      const headerStyle = {
        flex: 1,
        flexDirection: "column",
        margin: 0,
        justifyContent: "center",
  
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
  
      const dayText = {
        margin: 0, 
        padding: 1,
        color: this.props.darkTheme ? "white" : "black",
        fontSize: 18,
        alignSelf: "center",
        textAlign: "center",
        
      }
      const circleColumn = {
        height: column / 6 * 4,
        width: column / 6 * 4,
        borderRadius: column / 6 * 4 / 2,
        alignItems: "center",
        justifyContent: "center", 
      }
      const circleColumnBlack = {
        height: column / 6 * 4,
        width: column / 6 * 4,
        borderRadius: column / 6 * 4 / 2,
        backgroundColor: "dodgerblue",
        alignItems: "center",
        justifyContent: "center", 
        color: "white",
      }
      dayTextWhite = {
        margin: 0, 
        padding: 1,
        fontSize: 18,
        alignSelf: "center",
        textAlign: "center",
        color: "white",
        fontFamily: 'Poppins-Regular', includeFontPadding: false
      }
  
  
      const daysNumbers = this.props.weekDays.map(day => {
        let dataForDay = this.props.data.filter(event => {
          if (this.findEvents(day, event)) {
            return event
          }})
        
          return <View style={dataRow}>
          <View style={headerRow}>
          <View style={todayDay}>
 <View style={{
          width: column,
        height: 30,
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center",
        }}>{this.renderEvents(dataForDay)}</View>
          </View>
          </View>
          </View>

      })
     
      return (
        <View style={headerStyle}>
       
        <View style={headerRow}>
  
          {daysNumbers}
          </View>
  
        </View>
      )
    }
  }
  
class EventHeader extends React.PureComponent {
  

render () {

const style = {
  position: "absolute", height: this.props.eventHeight, width: this.props.eventWidth, borderWidth: 1, borderColor: this.props.calendarColor, borderRadius: 8, alignItems: "center", zIndex: 9999999999999, elevation: this.props.eventElevation,
  backgroundColor: /*dragging ? 'blue' : */this.props.calendarColor,
  left: this.props.offsetLeft,
}

return (
  <View     //Dragging func {...this.panResponder.panHandlers}
      style={ style }>
                  <TouchableNativeFeedback
  onPress={() => { this.props.selectItem(this.props.event), this.props.BottomSheet.open() } }
>
         <Text numberOfLines={1} style={{ color: "white", fontSize: 13, fontFamily: 'Poppins-Regular', includeFontPadding: false,
 }}>
         {this.props.event.text} </Text>
         </TouchableNativeFeedback>
         </View>
        
        
)
}
}


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


(NavigationService.navigate('EditEvent', { ...this.props.event, ...{type:"events"}}))
*/

const style = {
  position: "absolute", height: this.props.eventHeight, width: this.props.eventWidth, borderWidth: 1, borderColor: this.props.calendarColor, borderRadius: 8, opacity: isFuture(this.props.event.dateTill) ? 1 : 0.4, alignItems: "center", zIndex: 2, elevation: this.props.eventElevation,
  backgroundColor: /*dragging ? 'blue' : */this.props.calendarColor,
  top: this.props.offsetTop,
  left: this.props.offsetLeft,
}

return (
  <TouchableNativeFeedback
  onPress={() => {this.props.selectItem(this.props.event), this.props.BottomSheet.open() } }
>
  <View     //Dragging func {...this.panResponder.panHandlers}
      style={ style }>
         <Text numberOfLines={2} style={{ color: "white", fontSize: 13, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,opacity: 1}}>
         {this.props.event.text} </Text>
         </View>
         </TouchableNativeFeedback>
)
}
}

class OneDay extends React.Component {


  findEvents = (baseDate, eventDate) => {
    
    return areRangesOverlapping(new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 0, 0), new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 23, 30), eventDate.dateFrom, eventDate.dateTill)
  }

  componentWillMount() {
    let dataForDay = this.props.data.filter(event => {
      if (this.findEvents(this.props.day, event)) {
        return event
      }})
    
    this.setState({ filteredData: dataForDay })
  }
 
  filterData = () => {
    "changing"
    let dataForDay = this.props.data.filter(event => {
      if (this.findEvents(this.props.day, event)) {
        return event
      }})
    
    this.setState({ filteredData: dataForDay })
  }



  eventsForDay = () => {
    //Filter only events for one day
    
      let dataForDay = this.props.data.filter(event => {
        if (this.findEvents(this.props.day, event)) {
          return event
        }
  })
  return dataForDay
}

checkOverlappingEvents = (firstDate, secondDate) => {
  return areRangesOverlapping(
    firstDate.dateFrom, firstDate.dateTill, secondDate.dateFrom, secondDate.dateTill)
}
renderEvents = (dataset) => {
  let offsetCount = [] //Store every event id of overlapping items
  let offsetCountFinal; //Sort events by id number
  let offsetCountHeader = [] //Store every event id of overlapping items
  let offsetCountFinalHeader; //Sort events by id number
  let tableWidth = (WIDTH - 30) / 7

  if (dataset) {
    return (dataset.map((event) => {
      let width = 1; //Full width
      let offsetLeft = 0
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

              let offsetTop = differenceInMinutes(event.dateFrom, new Date(getYear(event.dateFrom), getMonth(event.dateFrom), getDate(event.dateFrom), 0, 0, 0)) / 1.5    
              let eventHeight = differenceInMinutes(event.dateTill, event.dateFrom)  / 1.5  
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
                selectEvent={this.props.selectEvent}
                BottomSheet={this.props.BottomSheet}
                selectItem={this.props.selectItem}

    
                />
                )
                
              }
        }
        }})})
    )
          }
        }
      

renderDayHours = (day) => {
 // Render lines for each hour

 const borderColor = this.props.darkTheme ? "#677477" : "black"

 const fullBorder = {
  alignSelf: "center",
  width: (WIDTH - 30) / 7,
  height: 40,
  borderBottomWidth: 0.2,
  borderTopWidth: 0.2,
  borderTopColor: borderColor,
  borderBottomColor: borderColor,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  padding: 0,
  margin: 0,
}
const topBorder = {
  alignSelf: "center",
  width: (WIDTH - 30) / 7,
  height: 40,
  borderBottomWidth: 0.2,
  borderTopWidth: 0.2,
  borderTopColor: borderColor,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  borderBottomColor: borderColor,
  padding: 0,
  margin: 0,
}
const bottomBorder = {
  alignSelf: "center",
  width: (WIDTH - 30) / 7,
  height: 40,
  borderBottomWidth: 0.2,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  borderBottomColor: borderColor,
  padding: 0,
  margin: 0,
}
const leftBorder = {
  alignSelf: "center",
  width: (WIDTH - 30) / 7,
  height: 40,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  padding: 0,
  margin: 0,
}

const noBorder = {
  alignSelf: "center",
  width: (WIDTH - 30) / 7,
  height: 40,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  padding: 0,
  margin: 0,
}
let dayIndex = getDay(day)

const dataset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
return (dataset.map((hour, index) => {
  if (index !== 24) {
    let style
    if (hour == 0) {
      style = bottomBorder 
    }
    else if (hour % 2 == 0 && dayIndex % 2 == 0) {
      style = fullBorder 
    } else if (dayIndex % 2 == 0) {
      style = leftBorder
    } else if (hour % 2 == 0) {
      style = topBorder
    } else {
      style = noBorder
    }
  return (
    <TouchableWithoutFeedback onPress={() => this.props.showNewEvent(day, hour)}>
    
    <View style={style}>
    
    </View>
    </TouchableWithoutFeedback>
  )}
}))
}

  render () {
    const dateNow = new Date()
    const oneDay = {
      flex: 1,
      width: (WIDTH - 30) / 7,

      flexDirection: "column",
    }

    
    const redLine = {
      position: "absolute",
      height: 2,
      backgroundColor: "mintcream",
      top: differenceInMinutes(dateNow, new Date(getYear(dateNow), getMonth(dateNow), getDate(dateNow), 0, 0, 0)) / 1.5,
      width: (WIDTH - 30) / 7 ,
      zIndex: 9999,
    }

    let dataForDay = this.props.data.filter(event => {
      if (this.findEvents(this.props.day, event)) {
        return event
      }})
    
   
   

    return (

      <View onClick={(event) => {this.props.createEvent(event, this.props.day)}} id={this.props.day} style={oneDay}>
      {this.renderDayHours(this.props.day)}
      {this.props.data
      ? this.renderEvents(dataForDay)
      : null
      }
      {isSameDay(this.props.day, new Date())
      ? <View style={redLine} />
      : null
      }
                      

      </View>
    )
  }
}




class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showNewEvent: false,
    }
  }
  showNewEvent = (day, hour) => {
    let dayIndex = getDay(day)
    let eventDay;
    if (dayIndex === 0) {
      eventDay = (6 * ((WIDTH - 30) / 7)) 
    } else {
      eventDay = ((dayIndex - 1 ) * ((WIDTH - 30) / 7)) 
    }
   
    this.setState({ showNewEvent: {left: eventDay, top: hour * 40, day: day, hour: hour } })
  }

  measureElement = (element) => {
    const DOMNode = ReactDOM.findDOMNode(element);
    return {
      width: DOMNode.offsetWidth,
      height: DOMNode.offsetHeight,
    };
  }

  extractPosition = (eventFromClick) => {
    eventFromClick.stopPropagation();

      //Correct view if box is on edge of view
      const xClickPosition = eventFromClick.clientX
      const width = this.measureElement(this).width
      let xPosition = xClickPosition;
      if (xClickPosition + 200 > width ) {

        //Move event box more to the left
        xPosition = -220
      } else {
        xPosition = 120
      }

      let positions = { xPosition: xPosition, yPosition: eventFromClick.pageY - 140}
      return positions
  } 

  renderOneDay = () => {
    return this.props.weekDays.map(day => {
    return <OneDay
      darkTheme={this.props.darkTheme}
      calendars={this.props.calendars}
      day={day} 
      hours={this.props.hours} 
      data={this.props.data.events} 
      selectedDay={this.props.selectedDay}
      showNewEvent={this.showNewEvent}
      createEvent={this.createEvent}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      hideEvent={this.hideEvent}
      showSnack={this.props.showSnack}
      selectEvent={this.props.selectEvent}
      BottomSheet={this.props.BottomSheet}
      selectItem={this.props.selectItem}

      />
  })
}
renderTableHours = (day) => {
  // Render lines for each hour
  const fullBorder = {
    alignSelf: "center",
    width: (WIDTH - 30) / 7,
    height: 40,
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
    width: (WIDTH - 30) / 7,
    height: 40,
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
    width: (WIDTH - 30) / 7,
    height: 40,
    borderRightWidth: 0.2,
    borderRightColor: "gray",
    padding: 0,
    margin: 0,
  }

  const noBorder = {
    alignSelf: "center",
    width: (WIDTH - 30) / 7,
    height: 40,
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
      <TouchableWithoutFeedback>
      
      <View style={style}>
      
      </View>
      </TouchableWithoutFeedback>
    )}
  }))
}
calculateNewEventTime(day, hour) {
  // Get date of new event
  let selectedDate = day
  let newEventDate = new Date(getYear(selectedDate), getMonth(selectedDate), getDate(selectedDate), hour, 0, 0)
  return newEventDate
}
renderHours = () => {
  // Render lines for each hour
  const containerHourStyle = {
    flexDirection: "row",
    flex: 1,
    height: 40,
  }

  const hourColumnStyle = {
    width: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    bottom: 10
  }

  const hourTextStyle = {
    position: "absolute",
    zIndex: 1,
    color: this.props.darkTheme ? "#CEE8EF" : "#485154",
    fontSize: 14,
    fontFamily: 'Poppins-Regular', includeFontPadding: false
  }

  const dataset = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
  return (dataset.map(hour => {
    return (
      <View style={containerHourStyle}>
        <View style={hourColumnStyle}>
        {hour == 0 || hour == 24 ? null : <Text style={hourTextStyle}>{hour}</Text>}
          
        </View>
      </View>
    )
  }))
}



componentDidMount () {
}

render() {

  const decryptedData = this.props.decryptedData;

  //extraData={decryptedData} - for force refresh

  return (
    <View style={{ flex: 1, width: WIDTH }}>
          <View style={{ flex: 1, width: WIDTH, padding: 0, margin: 0, flexDirection: "column", alignItems: 'stretch', }}>
         <View 
         style={{ height: 40, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "column",    elevation: 8,         backgroundColor: this.props.darkTheme ? "#17191d" : "#F7F5F4",
          }}>
<Header 
      darkTheme={this.props.darkTheme}
      daysText={this.props.daysText}
      weekDays={this.props.weekDays}
      hours={this.props.hours}
     
    />
            </View>
            {this.props.data.eventsHeader.length > 0
            
           ? <View 
         style={{ height: 30, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "column", elevation:8,    backgroundColor: this.props.darkTheme ? "#17191d" : "#F7F5F4",
          }}>
            <HeaderEvents 
      darkTheme={this.props.darkTheme}
      daysText={this.props.daysText}
      weekDays={this.props.weekDays}
      hours={this.props.hours}
      data={this.props.data.eventsHeader}
      calendars={this.props.calendars}
      selectEvent={this.props.selectEvent}
      selectItem={this.props.selectItem}
      BottomSheet={this.props.BottomSheet}
    />
            </View>
            :null}

            <View style={{flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    flex: 1,
    alignSelf: 'stretch',
    padding: 0,
    margin: 0,
    marginTop: 5,
    }}>
        
              <ScrollView

                ref="scroll"


                onLayout={(e) => {
                  //Scroll to current hour on layout
                  let y = this.props.positionY
                  this.refs.scroll.scrollTo({x: 0, y: y, Animated: false});

                  //this.refs.this.props.scrollRef.scrollWithoutAnimationTo(y, 10);
                }}
                onScrollEndDrag={(e) => {
                  /*
                  this.props.updateYPosition(e.nativeEvent.contentOffset.y)
                  //this.refs.scroll.scrollWithoutAnimationTo(e.nativeEvent.contentOffset.y, 10);
                  */
                }}
    


                style={{ width: this.props.width, marginBottom: 12}}>
                <View style={{ flex: 1,                      width: WIDTH,

   }}>

                  <View style={{ position: "absolute", paddingLeft: 5, paddingRight: 5 }}>
                    {this.renderHours()}
                  </View>
                  <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    width: WIDTH - 30,
                    flex: 1,
                    left: 30,
                    alignSelf: 'stretch',
                    padding: 0,
                    marginTop: 0,
                    height: 960 
                  }}>

                      
                    {this.renderOneDay()}
                    {this.state.showNewEvent
                    ? <TouchableWithoutFeedback
                    onPress={() => {
                      let eventTime = this.calculateNewEventTime(this.state.showNewEvent.day, this.state.showNewEvent.hour )
                      this.setState({ showNewEvent: false })
                      NavigationService.navigate('NewEvent', { date: eventTime }) }}
                  ><View style={{ flex: 1, position: "absolute", height: 40, top: this.state.showNewEvent.top, width: (WIDTH - 30) /7 , left: this.state.showNewEvent.left, backgroundColor: "seagreen", borderWidth: 1, borderColor: "seagreen", alignItems: "center", borderRadius: 8, zIndex: 9999}}>
                      <Text style={{ color: "white", fontSize: 13,       fontFamily: 'Poppins-Regular', includeFontPadding: false,
 }}>New</Text>
                    </View>
                  </TouchableWithoutFeedback>
                    : null
                    }
                  </View>
                
                </View>

              

              </ScrollView>                      

            </View>
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

    };

  
  }
  //Filter all events before further selection
  filteredEvents = (week) => {
    let events = []
    let eventsHeader = []
    let filteredEvents = this.props.data.map(event => {
      for (let i=0; i<week.length; i++) {
        if (this.findEvents(week[i], event)) {
          if (differenceInCalendarDays(event.dateTill, event.dateFrom) == 0) {
            events.push(event)
          } else if (differenceInCalendarDays(event.dateTill, event.dateFrom) > 0) {
            eventsHeader.push(event)
          }
        }
      }
    })
    let data = {events: events, eventsHeader: eventsHeader}
    return data
  }

  findEvents = (baseDate, eventDate) => {
    
    return areRangesOverlapping(new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 0, 0), new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 23, 30), eventDate.dateFrom, eventDate.dateTill)
  }


  
  chooseWeekdays = (slideIndex, index) => {
    if (slideIndex == index) {
      return this.props.week1
    } else if (slideIndex == 0 && index == 1) {
      return this.props.week0
    } else if (slideIndex == 0 && index == 2) {
      return this.props.week2
    } else if (slideIndex == 1 && index == 0) {
      return this.props.week2
    } else if (slideIndex == 1 && index == 2) {
      return this.props.week0
    } else if (slideIndex == 2 && index == 0) {
      return this.props.week0
    } else if (slideIndex == 2 && index == 1) {
      return this.props.week2
    } 
  }

  componentDidMount () {

  }
  componentWillMount() {
    let y = getHours(this.props.selectedDay) * 40
    this.props.updateYPosition(y)
    //this.scrollView.scrollTo({x: 0, y: 900, animated: true })
  }


  renderDaysText = () => {
    const column = (WIDTH - 30) / 7
      
    const headerStyle = {
      marginTop: 10,
      flexDirection: "column",
      margin: 0,
      marginLeft: 30,
      
    }
    const headerRow = {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    }
    const dayTextColumn = {
      alignSelf: "center",
      width: column,
    }
    const dayText = {
      margin: 0, 
      padding: 1,
      color: this.props.darkTheme ? "#D2E5F4" : "#2F3344",
      fontSize: 16,
      alignSelf: "center",
      textAlign: "center"
    }
  
    dayTextWhite = {
      margin: 0, 
      padding: 1,
      fontSize: 16,
      alignSelf: "center",
      textAlign: "center",
      color: "white"
    }
  
    const daysText = this.props.daysText.map(day => {
      return <View style={dayTextColumn}>
              <Text style={dayText}>{day}</Text>
            </View>
    })
  
  
    return (
      <View style={headerStyle}>
      <View style={headerRow}>
      {daysText}
      </View>
      </View>
    )
  }
  render() {

    const timetableWrapper = {
      flex: 1,

    }

    return (
      <View style={timetableWrapper}>
  <View style={{ width: WIDTH-30, padding: 0, margin: 0, flexDirection: "column"}}>
         <View 
         style={{ height: 40, width: WIDTH, padding: 0, margin: 0, flexDirection: "column", backgroundColor: this.props.darkTheme ? "#17191d" : "#F7F5F4",
        }}>
          {this.renderDaysText()}
          </View>
          </View>
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
              this.refs.ViewPager 
              ? this.props.getDaysInWeekUpdate(this.refs.ViewPager._selected) 
              : null
            }
            }
            scrollEnabled={this.state.scrollEnabled}
            style={{    flex: 1,
              flexDirection: 'column',
              backgroundColor: this.props.darkTheme ? "#202124" : "#F7F5F4"
            }}>
         <View style={styles2.slide1}>
      <Body ref="slide1"
      scrollRef="scroll"
      data={this.filteredEvents(this.props.weeks[0])} 
               darkTheme={this.props.darkTheme}
      hours={this.props.hours}
      weekDays={this.props.weeks[0]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.props.positionY}
              updateYPosition={this.props.updateYPosition}
              selectEvent={this.props.selectEvent}
              BottomSheet={this.props.BottomSheet}
              selectItem={this.props.selectItem}

      />
      </View>
      <View style={styles2.slide2}>
      <Body ref="slide2" 
            scrollRef="scroll2"
      data={this.filteredEvents(this.props.weeks[1])} 
               darkTheme={this.props.darkTheme}
      hours={this.props.hours}
      weekDays={this.props.weeks[1]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.props.positionY}
              updateYPosition={this.props.updateYPosition}
              selectEvent={this.props.selectEvent}
              BottomSheet={this.props.BottomSheet}
              selectItem={this.props.selectItem}

      />
      </View>
      <View style={styles2.slide3}>
      <Body ref="slide3" 
            scrollRef="scroll3"

      data={this.filteredEvents(this.props.weeks[2])} 
               darkTheme={this.props.darkTheme}
      hours={this.props.hours}
      weekDays={this.props.weeks[2]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.props.positionY}
              updateYPosition={this.props.updateYPosition}
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




export default class WeekSwipe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventBoxDisplay: false,
      eventBoxObj: {},
      daysText: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      hours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
      selectedDay: new Date(),
      weekDays: [],
      week0: [],
      week1: [],
      week2: [],
      indexBefore: 1,
      weeks: [],
      weeksData: [],
      selectedEvent: "",
      positionY: "",

    }
  }

  updateYPosition = (newPosition) => {
    this.setState({ positionY: newPosition })

  }
  /*
  componentWillUpdate(prevState) {
    if (prevState.positionY != this.state.positionY) {
      let newPosition = this.state.positionY
      this.refs.FilteredView.refs.slide1.refs.scroll.scrollTo({ x: 0, y: newPosition, animated: false })
      this.refs.FilteredView.refs.slide2.refs.scroll2.scrollTo({ x: 0, y: newPosition, animated: false })
      this.refs.FilteredView.refs.slide3.refs.scroll3.scrollTo({ x: 0, y: newPosition, animated: false })
    } 
  }
  */
  findEvents = (baseDate, eventDate) => {
    
    return areRangesOverlapping(new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 0, 0), new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 23, 30), eventDate.dateFrom, eventDate.dateTill)
  }
  //Filter all events before further selection
  filteredEvents = (week) => {
    let filteredEvents = this.props.allData.filter(event => {
      for (let i=0; i<week.length; i++) {
        if (this.findEvents(week[i], event)) {
          return event
        }
      }
    })
    return filteredEvents
  }

  
  getDaysInWeek = (date) => {
    let week0 = []
    let week1 = []
    let week2 = []
    let weekDays = []
    let dayInWeek = getDay(date)
    let startDate = subDays(date, dayInWeek-1)
    if (dayInWeek === 0 ) {
      for (let i=6; i>0; i--) {
        week1.push(subDays(date, i)) 
      }
      week1.push(date)

    } else {
      week1.push(startDate)
      for (let i=1; i<7; i++) {
        week1.push(addDays(startDate, i))
      }
    }

    for (let i=7; i>0; i--) {
      week0.push(subDays(week1[0], i))
    }
    for (let i=1; i<8; i++) {
      week2.push(addDays(week1[6], i))
    }
    weekDays.push(week0)
    weekDays.push(week1)
    weekDays.push(week2)

    this.setState({ weeks: weekDays })

  }
    
  
  getDaysInWeekUpdate = (currentIndex) => {
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
      this.setState({ weeks: newWeekDays})
    } else if (index == 0) {
      //weekBefore = 2
      //weekAfter = 1
      newWeekDays.push(this.state.weeks[index])
      newWeekDays.push(weekAfter)
      newWeekDays.push(weekBefore)
      this.setState({ weeks: newWeekDays})

    } else if (index == 1) {
      //weekBefore = 0
      //weekAfter = 2
      newWeekDays.push(weekBefore)
      newWeekDays.push(this.state.weeks[index])
      newWeekDays.push(weekAfter)
      this.setState({ weeks: newWeekDays})
    }
    this.props.changeHeaderTitle(firstDayCurrentWeek) //Change month in header
  }
    


  nextWeek = (newIndex) => {
 

    let nextWeek = addDays(this.state.selectedDay, 7)
    this.setState({ selectedDay: nextWeek, indexBefore: newIndex }, this.getDaysInWeekUpdate(newIndex))
  }
  previousWeek = (newIndex) => {
    let previousWeek = subDays(this.state.selectedDay, 7)
    this.setState({ selectedDay: previousWeek, indexBefore: newIndex }, this.getDaysInWeekUpdate(newIndex))
   

  }

  selectEvent = (event) => {
    this.setState({ selectedEvent: event })
  }
  
  componentWillMount () {
    this.getDaysInWeek(new Date())
  }
  render () {
   
    const eventListStyle = {
     
      flex: 1,
      flexDirection: "column",
      backgroundColor: this.props.darkTheme ? "#202124" : "#303F9F"
    }

    return (
      <View style={eventListStyle}>
     
 

        {this.state.weeks && this.props.allData
        ?
         <FilteredView 
         ref="FilteredView"
         darkTheme={this.props.darkTheme}
         hours={this.state.hours}
         data={this.props.allData}
         selectedDay={this.state.selectedDay}
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
         week0={this.state.week0}
         week1={this.state.week1}
         week2={this.state.week2}
         weeks={this.state.weeks}
         weeksData={this.state.weeksData}
         getDaysInWeekUpdate={this.getDaysInWeekUpdate}
         selectEvent={this.selectEvent}
         positionY={this.state.positionY}
          updateYPosition={this.updateYPosition}
          BottomSheet={this.props.BottomSheet}
          selectItem={this.props.selectItem}
         />
        : null
      }
     
     
    

      </View>
    )
  }
}


// Styles

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
    color: "white" ,
    fontSize: 30,
    fontWeight: 'bold',
  }
})

const calendarStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    flex: 1,
    alignSelf: 'stretch',
    padding: 0,
    margin: 0,
    marginTop: 12,
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
    fontSize: 24,
  },
  currentDay: {
    color: "white",
    fontSize: 24,
    alignItems: 'center',
    alignSelf: "center"
  },
  selectedDay: {
    color: "white",
    alignItems: 'center',
    alignSelf: "center",
    fontSize: 24,
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
    width: 40,
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


