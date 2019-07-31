import React from "react";
//import "./Register.css";
import { PanResponder, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, Animated, Easing, RefreshControl } from "react-native"
import { sendPost } from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon, FabIcon } from '../../customComponents.js';
import { Content, SwipeRow, Icon, Button } from 'native-base';
import { EventDetails } from '../../components/EventDetails/Event';
import { encryptData } from '../../encryptionFunctions';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class AgendaView extends React.Component {
 
  formatDates = (dateFrom, dateTill, daysAlreadyUsed) => {
    //Compare dates to format view in agenda and check for duplicates
    let currentDate = new Date().toString();
    let currentDay = currentDate.slice(4, 7);
    let currentMonth = currentDate.slice(8, 10);

    let dayFrom = dateFrom.slice(4, 7);
    let monthFrom = dateFrom.slice(8, 10);
    let dayTill = dateTill.slice(4, 7);
    let monthTill = dateTill.slice(8, 10);
    const boldTextStyle =  {
      fontSize: 22,
      fontFamily: "Poppins-Bold",
      color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
    }
    const oneColumnStyle = {
      flexDirection: "row",
      flex: 1,
      width: "100%",
      paddingLeft: 12,
      paddingTop: 20,
      borderRadius: 8,
    }
    if (currentDay + currentMonth === dayFrom + monthFrom & daysAlreadyUsed.includes(dayFrom + monthFrom) === false) {
      daysAlreadyUsed.pop()
      daysAlreadyUsed.push(dayFrom + monthFrom)

      return <View style={oneColumnStyle}>
        <Text style={boldTextStyle}>Today</Text>
      </View>
    } else if (currentDay + currentMonth === dayFrom + monthFrom & daysAlreadyUsed.includes(dayFrom + monthFrom)) {
      return
    } else if (dayFrom + monthFrom === dayTill + monthTill & daysAlreadyUsed.includes(dayFrom + monthFrom) === false) {
      daysAlreadyUsed.pop()
      daysAlreadyUsed.push(dayFrom + monthFrom)
      return <View style={oneColumnStyle}>
        <Text style={boldTextStyle}>{dayFrom}. {monthFrom}</Text>
      </View>
    } else if (dayFrom + monthFrom === dayTill + monthTill & daysAlreadyUsed.includes(dayFrom + monthFrom)) {
      return
    } else {
      return <View style={oneColumnStyle}>
        <Text style={boldTextStyle}>{dayFrom}. {monthFrom} - {dayTill}. {monthTill}</Text>
      </View>
    }

  }
  getCalendarColor = (event) => {
    let calendarColor
    this.props.calendars.map(item => {
      if (item.uuid == event.calendar) {
        calendarColor = item.color
      }
    })
    return calendarColor
  }
  render () {
    const twoColumnStyle = {
      flexDirection: "row",
      flex: 1,
    }
    const leftColumnStyle = {
      width: "25%",
      flexDirection: "row"
    }
    const rightColumnStyle = {
      width: "75%",
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: "center",
      flexDirection: "row",
    }
    const normalTextStyle = {
      fontSize: 20,
      textAlign: "left",
      color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
    }
    let formatDates = this.formatDates
    let daysAlreadyUsed = []
    return (
<FlatList
            data={this.props.sortedData}
            keyExtractor={item => item.uuid.toString()}
            renderItem={({ item }) =>
              <View style={{ flex: 1, alignItems: "center" }}>

                {formatDates(item.dateFrom, item.dateTill, daysAlreadyUsed)}


                <View style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>

              <View style={{ width: "100%", height: 60, borderRadius: 12, backgroundColor: this.props.darkTheme ? "#515059" : "silver",
                }}>
                
                <TouchableNativeFeedback
  onPress={() => { this.props.selectItem(item), this.props.BottomSheet.open()} }
  >
                      <View style={twoColumnStyle}>
              
                        <View style={leftColumnStyle}>
                        <View style={{width: "30%", height: "100%", margin: 0, borderTopLeftRadius:12, borderBottomLeftRadius: 12, backgroundColor: this.getCalendarColor(item)}}>
                        </View>
                        <View style={{width: "70%", alignSelf: "center",
    justifyContent: "center",}}>
                        {formatTime(item.dateFrom, item.dateTill, this.props.darkTheme)}

                        </View>
                        </View>
                        <View style={rightColumnStyle}>
                          <View style={{width: "80%", justifyContent: "center",}}>
                          <Text style={normalTextStyle}>{item.text}</Text>
                          </View>
                          {item.isFavourite
                          ?  <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
                            <Ionicons name="md-star" size={26} color="gainsboro"/>
                          </View>
                          : <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}/>
                          }
                        </View>
                      </View>

                    </TouchableNativeFeedback>
              

                    </View>
                    </View>

              </View>



            }
          />
    )
  }

  }

  
