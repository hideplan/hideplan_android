import React from "react";
//import "./Register.css";
import { StyleSheet, FlatList, TouchableOpacity, TouchableNativeFeedback, Dimensions, Animated, Easing, TextInput } from "react-native"
import { sendPost } from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon, FabIcon } from '../../customComponents.js';
import { Content, SwipeRow, Text, View, Icon, Button } from 'native-base';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;



function formatTime(dateFrom, dateTill) {
  let timeFrom = dateFrom.slice(16, 18) + "." + dateFrom.slice(19, 21)
  let timeTill = dateTill.slice(16, 18) + "." + dateTill.slice(19, 21)

  return <Text style={styles.smallerTextStyle}>{timeFrom}{"\n"}{timeTill}</Text>
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
    }

  }

  deleteEventFromServer = (id) => {
    //Send request to server to delete event based on id

    sendPost("http://localhost:3001/delete/event", {
      eventId: id
    }, () => { this.props.eventWasDeleted(id) })

  }


  formatDates = (dateFrom, dateTill, daysAlreadyUsed) => {
    //Compare dates to format view in agenda and check for duplicates
    let currentDate = new Date().toString();
    let currentDay = currentDate.slice(4, 7);
    let currentMonth = currentDate.slice(8, 10);

    let dayFrom = dateFrom.slice(4, 7);
    let monthFrom = dateFrom.slice(8, 10);
    let dayTill = dateTill.slice(4, 7);
    let monthTill = dateTill.slice(8, 10);

    if (currentDay + currentMonth === dayFrom + monthFrom & daysAlreadyUsed.includes(dayFrom + monthFrom) === false) {
      daysAlreadyUsed.pop()
      daysAlreadyUsed.push(dayFrom + monthFrom)

      return <View style={styles.oneColumnStyle}>
        <Text style={styles.boldTextStyle}>Today</Text>
      </View>
    } else if (currentDay + currentMonth === dayFrom + monthFrom & daysAlreadyUsed.includes(dayFrom + monthFrom)) {
      return
    } else if (dayFrom + monthFrom === dayTill + monthTill & daysAlreadyUsed.includes(dayFrom + monthFrom) === false) {
      daysAlreadyUsed.pop()
      daysAlreadyUsed.push(dayFrom + monthFrom)
      return <View style={styles.oneColumnStyle}>
        <Text style={styles.boldTextStyle}>{dayFrom}. {monthFrom}</Text>
      </View>
    } else if (dayFrom + monthFrom === dayTill + monthTill & daysAlreadyUsed.includes(dayFrom + monthFrom)) {
      return
    } else {
      return <View style={styles.oneColumnStyle}>
        <Text style={styles.boldTextStyle}>{dayFrom}. {monthFrom} - {dayTill}. {monthTill}</Text>
      </View>
    }

  }

  render() {
    let decryptedData = this.props.decryptedData;
    let sortedData = filterAndSortData(decryptedData);
    let formatDates = this.formatDates
    let daysAlreadyUsed = []



    return (
      <View style={{ flex: 1 }}>

          <FlatList
            data={sortedData}
            keyExtractor={item => item.uuid.toString()}
            renderItem={({ item }) =>
              <View style={{ flex: 1 }}>

                {formatDates(item.dateFrom, item.dateTill, daysAlreadyUsed)}


                <SwipeRow
                  leftOpenValue={75}
                  rightOpenValue={-75}
                  left={
                    <Button warning onPress={() => alert('snooze')}>
                      <Icon active name="alarm" />
                    </Button>
                  }
                  style={{ borderBottomWidth: 0.8, borderBottomColor: "#070707",     backgroundColor: "dodgerblue"
                }}
                  body={
                    <TouchableNativeFeedback
                      onPress={() => { NavigationService.navigate('EventDetails', { text: item.text, id: item.uuid, dateFrom: item.dateFrom, dateTill: item.dateTill, location: item.location, notes: item.notes, reminder: item.reminder }) }}
                    >
                      <View style={styles.twoColumnStyle}>

                        <View style={styles.leftColumnStyle}>
                          {formatTime(item.dateFrom, item.dateTill)}
                        </View>
                        <View style={styles.rightColumnStyle}>
                          <Text style={styles.normalTextStyle}>{item.text}</Text>
                        </View>
                      </View>

                    </TouchableNativeFeedback>
                  }
                  right={
                    <Button danger onPress={() => alert('Trash')}>
                      <Icon active name="trash" />
                    </Button>
                  }
                />


              </View>



            }
          />






      </View>
    )
  }
}


export default class EventListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerMode: "screen",
      headerTitle: "Events",
      headerStyle: {
        backgroundColor: "#EF2647",
        color: "white"
      },
      headerTitleStyle: {
        color: 'white'
      },
      headerRight: (
        <HeaderIcon headerIcon="md-search" headerFunction={() => {
          NavigationService.navigate('Search')
        }} />
      ),
    }
  };

  componentDidMount() {
    let data = this.props.screenProps.decryptedData
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: "#070707" }}>
      {this.props.screenProps.decryptedData.length > 0
      ? <Event decryptedData={this.props.screenProps.decryptedData}
      eventWasDeleted={this.props.screenProps.eventWasDeleted} />
      : <View style={{ flex: 1, justifyContent: "center", width: "100%", }}>
      <Text style={{ fontSize: 22, textAlign: "center", color: "white" }}>
        No upcoming events
    </Text>
    </View>
      }
        <FabIcon onPress={() => { NavigationService.navigate('NewEvent') }} />
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
    paddingTop: 8,
    paddingBottom: 8,
  },
  twoColumnStyle: {
    flexDirection: "row",
    flex: 1,

  },
  leftColumnStyle: {
    width: "25%",
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
    color: "#929390"
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


module.exports = EventListScreen;
