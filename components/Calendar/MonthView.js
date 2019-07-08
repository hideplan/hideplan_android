import React from "react";
//import "./Register.css";
import { PanResponder, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, Easing, } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isSameMonth, isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays, startOfISOWeek, addHours, isToday, getDaysInMonth, subMonths, addMonths } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { Swiper, TitleBar, TabBar } from 'react-native-awesome-viewpager';
import { FabIcon } from '../../customComponents.js';
import { Button } from 'native-base';
import { EventDetails } from '../../components/EventDetails/Event';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

/*
 <Swiper 
      style={styles2.wrapper} 
      showsButtons={true}
      index={2}
      onIndexChanged={(index) => {
        let date = this.props.selectedDay
        let daysNext = addDays(date, 7)
        this.props.changeDate(daysNext)
        console.log(daysNext)
        console.log(this.props.selectedDay)
        console.log(this.props.weeksData)
        this.props.setDataToArray(daysNext)
      }}
      >
                {this.renderEvents(this.props.weeksData)}

      
      </Swiper>


}*/

//////////////////////////////úú

class Header extends React.Component {

 

  render () {
    
    const headerStyle = {
      flexDirection: "column",
      justifyContent: "center",
      margin: 0,
      height: 50
    }
    const headerRow = {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",

    }
    const dayColumn = {
      alignSelf: "center",
      width: WIDTH / 7,
      

    }
    const todayDay = {
      alignSelf: "center",
      width: WIDTH / 7,
      borderRadius: 8,
      backgroundColor: "#202124",


    }
    const dayTextColumn = {
      alignSelf: "center",
      width: WIDTH / 7,

    }
    const dayText = {
      margin: 0, 
      padding: 0,
      color: this.props.darkTheme ? "white" : "black",
      fontSize: 18,
      alignSelf: "center",


      textAlign: "center"
    }
    const weekWrapper = {
      flex: 1,
      flexWrap: "wrap",
      flexDirection: "row",

    }

    const eventView = {
      height: 20,
      width: WIDTH / 7,
      padding: 5
    }

    const eventDot = {
      height: 10,
      width: 10,
      borderRadius: 5,
      backgroundColor: "black",
      alignSelf: "center",

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
*/

const style = {
  height: 18, width: this.props.eventWidth, borderWidth: 1, borderColor: this.props.calendarColor, borderRadius: 12, alignSelf: "center", alignItems: "center", zIndex: 2, paddingLeft: 1, paddingRight: 1, justifyContent: "center",
  backgroundColor: /*dragging ? 'blue' : */this.props.calendarColor,
  marginBottom: 1
}

return (
  <View     //Dragging func {...this.panResponder.panHandlers}
      style={ style }>
                  <TouchableNativeFeedback
  onPress={() => { (NavigationService.navigate('EditEvent', { ...this.props.event, ...{type:"events"}}))} }
  >
         <Text numberOfLines={1} style={{ color: "white", fontSize: 13 }}>
         {this.props.event.text} </Text>
         </TouchableNativeFeedback>
         </View>
        
        
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

  let tableWidth = (WIDTH  / 7)  - 6
  let tableHeight = (HEIGHT - 94) / 8 - 14 // height of one day
  let maxEvents = parseInt(tableHeight / 24)  

  let eventsCount = []
  if (dataset) {
    return (dataset.map((event, index) => {
      let width = 1; //Full width
      let offsetLeft = 0
        return this.props.calendars.map(calendar => {
          if (calendar.uuid == event.calendar) {
            if (calendar.isChecked) {
              offsetLeft = 0


              
              let calendarColor
              this.props.calendars.map(item => {
                if (item.uuid == event.calendar) {
                  calendarColor = item.color
                }
               
              })

    
              //event.left
              // BUG/TODO break event if continues next day
              // Current status: events is displayed in wrong place
              eventsCount.push("one")
              if (eventsCount.length <= maxEvents) {
                return (
                  <Event 
                  eventWidth={tableWidth}
                  calendarColor={calendarColor}
                  event={event}
                  editEvent={this.props.editEvent}
                  cryptoPassword={this.props.cryptoPassword}
                  selectEvent={this.props.selectEvent}
                  openSheet={this.props.openSheet}

                  />
                  )
              }
              else if (eventsCount.length -1 > maxEvents && index == dataset.length - 1) {
                return (
                  <View 
      style={ {height: 18, width: tableWidth, borderWidth: 1, borderColor: "gray", borderRadius: 12, alignSelf: "center", alignItems: "center", zIndex: 2, paddingLeft: 1, paddingRight: 1, justifyContent: "center",
      backgroundColor: "gray"} }>
        
         <Text numberOfLines={1} style={{       color: this.props.darkTheme ? "white" : "black", fontSize: 13 }}>
         ( {eventsCount.length - maxEvents} )</Text>
         </View>
        
                )
                
              }
        }
        }}
    )
          }
          ))
       
          }
        }
      

  renderDate = (date) => {
    const dateText = {
      color: this.props.darkTheme ? "white" : "black",
      fontSize: 16,
      alignSelf: "center",
      marginBottom: 4

    }
    const dateTextGray = {
      color: "gray",
      fontSize: 16,
      alignSelf: "center",
      marginBottom: 4
    }

    if (isSameMonth(date, this.props.selectedDay)) {
      return <Text style={dateText}>{getDate(this.props.day)}</Text>
    } else {
      return <Text style={dateTextGray}>{getDate(this.props.day)}</Text>
    }
    

  }


  render () {
    const dateNow = new Date()
    const oneDay = {
      width: WIDTH / 7,
      height: (HEIGHT - 94) / 7,
      border: "solid",
      borderColor: "#535D60",
      borderWidth: 0.4
    }

   

    let dataForDay = this.props.data.filter(event => {
      if (this.findEvents(this.props.day, event)) {
        return event
      }})
    
   
   

    return (
      <TouchableNativeFeedback onPress={() => this.props.switchFromMonth(this.props.day) }>
      <View onClick={(event) => {this.props.createEvent(event, this.props.day)}} id={this.props.day} style={this.props.borderStyle}>
      {this.renderDate(this.props.day)}
      {this.props.data
      ? this.renderEvents(dataForDay)
      : null
      }
      </View>
      </TouchableNativeFeedback>

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
      eventDay = (6 * (WIDTH / 7)) 
    } else {
      eventDay = ((dayIndex - 1 ) * (WIDTH / 7)) 
    }
   
    this.setState({ showNewEvent: {left: eventDay, top: hour * 60, day: day, hour: hour } })
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
      console.log(eventFromClick.pageX)
      const width = this.measureElement(this).width
      let xPosition = xClickPosition;
      if (xClickPosition + 200 > width ) {
        console.log(xClickPosition + 200, width)

        //Move event box more to the left
        xPosition = -220
      } else {
        xPosition = 120
      }

      let positions = { xPosition: xPosition, yPosition: eventFromClick.pageY - 140}
      return positions
  } 

  renderOneDay = () => {
    const borderColor= this.props.darkTheme ? "#677477" : "black"

 const fullBorder = {
  alignSelf: "center",
  width: WIDTH / 7,
  height: (HEIGHT - 94) / 7,
  borderBottomWidth: 0.2,
  borderTopWidth: 0.2,
  borderTopColor: borderColor,
  borderBottomColor: borderColor,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  padding: 0,
  margin: 0,
}
const middleBorder = {
  width: WIDTH / 7,
  height: (HEIGHT - 94) / 7,
  borderBottomWidth: 0.2,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  borderBottomColor: borderColor,
  padding: 0,
  margin: 0,
}
const topBorder = {
  width: WIDTH / 7,
  height: (HEIGHT - 94) / 7,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  borderBottomColor: borderColor,
  borderBottomWidth: 0.2,
  padding: 0,
  margin: 0,
}
const bottomBorder = {
  width: WIDTH / 7,
  height: (HEIGHT - 94) / 7,
  borderRightWidth: 0.2,
  borderRightColor: borderColor,
  padding: 0,
  margin: 0,
}

    return this.props.weekDays.map((day, index) => {

      let borderStyle
        if (index < 7) {
          borderStyle = topBorder 
        }
        else if (index > 35) {
          borderStyle = bottomBorder 
        }  else {
          borderStyle = middleBorder
        }
      


    return <OneDay
      borderStyle={borderStyle}
      calendars={this.props.calendars}
      day={day} 
      hours={this.props.hours} 
      data={this.props.data} 
      selectedDay={this.props.selectedDay}
      showNewEvent={this.showNewEvent}
      createEvent={this.createEvent}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      hideEvent={this.hideEvent}
      showSnack={this.props.showSnack}
      darkTheme={this.props.darkTheme}
      selectEvent={this.props.selectEvent}
      openSheet={this.props.openSheet}
      switchFromMonth={this.props.switchFromMonth}


      />
  })
}

render() {

  const decryptedData = this.props.decryptedData;

  //extraData={decryptedData} - for force refresh

  return (
    <View style={{ flex: 1, width: WIDTH, flexWrap: "wrap"  }}>
      
  

            <View style={calendarStyle.row}>
              {this.renderOneDay()}
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
  //Filter all events before further selection
  filteredEvents = (month) => {
    let filteredEvents = this.props.data.filter(event => {
      for (let i=0; i<month.length; i++) {
        if (this.findEvents(month[i], event)) {
          return event
        }
      }
    })
    return filteredEvents
  }
   

  findEvents = (baseDate, eventDate) => {
    
    return areRangesOverlapping(new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 0, 0), new Date(getYear(baseDate), getMonth(baseDate), getDate(baseDate), 23, 30), eventDate.dateFrom, eventDate.dateTill)
  }


 
  componentDidMount () {
    console.log(this.refs.ViewPager._selected)

  }
  componentWillMount() {
    let y = getHours(this.props.selectedDay) * 60
    this.setState({ positionY: y })
    //this.scrollView.scrollTo({x: 0, y: 900, animated: true })
  }

  updateYPosition = (newPosition) => {
    console.log(this.state.positionY)
    this.setState({ positionY: newPosition })
    console.log(this.refs)
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
              console.log("INDEX: " + index)
            }
             
            }*/
            onPageSelected={(e) => {
              this.refs.ViewPager 
              ? this.props.getDaysInMonthUpdate(this.refs.ViewPager._selected) 
              : null
            }
            }
            scrollEnabled={this.state.scrollEnabled}
            style={{    flex: 1,
              flexDirection: 'column',
              width: this.props.width,  marginTop: 5,
            }}>
         <View style={styles2.slide1}>
      <Body data={this.filteredEvents(this.props.months[0])} hours={this.props.hours}
      weekDays={this.props.months[0]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              darkTheme={this.props.darkTheme}
              selectEvent={this.props.selectEvent}
              openSheet={this.props.openSheet}
              switchFromMonth={this.props.switchFromMonth}

      />
      </View>
      <View style={styles2.slide2}>
      <Body data={this.filteredEvents(this.props.months[1])} hours={this.props.hours}
      weekDays={this.props.months[1]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              darkTheme={this.props.darkTheme}
              selectEvent={this.props.selectEvent}
              openSheet={this.props.openSheet}
              switchFromMonth={this.props.switchFromMonth}

      />
      </View>
      <View style={styles2.slide3}>
      <Body data={this.filteredEvents(this.props.months[2])} hours={this.props.hours}
      weekDays={this.props.months[2]} 
      selectedDay={this.props.selectedDay} showEvent={this.props.showEvent}         calendars={this.props.calendars}
      cryptoPassword={this.props.cryptoPassword}
      eventBoxDisplay={this.props.eventBoxDisplay}
      saveEventAfterPost={this.props.saveEventAfterPost}
      showSnack={this.props.showSnack}
      daysText={this.props.daysText}
      positionY={this.state.positionY}
              updateYPosition={this.updateYPosition}
              darkTheme={this.props.darkTheme}
              selectEvent={this.props.selectEvent}
              openSheet={this.props.openSheet}
              switchFromMonth={this.props.switchFromMonth}

      />
      </View>
         
          </Swiper >
    
      </View>

    )

  }
}




export default class MonthView extends React.Component {
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
      months: [],
      weeksData: [],
      selectedEvent: "",
    }
  }
  
