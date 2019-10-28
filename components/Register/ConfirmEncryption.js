import React from "react";
//import "./Register.css";
import { TouchableNativeFeedback, Dimensions, View, Text, TouchableWithoutFeedback, Alert, ActivityIndicator, ScrollView } from "react-native"
import { AsyncStorage } from "react-native"
import { Content, Form, Item, Label, Icon } from 'native-base';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
import CryptoJS from "crypto-js";
import { saveToKeychain, decryptDataCheckPromise } from '../../encryptionFunctions';
import { Toast } from '../../customComponents.js';
import { Button } from 'react-native-paper';
import { parse } from "../../functions";

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


class PasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cryptoPassword: "",
      isLoading: false,
      buttonIsDisabled: true,
      cryptoPasswordError: false,
      cryptoLabel: "Encryption password"
    };

   


  }


  validateForm = () => {
    if (this.state.cryptoPassword.length < 4) {
      this.wrongPassword("Your password is too short");
    }
    else {
      this.checkPasswordMatch()
    }

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
    } catch (error) {
      // Error saving data
    }
  }

  verifyCryptoPassword = () => {
    // Decrypt dummy encrypted text with prompted CryptoPassword for verification
    decryptDataCheckPromise(this.props.dummyEncryptionText, this.state.cryptoPassword).then(() => {
      this.props.sqlInsert("settings", "uuid, data, type, updated, needSync", ["useFingerprint", "false", "settings", parse(new Date()).toString(), "false"])
      this.props.sqlInsert("settings", "uuid, data, type, updated, needSync", ["lockTimeout", "0", "settings", parse(new Date()).toString(), "false"])

      saveToKeychain(this.props.username, this.state.cryptoPassword, this.props.loadAppData) 
    }).catch((error) => {
      this.props.createToast("Wrong encryption password", "warning", 4000)

      if (error) {
        this.props.createToast("Wrong encryption password", "warning", 4000)
      }
      console.log(error);
    })
  }

  setCryptoPassword = () => {
    // Set new Crypto password or check and save old Crypto password if already created
    this.props.dummyEncryptionText
    ? this.verifyCryptoPassword()
    : saveToKeychain(this.props.username, this.state.cryptoPassword,  this.props.loadAppData())
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

  registered = () => {
    this.setState({ isLoading: false });
    saveToKeychain(this.props.username, this.state.cryptoPassword)
    this.saveToLocal("user", this.props.username)
    this.props.sqlInsert("user", "username", [this.props.username]).then(() =>  this.props.isLogged())

    
  }
  
  validateButton = () => {
    this.state.cryptoPassword.length < 7 
    ? this.setState({ buttonIsDisabled: true })
    : this.setState({ buttonIsDisabled: false })
  }


  cryptoLabel = () => {
    let label;
    this.props.dummyEncryptionText
    ? label = "Your encryption password"
    : label = "Your encryption password"
    return label;
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
  label={this.state.cryptoLabel}
  error={this.state.cryptoPasswordError}
  onChangeText={(cryptoPassword) => this.setState({ cryptoPassword }, this.validateButton())}
  value={this.state.cryptoPassword}
  icon="eye-off"
  colors={colors}
  darkTheme={true}
/>

<Separator height={50} />

      <View style={buttonWrapper}>

{this.state.buttonIsDisabled
? 
<Button disabled={true} mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false}>
                             Confirm
                       </Button>
: <Button mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false} onPress={() => this.setCryptoPassword()}>
Confirm
</Button>
}
</View>

     
    
   
</ScrollView>
    )
  }
}


export default class ConfirmEncryptionScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      toastIsVisible: false,
      toastType: "",
      toastText: "",
      toastDuration: ""
    };
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
          ? <Toast toastType={this.state.toastType} text={this.state.toastText} duration={this.state.duration} callback={this.hideToast} 
          primaryColor={this.props.navigation.state.params.primaryColor}
          colors={this.props.screenProps.colors} 
          />
          : null
        }
      <View style={titleStyle}>
  <View style={{width: "70%", padding: 20}}>
<Text style={titleText}>Hideplan</Text>
</View>
</View>

<View style={bodyStyle}>
        <PasswordForm 
          username={this.props.navigation.state.params.username}
          dummyEncryptionText={this.props.navigation.state.params.dummyEncryptionText}
          loadAppData={this.props.screenProps.loadAppData}
          logUser={this.props.screenProps.logUser}
          isLogged={this.props.screenProps.isLogged}
          sqlInsert={this.props.screenProps.sqlInsert}
          createToast={this.createToast}
          primaryColor={this.props.navigation.state.params.primaryColor}
        
        />


      </View>
      </View>

    );
  }
}

module.exports = ConfirmEncryptionScreen;
