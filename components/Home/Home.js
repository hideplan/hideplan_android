import React from "react";
//import "./Register.css";
import { DrawerLayoutAndroid, ViewPagerAndroid, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Menu from '../../Menu.js';

import { HeaderIcon, FabIcon } from '../../customComponents.js';
import { Toast } from '../../customComponents.js';
import { Button, Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading, SwipeRow } from 'native-base';
import { DrawerActions } from 'react-navigation';
import { decryptData, encryptData } from '../../encryptionFunctions';
import { createId } from '../../functions';
import Drawer from '../../drawer/Drawer.js';
import { BottomSheet, BottomSheetExpanded } from '../../bottomSheet/BottomSheet.js';

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class MenuDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      needUpdate: false,
     }
  }
 
  render() {
    const drawerStyle = {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }
    const drawerBody = {
      padding: 10
    }
    const drawerCol = {
      width: WIDTH /5 * 4,
      flexDirection: "column",
    }
    const drawerRowSelected = {
      width: WIDTH /5 * 4,
      backgroundColor: "gray",
      flexDirection: "row",
      padding: 10,
      alignItems: "center",
      paddingLeft: 15,

    }
    const drawerRow = {
      width: WIDTH /5 * 4,
      flexDirection: "row",
      padding: 10,
      paddingLeft: 15,

      alignItems: "center"
    }
    const drawerIcon = {
      width: 40,
    }
    const drawerText = {
      width: WIDTH /5 * 3,
      marginRight: 20,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textStyle = {
      color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textGrayStyle = {
      color: "gray",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    return (
      <View style={drawerStyle}>
      <ScrollView
       ref={ref => {
        this.Scroll = ref;
      }}
      >
      <View style={drawerBody}>
      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToSettings(), this.props.closeDrawer() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-settings" size={26} color={this.props.darkTheme ? "mintcream" : "#0F0F0F"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Settings</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>

</ScrollView>
      </View>
    )
  }
}
class Badge extends React.Component {

  render() {

    const badgeCircle = {
      width: 22, 
      height: 22, 
      borderRadius: 11, 
      justifyContent: "center", 
      alignItems: "center", 
      backgroundColor: this.props.darkTheme ? "mintcream" : "#0F0F0F"
      }
    const badgeText = {
      color: this.props.darkTheme ? "licorice" : "mintcream",
      fontSize: 18,
      fontFamily: 'Poppins-Bold', 
      includeFontPadding: false
    }
    return (
      <View style={badgeCircle}>
        <Text style={badgeText}>
          {this.props.text}
        </Text>
      </View>
    )
  }
}


class PasswordModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      private: true,
    };
  }

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }

  changePrivateState = () => {
    this.state.private
    ? this.setState({ private: false })
    : this.setState({ private: true })
  }

  render() {

    const wrapper = {
      display: "flex",
      position: "absolute",
      height: "100%",
      width: "100%",
      backgroundColor: "rgba(27, 23, 37, 0.473)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 20

    }

    const body = {
      padding: 20,
      backgroundColor: "#202526",
      display: "flex",
      width: (WIDTH / 3) * 2,
      position: "absolute",
      justifyContent: "center",
      top: HEIGHT / 8,
      borderRadius: 12,
      elevation: 5,
    }


    const textStyle = {
      color: "white",
      fontSize: 20,
      padding: 8,
      backgroundColor: "#373835",
      borderColor: "gray",
      borderRadius: 4,
      width: "100%",
      fontFamily: 'Poppins-Regular', includeFontPadding: false
        }


    const colorDot = {
      height: 10,
      width: 10,
      borderRadius: 5,
      color: ""
    }

    return (
        <View style={wrapper}>
          <TouchableWithoutFeedback>
            <View style={body}>
              <View style={{ display: "flex", width: "100%" }}>
                <Text style={{ color: "#D8D6D6", fontSize: 18, paddingBottom: 4,  }}>Add invites to list</Text>
                <TextInput
                  placeholderTextColor="gray"
                  style={textStyle}
                  autoFocus={true}
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChangeText={(username) => this.setState({ username })}
                />
              </View>
              <View style={{ display: "flex", justifyContent: "center" }}>

                <TouchableNativeFeedback>
                  <Button
                    style={{ color: "red" }}
                    color="#EF2647"
                    title="Save"
                    onPress={() => { this.props.saveList(this.state.listName, this.state.private) }}
                  />
                </TouchableNativeFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>

        </View>
    )
  }
}