  selectEvent = (event) => {
    this.setState({ selectedEvent: event })
  }
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


  getOneMonth = (date) => {
    let rectCount = 0;
    let dayInWeek = getDay(new Date(getYear(date), getMonth(date), 1))
    let firstDayInMonth = new Date(getYear(date), getMonth(date), 1)
    let monthDays = []
    if (dayInWeek == 0) {
      dayInWeek = 7
    }
    //Find days for first week at the beginning of month
    for (let i=dayInWeek-1; i>=0; i--) {
      monthDays.push(subDays(firstDayInMonth, i)) 
      rectCount++
    }
    for (let i=1; i<8-dayInWeek; i++) {
      monthDays.push(addDays(firstDayInMonth, i)) 
      rectCount++
    }
    //Three weeks in middle 
    for (let i=8-dayInWeek; rectCount<42; i++) {
      monthDays.push(addDays(firstDayInMonth, i))
      rectCount++
    }
    return monthDays
  }
  getDaysInMonth = (date) => {

    let months = []

    let previousMonth = this.getOneMonth(subMonths(date, 1))
    let currentMonth = this.getOneMonth(date)
    let nextMonth = this.getOneMonth(addMonths(date, 1))

    months.push(previousMonth)
    months.push(currentMonth)
    months.push(nextMonth)
    this.setState({ months: months })

  }

  
  
