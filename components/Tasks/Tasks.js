import React from "react";
//import "./Register.css";
import {
  StatusBar,
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
  Switch,
  RefreshControl,
  LayoutAnimation,
  Modal,
  UIManager
} from "react-native";
import {
  PanGestureHandler,
  TapGestureHandler,
  State as GestureState,
} from 'react-native-gesture-handler'
import { Keyboard } from "react-native";
import { IconButton, Drawer, Snackbar, Menu, Divider, Dialog, Paragraph, Surface } from 'react-native-paper';
import { Appbar } from 'react-native-paper';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

import { sendPost, sendPostAsync } from "../../functions.js";
import NavigationService from "../../NavigationService.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AsyncStorage } from "react-native";
import CryptoJS from "crypto-js";
import { MyDialog, HeaderIcon, HeaderIconMenu, HeaderIconEmpty, DrawerHeader, DrawerRow, DrawerRowGroup, DrawerSubtitle, AppHeader } from "../../customComponents.js";
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
import { Portal, FAB, Button } from 'react-native-paper';
import EditTaskModalScreen from "./EditTaskModal.js";
import { parse } from "../../functions";

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
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

class ViewContent extends React.Component {

  action = (item) => {
      this.props.func(item.value), this.props.hideModal()
  }

  renderContent = () => {
    return (
      this.props.options.map(item => {
        return (
          <TouchableNativeFeedback onPress={() =>this.action(item)}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
          >
          <View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-start",borderRadius: 4, paddingLeft: 24, paddingRight: 24, paddingTop: 8, paddingBottom: 8 }}>
          { this.props.currentValue == item.value
                ?<Icon name="radiobox-marked" size={24} color={this.props.colors.primary} />
                :<Icon name="radiobox-blank" size={24} color={this.props.colors.gray} />
              }
    
    <Text style={{color: this.props.colors.text, fontSize: 16, paddingLeft: 16,includeFontPadding: false,
  fontFamily: "OpenSans" }}>{`${item.label}`}</Text>
          </View>
          </TouchableNativeFeedback>
        )
      })
    )
  }
  render() {


      return (
        <ScrollView style={{ width: "100%",  height: "auto" }}>
        {this.renderContent()}
        </ScrollView>
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
      fontFamily: "OpenSans",
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
                    fontFamily: "OpenSans",
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
                      fontFamily: "OpenSans",
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

class OneTask extends React.Component {

  componentDidMount () {
  {/*  
   this.props.item.reminder 
    ? this.setState({ itemHeight: new Animated.Value(110), defaultHeight: 110 })
  : this.setState({ itemHeight: new Animated.Value(60), defaultHeight: 60 })*/}
  
  }
  

  checkItem = (item) => {
    LayoutAnimation.configureNext(CustomLayoutLinear);
    this.props.editTaskOnServer(item)
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
      fontFamily: "OpenSans",
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
      fontFamily: "OpenSans",
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
      fontFamily: "OpenSans",
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
      fontFamily: "OpenSans",
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
      height: "auto",
      opacity: 1,
      flexDirection: "column",
      borderBottomWidth: 0.2,
      borderBottomColor: this.props.colors.border,
    };


    return (

      <View style={mainBox}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",

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
              height: "auto",
              padding: 16,
              paddingLeft: 16,
              paddingRight: 16,
            }}
          >

              <Icon
                name={item.isChecked == "true" ?"check-circle" : "checkbox-blank-circle-outline"}
                size={24}
                color={
                  this.props.colors.gray
                }
              />
          </View>
          </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
    onPress={() => {
      this.props.selectItem(item)
    }}
  >
        <View
          style={{
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 16,
            height: "auto",
            width: item.isFavourite == "true" ?  WIDTH - (16+26+16+16+18+16) :  WIDTH - (16+26+16+16),
          }}
        >
          <Text numberOfLines={5} style={item.isChecked == "true" ? markedText : normalText}>
            {item.text}
          </Text>
        </View>

        </TouchableWithoutFeedback>
        <View
      style={{
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 16,
        height: "auto"
        
      }}
    >
       {item.isFavourite == "true"
        ? <Icon
                name={"star"}
                size={18}
                color={this.props.colors.gray}
              />
        : null 
        }
    </View>
      </View>
      
      {item.reminder 
      ?<View
      style={{
        flexDirection: "row",
        marginLeft: 46,
        paddingBottom: 8,
        
        justifyContent: "flex-start",
        alignItems: "center",
        flex: 1,
        
      }}
    ><TouchableNativeFeedback onPress={() => {}}>
      <View style={{flexDirection: "row", paddingBottom: 8, alignItems: "center", justifyContent: "center"}}>
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
    

    </View>



    ) 

  }
}

const CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  }
};
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
      <View style={{ flex: 1, backgroundColor: this.props.colors.surface, }}>
        {this.props.tasks.length > 0 ? (
            <FlatList
              data={this.props.tasks}
              ref={ref => {
                this.ScrollView = ref;
              }}
                        onScroll={({nativeEvent}) => {
                          if (nativeEvent.contentOffset.y == 0) {
                            if (this.props.hasHeaderShadow) {
            
                              this.props.changeHeaderShadow(false)
                                if (!this.props.fabVisible){
                                  this.props.snackbarVisible
                                    ? this.props.moveFab(50)
                                    : this.props.moveFab(0)
                                }
                            }
                          } else {
                              if (!isScrollingUp(nativeEvent)) {
                                if (!this.props.hasHeaderShadow) {
                                  
                                  this.props.changeHeaderShadow(true)
                                }
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
              refreshControl={
                <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
                />
              }
              scrollEventThrottle={16}

              keyExtractor={item => item.uuid}
   
              style={{ flex: 1, width: WIDTH, paddingBottom: 80 }}

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
            ) : (
             null
            )
        }


        </View>
        
         
        )

      }}
      
      class TasksSorted extends React.Component {
        
        componentDidMount () {
          if (this.props.tasks[this.props.tasks.length - 1].isChecked == "true") {
            this.props.triggerHasCompletedTasks(true)
        } else {
          this.props.triggerHasCompletedTasks(false)
        }
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
                    reminder: task.reminder,
                    isFavourite: task.isFavourite,
                    updated: timestamp.toString()
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
           // this.props.showSnackbar(`Task ${checkValue == "true" ? "checked" : "unchecked" }`)
          }
        };
      
        filterAndSortData = data => {
          //Filter old events and sort them
      
          let sortedData = data.sort((a, b) => a.uuid - b.uuid);
          return sortedData;
        };
      
        filterTasks = () => {
          //Filter only tasks for selected list
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
      
        componentDidUpdate (prevProps) {
          //Compare array and check for completed tasks
          if (JSON.stringify(prevProps.tasks) != JSON.stringify(this.props.tasks)) {
            LayoutAnimation.configureNext(CustomLayoutLinear);

            if (this.props.tasks[this.props.tasks.length - 1].isChecked == "true") {
              this.props.triggerHasCompletedTasks(true)
          } else {
            this.props.triggerHasCompletedTasks(false)
          }
          }
        }
        render() {
          
          return (
            <View style={{ flex: 1, width: WIDTH,  }}>
              {this.props.tasks?
              
              <Task
                tasks={this.props.tasks}
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
                setScrollState={this.props.setScrollState}
                triggerHasCompletedTasks={this.props.triggerHasCompletedTasks}
                hasCompletedTasks={this.props.hasCompletedTasks}
              />
              : null}
            </View>
          );
        }
      }
class TasksMain extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {
      currentDay: "",
      data: "",
      animatedLayout: false,
      tagsData: [],
      menuIsVisible: false,
      selectedTag: "",
      taskModalVisible: false,
      refreshing: false,
    };
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

  componentDidMount () {
    setTimeout(() => this.setState({ animatedLayout: true }), 100)
  }

  filterTasks = () => {
    //Filter only tasks for selected list
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



  sortTasks = (data, rule) => {
    let sortedData
    if (rule == "favourite") {
      sortedData = data.sort((a, b) => {
        let aItem = a.isFavourite == "true" ? true : false;
        let bItem = b.isFavourite == "true" ? true : false;
        return aItem - bItem;
      });
    } else if (rule == "updated") {
      sortedData = data.sort((a, b) => {
        return parse(b.updated) - parse(a.updated);
      });
    } else if (rule == "newest") {
      sortedData = data.sort((a, b) => {
        let aItem = a.uuid.slice(4,17)
        let bItem = b.uuid.slice(4,17)
        return parseInt(a.uuid) - parseInt(b.uuid);
      });

    }else if (rule == "name") {
      sortedData = data.sort((a, b) => {
        let aItem = a.text.slice(0,1).toUpperCase()
        let bItem = b.text.slice(0,1).toUpperCase()
        return aItem.localeCompare(bItem);
      });
    }
    
    return sortedData;
  };

  filterAllTasks = data => {
    let favouriteNormalTasks = []
    let favouriteCheckedTasks = []
    let checkedTasks = []
    let normalTasks = []
    let favouriteNormalSorted
    let favouriteCheckedSorted
    let checkedSorted
    let normalSorted
    let result
    data.forEach((item, index) => {
      if (item.isFavourite == "true") {
        //On top
        if (item.isChecked == "true") {
          favouriteCheckedTasks.push(item);

        } else {
          favouriteNormalTasks.push(item);

        }
        if (index + 1 == data.length) {
          favouriteNormalSorted = this.sortTasks(favouriteNormalTasks, this.props.tagName.sortBy)
          favouriteCheckedSorted = this.sortTasks(favouriteCheckedTasks, this.props.tagName.sortBy)
          normalSorted = this.sortTasks(normalTasks, this.props.tagName.sortBy);
          checkedSorted = this.sortTasks(checkedTasks, this.props.tagName.sortBy);
          result = favouriteNormalSorted.concat(normalSorted).concat(favouriteCheckedSorted).concat(checkedSorted)
        }

      } else {
        if (item.isChecked == "true") {

          checkedTasks.push(item);
          if (index + 1 == data.length) {
            favouriteNormalSorted = this.sortTasks(favouriteNormalTasks, "favourite")
          favouriteCheckedSorted = this.sortTasks(favouriteCheckedTasks, "favourite")
          normalSorted = this.sortTasks(normalTasks, this.props.tagName.sortBy);
          checkedSorted = this.sortTasks(checkedTasks, this.props.tagName.sortBy);
          result = favouriteNormalSorted.concat(normalSorted).concat(favouriteCheckedSorted).concat(checkedSorted)
          }
        } else {
    
          normalTasks.push(item);
          if (index + 1 == data.length) {
            favouriteNormalSorted = this.sortTasks(favouriteNormalTasks, "favourite")
            favouriteCheckedSorted = this.sortTasks(favouriteCheckedTasks, "favourite")
            normalSorted = this.sortTasks(normalTasks, this.props.tagName.sortBy);
            checkedSorted = this.sortTasks(checkedTasks, this.props.tagName.sortBy);
            result = favouriteNormalSorted.concat(normalSorted).concat(favouriteCheckedSorted).concat(checkedSorted)
          }
        }
      }

    });
    //BUG: to prevent white flash, custom layout needs to be disabled on mounting
    if (this.state.animatedLayout) {
    }
    return result;
  };

  render() {
    const data = this.filterAllTasks(this.filterTasks())

    return (
      <View style={{ flex: 1, width: WIDTH,  }}>
        {data?
        
        <TasksSorted
          tasks={data}
          cryptoPassword={this.props.cryptoPassword}
          triggerMarked={this.props.triggerMarked}
          tagName={this.props.tagName}
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
          setScrollState={this.props.setScrollState}
          triggerHasCompletedTasks={this.props.triggerHasCompletedTasks}
          hasCompletedTasks={this.props.hasCompletedTasks}
        />
        :  <ScrollView
        onLayout={() => {
          this.props.moveFab(0)
        }}
        style={{flex: 1, }}
         refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh}
          />
        }>
          <View style={{ flex: 1,
              justifyContent: "center",
              width: "100%",
              height: HEIGHT - 140 }}>
        <Text style={{   fontSize: 20,
                textAlign: "center",
                color: this.props.colors.gray,
                fontFamily: "OpenSans",
                includeFontPadding: false
           }}>
          No tasks
      </Text>
      </View>
      </ScrollView>}
      </View>
    );
  }
}

