import React from "react";
import { Linking, StatusBar, Alert, Button, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback } from "react-native"
import { View, Dimensions, AsyncStorage, TextInput } from "react-native"
import {sendPost} from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { resetKeychain } from '../../encryptionFunctions';
import { AlertModal } from '../../customComponents';

import { HeaderIcon, FabIcon, ActionBar } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, CheckBox, Tab, Tabs, TabHeading, SwipeRow, List, ListItem, Text, Separator, Switch } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

class OptionsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionName: ""
    };
  }

  saveOption = () => {
    let timestamp = new Date().getTime()
    let optionName = this.state.optionName
    let calendarObj
    let uuid = createId("calendar")

    calendarObj = JSON.stringify({calendar: this.state.calendar, color: color, isChecked: true})

      let encryptedData = encryptData(calendarObj, this.props.cryptoPassword)

      this.props.saveNewItem({
        "uuid": uuid, "data": encryptedData, "updated": timestamp, "type": "calendars", "parrent": "", "shared": "" }, {"uuid": uuid, "calendar": calendar, "color": color, "isChecked": true}, "calendars", "Calendar created")
    


  
    NavigationService.navigate('Calendar')

    }

    selectOption = (color) => {
      this.setState({ color: color, colorsVisible: false })
    }
    renderOptions = (optionsList) => {
      return optionsList.map(item => {
        return <TouchableNativeFeedback onPress={() => this.selectOption(item)}>
          <View style={{width: "100%", paddingLeft: 14, paddingRight: 14, paddingBottom: 7, paddingTop: 7}}>
          <Text style={{color: this.props.darkTheme ? "white" : "black", fontSize: 18}}>
            {item.text}
          </Text>
          </View>

        </TouchableNativeFeedback>
      
      })
    }
  
    render() {

      const textBoxStyle = {
        width: "100%",
        padding: 8

      }
      const textStyle = {
        color: "white",
        fontSize: 18,
        padding: 4,
      }
      const floatRow = {
        height: 40,
        width: "100%",

        flexDirection: "row",
        padding: 5,
      }
     
  
      return (
        <TouchableWithoutFeedback onPress={() => this.props.triggerOptionsMenu()}>

    <View style={{ width: WIDTH, height: HEIGHT, position: "absolute", backgroundColor: "#00000077", alignItems: "center", justifyContent: "center" }}>
    <View style={{borderRadius: 8, width: WIDTH - 40, height: (HEIGHT / 6) * 4 ,  backgroundColor: "#202526", padding: 14, elevation: 8}}>
    <ScrollView>
    {this.renderOptions(this.props.optionsList)}
  </ScrollView>
  </View>
  </View>

 

        </TouchableWithoutFeedback>
      )
  
    }
  }


class ListHeader extends React.Component {

  render() {

    const listHeaderRow = {
      width: "100%",
      padding: 12,
      paddingLeft: 20,
      backgroundColor: this.props.darkTheme ? "#17191d" : "white",
      justifyContent: "center",
    }

    const listHeaderText = {
      color: this.props.darkTheme ? "mintcream" : "black",
      fontSize: 18,
      fontFamily: 'Poppins-Bold', 
      includeFontPadding: false
    }

    return (
      <View style={listHeaderRow}>
        <Text style={listHeaderText}>
          {this.props.text}
          </Text>
        </View>
    )
  }
}

class ListRow extends React.Component {

  render() {
    
    const listRow = {
      width: "100%",
      padding: 12,
      paddingLeft: 20,
      justifyContent: "center",
      borderBottom: "gray",
      borderBottomWidth: 0.4
    }

    const listText = {
      color: this.props.darkTheme ? "mintcream" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false
    }

    return (
      <TouchableNativeFeedback onPress={() => this.props.function()}>
      <View style={listRow}>
        <Text style={listText}>
          {this.props.text}
          </Text>
        </View>
      </TouchableNativeFeedback>
    )
  }
}
class ListRowTheme extends React.Component {
  setMenuRef = ref => {
    this._menu = ref;
  };

  hideMenu = () => {
    this._menu.hide();
  };