  getDaysInMonthUpdate = (currentIndex) => {
    let index = currentIndex - 1
    let newMonthDay = this.state.months[index][8] //use day to define month, if too low, or too hight, change could stuck 
    let newMonths = []

    let previousMonth = this.getOneMonth(subMonths(newMonthDay, 1))
    let nextMonth = this.getOneMonth(addMonths(newMonthDay, 1))
    let currentMonth = this.getOneMonth(newMonthDay)

    if (index == 2) {
      //weekBefore = 1
      //weekAfter = 0
      newMonths.push(nextMonth)
      newMonths.push(previousMonth)
      newMonths.push(currentMonth)
      this.setState({ months: newMonths})
    } else if (index == 0) {
      //weekBefore = 2
      //weekAfter = 1

      newMonths.push(currentMonth)
      newMonths.push(nextMonth)
      newMonths.push(previousMonth)

      this.setState({ months: newMonths})

    } else if (index == 1) {
      //weekBefore = 0
      //weekAfter = 2
      newMonths.push(previousMonth)
      newMonths.push(currentMonth)
      newMonths.push(nextMonth)
      this.setState({ months: newMonths})
    }
    this.setState({selectedDay: currentMonth[14]})
    this.props.changeHeaderTitle(newMonthDay) //Change month in header
  }
    