export default class TasksScreen extends React.Component {
  constructor(props) {
  
    super(props);
    this.state = {
      dropdownVisible: false,
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
      hasCompletedTasks: false,
      checkedCompletedTasks: false,
      dialogVisible: false,
      dialogSortVisible: false,
      dialogDeleteVisible: false,

    };
    this.drawer = React.createRef();
  }
  static navigationOptions = {
    header: null
  };
  _openMenu = () => this.setState({ dropdownVisible: true });

  _closeMenu = () => this.setState({ dropdownVisible: false });
  openDrawer = () => {
    this.refs['DRAWER_REF'].openDrawer();
  }
  closeDrawer = () => {
    this.refs['DRAWER_REF'].closeDrawer();
  }
  navigateToNewTask = () => {
    NavigationService.navigate("NewTask");
  };
  _hideDialog = () => {
    this.setState({ dialogVisible: false })
  }
  _openDialog = () => {
    this.setState({ dropdownVisible: false, dialogVisible: true })

  }
  _hideSortDialog = () => {
    this.setState({ dialogSortVisible: false })
  }
  _openSortDialog = () => {
    this.setState({ dropdownVisible: false, dialogSortVisible: true })
  }
  _hideDeleteDialog = () => {
    this.setState({ dialogDeleteVisible: false, selectedItem: "" })
  }
  _openDeleteDialog = (item) => {
    this.setState({ selectedItem: item, dialogDeleteVisible: true })
  }
  openModal = () => {
    this.setState({ isModalVisible: true });
  };
  triggerHasCompletedTasks = (value) => {
    this.setState({ hasCompletedTasks: value })
  }


