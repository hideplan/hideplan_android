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
      notebook: "",

    };
  }

  saveList = () => {
    let timestamp = parse(new Date())
    let notebookName = this.state.notebook
    let notebookObj
    let uuid = createId("notebooks")

      notebookObj = JSON.stringify({uuid: uuid, notebook: notebookName, sortBy: "updated", updated: timestamp.toString()})

      let encryptedData = encryptData(notebookObj, this.props.cryptoPassword)

      this.props.saveNewItem({
        "uuid": uuid, "data": encryptedData, "updated": timestamp.toString(), "type": "notebooks", "parrent": "", "shared": "", "isLocal": "true"}, {"uuid": uuid, "notebook": notebookName, sortBy: "updated", "shared": "false", "username": this.props.user, "updated": timestamp.toString() }, "notebooks", "Notebook created")
    

    this.props.filterNotebooksOnDemand({uuid: uuid, notebook: notebookName, sortBy: "updated", updated: timestamp.toString()})

  
    NavigationService.navigate('Notes')

    }
  
  
    render() {

      const textBoxStyle = {
        width: "100%",
        padding: 16

      }
      const textStyle = {
        color: this.props.colors.text,
        fontSize: 16,
        padding: 4,
      }
  
      return (
        <View style={{ flex: 1, }}>
        <View style={textBoxStyle}>
         <TextInput
              placeholderTextColor={this.props.colors.gray}              style={textStyle}
              placeholder="Type notebook name"
              autoFocus={true}
              type="text"
              name="notebook"
              numberOfLines = {1}
              value={this.state.notebook}
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
title={"Add notebook"}
hasHeaderShadow={true}
menuIcon={() => { return <IconButton 
icon="arrow-left"
theme={{dark: this.props.screenProps.darkTheme}}
color={this.props.screenProps.colors.gray}
size={24}
onPress={() => this.props.navigation.goBack(null)}
 /> }}
icons={[ <Button uppercase={false} mode="text" color={this.props.screenProps.colors.primary} onPress={() => this.child.current.saveList()}>Save</Button>]}
/>

<View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface }}>
      <View style={{ flex: 1}}>

      <ListInput 
      ref={this.child}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      saveNewItem={this.props.screenProps.saveNewItem}
      darkTheme={this.props.screenProps.darkTheme}
      filterNotebooksOnDemand={this.props.screenProps.filterNotebooksOnDemand}
      colors={this.props.screenProps.colors}

      />
      </View>

      </View>
      </Container>

    );
  }
}


module.exports = NewNotebookScreen;

