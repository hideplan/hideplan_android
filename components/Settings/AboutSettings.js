import React from "react";
import { Linking, StatusBar, Alert, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback } from "react-native"
import { View, Dimensions, AsyncStorage, TextInput } from "react-native"
import {sendPost} from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { resetKeychain } from '../../encryptionFunctions';
import { AlertModal } from '../../customComponents';

import { HeaderIcon, FabIcon, ActionBar } from '../../customComponents.js';
import { AppHeader } from '../../customComponents.js';

import { Container, Header, Left, Body, Right, Title, Content, Fab, CheckBox, Tab, Tabs, TabHeading, SwipeRow, List, ListItem, Text, Separator, Switch } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { IconButton, Button } from 'react-native-paper';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

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
        </View>
        </View>

      </TouchableNativeFeedback>
    )
  }
}
export default class AboutSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  static navigationOptions = {
    header: null,
    };
  


  
  componentWillMount() {
   
  
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
title={"About"}
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
          text="About Hideplan"
          colors={this.props.screenProps.colors}
          primaryColor={this.props.screenProps.colors}
          />
          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Version"
          function={() => Linking.openURL('https://hideplan.com/changelog').catch((err) => console.error('An error occurred', err))}
          />
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
      
      </ScrollView>

      
    </View>
    

    </View>


    );
  }
}


module.exports = AboutSettingsScreen;
