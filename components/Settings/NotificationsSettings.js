import React from "react";
import { Linking, StatusBar, Alert, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback } from "react-native"
import { View, Dimensions, AsyncStorage, TextInput } from "react-native"
import {sendPost} from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { resetKeychain } from '../../encryptionFunctions';
import { AlertModal } from '../../customComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HeaderIcon, FabIcon, ActionBar, AppHeader} from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Title, Content, Fab, CheckBox, Tab, Tabs, TabHeading, SwipeRow, List, ListItem, Text, Separator, Spinner } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Switch } from 'react-native-paper';
import { IconButton, Button } from 'react-native-paper';

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
      marginLeft: 20, 
      width: WIDTH - 156,
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
export default class NotificationsSettingsScreen extends React.Component {
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
screen="screen"
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
icons={[ ]}
/>

<View style={{flex: 1}}>

     
      <ScrollView style={{flex: 1}}>
        
          <ListHeader 
          darkTheme={darkTheme}
          text="Information"
          colors={this.props.screenProps.colors} 
          />
          <ListRow 
          darkTheme={darkTheme} 
          colors={this.props.screenProps.colors} 
          text="Updates"
          description="Get notification about new release"
          icon="bell-outline"
          option={() => {return <Switch
            color={this.props.screenProps.colors.primary} name="updatesSettings"  value={this.props.screenProps.updatesSettings} onValueChange={() => {this.props.screenProps.triggerHomeSettings("updatesSettings", this.props.screenProps.updatesSettings) }}/> } }

          />
          <ListRow 
          darkTheme={darkTheme} 
          colors={this.props.screenProps.colors} 
          text="Important news"
          description="Get important news from developer"
          icon="email-outline"
          option={() => {return <Switch name="infoSettings" color={this.props.screenProps.colors.primary}  value={this.props.screenProps.infoSettings} onValueChange={() => {this.props.screenProps.triggerHomeSettings("infoSettings", this.props.screenProps.infoSettings) }}/> } }

          />
         
      </ScrollView>

      
    </View>
    {this.props.screenProps.isUpdating
      ? <LoadingSpinner 
      colors={this.props.screenProps.colors}
      />
      : null
      }


    </View>


    );
  }
}


module.exports = NotificationsSettingsScreen;
