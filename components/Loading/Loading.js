import React from "react";
//import "./Register.css";
import { Dimensions, View, Text, TouchableNativeFeedback, Alert, ActivityIndicator } from "react-native"
import { TextInput, HelperText } from 'react-native-paper';
import { Input, LabelBottom, FormButton, BasicButton } from '../../customComponents.js';
import NavigationService from '../../NavigationService.js';
import { Keyboard } from 'react-native'

<script src="http://localhost:8097"></script>
const HEIGHT = Dimensions.get('window').height;


import { Container, Header, Content, Spinner } from 'native-base';
export default class LoadingScreen extends React.Component {
  static navigationOptions = {
    header: null,
    };

  render() {

    return (
          <View style={{backgroundColor: "#202124", justifyContent: "center", alignItems: "center", flex: 1}}>
         
          <Spinner color='dodgerblue' />
          <Text style={{ fontSize: 20, textAlign: "center", color: "mintcream" }}>Loading</Text>
          </View>
    );
  }
}





module.exports = LoadingScreen;
