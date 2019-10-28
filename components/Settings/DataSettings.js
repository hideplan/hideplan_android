import React from "react";
import { Linking, StatusBar, Alert, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback, Switch, Modal } from "react-native"
import { View, Dimensions, AsyncStorage, TextInput } from "react-native"
import {sendPost} from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { resetKeychain } from '../../encryptionFunctions';
import { AlertModal, AppHeader } from '../../customComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button, IconButton, Paragraph, Dialog, RadioButton } from 'react-native-paper';

import { MyDialog, HeaderIcon, FabIcon, ActionBar } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Title, Content, Fab, CheckBox, Tab, Tabs, TabHeading, SwipeRow, List, ListItem, Text, Separator, Spinner } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class LoadingSpinner extends React.Component {

  render() {
    return (
          <View style={{backgroundColor: "rgba(28, 28, 28, 0.9)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 0, flex: 1, height: HEIGHT, width: WIDTH, elevation: 7}}>
          <Spinner color={this.props.colors.primary} />
          <Text style={{ fontSize: 20, textAlign: "center", color: "mintcream" }}>Please wait</Text>
          </View>
    );
  }
}


class ViewContent extends React.Component {

    action = (item) => {
        this.props.func(this.props.stateName, item.value), this.props.hideModal()
    }

    renderContent = () => {
      return (
        this.props.options.map(item => {
          return (
            <TouchableNativeFeedback onPress={() =>this.action(item)}
            background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
              this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            >
            <View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-start", paddingTop: 16, paddingBottom: 16}}>
            { this.props.currentValue == item.value
                  ?<Icon name="radiobox-marked" size={24} color={this.props.colors.primary} />
                  :<Icon name="radiobox-blank" size={24} color={this.props.colors.gray} />
                }
      
      <Text style={{color: this.props.colors.text, fontSize: 18, paddingLeft: 16,includeFontPadding: false,
    fontFamily: "OpenSans" }}>{item.name}</Text>
            </View>
            </TouchableNativeFeedback>
          )
        })
      )
    }
    render() {


        return (
          <View style={{paddingLeft: 20, paddingRight: 20, width: "100%"}}>
          {this.renderContent()}
          </View>
        )
      }
    }

class ListHeader extends React.Component {

  render() {
    
    const listRow = {
      width: "100%",
      height: 60,
    }
    const listRowPadding = {
      width: "100%",
      flex: 1,
      flexDirection: "row",
      padding: 16

    }
    const iconCol = {
      width: 40,
      marginRight: 20,
      justifyContent: "center",
      alignItems: "center", 
    }
    const textCol = {
      width: WIDTH - 40,
      justifyContent: "center",
      flexDirection: "column",
    }
    const listText = {
      color: this.props.colors.gray,
      fontSize: 14,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false
    }
    return (
      <View style={listRow}>
      <View style={listRowPadding}>

      <View style={iconCol}>
      </View>
      <View style={textCol}>
        <Text style={listText}>
          {this.props.text}
          </Text>
       
      </View>
        </View>
        </View>

    )
  }
}

class ListRow extends React.Component {

  render() {
    
    const listRow = {
      width: "100%",
      height: 60,
    }
    const listRowPadding = {
      width: "100%",
      flex: 1,
      flexDirection: "row",


    }
    const iconCol = {
      paddingLeft: 16,
      paddingRight: 16,      
      justifyContent: "center",
      alignItems: "center", 
    }
    const textCol = {
      marginLeft: 24, 
      width: WIDTH - 40,
      justifyContent: "center",
      flexDirection: "column",
    }
    const listText = {
      color: this.props.colors.text,
      fontSize: 16,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false
    }
    const descriptionText = {
      color: this.props.colors.gray,
      fontSize: 14,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false
    }
    const optionCol = {
      width: 40,
      flex: 1,
      justifyContent: "center",
      alignItems: "center", 
    }
    return (
      <TouchableNativeFeedback onPress={() => this.props.function()}
      background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
        this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
      >
      <View style={listRow}>
      <View style={listRowPadding}>

      
      <View style={iconCol}>
      {this.props.icon
      ?  <Icon name={this.props.icon} size={24} color="gray"/>
      : <View style={{width: 24}}/>
      }
           </View>

      <View style={textCol}>
        <Text style={listText}>
          {this.props.text}
          </Text>
        {this.props.description
        ? <Text style={descriptionText}>
          {this.props.description}
          </Text>
        : null
        }
      </View>
      
      <View style={optionCol}>
      {this.props.option
      ? this.props.option()
      : null
      }
      </View>

        </View>
        </View>

      </TouchableNativeFeedback>
    )
  }
}
export default class DataSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

      modalVisible: false,
      routeDialogVisible: false,
      viewDialogVisible: false,
      customCalendarDialogVisible: false,
    };
  }
  static navigationOptions = {
    header: null,
    };
  

  changeSettings = (stateName) => {
    this.state[stateName]
    ? this.setState({ [stateName]: false })
    : this.setState({ [stateName]: true })
  }

  
 
  
  hide = () => {
    this.setState({ modalVisible: false, routeDialogVisible: false, viewDialogVisible: false, customCalendarDialogVisible: false })
  }
  showModal = (dialogName) => {
    this.setState({ modalVisible: true, [dialogName]: true })
  }
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme

    return (
      <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface }}>
        <StatusBar backgroundColor={this.props.screenProps.colors.header} barStyle={darkTheme ? "light-content" : "dark-content"} />

      <AppHeader style={headerStyle}
      screen="screen"
      darkTheme={this.props.screenProps.darkTheme}
      colors={this.props.screenProps.colors}
      title={"Data settings"}
      hasHeaderShadow={true}
      menuIcon={() => { return <IconButton 
      icon="arrow-left"
      theme={{dark: this.props.screenProps.darkTheme}}
      color={this.props.screenProps.colors.gray}
      size={24}
      onPress={() => this.props.navigation.goBack(null)}
       /> }}
      icons={[ ]}
      />
           
