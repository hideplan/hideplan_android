import React from "react";
//import "./Register.css";
import {
  PanResponder,
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Animated,
  Easing,
  RefreshControl
} from "react-native";
import { sendPost } from "../../functions.js";
import NavigationService from "../../NavigationService.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HeaderIcon, HeaderIconMenu, HeaderIconEmpty, AppHeader } from "../../customComponents.js";
import { Content, SwipeRow, Button } from "native-base";
import { encryptData } from "../../encryptionFunctions";
import dateFns, {
  format,
  isFuture,
  getDay,
  getDate,
  isPast,
  isToday,
  isAfter,
  isSameDay,
  isTomorrow,
  differenceInCalendarDays,
  differenceInWeeks
} from "date-fns";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { parse, formatDate } from "../../functions";
import { parseISO } from "date-fns";
import { Portal} from 'react-native-paper';

import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Warning: ..."]);
<script src="http://localhost:8097"></script>;
console.disableYellowBox = true;

const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;

class Card extends React.Component {
  render() {
    const twoColumnStyle = {
      flexDirection: "row"
    };
    const leftColumnStyle = {
      width: "25%",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row"
    };
    const rightColumnStyle = {
      width: "75%",
      paddingLeft: 10,
      paddingRight: 10,
      justifyContent: "center",
      flexDirection: "row"
    };
    const normalTextStyle = {
      fontSize: 16,
      textAlign: "left",
      color: this.props.colors.gray,
      includeFontPadding: false,
      fontFamily: "OpenSans"
    };
    const titleText = {
      fontSize: 18,
      textAlign: "left",
      color: this.props.colors.text,
      includeFontPadding: false,
      fontWeight: "bold",
      fontFamily: "OpenSans"
    };
    const titleTextSmall = {
      fontSize: 14,
      textAlign: "left",
      color: this.props.colors.gray,
      includeFontPadding: false,
      fontFamily: "OpenSans"
    };
    const listText = {
      fontSize: 14,
      textAlign: "left",
      color: this.props.colors.gray,
      includeFontPadding: false,
      fontFamily: "OpenSans"
    };
    const cardWrapper = {
      margin: 16
    };
    const cardBoxStyle = {
      flex: 1,
      backgroundColor: this.props.colors.modal,
      marginTop: 16,
      marginRight: 16,
      paddingBottom: 16,
      height: "auto",
      borderRadius: 4,
      elevation: 2,
      zIndex: 0
    };
    const marginStyle = {
      width: "100%",
      marginTop: 5,
      marginBottom: 5
    };
    item = this.props.item;
    return (
      <TouchableNativeFeedback
        onPress={() => {
          this.props.onPress();
        }}
        background={
          this.props.darkTheme
            ? TouchableNativeFeedback.Ripple(this.props.colors.ripple)
            : TouchableNativeFeedback.SelectableBackground()
        }
      >
        <View style={cardBoxStyle}>
          <View
            style={{
              padding: 16,
              borderBottom: "solid",
              borderColor: this.props.getCalendarColor(item),
              borderBottomWidth: 5,
            }}
          >
            <Text numberOfLines={1} style={titleText}>
              {item.text}
            </Text>
          </View>
          <View style={{flex: 1, height: "auto", flexDirection: "column", paddingTop: 16, paddingLeft: 16, paddingRight: 16, alignItems: "flex-start", justifyContent: "flex-start"}}>
            
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              
            }}
          >
              <Icon name="clock" size={15} color={this.props.colors.gray} />
            <View style={{ marginLeft: 8, justifyContent: "flex-start",
              alignItems: "flex-start", }}>
              {formatTime(
                item.dateFrom,
                item.dateTill,
                this.props.darkTheme,
                this.props.colors,
                item.allDay
              )}
            </View>
          </View>
         {item.reminder
        ?           <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingTop: 8 
        }}
      >
          <Icon name="bell" size={15} color={this.props.colors.gray} />
        <View style={{ marginLeft: 8, justifyContent: "flex-start",
          alignItems: "flex-start", }}>
          <Text style={listText}>{item.remindBefore.label}</Text>
        </View>
      </View>
      : null}
         {item.location
        ?           <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingTop: 8 
        }}
      >
          <Icon name="map-marker" size={15} color={this.props.colors.gray} />
        <View style={{ marginLeft: 8, justifyContent: "flex-start",
          alignItems: "flex-start", }}>
          <Text style={listText}>{item.location}</Text>
        </View>
      </View>
      : null}
       {item.notes
        ?           <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingTop: 8 
        }}
      >
          <Icon name="note" size={15} color={this.props.colors.gray} />
        <View style={{ marginLeft: 8, justifyContent: "flex-start",
          alignItems: "flex-start", }}>
          <Text style={listText}>{item.notes}</Text>
        </View>
      </View>
      : null}
          </View>

        </View>
      </TouchableNativeFeedback>
    )
  }
}

