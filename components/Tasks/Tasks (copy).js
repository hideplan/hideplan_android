import React from "react";
//import "./Register.css";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TouchableNativeFeedback, Dimensions, Animated, Easing, ScrollView, TextInput, TouchableWithoutFeedback, DrawerLayoutAndroid, Switch } from "react-native"
import { Keyboard } from 'react-native'

import { sendPost, sendPostAsync } from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AsyncStorage } from "react-native"
import CryptoJS from "react-native-crypto-js";
import { HeaderIcon, FabIcon, ActionBar } from '../../customComponents.js';
import { Button, Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading, SwipeRow } from 'native-base';
import { Toast } from '../../customComponents.js';
import { createId } from '../../functions';
import { encryptData, encryptDataPromise } from '../../encryptionFunctions';
import NewTaskModal from '../NewTask/NewTaskModal.js';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
import RBSheet from "react-native-raw-bottom-sheet";
import BottomSheet from '../../bottomSheet/BottomSheet.js';
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;




class MenuDrawer extends React.Component {
  
  filterTasks = (tasks, list) => {
    let count = []
    tasks.map(item => {
      if (item.list == list.uuid && item.isChecked == false ) {
        count.push(item)
      }
    })
    return count.length
  }

  render() {
    const drawerStyle = {
      flex: 1,
      width: 300,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }
    const drawerBody = {
      padding: 10
    }
    const drawerCol = {
      width: 280,
      flexDirection: "column",
    }
    const drawerRow = {
      width: 280,
      flexDirection: "row",
      padding: 10,
      alignItems: "center"
    }
    const drawerIcon = {
      width: 40,
    }
    const drawerText = {
      width: 230,
      marginRight: 20,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textStyle = {
      color: "white",
      fontSize: 18,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    return (
      <View style={drawerStyle}>
      <ScrollView>
      <View style={drawerBody}>
      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToSettings() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-settings" size={26} color="white" />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Settings</Text>
        </View>
        </View>
        </TouchableNativeFeedback>

      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToNewList() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-add" size={26} color="white" />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Add new list</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>

       
        <View style={{ marginTop: 4, marginBottom: 8, left: 0, borderBottomWidth: 0.4, borderBottomColor: "gray", width: 300 }} />
        <View style={drawerBody}>
        {this.props.tagName.shared
        ?<TouchableNativeFeedback
        onPress={() => { this.props.showAddListModal()
       }}
        background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

      >
      <View style={drawerRow}>
    <View style={drawerIcon}>
    <Ionicons name="md-person-add" size={26} color="white" />
    </View>
    <View style={drawerText}>
    <Text style={textStyle}>Invite people</Text>
    </View>
    </View>
    </TouchableNativeFeedback>
        : null
        }
      
        <TouchableNativeFeedback
            onPress={() => { this.props.navigateToSettings() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-create" size={26} color="white" />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Edit list</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToNewList() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-trash" size={26} color="white" />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Delete list</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>


        <View style={{ marginTop: 4, marginBottom: 8, left: 0, borderBottomWidth: 0.4, borderBottomColor: "gray", width: 300 }} />
        {this.props.data.length > 0
          ? <View style={drawerBody}>
          <Text style={{ fontSize: 16, color: "#929390",       fontFamily: 'Poppins-Regular', includeFontPadding: false }}>Lists:</Text>
            
              <FlatList
                data={this.props.data}
                keyExtractor={item => item.tag}
                renderItem={({ item }) =>
                <View style = {drawerCol}>
                <TouchableNativeFeedback
                    onPress={() => { this.props.filterTasksOnDemand(item), this.props.closeDrawer() }}
                    background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

                  >
                  
              <View style={drawerRow}>
            <View style={drawerIcon}>
            <Ionicons name="md-bookmark" size={26} color="white" />
            </View>
            <View style={drawerText}>
            <Text style={textStyle}>{item.list} ({this.filterTasks(this.props.tasks, item)})</Text>
            </View>
            </View>
            </TouchableNativeFeedback>
          
            
            </View>
                }
              />
            
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
      <TouchableWithoutFeedback onPress={() => { this.props.showInvites() }}>
        <View style={wrapper}>
          <TouchableWithoutFeedback>
            <View style={body}>
              <View style={{ display: "flex", width: "100%" }}>
                <Text style={{ color: "#D8D6D6", fontSize: 18, paddingBottom: 4, fontFamily: 'Poppins-Regular', includeFontPadding: false }}>Add invites to list</Text>
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
                    style={{ color: "red" }}
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


  convertToJson(string) {
    let eventData = JSON.parse(string)
    return eventData;
  }

  componentDidMount() {
  }

  componentDidUpdate() {
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
  }


  render() {

    const normalText = {
      paddingLeft: 10,
      fontSize: 22,
      textAlign: "left",
      color: this.props.darkTheme ? "white" : "black",
      alignSelf: "center",
      fontFamily: 'Poppins-Regular', includeFontPadding: false

    }
    const markedText = {
      paddingLeft: 10,
      fontSize: 22,
      textAlign: "left",
      alignSelf: "center",
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
      color: "#929390",

      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
   
    return (
      <View style={{ flex: 1, width: WIDTH }}>

          <FlatList
            data={this.props.tasks}
            keyExtractor={item => item.uuid}
            renderItem={({ item }) =>
            
            item.list == this.props.tagName.uuid
            ? 
                         <SwipeRow
            leftOpenValue={75}
            rightOpenValue={-75}
            style={{backgroundColor: this.props.darkTheme ? "#202124" : "#F7F5F4", height: 50}}
            left={
              <Button success onPress={() => alert('Add')}>
                <Icon active name="add" />
              </Button>
            }
            body={
              <View>
                        {item.isChecked 
                        ? <View style={{ flex: 1, flexDirection: "row", padding: 12, alignItems: "center",   }}>
                        <CheckBox color={this.props.darkTheme ? "#95A3A4" : "black"}  style={{ borderRadius: 10, width: 20, height: 20, marginRight: 10, backgroundColor: "#95A3A4", color: this.props.darkTheme ? "#95A3A4" : "black"}} checked={item.isChecked} onPress={() => this.props.editTaskOnServer(item)}/>
                        <Text style={markedText}>{item.text}</Text>
                         
                        </View>
                        :<View style={{ flex: 1, flexDirection: "row", padding: 12, alignItems: "center", height: 50, alignItems: "center" }}>
                 
                                       
        <CheckBox color="white" style={{borderRadius: 10, width: 20, height: 20, marginRight: 10, }} checked={item.isChecked} onPress={() => this.props.editTaskOnServer(item)}/>
                        <Text style={normalText}>{item.text}</Text>
                        </View>
                         }
              </View>
            }
            right={
              <Button danger onPress={() => this.props.deleteItem({type: "tasks", uuid: item.uuid, updated: new Date().getTime().toString()})}>
                <Icon active name="trash" />
              </Button>
            }
          />      
 
                      : null
             } />
         

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
    let valueForEncryption = `{"id": "${task.uuid}", "text": "${task.text}", "list": "${task.list}", "isChecked": ${checkValue}, "reminder": "${task.reminder}", "updated": "${timestamp}"}`;
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
    console.log(this.props.tagName)
    if (this.props.tagName.shared == true) {
      console.log("IS SHARED")

      this.props.findPassword(this.props.tagName.uuid).then(data => 
        encryptDataPromise(this.convertToText(task, timestamp), data.password).then(encResult => {
          console.log(encResult),
          this.props.editItem({uuid: task.uuid, data: encResult, updated: timestamp, type: "tasks", parrent: task.list, needSync: true}, {
            "uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": checkValue, "reminder": task.reminder, "updated": timestamp
          }, this.props.tasks)
    })
      )} else {
        dataForEncryption = this.convertToText(task, timestamp);
        encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    
    
        this.props.editItem({uuid: task.uuid, data: encryptedData, updated: timestamp, type: "tasks", parrent: task.list, needSync: true}, {
          "uuid": task.uuid, "text": task.text, "list": task.list, "isChecked": checkValue, "reminder": task.reminder, "updated": timestamp
        }, this.props.tasks)
    }
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




  componentDidMount () {
    console.log(this.props.tasks)
    console.log("HERE")
    this.props.findDefaultList()

  }

  componentWillMount () {
  }


  render() {
    const data = this.filterTasks()
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
    }
    this.child = React.createRef();
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
      : this.setState({ addListModalIsVisible: true }, this.refs.drawer.closeDrawer())
  }
  showInvites = () => {
    this.state.addInvitesIsVisible
      ? this.setState({ addInvitesIsVisible: false })
      : this.setState({ addInvitesIsVisible: true }, this.refs.drawer.closeDrawer())
  }
  closeDrawer = () => {
    this.refs.drawer.closeDrawer()
  }

  randomString = (len) => {
    let text = "";
  
    let charset = "abcdefghijklmnopqrstuvwxyz0123456789";
    
    for (let i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));
    
    return text;
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
      console.log(passObj)
      console.log(sharedPassword)
      this.props.screenProps.saveNewItem({
        "uuid": uuid2, "data": encryptedPassword, "updated": timestamp, "type": "passwords", "parrent": uuid, "shared": "true", "isLocal": "true"}, {"uuid": uuid2, "password": sharedPassword, "list": listName, "uuidShare": uuid}, "passwords", "List created")
        this.props.screenProps.saveNewItem({
          "uuid": uuid, "data": encryptedData, "updated": timestamp, "type": "lists", "parrent": "", "shared": "true", "isLocal": "true"}, {"uuid": uuid, "list": listName, "shared": "true"}, "lists", "List created")
    }

         

  
    NavigationService.navigate('Tasks')

    }
  

  componentWillMount() {
    //Default title
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
      console.log(passObj)

        sendPostAsync(`https://api.hideplan.com/save/passwords`, 
        {
          "uuid": uuid2, "data": encryptedPassword, "updated": timestamp, "type": "passwords", "parrent": uuid, "shared": "true", "isLocal": "true"})
  }
  openIt = () => {
    
    setTimeout(() => console.log(this.refs.drawer.openDrawer()), 1000)
  }
  componentDidMount () {
    this.props.screenProps.mapTags()
    setTimeout(() => {
      this.props.screenProps.findDefaultList()
    }, 1500);
    setTimeout(() => {
      console.log(this.refs)
    }, 2500)
    
  }
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.darkTheme ? '#17191d' : "#F7F5F4",
      color: this.props.screenProps.darkTheme ? 'white' : "black",
      elevation: 0
    }
    const navigationView = (
      <View style={{flex:1, width:300, elevation: 12, backgroundColor: "#1C1C1C", }}>
      {this.props.screenProps.lists
      ?      <MenuDrawer
      data={this.props.screenProps.lists}
      filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
      showAddListModal={this.showAddListModal}
      closeDrawer={ this.closeDrawer}
      tagName={this.props.screenProps.tagName}
      navigateToNewList={() => {NavigationService.navigate('NewList')}}
      navigateToSettings={() => {NavigationService.navigate('Settings')}}
      tasks={this.props.screenProps.tasks}
    />
      : null
      }
    </View>
    );
    const darkTheme = this.props.screenProps.darkTheme
    return (

      <DrawerLayoutAndroid
      ref="drawer"
      drawerWidth={300}
      drawerPosition={DrawerLayoutAndroid.positions.Left}
      onDrawerOpen={() => console.log(this.refs.drawer.openDrawer())}
      renderNavigationView={() => navigationView}>

      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4"}}>

      <Header 
        style={headerStyle}
        androidStatusBarColor={darkTheme ? "#17191d" : "#F7F5F4"}
        >
              {this.refs.drawer && this.props.screenProps.lists && this.props.screenProps.isLoadingData == false
  ?
          <Left>
            <TouchableNativeFeedback
            onPress={this.refs.drawer.openDrawer}
            background={TouchableNativeFeedback.Ripple('gray', true)}
          >
            <View style={{ alignItems: "center" }}>
              <Ionicons name="md-menu" size={30} color={darkTheme ? 'white' : "black"} />
            </View>
          </TouchableNativeFeedback>
      
          

            </Left>
                : null
              }
          <Body>
            <Title style={{color: darkTheme ? "white" : "black",      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>{this.props.screenProps.tagName.list}</Title>
          </Body>
          <Right>
          <HeaderIcon headerIcon="md-refresh" color={darkTheme ? "white" : "black"} headerFunction={() => {
          this.props.screenProps.refreshData()
        }} />
         
          <HeaderIcon headerIcon="md-search" color={darkTheme ? "white" : "black"} headerFunction={() => {
          NavigationService.navigate('Search')
        }} />
            </Right>

</Header>

        {this.props.screenProps.isLoadingData == false && this.props.screenProps.defaultList && this.props.screenProps.tagName && this.props.screenProps.tasks
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

          />
          :<Text style={{ color: darkTheme ? "white" : "black" }}>No tasks</Text>
          
        }

<BottomSheet
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
              backgroundColor: darkTheme ? "#17191d" : "white",
              elevation: 8
            }
          }}
        >
        <View style={{backgroundColor: darkTheme ? "#17191d" : "white" }}>
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
      style={{ backgroundColor: 'dodgerblue' }}
            position="bottomRight"
      onPress={() => { this.BottomSheet.open() }}>
      <Icon name="add" />
      </Fab>

      </View>

      </DrawerLayoutAndroid>
   
     
   

    );
  }
}


class ContainerView extends React.Component {
  
  render() {
    const container = {
      backgroundColor: 'white',
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


module.exports = TasksScreen;
