import React from "react";
//import "./Register.css";
import { Dimensions, TouchableNativeFeedback, View, Text, TouchableWithoutFeedback, Alert, ActivityIndicator, ScrollView } from "react-native"
import { AsyncStorage } from "react-native"
import { Content, Form, Item, Label, Icon } from 'native-base';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
import { Toast } from '../../customComponents.js';
import { Button } from 'react-native-paper';

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


class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      repeatedPassword: "",
      passwordError: false,
      repeatedPasswordError: false,
      isLoading: false,
      buttonIsDisabled: true,
      label: "Password",
    };

  
  }

  wrongPassword = (text) => {
    this.setState({ passwordError: true, repeatedPasswordError: true, isLoading: false,});
    this.props.createToast("Passwords aren't matching", "warning", 4000)
  }


  validateForm = () => {
    this.state.password === this.state.repeatedPassword
    ? NavigationService.navigate('RegisterEncryption', {isLogged:this.props.isLogged, sqlInsert: this.props.sqlInsert, username: this.props.username, password: this.state.password, logUser: this.props.logUser, primaryColor: this.props.primaryColor })
    : this.wrongPassword()
  }


  validateButton = () => {
    this.state.password.length < 7 || this.state.repeatedPassword.length < 7 
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
      fontSize: 16,
    }
    const buttonWrapper = {
      width: "100%", 
      justifyContent: "center",
      alignItems: "center"
    }
    const colors = {primary: "#9fa8da", primaryText: "#141414", surface: "#121212", header: "#333333", ripple: "rgba(255,255,255, 0.10)", modal: "#282828", text: "rgba(255,255,255, 0.87)", gray: "rgba(255,255,255, 0.60)", border: "rgba(255,255,255, 0.20)", }
    return (
      <ScrollView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
 <Input 
  label={this.state.label}
  error={this.state.passwordError}
  onChangeText={(password) => this.setState({ password, label: "Password", passwordError: false, repeatedPasswordError: false }, this.validateButton())}
  value={this.state.password}
  icon="eye-off"
  colors={colors}
  darkTheme={true}

/>
<Separator height={25} />

<Input 
  label="Confirm password"
  error={this.state.repeatedPasswordError}
  onChangeText={(repeatedPassword) => this.setState({ repeatedPassword, repeatedPasswordError: false, passwordError: false, label: "Password" }, this.validateButton())}
  value={this.state.repeatedPassword}
  icon="eye-off"
  colors={colors}
  darkTheme={true}
/>

<LabelBottom 
  text="Choose password with at least 8 characters"
  isVisible={this.state.buttonIsDisabled}
  gray={colors.gray}

/>
<Separator height={40} />
<View style={buttonWrapper}>

{this.state.buttonIsDisabled
? 
<Button disabled={true} mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false} onPress={() => this.validateForm()}>
                             Next
                       </Button>
: 
<Button mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false} onPress={() => this.validateForm()}>
                             Next
                       </Button>
}
</View>
       
        </View>

        <View style={{ flex: 1, width: "100%" }}>


        </View>


      </ScrollView>
    )
  }
}


export default class RegisterPasswordScreen extends React.Component {
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
    const titleStyle = {
      width: "100%", 
      height: HEIGHT / 6,
    }
    const titleText = {
      fontSize: 40,
      fontWeight: "bold",
      color: "mintcream",
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    const bodyStyle = {
      width: "100%", 
      height: (HEIGHT / 6) * 5,
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
        <RegisterForm 
          username={this.props.navigation.state.params.username}
          logUser={this.props.navigation.state.params.logUser}
          isLogged={this.props.navigation.state.params.isLogged}
          sqlInsert={this.props.navigation.state.params.sqlInsert}
          primaryColor={this.props.navigation.state.params.primaryColor}
          createToast={this.createToast}
          />
             </View>

</View>
    );
  }
}

module.exports = RegisterPasswordScreen;
