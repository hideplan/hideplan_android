import React from "react";
import { Dimensions, Keyboard, ActivityIndicator, TouchableNativeFeedback, View, Alert, StatusBar, ScrollView } from "react-native"
import { AsyncStorage } from "react-native"
import { Content, Card, CardItem, Body, Text, Icon, Item, Label } from 'native-base';
import { Toast, Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import { resetKeychain } from '../../encryptionFunctions';
import { Container, Header, Left, Right, Title, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { HeaderIcon, AppHeader } from '../../customComponents.js';
import { Spinner } from 'native-base';
import { sendPost } from '../../functions.js';
<script src="http://localhost:8097"></script>
import { Button, IconButton } from 'react-native-paper';
import { Snackbar } from 'react-native-paper';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
<script src="http://localhost:8097"></script>


class Separator extends React.Component {
  render() {
    const customHeight = this.props.height;
    return (
      <View style={{height: customHeight, width: "100%"}}>
      </View>
    )
  }
}



class Warning extends React.Component {
  render() {
    return (
      <View>
        <Text>{this.props.warning}</Text>
      </View>
    )
  }
}


class Password extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: "",
      newPassword: "",
      repeatedPassword: "",
      wrongOldPassword: "",
      wrongNewPassword: "",
      wrongRepeatedPassword: "",
      isLoading: false,
      snackbarVisible: false,
      snackbarText: ""

    };

  }


  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }


  changedPassword = () => {
    this.setState({ isLoading: false, oldPassword: "", newPassword: "", repeatedPassword: "" })
    this.showSnackbar("Password was changed")

  }


  wrongPassword = () => {
    this.setState({ oldPasswordWarning: true, isLoading: false, oldPassword: "" })
    this.showSnackbar("Your current password is wrong")
  }

 

  validateForm = () => {
  // Check length
  Keyboard.dismiss()
  if (this.state.oldPassword.length < 1 || this.state.newPassword.length < 1 || this.state.repeatedPassword.length < 1) {
    this.showSnackbar("Please fill the form")
  } else {
    if(this.checkPasswordMatch()) {
      sendPost("https://api.hideplan.com/change/password", {oldPassword: this.state.oldPassword, newPassword: this.state.newPassword}, this.changedPassword, this.wrongPassword)
    }

  }
 
  }

  checkIfFilled = () => {
    this.state.oldPassword.length > 0 && this.state.newPassword.length > 0 && this.state.repeatedPassword.length > 0 
    ? true
    : false
  }

  checkPasswordMatch = () => {
    if (this.state.newPassword === this.state.repeatedPassword) {
      this.setState({ wrongNewPassword: false, wrongRepeatedPassword: false })
      return true
    } else {
      this.setState({ wrongNewPassword: true, wrongRepeatedPassword: true })
      this.showSnackbar("New passwords aren't matching")
      return false
    }

  }
  failedPassword = () => {

  }
  showSnackbar = (text) => {
 
    this.setState({ snackbarVisible: true, snackbarText: text })
  }
  hideSnackbar = () => {

    this.setState({ snackbarVisible: false })
  }

  
  changePassword = () => {
    sendPost(
      "https://api.hideplan.com/change/password",
      {
        username: this.state.username,
        password: this.state.password,
      }, this.registered, this.failedRegistration
    )
  }

  registered = () => {
    this.setState({ warning: "Success! You will be redirected" })
    this.saveToLocal("user", this.state.username)
  }


  componentDidMount() {

  }


  render() {
    const buttonWrapper = {
      width: "100%", 
      justifyContent: "center",
      alignItems: "center"
    }
    const snackTheme = {
      colors: {
        accent: "#9fa8da",
      },
    };
    return (
      <View style={{flex: 1}}>
              <View style={{flex: 1}}>

        <ScrollView 
        style={{flex: 1, minHeight: HEIGHT}}
        >
          <Input 
          darkTheme={this.props.darkTheme} 
          label="Current password" 
          secureTextEntry={true} 
          icon={true}
          value={this.state.oldPassword}
          onChangeText={(oldPassword) => this.setState({ oldPassword })}   primaryColor={this.props.colors.primary}
          colors={this.props.colors}
          textColor={this.props.colors.primaryText}
          />
<Separator height={25} />

<Input 
          darkTheme={this.props.darkTheme} 
          label="New password" 
          secureTextEntry={true} 
          icon={true}
          value={this.state.newPassword}
          onChangeText={(newPassword) => this.setState({ newPassword })}   primaryColor={this.props.colors.primary}
          colors={this.props.colors}
          textColor={this.props.colors.primaryText}
          />
<Separator height={25} />

<Input 
          darkTheme={this.props.darkTheme} 
          label="Confirm new password" 
          secureTextEntry={true} 
          icon={true}
          value={this.state.repeatedPassword}
          onChangeText={(repeatedPassword) => this.setState({ repeatedPassword })}   primaryColor={this.props.colors.primary}
          colors={this.props.colors}
          textColor={this.props.colors.primaryText}
          />


<Separator height={50} />

<View style={buttonWrapper}>

{this.state.oldPassword.length < 1
? 
<Button disabled={true} mode="contained" style={{backgroundColor: this.props.colors.primary, color: this.props.colors.primaryText}} dark={this.props.darkTheme ? false : true}>
Confirm
              </Button>
: <Button mode="contained" style={{backgroundColor: this.props.colors.primary, color: this.props.colors.primaryText}} dark={this.props.darkTheme ? false : true} onPress={() => this.validateForm()}>
Confirm
              </Button>
}         
                      </View>


        </ScrollView>
        </View>

        <Snackbar
          theme={snackTheme}
          style={{bottom: 0}}
          visible={this.state.snackbarVisible}
          onDismiss={() => this.hideSnackbar()}
          action={{
            color:this.props.colors.primary,
            label: 'Dismiss',
            onPress: () => {
              // Do something
              this.hideSnackbar()
            },
          }}
        >
          {this.state.snackbarText}
        </Snackbar>
           </View>
   


    )
  }
}


export default class ChangePasswordScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme
    return (
      <Container>
                  <StatusBar backgroundColor={this.props.screenProps.colors.header} barStyle={darkTheme ? "light-content" : "dark-content"} />

<AppHeader style={headerStyle}
screen="screen"
darkTheme={this.props.screenProps.darkTheme}
colors={this.props.screenProps.colors}
title={"Change password"}
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
     
           <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface }}>

           <View style={{ flex: 1}}>
        <Password
        darkTheme={this.props.screenProps.darkTheme}
        triggerSpinner={this.triggerSpinner}
        createToast={this.createToast}
        colors={this.props.screenProps.colors}
        />
            </View>
            </View>
           
      </Container>
    );
  }
}

module.exports = ChangePasswordScreen;