  showInvites = () => {
    this.state.addInvitesIsVisible
      ? this.setState({ addInvitesIsVisible: false })
      : this.setState(
          { addInvitesIsVisible: true },
          this.closeDrawer()
        );
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
    let timestamp = parse(new Date());

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
  deleteCompletedTasks = () => {
    //Filter all completed tasks
    this._hideDialog()
    let tasksForDeletion = this.props.screenProps.tasks.filter(item => {
      return item.list == this.props.screenProps.tagName.uuid && item.isChecked == "true"
    })
    //Delete all completed tasks
    tasksForDeletion.forEach(item => {
      let itemObj = {...item, ...{type: "tasks"}}
      this.props.screenProps.deleteItem(itemObj)
    })
    
  }
  changeSortBy = (sortValue) => {
    let timestamp = parse(new Date())
    let list = this.props.screenProps.tagName
    let listObj = JSON.stringify({uuid: list.uuid, list: list.list, sortBy: sortValue, shared: false, username: list.user, updated: timestamp.toString()})

      let encryptedData = encryptData(listObj, this.props.screenProps.cryptoPassword)

      this.props.screenProps.editItem({
        "uuid": list.uuid, "data": encryptedData, "updated": timestamp.toString(), "type": "lists", "parrent": "", "shared": "", "isLocal": "true"}, {"uuid": list.uuid, "list": list.list, sortBy: sortValue, "timestamp": timestamp.toString(), "shared": "false", "username": list.user }, "lists", "List created")

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
  setScrollState = (value) => {
    this.setState({ scrollState: value })
  }
  renderDrawer = () => {
    return (<View
        style={{
          flex: 1,
          elevation: 16,
          backgroundColor: this.props.screenProps.colors.modal
        }}
      >
        <View
          style={{
            flex: 1,

          }}
        >
            <ScrollView style={{
            flex: 1}}>
           
                  <Drawer.Section title={`${this.props.screenProps.user}'s account`}>
    <Drawer.Item
      label="Settings"
      icon="settings"
      onPress={() => { this.closeDrawer(), NavigationService.navigate("Settings") }}
    />
    <Drawer.Item
      label="Notifications"
      icon="bell"
      onPress={() => { this.closeDrawer(), NavigationService.navigate("Notifications") }}
    />
            <Drawer.Item
      label="Search"
      icon="magnify"
      onPress={() => { this.closeDrawer(), NavigationService.navigate("Search") }}
    />
 </Drawer.Section>

         
          {this.props.screenProps.lists &&
              this.props.screenProps.tagName && this.props.screenProps.tasks ?
            <DrawerRowGroup
            close={this.closeDrawer}
            colors={this.props.screenProps.colors}
            darkTheme={this.props.screenProps.darkTheme}
            icon={"bookmark"}
            title="Lists"
            options={this.props.screenProps.lists}
            tasks={this.props.screenProps.tasks}
            selectedItem={this.props.screenProps.tagName}
            func={this.props.screenProps.filterTasksOnDemand}
            />
            : null
            }
            
            </ScrollView>
        </View>
      </View>)
  }
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: this.state.hasHeaderShadow && this.props.screenProps.darkTheme == false ? 8 : 0,
      marginBottom: this.state.hasHeaderShadow && this.props.screenProps.darkTheme == false ? 8 : 0

    };
    const snackTheme = {
      dark:true,
      colors: {
        background: this.props.screenProps.colors.snackbar,
        surface: this.props.screenProps.colors.snackbar,
        accent: this.props.screenProps.colors.snackbar,
        primary: this.props.screenProps.colors.snackbar,
        text: this.props.screenProps.colors.primaryText,
        backdrop: this.props.screenProps.colors.snackbar,
      },
    };

    const darkTheme = this.props.screenProps.darkTheme;
    return (
      <DrawerLayout
      ref={'DRAWER_REF'}
      backgroundColor={this.props.screenProps.colors.modal}
      drawerWidth={300}

    renderNavigationView={this.renderDrawer}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.screenProps.colors.surface
        }}
      >
         <StatusBar
            backgroundColor={this.state.hasHeaderShadow ? this.props.screenProps.colors.header : this.props.screenProps.colors.surface}
            barStyle={darkTheme ? "light-content" : "dark-content"}
          />

