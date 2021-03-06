import React from "react";
//import "./Register.css";
import { TouchableNativeFeedback, Dimensions, View, Text, TouchableWithoutFeedback, Alert, ActivityIndicator, ScrollView } from "react-native"
import { AsyncStorage } from "react-native"
import { Content, Form, Item, Label, Icon } from 'native-base';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
import CryptoJS from "crypto-js";
import { saveToKeychain } from '../../encryptionFunctions';
import { Toast } from '../../customComponents.js';
import { sendPostAsync, parse } from '../../functions.js';
import { Spinner } from 'native-base';
import { Keyboard } from 'react-native'
import { Button } from 'react-native-paper';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

<script src="http://localhost:8097"></script>

class LoadingSpinner extends React.Component {

  render() {
    return (
          <View style={{backgroundColor: "rgba(28, 28, 28, 0.9)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 0, flex: 1, height: HEIGHT, width: WIDTH, elevation: 7}}>
          <Spinner color={"#9fa8da"} />
          <Text style={{ fontSize: 20, textAlign: "center", color: "#EFEFEF" }}>Registering account</Text>
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


class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      encryptionPassword: "",
      repeatedEncryptionPassword: "",
      isLoading: false,
      buttonIsDisabled: true,
      label: "Password for encryption"
    };

   


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
              if (callback2) {
                callback2.call();
              }
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

 

  validateForm = () => {
    this.state.encryptionPassword === this.state.repeatedEncryptionPassword
    ? this.registerUser()
    : this.wrongPassword("Your passwords didn't match.")
  }



  async saveToLocal(key, text) {
    //REMOVE PREVIOUS AFTER LOGOUT
    /*  let keys = ['text', 'user'];
    AsyncStorage.multiRemove(keys, (err) => {
  // keys k1 & k2 removed, if they existed
  // do most stuff after removal (if you want)
}); */


    try {
      await AsyncStorage.setItem(key, text).then(result => {
        this.props.logUser()
      }
      );
    } catch (error) {
      // Error saving data
    }
  }



  registerUser = () => {
    this.props.triggerSpinner(true)
    let calendarData = this.encryptData(`{"calendar": "My calendar", "color": {"name": "indigo", "s200": "#9fa8da", "s600": "#3949ab"}, "isChecked": true}`)
    let listData = this.encryptData(`{"list": "My tasks", "sortBy": "updated"}`)
    let notebookData = this.encryptData(`{"notebook": "My notebook", "sortBy": "updated"}`)
    let timestamp = parse(new Date()).toString()
    sendPostAsync(
      "https://api.hideplan.com/register",
      {
        username: this.props.username,
        password: this.props.password,
        calendar: {data: calendarData, timestamp: timestamp},
        list: {data: listData, timestamp: timestamp},
        notebook: {data: notebookData, timestamp: timestamp},
        dummy: this.encryptData("Encryption is set")
      }).then((res) => {
        this.props.triggerSpinner(false)
        if (res == "resolved") {
          this.props.sqlInsert("settings", "uuid, data, type, updated, needSync", ["useFingerprint", "false", "settings", parse(new Date()).toString(), "false"])
          this.props.sqlInsert("settings", "uuid, data, type, updated, needSync", ["lockTimeout", "0", "settings", parse(new Date()).toString(), "false"])

          this.logIn()
        } else {
          this.failedRegistration()
        }
      }).catch((error) => {
        this.props.triggerSpinner(false)
        if (error) {
          this.props.createToast("Connection error", "warning", 4000)
        }
        console.log(error);
  
      })
  }

  logIn = () => {
    this.post("https://api.hideplan.com/login", {
      username: this.props.username,
      password: this.props.password,
      timestamp: parse(new Date()).toString()
    }, this.registered)
  }

  wrongPassword = (text) => {
    this.setState({ passwordError: true, repeatedPasswordError: true, isLoading: false, });
    this.props.createToast("Passwords aren't matching", "warning", 4000)
  }

  encryptData = (dataForEncryption) => {
    // Encrypt data

    let data = dataForEncryption.toString()
    let ciphertext = CryptoJS.AES.encrypt(data, this.state.encryptionPassword).toString();
    return ciphertext;
}

  saveEncryption = () => {
    // Save encrypted dummy text for future verification after login, if user has entered encryption password. If not, prompt user to set it
    // Use to verify correct password for encryption in client side
    this.post("https://api.hideplan.com/save/encryption", {
      data: {username: this.props.username,
      dummy: this.encryptData("Encryption is set")
    }}, this.logIn)
  }

  registered = () => {
    this.setState({ isLoading: false });
    saveToKeychain(this.props.username, this.state.encryptionPassword)
    this.saveToLocal("user", this.props.username)
    this.props.sqlInsert("user", "username", [this.props.username]).then(() =>  console.log("sql insert after"), this.props.isLogged())

    
  }

  validateButton = () => {
    this.state.encryptionPassword.length < 7 || this.state.repeatedEncryptionPassword.length < 7
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
    const colors = {primary: "#9fa8da", primaryText: "#141414", surface: "#121212", header: "#333333", ripple: "rgba(255,255,255, 0.10)", modal: "#282828", text: "rgba(255,255,255, 0.87)", gray: "rgba(255,255,255, 0.60)", border: "rgba(255,255,255, 0.20)", }
    return (
      <ScrollView style={{ flex: 1, minHeight: HEIGHT }}>

<Input 
  label={this.state.label}
  error={this.state.passwordError}
  onChangeText={(encryptionPassword) => this.setState({ encryptionPassword }, this.validateButton())}
  value={this.state.encryptionPassword}
  icon="eye-off"
  colors={colors}
  darkTheme={true}

/>
<Separator height={25} />

<Input 
  label="Repeat password for encryption"
  error={this.state.passwordError}
  onChangeText={(repeatedEncryptionPassword) => this.setState({ repeatedEncryptionPassword }, this.validateButton())}
  value={this.state.repeatedEncryptionPassword}
  icon="eye-off"
  colors={colors}
  darkTheme={true}
/>
<LabelBottom 
  text="Choose strong encryption key with at least 8 characters"
  isVisible={true}
  gray={colors.gray}

/>


<Separator height={40} />

<View style={buttonWrapper}>

{this.state.buttonIsDisabled
? 
<Button disabled={true} mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false}>
Confirm
              </Button>
: <Button mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false} onPress={() => this.validateForm()}>
Confirm
              </Button>
}
</View>
<View style={{  paddingLeft: 20, marginBottom: 30, paddingRight: 20 }}>
          <ScrollView style={{marginBottom: 20, padding: 8, borderRadius: 8}}>
    <Text style={{ color: "#B7B7B7", fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,fontSize: 14 }}>
    {"\n"}
    - this password is used only for encrypting and decrypting your content. 
    {"\n"}
    - it is never sent to our server and is securely stored in Android Key Chain.
    </Text>
    <Text style={{ color: "#B7B7B7", fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,fontSize: 14 }}>
    - there is no way to recover it - if you forget encryption password, you will loose all your data, so be careful,
    </Text>
    <Text style={{ color: "#B7B7B7", fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,fontSize: 14 }}>
    - choose strong encryption password different from your account password.
    </Text>
      </ScrollView>
      </View>
   </ScrollView>
    
   
    )
  }
}


export default class RegisterEncryptionScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      toastIsVisible: false,
      toastType: "",
      toastText: "",
      toastDuration: "",
      isRegisteringAccount: false,
    };
  }

  triggerSpinner = (value) => {
    Keyboard.dismiss()
    this.setState({ isRegisteringAccount: value })
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
  componentDidMount () {
    //this.createToast("Please, read more about encryption password", "info", 8000)
  }
  render() {
    const headerStyle = {
      backgroundColor: '#17191d',
      color: 'mintcream',
      elevation: 0
    }
    const titleStyle = {
      width: "100%", 
      height: HEIGHT / 6,
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
          <View style={titleStyle}>
  <View style={{width: "70%", padding: 20}}>
<Text style={titleText}>Hideplan</Text>
</View>
</View>
<View style={bodyStyle}>

        <RegisterForm 
          username={this.props.navigation.state.params.username}
          password={this.props.navigation.state.params.password}
          logUser={this.props.navigation.state.params.logUser}
          isLogged={this.props.navigation.state.params.isLogged}
          sqlInsert={this.props.navigation.state.params.sqlInsert}
          createToast={this.createToast}
          triggerSpinner={this.triggerSpinner}
          primaryColor={this.props.navigation.state.params.primaryColor}

        />


      </View>
      {this.state.isRegisteringAccount
      ? <LoadingSpinner 
      primaryColor={this.props.navigation.state.params.primaryColor}
      />
      : null
      }
      </View>
    );
  }
}

module.exports = RegisterEncryptionScreen;