class Invites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      passwordModalVisible: true,
    }
  }

  showPasswordModal = () => {
    this.state.passwordModalVisible
      ? this.setState({ passwordModalVisible: false })
      : this.setState({ passwordModalVisible: true })
  }

  decryptData = () => {
    let decryptedData = JSON.parse(decryptData(this.props.item.data, "nakupy"))
  }

  componentDidMount() {

    // Set day before, current and next day
  }

  savePassword = () => {
    let uuid2 = createId("passswords")
    let passObj = JSON.stringify({type: "lists", uuidShared: this.props.item.uuid, password: this.state.password})
    let encryptedPassword = encryptData(passObj, this.props.cryptoPassword)

    let timestamp = new Date().getTime()

    this.props.saveNewItem({
      "uuid": uuid2, "data": encryptedPassword, "updated": timestamp, "type": "passwords", "parrent": this.props.item.uuid, "shared": "true", "isLocal": "true"}, {"uuid": uuid2, "password": this.state.password, "list": "list", "uuidShare": this.props.item.uuid}, "passwords", "List created")
  }

    render() {
      const cardBoxOuter = {
        padding: 20,
        paddingBottom: 8,
        paddingTop: 8
      }
      const cardBoxInner = {
        backgroundColor: this.props.darkTheme ? "#17191d" : "gray",
        borderRadius: 8,
        padding: 6,
        elevation: 4
      }
      const boxTitle = {
  
      }
      const boxRow = {
        flexDirection: "row"
      }  

      const boxTextTitle = {
        color: this.props.darkTheme ? "white" : "black",
        fontSize: 20,
        padding: 8,
      }
      const noteTextBody = {
        color: this.props.darkTheme ? "white" : "black",
        fontSize: 18,
        padding: 8,
      }
  
      return (
   
        // Render dots under days with events
    
              <View style={cardBoxOuter}>

              <View style={cardBoxInner}>
              <View style={boxTitle}>
              <Text style={boxTextTitle}>
              You have invite from {this.props.item.username}
              </Text>
              </View>
              <View style={boxRow}>
              <TouchableNativeFeedback 
          onPress={() => { NavigationService.navigate('NoteDetails', { text: note.text, id: note.uuid, title: note.title, })  }}
          background={TouchableNativeFeedback.Ripple('gray', false)}
          >
              <Button iconLeft dark backgroundColor="red">
                <Icon name='trash' />
                <Text style={{color: "white"}}>Decline</Text>
              </Button>
              </TouchableNativeFeedback>
    
              <TouchableNativeFeedback 
          onPress={() => { this.showPasswordModal() }}
          background={TouchableNativeFeedback.Ripple('gray', false)}
          >
              <Button iconLeft dark backgroundColor="green">
                <Icon name='checkmark' />
                <Text style={{color: "white"}}>Accept</Text>
              </Button>
              </TouchableNativeFeedback>
              
              </View>
{this.state.passwordModalVisible
  ? <View style={{flexDirection: "column"}}>
  <View style={boxRow}>
  <TextInput
  placeholderTextColor="gray"
  placeholder="Type password for shared list"
  style={{color: "white"}}
  type="text"
  name="password"
  value={this.state.password}
  onChangeText={(password) => this.setState({ password })}/>
  </View>
  
            <Button onPress={() => this.savePassword()} 
            dark backgroundColor="green">
                <Text style={{color: "white"}}>Save</Text>
              </Button>
              
              </View>
  : null
  }
 

              </View>

              </View>    
      )
    }
  }
   
