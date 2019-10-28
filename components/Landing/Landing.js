import React from "react";
//import "./Register.css";
import { StatusBar, Linking, View, Text, TouchableNativeFeedback, Alert, ActivityIndicator, Dimensions } from "react-native"
import { AsyncStorage } from "react-native"
import { TextInput, HelperText } from 'react-native-paper';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon } from '../../customComponents.js';
import { Button } from 'react-native-paper';

<script src="http://localhost:8097"></script>
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

class SlideOne extends React.Component {
  render() {
    const titleText = {
      fontSize: 26,
      alignSelf: "center",
      color: "rgba(255,255,255, 0.95)",
      fontFamily: 'OpenSans-Bold', 
      padding: 4,
    }

    const bodyText = {
      fontSize: 20,
      color: "rgba(255,255,255, 0.95)",
      fontFamily: 'OpenSans', includeFontPadding: false,
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
    return (
      <View style={bodyStyle}>
        <View style={{width: "100%",height: (((HEIGHT /6) *4)/ 6)}}>
      <Text style={titleText}>Private</Text>
      <View style={longRow}>
      <Text style={bodyText}>Encrypted calendar, tasks, notes</Text>
      </View>
      </View>
      <View style={{flex: 1,width: "100%", justifyContent: "center", height: (((HEIGHT /6) *5)/ 6) *5}}>
           
      </View>

      </View>



    )
  }
}



class LandingBody extends React.Component {

  render() {
    const swiperBody = {
      flex: 1,
    }

    return (
      <View style={{ flex: 1 }}>
        
         <View style={swiperBody}>
      <SlideOne/>
      </View>
     
    </View>
    )
  }
}


export default class LandingScreen extends React.Component {
  
  static navigationOptions = {
    header: null
  };
  componentDidMount () {
    if (this.props.screenProps.isLogged && this.props.screenProps.cryptoPassword) {
      setTimeout(() => {NavigationService.navigate("Error")}, 50)

    }

  }

  render() {
    const headerStyle = {
      flex: 1,
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    }
    const titleText = {
      fontSize: 42,
      color: "rgba(255,255,255, 0.95)",
      fontFamily: 'OpenSans-Bold', 
      includeFontPadding: false,
    }

    const bodyText = {
      marginTop: 6,
      fontSize: 18,
      color: "rgba(255,255,255, 0.60)",
      fontFamily: 'OpenSans', includeFontPadding: false,
      alignSelf: "center",
      alignText: "center"
    }
    const loginText = {
      fontSize: 20,
      color: "rgba(255,255,255, 0.95)",
      fontFamily: 'OpenSans', 
      includeFontPadding: false,
    }
    const bodyStyle = {
      width: "100%", 
      height: (HEIGHT / 6) * 4,
    }
    const footerStyle = {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",

    }
    const termsStyle = {
      flex: 1,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "flex-end",
        }
    const termsText = {
      fontSize: 15,
      color: "rgba(255,255,255, 0.95)",
      fontFamily: 'OpenSans', 
      includeFontPadding: false,
    }
    const termsLink = {
      fontSize: 15,
      color: "#9fa8da",
      fontFamily: 'OpenSans', 
      includeFontPadding: false,
      textDecorationLine: 'underline'
    }
    const buttonStyle = {
      padding: 8,
      color: this.props.screenProps.primaryColor,
      borderColor: this.props.screenProps.primaryColor,
      borderRadius: 10,
      borderWidth: 1,
      backgroundColor: this.props.screenProps.primaryColor,
      justifyContent: "center",
      alignItems: "center",
      elevation: 4
    }
    const buttonText = {
      color: "rgba(255,255,255, 0.95)",
      fontSize: 16,
      fontFamily: 'OpenSans',
      includeFontPadding: false,
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#121212"}}>
         <StatusBar
            backgroundColor={"#121212"}
            barStyle={"light-content"}
          />

      <View style={headerStyle}>
     
      <Text style={titleText}>Hideplan</Text>
      <Text style={bodyText}>Encrypted calendar, tasks, notes</Text>

    
      

      
      </View>

      <View style={footerStyle}>
        <Button mode="outlined" color={"#9fa8da"}style={{borderColor: "#9fa8da"}} dark={false} onPress={() => NavigationService.navigate('Login')}>
    Log in
  </Button>
  <Text style={{ textAlign: "center", fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,fontSize: 14, color: "white", paddingTop: 16, paddingBottom: 16 }}>OR</Text>
        <Button mode="contained" style={{backgroundColor: "#9fa8da", color: "#141414"}} dark={false} onPress={() => NavigationService.navigate("RegisterName")}>
        Create account
  </Button>

          
        </View>
       <View style={termsStyle}>
       <Text style={termsText}>By tapping Create account you agree to Hideplan's </Text><TouchableNativeFeedback onPress={() => Linking.openURL('https://hideplan.com/terms.html').catch((err) => console.error('An error occurred', err)) }><Text style={termsLink}>Terms of Service</Text></TouchableNativeFeedback>
       <Text style={termsText}> and </Text>
       <TouchableNativeFeedback onPress={() => Linking.openURL('https://hideplan.com/privacy_app.html').catch((err) => console.error('An error occurred', err)) }>
         <Text style={termsLink}>Privacy policy</Text>
         </TouchableNativeFeedback>
         <Text style={termsText}>.</Text>
       </View>
      </View>

    );
  }
}


module.exports = LandingScreen;
