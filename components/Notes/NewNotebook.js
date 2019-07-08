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
      notebook: "",

    };
  }

  saveList = () => {
    let timestamp = new Date().getTime()
    let notebookName = this.state.notebook
    let notebookObj
    let uuid = createId("notebooks")

      notebookObj = JSON.stringify({notebook: notebookName})

      let encryptedData = encryptData(notebookObj, this.props.cryptoPassword)

      this.props.saveNewItem({
        "uuid": uuid, "data": encryptedData, "updated": timestamp, "type": "notebooks", "parrent": "", "shared": "", "isLocal": "true"}, {"uuid": uuid, "notebook": notebookName, "shared": "false", "username": this.props.user }, "notebooks", "Notebook created")
    

    this.props.filterNotebooksOnDemand({"uuid": uuid, "notebook": notebookName})

  
    NavigationService.navigate('Notes')

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
              placeholder="Add notebook"
              autoFocus={true}
              type="text"
              name="notebook"
              numberOfLines = {1}
              value={this.state.title}
              onChangeText={(notebook) => this.setState({ notebook })}
              />
              </View>
              <View style={{borderBottom: "solid", borderBottomWidth: 0.4, borderBottomColor: "gray"}} />

 


             

        </View>
      )
  
    }
  }



export default class NewNotebookScreen extends React.Component {
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
        androidStatusBarColor={darkTheme ? "#17191d" : "#F7F5F4"}
        >
          <Left>
          <HeaderIcon headerIcon="md-arrow-back" color={darkTheme ? "white" : "black"} headerFunction={() => {
        this.props.navigation.goBack(null)
        }} />
         

            </Left>
          <Body>
            <Title>Add notebook</Title>
          </Body>
          <Right>
          <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {
          this.child.current.saveList()
        }} />
            </Right>

</Header>
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4" }}>
      <View style={{ flex: 1}}>

      <ListInput 
      ref={this.child}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      saveNewItem={this.props.screenProps.saveNewItem}
      darkTheme={this.props.screenProps.darkTheme}
      filterNotebooksOnDemand={this.props.screenProps.filterNotebooksOnDemand}

      />
      </View>

      </View>
      </Container>

    );
  }
}


module.exports = NewNotebookScreen;

