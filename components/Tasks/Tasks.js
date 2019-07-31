import React from "react";
//import "./Register.css";
import { StatusBar, Button, Alert, View, Text, StyleSheet, FlatList, TouchableOpacity, TouchableNativeFeedback, Dimensions, Animated, Easing, ScrollView, TextInput, TouchableWithoutFeedback, DrawerLayoutAndroid, Switch, RefreshControl } from "react-native"
import { Keyboard } from 'react-native'

import { sendPost, sendPostAsync } from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AsyncStorage } from "react-native"
import CryptoJS from "crypto-js";
import { HeaderIcon, FabIcon, ActionBar } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading, SwipeRow } from 'native-base';
import { Toast } from '../../customComponents.js';
import { createId } from '../../functions';
import { encryptData, encryptDataPromise } from '../../encryptionFunctions';
import NewTaskModal from '../NewTask/NewTaskModal.js';
import Drawer from '../../drawer/Drawer.js';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
import { BottomSheet, BottomSheetExpanded } from '../../bottomSheet/BottomSheet.js';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;




class MenuDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      needUpdate: false,
     }
  }
  alert = (listName, func) => {
    Alert.alert(
      'Delete list',
      `Do you want to delete list "${listName}" and all associated tasks?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => {func()},
        }
        ],
    );
  }
  filterTasks = (tasks, list) => {
    let count = []
    tasks.map(item => {
      if (item.list == list.uuid && item.isChecked == false ) {
        count.push(item)
      }
    })
    return count.length
  }

  reloadView = () => {
    this.props.findDefaultLista().then(list => {
      this.props.filterTasksOnDemand(list)
    })
  }
  deleteList = (list) => {
    this.reloadView()

    this.props.deleteParrent(list, "lists", "tasks")
  }

  forceUpdateCount = () =>{
    this.setState({ needUpdate: true })
    this.forceUpdate()

  }
  renderLists = (data) => {
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
      flexDirection: "row",
      width: WIDTH /5 * 3,
      marginRight: 20,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textStyle = {
      color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textStyleCircle = {
      color: this.props.darkTheme ? "#0F0F0F" : "mintcream",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textGrayStyle = {
      color: "gray",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    return data.map(item => {
      return                 <View style = {drawerCol}>
      <TouchableNativeFeedback
          onPress={() => { this.props.filterTasksOnDemand(item), this.props.closeDrawer() }}
          background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

        >
    {this.props.tagName.uuid == item.uuid
    ? <View style={drawerRowSelected}>
    <View style={drawerIcon}>
    <Ionicons name="md-bookmark" size={26} color={this.props.darkTheme ? "mintcream" : "#0F0F0F"} />
    </View>
    <View style={drawerText}>
    <View style={{width: "70%"}}>
    <Text style={textStyle}>{item.list}</Text>
    </View>
    {this.filterTasks(this.props.tasks, item) > 0
    ?    <View style={{width: "30%"}}>
    <View style={{width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: this.props.darkTheme ? "mintcream" : "#0F0F0F"}}>
    <Text style={textStyleCircle}>{this.filterTasks(this.props.tasks, item)}</Text>
    </View>
    </View>
    : null
    }


    </View>

    </View>
    :              <View style={drawerRow}>
    <View style={drawerIcon}>
    <Ionicons name="md-bookmark" size={26} color={this.props.darkTheme ? "mintcream" : "#0F0F0F"} />
    </View>
    <View style={drawerText}>
    <View style={{width: "70%"}}>
    <Text style={textStyle}>{item.list}</Text>
    </View>
    {this.filterTasks(this.props.tasks, item) > 0

?    <View style={{width: "30%"}}>
    <View style={{width: 24, height: 24, borderRadius: 12, justifyContent: "center", alignItems: "center", backgroundColor: this.props.darkTheme ? "mintcream" : "#0F0F0F"}}>
    <Text style={textStyleCircle}>{this.filterTasks(this.props.tasks, item)}</Text>
    </View>
    </View>
    : null
    }

    </View>

    </View>
    }

  </TouchableNativeFeedback>

  
  </View>
    })
  }
  
  componentDidUpdate () {
    if (this.state.needUpdate) {
      this.forceUpdate()
      this.setState({ needUpdate: false })
    } else {
      return false
    }
  }
  componentDidMount () {
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

      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToNewList(), this.props.closeDrawer() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-add" size={26} color={this.props.darkTheme ? "mintcream" : "#0F0F0F"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Add new list</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>

       
        <View style={{ marginTop: 4, marginBottom: 8, left: 0, borderBottomWidth: 0.4, borderBottomColor: "gray", width: 300 }} />
        <View style={drawerBody}>
        {this.props.tagName.shared == true
        ?<TouchableNativeFeedback
        onPress={() => { this.props.showAddListModal()
       }}
        background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

      >
      <View style={drawerRow}>
    <View style={drawerIcon}>
    <Ionicons name="md-person-add" size={26} color={this.props.darkTheme ? "mintcream" : "#0F0F0F"} />
    </View>
    <View style={drawerText}>
    <Text style={textStyle}>Invite people</Text>
    </View>
    </View>
    </TouchableNativeFeedback>
        : null
        }
      
        <TouchableNativeFeedback
            onPress={() => {
              NavigationService.navigate('EditList', this.props.tagName)
            }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-create" size={26} color={this.props.darkTheme ? "mintcream" : "#0F0F0F"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Rename list</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        {this.props.defaultList != this.props.tagName.uuid
        ? <TouchableNativeFeedback
        onPress={() => { this.alert(this.props.tagName.list, () => this.deleteList(this.props.tagName)), this.props.closeDrawer() }}
        background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

      >
      <View style={drawerRow}>
    <View style={drawerIcon}>
    <Ionicons name="md-trash" size={26} color={this.props.darkTheme ? "mintcream" : "#0F0F0F"} />
    </View>
    <View style={drawerText}>
    <Text style={textStyle}>Delete list</Text>
    </View>
    </View>
    </TouchableNativeFeedback>
        : <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-trash" size={26} color="gray" />
        </View>
        <View style={drawerText}>
        <Text style={textGrayStyle}>Delete list</Text>
        </View>
        </View> 
        }
     
        </View>


        <View style={{ marginTop: 4, marginBottom: 8, left: 0, borderBottomWidth: 0.4, borderBottomColor: "gray", width: 300 }} />
        {this.props.data.length > 0 && this.props.tagName
          ? <View style={drawerBody}>
          <Text style={{ paddingLeft: 15, fontSize: 16, color: "#929390", fontFamily: 'Poppins-Regular', includeFontPadding: false }}>Lists:</Text>
            
              <ScrollView>
                {this.renderLists(this.props.data)}
                
                </ScrollView>
            
          </View>
          : null
        }
</ScrollView>
      </View>
    )
  }
}


class AddListModal extends React.Component {
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
      color: "mintcream",
      fontSize: 16,
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
      <TouchableWithoutFeedback onPress={() => { this.props.showAddListModal() }}>
        <View style={wrapper}>
          <TouchableWithoutFeedback>
            <View style={body}>
              <View style={{ display: "flex", width: "100%" }}>
                <Text style={{ color: "#D8D6D6", fontSize: 18, paddingBottom: 4,  }}>Invite people</Text>
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
                    disabled={this.state.username.length < 4}
                    title="Save"
                    onPress={() => {  sendPost("https://api.hideplan.com/invite/", 
                    {table: "lists", "uuid": this.props.tagName.uuid, name: this.state.username}, () => {}) }}
                  />
                </TouchableNativeFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>

        </View>
      </TouchableWithoutFeedback>
    )
  }
}


class AddInvitesModal extends React.Component {
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
      backgroundColor: this.props.darkTheme ? "#202526" : "mintcream",
      display: "flex",
      width: (WIDTH / 3) * 2,
      position: "absolute",
      justifyContent: "center",
      top: HEIGHT / 8,
      borderRadius: 12,
      elevation: 5,
    }


    const textStyle = {
      color: "mintcream",
      fontSize: 16,
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
      <TouchableWithoutFeedback onPress={() => { this.props.showInvites() }}>
        <View style={wrapper}>
          <TouchableWithoutFeedback>
            <View style={body}>
              <View style={{ display: "flex", width: "100%" }}>
                <Text style={{ color: "#D8D6D6", fontSize: 18, paddingBottom: 4, fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Add invites to list</Text>
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
              <Switch name="private" value={this.state.private} onValueChange={() => {this.changePrivateState() }}/>

                <TouchableNativeFeedback>

                  <Button
                    style={{ color: "red",fontFamily: 'Poppins-Regular', includeFontPadding: false }}
                    color="#EF2647"
                    disabled={this.state.listName.length < 1}
                    title="Save"
                    onPress={() => { this.props.saveList(this.state.listName, this.state.private) }}
                  />
                </TouchableNativeFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>

        </View>
      </TouchableWithoutFeedback>
    )
  }
}



class Task extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
    refreshing: false,
  }
}

  convertToJson(string) {
    let eventData = JSON.parse(string)
    return eventData;
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


  editTaskOnServer = (task) => {
    let dataForEncryption = this.convertToText(task);
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    let timestamp = new Date().getTime()
    let localData = { "id": task.uuid, "data": encryptedData, "timestamp": timestamp }
    sendPost("https://api.hideplan.com/edit/task", {
      id: task.uuid,
      timestamp: timestamp,
      data: encryptedData
    }, () => {
      this.props.editTask("taskId" + task.uuid, localData, { "id": task.uuid, "text": task.text, "list": { "id": task.list.uuid, "text": task.list.text }, "isChecked": task.isChecked ? false : true, "reminder": task.reminder }, this.state.tagName)
      
    })
    this.props.forceUpdateCount()
  }
  

  componentDidMount () {
    this.props.findDefaultList()
  }
  render() {

    const normalText = {
      paddingLeft: 10,
      fontSize: 18,
      marginRight: 14,
      textAlign: "left",
      color: this.props.darkTheme ? "mintcream" : "#0F0F0F",
      alignSelf: "center",
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      includeFontPadding: false
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
      <View style={{ flex: 1, width: WIDTH }}>
          <ScrollView
          style={{flex: 1}}
           refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
          >
            {this.props.tasks.length > 0 
            ?  <FlatList
            data={this.props.tasks}
            keyExtractor={item => item.uuid}
           
            renderItem={({ item }) =>
            
            item.list == this.props.tagName.uuid
            ? 
            <View>
           
            
 
              <View style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>
                
                               <TouchableNativeFeedback 
              onPress={() => { this.props.selectItem(item).then(() => {
                this.props.BottomSheetMenu.open()
              }) }}
             
              >
                  <View style={{height: 60, width: "100%", borderRadius: 8,backgroundColor: this.props.darkTheme ? "#515059" : "lightgray", margin: 0, padding: 0, flexDirection: "row"}}>
                  <View style={{width: "80%"}}>

              {item.isChecked 
              ? <View style={{flexDirection: "row", padding: 14, alignItems: "center", width: "80%"  }}>
              <CheckBox color={this.props.darkTheme ? "#95A3A4" : "#0F0F0F"}  style={{ borderRadius: 15, width: 30, height: 30, marginRight: 14, backgroundColor: "#95A3A4", borderColor: this.props.darkTheme ? "#95A3A4" : "#95A3A4", color: this.props.darkTheme ? "#95A3A4" : "#95A3A4"}} onPress={() => {this.props.editTaskOnServer(item), this.props.forceUpdateCount()}}/>
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
       
                             
<CheckBox color="mintcream" style={{borderRadius: 15, width: 30, height: 30, marginRight: 14, borderWidth: 0.5, color: "#95A3A4", borderColor: "#95A3A4" }}  onPress={() => {this.props.editTaskOnServer(item), this.props.forceUpdateCount}}/>
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


           
                    
          
            </View>

 
                      : null
             } />
            : <View style={{ flex: 1, justifyContent: "center", width: "100%", height: HEIGHT - 140}}>
            <Text style={{ fontSize: 20, textAlign: "center", color: this.props.darkTheme ? "mintcream" : "#0F0F0F", fontFamily: 'Poppins-Regular', includeFontPadding: false }}>
              No tasks
          </Text>
          </View>
            }
         
                   </ScrollView>


      </View>
    )
  }
}


class TasksMain extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      currentDay: "",
      data: [],
      tagsData: [],
      menuIsVisible: false,
      selectedTag: "",
    }

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

 
  convertToJson(string) {
    let eventData = JSON.parse(string)
    return eventData;
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
    this.props.forceUpdateCount()
  }


  filterAndSortData = (data) => {
    //Filter old events and sort them

    let sortedData = data.sort((a, b) => a.uuid - b.uuid)
    return sortedData;
  }


  filterTasks = () => {
    let data = this.props.tasks
    let filteredData = data.filter(task => {
      return task.list == this.props.tagName.uuid
    })
    return filteredData
  }

  filterTasksOnDemand = (selectedTag) => {
    this.child.current.triggerMenuVisibility()
    this.props.filterTasksOnDemand(selectedTag)
  }

 
  filterMarked = (data) => {
    //Filter old events and sort them

    let sortedData = data.sort((a, b) => a.isChecked - b.isChecked)
    return sortedData;
  }


  render() {
    const data = this.filterMarked(this.filterTasks())
    return (
      <View style={{ flex: 1, width: WIDTH }}>
      

         <Task tasks={data}
            triggerMarked={this.props.triggerMarked}
            editTaskOnServer={this.editTaskOnServer}
            tagName={this.props.tagName}
            markTask={this.markTask}
            darkTheme={this.props.darkTheme}
            editItem={this.props.editItem}
            deleteItem={this.props.deleteItem}
            refreshData={this.props.refreshData}
            selectItem={this.props.selectItem}            forceUpdateCount={this.props.forceUpdateCount}
            findDefaultList={this.props.findDefaultList}
            BottomSheetMenu={this.props.BottomSheetMenu}
          />
        

      </View>

    )
  }
}


export default class TasksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      addListModalIsVisible: false,
      addInvitesIsVisible: false,
      title: "",
      selectedItem: "",
    }
    this.drawer = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };
  

  navigateToNewTask = () => {
    NavigationService.navigate('NewTask')
  }

 

  openModal = () => {
    this.setState({ isModalVisible: true })
  }

  showAddListModal = () => {
    this.state.addListModalIsVisible
      ? this.setState({ addListModalIsVisible: false })
      : this.setState({ addListModalIsVisible: true })
  }
  showInvites = () => {
    this.state.addInvitesIsVisible
      ? this.setState({ addInvitesIsVisible: false })
      : this.setState({ addInvitesIsVisible: true }, this.refs.drawer.closeDrawer())
  }
  closeDrawer = () => {
    //this.Drawer.close()
  }

  randomString = (len) => {
    let text = "";
  
    let charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    for (let i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
  }

  selectItem = (item) => {
    return new Promise((resolve, reject) => {

    this.setState({ selectedItem: item }, resolve())
    })
  }

  saveList = (listName, privateState) => {
    let timestamp = new Date().getTime()
    let listObj
    let uuid = createId("lists")
    let uuid2 = createId("passswords")
    let sharedPassword = this.randomString(15)

    if (privateState == false) {
      listObj = JSON.stringify({list: listName, shared: false})

      let encryptedData = encryptData(listObj, this.props.screenProps.cryptoPassword)

      this.props.screenProps.saveNewItem({
        "uuid": uuid, "data": encryptedData, "updated": timestamp, "type": "lists", "parrent": "", "shared": "", "isLocal": "true"}, {"uuid": uuid, "list": listName, "shared": "false"}, "lists", "List created")
    } else {
      listObj = JSON.stringify({list: listName, shared: true})
      let encryptedData = encryptData(listObj, sharedPassword)
      let passObj = JSON.stringify({type: "lists", uuidShared: uuid, password: sharedPassword})

      let encryptedPassword = encryptData(passObj, this.props.screenProps.cryptoPassword)
      this.props.screenProps.saveNewItem({
        "uuid": uuid2, "data": encryptedPassword, "updated": timestamp, "type": "passwords", "parrent": uuid, "shared": "true", "isLocal": "true"}, {"uuid": uuid2, "password": sharedPassword, "list": listName, "uuidShare": uuid}, "passwords", "List created")
        this.props.screenProps.saveNewItem({
          "uuid": uuid, "data": encryptedData, "updated": timestamp, "type": "lists", "parrent": "", "shared": "true", "isLocal": "true"}, {"uuid": uuid, "list": listName, "shared": "true"}, "lists", "List created")
    }

         

  
    NavigationService.navigate('Tasks')

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
    triggerFavourite = (task) => {
      let dataForEncryption
      let encryptedData
      let isFavourite;
      let timestamp = new Date().getTime()
  
      if (task.isFavourite) {
        isFavourite = false
      } else {
        isFavourite = true
      }
      if (this.props.screenProps.tagName.shared == true) {
  
        this.props.screenProps.findPassword(this.props.screenProps.tagName.uuid).then(data => 
          encryptDataPromise(this.convertToText2(task, timestamp), data.password).then(encResult => {
            this.props.screenProps.editItem({uuid: task.uuid, data: encResult, updated: timestamp, type: "tasks", parrent: task.list, needSync: true}, {
              "uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": task.isChecked, "isFavourite": isFavourite, "reminder": task.reminder, "updated": timestamp
            }, this.props.screenProps.tasks)
      })
        )} else {
          dataForEncryption = this.convertToText2(task, timestamp);
          encryptedData = encryptData(dataForEncryption, this.props.screenProps.cryptoPassword);
      
      
          this.props.screenProps.editItem({uuid: task.uuid, data: encryptedData, updated: timestamp, type: "tasks", parrent: task.list, needSync: true}, {
            "uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": task.isChecked, "isFavourite": isFavourite, "reminder": task.reminder, "updated": timestamp
          }, this.props.screenProps.tasks)
      }
    }

  componentDidMount() {
   //setTimeout(() => {NavigationService.navigate('Settings')}, 500)
    //Default title
  }
  componentWillMount () {
    this.props.screenProps.findDefaultList()

  }

  //"x6brfvdkpnzhmps" "472450417li1556"
  //"bsm988iyl0ekxzc" "480305802li1556"
 
  saveInv = () => {
    let timestamp = new Date().getTime()
    let uuid = "472450417li1556"
    let uuid2 = createId("passswords")
    let sharedPassword = "x6brfvdkpnzhmps"

  
      let passObj = JSON.stringify({type: "lists", uuidShared: "472450417li1556", password: sharedPassword})

      let encryptedPassword = encryptData(passObj, this.props.screenProps.cryptoPassword)

        sendPostAsync(`https://api.hideplan.com/save/passwords`, 
        {
          "uuid": uuid2, "data": encryptedPassword, "updated": timestamp, "type": "passwords", "parrent": uuid, "shared": "true", "isLocal": "true"})
  }
  openIt = () => {
    
  }

  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.darkTheme ? '#17191d' : "#F7F5F4",
      color: this.props.screenProps.darkTheme ? 'mintcream' : "#0F0F0F",
      elevation: 0
    }
    const navigationView = (
      <View style={{flex:1,  elevation: 12, backgroundColor: this.props.screenProps.darkTheme ? "#1C1C1C" : "#F7F5F4", }}>
      {this.props.screenProps.lists
      ?      <MenuDrawer
      darkTheme={this.props.screenProps.darkTheme}
      data={this.props.screenProps.lists}
      filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
      showAddListModal={this.showAddListModal}
      closeDrawer={() => this.Drawer.closeDrawer()}
      tagName={this.props.screenProps.tagName}
      navigateToNewList={() => {NavigationService.navigate('NewList')}}
      navigateToSettings={() => {NavigationService.navigate('Settings')}}
      tasks={this.props.screenProps.tasks}
      deleteParrent={this.props.screenProps.deleteParrent}
      findDefaultLista={this.props.screenProps.findDefaultLista}
      defaultList={this.props.screenProps.defaultList}
    />
    : null
      }
      </View>
    )
    
    const darkTheme = this.props.screenProps.darkTheme
    return (
   
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4"}}>

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
            <Title style={{color: darkTheme ? "mintcream" : "#0F0F0F",fontFamily: 'Poppins-Bold'}}>{this.props.screenProps.tagName.list}</Title>
          </Body>
          <Right>
        
         
          <HeaderIcon headerIcon="md-search" color={darkTheme ? "mintcream" : "#0F0F0F"} headerFunction={() => {
          NavigationService.navigate('Search')
        }} />
            </Right>

</Header>
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
        <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), NavigationService.navigate('EditTask', this.state.selectedItem)}}>
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
        <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), this.deleteAlert(this.state.selectedItem.text, this.state.selectedItem)}}>
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
          </ScrollView>

        </BottomSheet>
        { this.props.screenProps.defaultList && this.props.screenProps.tagName && this.props.screenProps.tasks
          ?  <TasksMain
            ref={this.child}
            tasks={this.props.screenProps.tasks}
            findDefaultList={this.props.screenProps.findDefaultList}
            eventWasDeleted={this.props.screenProps.eventWasDeleted}
            tagName={this.props.screenProps.tagName}
            lists={this.props.screenProps.lists}
            filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
            filterTasksOnLoad={this.props.screenProps.filterTasksOnLoad}
            triggerMarked={this.props.screenProps.triggerMarked}
            cryptoPassword={this.props.screenProps.cryptoPassword}
            editTask={this.props.screenProps.editTask}
            saveNewData={this.props.screenProps.saveNewData}
            tagsData={this.props.screenProps.tagsData}
            darkTheme={darkTheme}
            defaultList={this.props.screenProps.defaultList}
            editItem={this.props.screenProps.editItem}
            findPassword={this.props.screenProps.findPassword}
            deleteItem={this.props.screenProps.deleteItem}
            refreshData={this.props.screenProps.refreshData}
            BottomSheetMenu={this.BottomSheetMenu}
            selectItem={this.selectItem}
            forceUpdateCount={() => this.MenuDrawer.forceUpdateCount()}
          />
          : null
          
        }
        {this.props.screenProps.isLoadingData == false && this.props.screenProps.defaultList && this.props.screenProps.tagName && this.props.screenProps.tasks 
 ? <BottomSheet
          ref={ref => {
            this.BottomSheet = ref;
          }}
          height={120}
          heightExpanded={300}
          duration={250}
          closeOnSwipeDown={true}
          darkTheme={darkTheme}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: darkTheme ? "#304259" : "mintcream",
              elevation: 8
            }
          }}
        >
        <View style={{backgroundColor: darkTheme ? "#304259" : "mintcream" }}>
          <NewTaskModal
          cryptoPassword={this.props.screenProps.cryptoPassword}
          fetchEventsFromServer={this.props.screenProps.fetchEventsFromServer} 
          saveEventsDataToLocal={this.props.screenProps.saveEventsDataToLocal}
          saveTaskAfterPost={this.props.screenProps.saveTaskAfterPost}
          tagsData={this.props.screenProps.tagsData}
          lists={this.props.screenProps.lists}
          defaultList={this.props.screenProps.defaultList}
          saveNewItem={this.props.screenProps.saveNewItem}
          darkTheme={darkTheme}
          hideSheet={() => this.BottomSheet.close()}
          tagName={this.props.screenProps.tagName}
          passswords={this.props.screenProps.passwords}
          sqlFind={this.props.screenProps.sqlFind}
          findPassword={this.props.screenProps.findPassword}
          />
          </View>
        </BottomSheet>
        : null 
        }
        {this.state.addListModalIsVisible
          ? <AddListModal
          saveList={this.saveList}
          showInvites={this.showInvites}
          tagName={this.props.screenProps.tagName}
          showAddListModal={this.showAddListModal}
          />
          : null
        }
        {this.state.addInvitesIsVisible
          ? <AddInvitesModal
            showAddListModal={this.showAddListModal}
            saveList={this.saveList}
          />
          : null
        }
        {this.props.screenProps.toastIsVisible
          ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} />
          : null
        }
      
           <Fab
      style={{ backgroundColor: this.props.screenProps.darkTheme ? 'dodgerblue' : "royalblue" }}
            position="bottomRight"
      onPress={() => { this.BottomSheet.open() }}>
      <Icon name="add" />
      </Fab>
    

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
      data={this.props.screenProps.lists}
      filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
      showAddListModal={this.showAddListModal}
      closeDrawer={() => this.Drawer.close()}
      tagName={this.props.screenProps.tagName}
      navigateToNewList={() => {NavigationService.navigate('NewList')}}
      navigateToSettings={() => {NavigationService.navigate('Settings')}}
      tasks={this.props.screenProps.tasks}
      deleteParrent={this.props.screenProps.deleteParrent}
      findDefaultLista={this.props.screenProps.findDefaultLista}
      defaultList={this.props.screenProps.defaultList}
      selectedItem={this.state.selectedItem}
    />
    : null
      }
      </View>
                    </Drawer>
      </View>

   
     
   

    );
  }
}