        <AppHeader style={headerStyle}
        screen="tasks"
        darkTheme={this.props.screenProps.darkTheme}
        colors={this.props.screenProps.colors}
        title={this.props.screenProps.tagName.list}
        hasHeaderShadow={this.state.hasHeaderShadow}
        menuIcon={() => { return  <IconButton 
          icon="menu"
          theme={{dark: this.props.screenProps.darkTheme}}
          color={this.props.screenProps.colors.gray}
          size={24}
          onPress={this.openDrawer}          /> }}
        icons={[<Menu
          visible={this.state.dropdownVisible}
          onDismiss={this._closeMenu}
          contentStyle={{backgroundColor: this.props.screenProps.colors.modal}}

          theme={{ dark:this.props.screenProps.darkTheme, mode:"exact", colors: {surface: this.props.screenProps.colors.modal, text: this.props.screenProps.colors.text}}}
          anchor={
            <IconButton 
            icon="dots-vertical"
            theme={{dark: this.props.screenProps.darkTheme}}
            color={this.props.screenProps.colors.gray}
            size={24}
            onPress={() => this._openMenu()}
             />
          }
        ><Menu.Item 
        onPress={() => {this._openSortDialog(), this._closeMenu()}} title={`Sort by ${this.props.screenProps.tagName.sortBy}`} />
        <Menu.Item disabled={!this.state.hasCompletedTasks}
          onPress={() => {this._openDialog(), this._closeMenu()}} title="Delete completed" />
                      <Divider theme={{dark:this.props.screenProps.darkTheme, }} style={{backgroundColor: this.props.screenProps.colors.border}} />
          <Menu.Item onPress={() => {NavigationService.navigate("NewList"), this._closeMenu()}} title="Add list" />
          <Menu.Item onPress={() => {NavigationService.navigate("ListsSettings"), this._closeMenu()}} title="Edit lists" />
          
        </Menu>]}
        />
         
  

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
            triggerHasCompletedTasks={this.triggerHasCompletedTasks}
            hasCompletedTasks={this.state.hasCompletedTasks}
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
       


       

