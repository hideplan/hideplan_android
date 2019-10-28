import React from "react";
import { Linking, StatusBar, Alert, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback } from "react-native"
import { View, Dimensions, AsyncStorage, TextInput } from "react-native"
import {sendPost} from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { resetKeychain } from '../../encryptionFunctions';
import { AlertModal } from '../../customComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import { HeaderIcon, FabIcon, ActionBar, AppHeader } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Title, Content, Fab, CheckBox, Tab, Tabs, TabHeading, SwipeRow, List, ListItem, Text, Separator, Switch } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { IconButton, Button } from 'react-native-paper';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;




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
      marginLeft: 20, 
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
    return (
      <TouchableNativeFeedback onPress={() => this.props.function()} 
      background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
        this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
      >
      <View style={listRow}>
      <View style={listRowPadding}>

      <View style={iconCol}>
      <Icon name={this.props.icon} size={24} color={this.props.colors.gray}/>
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
        </View>
        </View>

      </TouchableNativeFeedback>
    )
  }
}
export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsAreVisible: false,
      hasFingerprintSensor: false,
    };
  }
  static navigationOptions = {
    header: null,
    };
  

triggerOptionsMenu = () => {
  this.state.optionsAreVisible
  ? this.setState({ optionsAreVisible: false })
  : this.setState({ optionsAreVisible: true })
}


logoutAlert = () => {
  Alert.alert(
    'Log out',
    `Do you want to sign out?`,
    [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'cancel',
      },
      {text: 'Sign out', onPress: () => {this.logOut()},
      }
      ],
  );
}
  logOut = () => {
    sendPost("https://api.hideplan.com/logout", "", () => {
    });
    resetKeychain()
    this.props.screenProps.clearCryptoPassword()
  }
  waitForData = () => {
    //TODO optimize
  
    if (this.props.screenProps.isLoadingData) {
      setTimeout(() => { this.waitForData() }, 300)
    }
    else {
      setTimeout(() => {
        this.props.navigation.setParams({
          darkTheme: this.props.screenProps.darkTheme,
        }, 100)
      })
      return
    }
  }
  
  checkSensor = () => {
    FingerprintScanner.isSensorAvailable().then(() => {
      this.setState({ hasFingerprintSensor: true })
    }).catch(error => {
      this.setState({ hasFingerprintSensor: false })

    })
  }

  
  componentWillMount() {
   
  this.waitForData()
  this.checkSensor()
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
title={"Settings"}
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

     
      <ScrollView style={{flex: 1}}>

          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          icon="power"
          text="Log out"
          function={this.logoutAlert}
          colors={this.props.screenProps.colors}
          />
          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Account"
          description="Change password, Delete account"
          icon="account"
          function={() => NavigationService.navigate('AccountSettings')}
          colors={this.props.screenProps.colors}

          />
          {this.state.hasFingerprintSensor
          ?<ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Security"
          description="Fingerprint lock"
          icon="lock"
          function={() => NavigationService.navigate('SecureSettings')}
          colors={this.props.screenProps.colors}

          />
          : null
          }
          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Appearance"
          description="Theme"
          icon="palette"
          function={() => NavigationService.navigate('AppearanceSettings')}
          colors={this.props.screenProps.colors}

          />
                    <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Data"
          description="Tasks, Calendars, Notes"
          icon="settings-outline"
          function={() => NavigationService.navigate('DataSettings')}
          colors={this.props.screenProps.colors}

          />
          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Notifications"
          description="Updates, Invites"
          icon="bell-outline"
          function={() => NavigationService.navigate('NotificationsSettings')}
          colors={this.props.screenProps.colors}

          />
          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Contact developer"
          description="Report bugs, Ask for help"
          icon="email-outline"
          function={() => Linking.openURL('mailto:hello@hideplan.com').catch((err) => console.error('An error occurred', err)) }
          colors={this.props.screenProps.colors}

          />
          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="About Hideplan"
          icon="information-outline"
          function={() => NavigationService.navigate('AboutSettings')}
          colors={this.props.screenProps.colors}

          />
          {/*

          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Privacy policy"
          function={() => Linking.openURL('https://hideplan.com/privacy_app.html').catch((err) => console.error('An error occurred', err))}
          />
          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Terms of service"
          function={() => Linking.openURL('https://hideplan.com/terms.html').catch((err) => console.error('An error occurred', err))}
          />
          */
          }
      
      </ScrollView>

      
    </View>
    {this.state.optionsAreVisible
    ?    <OptionsMenu 
    triggerOptionsMenu={this.triggerOptionsMenu}
    optionsList={["yes", "no"]}
    />
    : null
    }

    </View>


    );
  }
}


module.exports = SettingsScreen;
