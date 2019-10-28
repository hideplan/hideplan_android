import React from "react";
//import "./Register.css";
import { Linking, DrawerLayoutAndroid,  View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays, isToday, isTomorrow } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {MenuItem} from '../Moduls/react-native-material-menu/src/Menu.js';

import {Menu} from '../Moduls/react-native-material-menu/src/Menu.js';
import { HeaderIcon, FabIcon } from '../../customComponents.js';
import { Toast } from '../../customComponents.js';
import { Button, Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading, SwipeRow } from 'native-base';
import { DrawerActions } from 'react-navigation';
import { decryptData, encryptData } from '../../encryptionFunctions';
import { createId } from '../../functions';
import MyDrawer from '../../drawer/Drawer.js';import { BottomSheet, BottomSheetExpanded } from '../../bottomSheet/BottomSheet.js';

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
      fontSize: 14,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textGrayStyle = {
      color: "gray",
      fontSize: 14,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    return (
    
      <View style={drawerBody}>
      {/*<TouchableNativeFeedback
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
      */}
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
      fontSize: 16,
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
                <Text style={{ color: "#D8D6D6", fontSize: 16, paddingBottom: 4,  }}>Add invites to list</Text>
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

    let timestamp = parse(new Date())

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
        backgroundColor: this.props.darkTheme
        ? this.props.colors.background.s700
        : this.props.colors.surface,        
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
        fontSize: 16,
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
              }) }}
             
              >
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

