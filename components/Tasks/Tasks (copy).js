import React from "react";
//import "./Register.css";
import {
  StatusBar,
  Button,
  Alert,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Dimensions,
  Animated,
  Easing,
  ScrollView,
  TextInput,
  TouchableWithoutFeedback,
  DrawerLayoutAndroid,
  Switch,
  RefreshControl
} from "react-native";
import { Keyboard } from "react-native";
import { Snackbar } from 'react-native-paper';

import { sendPost, sendPostAsync } from "../../functions.js";
import NavigationService from "../../NavigationService.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AsyncStorage } from "react-native";
import CryptoJS from "crypto-js";
import { HeaderIcon, DrawerHeader, DrawerRow, DrawerRowGroup, DrawerSubtitle } from "../../customComponents.js";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  ListItem,
  CheckBox,
  Tab,
  Tabs,
  TabHeading,
  SwipeRow
} from "native-base";
import { Toast } from "../../customComponents.js";
import { createId } from "../../functions";
import { encryptData, encryptDataPromise } from "../../encryptionFunctions";
import NewTaskModal from "../NewTask/NewTaskModal.js";
import MyDrawer from "../../drawer/Drawer.js";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { FAB } from 'react-native-paper';
import EditTaskModalScreen from "./EditTaskModal.js";

import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Warning: ..."]);
<script src="http://localhost:8097"></script>;
console.disableYellowBox = true;
import {
  BottomSheet,
  BottomSheetExpanded
} from "../../bottomSheet/BottomSheet.js";
const WIDTH = Dimensions.get("window").width;
const HEIGHT = Dimensions.get("window").height;


class OneTask extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      textOpacity: new Animated.Value(1),
      itemHeight: new Animated.Value(60),
      defaultHeight: 60,
      triggered: false 
    };
  }
  triggerCheck = (value) => {
    if (value) {
      Animated.parallel([
        Animated.timing(this.state.textOpacity, {
          toValue: 0,
          duration: 100
        }),
        Animated.timing(this.state.itemHeight, {
          toValue: 0,
          duration: 400
        })
    ]).start();
      
  } else {
    Animated.sequence([
    Animated.timing(this.state.itemHeight, {
        toValue: this.state.defaultHeight,
        duration: 400
      }),
    Animated.timing(this.state.textOpacity, {
      toValue: 1,
      duration: 100
    })
    ]).start()
  }
  }

  componentDidMount () {
    
   this.props.item.reminder 
    ? this.setState({ itemHeight: new Animated.Value(110), defaultHeight: 110 })
    : this.setState({ itemHeight: new Animated.Value(60), defaultHeight: 60 })
  
  }
  

  checkItem = (item) => {
    this.triggerCheck(true)
    setTimeout(() => {this.props.editTaskOnServer(item)}, 450)
    setTimeout(() => {this.triggerCheck(false)}, 480)

  }
  render() {
    let item = this.props.item
    const normalText = {
      fontSize: 16,
      margin: 0,
      padding: 0,

      textAlign: "left",
      alignItems: "flex-start",
      color: this.props.colors.text,
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      fontFamily: "Poppins-Regular",
      includeFontPadding: false
    };
    const normalTextSmall = {
      fontSize: 12,
      margin: 0,
      padding: 0,
      textAlign: "left",
      alignItems: "flex-start",
      color: this.props.colors.gray,
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      fontFamily: "Poppins-Regular",
      includeFontPadding: false
    };
    const markedText = {
      textDecorationLine: "line-through",
      textDecorationStyle: "solid",
      color: this.props.colors.gray,
      fontSize: 16,
      margin: 0,
      padding: 0,
      textAlign: "left",
      alignItems: "flex-start",
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      fontFamily: "Poppins-Regular",
      includeFontPadding: false
    };
    const markedTextSmall = {
      fontSize: 12,
      margin: 0,
      padding: 0,
      textAlign: "left",
      alignItems: "flex-start",
      color: this.props.colors.gray,
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      fontFamily: "Poppins-Regular",
      includeFontPadding: false
    };
    const checkBoxStyle = {
      width: "20%",
      height: "100%",
      flex: 1,
      justifyContent: "center",
      alignSelf: "flex-start",
      marginTop: 18,
      marginBottom: 18
    };
    const mainBox = {
      flex: 1,
      height: this.state.itemHeight,
      opacity: this.state.textOpacity,
      flexDirection: "column",
      borderBottomWidth: 0.2,
      borderBottomColor: this.props.colors.border,
    };


    return (

      <Animated.View style={mainBox}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          paddingRight: 16,

          height: "100%",
          minHeight: 60

        }}
      >
        <TouchableWithoutFeedback
              onPress={() =>
                this.checkItem(item)
              }
             
            >
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              paddingTop: 16,
              paddingBottom: 16,
              width: 58,
            }}
          >
            
              <Icon
                name={item.isChecked == "true" ?"check-circle" : "checkbox-blank-circle-outline"}
                size={26}
                color={
                  this.props.colors.gray
                }
              />
          </View>
          </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
    onPress={() => {
      this.props.selectItem(item);
    }}
  >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            paddingRight: 58,
            paddingTop: 16,
            paddingBottom: 16,
            width: "100%",
            height: item.reminder ? 58 : "auto",
          }}
        >
          <Text numberOfLines={1} style={item.isChecked == "true" ? markedText : normalText}>
            {item.text}
          </Text>
        </View>
        </TouchableWithoutFeedback>

      </View>
      {item.reminder 
      ?<View
        style={{
          flexDirection: "row",
          marginLeft: 58,
          justifyContent: "flex-start",
          alignItems: "flex-end",
          flex: 1,
          marginBottom: 16,
          
        }}
      ><TouchableNativeFeedback onPress={() => {}}>
      <View style={{flexDirection: "row",  
      padding: 8,                             borderRadius: 4,
          borderColor: this.props.colors.gray,
          borderWidth: 0.2,}}>
        <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        width: 26,
      }}
    >
      <Icon
        name="bell-outline"
        size={16}
        color={
          this.props.colors.gray
        }
      />
    </View>
    <View style={{
                             justifyContent: "center",
                             alignItems: "center",
    }}>
        <Text style={item.isChecked == "true" ? markedTextSmall : normalTextSmall}>
        {item.reminder.toString().slice(4,21)}
        </Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>
      : null
      }
    </Animated.View>



    ) 

  }
}



class AddInvitesModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      private: true
    };
  }

  handleChange = event => {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  };

  changePrivateState = () => {
    this.state.private
      ? this.setState({ private: false })
      : this.setState({ private: true });
  };

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
    };

    const body = {
      padding: 20,
      backgroundColor: this.props.darkTheme ? "#202526" : "mintcream",
      display: "flex",
      width: (WIDTH / 3) * 2,
      position: "absolute",
      justifyContent: "center",
      top: HEIGHT / 8,
      borderRadius: 12,
      elevation: 5
    };

    const textStyle = {
      color: "mintcream",
      fontSize: 14,
      padding: 8,
      backgroundColor: "#373835",
      borderColor: "gray",
      borderRadius: 4,
      width: "100%",
      fontFamily: "Poppins-Regular",
      includeFontPadding: false
    };

    const colorDot = {
      height: 10,
      width: 10,
      borderRadius: 5,
      color: ""
    };

    return (
      <TouchableWithoutFeedback
        onPress={() => {
          this.props.showInvites();
        }}
      >
        <View style={wrapper}>
          <TouchableWithoutFeedback>
            <View style={body}>
              <View style={{ display: "flex", width: "100%" }}>
                <Text
                  style={{
                    color: "#D8D6D6",
                    fontSize: 16,
                    paddingBottom: 4,
                    fontFamily: "Poppins-Regular",
                    includeFontPadding: false
                  }}
                >
                  Add invites to list
                </Text>
                <TextInput
                  placeholderTextColor="gray"
                  style={textStyle}
                  autoFocus={true}
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChangeText={username => this.setState({ username })}
                />
              </View>
              <View style={{ display: "flex", justifyContent: "center" }}>
                <Switch
                  name="private"
                  value={this.state.private}
                  onValueChange={() => {
                    this.changePrivateState();
                  }}
                />

                <TouchableNativeFeedback>
                  <Button
                    style={{
                      color: "red",
                      fontFamily: "Poppins-Regular",
                      includeFontPadding: false
                    }}
                    color="#EF2647"
                    disabled={this.state.listName.length < 1}
                    title="Save"
                    onPress={() => {
                      this.props.saveList(
                        this.state.listName,
                        this.state.private
                      );
                    }}
                  />
                </TouchableNativeFeedback>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      contentOffsetYBefore: "",
    };
  }

  convertToJson(string) {
    let eventData = JSON.parse(string);
    return eventData;
  }
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

  componentDidMount() {
    this.props.findDefaultList();
  }
  render() {

    const isScrollingUp = ({layoutMeasurement, contentOffset, contentSize}) => {
      this.setState({ contentOffsetYBefore: contentOffset.y})
      return contentOffset.y < this.state.contentOffsetYBefore ;
    };
    return (
      <View style={{ flex: 1, backgroundColor: this.props.colors.surface}}>
        {this.props.tasks ? (
        <ScrollView
                  onScroll={({nativeEvent}) => {
                    if (nativeEvent.contentOffset.y == 0) {
                      if (this.props.hasHeaderShadow) {
                        this.props.changeHeaderShadow(false)
                      }
                      if (!this.props.fabVisible){
                        this.props.snackbarVisible
                          ? this.props.moveFab(50)
                          : this.props.moveFab(0)
                      }
                    } else {
                      if (!this.props.hasHeaderShadow) {
                        this.props.changeHeaderShadow(true)
                      }
                      if (!isScrollingUp(nativeEvent)) {
 
                        if (this.props.fabVisible) {
                          this.props.moveFab(-80)

                        } 
          
                      } else {
                        //Show FAB on scroll up
                        if (!this.props.fabVisible) {
                          this.props.snackbarVisible
                          ? this.props.moveFab(50)
                          : this.props.moveFab(0)
                        }
                      }
                  
                    }
                     


                  }
                  }
                  scrollEventThrottle={400}
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          
            <FlatList
              data={this.props.tasks}
              keyExtractor={item => item.uuid}
              style={{ flex: 1, width: WIDTH, paddingBottom: 40 }}

              renderItem={({ item }) =>
              
                item.list == this.props.tagName.uuid 
                ? 
                  <OneTask 
                  editTaskOnServer={this.props.editTaskOnServer}
                  colors={this.props.colors}
                  darkTheme={this.props.darkTheme}
                  item={item}
                  showSnackbar={this.props.showSnackbar}
                  selectItem={this.props.selectItem}

                  />
                  : null
                
              }
              />
              </ScrollView>
            ) : (
            <ScrollView
            onLayout={() => {
              this.props.moveFab(true)
            }}
              style={{ flex: 1, }}
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
            >
              <View style={{  flex: 1,
                  justifyContent: "center",
                  width: "100%",
                  height: HEIGHT - 140 }}>
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    color: this.props.colors.gray,
                    fontFamily: "Poppins-Regular",
                    includeFontPadding: false
                  }}
                >
                  No tasks
                  </Text>
        </View>
        </ScrollView>
            )
        }
        </View>
        
         
        )

      }}
      

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
      taskModalVisible: false
    };
  }

  convertToText = (task, timestamp) => {
    let checkValue;
    if (task.isChecked == "true") {
      checkValue = "false";
    } else {
      checkValue = "true";
    }
    let valueForEncryption = {
      uuid: task.uuid,
      text: task.text,
      list: task.list,
      isChecked: checkValue,
      isFavourite: task.isFavourite,
      reminder: task.reminder,
      updated: timestamp.toString()
    };
    return valueForEncryption;
  };

  convertToJson(string) {
    let eventData = JSON.parse(string);
    return eventData;
  }

  editTaskOnServer = task => {
    let dataForEncryption;
    let encryptedData;
    let checkValue;
    let timestamp = parse(new Date())

    if (task.isChecked == "true") {
      checkValue = "false";
    } else {
      checkValue = "true";
    }
    if (this.props.tagName.shared == true) {
      this.props.findPassword(this.props.tagName.uuid).then(data =>
        encryptDataPromise(
          this.convertToText(task, timestamp),
          data.password
        ).then(encResult => {
          this.props.editItem(
            {
              uuid: task.uuid,
              data: encResult,
              updated: timestamp,
              type: "tasks",
              parrent: task.list,
              needSync: true
            },
            {
              uuid: task.uuid,
              text: task.text,
              list: task.list,
              isChecked: checkValue,
              reminder: task.reminder,
              isFavourite: task.isFavourite,
              updated: timestamp
            },
            this.props.tasks
          );
        })
      );
    } else {
      dataForEncryption = JSON.stringify(this.convertToText(task, timestamp));
      encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);

      this.props.editItem(
        {
          uuid: task.uuid,
          data: encryptedData,
          updated: timestamp.toString(),
          type: "tasks",
          parrent: task.list,
          needSync: true
        },
        {
          uuid: task.uuid,
          text: task.text,
          list: task.list,
          isChecked: checkValue,
          isFavourite: task.isFavourite,
          reminder: task.reminder,
          updated: timestamp.toString()
        },
        this.props.tasks
      );
      this.props.showSnackbar(`Task ${checkValue == "true" ? "checked" : "unchecked" }`)
    }
  };

  filterAndSortData = data => {
    //Filter old events and sort them

    let sortedData = data.sort((a, b) => a.uuid - b.uuid);
    return sortedData;
  };

  filterTasks = () => {
    let data = this.props.tasks;
    let filteredData = data.filter(task => {
      return task.list == this.props.tagName.uuid;
    });
    return filteredData;
  };

  filterTasksOnDemand = selectedTag => {
    this.child.current.triggerMenuVisibility();
    this.props.filterTasksOnDemand(selectedTag);
  };

  sortTasks = data => {
    let sortedData = data.sort((a, b) => {
      return parseInt(b.updated) - parseInt(a.updated);
    });
    return sortedData;
  };
  filterMarked = data => {
    //Filter marked events and sort them to end of the list

    let sortedData = data.sort((a, b) => {
      let aItem = a.isChecked == "true" ? true : false;
      let bItem = b.isChecked == "true" ? true : false;
      return aItem - bItem;
    });

    return sortedData;
  };

  filterAllTasks = data => {
    let checkedTasks = [];
    let normalTasks = [];
    let checked;
    let normal;
    let result;
    data.forEach((item, index) => {
      if (item.isChecked == "true") {
        checkedTasks.push(item);
        if (index + 1 == data.length) {
          checked = this.sortTasks(checkedTasks);
          normal = this.sortTasks(normalTasks);
          result = normal.concat(checked);
        }
      } else {
        normalTasks.push(item);
        if (index + 1 == data.length) {
          checked = this.sortTasks(checkedTasks);
          normal = this.sortTasks(normalTasks);
          result = normal.concat(checked);
        }
      }
    });
    return result;
  };

  render() {
    const data = this.filterAllTasks(this.filterTasks());
    return (
      <View style={{ flex: 1, width: WIDTH,  }}>
        <Task
          tasks={data}
          triggerMarked={this.props.triggerMarked}
          editTaskOnServer={this.editTaskOnServer}
          tagName={this.props.tagName}
          markTask={this.markTask}
          darkTheme={this.props.darkTheme}
          editItem={this.props.editItem}
          deleteItem={this.props.deleteItem}
          refreshData={this.props.refreshData}
          selectItem={this.props.selectItem}
          forceUpdateCount={this.props.forceUpdateCount}
          findDefaultList={this.props.findDefaultList}
          BottomSheetMenu={this.props.BottomSheetMenu}
          colors={this.props.colors}
          moveFab={this.props.moveFab}
          showSnackbar={this.props.showSnackbar}
          snackbarVisible={this.props.snackbarVisible}
          fabVisible={this.props.fabVisible}
          changeHeaderShadow={this.props.changeHeaderShadow}
          hasHeaderShadow={this.props.hasHeaderShadow}
        />
      </View>
    );
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
      fabBottom: new Animated.Value(0),
      fabVisible: true,
      snackbarVisible: false,
      snackbarText: "",
      hasHeaderShadow: false,

    };
    this.drawer = React.createRef();
  }
  static navigationOptions = {
    header: null
  };

  navigateToNewTask = () => {
    NavigationService.navigate("NewTask");
  };

  openModal = () => {
    this.setState({ isModalVisible: true });
  };


  showInvites = () => {
    this.state.addInvitesIsVisible
      ? this.setState({ addInvitesIsVisible: false })
      : this.setState(
          { addInvitesIsVisible: true },
          this.refs.MyDrawer.closeDrawer()
        );
  };
  closeDrawer = () => {
    //this.MyDrawer.close()
  };

  randomString = len => {
    let text = "";

    let charset = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < len; i++)
      text += charset.charAt(Math.floor(Math.random() * charset.length));

    return text;
  };

  selectItem = item => {
    return new Promise((resolve, reject) => {
      this.setState({ selectedItem: item }, resolve());
    });
  };

  saveList = (listName, privateState) => {
    let timestamp = parse(new Date());
    let listObj;
    let uuid = createId("lists");
    let uuid2 = createId("passswords");
    let sharedPassword = this.randomString(15);

    if (privateState == false) {
      listObj = JSON.stringify({ list: listName, shared: false });

      let encryptedData = encryptData(
        listObj,
        this.props.screenProps.cryptoPassword
      );

      this.props.screenProps.saveNewItem(
        {
          uuid: uuid,
          data: encryptedData,
          updated: timestamp,
          type: "lists",
          parrent: "",
          shared: "",
          isLocal: "true"
        },
        { uuid: uuid, list: listName, shared: "false" },
        "lists",
        "List created"
      );
    } else {
      listObj = JSON.stringify({ list: listName, shared: true });
      let encryptedData = encryptData(listObj, sharedPassword);
      let passObj = JSON.stringify({
        type: "lists",
        uuidShared: uuid,
        password: sharedPassword
      });

      let encryptedPassword = encryptData(
        passObj,
        this.props.screenProps.cryptoPassword
      );
      this.props.screenProps.saveNewItem(
        {
          uuid: uuid2,
          data: encryptedPassword,
          updated: timestamp,
          type: "passwords",
          parrent: uuid,
          shared: "true",
          isLocal: "true"
        },
        {
          uuid: uuid2,
          password: sharedPassword,
          list: listName,
          uuidShare: uuid
        },
        "passwords",
        "List created"
      );
      this.props.screenProps.saveNewItem(
        {
          uuid: uuid,
          data: encryptedData,
          updated: timestamp,
          type: "lists",
          parrent: "",
          shared: "true",
          isLocal: "true"
        },
        { uuid: uuid, list: listName, shared: "true" },
        "lists",
        "List created"
      );
    }

    NavigationService.navigate("Tasks");
  };
  convertToText = (task, timestamp) => {
    let checkValue;
    if (task.isChecked == "true") {
      checkValue = "false";
    } else {
      checkValue = "true";
    }
    let valueForEncryption = `{"uuid": "${task.uuid}", "text": "${task.text}", "list": "${task.list}", "isChecked": ${checkValue}, "isFavourite": ${task.isFavourite}, "reminder": "${task.reminder}", "updated": "${timestamp}"}`;
    return valueForEncryption;
  };
  deleteItem = item => {
    let itemObj = { ...item, ...{ type: "tasks" } };
    this.props.screenProps.deleteItem(itemObj);
  };
  deleteAlert = (taskName, item) => {
    Alert.alert("Delete task", `Do you want to delete task "${taskName}"?`, [
      {
        text: "Cancel",
        onPress: () => {},
        style: "cancel"
      },
      {
        text: "Delete",
        onPress: () => {
          this.deleteItem(item);
        }
      }
    ]);
  };
  convertToText2 = (task, timestamp) => {
    let favouriteValue;
    if (task.isFavourite == "true") {
      favouriteValue = "false";
    } else {
      favouriteValue = "true";
    }
    let valueForEncryption = `{"uuid": "${task.uuid}", "text": "${task.text}", "list": "${task.list}", "isChecked": ${task.isChecked}, "isFavourite": ${favouriteValue}, "reminder": "${task.reminder}", "updated": "${timestamp}"}`;
    return valueForEncryption;
  };
  triggerFavourite = task => {
    let dataForEncryption;
    let encryptedData;
    let isFavourite;
    let timestamp = new Date().getTime();

    if (task.isFavourite == "true") {
      isFavourite = "false";
    } else {
      isFavourite = "true";
    }
    if (this.props.screenProps.tagName.shared == true) {
      this.props.screenProps
        .findPassword(this.props.screenProps.tagName.uuid)
        .then(data =>
          encryptDataPromise(
            this.convertToText2(task, timestamp),
            data.password
          ).then(encResult => {
            this.props.screenProps.editItem(
              {
                uuid: task.uuid,
                data: encResult,
                updated: timestamp,
                type: "tasks",
                parrent: task.list,
                needSync: true
              },
              {
                uuid: task.uuid,
                text: task.text,
                list: task.list,
                isChecked: task.isChecked,
                isFavourite: isFavourite,
                reminder: task.reminder,
                updated: timestamp
              },
              this.props.screenProps.tasks
            );
          })
        );
    } else {
      dataForEncryption = this.convertToText2(task, timestamp);
      encryptedData = encryptData(
        dataForEncryption,
        this.props.screenProps.cryptoPassword
      );

      this.props.screenProps.editItem(
        {
          uuid: task.uuid,
          data: encryptedData,
          updated: timestamp,
          type: "tasks",
          parrent: task.list,
          needSync: true
        },
        {
          uuid: task.uuid,
          text: task.text,
          list: task.list,
          isChecked: task.isChecked,
          isFavourite: isFavourite,
          reminder: task.reminder,
          updated: timestamp
        },
        this.props.screenProps.tasks
      );
    }
  };

  componentDidMount() {
    //setTimeout(() => {NavigationService.navigate('Settings')}, 500)
    //Default title
  }
  componentWillUnmount () {

  }
  componentWillMount() {
    this.props.screenProps.findDefaultList();
  }

  //"x6brfvdkpnzhmps" "472450417li1556"
  //"bsm988iyl0ekxzc" "480305802li1556"

  saveInv = () => {
    let timestamp = parse(new Date());
    let uuid = "472450417li1556";
    let uuid2 = createId("passswords");
    let sharedPassword = "x6brfvdkpnzhmps";

    let passObj = JSON.stringify({
      type: "lists",
      uuidShared: "472450417li1556",
      password: sharedPassword
    });

    let encryptedPassword = encryptData(
      passObj,
      this.props.screenProps.cryptoPassword
    );

    sendPostAsync(`https://api.hideplan.com/save/passwords`, {
      uuid: uuid2,
      data: encryptedPassword,
      updated: timestamp,
      type: "passwords",
      parrent: uuid,
      shared: "true",
      isLocal: "true"
    });
  };

  moveFab = (value) => {
    if (value >= 0) {
      this.setState({ fabVisible: true })
    } else {
      this.setState({ fabVisible: false })
    }
      Animated.timing(this.state.fabBottom, {
      toValue: value,
      duration: 200
    }).start()
  }

  moveFab2 = (value) => {
      Animated.timing(this.state.fabBottom, {
      toValue: value,
      duration: 200
    }).start();
  }
  showSnackbar = (text, type, func) => {
    this.state.fabVisible 
    ? this.moveFab(50)
    : null
    this.setState({ snackbarVisible: true, snackbarText: text })
  }
  hideSnackbar = () => {
    this.state.fabVisible 
    ? this.moveFab(0)
    : null
    this.setState({ snackbarVisible: false })
  }

  selectItem = (item) => {
    this.setState({ selectedItem: item, taskModalVisible: true })
  }

  hideModal = () => {
    this.setState({ taskModalVisible: false })
  }
  
  changeHeaderShadow = (value) => {
    this.setState({hasHeaderShadow: value})
  }
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: this.state.hasHeaderShadow && this.props.screenProps.darkTheme == false ? 8 : 0,
      marginBottom: this.state.hasHeaderShadow && this.props.screenProps.darkTheme == false ? 8 : 0

    };
    const snackTheme = {
      colors: {
        backgroundColor: this.props.screenProps.colors.snackbar,
        surface: this.props.screenProps.colors.snackbar,
        accent: this.props.screenProps.colors.reversePrimary,
        text: this.props.screenProps.colors.primaryText
      },
    };

    const darkTheme = this.props.screenProps.darkTheme;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.screenProps.colors.surface
        }}
      >
        <Header style={headerStyle}>
          <StatusBar
            backgroundColor={this.props.screenProps.colors.header}
            barStyle={darkTheme ? "light-content" : "dark-content"}
          />

          <Left>
            <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple}
              headerIcon="menu"
              color={this.props.screenProps.colors.gray}
              headerFunction={() => {
                this.MyDrawer.open();
              }}
            />
          </Left>
          <Body>
            <Title
              style={{
                color: this.props.screenProps.colors.text,
                fontFamily: "Poppins-Bold",
                fontWeight: "bold",
                includeFontPadding: false,
                padding: 0,
                margin: 0,
                fontSize: 26
              }}
            >
              {this.props.screenProps.tagName.list}
            </Title>
          </Body>
          <Right>
            <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple}
              headerIcon="magnify"
              color={this.props.screenProps.colors.gray}
              headerFunction={() => {
                NavigationService.navigate("Search");
              }}
            />
          </Right>
        </Header>

        {this.props.screenProps.defaultList &&
        this.props.screenProps.tagName &&
        this.props.screenProps.tasks ? (
          <TasksMain
            ref={this.child}
            primaryColor={this.props.screenProps.primaryColor}
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
            forceUpdateCount={() => this.MenuDrawer.forceUpdateCount()}
            colors={this.props.screenProps.colors}
            moveFab={this.moveFab}
            fabVisible={this.state.fabVisible}
            showSnackbar={this.showSnackbar}
            snackbarVisible={this.state.snackbarVisible}
            changeHeaderShadow={this.changeHeaderShadow}
            hasHeaderShadow={this.state.hasHeaderShadow}

          />
        ) : null}
        {this.props.screenProps.isLoadingData == false &&
        this.props.screenProps.defaultList &&
        this.props.screenProps.tagName &&
        this.props.screenProps.tasks ? (
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
                backgroundColor: this.props.screenProps.colors.modal,
                elevation: 8
              }
            }}
          >
            <View
              style={{
                backgroundColor: this.props.screenProps.colors.modal
              }}
            >
              <NewTaskModal
                cryptoPassword={this.props.screenProps.cryptoPassword}
                fetchEventsFromServer={
                  this.props.screenProps.fetchEventsFromServer
                }
                saveEventsDataToLocal={
                  this.props.screenProps.saveEventsDataToLocal
                }
                saveTaskAfterPost={this.props.screenProps.saveTaskAfterPost}
                tagsData={this.props.screenProps.tagsData}
                lists={this.props.screenProps.lists}
                defaultList={this.props.screenProps.defaultList}
                filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
                saveNewItem={this.props.screenProps.saveNewItem}
                darkTheme={darkTheme}
                hideSheet={() => this.BottomSheet.close()}
                tagName={this.props.screenProps.tagName}
                passswords={this.props.screenProps.passwords}
                sqlFind={this.props.screenProps.sqlFind}
                findPassword={this.props.screenProps.findPassword}
                primaryColor={this.props.screenProps.primaryColor}
                colors={this.props.screenProps.colors}
                showSnackbar={this.showSnackbar}
                
              />
            </View>
          </BottomSheet>
        ) : null}

        {this.state.addInvitesIsVisible ? (
          <AddInvitesModal
            saveList={this.saveList}
          />
        ) : null}

        <Snackbar
                  theme={snackTheme}

          style={{bottom: 0}}
          visible={this.state.snackbarVisible}
          onDismiss={() => this.hideSnackbar()}
          action={{
            label: 'Undo',
            onPress: () => {
              // Do something
              this.props.screenProps.reverteDelete()
            },
          }}
        >
          {this.state.snackbarText}
        </Snackbar>
 <Animated.View style={{
 position: 'absolute',
 margin: 16,
 bottom: this.state.fabBottom,
 alignSelf: "center",
 }}>
 <FAB
    style={{
    backgroundColor: this.props.screenProps.colors.primary,
  }}
  color={this.props.screenProps.colors.primaryText}

  label="Add task"
    icon="plus"
    onPress={() => this.BottomSheet.open()}
  />
  </Animated.View> 
       

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

              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: this.props.screenProps.darkTheme
                ? this.props.screenProps.colors.modal
                : this.props.screenProps.colors.surface,
              elevation: 16,
              zIndex: 999999,
              flex: 1,
            }
          }}
        >
          <View
            style={{
              flex: 1,
              elevation: 16,
              backgroundColor: this.props.screenProps.darkTheme
                ? "#1C1C1C"
                : "#F7F5F4"
            }}
          >
            <View
              style={{
                flex: 1,
    
              }}
            >
                <ScrollView style={{
                flex: 1}}>
                <DrawerHeader 
                colors={this.props.screenProps.colors}
                user={this.props.screenProps.user}
                />
                <DrawerRow
                colors={this.props.screenProps.colors}
                darkTheme={this.props.screenProps.darkTheme}
                icon="settings"
                label="Settings"
                drawer={this.MyDrawer}
                func={() => NavigationService.navigate("Settings")}
                />
                <DrawerRow
                colors={this.props.screenProps.colors}
                darkTheme={this.props.screenProps.darkTheme}
                icon="bell-outline"
                label="Notifications"
                drawer={this.MyDrawer}
                func={() => NavigationService.navigate("Notifications")}
                />
                <DrawerRow
                colors={this.props.screenProps.colors}
                darkTheme={this.props.screenProps.darkTheme}
                icon="plus"
                label="Add list"
                drawer={this.MyDrawer}
                func={() => NavigationService.navigate("NewList")}
                />
                <DrawerRow
                colors={this.props.screenProps.colors}
                darkTheme={this.props.screenProps.darkTheme}
                icon="pencil-outline"
                label="Edit lists"
                drawer={this.MyDrawer}
                func={() => NavigationService.navigate("ListsSettings")}
                />
                <DrawerSubtitle
                colors={this.props.screenProps.colors}
                subtitle={"Lists"}
                />
              {this.props.screenProps.lists &&
                  this.props.screenProps.tagName && this.props.screenProps.tasks ?
                <DrawerRowGroup
                drawer={this.MyDrawer}
                colors={this.props.screenProps.colors}
                darkTheme={this.props.screenProps.darkTheme}
                icon={"bookmark"}
                type="lists"
                options={this.props.screenProps.lists}
                tasks={this.props.screenProps.tasks}
                selectedItem={this.props.screenProps.tagName}
                func={this.props.screenProps.filterTasksOnDemand}
                />
                : null
                }
                
                </ScrollView>
            </View>
          </View>
        </MyDrawer>

        {this.state.taskModalVisible && this.state.selectedItem
        ? <EditTaskModalScreen 
        cryptoPassword={this.props.screenProps.cryptoPassword}
        editItem={this.props.screenProps.editItem}
        darkTheme={this.props.screenProps.darkTheme}
        user={this.props.screenProps.user}
        filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
        item={this.state.selectedItem}
        tagName={this.props.screenProps.tagName}
        findPassword={this.props.screenProps.findPassword}
        primaryColor={this.props.screenProps.primaryColor}
        colors={this.props.screenProps.colors}
        hideModal={this.hideModal}
        taskModalVisible={this.state.taskModalVisible}
        showSnackbar={this.showSnackbar}
        deleteItem={this.props.screenProps.deleteItem}
        cancelNotification={this.props.screenProps.cancelNotification}

        />
        : null
        }
      </View>
    );
  }
}

module.exports = TasksScreen;
