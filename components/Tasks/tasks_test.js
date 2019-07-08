import React from "react";
//import "./Register.css";
import { Button, View, Text, StyleSheet, FlatList, TouchableOpacity, TouchableNativeFeedback, Dimensions, Animated, Easing, ScrollView, TextInput, TouchableWithoutFeedback, DrawerLayoutAndroid, Switch } from "react-native"
import Drawer from '../../drawer/Drawer.js';



export default class TasksScreen extends React.Component {

  componentDidMount () {
    setTimeout(() => this.Drawer.open(), 1500)
  }

    render () {
      var navigationView = (
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
        </View>
      )
      return (
        <View style={{flex:1}}>

          <View style={{flex: 1, alignItems: 'center', backgroundColor: "gray"}}>

            <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>Hello</Text>
            <Text style={{margin: 10, fontSize: 15, textAlign: 'right'}}>World!</Text>
            <View style={{width: 150, height: 80, backgroundColor: "black", color:"white"}}>
            <TouchableOpacity onPress={() => this.Drawer.open()} >
            <Button onPress={() => this.Drawer.open()} color="red" title="Open" style={{backgroundColor: "red"}}/>
            </TouchableOpacity>
            </View>

          </View>
          <Drawer
                    ref={ref => {
                      this.Drawer = ref;
                    }}
          height={120}
          heightExpanded={300}
          duration={250}
          closeOnSwipeDown={true}
          darkTheme={this.props.screenProps.darkTheme}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: this.props.screenProps.darkTheme ? "#17191d" : "white",
              elevation: 8
            }
          }}
        >
         
          </Drawer>
          </View>

      );
    }
  }




module.exports = TasksScreen;
