import React from "react";
//import "./Register.css";
import { PanResponder, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated,   LayoutAnimation,
  Modal,
  UIManager, Easing, } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { format, isFuture, getHours, getDay, getYear, getMonth, getDate, isSameDay, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, differenceInCalendarDays, isToday } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { FabIcon } from '../../customComponents.js';
import { Button, Spinner } from 'native-base';
import Swiper from 'react-native-swiper'
import Carousel from 'react-native-looped-carousel';

const HEIGHT = Dimensions.get('window').height;

const WIDTH = Dimensions.get('window').width;
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

         
  render () {

    const column = (WIDTH - 30) / 7
    
    const headerStyle = {
      flex: 1,
      flexDirection: "column",
      margin: 0,
      justifyContent: "center",
      elevation: 0,
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
      color: this.props.colors.text,
      fontSize: 18,
      alignSelf: "center",
      textAlign: "center",
      fontFamily: 'Poppins-Bold', 
      includeFontPadding: false
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
      backgroundColor: this.props.colors.primary,
      alignItems: "center",
      justifyContent: "center", 
      color: this.props.colors.primaryText,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    dayTextWhite = {
      margin: 0, 
      padding: 1,
      fontSize: 18,
      alignSelf: "center",
      textAlign: "center",
      color: this.props.colors.primaryText,
      fontFamily: 'Poppins-Bold', 
      includeFontPadding: false
    }


    const daysNumbers = this.props.weekDays.map(day => {
      
      if (isToday(parse(day))) {
        return <View style={dataRow}>
        <View style={headerRow}>
        <View style={todayDay}>
                <View style={circleColumnBlack}>
        <Text style={dayTextWhite}>{getDate(parse(day))}</Text>
        </View>
        </View>
        </View>

        
      </View>
      } else {
        return <View style={dataRow}>
        <View style={headerRow}>
        <View style={todayDay}>
        <View style={circleColumn}>
        <Text style={dayText}>{getDate(parse(day))}</Text>
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
    return areIntervalsOverlapping(
      {start: parse(firstDate.dateFrom), end: parse(firstDate.dateTill)}, {start: parse(secondDate.dateFrom), end: parse(secondDate.dateTill)})
  }
  findEvents = (baseDate, eventDate) => {

  return areIntervalsOverlapping({start: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 0, 0)), end: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 23, 30))}, {start: parse(eventDate.dateFrom), end: parse(eventDate.dateTill)})  }

  
  checkOverlappingHeaderEvents = (firstDate, secondDate) => {
    let firstDateStart = parse(new Date(getYear(parse(firstDate.dateFrom)), getMonth(parse(firstDate.dateFrom)), getDate(parse(firstDate.dateFrom)), 0, 0, 0))
    let firstDateEnd = parse(new Date(getYear(parse(firstDate.dateTill)), getMonth(parse(firstDate.dateTill)), getDate(parse(firstDate.dateTill)), 23, 59, 59))
    let secondDateStart = parse(new Date(getYear(parse(secondDate.dateFrom)), getMonth(parse(secondDate.dateFrom)), getDate(parse(secondDate.dateFrom)), 0, 0, 0))
    let secondDateEnd = parse(new Date(getYear(parse(secondDate.dateTill)), getMonth(parse(secondDate.dateTill)), getDate(parse(secondDate.dateTill)), 23, 59, 59))

    return areIntervalsOverlapping(
      {start: firstDateStart, end: firstDateEnd}, {start: secondDateStart,end: secondDateEnd})
  }
  
    renderEvents = (dataset) => {
      let offsetCount = [] //Store every event id of overlapping items
      let offsetCountFinal; //Sort events by id number
      let offsetCountHeader = [] //Store every event id of overlapping items
      let offsetCountFinalHeader; //Sort events by id number
      let tableWidth = (WIDTH - 30) / this.props.daysNum
    
    if (dataset) {
      return (dataset.map(event => {

      let width = 1; //Full width
      let offsetLeft = 0
      return this.props.calendars.map(calendar => {
        if (calendar.uuid == event.calendar) {
          if (calendar.isChecked) {
     

        dataset.map(item2 => {
          if (this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid  && offsetCount.includes(item2.uuid) == false || this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid && offsetCount.includes(item2.uuid) == false && item2.allDay == "true") {
            width = width + 1 //add width for every overlapping item
            offsetCount.push(item2.uuid)
          } else if (this.checkOverlappingEvents(event, item2) && event.uuid == item2.uuid && offsetCount.includes(event.uuid) == false || this.checkOverlappingEvents(event, item2) && event.uuid == item2.uuid && item2.allDay == "true" && offsetCount.includes(event.uuid) == false) {
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
  
              }
            })
      
                  let offsetTop = differenceInMinutes(
                    parse(event.dateFrom), 
                    parse(new Date(getYear(parse(event.dateFrom)),
                    getMonth(parse(event.dateFrom)),
                    getDate(parse(event.dateFrom))), 0, 0, 0)) 
        
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
                    darkTheme={this.props.darkTheme}
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
                    colors={this.props.colors}
                    daysNum={this.props.daysNum}
                    />
                    )
             
            }
            }})})
        )
              }
            }
          
            componentWillMount() {
            }
            

            renderHeaderEvents = () => {
              const column = (WIDTH - 30) / this.props.daysNum

                return this.props.weekDays.map((day, index) => {
            
                  let dataForDay = this.props.data[index]
                      return (
               <View style={{
                        width: column,
                      height: 30,
                      alignItems: "center",
                      alignSelf: "center",
                      justifyContent: "center",
                      flexDirection: "row",
                      }}>{this.renderEvents(dataForDay)}</View>

  
                        )
              
                   
                })
              
            }
    render () {
      const column = (WIDTH - 30) / this.props.daysNum
      
      const headerStyle = {
        flex: 1,
        flexDirection: "column",
        margin: 0,
        justifyContent: "center",
        elevation: this.props.eventElevation,
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
          flexDirection: "row"
    
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
          color: this.props.colors.text,
          fontSize: 16,
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
          backgroundColor: this.props.colors.primary,
          alignItems: "center",
          justifyContent: "center", 
          color: this.props.colors.primaryText,
        }
        dayTextWhite = {
          margin: 0, 
          padding: 1,
          fontSize: 16,
          alignSelf: "center",
          textAlign: "center",
          color: this.props.colors.darkText,
          fontFamily: 'Poppins-Regular', includeFontPadding: false
        }
    

  
     
      return (
        <View 
                        style={{ height: 30, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "row", elevation:8,    backgroundColor: this.props.colors.header, 
                         }}>
                        
                        <View style={headerRow}>
                        <View style={todayDay}>
        {this.renderHeaderEvents()}
        </View>
        </View>
                    
                        </View>

      )
    }
  }
  
