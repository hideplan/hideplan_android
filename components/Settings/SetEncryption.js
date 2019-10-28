import React from "react";
import { ToastAndroid, ActivityIndicator, TouchableNativeFeedback, TouchableWithoutFeedback, View, Text, Alert } from "react-native"
import { AsyncStorage } from "react-native"
import { Content, Card, CardItem, Body, Button, Icon, Item, Input, Label } from 'native-base';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableHighlight,
} from 'react-native';

import { Toast } from '../../customComponents.js';
import * as Keychain from 'react-native-keychain';

const ACCESS_CONTROL_OPTIONS = ['None', 'Passcode', 'Password'];
const ACCESS_CONTROL_MAP = [null, Keychain.ACCESS_CONTROL.DEVICE_PASSCODE, Keychain.ACCESS_CONTROL.APPLICATION_PASSWORD, Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET]

class KeychainSetUp extends React.Component {
  state = {
    username: '',
    password: '',
    repeatedPassword: "",
    status: '',
    biometryType: null,
    accessControl: null,
    toastIsVisible: false,
    toastText: "",
    toastType: "",
    toastDuration: ""
  };

  componentDidMount() {
    Keychain.getSupportedBiometryType().then(biometryType => {
      this.setState({ biometryType });
    });
    this.setState({ username: this.props.username })
  }


  

  async save(accessControl) {
    try {
      await Keychain.setGenericPassword(
        this.state.username,
        this.state.password,
        { accessControl: this.state.accessControl }
      );
      this.setState({ username: '', password: '', status: 'Credentials saved!' });
      this.createToast("Encryption key was stored", "success")

    } catch (err) {
      this.setState({ status: 'Could not save credentials, ' + err });
      this.createToast("Error", "warning")

    }

  }

  async load() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.setState({ ...credentials, status: 'Credentials loaded!' });
      } else {
        this.setState({ status: 'No credentials stored.' });
      }
    } catch (err) {
      this.setState({ status: 'Could not load credentials. ' + err });
    }
  }

  async reset() {
    try {
      await Keychain.resetGenericPassword();
      this.setState({
        status: 'Credentials Reset!',
        username: '',
        password: '',
      });
    } catch (err) {
      this.setState({ status: 'Could not reset credentials, ' + err });
    }
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

  

  savePassword = () => {
    if (this.state.password.length < 1 || this.state.repeatedPassword.length < 1) {
      this.createToast("Please write your password", "warning", 4000)
    } else if (this.state.password !== this.state.repeatedPassword) {
      this.createToast("Your passwords aren't matching", "warning", 4000)
    }
    else if (this.state.password === this.state.repeatedPassword) {
      this.save()

    } else {
      //ToastAndroid.show('A pikachu appeared nearby !', ToastAndroid.SHORT);
    }
  }

  render() {
    return (


  <View style={{flex: 1}}>
   {this.state.toastIsVisible
        ? <Toast toastType={this.state.toastType} text={this.state.toastText} duration={this.state.duration} callback={this.hideToast}/>
        : null
        }
  <Card>
    <CardItem>
      <Body>
        <Text style={{ fontSize: 20 }}>
           Your set up is almost done. Before you can use calendar, you have to choose password for encryption and decryption. This password is stored only locally in Android secure key chain. 
        </Text>
        <Text style={{ fontSize: 20 }}>
        If you forget it, it can't be reset and you won't be able to read you data. Best way to save your password is in password manager like Keepass.
        </Text>
      </Body>
    </CardItem>
  </Card>
  <Card style={{ alignItems: "center", justifyContent: "center" }}>
    <CardItem style={{ alignContent: "center" }}>
      <Body style={{ alignItems:'center',justifyContent:'center' }}>
    
        <Item password>
<Input placeholder="Type your password for encryption"               autoCapitalize="none" secureTextEntry={true} onChangeText={(password) => this.setState({ password })}/>
{this.state.wrongPassword
? <Icon name='close-circle' />
: null
}
</Item>
<Item repeatedPassword>
<Input placeholder="Repeat your password" autoCapitalize="none"
secureTextEntry={true} onChangeText={(repeatedPassword) => this.setState({ repeatedPassword })}/>
{this.state.wrongPassword
? <Icon name='close-circle' />
: null
}
</Item>
      </Body>
    </CardItem>
  </Card>
  <Body style={{ alignItems:'center',
    justifyContent:'center' }}>
     <TouchableNativeFeedback 
     onPress={() => { this.save() }}
     background={TouchableNativeFeedback.Ripple('gray', true)}
     >
      <Button    onPress={() => { this.save() }} large><Text> Save </Text></Button>

           </TouchableNativeFeedback>
           <TouchableNativeFeedback 
     onPress={() => { this.load() }}
     background={TouchableNativeFeedback.Ripple('gray', true)}
     >
      <Button    onPress={() => { this.load() }} large><Text> Load </Text></Button>

           </TouchableNativeFeedback>
           </Body>
  </View>
    )
}
}

