import React from "react";
//import "./Register.css";
import { View, Text, TouchableNativeFeedback, Alert, ActivityIndicator } from "react-native"
import { AsyncStorage } from "react-native"
import { TextInput, HelperText } from 'react-native-paper';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
<script src="http://localhost:8097"></script>


import { Container, Header, Content, Spinner } from 'native-base';
export default class LoadingScreen extends React.Component {
  static navigationOptions = {
    header: null,
    };

  render() {
    return (
          <View style={{backgroundColor: this.props.screenProps.darkTheme ? "#202124" : "#F7F5F4", justifyContent: "center", alignItems: "center", flex: 1}}>
          <Spinner color='dodgerblue' />
          </View>
    );
  }
}





module.exports = LoadingScreen;
