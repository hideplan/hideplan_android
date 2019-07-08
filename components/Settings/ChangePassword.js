import React from "react";
import { Keyboard, ActivityIndicator, TouchableWithoutFeedback, View, Text, Alert, StatusBar } from "react-native"
import { AsyncStorage } from "react-native"
import { Content, Form, Item, Input, Label, Button, Icon } from 'native-base';
import { Toast } from '../../customComponents.js';

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


class ChangePassword extends React.Component {
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
      toastIsVisible: false, 
      toastType: "", 
      toastText: "",
      toastDuration: ""
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

  handleChange = (event) => {
    const target = event.target;
    const name = target.name;
    this.setState({ [name]: event.target.value });
  }


  changedPassword = () => {
    this.setState({ isLoading: false, oldPassword: "", newPassword: "", repeatedPassword: "" })
    this.createToast("Password was changed", "success", 4000)

  }


  wrongPassword = () => {
    this.setState({ oldPasswordWarning: true, isLoading: false, oldPassword: "" })
    this.createToast("Your current password is wrong", "warning", 4000)
  }

 

  validateForm = () => {
  // Check length
  Keyboard.dismiss()
  if (this.state.oldPassword.length < 1 || this.state.newPassword.length < 1 || this.state.repeatedPassword.length < 1) {
    this.createToast("Please fill the form", "warning", 4000)
  } else {
    if(this.checkPasswordMatch()) {
      this.post("http://localhost:3001/change/password", {oldPassword: this.state.oldPassword, newPassword: this.state.newPassword}, this.changedPassword, this.wrongPassword)
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
      this.createToast("New passwords aren't matching", "warning", 4000)
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
      "http://localhost:3001/change/password",
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
    return (
      <View style={{ flex: 1 }}>
       {this.state.toastIsVisible
        ? <Toast toastType={this.state.toastType} text={this.state.toastText} duration={this.state.duration} callback={this.hideToast}/>
        : null
        }
      <Form style={{ padding: 5}}>
      
        <Item floatingLabel old>
          <Label paddingBottom={4}>Old password</Label>
          <Input secureTextEntry={true} onChangeText={(oldPassword) => this.setState({ oldPassword })} />
          {this.state.wrongOldPassword
         ? <Icon name='close-circle' />
         : null
         }
        </Item>
        <Item floatingLabel new>
          <Label>New password</Label>
          <Input secureTextEntry={true} onChangeText={(newPassword) => this.setState({ newPassword })}/>
          {this.state.wrongNewPassword
          ? <Icon name='close-circle' />
          : null
          }
        </Item>
        <Item floatingLabel repeat>
          <Label>Repeat new password</Label>
          <Input secureTextEntry={true} type="password" onChangeText={(repeatedPassword) => this.setState({ repeatedPassword })}/>
          {this.state.wrongRepeatedPassword
          ? <Icon name='close-circle' color="red"/>
          : null
          }
        </Item>
        <Separator height={25} />
        <TouchableWithoutFeedback onPress={() => {this.validateForm()}}>
        <Button full success onPress={() => {this.validateForm()}}>
        
        {this.state.isLoading 
        ? <ActivityIndicator size="small" color="white" />
        : <Text style={{fontSize: 22, color: "white"}}>Save</Text>
        }
        </Button>
        </TouchableWithoutFeedback>

      </Form>
      </View>

   


    )
  }
}


export default class ChangePasswordScreen extends React.Component {
  static navigationOptions = {
    title: 'Change password',
  };
  render() {
    return (
      <View style = {{ flex: 1 }}>
        <ChangePassword />
      </View>
    );
  }
}

module.exports = ChangePasswordScreen;