        {this.state.dialogVisible
        ?   
            <MyDialog
            colors={this.props.screenProps.colors}
            darkTheme={this.props.screenProps.darkTheme}
            hide={this._hideDialog}
            title={"Delete completed"}
            text="Do you want to delete all completed tasks?"
            confirm={this.deleteCompletedTasks}
            
            />
           
        : null
        }
      

                {this.state.dialogSortVisible
        ?    
        <MyDialog
        colors={this.props.screenProps.colors}
        darkTheme={this.props.screenProps.darkTheme}
        hide={this._hideSortDialog}
        title={"Sort by"}
        content={() => {return <ViewContent 
          stateName={"sortValue"}
          currentValue={this.props.screenProps.tagName.sortBy}
          colors={this.props.screenProps.colors}
          darkTheme={this.props.screenProps.darkTheme}
          options={[{label: "newest", value: "newest"}, {label: "updated", value: "updated"}, {label: "name", value: "name"}]}
          hideModal={this._hideSortDialog}
          func={this.changeSortBy}
          />}}
        
        />
       
          : null
                }

{this.state.dialogDeleteVisible
        ?    
        <MyDialog
        colors={this.props.screenProps.colors}
        darkTheme={this.props.screenProps.darkTheme}
        hide={this._hideDeleteDialog}
        title={"Delete task"}
        text={`Do you want to delete task "${this.state.selectedItem.text}"?`}
          confirm={() => this.deleteItem(this.state.selectedItem)}
          />
        
      
       
          : null
                }

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
        _openDeleteDialog={this._openDeleteDialog}
        />
        : null
        }
      </View>
      </DrawerLayout>
    );
  }
}

module.exports = TasksScreen;
