import React from "react";
//import "./Register.css";
import { DrawerLayoutAndroid,  View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays, isToday, isTomorrow } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Menu from '../../Menu.js';

import { HeaderIcon, FabIcon } from '../../customComponents.js';
import { Toast } from '../../customComponents.js';
import { Button, Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading, SwipeRow } from 'native-base';
import { DrawerActions } from 'react-navigation';
import { decryptData, encryptData } from '../../encryptionFunctions';
import { createId } from '../../functions';
import MyDrawer from '../../drawer/Drawer.js';import { BottomSheet, BottomSheetExpanded } from '../../bottomSheet/BottomSheet.js';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

function formatTime(dateFrom, dateTill) {
  let timeFrom = dateFrom.slice(16, 18) + "." + dateFrom.slice(19, 21)
  let timeTill = dateTill.slice(16, 18) + "." + dateTill.slice(19, 21)

  return <Text style={{fontSize: 17, textAlign: "center",
    color: "white"}}>{timeFrom}{"\n"}{timeTill}</Text>
}

class DataView extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
    tasksAreDisplayed: true,
    notesAreDisplayed: true,
    eventsAreDisplayed: true,
  }
}

  componentDidMount() {
  }
  convertToText = (task, timestamp) => {
    let checkValue;
    if (task.isChecked) {
      checkValue = false
    } else {
      checkValue = true
    }
    let valueForEncryption = `{"uuid": "${task.uuid}", "text": "${task.text}", "list": "${task.list}", "isChecked": ${checkValue}, "isFavourite": ${task.isFavourite}, "reminder": "${task.reminder}", "updated": "${timestamp}"}`;
    return valueForEncryption;
  }
  convertToText2 = (task, timestamp) => {
    let favouriteValue;
    if (task.isFavourite) {
      favouriteValue = false
    } else {
      favouriteValue = true
    }
    let valueForEncryption = `{"uuid": "${task.uuid}", "text": "${task.text}", "list": "${task.list}", "isChecked": ${task.isChecked}, "isFavourite": ${favouriteValue}, "reminder": "${task.reminder}", "updated": "${timestamp}"}`;
    return valueForEncryption;
  }
  editTaskOnServer = (task) => {
    let dataForEncryption
    let encryptedData
    let checkValue;
    let timestamp = parse(new Date())

    if (task.isChecked) {
      checkValue = false
    } else {
      checkValue = true
    }
    if (this.props.tagName.shared == true) {

      this.props.findPassword(this.props.tagName.uuid).then(data => 
        encryptDataPromise(this.convertToText(task, timestamp), data.password).then(encResult => {
          this.props.editItem({uuid: task.uuid, data: encResult, updated: timestamp, type: "tasks", parrent: task.list, needSync: true}, {
            "uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": checkValue, "reminder": task.reminder, "isFavourite": task.isFavourite, "updated": timestamp
          }, this.props.tasks)
    })
      )} else {
        dataForEncryption = this.convertToText(task, timestamp);
        encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    
    
        this.props.editItem({uuid: task.uuid, data: encryptedData, updated: timestamp, type: "tasks", parrent: task.list, needSync: true}, {
          "uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": checkValue, "isFavourite": task.isFavourite, "reminder": task.reminder, "updated": timestamp
        }, this.props.tasks)
    }
   // this.props.forceUpdateCount()
  }
  renderTasks = (item) => {
   
    const normalText = {
      paddingLeft: 10,
  fontSize: 16,
  marginRight: 14,
  textAlign: "left",
  alignItems: "flex-start",
  color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
  alignSelf: "flex-start",
  justifyContent: "flex-start",
  fontFamily: 'Poppins-Regular', 
  includeFontPadding: false,
    }
    const markedText = {
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
      color: "#929390",
      paddingLeft: 10,
      fontSize: 16,
      marginRight: 14,
      textAlign: "left",
      alignItems: "flex-start",
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const checkBoxStyle = {
      width: "20%",
      height: "100%",
      flex: 1,
      justifyContent: "center",
      alignSelf: "flex-start",
      marginTop: 18,
      marginBottom: 18
    }
        return (
          <View>
          <View style={{flex:1, height: "auto", width: "100%",  borderBottomWidth: 0.2,
  borderBottomColor: "#515059",margin: 0, padding: 0, flexDirection: "row"}}>
    <TouchableNativeFeedback 
          onPress={() => { this.props.selectItem(item).then(() => {
            this.props.BottomSheetMenu.open()
          }) }}>
            <View style={{width: "100%", borderRadius: 8, margin: 0, padding: 0, flexDirection: "row"}}>
              <View style={{width: "85%"}}>
          {item.isChecked == "true"
          ? <View style={{ flexDirection: "row", padding: 14, alignItems: "center", width: "100%"}}>
          <View style={{ flex: 1,
justifyContent: "center",
alignSelf: "flex-start",
marginTop: 18,
marginBottom: 18, width: "15%",}}>
  <CheckBox color={this.props.darkTheme ? "#95A3A4" : "#0F0F0F"}  style={{ borderRadius: 15, width: 30, height: 30, marginRight: 14, backgroundColor: "#95A3A4", borderColor: this.props.darkTheme ? "#95A3A4" : "#95A3A4", color: this.props.darkTheme ? "#95A3A4" : "#95A3A4"}} onPress={() => {this.props.editTaskOnServer(item), this.props.forceUpdateCount()}}/>
  </View>
  <View style={{justifyContent: "flex-start", alignItems: "flex-start", width: "85%"}}>
    <Text style={markedText}>{item.text}</Text>
    {item.reminder
    ?<View style={{ position: "absolute", top: 23, left: 10,   padding: 0, flexDirection: "row", alignItems: "center", width: WIDTH - 10 }}>
      <Ionicons name="md-notifications" size={11} color="gray"/>
      <Text style={{ fontSize: 11, paddingLeft: 4, color: "gray", fontFamily: 'Poppins-Regular', includeFontPadding: false }}>
      {item.reminder.toString().slice(4,21)}
      </Text>
      </View>
      : null
    }
    </View>
    </View>
    :<View style={{ flexDirection: "row", padding: 14, alignItems: "center", width: "100%"}}>
      <View style={{ flex: 1,
  justifyContent: "center",
  alignSelf: "flex-start",
  marginTop: 18,
  marginBottom: 18, width: "15%",}}>
<CheckBox color="mintcream" style={{borderRadius: 15, width: 30, height: 30, marginRight: 14, borderWidth: 0.5, color: "#95A3A4", borderColor: "#95A3A4", }}  onPress={() => {this.props.editTaskOnServer(item), this.props.forceUpdateCount}}/>
</View>
<View style={{justifyContent: "flex-start", alignItems: "flex-start", width: "85%"}}>
  <Text style={normalText}>{item.text}</Text>
  {item.reminder
  ? <View style={{ position: "absolute", top: 23, left: 10,   padding: 0, flexDirection: "row", alignItems: "center", width: WIDTH - 10 }}>
    <Ionicons name="md-notifications" size={11} color="gainsboro"/>
      <Text style={{ fontSize: 11, paddingLeft: 4, color:"gainsboro", fontFamily: 'Poppins-Regular', includeFontPadding: false }}>
      {item.reminder.toString().slice(4,21)}
      </Text>
      </View>
    : null
    }
    </View>
    </View>
  }
  </View>
{item.isFavourite == "true"
          ? <View style={{ width: "15%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
            {item.isChecked == "true"
            ? <Ionicons name="md-star" size={26} color="#95A3A4"/>
            :<Ionicons name="md-star" size={26} color="gainsboro"/>
            }
          </View>
          : null
          }
</View>
</TouchableNativeFeedback>
</View>
</View>
)
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
  renderEvents = (item, daysAlreadyUsed) => {
    const twoColumnStyle = {
      flexDirection: "row",
      flex: 1,
    }
    const leftColumnStyle = {
      width: "25%",
      justifyContent: "center",
      alignItems: "center",
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
    
    return <View style={{ flex: 1, alignItems: "center" }}>
    {this.formatDates(item.dateFrom, item.dateTill, daysAlreadyUsed)}
    <TouchableNativeFeedback 
onPress={() => { this.props.selectItem(item).then(() => {
this.props.BottomSheetMenu.open()
})  }}
>
<View style={{display: "flex",  width: "100%", borderBottomWidth: 0.2, borderBottomColor: "gray", margin: 0, padding: 14, flexDirection: "row"}}>
<View style={{ width: "100%", height: 60,}}>
<View style={twoColumnStyle}>   
<View style={leftColumnStyle}>
<View style={{height: 30,
  width: 30,
  borderRadius: 15, backgroundColor: this.getCalendarColor(item)}}>
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
            ? <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
              <Ionicons name="md-star" size={26} color="gainsboro"/>
            </View>
            : <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}/>
            }
          </View>
        </View>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>
  }
        

  renderNotes = (note) => {
    const noteBox = {
      padding: 14,
      borderRadius: 8,
      flexDirection: "row",
      flex: 1

    }
    const noteTitle = {
      fontFamily: 'Poppins-Bold', 
      includeFontPadding: false,    
    }
    const noteBody = {

    }
    const noteTextTitle = {
      color: this.props.darkTheme ? "mintcream" : "licorice",
      fontSize: 20,
      padding: 8,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const noteTextBody = {
      color: this.props.darkTheme ? "mintcream" : "licorice",
      fontSize: 14,
      padding: 8,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,

    }
    return <View style={{flex:1, height: "auto", width: "100%",  borderBottomWidth: 0.2,
    borderBottomColor: "#515059",margin: 0, padding: 0, flexDirection: "row"}}>
    <TouchableNativeFeedback 
onLongPress={() => {this.props.selectItem(note).then(() => {
  this.props.BottomSheetMenu.open()
})
}}
onPress={() => { NavigationService.navigate('NoteDetails', { text: note.text, uuid: note.uuid, title: note.title, notebook: note.notebook, type: "notes", updated:note.updated })  }}
background={TouchableNativeFeedback.Ripple('gray', false)}
>
    <View style={noteBox}>
    <View style={{width: "80%"}}>
    <View style={noteTitle}>
    <Text style={noteTextTitle}>
    {note.title.length === 0
    ? "..."
    : note.title
    }
    </Text>
    </View>
    <View style={noteBody}>
    <Text style={noteTextBody}>
    {note.text.length === 0
    ? "..."
    : note.text
    }
    </Text>
    </View>
    </View>
    {note.isFavourite == "true"
        ? <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
        <Ionicons name="md-star" size={26} color="gainsboro"/>
        </View>
        : null
        }
    </View>
    </TouchableNativeFeedback>
    </View>
  }


  renderData = () => {
    let tasksDisplayed = false

    return this.props.data.map(item => {
      if (item.list) {

     return this.renderTasks(item)
        
      } else if (item.notebook) {
        return this.renderNotes(item)
      } else if (item.calendar) {
        return this.renderEvents(item, daysAlreadyUsed)
      }
    })
  }
  renderTasksData = () => {
    return this.props.data.tasks.map(item => {
      return this.renderTasks(item)
    })
  }
  renderEventsData = (daysAlreadyUsed) => {
    return this.props.data.events.map(item => {
      return this.renderEvents(item, daysAlreadyUsed)
    })
  }
  renderNotesData = () => {
    return this.props.data.notes.map(item => {
      return this.renderNotes(item)
    })
  }
  triggerTasks = () => {
    this.state.tasksAreDisplayed
    ? this.setState({ tasksAreDisplayed: false })
    : this.setState({ tasksAreDisplayed: true })
  }
  
  triggerNotes = () => {
    this.state.notesAreDisplayed
    ? this.setState({ notesAreDisplayed: false })
    : this.setState({ notesAreDisplayed: true })
  }
  triggerEvents = () => {
    this.state.eventsAreDisplayed
    ? this.setState({ eventsAreDisplayed: false })
    : this.setState({ eventsAreDisplayed: true })
  }
  
  
                
  componentDidMount () {
  }
  render() {
    const cardBox = {
      width: "100%", padding: 14, minHeight: 50, height: "auto", borderRadius: 4, backgroundColor: "#202124", 
    }
    const titleText = {
      fontSize: 16,
      fontWeight: "bold",
      textAlign: "left",
      alignItems: "flex-start",
      color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const textStyle = {
      fontSize: 14,
      textAlign: "left",
      alignItems: "flex-start",
      color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const daysAlreadyUsed = []
    const boldTextStyle =  {
      fontSize: 22,
      fontFamily: "Poppins-Bold",
      color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
      paddingRight: 8
    }
    return (
    <View style={{ flex: 1, width: WIDTH }}>
    <ScrollView
        data={this.props.data}
        style={{flex: 1}}>
      {this.props.data.tasks.length > 0
      ?       <View style={{ width: "100%", paddingTop: 10, paddingLeft: 8, paddingRight: 8}}>
       <TouchableNativeFeedback
        onPress={() => this.triggerTasks()}
        >
            <View style={cardBox}>
            <View style={{width: "100%", paddingBottom: 6, flexDirection: "row"}}>

       <View style={{width: "80%", flexDirection: "row"}}>
          <Text style={boldTextStyle}>Tasks</Text>
          </View>
        <View style={{width: "20%", justifyContent: "center", alignItems: "center"}}>
          {this.state.tasksAreDisplayed
          ?<Ionicons name="md-arrow-dropup" size={36} color={this.props.darkTheme ? "white" : "black"} />
          :<Ionicons name="md-arrow-dropdown" size={36} color={this.props.darkTheme ? "white" : "black"} />
          }
          </View>
          </View>

          {this.state.tasksAreDisplayed
      ? this.renderTasksData()
      : null
      }
      </View>
      </TouchableNativeFeedback>
     
        </View>
      : null
      }
       {this.props.data.events.length > 0
      ? <View style={{ width: "100%", paddingTop: 10, paddingLeft: 8, paddingRight: 8}}>
       <TouchableNativeFeedback
        onPress={() => this.triggerEvents()}
        >         
               <View style={cardBox}>
   
        <View style={{width: "100%", paddingBottom: 6, flexDirection: "row"}}>
        <View style={{width: "80%"}}>
        <Text style={boldTextStyle}>Events</Text>
        </View>
        <View style={{width: "20%", justifyContent: "center", alignItems: "center"}}>
          {this.state.eventsAreDisplayed
          ?<Ionicons name="md-arrow-dropup" size={36} color={this.props.darkTheme ? "white" : "black"} />
          :<Ionicons name="md-arrow-dropdown" size={36} color={this.props.darkTheme ? "white" : "black"} />
          }
                    </View>

          </View>
          {this.state.eventsAreDisplayed
      ? this.renderEventsData(daysAlreadyUsed)
      : null
      }
      </View>
      </TouchableNativeFeedback>


        </View>
      : null
      }
       {this.props.data.notes.length > 0
      ? <View style={{ width: "100%", paddingTop: 10, paddingLeft: 8, paddingRight: 8}}>
         
                  <View style={cardBox}>
                  <TouchableNativeFeedback
        onPress={() => this.triggerNotes()}
        >
            <View style={{width: "100%", paddingBottom: 6, flexDirection: "row"}}><View style={{width: "80%"}}>
       <Text style={boldTextStyle}>Notes</Text>
        </View>
        <View style={{width: "20%", justifyContent: "center", alignItems: "center"}}>
          {this.state.notesAreDisplayed
          ?<Ionicons name="md-arrow-dropup" size={36} color={this.props.darkTheme ? "white" : "black"} />
          :<Ionicons name="md-arrow-dropdown" size={36} color={this.props.darkTheme ? "white" : "black"} />
          }

          </View>
          </View>

          </TouchableNativeFeedback>
{this.state.notesAreDisplayed
  ? this.renderNotesData()
  : null
  }
      </View>
      
        </View>
      : null
      }
      </ScrollView>
    </View>
    )
  }
}
class DataFiltered extends React.Component {
  render () {
    return (
      <View>
      {this.props.data
      ?<DataView
      data={this.props.data}
      darkTheme={this.props.darkTheme}
      calendars={this.props.calendars}
      saveNewItem={this.props.saveNewItem}
      cryptoPassword={this.props.cryptoPassword}
      selectItem={this.props.selectItem}
      BottomSheetMenu={this.props.BottomSheetMenu}
      tagName={this.props.tagName}
      editItem={this.props.editItem}/>
      :<View style={{ flex: 1, justifyContent: "center", width: "100%", height: HEIGHT - 140}}><Text style={{ fontSize: 20, textAlign: "center", color: this.props.darkTheme ? "mintcream" : "#0F0F0F", fontFamily: 'Poppins-Regular', includeFontPadding: false }}>Nothing new</Text></View>}</View>)
  }
}


export default class FavouritesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };


handleBackPress =  () => {
  NavigationService.navigate('Home')
}

  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme

    return (
      <Container>
           <Header 
        style={headerStyle}
        >
             <StatusBar backgroundColor={this.props.screenProps.colors.surface } barStyle={darkTheme ? "light-content" : "dark-content"} />
           <Left>
          <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="arrow-left" color={this.props.screenProps.colors.gray } headerFunction={() => {
        this.handleBackPress()
        }} />
            </Left>
          <Body>
          <Title style={{color: this.props.screenProps.colors.text,fontFamily: 'Poppins-Bold', fontWeight: "bold", includeFontPadding: false,padding: 0, margin: 0, fontSize: 26}}>Favourites</Title>
          </Body>
          <Right>
          <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="arrow-left" color="transparent" headerFunction={() => {
        }} />
          </Right>
</Header>
<View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface }}>
      {this.props.navigation.state.params
      ? <DataView 
      data={this.props.navigation.state.params}
      calendars={this.props.screenProps.calendars}
      darkTheme={this.props.screenProps.darkTheme}
      saveNewItem={this.props.screenProps.saveNewItem}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      selectItem={this.props.screenProps.selectItem}
      tagName={this.props.screenProps.tagName}
      editItem={this.props.screenProps.editItem}
      colors={this.props.screenProps.colors}
      />
      : null
      }
      </View>
      </Container>
    );
  }
}

module.exports = FavouritesScreen;