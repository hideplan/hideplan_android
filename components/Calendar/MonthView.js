import React from "react";
//import "./Register.css";
import { PanResponder, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, LayoutAnimation, UIManager, Easing, } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isSameMonth, isFuture, getHours, getDay, getYear, getMonth, getDate, areIntervalsOverlapping, addDays, subDays, getDaysInMonth, subMonths, addMonths, isToday } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { FabIcon } from '../../customComponents.js';
import { Button, Spinner } from 'native-base';
import Swiper from 'react-native-swiper'
import Carousel from 'react-native-looped-carousel';

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

 

  render () {
    
    const headerStyle = {
      flexDirection: "column",
      justifyContent: "center",
      margin: 0,
      height: 50,
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
      color: this.props.colors.gray,
      fontSize: 16,
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
  height: 16, width: this.props.eventWidth, borderWidth: 1, borderColor: "transparent", borderRadius: 4, alignSelf: "center", alignItems: "center", zIndex: 2, paddingLeft: 1, paddingRight: 1, justifyContent: "center", opacity: isFuture(parse(this.props.event.dateTill)) ? 1 : 0.6, alignItems: "flex-start", zIndex: 2, elevation: this.props.eventElevation,
  backgroundColor: /*dragging ? 'blue' : */this.props.calendarColor,
  marginBottom: 1
}

return (
  <View     //Dragging func {...this.panResponder.panHandlers}
      style={ style }>
                  <TouchableNativeFeedback
  onPress={() => { this.props.selectItem(this.props.event)} }
  >
         <Text numberOfLines={1} style={{ padding: 4, color: this.props.colors.primaryText, fontSize: 12, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false, opacity: 1,       fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,}}>
         {this.props.event.text} </Text>
         </TouchableNativeFeedback>
         </View>
        
        
)
}
}

class OneDay extends React.Component {