class ContainerView extends React.Component {
  
  render() {
    const container = {
      backgroundColor: 'mintcream',
  }
  const content = {
      // height: Screen.height,
      width: WIDTH,
      // height: 300,
  }
  const body = {
      marginBottom: 56,
  }
  const toolbar = {
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      height: 56,
      backgroundColor: '#2B3740'
}
    return (
      <View style={container}>
                <View style={content}>
<View style={toolbar}>
</View>
<View style={body}></View>
</View>
</View>

    )
  }
}
const styles = StyleSheet.create({
  containerStyle: {
    flexDirection: "column",
    flex: 1,
    width: "100%",
  },
  oneColumnStyle: {
    flexDirection: "row",
    flex: 1,
    width: "100%",
    paddingLeft: 10

  },
  twoColumnStyle: {
    flexDirection: "row",
    flex: 1,
    paddingTop: 2
  },
  leftColumnStyle: {
    paddingLeft: 6,
    width: "20%",
  },
  rightColumnStyle: {
    width: "75%",
    paddingLeft: "2%",
    paddingRight: "2%",

  },
  boldTextStyle: {
    fontSize: 22,
    fontWeight: "bold",
  },

  container: {
    backgroundColor: 'mintcream',
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
    paddingTop: 2,
    paddingBottom: 2

  },
  standaloneRowBack: {
    alignItems: 'center',
    backgroundColor: 'red',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  backTextmintcream: {
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


module.exports = TasksScreen;
