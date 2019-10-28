import React from "react";
//import "./Register.css";
import { BackHandler, Picker, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon, HeaderIconMenu, HeaderIconEmpty, AppHeader } from "../../customComponents.js";
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { createId } from '../../functions';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import {MenuItem} from '../Moduls/react-native-material-menu/src/Menu.js';
import { IconButton, Button } from 'react-native-paper';

import {Menu} from '../Moduls/react-native-material-menu/src/Menu.js';
/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/



class NoteInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      notebook: "",
      text: "",

    };
  }

  convertToText = (time) => {
    let valueForEncryption = {title: this.state.title, text: this.state.text, isFavourite: "false", notebook: this.props.notebookName.uuid, updated: time.toString()};
    return valueForEncryption;
  }

  saveNote = () => {
    let noteTimestamp = parse(new Date())
    let dataForEncryption = JSON.stringify(this.convertToText(noteTimestamp));
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    let uuid = createId("notes")
    /*
    sendPost("https://api.hideplan.com/save/note", {
      data: encryptedData, timestamp: noteTimestamp
    }, () => {this.getNotesId(encryptedData, noteTimestamp)})    
    */
   this.props.saveNewItem({
    "uuid": uuid, "data": encryptedData, "updated": noteTimestamp.toString(), "type": "notes", "shared": "", "invited": "", "parrent": this.props.notebookName.uuid, "isLocal": "true" }, {
      "uuid": uuid, "title": this.state.title, "text": this.state.text, "isFavourite": "false", "notebook": this.props.notebookName.uuid, "updated": noteTimestamp.toString()
    }, "notes", "Note created")
    NavigationService.navigate('Notes')
  
}
  

  componentWillMount() {
  }



    componentDidMount() {
    }
    
  
    render() {
      const titleBoxStyle = {
        width: "100%",
        padding: 16,

        justifyContent: "center",
        alignItems: "flex-start",
      }
      const textBoxStyle = {
        width: "100%",
        padding: 16,

        justifyContent: "center",
        alignItems: "flex-start",
      }
      const textStyle = {
        color: this.props.colors.text,
        fontFamily: "OpenSans",
        fontSize: 16,
      }
      const textStyleTitle = {
        color: this.props.colors.text,
        fontFamily: "OpenSans-Bold",
        fontSize: 24,
      }
      return (
        <View style={{ flex: 1 }}>
        <View style={titleBoxStyle}>
         <TextInput
                placeholderTextColor={this.props.colors.gray}
                style={textStyleTitle}
                placeholder="Write title for your note"
                type="text"
              name="title"
              multiline = {true}
              value={this.state.title}
              onChangeText={(title) => this.setState({ title })}
              />
              </View>
              <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />
                                      <ScrollView>

              <View style={textBoxStyle}>

                 <TextInput
                placeholderTextColor={this.props.colors.gray}
                style={textStyle}
                placeholder="Write your note"
              autoFocus={true}
              multiline = {true}
              type="text"
              name="text"
              value={this.state.text}
              onChangeText={(text) => this.setState({ text })}
              />
                            </View>
                            </ScrollView>
                            </View>

      )
  
    }
  }



export default class NewNoteScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownIsVisible: false,
  };
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    }


  
    showDropdown = () => {
      this.setState({ dropdownIsVisible: true })
    }

    setData = () => {
      this.props.screenProps.filterNotebooksOnDemand(this.props.screenProps.notebooks[0])
    }
    selectNotebook = (notebook) => {
      this.hideMenu()
      this.props.screenProps.filterNotebooksOnDemand(notebook)
    }


    waitForData = () => {
      this.props.screenProps.notebooks.length > 0
      ? this.setData()
      : setTimeout(() => {this.waitForData()}, 400)
    }
    selectNotebook = (notebook) => {
      this.props.screenProps.filterNotebooksOnDemand(notebook)
      this.hideMenu()
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    handleBackPress = () => {
      if(this.child.current.state.title.length > 0 || this.child.current.state.text.length > 0 ) {
        this.child.current.saveNote()
      }
      NavigationService.navigate('Notes')    
      return true;
    }

    componentWillMount() {
    }

  render() {
    const headerStyle = {
      backgroundColor:this.props.screenProps.colors.surface,
      color: this.props.screenProps.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.screenProps.darkTheme
    return (

      <Container>

<StatusBar backgroundColor={this.props.screenProps.colors.surface} barStyle={darkTheme ? "light-content" : "dark-content"} />

<AppHeader style={headerStyle}
        screen="notes"
        darkTheme={this.props.screenProps.darkTheme}
        colors={this.props.screenProps.colors}
        title={""}
        hasHeaderShadow={false}
        menuIcon={() => { return <IconButton 
          icon="arrow-left"
          theme={{dark: this.props.screenProps.darkTheme}}
          color={this.props.screenProps.colors.gray}
          size={24}
          onPress={() => this.handleBackPress()}
        />}}
        icons={[<Button dark={!this.props.screenProps.darkTheme} style={{marginRight: 16}} uppercase={false} mode="contained" color={this.props.screenProps.colors.primary} onPress={() => this.handleBackPress()}
        >Save</Button>]}
        />
     
<View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface }}>

      <NoteInput 
      ref={this.child}
      darkTheme={this.props.screenProps.darkTheme}

      cryptoPassword={this.props.screenProps.cryptoPassword}
      saveNewItem={this.props.screenProps.saveNewItem}
      notebookName={this.props.screenProps.notebookName}
      colors={this.props.screenProps.colors}
      />

</View>

      </Container>

    );
  }
}


module.exports = NewNoteScreen;

