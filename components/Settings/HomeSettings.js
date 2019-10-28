import React from "react";
import { Linking, StatusBar, Alert, Button, ScrollView, TouchableNativeFeedback, TouchableWithoutFeedback, Switch } from "react-native"
import { View, Dimensions, AsyncStorage, TextInput } from "react-native"
import {sendPost} from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { resetKeychain } from '../../encryptionFunctions';
import { AlertModal } from '../../customComponents';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { HeaderIcon, FabIcon, ActionBar } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Title, Content, Fab, CheckBox, Tab, Tabs, TabHeading, SwipeRow, List, ListItem, Text, Separator, Spinner } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      color: this.props.primaryColor,
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
      padding: 16

    }
    const iconCol = {
      width: 40,
      marginRight: 20,
      justifyContent: "center",
      alignItems: "center", 
    }
    const textCol = {
      width: WIDTH - 120,
      justifyContent: "center",
      flexDirection: "column",
    }
    const optionCol = {
      width: 40,
      flex: 1,
      justifyContent: "center",
      alignItems: "center", 
    }

    const listText = {
      color: this.props.darkTheme ? this.props.colors.text : this.props.colors.text,
      fontSize: 16,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false
    }
    const descriptionText = {
      color: this.props.darkTheme ? this.props.colors.gray.s200 : this.props.colors.gray.s800,
      fontSize: 14,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false
    }
    return (
      <TouchableNativeFeedback onPress={() => this.props.function()}>
      <View style={listRow}>
      <View style={listRowPadding}>

      <View style={iconCol}>
      <Icon name={this.props.icon} size={24} color="gray"/>
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
export default class HomeSettingsScreen extends React.Component {
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
 <Header 
        style={headerStyle}
        >
                      <StatusBar
            backgroundColor={this.props.screenProps.colors.header}
            barStyle={darkTheme ? "light-content" : "dark-content"}
          />

          <Left>
          <HeaderIcon headerIcon="arrow-left" color={this.props.screenProps.darkTheme ? this.props.screenProps.colors.gray.s100 : this.props.screenProps.colors.gray.s500 } headerFunction={() => {
        this.props.navigation.goBack(null)
        }} />
            </Left>
          <Body>
            <Title  style={{
                color: this.props.screenProps.colors.text,
                fontFamily: "Poppins-Bold",
                fontWeight: "bold",
                includeFontPadding: false,
                padding: 0,
                margin: 0,
                fontSize: 26
              }}>Home screen</Title>
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
          text="Information"
          primaryColor={this.props.screenProps.colors.primary}
          />
          <ListRow 
          darkTheme={darkTheme} 
          colors={this.props.screenProps.colors} 
          text="Updates"
          description="Get notification about new release"
          icon="bell-outline"
          option={() => {return <Switch name="updatesSettings"  value={this.props.screenProps.updatesSettings} onValueChange={() => {this.props.screenProps.triggerHomeSettings("updatesSettings", this.props.screenProps.updatesSettings) }}/> } }

          />
          <ListRow 
          darkTheme={darkTheme} 
          colors={this.props.screenProps.colors} 
          text="Important news"
          description="Get important news from developer"
          icon="email-outline"
          option={() => {return <Switch name="infoSettings"  value={this.props.screenProps.infoSettings} onValueChange={() => {this.props.screenProps.triggerHomeSettings("infoSettings", this.props.screenProps.infoSettings) }}/> } }

          />
          <View style={{width: "100%", borderBottomWidth: 0.2, borderBottomColor: "gray"}}/>
          <ListHeader 
          darkTheme={darkTheme}
          text="Your data"
          primaryColor={this.props.screenProps.colors.primary}
          />
          <ListRow 
          darkTheme={darkTheme} 
          colors={this.props.screenProps.colors} 
          text="Briefing"
          description="Display future plans"
          icon="information-outline"
          option={() => {return <Switch name="plansSettings"  value={this.props.screenProps.plansSettings} onValueChange={() => {this.props.screenProps.triggerHomeSettings("plansSettings", this.props.screenProps.plansSettings) }}/> } }

          />
      </ScrollView>

      
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


module.exports = HomeSettingsScreen;