class EventHeader extends React.PureComponent {
  

render () {

const style = {
  position: "absolute", height: this.props.eventHeight, width: this.props.eventWidth, borderWidth: 1, borderColor: "transparent", borderRadius: 4, alignItems: "flex-start", zIndex: 9999999999999, elevation: this.props.eventElevation,
  backgroundColor: /*dragging ? 'blue' : */this.props.calendarColor,
  left: this.props.offsetLeft, opacity: isFuture(parse(this.props.event.dateTill)) || item.allDay ? 1 : 0.6,
}

return (
  <View     //Dragging func {...this.panResponder.panHandlers}
      style={ style }>
                  <TouchableNativeFeedback
  onPress={() => { this.props.selectItem(this.props.event) } }
  background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
    this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
>
<Text numberOfLines={1} style={{ padding: 4, color: this.props.colors.primaryText, fontSize: 12, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false, opacity: 1}}>
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


componentWillMount () {
}

render () {
    /*
Dragging func
const {dragging, initialTop, initialLeft, offsetTop, offsetLeft} = this.state


(NavigationService.navigate('EditEvent', { ...this.props.event, ...{type:"events"}}))
*/

const style = {
  position: "absolute", height: this.props.eventHeight, width: this.props.eventWidth, borderWidth: 1, borderColor: "transparent", borderRadius: 4, opacity: isFuture(parse(this.props.event.dateTill)) ? 1 : 0.6, alignItems: "flex-start", zIndex: 2, elevation: this.props.eventElevation,
  backgroundColor: /*dragging ? 'blue' : */this.props.calendarColor,
  top: this.props.offsetTop,
  left: this.props.offsetLeft,
}

return (
  <TouchableNativeFeedback
  onPress={() => {this.props.selectItem(this.props.event) } }
  background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
    this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
>
  <Animated.View     //Dragging func {...this.panResponder.panHandlers}
      style={ style }>
         <Animated.Text numberOfLines={1} style={{ padding: 4, color: this.props.colors.primaryText, fontSize: 12, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false, opacity: 1}}>
         {this.props.event.text} </Animated.Text>
         </Animated.View>
         </TouchableNativeFeedback>
)
}
}

class OneDay extends React.Component {

  renderDayHours = (day) => {
    // Render lines for each hour
   
    const borderColor = this.props.colors.border
   
    const fullBorder = {
     alignSelf: "center",
     width: (WIDTH - 30) / this.props.daysNum,
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
     width: (WIDTH - 30) / this.props.daysNum,
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
     width: (WIDTH - 30) / this.props.daysNum,
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
     width: (WIDTH - 30) / this.props.daysNum,
     height: 40,
     borderRightWidth: 0.2,
     borderRightColor: borderColor,
     padding: 0,
     margin: 0,
   }
   
   const noBorder = {
     alignSelf: "center",
     width: (WIDTH - 30) / this.props.daysNum,
     height: 40,
     borderRightWidth: 0.2,
     borderRightColor: borderColor,
     padding: 0,
     margin: 0,
   }
   let dayIndex = getDay(parse(day))
   
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

  findEvents = (baseDate, eventDate) => {

  return areIntervalsOverlapping({start: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 0, 0)), end: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 23, 30))}, {start: parse(eventDate.dateFrom), end: parse(eventDate.dateTill)})  }





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
  return areIntervalsOverlapping(
    {start: parse(firstDate.dateFrom), end: parse(firstDate.dateTill)}, {start: parse(secondDate.dateFrom), end: parse(secondDate.dateTill)})
}
renderEvents = (dataset) => {
  let offsetCount = [] //Store every event id of overlapping items
  let offsetCountFinal; //Sort events by id number
  let offsetCountHeader = [] //Store every event id of overlapping items
  let offsetCountFinalHeader; //Sort events by id number
  let tableWidth = (WIDTH - 30) / this.props.daysNum

  if (dataset) {
    return (dataset.map((event) => {
      let width = 1; //Full width
      let offsetLeft = 0
      return this.props.calendars.map(calendar => {
        if (calendar.uuid == event.calendar) {
          if (calendar.isChecked) {
      if (differenceInCalendarDays(parse(event.dateTill), parse(event.dateFrom)) < 1 && event.allDay == "false") {

        dataset.map(item2 => {
          if (this.checkOverlappingEvents(event, item2) && event.uuid !== item2.uuid && differenceInCalendarDays(parse(item2.dateTill), parse(item2.dateFrom)) === 0 && event.allDay == "false") {
            width = width + 1 //add width for every overlapping item
            offsetCount.push(item2.uuid)
          } else if (this.checkOverlappingEvents(event, item2) && event.uuid == item2.uuid && differenceInCalendarDays(parse(item2.dateTill), parse(item2.dateFrom)) === 0 && event.allDay == "false") {
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

              let offsetTop = differenceInMinutes(parse(event.dateFrom), parse(new Date(getYear(parse(event.dateFrom)), getMonth(parse(event.dateFrom)), getDate(parse(event.dateFrom)), 0, 0, 0))) / 1.5    
              let eventHeight = differenceInMinutes(parse(event.dateTill), parse(event.dateFrom))  / 1.5  
              let eventWidth = (tableWidth / width) ///event.width.toString() + "%"
              //event.left
              // BUG/TODO break event if continues next day
              // Current status: events is displayed in wrong place
              offsetCount = []
              offsetCountFinal = ""
              let eventElevation = 0
              return (
    
                <Event 
                darkTheme={this.props.darkTheme}
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
                colors={this.props.colors}

    
                />
                )
                
              }
        }
        }})})
    )
          }
        }
      


  render () {
    const dateNow = new Date()
    const oneDay = {
      flex: 1,
      width: (WIDTH - 30) / this.props.daysNum,

      flexDirection: "column",
    }

    
    const timeNowLine = {
      position: "absolute",
      height: 2,
      backgroundColor: this.props.colors.text,
      top: differenceInMinutes(parse(dateNow), parse(new Date(getYear(parse(dateNow)), getMonth(parse(dateNow)), getDate(parse(dateNow)), 0, 0, 0))) / 1.5,
      width: (WIDTH - 30) / this.props.daysNum ,
      zIndex: 9999,
    }

    let dataForDay = this.props.data //Already  filtered for day
    
   
   

    return (

      <View onClick={(event) => {this.props.createEvent(event, this.props.day)}} id={this.props.day} style={oneDay}>
      {this.renderDayHours(this.props.day)}
      {this.props.data
      ? this.renderEvents(dataForDay)
      : null
      }
      {isSameDay(parse(this.props.day), parse(new Date()))
      ? <View style={timeNowLine} />
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
      animatedLayout: false,
    }
  }
  showNewEvent = (day, hour) => {
    let dayIndex = this.props.weekDays.indexOf(day)
    let eventDay;

      eventDay = ((dayIndex ) * ((WIDTH - 30) / this.props.daysNum)) 
  
   
    this.setState({ showNewEvent: {left: eventDay, top: hour * 40, day: day, hour: hour } })
  }

  
  renderOneDay = () => {
    return this.props.weekDays.map((day, index) => {
    return <OneDay
      darkTheme={this.props.darkTheme}
      calendars={this.props.calendars}
      day={day} 
      hours={this.props.hours} 
      data={this.props.data.events[index]} 
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
      colors={this.props.colors}
      daysNum={this.props.daysNum}
      />
  })
}
renderTableHours = (day) => {
  // Render lines for each hour
  const fullBorder = {
    alignSelf: "center",
    width: (WIDTH - 30) / this.props.daysNum,
    height: 40,
    borderBottomWidth: 0.2,
    borderTopWidth: 0.2,
    borderTopColor: this.props.colors.border,
    borderBottomColor: this.props.colors.border,
    borderRightWidth: 0.2,
    borderRightColor: this.props.colors.border,
    padding: 0,
    margin: 0,
  }
  const topBorder = {
    alignSelf: "center",
    width: (WIDTH - 30) / this.props.daysNum,
    height: 40,
    borderBottomWidth: 0.2,
    borderTopWidth: 0.2,
    borderTopColor: this.props.colors.border,
    borderRightWidth: 0.2,
    borderRightColor: this.props.colors.border,
    borderBottomColor: this.props.colors.border,
    padding: 0,
    margin: 0,
  }

  const leftBorder = {
    alignSelf: "center",
    width: (WIDTH - 30) / this.props.daysNum,
    height: 40,
    borderRightWidth: 0.2,
    borderRightColor: this.props.colors.border,
    padding: 0,
    margin: 0,
  }

  const noBorder = {
    alignSelf: "center",
    width: (WIDTH - 30) / this.props.daysNum,
    height: 40,
    borderRightWidth: 0.2,
    borderRightColor: this.props.colors.border,
    
    padding: 0,
    margin: 0,
  }
  let dayIndex = getDay(parse(day.day))

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
  let newEventDate = parse(new Date(getYear(parse(selectedDate)), getMonth(parse(selectedDate)), getDate(parse(selectedDate)), hour, 0, 0))
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
    color: this.props.colors.gray
,
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


renderDaysText = () => {
  const column = (WIDTH - 30) / this.props.daysNum
    
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
    color: this.props.colors.gray,
    fontSize: 14,
    alignSelf: "center",
    textAlign: "center"
  }

  dayTextWhite = {
    margin: 0, 
    padding: 1,
    fontSize: 14,
    alignSelf: "center",
    textAlign: "center",
    color: this.props.colors.text,
  }

  const daysText = this.props.weekDays.map(day => {
    return <View style={dayTextColumn}>
            <Text style={dayText}>{format(parse(day), "E")}</Text>
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
componentDidUpdate (prevProps) {
  if (prevProps.swipeIndex != this.props.swipeIndex) {
    if (this.state.animatedLayout) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
    }
  }
}
componentDidMount () {
}

render() {

  const decryptedData = this.props.decryptedData;

  //extraData={decryptedData} - for force refresh

  return (
    <View style={{ flex: 1, width: WIDTH }}>
          <View style={{ flex: 1, width: WIDTH, padding: 0, margin: 0, flexDirection: "column", alignItems: 'stretch', }} onLayout={() => {this.setState({ animatedLayout: true })}}>
          <View style={{ width: WIDTH-30, padding: 0, margin: 0, flexDirection: "column"}}>
         <View 
         style={{ height: 40, width: WIDTH, padding: 0, margin: 0, flexDirection: "column",    elevation: 8, backgroundColor: this.props.colors.header,
        }}>
          {this.renderDaysText()}
          </View>
          </View>
         <View 
         style={{ height: 40, width: WIDTH, padding: 0, paddingLeft: 30, margin: 0, flexDirection: "column",    elevation: 8,         backgroundColor: this.props.colors.header,
          }}>
<Header 
      darkTheme={this.props.darkTheme}
      daysText={this.props.daysText}
      weekDays={this.props.weekDays}
      hours={this.props.hours}
      primaryColor={this.props.primaryColor}
      colors={this.props.colors}
      daysNum={this.props.daysNum}

    />
            </View>
           
      {this.props.data.hasHeaderEvents
      ?      <HeaderEvents 
      darkTheme={this.props.darkTheme}
      daysText={this.props.daysText}
      weekDays={this.props.weekDays}
      hours={this.props.hours}
      data={this.props.data.eventsHeader}
      hasHeaderEvents={this.props.data.hasHeaderEvents}
      calendars={this.props.calendars}
      selectEvent={this.props.selectEvent}
      selectItem={this.props.selectItem}
      BottomSheet={this.props.BottomSheet}
      primaryColor={this.props.primaryColor}
      colors={this.props.colors}
      daysNum={this.props.daysNum}
    />
      : null
      }
       

              <ScrollView

                ref="scroll"


                onLayout={(e) => {
                  //Scroll to current hour on layout
                  let y = this.props.positionY
                  this.refs.scroll.scrollTo({x: 0, y: y, Animated: false});

                  //this.refs.this.props.scrollRef.scrollWithoutAnimationTo(y, 10);
                }}
                onScrollEndDrag={(e) => {
                  this.props.updateYPosition(e.nativeEvent.contentOffset.y, this.props.ref)
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
                  ><View style={{ flex: 1, position: "absolute", height: 40, top: this.state.showNewEvent.top, width: (WIDTH - 30) / this.props.daysNum , left: this.state.showNewEvent.left, backgroundColor:       this.props.colors.primary,  borderWidth: 1, borderColor: this.props.colors.primary,  alignItems: "center", borderRadius: 4, zIndex: 9999}}>
                      <Text style={{padding: 4, color: this.props.colors.primaryText, fontSize: 12, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false, opacity: 1
 }}>New event</Text>
                    </View>
                  </TouchableWithoutFeedback>
                    : null
                    }
                  </View>
                
                </View>

              

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
      swipeIndex: 1,
      positionY: ""

    };

  
  }

  
  //Filter all events before further selection
  filteredEvents = (week) => {
    let weekEvents = [] //Array of events for each day
    let weekEventsHeader = [] //Array of events for each day
    let hasHeaderEvents = []
    for (let i=0; i<this.props.daysNum; i++) {
      weekEvents.push([])
      weekEventsHeader.push([])
    }
    let eventsHeader = []
    let filteredEvents = this.props.data.map(event => {
      //Loop over all events
      for (let i=0; i<week.length; i++) {
        //Loop over all days in week to filter only relevant events for that week
        if (this.findEvents(week[i], event)) {

          //Here we find event for each day. So it is better for performance to prepare theme for further rendering here
          if (differenceInCalendarDays(parse(event.dateTill), parse(event.dateFrom)) == 0 && event.allDay == "false") {
            weekEvents[i].push(event)
          } else if (differenceInCalendarDays(parse(event.dateTill), parse(event.dateFrom)) > 0 || event.allDay == "true") {
            weekEventsHeader[i].push(event)
            if ( hasHeaderEvents.length == 0 ) {
              hasHeaderEvents.push("hasEvent")
            }
          }
        }
      }
    })

    let data = {events: weekEvents, eventsHeader: weekEventsHeader, hasHeaderEvents: hasHeaderEvents.length > 0 ? true : false }
    return data
  }

  findEvents = (baseDate, eventDate) => {

  return areIntervalsOverlapping({start: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 0, 0)), end: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 23, 59))}, {start: parse(eventDate.dateFrom), end: parse(eventDate.dateTill)})  }


  

  componentDidMount () {

  }
  componentWillMount() {
    let y = getHours(parse(this.props.selectedDay)) * 40
    this.setState({ positionY: y })
    //this.scrollView.scrollTo({x: 0, y: 900, animated: true })
  }


  updateYPosition = (newPosition, prevRef) => {
    this.setState({ positionY: newPosition })
    /*if (prevRef == "slide1") {
      this.refs.slide2.refs.scroll.scrollTo({x: 0, y: newPosition, Animated: true})
      this.refs.slide3.refs.scroll.scrollTo({x: 0, y: newPosition, Animated: false})
    } else if (prevRef == "slide2") {
      this.refs.slide1.refs.scroll.scrollTo({x: 0, y: newPosition, Animated: false})
      this.refs.slide3.refs.scroll.scrollTo({x: 0, y: newPosition, Animated: false})
    } else if (prevRef == "slide3") {
      this.refs.slide1.refs.scroll.scrollTo({x: 0, y: newPosition, Animated: false})
      this.refs.slide2.refs.scroll.scrollTo({x: 0, y: newPosition, Animated: false})
    }*/

  }
  
  
  changeSwipeIndex = (index) => {
    this.setState({ swipeIndex: index })
  }
  getEmptyArray = () => {
    let emptyArray = []
    for (let i=0; i<this.props.daysNum; i++) {
      emptyArray.push([])
    }
    return {events: emptyArray, eventsHeader: emptyArray}
  }
  render() {
    let emptyArray = this.getEmptyArray()
    const timetableWrapper = {
      flex: 1,
      backgroundColor: this.props.backgroundCalendarMain
    }
    const bodyStyle = {
      flex: 1,
      backgroundColor: this.props.backgroundCalendarMain

    }

    return (
      <View style={timetableWrapper}>

  <Carousel ref='ViewPager'
            isLooped={true}        
            autoplay={false}
            currentPage={1}
            indicator={false}
            horizontal={true}
            pagingEnabled={true}
            showsPagination={false}
            showsHorizontalScrollIndicator={false}
            showsButtons={true}
            scrollEnabled={true}
            automaticallyAdjustContentInsets={true}
            onAnimateNextPage={(index) => {
              this.props.getDaysInWeekUpdate(index)
              this.changeSwipeIndex(index)
            }}
            style={{    flex: 1,
            }}>
  <View style={bodyStyle}>
    <Body ref="slide1" 
            scrollRef="scroll1"
            data={this.state.swipeIndex == "0" ? this.filteredEvents(this.props.weeks[0]) : emptyArray} 
            darkTheme={this.props.darkTheme}
      hours={this.props.hours}
      weekDays={this.props.weeks[0]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              selectEvent={this.props.selectEvent}
              BottomSheet={this.props.BottomSheet}
              selectItem={this.props.selectItem}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              backgroundCalendarHeader={this.props.backgroundCalendarHeader}
              backgroundCalendarMain={this.props.backgroundCalendarMain}
              swipeIndex={this.state.swipeIndex}
              daysNum={this.props.daysNum}

      /> 
    
      </View>
        <View style={bodyStyle}>

     <Body ref="slide2" 
            scrollRef="scroll2"
            data={this.state.swipeIndex == "1" ? this.filteredEvents(this.props.weeks[1]) : emptyArray} 
            darkTheme={this.props.darkTheme}
      hours={this.props.hours}
      weekDays={this.props.weeks[1]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              selectEvent={this.props.selectEvent}
              BottomSheet={this.props.BottomSheet}
              selectItem={this.props.selectItem}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              backgroundCalendarHeader={this.props.backgroundCalendarHeader}
              backgroundCalendarMain={this.props.backgroundCalendarMain}
              swipeIndex={this.state.swipeIndex}
              daysNum={this.props.daysNum}

      />
 
      </View>
      <View style={bodyStyle}>
     <Body ref="slide3" 
            scrollRef="scroll3"
            data={this.state.swipeIndex == "2" ? this.filteredEvents(this.props.weeks[2]) : emptyArray} 
            darkTheme={this.props.darkTheme}
      hours={this.props.hours}
      weekDays={this.props.weeks[2]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              selectEvent={this.props.selectEvent}
              BottomSheet={this.props.BottomSheet}
              selectItem={this.props.selectItem}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              backgroundCalendarHeader={this.props.backgroundCalendarHeader}
              backgroundCalendarMain={this.props.backgroundCalendarMain}
              swipeIndex={this.state.swipeIndex}
              daysNum={this.props.daysNum}

      />

      </View>
         
          </Carousel >
      </View>

    )

  }
}




export default class WeekView extends React.Component {
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
      weeks: [[], [], []],
      weeksData: [],
      selectedEvent: "",
      isLoadingCalendar: true, 

    }
  }


  
 

  
  getDaysInWeek = (date) => {
    let week0 = []
    let week1 = []
    let week2 = []
    let weekDays = []
    let daysNum = 7
    let dayInWeek = getDay(parse(date))
    let startDate = subDays(parse(date), dayInWeek-1)
     
      if (dayInWeek === 0 ) {
        for (let i=6; i>0; i--) {
          week1.push(subDays(parse(date), i)) 
        }
        week1.push(date)
  
      } else {
        week1.push(startDate)
        for (let i=1; i<7; i++) {
          week1.push(addDays(parse(startDate), i))
        }
      }

    for (let i=daysNum; i>0; i--) {
      week0.push(subDays(parse(week1[0]), i))
    }
    for (let i=daysNum; i<daysNum * 2; i++) {
      week2.push(addDays(parse(date), i)) 
    }
    weekDays.push(week0)
    weekDays.push(week1)
    weekDays.push(week2)
    
    this.setState({ weeks: weekDays, isLoadingCalendar: false })

  }
    
  
  getDaysInWeekUpdate = (currentIndex) => {
    let index = currentIndex 
    let daysNum = 7
    let firstDayCurrentWeek = this.state.weeks[index][0]
    let lastDayCurrentWeek = this.state.weeks[index][daysNum-1]


    let weekBefore = []
    let weekAfter = []
    let newWeekDays = []

    for (let i=daysNum; i>0; i--) {
      weekBefore.push(subDays(parse(firstDayCurrentWeek), i))
    }

    for (let i=1; i<daysNum+1; i++) {
      weekAfter.push(addDays(parse(lastDayCurrentWeek), i))
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
 

    let nextWeek = addDays(parse(this.state.selectedDay), 7)
    this.setState({ selectedDay: nextWeek, indexBefore: newIndex }, this.getDaysInWeekUpdate(newIndex))
  }
  previousWeek = (newIndex) => {
    let previousWeek = subDays(parse(this.state.selectedDay), 7)
    this.setState({ selectedDay: previousWeek, indexBefore: newIndex }, this.getDaysInWeekUpdate(newIndex))
   

  }

  selectEvent = (event) => {
    this.setState({ selectedEvent: event })
  }
  
  componentDidMount () {
    setTimeout(() => this.getDaysInWeek(new Date()), 4) //Need to setTimeout to prevent UI freeze when navigating to calendar
  }
  render () {
   
    const eventListStyle = {
     
      flex: 1,
      flexDirection: "column",
    }

    return (
      <View style={eventListStyle}>
     
 

        {this.state.weeks[1].length > 0 && this.props.allData && !this.state.isLoadingCalendar
        ?
         <FilteredView 
         ref="FilteredView"
         darkTheme={this.props.darkTheme}
         primaryColor={this.props.primaryColor}
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
          updateYPosition={this.updateYPosition}
          BottomSheet={this.props.BottomSheet}
          selectItem={this.props.selectItem}
          colors={this.props.colors}
          daysNum={7}
         />
        : <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <Spinner color={this.props.colors.primary} />
        <Text style={{color: this.props.colors.gray, fontSize: 18, fontFamily: "OpenSans"}}>Loading calendar</Text>
        </View>
      }
     
     
    

      </View>
    )
  }
}


