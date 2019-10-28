import React from "react";
//import "./Register.css";
import { Alert, StatusBar,
  Image,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  ViewPropTypes, Dimensions } from "react-native"
import { AsyncStorage } from "react-native"
import { TextInput, HelperText } from 'react-native-paper';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon } from '../../customComponents.js';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import ShakingText from './ShakingText.component';
import styles from './FingerprintPopup.component.styles';
<script src="http://localhost:8097"></script>
const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

class FingerprintPopup extends React.Component {

  constructor(props) {
    super(props);
    this.state = { errorMessage: undefined };
  }

  componentDidMount() {
    FingerprintScanner
      .authenticate({ onAttempt: this.handleAuthenticationAttempted })
      .then(() => {
        this.props.unlockApp()
      })
      .catch((error) => {
        this.setState({ errorMessage: error.message });
        this.description.shake();
      });
  }

  componentWillUnmount() {
    FingerprintScanner.release();
  }

  handleAuthenticationAttempted = (error) => {
    this.setState({ errorMessage: error.message });
    this.description.shake();
  };

  render() {

    const { errorMessage } = this.state;
    const { style, handlePopupDismissed } = this.props;

    return (
      <View style={[styles.container]}>
        <View style={[styles.contentContainer, style]}>
        <Text style={styles.title}>
        App locked
        </Text>
        <Text style={[styles.heading]}>
            Unlock app with your fingerprint
          </Text>
          <Image
            style={styles.logo}
            source={require('./assets/finger_print.png')}
          />


          <ShakingText
            ref={(instance) => { this.description = instance; }}
            style={styles.description(!!errorMessage)}>
            {errorMessage || 'Scan your fingerprint on the\ndevice scanner to continue'}
          </ShakingText>

       
        </View>
      </View>
    );
  }
}

FingerprintPopup.propTypes = {
  style: ViewPropTypes.style,
  handlePopupDismissed: PropTypes.func.isRequired,
};

export default class SecuredScreen extends React.Component {
  
  static navigationOptions = {
    header: null
  };
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
  }

  handleBackPress = () => {
    BackHandler.exitApp()
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
    <FingerprintPopup 
    unlockApp={this.props.screenProps.unlockApp}
    />
      
      </View>

    );
  }
}


module.exports = SecuredScreen;