class AgendaView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todayWasSet: false,
      refreshing: false,
      contentOffsetYBefore: "",
      fabVisible: true
    };
  }
  formatDates = (dateFrom, dateTill, daysAlreadyUsed) => {
    //Compare dates to format view in agenda and check for duplicates
    let dateNow = new Date();
    let currentDate = dateNow.toString();
    let currentDay = currentDate.slice(4, 7);
    let currentMonth = currentDate.slice(8, 10);

    let dayFrom = dateFrom.slice(4, 7);
    let monthFrom = dateFrom.slice(8, 10);
    let dayTill = dateTill.slice(4, 7);
    let monthTill = dateTill.slice(8, 10);
    const boldTextStyle = {
      fontSize: 26,
      margin: 0,
      marginLeft: 16,
      fontFamily: "Poppins-Bold",
      includeFontPadding: false,
      fontWeight: "bold",
      color: this.props.colors.text
    };
    const primaryTextStyle = {
      fontSize: 18,
      margin: 0,
      fontFamily: "OpenSans-Bold",
      includeFontPadding: false,
      color: this.props.colors.primaryText
    };
    const normalTextStyle = {
      fontSize: 18,
      margin: 0,
      fontFamily: "OpenSans-Bold",
      includeFontPadding: false,
      color: this.props.colors.text
    };

    const oneColumnStyle = {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center"
    };

    const wrapper = {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "center",
      padding: 16
    };

    const circleColor = {
      borderRadius: 15,
      width: 30,
      height: 30,
      backgroundColor: this.props.colors.primary,
      justifyContent: "center",
      alignItems: "center"
    };

    const circle = {
      borderRadius: 15,
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center"
    };

    if (
      (currentDay + currentMonth === dayFrom + monthFrom) &
      (daysAlreadyUsed.includes(dayFrom + monthFrom) === false)
    ) {
      //Today
      daysAlreadyUsed.pop();
      daysAlreadyUsed.push(dayFrom + monthFrom);

      return (
        <View style={wrapper}>
          <View style={oneColumnStyle}>
            <View style={circleColor}>
              <Text style={primaryTextStyle}>{getDate(parse(dateFrom))}</Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                margin: 0,
                fontFamily: "OpenSans",
                includeFontPadding: false,
                color: this.props.colors.primary
              }}
            >
              {dateFrom.slice(0, 3).toUpperCase()}
            </Text>
          </View>
        </View>
      );
    } else if (
      (currentDay + currentMonth === dayFrom + monthFrom) &&
      daysAlreadyUsed.includes(dayFrom + monthFrom)
    ) {
      return;
    } else if (
      (dayFrom + monthFrom === dayTill + monthTill) &&
      (daysAlreadyUsed.includes(dayFrom + monthFrom) === false)
    ) {
      daysAlreadyUsed.pop();
      daysAlreadyUsed.push(dayFrom + monthFrom);

      let daysDifference = differenceInCalendarDays(
        parse(dateFrom),
        parse(dateNow)
      );
      return (
        <View style={wrapper}>
          <View style={oneColumnStyle}>
            <View style={circle}>
              <Text style={normalTextStyle}>{getDate(parse(dateFrom))}</Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                margin: 0,
                fontFamily: "OpenSans",
                includeFontPadding: false,
                color: this.props.colors.gray
              }}
            >
              {dateFrom.slice(0, 3).toUpperCase()}
            </Text>
          </View>
        </View>
      );
    }
  };
  formatMonths = (dateFrom, dateTill, monthsAlreadyUsed, colors) => {
    //Compare dates to format view in agenda and check for duplicates
    let dateNow = new Date();
    let currentDate = dateNow.toString();
    let currentMonth = format(parse(dateNow), "MMMM yyyy").toString()
    let monthFromMonth = format(parse(dateFrom), "MMMM").toString()
    let monthFromYear = format(parse(dateFrom), "yyyy").toString()

    let monthFrom = monthFromMonth + " " + monthFromYear

    const titleBox = {
      flex: 1,
      alignItems: "flex-start",
      justifyContent: "center",
      flexDirection: "column",

  }
  const titleText = {
      fontSize: 28,
      margin: 0,
      padding: 0,
      color: this.props.colors.text,
      fontWeight: "600",
      fontFamily: 'OpenSans-Bold', 
      includeFontPadding: false,

  }
  const subtitleText = {
      color: this.props.colors.gray,fontFamily: 'OpenSans',includeFontPadding: false,
      fontSize: 12, padding: 0, margin: 0
  }

    if (
      (monthsAlreadyUsed.includes(monthFrom) === false)
    ) {
      //Today
      monthsAlreadyUsed.pop();
      monthsAlreadyUsed.push(monthFrom);

      return (
      <View
        style={{

          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "row",
          marginTop: 32,
          marginLeft: 72,
          height: "auto",
        }}
      ><View style={titleBox}>
                <Text numberOfLines={1} style={titleText}>
                {monthFromMonth}
                </Text>

               <Text style={subtitleText}>
               {monthFromYear}
                </Text>
                </View>
        </View>
      )
    } 
      
    }
  getCalendarColor = event => {
    let calendarColor;
    this.props.calendars.map(item => {
      if (item.uuid === event.calendar) {
        //TODO Temporary till migrate all old settings for calendars
        if (item.color.s200) {
          if (this.props.darkTheme) {
            calendarColor = item.color.s200;
          } else {
            calendarColor = item.color.s600;
          }
        } else {
          calendarColor = item.color;
        }
      }
    });

    return calendarColor;
  };

  scrollToToday = index => {
    this.FlatList.scrollToOffset({
      offset: index * 125,
      animated: true
    });
  };
  scrollToIndex = index => {
    this.FlatList.scrollToIndex({
      index: index,
      viewOffset: 10,
      animated: true
    });
  };
  clickEvent = () => {
    this.props.selectItem(item)
  }
  render() {
    const isScrollingUp = ({
      layoutMeasurement,
      contentOffset,
      contentSize
    }) => {
      this.setState({ contentOffsetYBefore: contentOffset.y });
      return contentOffset.y < this.state.contentOffsetYBefore;
    };
    let formatDates = this.formatDates;
    let daysAlreadyUsed = [];
    let monthsAlreadyUsed = []
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          ref={ref => {
            this.FlatList = ref;
          }}
          onScroll={({ nativeEvent }) => {
            if (nativeEvent.contentOffset.y == 0) {
              if (this.props.hasHeaderShadow) {
                this.props.changeHeaderShadow(false);
               
              }
            } else {
              if (!isScrollingUp(nativeEvent)) {
                if (!this.props.hasHeaderShadow) {
                  this.props.changeHeaderShadow(true);
                }
               
              }
            }
          }}
          scrollEventThrottle={200}

          data={this.props.sortedData}
          style={{ flex: 1, width: WIDTH, paddingBottom: 100 }}
          keyExtractor={item => item.uuid.toString()}
          scrollEnabled={true}
          // initialScrollIndex={this.props.initIndex-1}
          renderItem={({ item, index }) => (
            <View
              style={{
                flex: 1,
                alignItems: "flex-start",
                flexDirection: "column",

                marginTop: !daysAlreadyUsed.includes(
                  item.dateFrom.slice(4, 7) + item.dateFrom.slice(8, 10)
                )
                  ? 0
                  : 0
              }}
            >

 
                            {this.formatMonths(item.dateFrom, item.dateTill, monthsAlreadyUsed, this.props.colors)}
                        

                            <View
              style={{
                flex: 1,
                alignItems: "flex-start",
                flexDirection: "row",

              }}
            >
              <View
                style={{
                  width: 72,
                  alignItems: "flex-start",
                  justifyContent: "flex-start"
                }}
              >
                {formatDates(item.dateFrom, item.dateTill, daysAlreadyUsed)}
  
              </View>

              <View style={{ width: WIDTH - 72 }}>
                <Card
                  onPress={() => this.clickEvent()}
                  getCalendarColor={this.getCalendarColor}
                  item={item}
                  darkTheme={this.props.darkTheme}
                  colors={this.props.colors}
                />
              </View>
            </View>
            </View>

          )}
        />
      </View>
    );
  }
}

