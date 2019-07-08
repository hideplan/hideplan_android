import React from "react";
//import "./Register.css";
import { ViewPagerAndroid, Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon } from '../../customComponents.js';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { createId } from '../../functions';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';

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
    let timestamp = new Date().getTime()
    let listName = this.state.list
    let listObj
    let item = this.props.list
    let uuid = createId("lists")
    let uuid2 = createId("passswords")
    if (this.state.isShared == false || this.state.isShared == undefined) {
      listObj = JSON.stringify({list: listName, shared: false, username: this.props.user})

      let encryptedData = encryptData(listObj, this.props.cryptoPassword)

      this.props.editItem({
        "uuid": this.props.list.uuid, "data": encryptedData, "updated": timestamp, "type": "lists", "parrent": "", "shared": "", "isLocal": "true"}, {"uuid": this.props.list.uuid, "list": listName, "shared": "false", "username": this.props.list.user }, "lists", "List created")

    } else {
      listObj = JSON.stringify({list: listName, shared: true})
      let encryptedData = encryptData(listObj, sharedPassword)
      let passObj = JSON.stringify({type: "lists", uuidShared: uuid, password: sharedPassword})
      let sharedPassword = this.state.sharedPassword
      let encryptedPassword = encryptData(passObj, this.props.cryptoPassword)

    }

    this.props.filterTasksOnDemand({uuid: this.props.list.uuid, list: this.state.list, username: this.props.list.username, isShared: this.props.list.isShared})
  
    NavigationService.navigate('Tasks')

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
        fontSize: 18,
        padding: 4,
      }
  
      return (
        <View style={{ flex: 1, backgroundColor: "rgb(29, 31, 38)" }}>
        <View style={textBoxStyle}>
         <TextInput
              placeholderTextColor="white"
              style={textStyle}
              autoFocus={true}
              type="text"
              name="list"
              numberOfLines = {1}
              value={this.state.list}
              onChangeText={(list) => this.setState({ list })}
              />
              </View>
              <View style={{borderBottom: "solid", borderBottomWidth: 0.4, borderBottomColor: "gray"}} />

   <View style={{ flexDirection: "row"}}>
   <View style={{paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center", }}>

   <Text style={{ fontSize: 18, alignSelf: "center", color: this.props.darkTheme ? "#C7D2D6" : "#2F3344" }}>Share
   </Text>
  </View>
   <View style={{ paddingTop: 8, paddingBottom: 8, position: "absolute", right: WIDTH / 4 / 2, justifyContent: "center" }}>
      <Switch name="share" value={this.props.list.isShared} onValueChange={() => {this.toogleSwitch() }}/>
      </View>
      </View>

      {this.state.isShared
      ?  <View style={textBoxStyle}>

      <TextInput
    placeholder="Type your password"
   placeholderTextColor="white"
   style={textStyle}
   multiline = {true}
   type="text"
   name="sharedPassword"
   value={this.state.sharedPassword}
   onChangeText={(sharedPassword) => this.setState({ sharedPassword })}
   />
                 </View>
      : null
      }
      


             

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
      backgroundColor: this.props.screenProps.darkTheme ? '#17191d' : "#F7F5F4",
      color: this.props.screenProps.darkTheme ? 'white' : "black",
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme
    return (
      <Container>
 <Header 
        style={headerStyle}
        >
              <StatusBar backgroundColor={darkTheme ? "#17191d" : "mintcream"} barStyle={darkTheme ? "light-content" : "dark-content"} />
          <Left>
          <HeaderIcon headerIcon="md-arrow-back" color={darkTheme ? "white" : "black"} headerFunction={() => {
        this.props.navigation.goBack(null)
        }} />
         

            </Left>
          <Body>
            <Title>Edit list</Title>
          </Body>
          <Right>
          <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {
          this.child.current.editList()
        }} />
            </Right>

</Header>
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4" }}>
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

