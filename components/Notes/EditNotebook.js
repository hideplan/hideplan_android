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
      hasChanged: false,
    };
  }

  triggerChange = () => {
    this.setState({ hasChanged: true })
  }
  editNotebook = () => {
    let timestamp = new Date().getTime()
    let notebookName = this.state.notebook
    let notebookObj = JSON.stringify({notebook: notebookName})
    let item = this.props.notebook
   
      let encryptedData = encryptData(notebookObj, this.props.cryptoPassword)

      this.props.editItem({
        "uuid": item.uuid, "data": encryptedData, "updated": timestamp, "type": "notebooks", "parrent": "", "shared": "", "isLocal": "true"}, {"uuid": item.uuid, "notebook": notebookName, "shared": "false", "username": this.props.user }, "notebooks", "Notebook created")
  
    }
    componentWillMount() {
      this.setState({ notebook: this.props.notebook.notebook})
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
              name="notebook"
              numberOfLines = {1}
              value={this.state.notebook}
              onChangeText={(notebook) => {this.setState({ notebook }), this.setState({ hasChanged: true })}}
              />
              </View>


             

        </View>
      )
  
    }
  }



export default class EditNotebookScreen extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };

  
    handleBackPress = () => {
      if(this.refs.NotebookInput.state.hasChanged) {
        this.refs.NotebookInput.editNotebook()
      }
      this.props.screenProps.filterNotebooksOnDemand({uuid: this.props.navigation.state.params.uuid,notebook: this.refs.NotebookInput.state.notebook })
      NavigationService.navigate('Notes')    
      return true;
    }

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
        this.handleBackPress()
        }} />
         

            </Left>
          <Body>
            <Title style={{color: darkTheme ? "white" : "black"}}>Edit notebook</Title>
          </Body>
          <Right>
          <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {
          this.handleBackPress()
        }} />
            </Right>

</Header>
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4" }}>
      <View style={{ flex: 1}}>
        {this.props.navigation.state.params
        ?   <ListInput 
        ref={"NotebookInput"}
        notebook={this.props.navigation.state.params}
        cryptoPassword={this.props.screenProps.cryptoPassword}
        editItem={this.props.screenProps.editItem}
        darkTheme={this.props.screenProps.darkTheme}
        user={this.props.screenProps.user}
        filterNotebooksOnDemand={this.props.screenProps.filterNotebooksOnDemand}
        />
        : null
        }
   
      </View>

      </View>
      </Container>

    );
  }
}


module.exports = EditNotebookScreen;