  nextWeek = (newIndex) => {
    console.log("STATE")
    console.log(this.state.weeks)
    console.log("STATE")

    let nextWeek = addDays(this.state.selectedDay, 7)
    this.setState({ selectedDay: nextWeek, indexBefore: newIndex }, this.getDaysInMonthUpdate(newIndex))
    console.log(this.state.selectedDay)
  }
  previousWeek = (newIndex) => {
    let previousWeek = subDays(this.state.selectedDay, 7)
    this.setState({ selectedDay: previousWeek, indexBefore: newIndex }, this.getDaysInMonthUpdate(newIndex))
   

  }
  
  componentWillMount () {
    this.getDaysInMonth(new Date())
  }
  render () {
   
    const eventListStyle = {
     
      flex: 1,
      flexDirection: "column",
      backgroundColor: this.props.darkTheme ? "#202124" : "#F7F5F4"
    }

    return (
      <View style={eventListStyle}>
     
     <View style={{ width: WIDTH, padding: 0, margin: 0, flexDirection: "column", backgroundColor: this.props.darkTheme ? "#17191d" : "#F7F5F4", 
          }}>

<Header 
         darkTheme={this.props.darkTheme}
      daysText={this.state.daysText}
      weekDays={this.state.weekDays}
      hours={this.state.hours}
    />
    </View>

        {this.state.months && this.props.allData
        ?
         <FilteredView 
         darkTheme={this.props.darkTheme}
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
          months={this.state.months}
         weeksData={this.state.weeksData}
         getDaysInMonthUpdate={this.getDaysInMonthUpdate}
         switchFromMonth={this.props.switchFromMonth}
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
    color: '#fff',
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