  findEvents = (baseDate, eventDate) => {

  return areIntervalsOverlapping({start: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 0, 0)), end: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 23, 30))}, {start: parse(eventDate.dateFrom), end: parse(eventDate.dateTill)})  }

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
  return areIntervalsOverlapping(
    {start: parse(firstDate.dateFrom), end: parse(firstDate.dateTill)}, {start: parse(secondDate.dateFrom), end: parse(secondDate.dateTill)})
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

    
              //event.left
              // BUG/TODO break event if continues next day
              // Current status: events is displayed in wrong place
              eventsCount.push("one")
              if (eventsCount.length < maxEvents + 1) {
                return (
                  <Event 
                  eventWidth={tableWidth}
                  calendarColor={calendarColor}
                  event={event}
                  editEvent={this.props.editEvent}
                  cryptoPassword={this.props.cryptoPassword}
                  selectEvent={this.props.selectEvent}
                  openSheet={this.props.openSheet}
                  colors={this.props.colors}
                  selectItem={this.props.selectItem}
                  />
                  )
              }
              else if (eventsCount.length -1 > maxEvents && index == dataset.length - 1) {
                return (
                  <View 
      style={ {height: 16,  width: tableWidth, borderWidth: 1, borderColor: "transparent", borderRadius: 4, alignSelf: "center", alignItems: "flex-start", zIndex: 2, paddingLeft: 1, paddingRight: 1, justifyContent: "center", 
      backgroundColor: this.props.colors.header} }>
        
         <Text numberOfLines={1} style={{ padding: 4, color: this.props.colors.primaryText, fontSize: 12, fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false, opacity: 1,       fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,}}>
         {eventsCount.length - maxEvents} more</Text>
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
      color: this.props.colors.text,
      fontSize: 14,
      alignSelf: "center",
     
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const dateTextGray = {
      color: this.props.colors.gray,
      fontSize: 14,
      alignSelf: "center",

      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const dateTextCircle = {
      color: this.props.colors.primaryText,
      fontSize: 14,
      alignSelf: "center",

      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const dayStyle = {
      width: WIDTH / 7,
      
    }
    const circleDay = {
      width: 24,
      height: 24,
      backgroundColor: this.props.colors.primary,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 2,
      marginTop: 2,

    }
    const emptyDay = {
      width: 24,
      height: 24,
      backgroundColor: "transparent",
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 2,
      marginTop: 2,
  
    }
    if (isSameMonth(parse(date), parse(this.props.selectedDay))) {
      if (isToday(parse(date))) {
        return <View style={circleDay}><Text style={dateTextCircle}>{getDate(parse(this.props.day))}</Text>
        </View>

      } else {
        return <View style={emptyDay}><Text style={dateText}>{getDate(parse(this.props.day))}</Text>
        </View>

      }
      
    } else {
      return <View style={emptyDay}><Text style={dateTextGray}>{getDate(parse(this.props.day))}</Text></View>

    }
    

  }


  render () {
    const dateNow = new Date()
    const oneDay = {
      width: WIDTH / 7,
      height: (HEIGHT - 94) / 7,
      border: "solid",
      borderColor: this.props.colors.border,
      borderWidth: 0.4
    }

   

    let dataForDay = this.props.data
    


    return (
      <TouchableNativeFeedback onPress={() => this.props.switchFromMonth(this.props.day) }
      background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
        this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
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
    const borderColor= this.props.colors.border

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
        else if (index > 34) {
          borderStyle = bottomBorder 
        }  else {
          borderStyle = middleBorder
        }
      


    return <OneDay
      borderStyle={borderStyle}
      calendars={this.props.calendars}
      day={day} 
      hours={this.props.hours} 
      data={this.props.data[index]} 
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
      colors={this.props.colors}
      selectItem={this.props.selectItem}


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
      positionY: "",
      swipeIndex: 1,
      animatedLayout: false,

    };

  
  }
  //Filter all events before further selection
  filteredEvents = (month) => {
    let data = []
    this.props.data.map((event, index) => {
      for (let i=0; i<month.length; i++) {
        if (index == 0) {
          data.push([])
        }
        if (this.findEvents(month[i], event)) {
          data[i].push(event)
        }
      }
    })
    if (this.state.animatedLayout) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
    }
    return data
  }
   

  findEvents = (baseDate, eventDate) => {

  return areIntervalsOverlapping({start: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 0, 0)), end: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 23, 30))}, {start: parse(eventDate.dateFrom), end: parse(eventDate.dateTill)})  }


 
  componentDidMount () {

  }
  componentWillMount() {
    let y = getHours(parse(this.props.selectedDay)) * 60
    this.setState({ positionY: y })
    //this.scrollView.scrollTo({x: 0, y: 900, animated: true })
  }

  updateYPosition = (newPosition) => {
    this.setState({ positionY: newPosition })
  }
  changeSwipeIndex = (index) => {
    this.setState({ swipeIndex: index })
  }
  render() {

    const timetableWrapper = {
      flex: 1,
      
    }

    let emptyArray = [[], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], [], []]
    return (
      <View style={timetableWrapper} onLayout={() => {this.setState({ animatedLayout: true })}}>
  
  <Carousel
            ref='ViewPager'
            isLooped={true}        
            autoplay={false}
            interval={2000}
            currentPage={1}
            indicator={false}
            horizontal={true}
            pagingEnabled={true}
            showsPagination={false}
            showsHorizontalScrollIndicator={false}
            showsButtons={false}
            scrollEnabled={true}
            onAnimateNextPage={(index) => {
              this.props.getDaysInMonthUpdate(index)
              this.changeSwipeIndex(index)
            }}
            style={{    flex: 1,
              flexDirection: 'column',
            }}>
         <View style={styles2.slide1}>
      <Body 
            data={this.state.swipeIndex == "0" ? this.filteredEvents(this.props.months[0]) : emptyArray} 
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
              colors={this.props.colors}
              selectItem={this.props.selectItem}

      />
      </View>
      <View style={styles2.slide2}>
      <Body 
            data={this.state.swipeIndex == "1" ? this.filteredEvents(this.props.months[1]) : emptyArray} 
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
              colors={this.props.colors}
              selectItem={this.props.selectItem}

      />
      </View>
      <View style={styles2.slide3}>
      <Body 
            data={this.state.swipeIndex == "2" ? this.filteredEvents(this.props.months[2]) : emptyArray} 
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
      colors={this.props.colors}
      selectItem={this.props.selectItem}

      />
      </View>
         
          </Carousel >
    
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
      isLoadingCalendar: true, 

    }
  }
  
  selectEvent = (event) => {
    this.setState({ selectedEvent: event })
  }
  findEvents = (baseDate, eventDate) => {

  return areIntervalsOverlapping({start: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 0, 0)), end: parse(new Date(getYear(parse(baseDate)), getMonth(parse(baseDate)), getDate(parse(baseDate)), 23, 30))}, {start: parse(eventDate.dateFrom), end: parse(eventDate.dateTill)})  }
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
    let dayInWeek = getDay(new Date(getYear(parse(date)), getMonth(parse(date)), 1))
    let firstDayInMonth = new Date(getYear(parse(date)), getMonth(parse(date)), 1)
    let monthDays = []
    if (dayInWeek == 0) {
      dayInWeek = 7
    }
    //Find days for first week at the beginning of month
    for (let i=dayInWeek-1; i>=0; i--) {
      monthDays.push(subDays(parse(firstDayInMonth), i)) 
      rectCount++
    }
    for (let i=1; i<8-dayInWeek; i++) {
      monthDays.push(addDays(parse(firstDayInMonth), i)) 
      rectCount++
    }
    //Three weeks in middle 
    for (let i=8-dayInWeek; rectCount<42; i++) {
      monthDays.push(addDays(parse(firstDayInMonth), i))
      rectCount++
    }
    return monthDays
  }
  getDaysInMonth = (date) => {

    let months = []

    let previousMonth = this.getOneMonth(subMonths(parse(date), 1))
    let currentMonth = this.getOneMonth(date)
    let nextMonth = this.getOneMonth(addMonths(parse(date), 1))

    months.push(previousMonth)
    months.push(currentMonth)
    months.push(nextMonth)
    this.setState({ months: months, isLoadingCalendar: false })

  }

  
  
  getDaysInMonthUpdate = (currentIndex) => {
    let index = currentIndex
    let newMonthDay = this.state.months[index][8] //use day to define month, if too low, or too hight, change could stuck 
    let newMonths = []

    let previousMonth = this.getOneMonth(subMonths(parse(newMonthDay), 1))
    let nextMonth = this.getOneMonth(addMonths(parse(newMonthDay), 1))
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


    let nextWeek = addDays(parse(this.state.selectedDay), 7)
    this.setState({ selectedDay: nextWeek, indexBefore: newIndex }, this.getDaysInMonthUpdate(newIndex))
  }
  previousWeek = (newIndex) => {
    let previousWeek = subDays(parse(this.state.selectedDay), 7)
    this.setState({ selectedDay: previousWeek, indexBefore: newIndex }, this.getDaysInMonthUpdate(newIndex))
   

  }
  
  componentDidMount () {
    setTimeout(() => this.getDaysInMonth(parse(new Date())), 4)
  }
  render () {
   
    const eventListStyle = {
     
      flex: 1,
      flexDirection: "column",
    }

    return (
      <View style={eventListStyle}>
     
     <View style={{ width: WIDTH, padding: 0, margin: 0, flexDirection: "column"

          }}>

<Header 
         darkTheme={this.props.darkTheme}
      daysText={this.state.daysText}
      weekDays={this.state.weekDays}
      hours={this.state.hours}
      colors={this.props.colors}

    />
    </View>

        {this.state.months && this.props.allData && !this.state.isLoadingCalendar
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
         colors={this.props.colors}
         selectItem={this.props.selectItem}

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


