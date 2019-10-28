import React from "react";
import { Linking, StatusBar, Alert, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback, Switch } from "react-native"
import { View, Dimensions, AsyncStorage, TextInput } from "react-native"
import {sendPost} from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { resetKeychain } from '../../encryptionFunctions';
import { AlertModal } from '../../customComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HeaderIcon, FabIcon, ActionBar, AppHeader } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Title, Content, Fab, CheckBox, Tab, Tabs, TabHeading, SwipeRow, List, ListItem, Text, Separator, Spinner } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconButton, Button } from 'react-native-paper';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class LoadingSpinner extends React.Component {

  render() {
    return (
          <View style={{backgroundColor: "rgba(28, 28, 28, 0.9)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 0, flex: 1, height: HEIGHT, width: WIDTH, elevation: 7}}>
          <Spinner color={this.props.primaryColor} />
          <Text style={{ fontSize: 20, textAlign: "center", color: "mintcream" }}>Please wait</Text>
          </View>
    );
  }
}

class Notifications extends React.Component {

  render() {
    
  

    return (
      <View style={{flex: 1}}>
        <ScrollView style={{flex:1 }}>
        {this.props.notifications.length > 0
        ? null
        :<View style={{  flex: 1,
          justifyContent: "center",
          width: "100%",
          height: HEIGHT - 140 }}>
        <Text
          style={{
            fontSize: 20,
            textAlign: "center",
            color: this.props.colors.gray,
            fontFamily: "OpenSans",
            includeFontPadding: false
          }}
        >
          No notifications
          </Text>
</View>
        }

        </ScrollView>
        </View>

    )
  }
}

export default class NotificationsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      updates: false,
      info: false,
      plans: false,
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

  
  componentWillMount() {
   this.setState({ updates: this.props.screenProps.updatesSettings, info: this.props.screenProps.infoSettings, plans: this.props.screenProps.plansSettings})
  
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
screen="settings"
darkTheme={this.props.screenProps.darkTheme}
colors={this.props.screenProps.colors}
title={"Notifications"}
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
<View style={{flex: 1}}>

     
    <Notifications
    colors={this.props.screenProps.colors}
    darkTheme={this.props.screenProps.darkTheme}
    notifications={[]}
    />

      
    </View>
    {this.props.screenProps.isUpdating
      ? <LoadingSpinner 
      primaryColor={this.props.screenProps.primaryColor}
      />
      : null
      }


    </View>


    );
  }
}


module.exports = NotificationsScreen;
