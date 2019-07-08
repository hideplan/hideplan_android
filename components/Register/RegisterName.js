import React from "react";
//import "./Register.css";
import { TouchableNativeFeedback, Dimensions, View, Text, TouchableWithoutFeedback, Alert, ActivityIndicator } from "react-native"
import { AsyncStorage } from "react-native"
import { Content, Form, Item, Label, Button, Icon } from 'native-base';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import { Toast } from '../../customComponents.js';
import { sendPostAsync } from '../../functions.js';
import NavigationService from '../../NavigationService.js';
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

<script src="http://localhost:8097"></script>


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
      buttonIsDisabled: false,
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

    sendPostAsync("http://localhost:3001/check/username", {username: this.state.username
    }).then((res) => {
      if (res == "resolved") {
        NavigationService.navigate('RegisterPassword', {sqlInsert: this.props.sqlInsert, isLogged: this.props.isLogged, username: this.state.username, logUser: this.props.logUser})
      } else {
        this.wrongUser()
      }
  }
    ).catch((error) => {
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
      backgroundColor: "dodgerblue",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'dodgerblue',
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
      fontSize: 18,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    const buttonWrapper = {
      width: "100%", 
      justifyContent: "center",
      alignItems: "center"
    }
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Input
            label={this.state.label}
            error={this.state.usernameError}
            onChangeText={(username) => this.setState({ username, label: "Username", usernameError: false }, this.validateButton())}
            value={this.state.username}
          />

            <LabelBottom
            text="Write at least 4 characters"
            isVisible={this.state.buttonIsDisabled}
          />
          <Separator height={25} />
          <View style={buttonWrapper}>

            {this.state.buttonIsDisabled
            ? 
            <View style={buttonStyleDisabled}>
              <Text style={buttonText}>
              Next
                </Text>
            </View>
            : <TouchableNativeFeedback onPress={() => this.validateForm()}>
            <View style={buttonStyle}>
              <Text style={buttonText}>
                Next
                </Text>
            </View>
            </TouchableNativeFeedback>
            }
            </View>
          
        </View>

        <View style={{ flex: 1, width: "100%" }}>


        </View>


      </View>
    )
  }
}


export default class RegisterNameScreen extends React.Component {
  static navigationOptions = {
    header: null
  };

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
      <View style={{ flex: 1, backgroundColor: "#1C1C1C"}}>
                {this.props.screenProps.toastIsVisible
          ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} />
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
        />
      </View>
      </View>

    );
  }
}

module.exports = RegisterNameScreen;