<View style={{flex: 1}}>

     
      <ScrollView style={{flex: 1}}>
      <ListHeader 
          darkTheme={darkTheme}
          text="Application"
          colors={this.props.screenProps.colors} 
          />
          <ListRow 
          darkTheme={darkTheme} 
          colors={this.props.screenProps.colors} 
          text="Initial route"
          description={this.props.screenProps.initialRoute}
          icon="table"
          function={() => this.showModal("routeDialogVisible")}
          />
          <ListHeader 
          darkTheme={darkTheme}
          text="Calendar"
          colors={this.props.screenProps.colors} 
          />
          <ListRow 
          darkTheme={darkTheme} 
          colors={this.props.screenProps.colors} 
          text="Default calendar view"
          description={this.props.screenProps.calendarView.slice(0,1).toUpperCase() + this.props.screenProps.calendarView.slice(1)}
          icon="calendar-outline"
          function={() => this.showModal("viewDialogVisible")}
          />
    <ListRow 
          darkTheme={darkTheme} 
          colors={this.props.screenProps.colors} 
          text="Custom calendar view"
          description={`${this.props.screenProps.customCalendar} days`}
          function={() => this.showModal("customCalendarDialogVisible")}
          />
      </ScrollView>

      
    </View>
    {this.props.screenProps.isUpdating
      ? <LoadingSpinner 
      primaryColor={this.props.screenProps.primaryColor}
      colors={this.props.screenProps.colors}

      />
      : null
      }
        {this.state.viewDialogVisible
? <MyDialog
colors={this.props.screenProps.colors}
darkTheme={this.props.screenProps.darkTheme}
hide={this.hide}
title={"Select view"}
content={() => {return              <ViewContent 
  stateName={"calendarView"}
  currentValue={this.props.screenProps.calendarView}
  colors={this.props.screenProps.colors}
  darkTheme={this.props.screenProps.darkTheme}
  calendarView={this.props.screenProps.calendarView}
  options={[{name: "Agenda", value: "agenda"}, {name: "Day", value: "day"}, {name: "Custom", value: "custom"}, {name: "Week", value: "week"}, {name: "Month", value: "month"}]}
  hideModal={this.hide}
  func={this.props.screenProps.triggerSettings}
  />
  }}
/>
: null
}
        {this.state.routeDialogVisible
? <MyDialog
colors={this.props.screenProps.colors}
darkTheme={this.props.screenProps.darkTheme}
hide={this.hide}
title={"Select initial route"}
content={() => {return <ViewContent 
  stateName={"initialRoute"}
  currentValue={this.props.screenProps.initialRoute}
  colors={this.props.screenProps.colors}
  darkTheme={this.props.screenProps.darkTheme}
  calendarView={this.props.screenProps.calendarView}
  options={[{name: "Tasks", value: "Tasks"}, {name: "Calendar", value: "Calendar"}, {name: "Notes", value: "Notes"}]}
  hideModal={this.hide}
  func={this.props.screenProps.triggerSettings}
  />
}}
/>
: null
}
        {this.state.customCalendarDialogVisible
? <MyDialog
colors={this.props.screenProps.colors}
darkTheme={this.props.screenProps.darkTheme}
hide={this.hide}
title={"Select days in custom view"}
content={() => {return <ViewContent 
  stateName={"customCalendar"}
  currentValue={this.props.screenProps.customCalendar}
  colors={this.props.screenProps.colors}
  darkTheme={this.props.screenProps.darkTheme}
  customCalendar={this.props.screenProps.customCalendar}
  options={[{name: "3", value: "3"}, {name: "4", value: "4"}, {name: "5", value: "5"}, {name: "6", value: "6"}]}
  hideModal={this.hide}
  func={this.props.screenProps.triggerSettings}
  />
}}
/>
: null
}
     

    </View>


    );
  }
}


module.exports = DataSettingsScreen;
