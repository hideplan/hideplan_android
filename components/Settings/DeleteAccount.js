import React from "react";
import { Dimensions, Keyboard, ActivityIndicator, TouchableNativeFeedback, View, Alert, StatusBar } from "react-native"
import { AsyncStorage } from "react-native"
import { Content, Card, CardItem, Body, Text, Icon, Item, Label } from 'native-base';
import { Toast, Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import { resetKeychain } from '../../encryptionFunctions';
import { Container, Header, Left, Right, Title, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { HeaderIcon, AppHeader } from '../../customComponents.js';
import { Spinner } from 'native-base';
import { sendPostAsync } from '../../functions.js';
<script src="http://localhost:8097"></script>
import { Button, IconButton } from 'react-native-paper';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

class LoadingSpinner extends React.Component {

  render() {
    return (
      <View style={{backgroundColor: this.props.colors.surface, justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 0, flex: 1, height: HEIGHT, width: WIDTH, elevation: 7}}>
          <Spinner color={this.props.colors.primary} />
          <Text style={{ fontSize: 20, textAlign: "center", color: "mintcream" }}>Deleting account</Text>
          </View>
    );
  }
}
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


class Delete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      isLoading: false,
      toastIsVisible: false, 
      toastType: "", 
      toastText: "",
      toastDuration: "",
      buttonIsDisabled: false
    };

  }
  createToast = (toastText, toastType, toastDuration ) => {
    this.setState({ 
      toastIsVisible: true, 
      toastType: toastType, 
      toastText: toastText,
      toastDuration: toastDuration
    })
  }

  hideToast = (timeout) => {
    setTimeout(() => {this.setState({ toastIsVisible: false }), 6000 })
  }

  post = (url, content, callback, callback2) => {
    this.setState({ isLoading: true })
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          if (xhr.responseText) {
            if (xhr.responseText === "response") {
              callback.call();
            } else {
              callback2.call();
            }
          }
        } else {
          console.error(xhr.statusText);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(xhr.statusText);
    };
    xhr.open("POST", url, true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.withCredentials = true;

    xhr.send(
      JSON.stringify({
        content
      })
    );
  }

  han

  userDeleted = () => {
    this.setState({ isLoading: false })
    resetKeychain()
    this.props.clearCryptoPassword()
  }



  wrongPassword = () => {
    this.setState({ oldPasswordWrong: true, isLoading: false })
    this.createToast("Password is wrong", "warning", 4000)
  }

 

  validateForm = () => {
    Keyboard.dismiss()

    this.props.triggerSpinner(true)
    sendPostAsync("https://api.hideplan.com/remove/account", {password: this.state.password}).then((res) => {
      this.props.triggerSpinner(false)

      if (res == "resolved") {
        this.userDeleted()
      } else {
        this.props.createToast("Password is wrong", "warning", 4000)
      }
    }).catch((error) => {
      this.props.triggerSpinner(false)
      if (error) {
        this.props.createToast("Connection error", "warning", 4000)
      }
      console.log(error);
    })
  }

  checkIfFilled = () => {
    this.state.oldPassword.length > 0 && this.state.newPassword.length > 0 && this.state.repeatedPassword.length > 0 
    ? true
    : false
  }


  failedPassword = () => {

  }

   saveToLocal = async(key, text) => {
    //REMOVE PREVIOUS AFTER LOGOUT
    /*  let keys = ['text', 'user'];
    AsyncStorage.multiRemove(keys, (err) => {
  // keys k1 & k2 removed, if they existed
  // do most stuff after removal (if you want)
}); */


    try {
      await AsyncStorage.setItem(key, text);
    } catch (error) {
      // Error saving data
    }
  }


  componentDidMount() {

  }


  render() {
    const buttonStyle = {
      padding: 8,
      backgroundColor: "dodgerblue",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'dodgerblue',
      justifyContent: "center",
      alignItems: "center",
      elevation: 4
    }
    const buttonStyleDisabled = {
      padding: 8,
      backgroundColor: "gray",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'gray',
      justifyContent: "center",
      alignItems: "center",
    }
    const buttonText = {
      color: "mintcream",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,

    }
    const buttonWrapper = {
      width: "100%", 
      justifyContent: "center",
      alignItems: "center"
    }
    return (

      <View style={{flex: 1}}>
      {this.state.toastIsVisible
        ? <Toast toastType={this.state.toastType} text={this.state.toastText} duration={this.state.duration} callback={this.hideToast}/>
        : null
        }
          <Input 
          darkTheme={this.props.darkTheme} 
          label="Delete account" 
          placeholder="Type your password to confirm deleting" secureTextEntry={true} 
          icon={true}
          value={this.state.password}
          onChangeText={(password) => this.setState({ password })}   primaryColor={this.props.colors.primary}
          colors={this.props.colors}
  textColor={this.props.colors.primaryText}/>
        {this.state.wrongPassword
        ? <Icon name='close-circle' />
        : null
        }
        <LabelBottom 
  text="Confirm with your account password"
  gray={this.props.colors.gray}
  isVisible={true}
/>
         

 
<Separator height={50} />

<View style={buttonWrapper}>

{this.state.password.length < 1
? 
<Button disabled={true} mode="contained" style={{backgroundColor: this.props.colors.primary, color: this.props.colors.primaryText}} dark={this.props.darkTheme ? false : true}>
Confirm
              </Button>
: <Button mode="contained" style={{backgroundColor: this.props.colors.primary, color: this.props.colors.primaryText}} dark={this.props.darkTheme ? false : true} onPress={() => this.validateForm()}>
Confirm
              </Button>
}         
                      </View>

     

           </View>

   


    )
  }
}


export default class DeleteAccountScreen extends React.Component {
  static navigationOptions = {
    header: null,
    };
    constructor(props) {
      super(props);
      this.state = {
        toastIsVisible: false,
        toastType: "",
        toastText: "",
        toastDuration: "",
        isDeletingAccount: false,
      };
    }
    triggerSpinner = (value) => {
      Keyboard.dismiss()
      this.setState({ isDeletingAccount: value })
    }

    createToast = (toastText, toastType, toastDuration) => {
      this.setState({
        toastIsVisible: true,
        toastType: toastType,
        toastText: toastText,
        toastDuration: toastDuration
      }, () => this.hideToast())
      
    }
    hideToast = (timeout) => {
      setTimeout(() => { this.setState({ toastIsVisible: false }) }, 6000)
    }
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
title={"Delete account"}
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
           {this.state.toastIsVisible
          ? <Toast toastType={this.state.toastType} text={this.state.toastText} duration={this.state.duration} callback={this.hideToast} />
          : null
        }
           <View style={{ flex: 1}}>
        <Delete
        darkTheme={this.props.screenProps.darkTheme}
        clearCryptoPassword={this.props.screenProps.clearCryptoPassword} 
        triggerSpinner={this.triggerSpinner}
        createToast={this.createToast}
        colors={this.props.screenProps.colors}
        />
            </View>
            </View>
            {this.state.isDeletingAccount
      ? <LoadingSpinner colors={this.props.screenProps.colors} />
      : null
      }
      </Container>

    );
  }
}

module.exports = DeleteAccountScreen;