function formatTime(dateFrom, dateTill) {
  let timeFrom = dateFrom.slice(16, 18) + "." + dateFrom.slice(19, 21)
  let timeTill = dateTill.slice(16, 18) + "." + dateTill.slice(19, 21)

  return <Text style={{fontSize: 17,
    textAlign: "center",
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
        let timestamp = new Date().getTime()
    
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
          fontSize: 18,
          marginRight: 14,
          textAlign: "left",
          color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
          alignSelf: "center",
          fontFamily: 'Poppins-Regular', 
          includeFontPadding: false,
        }
        const markedText = {
          paddingLeft: 10,
          marginRight: 14,
          fontSize: 18,
          textAlign: "left",
          alignSelf: "center",
          textDecorationLine: 'line-through',
          textDecorationStyle: 'solid',
          color: "#929390",
          fontFamily: 'Poppins-Regular', 
          includeFontPadding: false
        }
        
            return (
  
              <View style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>

              <TouchableNativeFeedback 
onPress={() => { this.props.BottomSheetMenu.open(), this.props.selectItem(item) }}

>
 <View style={{height: 60, width: "100%", borderRadius: 8,backgroundColor: this.props.darkTheme ? "#515059" : "lightgray", margin: 0, padding: 0, flexDirection: "row"}}>
 <View style={{width: "80%"}}>

{item.isChecked 
? <View style={{flexDirection: "row", padding: 14, alignItems: "center", width: "80%"  }}>
<CheckBox color={this.props.darkTheme ? "#95A3A4" : "#0F0F0F"}  style={{ borderRadius: 15, width: 30, height: 30, marginRight: 14, backgroundColor: "#95A3A4", borderColor: this.props.darkTheme ? "#95A3A4" : "#95A3A4", color: this.props.darkTheme ? "#95A3A4" : "#95A3A4"}} onPress={() => {this.editTaskOnServer(item)}}/>
<View style={{justifyContent: "center"}}>
<Text numberOfLines = {1} style={markedText}>{item.text}</Text>

{item.reminder
? 
<View style={{ position: "absolute", top: 23, left: 10,   padding: 0, flexDirection: "row", alignItems: "center", width: WIDTH - 10 }}>
<Ionicons name="md-notifications" size={11} color="gray"/>

<Text style={{ fontSize: 11, paddingLeft: 4, color: "gray", fontFamily: 'Poppins-Regular', includeFontPadding: false }}>
{item.reminder.toString().slice(4,21)}
</Text>
</View>
: null
}  
</View>

</View>
:<View style={{ flexDirection: "row", padding: 14, alignItems: "center", }}>

            
<CheckBox color="mintcream" style={{borderRadius: 15, width: 30, height: 30, marginRight: 14, borderWidth: 0.5, color: "#95A3A4", borderColor: "#95A3A4" }}  onPress={() => {this.editTaskOnServer(item)}}/>
<View style={{justifyContent: "center"}}>

<Text numberOfLines = {1} style={normalText}>{item.text}</Text>
{item.reminder
? 
<View style={{ position: "absolute", top: 23, left: 10,   padding: 0, flexDirection: "row", alignItems: "center", width: WIDTH - 10 }}>
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

{item.isFavourite
?           <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
{item.isChecked
? <Ionicons name="md-star" size={26} color="#95A3A4"/>
:<Ionicons name="md-star" size={26} color="gainsboro"/>
}

</View>
: null
}

</View>

</TouchableNativeFeedback>

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
        
        return            <View style={{ flex: 1, alignItems: "center" }}>

        {this.formatDates(item.dateFrom, item.dateTill, daysAlreadyUsed)}
<View style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>

        <View style={{ width: "100%", height: 60, borderRadius: 12, backgroundColor: this.props.darkTheme ? "#515059" : "silver",
          }}>
        
        <TouchableNativeFeedback
onPress={() => { this.props.selectItem(item), this.props.BottomSheetMenu.open()} }
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
             
      renderInvites = (data) => {
        return data.map(item => {
        return <Invites 
        darkTheme={this.props.darkTheme}
        item={item} 
        saveNewItem={this.props.saveNewItem}
        cryptoPassword={this.props.cryptoPassword}
        />
        }
        )
      }

      renderNotes = (note) => {
        const noteBox = {
          padding: 4,
          borderRadius: 8,
          backgroundColor: this.props.darkTheme ? "#515059" : "gainsboro",
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
          fontSize: 16,
          padding: 8,
          fontFamily: 'Poppins-Regular', 
          includeFontPadding: false,
    
        }
        return       <View style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>

        <TouchableNativeFeedback 
    onLongPress={() => {this.props.selectItem(note),
      this.props.BottomSheetMenu.open()
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
        <Text numberOfLines = {1} style={noteTextBody}>
        {note.text.length === 0
        ? "..."
        : note.text
        }
       
        </Text>
        </View>
        </View>
        {note.isFavourite
            ?             <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
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
            style={{flex: 1}}
        >
          {this.props.invites.length > 0
          ? this.renderInvites(this.props.invites)
          : null
          }
        
          {this.props.data.tasks.length > 0
          ? <View style={{width: "100%"}}>
           <TouchableNativeFeedback
            onPress={() => this.triggerTasks()}
            ><View style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 16,
            marginLeft: 16,
            marginRight: 16
          }}>
                     
            
           <View style={{width: "80%", flexDirection: "row"}}>
              <Text style={boldTextStyle}>Tasks</Text>
              </View>
              {/*
              this.state.tasksAreDisplayed
                        : <View style={{width: "80%", flexDirection: "row", justifyContent: "center"}}>
              <Text style={boldTextStyle}>Tasks</Text>
              <Badge 
                darkTheme={this.props.darkTheme}
                text={this.props.data.tasks.length}
              />
              </View>
            }
              */}

              
            
  
            <View style={{width: "20%", justifyContent: "center", alignItems: "center"}}>
              {this.state.tasksAreDisplayed
              ?<Ionicons name="md-arrow-dropup" size={36} color={this.props.darkTheme ? "white" : "black"} />
              :<Ionicons name="md-arrow-dropdown" size={36} color={this.props.darkTheme ? "white" : "black"} />
              }
              
              </View>

          </View>
          </TouchableNativeFeedback>

          {this.state.tasksAreDisplayed
          ? this.renderTasksData()
          : null
          }
            </View>
          : null
          }
           {this.props.data.events.length > 0
          ? <View style={{width: "100%"}}>
           <TouchableNativeFeedback
            onPress={() => this.triggerEvents()}
            ><View style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 16,
            marginLeft: 16,
            marginRight: 16
          }}>
                     
            <View style={{width: "80%"}}>
            <Text style={boldTextStyle}>Events</Text>
            {/*
 {this.state.eventsAreDisplayed
            ? <Text style={boldTextStyle}>Events</Text>
            : <Text style={boldTextStyle}>Events ({this.props.data.events.length})</Text>
            }
            */}
              
            </View>
  
            <View style={{width: "20%", justifyContent: "center", alignItems: "center"}}>
              {this.state.eventsAreDisplayed
              ?<Ionicons name="md-arrow-dropup" size={36} color={this.props.darkTheme ? "white" : "black"} />
              :<Ionicons name="md-arrow-dropdown" size={36} color={this.props.darkTheme ? "white" : "black"} />
              }
              
              </View>

          </View>
          </TouchableNativeFeedback>

          {this.state.eventsAreDisplayed
          ? this.renderEventsData(daysAlreadyUsed)
          : null
          }
            </View>
          : null
          }
           {this.props.data.notes.length > 0
          ? <View style={{width: "100%"}}>
             <TouchableNativeFeedback
            onPress={() => this.triggerNotes()}
            >
          <View style={{
            flex: 1,
            flexDirection: "row",
            marginTop: 16,
            marginLeft: 16,
            marginRight: 16
          }}><View style={{width: "80%"}}>
           <Text style={boldTextStyle}>Notes</Text>
              {/*
 {this.state.notesAreDisplayed
            ? <Text style={boldTextStyle}>Notes</Text>
            : <Text style={boldTextStyle}>Notes ({this.props.data.notes.length})</Text>
            }
              */}
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
          : null
          }
        </ScrollView>
                         </View>


        )
    
      }
    }
  
  
class HomeContent extends React.Component {
  
    filterFavourites = () => {
      let favouriteEvents = this.props.events.filter(item => {
        return item.isFavourite
      })
      let favouriteTasks = this.props.tasks.filter(item => {
        return item.isFavourite
      })
      let favouriteNotes = this.props.notes.filter(item => {
        return item.isFavourite
      })
      let data = {events: favouriteEvents, tasks: favouriteTasks, notes: favouriteNotes}
      return data
    }
    /*
    <Invites 
                  darkTheme={this.props.darkTheme}
                  item={item} 
                  saveNewItem={this.props.saveNewItem}
                  cryptoPassword={this.props.cryptoPassword}
                  />
                  */

    render() {
      const data = this.filterFavourites()
      return (
        <View style={{ flex: 1, width: WIDTH}}>
          {data.events.length > 0 || data.tasks.length > 0 || data.notes.length > 0

          ?<DataView 
          data={data}
          darkTheme={this.props.darkTheme}
          calendars={this.props.calendars}
          invites={this.props.invites}
          saveNewItem={this.props.saveNewItem}
          cryptoPassword={this.props.cryptoPassword}
          selectItem={this.props.selectItem}
          BottomSheetMenu={this.props.BottomSheetMenu}
          tagName={this.props.tagName}
          editItem={this.props.editItem}
          />
        
          : <View style={{ flex: 1, justifyContent: "center", width: "100%", height: HEIGHT - 140}}>
          <Text style={{ fontSize: 20, textAlign: "center", color: this.props.darkTheme ? "mintcream" : "#0F0F0F", fontFamily: 'Poppins-Regular', includeFontPadding: false }}>
            Nothing new
        </Text>
        </View> 
          }
         
         
        </View>
      )
  
    }
  }




export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
    }
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };
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
    deleteItem = (item) => {
      let itemObj = {...item, ...{type: "tasks"}}
      this.props.screenProps.deleteItem(itemObj)
    }
    deleteAlert = (taskName, item) => {
      Alert.alert(
        'Delete task',
        `Do you want to delete task "${taskName}"?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => {this.deleteItem(item)},
          }
          ],
      );
    }
    convertToText2 = (item, timestamp) => {
      let favouriteValue;
      let valueForEncryption
      if (item.isFavourite) {
        favouriteValue = false
      } else {
        favouriteValue = true
      }
      if (item.list) {
        valueForEncryption = `{"uuid": "${item.uuid}", "text": "${item.text}", "list": "${item.list}", "isChecked": ${item.isChecked}, "isFavourite": ${favouriteValue}, "reminder": "${item.reminder}", "updated": "${timestamp}"}`;
      }
      else if (item.calendar) {
        valueForEncryption = `{"uuid": "${item.uuid}", "dateFrom": "${item.dateFrom.toString()}", "dateTill": "${item.dateTill.toString()}", "text": "${item.text}", "location": "${item.location}", "notes": "${item.notes}", "reminder": "${item.reminder}", "calendar": "${item.calendar}", "repeat": "${item.repeat}", "repeated": "${item.repeated}", "isFavourite": "${favouriteValue}"}`
      }
      return valueForEncryption;
    }
    triggerFavourite = (item) => {
      let dataForEncryption
      let encryptedData
      let isFavourite;
      let timestamp = new Date().getTime()
  
      if (item.isFavourite) {
        isFavourite = false
      } else {
        isFavourite = true
      }
      if (item.list) {
        if (this.props.screenProps.tagName.shared == true) {
  
          this.props.screenProps.findPassword(this.props.screenProps.tagName.uuid).then(data => 
            encryptDataPromise(this.convertToText2(item, timestamp), data.password).then(encResult => {
              this.props.screenProps.editItem({uuid: item.uuid, data: encResult, updated: timestamp, type: "tasks", parrent: item.list, needSync: true}, {
                "uuid": item.uuid, "text": item.text, "list": item.list, "isChecked": item.isChecked, "isFavourite": isFavourite, "reminder": item.reminder, "updated": timestamp
              }, this.props.screenProps.tasks)
        })
          )} else {
            dataForEncryption = this.convertToText2(item, timestamp);
            encryptedData = encryptData(dataForEncryption, this.props.screenProps.cryptoPassword);
        
        
            this.props.screenProps.editItem({uuid: item.uuid, data: encryptedData, updated: timestamp, type: "tasks", parrent: item.list, needSync: true}, {
              "uuid": item.uuid, "text": item.text, "list": item.list, "isChecked": item.isChecked, "isFavourite": isFavourite, "reminder": item.reminder, "updated": timestamp
            }, this.props.screenProps.tasks)
        }
      } else if (item.calendar) {
        dataForEncryption = this.convertToText2(item, timestamp);
        encryptedData = encryptData(dataForEncryption, this.props.screenProps.cryptoPassword);
    
    
        this.props.screenProps.editItem({uuid: item.uuid, data: encryptedData, updated: timestamp, type: "events", parrent: item.calendar, needSync: true}, {"uuid": item.uuid, "dateFrom": item.dateFrom.toString(), "dateTill": item.dateTill.toString(), "text": item.text, "location": item.location, "notes": item.notes, "reminder": item.reminder, "calendar": item.calendar, "repeat": item.repeat, "repeated": item.repeated, "isFavourite": isFavourite
        }, this.props.screenProps.events)
      }
     
    }

    selectItem = (item) => {
      this.setState({ selectedItem: item })
    }
    renderEditButton = (item) => {
      if (item.list) {
      return <TouchableNativeFeedback 
      onPress={() => {this.BottomSheetMenu.close(), NavigationService.navigate('EditTask', item)}}>
      <View style={{  width: "100%",
    flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
    <View style={{width: "10%", justifyContent: "center"}}>
      <Ionicons name="md-create" size={26} color={this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F"} />
      </View>
      <View style={{width: "90%", justifyContent: "center"}}>
      <Text style={{ color: this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F",
    fontSize: 16,
    fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Edit task</Text>
   
      </View>
      </View>
     
      </TouchableNativeFeedback>
      } else if (item.calendar) {
        return <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), NavigationService.navigate('EditEvent', item)}}>
           <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-create" size={26} color={this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
        <Text style={{ color: this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Edit event</Text>
     
        </View>
        </View>
       
        </TouchableNativeFeedback>
      } else if (item.notebook) {
        return <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), NavigationService.navigate('NoteDetails', item)}}>
           <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-create" size={26} color={this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
        <Text style={{ color: this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Edit note</Text>
     
        </View>
        </View>
       
        </TouchableNativeFeedback>
      }
    }
    deleteItem = (item) => {
      let itemType
      if (item.list) {
        itemType = "tasks"
      } else if (item.calendar) {
        itemType = "events"
      } else if (item.notebook) {
        itemType = "notes"
      }
      let itemObj = {...item, ...{type: itemType}}
      this.props.screenProps.deleteItem(itemObj)
    }
    deleteAlert = (taskName, item) => {
      let itemType
      if (item.list) {
        itemType = "task"
      } else if (item.calendar) {
        itemType = "event"
      } else if (item.notebook) {
        itemType = "note"
      }
      Alert.alert(
        'Delete task',
        `Do you want to delete ${itemType} "${taskName}"?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => {this.deleteItem(item)},
          }
          ],
      );
    }
    renderDeleteButton = (item) => {
      if (item.list) {
      return       <TouchableNativeFeedback 
      onPress={() => {this.BottomSheetMenu.close(), this.deleteAlert(item.text, item)}}>     
                   <View style={{  width: "100%",
    flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
    <View style={{width: "10%", justifyContent: "center"}}>
      <Ionicons name="md-trash" size={26} color={this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F"} />
      </View>
      <View style={{width: "90%", justifyContent: "center"}}>
      <Text style={{ color: this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F",
    fontSize: 16,
    fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Delete task</Text>
   
      </View>
      </View>
     
      </TouchableNativeFeedback>
      } else if (item.calendar) {
        return <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), this.deleteAlert(item.text, item)}}>     
                     <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-trash" size={26} color={this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
        <Text style={{ color: this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Delete event</Text>
     
        </View>
        </View>
       
        </TouchableNativeFeedback>
      } else if (item.notebook) {
        return <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), this.deleteAlert(item.title, item)}}>     
                     <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-trash" size={26} color={this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
        <Text style={{ color: this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Delete note</Text>
     
        </View>
        </View>
       
        </TouchableNativeFeedback>
      }
    }
  
    closeDrawer = () => {
      this.refs.drawer.close()
    };
    openDrawer = () => {
      this.refs.drawer.open()
    };
    componentDidMount() {
    }
    renderDrawer = () => {
      return (
        <View>
          <Text>I am in the drawer!</Text>
        </View>
      );
    };
 
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.darkTheme ? '#17191d' : "#F7F5F4",
      color: this.props.screenProps.darkTheme ? 'white' : "black",
      elevation: 0
    }
    const navigationView = (<View style={{flex:1}}></View>)
    const darkTheme = this.props.screenProps.darkTheme
    return (
      <View style={{flex: 1}}>
      <Header 
      style={headerStyle}
      >
                    <StatusBar backgroundColor={darkTheme ? "#17191d" : "mintcream"} barStyle={darkTheme ? "light-content" : "dark-content"} />

                    <Left>
            <TouchableNativeFeedback
            onPress={() => {     this.Drawer.open()
            }}
            background={TouchableNativeFeedback.Ripple('gray', true)}
          >
            <View style={{ alignItems: "center" }}>
              <Ionicons name="md-menu" size={30} color={darkTheme ? 'mintcream' : "#0F0F0F"} />
            </View>
          </TouchableNativeFeedback>
       
          

            </Left>
        <Body>
        <Title style={{color: darkTheme ? "white" : "black",fontFamily: 'Poppins-Bold', padding: 0, margin: 0}}>Home</Title>
        </Body>
        <Right>
        <HeaderIcon headerIcon="md-search" color={this.props.screenProps.darkTheme ? "white" : "black"} headerFunction={() => {
        NavigationService.navigate('Search')
      }} />
          </Right>

</Header>
    <View style={{ flex: 1, backgroundColor: this.props.screenProps.darkTheme ? "#202124" : "#F7F5F4" }}>

      {this.props.screenProps.isLoadingData 
        ? <Text>Loading data</Text>
        :          <HomeContent
        events={this.props.screenProps.events}
        tasks={this.props.screenProps.tasks}
        notes={this.props.screenProps.notes}
        darkTheme={this.props.screenProps.darkTheme}
        calendars={this.props.screenProps.calendars}
        invites={this.props.screenProps.invites}
        saveNewItem={this.props.screenProps.saveNewItem}
        cryptoPassword={this.props.screenProps.cryptoPassword}
        BottomSheetMenu={this.BottomSheetMenu}
        selectItem={this.selectItem}
        findPassword={this.props.screenProps.findPassword}
        defaultList={this.props.screenProps.defaultList}
        editItem={this.props.screenProps.editItem}
        findPassword={this.props.screenProps.findPassword}
        deleteItem={this.props.screenProps.deleteItem}
        tagName={this.props.screenProps.tagName}
        />
        }
     
{this.props.screenProps.toastIsVisible
        ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} />
        : null
      }

    </View>
   
    <BottomSheet
          ref={ref => {
            this.BottomSheetMenu = ref;
          }}
          height={168}
          duration={200}
          closeOnSwipeDown={true}
          darkTheme={this.props.screenProps.darkTheme}
          customStyles={{
            container: {
              
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: this.props.darkTheme ? "#17191d" : "mintcream",
              elevation: 8
            }
          }}
        >
       <ScrollView style={{flex: 1, backgroundColor: this.props.screenProps.darkTheme ? "#17191d" : "mintcream", paddingTop: 10, paddingBottom: 10}}>
       <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), this.triggerFavourite(this.state.selectedItem) }}>
          <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-add" size={26} color={this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
         {this.state.selectedItem.isFavourite
        ?<Text style={{ color: this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Remove from favourites</Text>
      : <Text style={{ color: this.props.screenProps.darkTheme ? "mintcream" : "#0F0F0F",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Add to favourites</Text>
         }
        </View>
        </View>
       
        </TouchableNativeFeedback>
          {this.renderEditButton(this.state.selectedItem)}
          {this.renderDeleteButton(this.state.selectedItem)}
          </ScrollView>

        </BottomSheet>
        <Drawer
                    ref={ref => {
                      this.Drawer = ref;
                    }}
          height={120}
          heightExpanded={300}
          duration={250}
          closeOnSwipeDown={true}
          darkTheme={this.props.screenProps.darkTheme}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: this.props.screenProps.darkTheme ? "#17191d" : "mintcream",
              elevation: 4
            }
          }}
        >
          <View style={{flex:1,  elevation: 12, backgroundColor: this.props.screenProps.darkTheme ? "#1C1C1C" : "#F7F5F4", }}>
      {this.props.screenProps.lists && this.props.screenProps.tagName
      ?      <MenuDrawer
      ref={ref => {
        this.MenuDrawer = ref;
      }}
      darkTheme={this.props.screenProps.darkTheme}
      navigateToSettings={() => {NavigationService.navigate('Settings')}}
      closeDrawer={() => this.Drawer.close()}

    />
    : null
      }
      </View>
                    </Drawer>
   </View>

    );
  }
}


module.exports = HomeScreen;