function formatTime(dateFrom, dateTill, darkTheme) {
  let timeFrom = dateFrom.slice(16, 18) + "." + dateFrom.slice(19, 21)
  let timeTill = dateTill.slice(16, 18) + "." + dateTill.slice(19, 21)
  const smallerTextStyle = {
    fontSize: 17,
    textAlign: "center",
    color: darkTheme ? "mintcream" : "#0F0F0F",
  }
  return <Text style={smallerTextStyle}>{timeFrom}{"\n"}{timeTill}</Text>
}

function filterAndSortData(data) {
  //Filter old events and sort them

  let currentDate = new Date();
  let filteredData = data.filter(item => { return new Date(item.dateFrom) >= currentDate || new Date(item.dateTill) >= currentDate })
  let sortedData = filteredData.sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom))
  return sortedData;
}

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayWasSet: false,
      refreshing: false,
    }

  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.props.refreshData().then(() => {
      this.setState({refreshing: false});
    }).catch((error) => {
  
      this.setState({refreshing: false});
  
      console.log(error)
    })
  }
  deleteEventFromServer = (id) => {
    //Send request to server to delete event based on id

    sendPost("https://api.hideplan.com/delete/event", {
      eventId: id
    }, () => { this.props.eventWasDeleted(id) })

  }


  componentDidMount () {
  }

  render() {
    let decryptedData = this.props.decryptedData;
    let sortedData = filterAndSortData(decryptedData);



    return (
      <View style={{ flex: 1 }}>
      {sortedData.length > 0 
      ?<ScrollView
      style={{flex: 1}}
       refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }><AgendaView
      darkTheme={this.props.darkTheme}
      sortedData={sortedData}
      calendars={this.props.calendars}
      selectItem={this.props.selectItem}
      BottomSheet={this.props.BottomSheet}
      />
      </ScrollView>
      :<ScrollView
      style={{flex: 1, }}
       refreshControl={
        <RefreshControl
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
        />
      }><View style={{ flex: 1, justifyContent: "center", height: HEIGHT - 112, }}>
      <Text style={{ fontSize: 20, textAlign: "center", color: this.props.darkTheme ? "white" : "black" }}>
        No upcoming events
    </Text>
    </View>
    </ScrollView>
  }
      






      </View>
    )
  }
}


export default class Agenda extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEvent: "",
      selectedItem: "",

    }
  }
  selectEvent = (event) => {
    this.setState({ selectedEvent: event })
  }
  componentDidMount() {
    let data = this.props.decryptedData
  }
  selectItem = (item) => {
    this.setState({ selectedItem: item })
  }
 
  render() {

    return (
      <View style={{ flex: 1, backgroundColor: this.props.darkTheme ? "#202124" : "#F7F5F4" }}>
     
      { this.props.BottomSheet
      ? <Event darkTheme={this.props.darkTheme} decryptedData={this.props.decryptedData}
      eventWasDeleted={this.props.eventWasDeleted} calendars={this.props.calendars}
      selectEvent={this.selectEvent}
      BottomSheet={this.props.BottomSheet}
      selectItem={this.props.selectItem}
      refreshData={this.props.refreshData}
      />
      : null
      }
      
           
      
      </View>
    );
  }
}



const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "column",
    flex: 1,
    width: "100%",
  },
  inputText: { 
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 10
  },
  oneColumnStyle: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    paddingLeft: 12,
    paddingTop: 12,
    borderRadius: 8,
  
  },
  twoColumnStyle: {
    flexDirection: "row",
    flex: 1,


  },
  leftColumnStyle: {
    width: "25%",
    
    flexDirection: "row"
  },
  rightColumnStyle: {
    width: "75%",
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: "center",

  },
  boldTextStyle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#CFD6CF"
  },
  normalTextStyle: {
    fontSize: 20,
    textAlign: "left",
    color: "white"

  },
  smallerTextStyle: {
    fontSize: 17,
    textAlign: "center",
    color: "white"


  }, container: {
    backgroundColor: 'white',
    flex: 1,
  },
  standalone: {
    marginTop: 30,
    marginBottom: 30,
  },
  standaloneRowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
  },
  backTextWhite: {
    color: '#FFF',
  },
  rowFront: {
    alignItems: 'center',
    backgroundColor: '#CCC',
    justifyContent: 'center',
    height: 50,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
  },
  backRightBtnLeft: {
    backgroundColor: 'blue',
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: 'red',
    right: 0,
  },
})


