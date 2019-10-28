import React from "react";
//import "./Register.css";
import { TouchableNativeFeedback, Dimensions, View, Text, TouchableWithoutFeedback, Alert, ActivityIndicator, ScrollView } from "react-native"
import { AsyncStorage } from "react-native"
import { Spinner, Content, Form, Item, Label, Icon } from 'native-base';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import { Toast } from '../../customComponents.js';
import { sendPostAsync, parse } from '../../functions.js';
import NavigationService from '../../NavigationService.js';
import { Keyboard } from 'react-native'
import { Button, TextInput } from 'react-native-paper';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

<script src="http://localhost:8097"></script>

class LoadingSpinner extends React.Component {

  render() {
    return (
          <View style={{backgroundColor: "rgba(28, 28, 28, 0.9)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 0, flex: 1, height: HEIGHT, width: WIDTH, elevation: 7}}>
          <Spinner color={"#9fa8da"} />
          <Text style={{ fontSize: 20, textAlign: "center", color: "#EFEFEF" }}>Checking username</Text>
          </View>
    );
  }
}

class Policy extends React.Component {
  render() {
    return (<View>

      <Text>By register you agree to Terms of use, Privacy Policy.</Text>
      <Text>Cookies</Text>
    </View>

    )
  }
}

class Separator extends React.Component {
  render() {
    const customHeight = this.props.height;
    return (
      <View style={{ height: customHeight, width: "100%" }}>
      </View>
    )
  }
}


class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      usernameError: false,
      isLoading: false,
      buttonIsDisabled: true,
      label: "Username"
    };

   
  }

  wrongUser = (text) => {

    this.setState({
      usernameError: true, isLoading: false
    });
    this.props.createToast("Username is taken", "warning", 4000)

  }

  
  validateForm = () => {
    this.props.triggerSpinner(true)
    sendPostAsync("https://api.hideplan.com/check/username", {username: this.state.username
  }).then((res) => {
      this.props.triggerSpinner(false)
      if (res == "resolved") {
        NavigationService.navigate('RegisterPassword', {sqlInsert: this.props.sqlInsert, isLogged: this.props.isLogged, username: this.state.username, logUser: this.props.logUser, primaryColor: this.props.primaryColor})
      } else if (res === "timeout") {
        this.props.triggerSpinner(false)
        this.props.createToast("No connection", "warning", 4000)

      } else {
        this.wrongUser()
      }
  }
    ).catch((error) => {
      this.props.triggerSpinner(false)

      if (error) {
        this.props.createToast("Connection error", "warning", 4000)
      }
      console.log(error);

    })
  }


  validateButton = () => {
    this.state.username.length < 3
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
        <View style={{ flex: 1 }}>
          <Input
            label={this.state.label}
            error={this.state.usernameError}
            onChangeText={(username) => this.setState({ username, label: "Username", usernameError: false }, this.validateButton())}
            value={this.state.username}
            colors={colors}
            darkTheme={true}
          />
         
            <LabelBottom
            text="Write at least 4 characters"
            isVisible={true}
            gray={colors.gray}
          />
          <Separator height={25} />
          <View style={buttonWrapper}>

            {this.state.buttonIsDisabled
            ?
                    <Button disabled={true} mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false}>
                    Next
              </Button>
            :        <Button mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false} onPress={() => this.validateForm()}>
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


export default class RegisterNameScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      isCheckingName: false,
    };   
  }

  triggerSpinner = (value) => {
    Keyboard.dismiss()
    this.setState({ isCheckingName: value })
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
      fontFamily: 'Poppins-ExtraBold',
    }
    const bodyStyle = {
      width: "100%", 
      height: (HEIGHT / 6) * 5,
    }
    return (
      <View style={{ flex: 1, backgroundColor: "#121212"}}>
                {this.props.screenProps.toastIsVisible
          ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} 
          primaryColor={this.props.screenProps.primaryColor}
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
        logUser={this.props.screenProps.logUser} 
        sqlInsert={this.props.screenProps.sqlInsert}
        isLogged={this.props.screenProps.isLogged}
        createToast={this.props.screenProps.createToast}
        triggerSpinner={this.triggerSpinner}
        primaryColor={this.props.screenProps.primaryColor}
        />
      </View>
      {this.state.isCheckingName
      ? <LoadingSpinner 
      primaryColor={this.props.screenProps.primaryColor}
      />
      : null
      }
      </View>

    );
  }
}

module.exports = RegisterNameScreen;
