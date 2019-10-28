import React from "react";
import { Linking, StatusBar, Alert, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback, Modal } from "react-native"
import { View, Dimensions, AsyncStorage, TextInput } from "react-native"
import {sendPost} from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { resetKeychain } from '../../encryptionFunctions';
import { AlertModal } from '../../customComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { MyDialog, HeaderIcon, FabIcon, ActionBar, AppHeader } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Title, Content, Fab, CheckBox, Tab, Tabs, TabHeading, SwipeRow, List, ListItem, Text, Separator, Spinner} from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, IconButton, Paragraph, Dialog, RadioButton } from 'react-native-paper';

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

class ThemeContent extends React.Component {

  action = (item) => {
    this.props.func(item.value), 
    this.props.hideModal()
}
  renderContent = () => {
    return (
      this.props.options.map(item => {
        return (
          <TouchableNativeFeedback onPress={() => this.action(item)}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
          >
            <View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-start", paddingTop: 16, paddingBottom: 16}}>
          { this.props.themeSettings == item.name
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
export default class AppearanceSettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
 
      dialogModalVisible: false,
      dialogVisible: false
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


  hideModal = () => {
    this.setState({ dialogModalVisible: false, dialogVisible: false})
  }
  showModal = () => {
    this.setState({ dialogModalVisible: true, dialogVisible: true })
  }
  
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme

    return (
      <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface}}>
           <StatusBar backgroundColor={this.props.screenProps.colors.header} barStyle={darkTheme ? "light-content" : "dark-content"} />

<AppHeader style={headerStyle}
screen="screen"
darkTheme={this.props.screenProps.darkTheme}
colors={this.props.screenProps.colors}
title={"Appearance"}
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
          text="Theme"
          primaryColor={this.props.screenProps.primaryColor}
          colors={this.props.screenProps.colors}

          />
          <ListRow 
          darkTheme={darkTheme} colors={this.props.screenProps.colors} 
          text="Theme"
          description={this.props.screenProps.themeSettings}
          icon="invert-colors"
          function={() => this.showModal()}
          colors={this.props.screenProps.colors}

          />
        
      </ScrollView>

      
    </View>
    {this.props.screenProps.isUpdating
      ? <LoadingSpinner 
      colors={this.props.screenProps.colors}
      primaryColor={this.props.screenProps.primaryColor}
      />
      : null
      }
        {this.state.dialogModalVisible
? <MyDialog
colors={this.props.screenProps.colors}
darkTheme={this.props.screenProps.darkTheme}
hide={this.hideModal}
title={"Select theme"}
content={() => {return  <ThemeContent 
  colors={this.props.screenProps.colors}
  darkTheme={this.props.screenProps.darkTheme}
  themeSettings={this.props.screenProps.themeSettings}
  options={[{name: "Light", value: "light"}, {name: "Dark", value: "dark"}, {name: "System default", value: "system"}]}
  hideModal={this.hideModal}
  func={this.props.screenProps.triggerTheme}

  />
  }}
/>
: null
}
 
    </View>


    );
  }
}


module.exports = AppearanceSettingsScreen;