function formatDateCalendar(dateFrom, dateTill, darkTheme, colors) {
  let monthFrom = dateFrom.slice(4, 7);
  let dayFrom = dateFrom.slice(8, 10);
  let monthTill = dateTill.slice(4, 7);
  let dayTill = dateTill.slice(8, 10);

  const smallerTextStyle = {
    fontSize: 14,
    textAlign: "center",
    color: colors.gray,
    includeFontPadding: false,
    fontFamily: "OpenSans"
  };
  if (!isSameDay(parse(dateFrom), parse(dateTill))) {
    return (
      <Text style={smallerTextStyle}>
        {dayFrom + ". " + monthFrom + " - " + dayTill + ". " + monthTill}
      </Text>
    );
  } else {
    return <Text style={smallerTextStyle}>{dayFrom + ". " + monthFrom}</Text>;
  }
}

function formatTime(dateFrom, dateTill, darkTheme, colors, allDay) {
  let timeFrom = dateFrom.slice(16, 18) + "." + dateFrom.slice(19, 21);
  let timeTill = dateTill.slice(16, 18) + "." + dateTill.slice(19, 21);
  const smallerTextStyle = {
    fontSize: 14,
    textAlign: "center",
    color: colors.gray,
    includeFontPadding: false,
    fontFamily: "OpenSans"
  };
  return (
    <Text style={smallerTextStyle}>
      {allDay != "true" ? timeFrom + " - " + timeTill : "All day"}
    </Text>
  );
}
function getInitialIndex(data) {
  let myIndex;
  data.map((item, index) => {
    if (isToday(parse(item.dateFrom))) {
      myIndex = index;
      return myIndex;
    }
  });
}

