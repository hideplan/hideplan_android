import React from "react";
//import "./Register.css";
import { View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../customComponents.js';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { createId } from '../../functions';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { IconButton, Button } from 'react-native-paper';

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get('window').width;


class ListInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: "",
      isShared: false,
      sharedPassword: "",
    };
  }


  editList = () => {
    let timestamp = parse(new Date())
    let listName = this.state.list
    let listObj
    let item = this.props.list
    let uuid = createId("lists")
    let uuid2 = createId("passswords")
    if (this.state.isShared == false || this.state.isShared == undefined) {
      listObj = JSON.stringify({uuid: this.props.list.uuid, list: listName, sortBy: this.props.list.sortBy, shared: false, username: this.props.user, updated: timestamp.toString()})

      let encryptedData = encryptData(listObj, this.props.cryptoPassword)

      this.props.editItem({
        "uuid": this.props.list.uuid, "data": encryptedData, "updated": timestamp.toString(), "type": "lists", "parrent": "", "shared": "", "isLocal": "true"}, {"uuid": this.props.list.uuid, "list": listName, "sortBy": item.sortBy, "shared": "false", "username": this.props.list.user, updated: timestamp.toString() }, "lists", "List created")

    } else {
      listObj = JSON.stringify({list: listName, shared: true})
      let encryptedData = encryptData(listObj, sharedPassword)
      let passObj = JSON.stringify({type: "lists", uuidShared: uuid, password: sharedPassword})
      let sharedPassword = this.state.sharedPassword
      let encryptedPassword = encryptData(passObj, this.props.cryptoPassword)

    }

    this.props.filterTasksOnDemand({"uuid": this.props.list.uuid, "list": listName, "sortBy": item.sortBy, "shared": "false", "username": this.props.list.user, updated: timestamp.toString()  })
    NavigationService.navigate('ListsSettings')

    }
    componentWillMount() {
      this.setState({ list: this.props.list.list, isShared: this.props.list.isShared, sharedPassword: this.props.list.sharedPassword})
    }
  
    render() {

      const textBoxStyle = {
        width: "100%",
        padding: 8

      }
      const textStyle = {
        color: "white",
        fontSize: 16,
        padding: 4,
      }
  
      return (
        <View style={{ flex: 1,  }}>
        <View style={textBoxStyle}>
         <TextInput
           placeholderTextColor={this.props.colors.gray}              style={textStyle}
              autoFocus={true}
              type="text"
              name="list"
              numberOfLines = {1}
              value={this.state.list}
              onChangeText={(list) => this.setState({ list })}
              />
              </View>
              <View style={{borderBottom: "solid", borderBottomWidth: 0.4, borderBottomColor: "gray"}} />

      


             

        </View>
      )
  
    }
  }



export default class EditListScreen extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };



  componentDidMount() {
  }

  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme
    return (
      <Container>
         <StatusBar backgroundColor={this.props.screenProps.colors.header} barStyle={darkTheme ? "light-content" : "dark-content"} />

<AppHeader style={headerStyle}
screen="subscreen"
darkTheme={this.props.screenProps.darkTheme}
colors={this.props.screenProps.colors}
title={"Edit list"}
hasHeaderShadow={true}
menuIcon={() => { return <IconButton 
icon="arrow-left"
theme={{dark: this.props.screenProps.darkTheme}}
color={this.props.screenProps.colors.gray}
size={24}
onPress={() => this.props.navigation.goBack(null)}
 /> }}
icons={[ <Button uppercase={false} mode="text" color={this.props.screenProps.colors.primary} onPress={() => this.child.current.editList()}>Save</Button>]}
/>
 
<View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface }}>
      <View style={{ flex: 1}}>
        {this.props.navigation.state.params
        ?   <ListInput 
        ref={this.child}
        list={this.props.navigation.state.params}
        cryptoPassword={this.props.screenProps.cryptoPassword}
        editItem={this.props.screenProps.editItem}
        darkTheme={this.props.screenProps.darkTheme}
        user={this.props.screenProps.user}
        filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
        colors={this.props.screenProps.colors}
        />
        : null
        }
   
      </View>

      </View>
      </Container>

    );
  }
}


module.exports = EditListScreen;