  showMenu = () => {
    this._menu.show();
  };
  changeTheme = (theme) => {
    this.props.function(theme)
  }
  render() {
    
    const listRow = {
      width: "100%",
      padding: 12,
      paddingLeft: 20,
      borderBottom: "gray",
      borderBottomWidth: 0.4,
      flexDirection: "row",
      height: 50
    }
    const listRowLeft = {
      width: "70%",
      justifyContent: "center",

    }
    const listRowRight = {
      width: "30%",
      justifyContent: "center",
      padding: 0,
      margin: 0
    }

    const listText = {
      color: this.props.darkTheme ? "mintcream" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false
    }

    return (
      <View style={listRow}>
        <View style={listRowLeft}>
        <Text style={listText}>
          {this.props.text}
          </Text>
        </View>
        <View style={listRowRight}>
        
        <Menu
          ref={this.setMenuRef}
          style={{ backgroundColor: this.props.darkTheme ? "#373E40" : "#485154",fontSize: 16, padding: 0, margin: 0
        }}
      button={<Text style={{color: this.props.darkTheme ? "mintcream" : "black"}} onPress={this.showMenu}>{this.props.darkTheme ? "Dark" : "Light"}</Text>}>
              

          <MenuItem 
          textStyle={{color: this.props.darkTheme ? "dodgerblue" : "white", fontSize: 16 }} 
          onPress={() => this.changeTheme(true)}>Dark</MenuItem>
                   <MenuItem 
          textStyle={{color: this.props.darkTheme ? "dodgerblue" : "white", fontSize: 16 }} 
          onPress={() => this.changeTheme(false)}>Light</MenuItem>
          </Menu>
        </View>
        </View>

    )
  }
}
export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionsAreVisible: false
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
  

  
  componentWillMount() {
   
  this.waitForData()
  
  }
  
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.darkTheme ? '#17191d' : "#F7F5F4",
      color: this.props.screenProps.darkTheme ? 'white' : "black",
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme

    return (
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4"}}>
 <Header 
        style={headerStyle}
        >
                      <StatusBar backgroundColor={darkTheme ? "#17191d" : "mintcream"} barStyle={darkTheme ? "light-content" : "dark-content"} />

          <Left>
          <HeaderIcon headerIcon="md-arrow-back" color={darkTheme ? "white" : "black"} headerFunction={() => {
        this.props.navigation.goBack(null)
        }} />
            </Left>
          <Body>
            <Title style={{color: darkTheme ? "white" : "black",fontFamily: 'Poppins-Bold'}}>Settings</Title>
          </Body>
          <Right>
          <HeaderIcon headerIcon="md-refresh" color="rgba(27, 23, 37, 0)" headerFunction={() => {
         
        }} />
         
            </Right>

</Header>
<View style={{flex: 1}}>

     
      <ScrollView style={{flex: 1}}>
        <ListHeader 
          darkTheme={darkTheme}
          text="Account"
          />
          <ListRow 
          darkTheme={darkTheme}
          text="Log out"
          function={this.logoutAlert}
          />
          {/*DISABLED UNTIL FIX
          <ListRow 
          darkTheme={darkTheme}
          text="Change password"
          function={() => NavigationService.navigate('ChangePassword')}
          />
          */
          }
          <ListRow 
          darkTheme={darkTheme}
          text="Delete account"
          function={() => NavigationService.navigate('DeleteAccount')}
          />
  
          {/*DISABLED UNTIL FIX
                  <ListHeader 
          darkTheme={darkTheme}
          text="General"
          />
          <ListRowTheme 
          darkTheme={darkTheme}
          text="Theme"
          function={this.props.screenProps.triggerDarkTheme}
          />
          */
        }
          <ListHeader 
          darkTheme={darkTheme}
          text="Application"
          />
          <ListRow 
          darkTheme={darkTheme}
          text="Report problem"
          function={() => Linking.openURL('mailto:hello@hideplan.com').catch((err) => console.error('An error occurred', err)) }
          />
          <ListRow 
          darkTheme={darkTheme}
          text="Privacy policy"
          function={() => Linking.openURL('https://hideplan.com/privacy_app.html').catch((err) => console.error('An error occurred', err))}
          />
          <ListRow 
          darkTheme={darkTheme}
          text="Terms of service"
          function={() => Linking.openURL('https://hideplan.com/terms.html').catch((err) => console.error('An error occurred', err))}
          />
      
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
