import React from "react";
//import "./Register.css";
import { Keyboard, BackHandler, ViewPagerAndroid, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon, Modal } from '../../customComponents.js';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { Container, Header, Left, Button, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
const WIDTH = Dimensions.get('window').width;

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
      text: "",
      uuid: "",
      notebook: "",
      hasChanged: false,
      isFavourite: "",
    };
  }

  convertToText = (time) => {
    let valueForEncryption = {title: this.state.title, text: this.state.text, notebook: this.props.notebookName.uuid, timestamp: time, isFavourite: this.state.isFavourite };
    return valueForEncryption;
  }
  triggerChange = () => {
    this.setState({ hasChanged: true })
  }

  saveNote = () => {
    let noteTimestamp = new Date().getTime()

    let dataForEncryption = JSON.stringify(this.convertToText(noteTimestamp));
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);

      this.props.editItem({
        "uuid": this.state.uuid, "data": encryptedData, "updated": noteTimestamp, "type": "notes", "shared": "", "invited": "", "parrent": this.props.notebookName.uuid, "isLocal": "true" }, {
          "uuid": this.state.uuid, "title": this.state.title, "text": this.state.text, "notebook": this.props.notebookName.uuid, "updated": noteTimestamp, "isFavourite": this.state.isFavourite
        }, "notes", "Note created")
      /*
    sendPost("https://api.hideplan.com/edit/note", {
      data: encryptedData, timestamp: noteTimestamp
    }, () => {this.props.editNote("noteId" + this.state.uuid, {
      "id": this.state.uuid, "data": encryptedData, "timestamp": noteTimestamp }, {
        "id": this.state.uuid, "title": this.state.title, "text": this.state.text, "timestamp": noteTimestamp
      })
      */
   
  }

  
  componentWillMount() {
    this.setState({ title: this.props.noteData.title, text: this.props.noteData.text, uuid: this.props.noteData.uuid, notebook: this.props.noteData.notebook, isFavourite: this.props.noteData.isFavourite })
  }




  
    render() {

      const textBoxStyle = {
        width: "100%",
        padding: 8

      }
      const textStyle = {
        color: this.props.darkTheme ? "white" : "black",
        fontSize: 18,
        padding: 4,
      }
  
      return (
        <View style={{ flex: 1, }}>
        <View style={textBoxStyle}>
         <TextInput
              placeholderTextColor="gray"
              style={textStyle}
              placeholder="Title"
              type="text"
              name="title"
              numberOfLines = {1}
              value={this.state.title}
              onChangeText={(title) => {this.setState({ title }), this.setState({hasChanged: true})}}
              />
              </View>
              <View style={{borderBottom: "solid", borderBottomWidth: 0.4, borderBottomColor: "gray"}} />
              <View style={textBoxStyle}>

                 <TextInput
              placeholderTextColor="gray"
              style={textStyle}
              multiline = {true}
              type="text"
              name="text"
              value={this.state.text}
              onChangeText={(text) => {this.setState({ text }), this.setState({hasChanged: true})}}
              />
                            </View>

        </View>
      )
  
    }
  }



export default class NoteDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalIsShown: false
    }
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };

    showModal = () => {
      Keyboard.dismiss()
      this.state.modalIsShown 
      ? this.setState({ modalIsShown: false })
      : this.setState({ modalIsShown: true })
    }

    componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    componentWillUnmount() {
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
    }
  
    handleBackPress = () => {
      if(this.refs.NoteInput.state.hasChanged) {
        this.refs.NoteInput.saveNote()
      }

      NavigationService.navigate('Notes')    
      return true;
    }
    setMenuRef = ref => {
      this._menu = ref;
    };
  
    hideMenu = () => {
      this._menu.hide();
    };
  
    showMenu = () => {
      this._menu.show();
    };
    selectNotebook = (notebook) => {
      this.hideMenu()
      this.refs.NoteInput.triggerChange()
      this.props.screenProps.filterNotebooksOnDemand(notebook)
    }
   
    renderMenuItems = () => {

     

      return (
        this.props.screenProps.notebooks.map(item => {
      
    
          return (
            <TouchableNativeFeedback onPress={() => this.selectNotebook(item)}>
            <View>
            
            <Text 
              style={{color: this.props.screenProps.darkTheme ? "white" : "black", fontSize: 20 }}> 
              {item.notebook}
              </Text>
              </View>
              </TouchableNativeFeedback>

          )
        })
      )
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
            <TouchableNativeFeedback onPress={() => this.showMenu()}>

          <Body>
          <Title style={{color: darkTheme ? "white" : "black"}}>Edit note</Title>
            <Menu
      ref={this.setMenuRef}
      style={{ backgroundColor: darkTheme ? "#373E40" : "#485154", elevation: 8,fontSize: 18, color: darkTheme ? "white" : "black"
    }}
    button={<Text style={{color: darkTheme ? "white" : "black"}} onPress={() => this.showMenu()}>{this.props.screenProps.notebookName.notebook}</Text>}
    >
     {this.renderMenuItems()}
    </Menu>
          </Body>
          </TouchableNativeFeedback>
          <Right>
          <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {
          this.handleBackPress()
        }} />
            </Right>
        

</Header>
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" :  "#F7F5F4"}}>

      <NoteInput 
      ref={"NoteInput"}
      noteData={this.props.navigation.state.params}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      editNote={this.props.screenProps.editNote}
      editItem={this.props.screenProps.editItem}
      notes={this.props.screenProps.notes}
      notebookName={this.props.screenProps.notebookName}
      deleteItem={this.props.screenProps.deleteItem}
      darkTheme={this.props.screenProps.darkTheme}

      />
     

      </View>
      </Container>

    );
  }
}


module.exports = NoteDetailsScreen;

