import React from "react";
//import "./Register.css";
import { Keyboard, Dimensions, View, Text, TouchableNativeFeedback, Alert, ActivityIndicator, ScrollView } from "react-native"
import { AsyncStorage } from "react-native"
import { TextInput, HelperText } from 'react-native-paper';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
import { HeaderIcon } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading, SwipeRow, Spinner } from 'native-base';
import { Toast } from '../../customComponents.js';
import { sendPostAsync, parse } from '../../functions.js';
import { Button } from 'react-native-paper';

import Ionicons from 'react-native-vector-icons/Ionicons';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
<script src="http://localhost:8097"></script>
class LoadingSpinner extends React.Component {

  render() {
    return (
          <View style={{backgroundColor: "rgba(28, 28, 28, 0.9)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 0, flex: 1, height: HEIGHT, width: WIDTH, elevation: 7}}>
          <Spinner color={this.props.primaryColor} />
          <Text style={{ fontSize: 20, textAlign: "center", color: "mintcream" }}>Checking credentials</Text>
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

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      labelUsername: "Username",
      labelPassword: "Password",
      failedAuthentication: false,
      usernameError: false,
      passwordError: false,
      isLoading: false,
      buttonIsDisabled: false
    };
    this.failedAuthentication = this.failedAuthentication.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.logIn = this.logIn.bind(this);
    this.saveToLocal = this.saveToLocal.bind(this);
    this.logginSuccess = this.logginSuccess.bind(this);
    this.post = this.post.bind(this);

  }

  post(url, content, callback, callback2) {
    this.setState({ isLoading: true })
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {

          if (xhr.responseText) {
            if (xhr.responseText === "response") {
              callback.call();
            } else {
              callback2(xhr.responseText);
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

  handleChange(event) {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }

  async saveToLocal(key, text) {
    //REMOVE PREVIOUS AFTER LOGOUT
    /*  let keys = ['text', 'user'];
    AsyncStorage.multiRemove(keys, (err) => {
  // keys k1 & k2 removed, if they existed
  // do most stuff after removal (if you want)
}); */

  
   
    try {
      await AsyncStorage.setItem(key, text);
   
      this.props.isLogged();
    } catch (error) {
      // Error saving data
    }
  }




  logIn() {
    this.props.triggerSpinner(true)
    this.setState({ isLoading: true })
    sendPostAsync("https://api.hideplan.com/login", {
      username: this.state.username,
      password: this.state.password,
      timestamp: parse(new Date()).toString()
    }).then((res) => {
      this.props.triggerSpinner(false)
      console.log(res)
      if (res == "resolved") {
        this.logginSuccess()
      } else {
        this.failedAuthentication()
      }
    }).catch((error) => {
      this.props.triggerSpinner(false)
      if (error) {
        this.props.createToast("Connection error", "warning", 4000)
      }
      console.log(error);
    })
  }

  logginSuccess = () => {
    this.setState({ isLoading: false, wrongPassword: false, wrongUsername: false })
    this.props.sqlInsert("user", "username", [this.state.username]).then(() => {
      this.saveToLocal("user", this.state.username)
      this.props.logUser()
    }) 

    
  }

  
  failedAuthentication(text) {
    if (text === "username") {
      this.setState({ isLoading: false })
      this.props.createToast("Wrong credentials", "warning", 4000)
    } else {
      this.setState({ isLoading: false})
      this.props.createToast("Wrong credentials", "warning", 4000)
    }
  }

  validateButton = () => {
    this.state.username.length < 1 || this.state.password.length < 1 
    ? this.setState({ buttonIsDisabled: true })
    : this.setState({ buttonIsDisabled: false })
  }



  render() {
    const buttonStyle = {
      padding: 8,
      backgroundColor: this.props.primaryColor,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: this.props.primaryColor,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4,
      width: WIDTH / 4
    }
    const buttonStyleDisabled = {
      padding: 8,
      backgroundColor: "gray",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'gray',
      justifyContent: "center",
      alignItems: "center",
      width: WIDTH / 4

    }
    const buttonText = {
      color: "mintcream",
      fontFamily: 'Poppins-Regular', includeFontPadding: false,

      fontSize: 16,
    }
    const buttonWrapper = {
      width: "100%", 
      justifyContent: "center",
      alignItems: "center"
    }
    const colors = {primary: "#9fa8da", primaryText: "#141414", surface: "#121212", header: "#1f1f1f", ripple: "rgba(255,255,255, 0.10)", modal: "#282828", text: "rgba(255,255,255, 0.87)", gray: "rgba(255,255,255, 0.60)", border: "rgba(255,255,255, 0.20)", }
    return (
      <ScrollView style={{ flex: 1, minHeight: HEIGHT }}>
      <Input 
        label={this.state.labelUsername}
        error={this.state.usernameError}
        onChangeText={(username) => this.setState({ username, labelUsername: "Username", usernameError: false }, this.validateButton())}
        value={this.state.username}
        colors={colors}
        darkTheme={true}
      />
   
                  <Separator height={25} />

       <Input 
        label={this.state.labelPassword}
        error={this.state.passwordError}
        onChangeText={(password) => this.setState({ password, labelPassword: "Password", passwordError: false }, this.validateButton())}
        value={this.state.password}
        icon={true}
        colors={colors}
        darkTheme={true}
      />
   
      
      <Separator height={50} />

            <View style={buttonWrapper}>

            {this.state.buttonIsDisabled
            ? 
            <Button mode="contained" color={"rgba(255,255,255, 0.60)"} dark={false} >
            Log in
      </Button>
            : <Button mode="contained" color={"#9fa8da"} dark={false} onPress={() => this.logIn()}>
            Log in
      </Button>
            }
            </View>
           
           
            <View style={{ flex: 1, marginTop: 32,marginBottom: 16, justifyContent: "center", }}>
          
        <Text style={{ textAlign: "center", fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,fontSize: 14, color: "white" }}>Don't have account?</Text>
       
        </View>
        <View style={buttonWrapper}>
        <Button mode="outlined" color={"#9fa8da"}style={{borderColor: "#9fa8da"}} dark={false} onPress={() => NavigationService.navigate('RegisterName')}>
    Register
  </Button>
  </View>
       
     
    </ScrollView>
    )
  }
}


export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toastIsVisible: false,
      toastType: "",
      toastText: "",
      toastDuration: "",
      isCheckingCredentials: false
    };
  }
  static navigationOptions = {
    header: null
  };

  triggerSpinner = (value) => {
    Keyboard.dismiss()
    this.setState({ isCheckingCredentials: value })
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
      backgroundColor: '#17191d',
      color: 'mintcream',
      elevation: 0
    }
    const titleStyle = {
      width: "100%", 
    }
    const titleText = {
      fontSize: 40,
      fontWeight: "bold",
      color: "mintcream",
      fontFamily: 'Poppins-ExtraBold',
    }
    const bodyStyle = {
      width: "100%", 
      flex: 1,
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#121212"}}>
          {this.state.toastIsVisible
          ? <Toast toastType={this.state.toastType} text={this.state.toastText} duration={this.state.duration} callback={this.hideToast} colors={this.props.screenProps.colors} />
          : null
        }

      <View style={bodyStyle}>

      <View style={titleStyle}>
        <View style={{width: "70%", padding: 20}}>
      <Text style={titleText}>Hideplan</Text>
      </View>
      </View>
        <LoginForm isLogged={this.props.screenProps.isLogged}
                  logUser={this.props.screenProps.logUser}
                  sqlInsert={this.props.screenProps.sqlInsert}
                  createToast={this.createToast}
                  triggerSpinner={this.triggerSpinner}
                  primaryColor={this.props.screenProps.primaryColor}
          />
             </View>
             {this.state.isCheckingCredentials
      ? <LoadingSpinner 
      primaryColor={"#9fa8da"}/>
      : null
      }
      </View>

    );
  }
}


module.exports = LoginScreen;