class KeychainSetUp2 extends React.Component  {
  state = {
    username: '',
    password: '',
    status: '',
    biometryType: null,
    accessControl: null,
  };

  componentDidMount() {
    Keychain.getSupportedBiometryType().then(biometryType => {
      this.setState({ biometryType });
    });
    this.setState({ username: this.props.username })
  }

  async save(accessControl) {
    try {
      await Keychain.setGenericPassword(
        this.state.username,
        this.state.password,
        { accessControl: this.state.accessControl }
      );
      this.setState({ username: '', password: '', status: 'Credentials saved!' });
    } catch (err) {
      this.setState({ status: 'Could not save credentials, ' + err });
    }
  }

  async load() {
    try {
      const credentials = await Keychain.getGenericPassword();
      if (credentials) {
        this.setState({ ...credentials, status: 'Credentials loaded!' });
      } else {
        this.setState({ status: 'No credentials stored.' });
      }
    } catch (err) {
      this.setState({ status: 'Could not load credentials. ' + err });
    }
  }

  async reset() {
    try {
      await Keychain.resetGenericPassword();
      this.setState({
        status: 'Credentials Reset!',
        username: '',
        password: '',
      });
    } catch (err) {
      this.setState({ status: 'Could not reset credentials, ' + err });
    }
  }

  render() {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <View style={styles.content}>
          <Text style={styles.title}>Keychain Example</Text>
         
          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              password={true}
              autoCapitalize="none"
              value={this.state.password}
              onChange={event =>
                this.setState({ password: event.nativeEvent.text })}
              underlineColorAndroid="transparent"
            />
          </View>
          {Platform.OS === 'ios' && (
            <View style={styles.field}>
              <Text style={styles.label}>Access Control</Text>
              <SegmentedControlIOS
                selectedIndex={0}
                values={this.state.biometryType ? [...ACCESS_CONTROL_OPTIONS, this.state.biometryType] : ACCESS_CONTROL_OPTIONS}
                onChange={({ nativeEvent }) => {
                  this.setState({
                    accessControl: ACCESS_CONTROL_MAP[nativeEvent.selectedSegmentIndex],
                  });
                }}
              />
            </View>
          )}
          {!!this.state.status && (
            <Text style={styles.status}>{this.state.status}</Text>
          )}

          <View style={styles.buttons}>
            <TouchableHighlight
              onPress={() => this.save()}
              style={styles.button}
            >
              <View style={styles.save}>
                <Text style={styles.buttonText}>Save</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.load()}
              style={styles.button}
            >
              <View style={styles.load}>
                <Text style={styles.buttonText}>Load</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => this.reset()}
              style={styles.button}
            >
              <View style={styles.reset}>
                <Text style={styles.buttonText}>Reset</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  content: {
    marginHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '200',
    textAlign: 'center',
    marginBottom: 20,
  },
  field: {
    marginVertical: 5,
  },
  label: {
    fontWeight: '500',
    fontSize: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    backgroundColor: 'white',
    height: 32,
    fontSize: 14,
    padding: 8,
  },
  status: {
    color: '#333',
    fontSize: 12,
    marginTop: 15,
  },
  biometryType: {
    color: '#333',
    fontSize: 12,
    marginTop: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    borderRadius: 3,
    overflow: 'hidden',
  },
  save: {
    backgroundColor: '#0c0',
  },
  load: {
    backgroundColor: '#333',
  },
  reset: {
    backgroundColor: '#c00',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
});
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


class EncryptedPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      encryptionPassword: "",
      repeatedEncryptionPassword: "",
      isLoading: false,
      username: "pejko",
      password: "",
    
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

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }


  changedPassword = () => {
    this.setState({ isLoading: false })
    Alert.alert( "Your password was changed.")

  }


  resetWarningInput = () => {
    this.setState({
      userClass: "register-input input-username",
      passwordClass: "register-input input-password",
      warning: ""
    })
  }

  wrongPassword = () => {
    this.setState({ oldPasswordWring: true, isLoading: false })
    Alert.alert( "Your current password is wrong.")
  }

 

  validateForm = () => {
   if(this.checkPasswordMatch()) {
     this.post("https://api.hideplan.com/change/password", {oldPassword: this.state.oldPassword, newPassword: this.state.newPassword}, this.changedPassword, this.wrongPassword)
   }

  }

  checkIfFilled = () => {
    this.state.oldPassword.length > 0 && this.state.newPassword.length > 0 && this.state.repeatedPassword.length > 0 
    ? true
    : false
  }

  checkPasswordMatch = () => {
    if (this.state.encryptionPassword === this.state.repeatedEncryptionPassword) {
      this.setState({ wrongNewPassword: false, wrongRepeatedPassword: false })
      return true
    } else {
      this.setState({ wrongNewPassword: true, wrongRepeatedPassword: true })
      Alert.alert("Wrong password", "Your new password confirmation does not match your new password")
      return false
    }
     
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

  registerUser = () => {
    this.post(
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

  async save(accessControl, user) {
    try {
      await Keychain.setGenericPassword(
        this.state.username,
        this.state.password,
        { accessControl: this.state.accessControl }
      );
      this.setState({ username: '', password: '', status: 'Credentials saved!' });
    } catch (err) {
      this.setState({ status: 'Could not save credentials, ' + err });
    }
  }
  componentDidMount() {
  }


  render() {
    return (

      <Form style={{ padding: 5}}>
       
       
        <Item floatingLabel old>
          <Label paddingBottom={4}>encryptionPassword</Label>
          <Input secureTextEntry={true} onChangeText={(encryptionPassword) => this.setState({ encryptionPassword })} />
          {this.state.wrongOldPassword
         ? <Icon name='close-circle' />
         : null
         }
        </Item>
        <Item floatingLabel new>
          <Label>repeatedEncryptionPassword </Label>
          <Input secureTextEntry={true} onChangeText={(repeatedEncryptionPassword) => this.setState({ repeatedEncryptionPassword })}/>
          {this.state.wrongNewPassword
          ? <Icon name='close-circle' />
          : null
          }
        </Item>
    
        <Separator height={25} />
        <TouchableWithoutFeedback onPress={() => {this.props.setCredentials(this.props.username, this.state.password, this.props.save)}}>
        <Button full success onPress={() => {this.props.setCredentials()}}>
        
        {this.state.isLoading 
        ? <ActivityIndicator size="small" color="white" />
        : <Text style={{fontSize: 22, color: "white"}}>Save</Text>
        }
        </Button>
        </TouchableWithoutFeedback>

      </Form>
  

   


    )
  }
}


export default class SetEncryptionScreen extends React.Component {
  static navigationOptions = {
    title: 'Change password',
  };
  render() {
    return (
      <View style={{ flex: 1}}>
        {this.props.screenProps.user.length > 1
        ?<KeychainSetUp username={this.props.screenProps.user} setCredentials={this.props.screenProps.setCredentials} save={this.props.screenProps.save} reset={this.props.screenProps.reset} />
        : null 
        }
        

      </View>
    );
  }
}

module.exports = SetEncryptionScreen;
