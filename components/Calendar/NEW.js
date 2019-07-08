import React from "react";
//import "./Register.css";
import { Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { getMinutes, getHours, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour } from "date-fns";

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;



class ButtonEvent extends React.Component {

  render() {
    let buttonColor = "black"
    _onPressButton = {
    }

    return (
      <Button style={{ backgroundColor: buttonColor, width: "100%", display: "hidden" }}
        onPress={this._onPressButton}
        title="New event"
      />

    );
  }
}

class EventBlock extends React.Component {


  render() {

    return (
      <View style={styles.eventContainerStyle}>
        <Text>New event</Text>
      </View>
    )
  }
}




class HoursTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      eventBarIsShown: false,
    }
    this.setEventBarVisibility = this.setEventBarVisibility.bind(this);

  }

  setEventBarVisibility(date) {
    console.log(date)
    /*this.state.eventBarIsShown
      ? this.setState({ eventBarIsShown: false })
      : this.setState({ eventBarIsShown: true })
    */
  }

  renderTimetable(hourInTimetable) {
    const data = this.props.decryptedData;

    const currentDateFormat = "DD MMMM YYYY";
    const currentDay = dateFns.format(this.props.currentDay, currentDateFormat);
    const selectedDate = this.props.selectedDate;
    const eventDate = (eventDate) => dateFns.format(eventDate, currentDateFormat);


    for (let i=0; i<data.length; i++) {

      if (selectedDate !== currentDay) {

        if (selectedDate === eventDate(data[i].dateFrom)) {
        
          if ((getHours(data[i].dateFrom)).toString() === hourInTimetable) {
           return  <View style={styles.eventBoxStyle}>
                      <Text>{data[i].text}</Text>
                  </View>
          }
        }
      } else if (selectedDate === currentDay) {

        if (selectedDate === eventDate(data[i].dateFrom)) {
          if ((getHours(data[i].dateFrom)).toString() === hourInTimetable) {

           return  <View style={styles.eventBoxStyle}>
                      <Text>{data[i].text}</Text>
                  </View>
          }
        }
      } else {
        return
      }
    }
  }

  componentWillMount() {
  }

  renderRows = () => {
    const selectedDate = this.props.selectedDate;
    const selectedYear = getYear(selectedDate);
    const selectedMonth = getMonth(selectedDate);
    const selectedDay = getDate(selectedDate);
    let timestamp = new Date(selectedYear, selectedMonth, selectedDay, 0, 0);

    while (isSameDay(timestamp, selectedDate)) {
      timestamp = addMinutes(timestamp, 15)
      console.log(timestamp)
    }
  }

  renderEvents = (dataset, timestamp, usedEventsArray) => {
    return (dataset.map(event => {
      if (isWithinRange(timestamp, event.dateFrom, event.dateTill)) {
        if (usedEventsArray.includes(event.uuid) === false) {

          //Z-index is not working, have to render as last item

          usedEventsArray.push(event.uuid)
          return (<View><View style={styles.eventBoxStyle}></View><Text style={styles.textBoxStyle}>{event.text}</Text></View>)
        } else {
          return (<View style={styles.eventBoxStyle}></View>)
        }
      
      }  
    }
    ))

  }

  renderHours = (hour) => {
    //draw hours to table, if same hour as now, make it bold
     if (getMinutes(hour) === 0 && isSameHour(hour, new Date())) {
      return ( 
        <Text >
          {getHours(hour)}
        </Text>)    
    } else if (getMinutes(hour) === 0) {
      return <Text>{getHours(hour)}</Text>
    } 
  }

  scrollToHourNow = (hour, xLayout, yLayout) => {
    if (isSameHour(hour, new Date())) {
      this.refs.timetable.scrollTo({x: xLayout, y: yLayout - 50, animated: true})
    }
  } 

  render() {

    const currentDateFormat = "DD MMMM YYYY";

    const decryptedData = this.props.decryptedData;
    const decryptedDataFiltered = this.props.decryptedData.filter(event => event.dateFrom)

    const selectedDate = this.props.selectedDate;
    const selectedYear = getYear(selectedDate);
    const selectedMonth = getMonth(selectedDate);
    const selectedDay = getDate(selectedDate);
    let timestamp = new Date(selectedYear, selectedMonth, selectedDay, 0, 0);

    let timestampArray = [new Date(selectedYear, selectedMonth, selectedDay, 0, 0)];
    let usedEventsArray = [];

    while (isSameDay(timestamp, selectedDate)) {
      timestamp = addMinutes(timestamp, 15)
      timestampArray.push(timestamp.toString())
    }

    const timetable = timestampArray.map(item => {
        return (
          <View key={item.toString()}  style={{ flex: 1, flexDirection: 'column', flexWrap: 'wrap', width: "100%" }}>
        <View  style={styles.containerWrapperStyle}>
       
          <View style={styles.containerHourStyle}>
         
          <View style={styles.hourColumnStyle}>
            {this.renderHours(item)}
          </View>

            <View style={styles.eventColumnStyle}>

                {this.renderEvents(decryptedData, item, usedEventsArray)
                }
                {getMinutes(item) === 0
                ? <View style={styles.borderTop}></View>
                : null
              }
          
                </View>
              

            </View>

          </View>
        </View>


        )
      })
    

    return (
      <ScrollView ref="timetable" style={{ paddingVertical: 20 }}>


          {timetable}

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  containerHourStyle: {
    flexDirection: "row",
    flex: 1,
    height: 10,

  },
  containerWrapperStyle: {
    flex: 1,
  },
  hourColumnStyle: {
    width: "5%",
    alignItems: "center",

  },
  eventColumnBordersStyle: {
    width: "95%",

  },
  eventColumnStyle: {
    width: "95%",


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
    backgroundColor: "dodgerblue",
    height: 10,
    width: "100%",
    borderWidth: 0,
    zIndex: 0,

  },
  eventBoxWithTextStyle: {
    backgroundColor: "dodgerblue",
    height: 10,
    width: "100%",

  },
  textBoxStyle: {
    fontSize: 20,
    color: "white",
    zIndex: 10,
    width: "100%",
    textAlign: "center",
    position: "absolute",
    height: 10,

  },
  emptyBoxStyle: {
    fontSize: 20,
    width: "100%",

  },
  borderTop: {
    borderTopWidth: 0.4
  }, 

  

})



const calendarStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    flex: 1, 
    alignSelf: 'stretch',
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
    flex: 1, 
    alignSelf: 'stretch',
    alignItems:'center',

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
    padding: 1,
  },
  body: {
    position: "relative"
  },
  bodycell: {
    position: "relative",
    height: 5,
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
  currentDay: {
    backgroundColor: "dodgerblue",
    color: "white",
    borderRadius: 100/2,
    borderWidth: 1,
    borderColor: 'dodgerblue',
    alignItems:'center',
    alignSelf: "center"

  },
  selectedDay: {
    backgroundColor: "black",
    color: "white",
    borderRadius: 100/2,
    borderWidth: 1,
    borderColor: 'black',
    alignItems:'center',
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
    width: "30%"

  }
})

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentWeek: new Date().toString(),

    };

  }

  renderHeader() {
    const dateFormat = "DD. MMMM";
    return (
    
        <View style={calendarStyle.headerContainer}>
        <View style={calendarStyle.buttonContainer}>

        <Button style={calendarStyle.buttonSwitch} onPress={this.prevWeek} title="previous" />
        </View>

        <View style={calendarStyle.dateText}>

          <Text> {dateFns.format(this.state.currentWeek, dateFormat)}</Text>
          </View>
          <View style={calendarStyle.buttonContainer}>

          <Button style={calendarStyle.buttonSwitch} color="black"  onPress={this.nextWeek} title="next" />
          </View>

      </View>
    );
  }


  renderDays() {

    const dateFormat = "ddd";
    const days = [];
    let startDate = dateFns.startOfWeek((this.state.currentWeek), {weekStartsOn: 1});
    for (let i = 0; i < 7; i++) {
      days.push(
        <View key={i} style={calendarStyle.collumn}>
          <Text>{dateFns.format(dateFns.addDays(startDate, i), dateFormat)} 
          </Text>
        </View>
      )
    }
    return <View style={calendarStyle.row}>{days}</View>
  }

  renderTextForDays(currentDay, otherDay, selectedDay, formattedDate) {
    if (this.checkIfCurrentDay(currentDay, otherDay)) {
      return <Text style={calendarStyle.currentDay}>{" "}{formattedDate}{" "}</Text>
    } else if (this.checkIfSelectedDay(selectedDay, otherDay)) {
      return <Text style={calendarStyle.selectedDay}>
      {" "}{formattedDate}{" "}
      </Text>
    } else {
      return <Text>{" "}{formattedDate}{" "}</Text>
    }
  }
    
    

  renderCells() {
    const { currentWeek } = this.state;
    const monthStart = dateFns.startOfMonth(currentWeek);
    const monthEnd = dateFns.endOfMonth(monthStart);
    const currentDateFormat = "DD MMMM YYYY";


    const startDate = dateFns.startOfWeek((this.state.currentWeek), {weekStartsOn: 1});
    const endDate = dateFns.endOfWeek((this.state.currentWeek), {weekStartsOn: 1});

    const dateFormat = "D";
    const rows = [];
    let days = [];
    const weekDays = []; //store days in array for selecting 
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        weekDays.push(day)
        formattedDate = dateFns.format(day, dateFormat);
        days.push(
          <View style={calendarStyle.collumn}

            key={day}>

          <TouchableOpacity onPress={() => this.props.onDateClick(weekDays[i])}>
          {this.renderTextForDays(dateFns.format(this.props.currentDay, currentDateFormat), dateFns.format(day, currentDateFormat),dateFns.format(this.props.selectedDate, currentDateFormat), formattedDate)}
          
            </TouchableOpacity>
          </View>
        )
        day = dateFns.addDays(day, 1);
      }
      rows.push(
        <View style={calendarStyle.row} key={day}>
          {days}
        </View>
      )
      days = [];
    }
    return             <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    {rows}</View>


  }



  checkIfCurrentDay = (currentDay, otherDay) => {
    if (currentDay === otherDay) {
      return true
    } else {
      return false
    }
  }

  checkIfSelectedDay = (selectedDay, otherDay) => {
    if (selectedDay === otherDay) {
      return true
    } else {
      return false
    }
  }

  nextWeek = () => {
    this.setState({
      currentWeek: dateFns.addWeeks(this.state.currentWeek, 1)
    });
  };

  prevWeek = () => {
    this.setState({
      currentWeek: dateFns.subWeeks(this.state.currentWeek, 1)
    });
  };


  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
        {this.renderHeader()}
        </View>

        <View style={{ flex: 1 }}>

        {this.renderDays()}
        </View>

        <View style={{ flex: 1 }}>

        {this.renderCells()}
        </View>

      </View>
    );
  }
}





export default class CalendarScreen extends React.Component {
  static navigationOptions = {
    title: 'Calendar',
    headerMode: "screen",
    headerTitle: "Calendar",
    headerStyle: {
      backgroundColor: 'white',
    },
    headerRight: (
      <Button
        onPress={() => navigate('NewEventScreen')}
        title="New"
        color="black"
      />
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      currentDay: "", 
      selectedDate: ""
    }
  }

  onDateClick = (targetDay) => { 
    this.setState({
      selectedDate: targetDay })

  };
 

  componentWillMount() {
    
    const currentDayState = new Date();
    this.setState({ currentDay: currentDayState, selectedDate: currentDayState })
  }
  render() {
    return (

      <View style={{ flex: 1 }}>

        <View style={{ flex: 1 }}>

          <Calendar 
            currentDay={this.state.currentDay}
            selectedDate={this.state.selectedDate}
            onDateClick={this.onDateClick}/>

        </View>
        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', border: "solid", borderColor: "black" }}>
          <HoursTable decryptedData={this.props.screenProps.decryptedData} 
          currentDay={this.state.currentDay}
          selectedDate={this.state.selectedDate}/>
        </View>
      </View>

    );
  }
}



module.exports = CalendarScreen;