{item.isFavourite == "true"
              ?           <View style={{ width: "15%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
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
        
        return            <View style={{ flex: 1, alignItems: "center" }}>

        {this.formatDates(item.dateFrom, item.dateTill, daysAlreadyUsed)}
        <TouchableNativeFeedback 
onPress={() => { this.props.selectItem(item).then(() => {
  this.props.BottomSheetMenu.open()
})  }}

>
<View style={{display: "flex",  width: "100%", borderBottomWidth: 0.2, borderBottomColor: "gray", margin: 0, padding: 14, flexDirection: "row"}}>


<View style={{ width: "100%", height: 60, 
                }}>
                
        

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
                ?  <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
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
        return                <View style={{flex:1, height: "auto", width: "100%",  borderBottomWidth: 0.2,
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
  
  
  
    class HomeCard extends React.Component {

      setMenuRef = ref => {
        this._menu = ref;
      };
    
      hideMenu = () => {
        this._menu.hide();
      };
    
      showMenu = () => {
        this._menu.show();
      };
      renderMenuItems = () => {

        return (
          this.props.optionsMenu.map(item => {
        
      
            return (
              <MenuItem  onPress={() => item.func()}>
              <View style={{display: "flex", width: "100%", paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10}}>
              
              <Text 
                style={{color: this.props.colors.text, fontSize: 14 }}> 
                {item.text}
                </Text>
                </View>
                </MenuItem>
  
            )
          })
        )
      }
      render() {
        const cardBox = {
          width: "100%", padding: 14, minHeight: 50, height: "auto", borderRadius: 4, backgroundColor: this.props.darkTheme
          ? this.props.colors.background.s700
          : this.props.colors.surface,  elevation: 2,
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
        return (
          <View style={{ width: "100%", paddingTop: 10, paddingLeft: 8, paddingRight: 8}}>
            <TouchableNativeFeedback onPress={() => this.props.func() }>
            <View style={cardBox}>
              <View style={{width: "100%", paddingBottom: 6, flexDirection: "row"}}>
              <View style={{width: "80%", justifyContent: "flex-start", alignItems: "center", height: 30,}}>
                <Text style={titleText}>
                {this.props.title}
                </Text>
              </View>
              <View style={{width: "20%", flex: 1, justifyContent: "flex-end", alignItems: "flex-end", }}>
              {this.props.cardMenu
              ? 
              <View style={{
            borderRadius: 15,
            width: 30,
            color: this.props.color,
            height: 30,
            justifyContent: "center"}}>
              <TouchableNativeFeedback                     background={TouchableNativeFeedback.Ripple('gray', true)} onPress={() => this.showMenu()}>
              <View style={{ alignItems: "center" }}>

              <Ionicons name="md-more" size={24} color={this.props.darkTheme ? "mintcream" : "#0F0F0F"} />
              </View>

              </TouchableNativeFeedback>
              <Menu
      ref={this.setMenuRef}
      style={{ backgroundColor: this.props.darkTheme ? "#373E40" : "mintcream", elevation: 8, minWidth: 80, color: this.props.darkTheme ? "mintcream" : "#232323", border: this.props.darkTheme ? null : "solid 0.2px #676861", borderWidth: 0.4, borderColor: "#676861"
    }}
    >
     {this.renderMenuItems()}
    </Menu>
              </View>
              
              : null
              }
           
              </View>
              </View>
            {this.props.renderContent()}

          </View> 
          </TouchableNativeFeedback>
                   </View>


        )
    
      }
    }
  
  
class HomeContent extends React.Component {
  
    filterFavourites = () => {
      let favouriteEvents = this.props.events.filter(item => {
        return item.isFavourite == "true"
      })
      let favouriteTasks = this.props.tasks.filter(item => {
        return item.isFavourite == "true"
      })
      let favouriteNotes = this.props.notes.filter(item => {
        return item.isFavourite == "true"
      })
      let data = {events: favouriteEvents, tasks: favouriteTasks, notes: favouriteNotes}
      return data
    }
    filterUpcoming = () => {
      let eventsToday = []
      let eventsTomorrow = []
      let tasksToday = []
      let tasksTomorrow = []

      this.props.events.map(item => {
        if (isToday(item.dateFrom) && isFuture(item.dateFrom)) {
          eventsToday.push(item)
        } else if (isTomorrow(item.dateFrom)) {
          eventsTomorrow.push(item)
        }
      })
      this.props.tasks.map(item => {
        if (isToday(item.reminder) && isFuture(item.reminder)) {
          tasksToday.push(item)
        } else if (isTomorrow(item.reminder)) {
          tasksTomorrow.push(item)
        }
      })

      let firstEventsArray = () => {
        let items = eventsToday.sort((a, b) => {
        return getTime(a.dateFrom) - getTime(b.dateFrom)
      })
      return items[0]
    }
      let firstTaskArray = () => {
        let items = tasksToday.sort((a, b) => {
        return getTime(a.reminder) - getTime(b.reminder)
      })
      return items[0]
    }
    let firstEvent = firstEventsArray()
    let firstTask = firstTaskArray()
      let firstItem = (first, second ) => {
        if (first == undefined) {
          return second
        } else if (second == undefined) {
          return first
        } else if (first && second == undefined) {
          return ""
        }
        if (getTime(first.dateFrom) > getTime(second.reminder)) {
          return first
        } else if (getTime(first.dateFrom) < getTime(second.reminder)) {
          return second
        } else {
          return ""
        }
      }
      let todayAllData = eventsToday.concat(tasksToday).sort((a, b) => {
        return b.dateFrom ? getTime(b.dateFrom) : getTime(b.reminder) - a.dateFrom ? getTime(a.dateFrom) : getTime(a.reminder)
      })
      let tomorrowAllData = eventsTomorrow.concat(tasksTomorrow).sort((a, b) => {
        return b.dateFrom ? getTime(b.dateFrom) : getTime(b.reminder) - a.dateFrom ? getTime(a.dateFrom) : getTime(a.reminder)
      })
      let data = {events: {today: eventsToday, tomorrow: eventsTomorrow}, tasks: {today: tasksToday, tomorrow: tasksTomorrow}, firstItem: firstItem(firstEvent, firstTask), todayAll: todayAllData, tomorrowAll: tomorrowAllData}
      return data
    }

    render() {
      const normalText = {
        fontSize: 16,
        textAlign: "left",
        alignItems: "flex-start",
        color: this.props.colors.text,
        alignSelf: "flex-start",
        justifyContent: "flex-start",
        fontFamily: 'Poppins-Regular', 
        includeFontPadding: false,
        
      }
      const colorText = {
        fontSize: 16,
        textAlign: "left",
        alignItems: "flex-start",
        color: this.props.colors.primary,
        alignSelf: "flex-start",
        justifyContent: "flex-start",
        fontFamily: 'Poppins-Regular', 
        includeFontPadding: false,
        
      }
      const biggerText = {
        fontSize: 18,
        textAlign: "left",
        alignItems: "flex-start",
        color: this.props.colors.text,
        alignSelf: "flex-start",
        justifyContent: "flex-start",
        fontFamily: 'Poppins-Regular', 
        includeFontPadding: false,
      }
      const data = this.filterFavourites()
      const upcomingData = this.filterUpcoming()
      return (
        <View style={{ flex: 1, width: WIDTH}}>


          {this.props.plansSettings && upcomingData
          ? <HomeCard 
            title="Briefing"
            darkTheme={this.props.darkTheme}
            primaryColor={this.props.primaryColor}
            colors={this.props.colors}
            data={upcomingData}
            func={() => {NavigationService.navigate('Plans', upcomingData)}}
            cardMenu={"Yes"}
            optionsMenu={[{text: "Turn off briefing", func: () => {this.props.triggerHomeSettings("plansSettings", this.props.plansSettings)}}]}
            renderContent={() => {
              return (
                <View style={{width: "100%", flexDirection: "column"}}>
                <View style={{width: "100%", flexDirection: "row"}}>
          
          <Text style={biggerText}>Today: </Text>
          <Text style={normalText}>
            {upcomingData.events.today.length + " event"}
            {upcomingData.events.today.length > 1 || upcomingData.events.today.length == 0
            ? "s, " 
            : ", "
            } 
             {upcomingData.tasks.today.length + " task"}
            {upcomingData.tasks.today.length > 1 || upcomingData.tasks.today.length == 0
            ? "s" 
            : null
            } 
            </Text>
            </View>
            <View style={{width: "100%", flexDirection: "row"}}>
          
          <Text style={biggerText}>Tomorrow: </Text>
          <Text style={normalText}>
            {upcomingData.events.tomorrow.length + " event"}
            {upcomingData.events.tomorrow.length > 1 || upcomingData.events.tomorrow.length == 0
            ? "s, " 
            : ", "
            } 
            {upcomingData.tasks.tomorrow.length + " task"}
            {upcomingData.tasks.tomorrow.length > 1 || upcomingData.tasks.tomorrow.length == 0
            ? "s" 
            : ""
            } 
            </Text>
            </View>
            {upcomingData.firstItem
            ? <View style={{width: "100%", paddingTop: 10,flexDirection: "row"}}>
            <Text style={normalText}>Next plan is </Text>
            <TouchableNativeFeedback onPress={() => upcomingData.firstItem.dateFrom ? NavigationService.navigate('EditEvent', upcomingData.firstItem) : NavigationService.navigate('EditTask', upcomingData.firstItem) }>
            <Text style={colorText}>{upcomingData.firstItem.text} at{upcomingData.firstItem.dateFrom ? upcomingData.firstItem.dateFrom.toString().slice(15,21) : upcomingData.firstItem.reminder.toString().slice(15,21)}
            </Text>
            </TouchableNativeFeedback>
            </View>
            : null
            }
            </View>

              )
            }}
            />
          : null
          }
          {data.events.length > 0 || data.tasks.length > 0 || data.notes.length > 0
          ?  <HomeCard 
              darkTheme={this.props.darkTheme}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              title="Favourites"
              renderContent={() => {return (<Text style={normalText}>You have {data.events.length} event{data.events.length > 1 ? "s" : ""}, {data.tasks.length} task{data.tasks.length > 1 ? "s" : ""}, and {data.notes.length} note{data.notes.length > 1  || data.notes.length == 0 ? "s" : ""} starred</Text>)}}
              func={() => {NavigationService.navigate('Favourites', data)}}
              />
          : null
          }
          {this.props.updatesSettings && this.props.notificationsUpdate && this.props.version != this.props.notificationsUpdate.data
            ? <HomeCard 
              darkTheme={this.props.darkTheme}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              title="Update"
              cardMenu={"Yes"}
              optionsMenu={[{text: "Hide", func: () => this.props.hideNotification("notificationsUpdate", this.props.notificationsUpdate)}, {text: "Turn off notifications", func: () => {this.props.triggerHomeSettings("updatesSettings", this.props.updatesSettings)}}]}
              renderContent={() => {return (<View style={{width: "100%", flexDirection: "column"}}><Text style={normalText}>New version ({this.props.notificationsUpdate.data}) of Hideplan is available</Text>
              <View style={{paddingTop: 15}} />
              <View style={{width: "auto"}}><TouchableNativeFeedback onPress={() => Linking.openURL(`https://hideplan.com/download/hideplan-${this.props.notificationsUpdate.data}.html`).catch((err) => console.error('An error occurred', err)) }><Text style={colorText}>Download</Text></TouchableNativeFeedback></View></View>)}}
              func={() => {NavigationService.navigate('Plans', data)}}
              />
            : null
            }
 {this.props.infoSettings && this.props.notificationsInfo
            ? <HomeCard 
              darkTheme={this.props.darkTheme}
              primaryColor={this.props.primaryColor}
              colors={this.props.colors}
              title="Information"
              cardMenu={"Yes"}
              optionsMenu={[{text: "Hide", func: () => this.props.hideNotification("notificationsInfo", this.props.notificationsUpdate)}, {text: "Turn off notifications", func: () => {this.props.triggerHomeSettings("infoSettings", this.props.infoSettings)}}]}
              renderContent={() => {return (<Text style={normalText}>{this.props.notificationsInfo.data}</Text>
              )}}
              func={() => {NavigationService.navigate('Plans', data)}}
              />
            : null
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
 
 
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: 8,
    }
    const navigationView = (<View style={{flex:1}}></View>)
    const darkTheme = this.props.screenProps.darkTheme
    return (
      <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface}}>
      <Header 
      style={headerStyle}
      >
            <StatusBar backgroundColor={this.props.screenProps.colors.gray} barStyle={darkTheme ? "light-content" : "dark-content"} />

                    <Left>
                    <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="menu" color={this.props.screenProps.colors.gray } headerFunction={() => {
        this.MyDrawer.open()
      }} />

       
          

            </Left>
        <Body>
        <Title style={{color: this.props.screenProps.colors.text,fontFamily: 'Poppins-Bold', fontWeight: "bold", fontSize: 24}}>
        Home
        </Title>
        </Body>
        <Right>
        <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="magnify" color={this.props.screenProps.colors.gray } headerFunction={() => {
        NavigationService.navigate('Search')
      }} />
          </Right>

</Header>

      <HomeContent
        primaryColor={this.props.screenProps.primaryColor}
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
        plansSettings={this.props.screenProps.plansSettings}
        updatesSettings={this.props.screenProps.updatesSettings}
        infoSettings={this.props.screenProps.infoSettings}
        triggerHomeSettings={this.props.screenProps.triggerHomeSettings}
        notificationsUpdate={this.props.screenProps.notificationsUpdate}
        notificationsInfo={this.props.screenProps.notificationsInfo}
        hideNotification={this.props.screenProps.hideNotification}
        version={this.props.screenProps.version}
        colors={this.props.screenProps.colors}
        />
       
     
{this.props.screenProps.toastIsVisible
        ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} 
        darkTheme={this.props.screenProps.darkTheme}
        colors={this.props.screenProps.colors}/>
        : null
      }


    <MyDrawer
                    ref={ref => {
                      this.MyDrawer = ref;
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
          <View style={{flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-start",}}>
        <View >
      <ScrollView>
      <View style={{flexDirection: "row", padding: 10, paddingLeft: 20, paddingRight: 20}}>
      <View style={{width: "15%"}}>
      </View>
      <View style={{width: "85%", flexDirection: "column"}}>
      <Text style={{paddingLeft: 10, color: this.props.screenProps.darkTheme ? this.props.screenProps.colors.gray.s100 : this.props.screenProps.colors.gray.s700, fontSize: 18}}>
        Hideplan
      </Text>
      
      </View>
      </View>
      <TouchableNativeFeedback
            onPress={() => { NavigationService.navigate('Settings'), this.MyDrawer.close() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
      <View style={{flexDirection: "row", padding: 10,       paddingLeft: 20, 
      paddingRight: 20,}}>
      <View style={{width: "15%", alignItems: "center", justifyContent: "center"}}>
      <Ionicons name="md-settings" size={26} color={this.props.screenProps.darkTheme ? this.props.screenProps.colors.gray.s100 : this.props.screenProps.colors.gray.s700} />
      </View>
      <View style={{width: "85%", alignItems: "flex-start", justifyContent: "center",  }}>
      <Text style={{paddingLeft: 10, color: this.props.screenProps.darkTheme ? this.props.screenProps.colors.gray.s100 : this.props.screenProps.colors.gray.s700, fontSize: 16}}>
      Settings
      </Text>
      </View>
      </View>
      </TouchableNativeFeedback>
      {this.props.screenProps.lists && this.props.screenProps.tagName
      ? <MenuDrawer
      ref={ref => {
        this.MenuDrawer = ref;
      }}
      button={""}
      darkTheme={this.props.screenProps.darkTheme}
      navigateToSettings={() => {NavigationService.navigate('Settings')}}
      closeDrawer={() => this.MyDrawer.close()}

    />
    : null
      }
                 </ScrollView>
            </View>
      </View>
      </View>
                    </MyDrawer>
   </View>

    );
  }
}


module.exports = HomeScreen;

