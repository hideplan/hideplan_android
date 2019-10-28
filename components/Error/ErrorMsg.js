import React from "react";
//import "./Register.css";
import { StatusBar, Linking, View, Text, TouchableNativeFeedback, Alert, ActivityIndicator, Dimensions, Button } from "react-native"
import { AsyncStorage } from "react-native"
import { TextInput, HelperText } from 'react-native-paper';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon } from '../../customComponents.js';
import { Keyboard } from 'react-native'
import { Spinner } from 'native-base';

<script src="http://localhost:8097"></script>
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;
class LoadingSpinner extends React.Component {

  render() {
    return (
          <View style={{backgroundColor: "rgba(28, 28, 28, 0.9)", justifyContent: "center", alignItems: "center", position: "absolute", top: 0, left: 0, flex: 1, height: HEIGHT, width: WIDTH, elevation: 7}}>
          <Spinner color='dodgerblue' />
          <Text style={{ fontSize: 20, textAlign: "center", color: "mintcream" }}>Checking username</Text>
          </View>
    );
  }
}
class ErrorSvg extends React.Component {
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
  }
  render() {
    const titleText = {
      fontSize: 26,
      alignSelf: "center",
      color: "mintcream",
      fontFamily: 'Poppins-Bold',
      padding: 4,
    }

    const bodyText = {
      fontSize: 20,
      color: "mintcream",
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
      alignSelf: "center",
      alignText: "center"
    }
    const bodyStyle = {
      flex: 1,
    }
    const column = {
      width: "100%",
      flex: 1,

    }

    const longRow = {
      width: "100%",
      paddingLeft: 40,
      paddingRight: 40,

    }
    const buttonWrapper = {
      paddingTop: 10,
      width: "100%", 
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,

    }
    const buttonStyle = {
      padding: 8,
      backgroundColor: "dodgerblue",
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'dodgerblue',
      justifyContent: "center",
      alignItems: "center",
      elevation: 10,
      zIndex: 2,

    }
    const buttonText = {
      color: "mintcream",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,

    }
    return (
      <View style={bodyStyle}>
        <View style={{width: "100%",height: (((HEIGHT /6) *4)/ 6)}}>
      <Text style={titleText}>{this.state.username}</Text>
      <View style={longRow}>
      <Text style={bodyText}>Could not fetch your data</Text>
      </View>
      <View style={buttonWrapper}>
      <TouchableNativeFeedback onPress={() => this.setState({ username: "KEKD"})}>
        <View style={buttonStyle}>
          <Text style={buttonText}>
            Try again
            </Text>
        </View>
        </TouchableNativeFeedback>
        </View>
      </View>
      

      </View>



    )
  }
}






export default class ErrorMsg extends React.Component {
  
  static navigationOptions = {
    header: null
  };

  render() {
    const headerStyle = {
      width: "100%", 
      height: HEIGHT / 6,
      flexDirection: "row",
    }
    const titleText = {
      fontSize: 40,
      color: "mintcream",
      fontFamily: 'Poppins-ExtraBold',
      includeFontPadding: false,
    }
    const loginText = {
      fontSize: 20,
      color: "mintcream",
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const bodyStyle = {
      width: "100%", 
      height: (HEIGHT / 6) * 4,
    }
    const footerStyle = {
      width: "100%", 
      justifyContent: "center",
      alignItems: "center"
    }
    const termsStyle = {
      width: "100%",
      paddingTop: 10,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    }
    const termsText = {
      fontSize: 15,
      color: "mintcream",
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const termsLink = {
      fontSize: 15,
      color: "dodgerblue",
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
      textDecorationLine: 'underline'
    }
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
    const buttonText = {
      color: "mintcream",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,

    }
    return (
      <View style={{ flex: 1, backgroundColor: "#1C1C1C"}}>
                    <StatusBar backgroundColor={"#17191d"} barStyle={"light-content"} />

      <View style={headerStyle}>
        <View style={{width: "70%", padding: 20, flexDirection: "row"}}>
    
     
      <Text style={titleText}>Hideplan</Text>
      </View>
      </View>

      <ErrorSvg
      logUser={this.props.logUser}
      />
      </View>

    );
  }
}