class Event extends React.Component {
  _onRefresh = () => {
    this.setState({ refreshing: true });
    this.props
      .refreshData()
      .then(() => {
        this.setState({ refreshing: false });
      })
      .catch(error => {
        this.setState({ refreshing: false });

        console.log(error);
      });
  };
  deleteEventFromServer = id => {
    //Send request to server to delete event based on id

    sendPost(
      "https://api.hideplan.com/delete/event",
      {
        eventId: id
      },
      () => {
        this.props.eventWasDeleted(id);
      }
    );
  };
  filterData = data => {
    //Filter old events and sort them

    /*let filteredData = data.filter(item => {
      return (
        new Date(item.dateFrom) >= currentDate ||
        new Date(item.dateTill) >= currentDate
      );
    });
    */
    let arr = [];
    let filteredData = data
      .filter(item => {
        return isPast(parse(item.dateTill));
      })
      .sort((a, b) => {
        return parse(a.dateFrom) - parse(b.dateFrom);
      });

    return filteredData;
  };

  componentDidMount() {}

  render() {
    let decryptedData = this.props.decryptedData;
    let data = this.filterData(decryptedData);

    return (
      <View style={{ flex: 1, backgroundColor: this.props.colors.surface }}>
        {data.length > 0 ? (
          <AgendaView
            darkTheme={this.props.darkTheme}
            sortedData={data}
            calendars={this.props.calendars}
            selectItem={this.props.selectItem}
            colors={this.props.colors}
            changeHeaderTitle={this.props.changeHeaderTitle}
            changeHeaderShadow={this.props.changeHeaderShadow}
            hasHeaderShadow={this.props.hasHeaderShadow}
            moveFab={this.props.moveFab}
            fabVisible={this.props.fabVisible}
            showSnackbar={this.props.showSnackbar}
            snackbarVisible={this.props.snackbarVisible}
            hideModal={this.props.hideModal}
          />
        ) : (
          <ScrollView
            onLayout={() => {
              this.props.moveFab(true);
            }}
            style={{ flex: 1 }}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                width: "100%",
                height: HEIGHT - 140
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  textAlign: "center",
                  color: this.props.colors.gray,
                  fontFamily: "OpenSans",
                  includeFontPadding: false
                }}
              >
                No past events
              </Text>
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

export default class PastEvents extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedEvent: "",
      selectedItem: "",
      hasHeaderShadow: false
    };
  }
  changeHeaderShadow = (value) => {
    this.setState({hasHeaderShadow: value})
  }
  selectEvent = event => {
    this.setState({ selectedEvent: event });
  };
  componentDidMount() {
    let data = this.props.decryptedData;
  }
  componentWillUnmount() {}
  selectItem = item => {
    this.setState({ selectedItem: item });
  };
  moveFab = value => {
    if (value) {
      Animated.timing(this.state.fabBottom, {
        toValue: 0,
        duration: 200
      }).start();
    } else {
      Animated.timing(this.state.fabBottom, {
        toValue: -80,
        duration: 200
      }).start();
    }
  };
  render() {
    const headerStyle = {
      backgroundColor: this.props.colors.header,
      color: this.props.colors.text,
      elevation: this.state.hasHeaderShadow && this.props.darkTheme == false ? 8 : 0,
    }

    return (
      <Portal 
      >
  <StatusBar backgroundColor={this.props.colors.surface} barStyle={this.props.darkTheme ? "light-content" : "dark-content"} />
      <View style={{ flex: 1,}}>
     

<AppHeader style={headerStyle}
        screen="notes"
        darkTheme={this.props.darkTheme}
        colors={this.props.colors}
        title={"Past events"}
        hasHeaderShadow={false}
        menuIcon={() => { return <HeaderIconMenu darkTheme={this.props.darkTheme} ripple={this.props.colors.ripple} headerIcon="arrow-left" color={this.props.colors.gray} headerFunction={() => {
          this.props.hideModal()
        }} /> }}
        icons={[]}
        />
        {this.props.decryptedData ? (
          <Event
            darkTheme={this.props.darkTheme}
            decryptedData={this.props.decryptedData}
            eventWasDeleted={this.props.eventWasDeleted}
            calendars={this.props.calendars}
            selectEvent={this.props.selectEvent}
            selectItem={this.props.selectItem}
            refreshData={this.props.refreshData}
            colors={this.props.colors}
            changeHeaderShadow={this.changeHeaderShadow}
            hasHeaderShadow={this.hasHeaderShadow}
            moveFab={this.props.moveFab}
            fabVisible={this.props.fabVisible}
            showSnackbar={this.props.showSnackbar}
            snackbarVisible={this.props.snackbarVisible}
            hideModal={this.props.hideModal}

          />
        ) : null}
      </View>

</Portal>
    );
  }
}

