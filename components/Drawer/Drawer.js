
import React from "react";
//import "./Register.css";
import {  Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class DrawerScreen extends React.Component {
    constructor(props) {
      super(props);
     
    }
  
    render() {
      const drawerStyle = {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "flex-start",
  
      }
      const drawerBody = {
        padding: 10
      }
      const drawerRow = {
        width: 280,
        flexDirection: "row",
        padding: 10,
        alignItems: "center"
      }
      const drawerIcon = {
        width: 40,
      }
      const drawerText = {
        width: 230,
        marginRight: 20,
        fontFamily: 'Poppins-Regular', includeFontPadding: false
            }
      const textStyle = {
        color: "white",
        fontSize: 16,
        fontFamily: 'Poppins-Regular', includeFontPadding: false
            }
      const textStyleGray = {
        color: "gray",
        fontSize: 16,
        fontFamily: 'Poppins-Regular', includeFontPadding: false
            }
      return (
        <View style={drawerStyle}>
                  <View style={drawerBody}>
        <TouchableNativeFeedback
              onPress={() => { }}
              background={TouchableNativeFeedback.Ripple('#95A3A4', false)}
  
            >
            <View style={drawerRow}>
          <View style={drawerIcon}>
          <Ionicons name="md-add" size={26} color="white" />
          </View>
          <View style={drawerText}>
          <Text style={textStyle}>Add new calendar</Text>
          </View>
          </View>
          </TouchableNativeFeedback>
          </View>
  
         
          <View style={{ marginTop: 4, marginBottom: 8, left: 0, borderBottomWidth: 0.4, borderBottomColor: "gray", width: 300 }} />
  
  

  
        </View>
      )
    }
  }

  module.exports = DrawerScreen;
