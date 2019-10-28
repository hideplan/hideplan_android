import React from "react";
//import "./Register.css";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Switch,
  StyleSheet,
  StatusBar,
  Alert,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  VirtualizedList
} from "react-native";
import dateFns, {
  isFuture,
  getISOWeek,
  getMinutes,
  getHours,
  getDay,
  getYear,
  getMonth,
  getDate,
  addMinutes,
  isSameDay,
  isWithinRange,
  isSameHour,
  areIntervalsOverlapping,
  differenceInMinutes,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  getTime,
  differenceInCalendarDays
} from "date-fns";
import { parse } from "../../functions";
import NavigationService from "../../NavigationService.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HeaderIcon, MyDialog, AppHeader } from '../../customComponents.js';
import { encryptData } from "../../encryptionFunctions";
import { sendPost, hashForComparingChanges } from "../../functions.js";
import { createId } from "../../functions";
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Title,
  Content,
  Fab,
  ListItem,
  CheckBox,
  Tab,
  Tabs,
  TabHeading
} from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconButton, Button } from 'react-native-paper';

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get("window").width;

class Lists extends React.Component {



  renderLists = () => {
    const listWrapper = {
      flexDirection: "column",
      borderBottomWidth: 0.2,
      borderBottomColor: this.props.colors.border };
    const listBox = {
      padding: 16,
      flexDirection: "row",
      height: "auto",
    };
    const textTitle = {
      color: this.props.colors.text,
      fontSize: 20,
      margin: 0,
      padding: 0,
      fontFamily: "OpenSans",
      includeFontPadding: false
    };
    const optionsBox = {
      flexDirection: "row",
      padding: 8,
      paddingRight: 16,
      borderRadius: 8,
      marginRight: 16,
      borderColor: this.props.colors.border,
      borderWidth: 0.2
    };
    const iconStyle = {
      justifyContent: "center",
      alignItems: "center",
      width: 26,
      marginRight: 8
    };
    const optionsRow = {
      padding: 16,
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    }
    const optionsTextView = {
      justifyContent: "center",
      alignItems: "center",
    }
    const normalTextSmall = {
      fontSize: 16,
      textAlign: "left",
      alignItems: "flex-start",
      color: this.props.colors.gray,
      alignSelf: "flex-start",
      justifyContent: "flex-start",
      fontFamily: "OpenSans",
      includeFontPadding: false
    };
    return this.props.lists.map(item => {
      return (
        <View style={listWrapper}>
          <View style={listBox}>
            <Text numberOfLines={1} style={textTitle}>
              {item.list}
            </Text>
          </View>
          <View style={optionsRow}>
          <TouchableNativeFeedback
                                  onPress={() => NavigationService.navigate("EditList", item)}
                                  background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
                                    this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
                                  
                                >
            <View style={optionsBox}>
              <View style={iconStyle}>
              <Icon
                            name="pencil-outline"
                            size={26}
                            color={this.props.colors.gray}
                          />
              </View>
              <View style={optionsTextView}>
              <Text style={normalTextSmall}>
              Edit
              </Text>
              </View>
            </View>
            </TouchableNativeFeedback>
            {this.props.defaultList != item.uuid
            ?           <TouchableNativeFeedback
            onPress={() =>  this.props._openDialogDeleteList(item)}
            background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
              this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            ><View style={optionsBox}>
              <View style={iconStyle}>
              <Icon
                            name="delete-outline"
                            size={26}
                            color={this.props.colors.gray}
                          />
              </View>
              <View style={optionsTextView}>
              <Text style={normalTextSmall}>
              Delete
              </Text>
              </View>
            </View>
            </TouchableNativeFeedback>
            : null
            }
          </View>
        
        </View>
      );
    });
  };

  render() {
    const listBox = {
      flexDirection: "column"
    };
    const textStyle = {
      color: "white",
      fontSize: 16,
      padding: 4
    };

    return <View style={{ flex: 1 }}>{this.renderLists()}</View>;
  }
}

export default class ListsSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogDeleteListVisible: false,
      selectedList: ""
    };
  }
  static navigationOptions = {
    header: null
  };
  deleteList = (list) => {
    this.props.screenProps.findDefaultLista().then(defaultList => {
      this.props.screenProps.filterTasksOnDemand(defaultList)
    })
    this.props.screenProps.deleteParrent(this.state.selectedList, "lists", "tasks")
              
  }

  _hideDialogDeleteList = () => {
    this.setState({ dialogDeleteListVisible: false })
  }
  _openDialogDeleteList = (list) => {
    this.setState({ selectedList: list, dialogDeleteListVisible: true })
  }
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text
    };
    const darkTheme = this.props.screenProps.darkTheme;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.props.screenProps.colors.surface
        }}
      >
                  <StatusBar backgroundColor={this.props.screenProps.colors.header} barStyle={darkTheme ? "light-content" : "dark-content"} />

<AppHeader style={headerStyle}
screen="subscreen"
darkTheme={this.props.screenProps.darkTheme}
colors={this.props.screenProps.colors}
title={"Lists"}
hasHeaderShadow={true}
menuIcon={() => { return <IconButton 
icon="arrow-left"
theme={{dark: this.props.screenProps.darkTheme}}
color={this.props.screenProps.colors.gray}
size={24}
onPress={() => this.props.navigation.goBack(null)}
 /> }}
icons={[]}
/>
        <View style={{ flex: 1 }}>
          {this.props.screenProps.lists ? (
            <Lists
              ref={this.child}
              lists={this.props.screenProps.lists}
              defaultList={this.props.screenProps.defaultList}
              cryptoPassword={this.props.screenProps.cryptoPassword}
              editItem={this.props.screenProps.editItem}
              darkTheme={this.props.screenProps.darkTheme}
              user={this.props.screenProps.user}
              colors={this.props.screenProps.colors}
              _openDialogDeleteList={this._openDialogDeleteList}
            />
          ) : null}
        </View>
        {this.state.dialogDeleteListVisible
        ?   
            <MyDialog
            colors={this.props.screenProps.colors}
            darkTheme={this.props.screenProps.darkTheme}
            hide={this._hideDialogDeleteList}
            title={"Delete list"}
            text={`Do you want to delete list "${this.state.selectedList.list}" and all associated tasks?`}
            confirm={() => { 
            this.deleteList(this.state.selectedList)

              }

          }
            
            />
           
        : null
        }
      </View>
    );
  }
}

module.exports = ListsSettingsScreen;
