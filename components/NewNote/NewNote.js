import React from "react";
//import "./Register.css";
import { BackHandler, Picker, ViewPagerAndroid, Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon, Dropdown } from '../../customComponents.js';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { createId } from '../../functions';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';

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
    let valueForEncryption = {title: this.state.title, text: this.state.text, isFavourite: false, notebook: this.props.notebookName.uuid, updated: time};
    return valueForEncryption;
  }

  saveNote = () => {
    let noteTimestamp = new Date().getTime()

    let dataForEncryption = JSON.stringify(this.convertToText(noteTimestamp));
    let encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
    let uuid = createId("notes")
    /*
    sendPost("http://localhost:3001/save/note", {
      data: encryptedData, timestamp: noteTimestamp
    }, () => {this.getNotesId(encryptedData, noteTimestamp)})    
    */
   this.props.saveNewItem({
    "uuid": uuid, "data": encryptedData, "updated": noteTimestamp, "type": "notes", "shared": "", "invited": "", "parrent": this.props.notebookName.uuid, "isLocal": "true" }, {
      "uuid": uuid, "title": this.state.title, "text": this.state.text, "isFavourite": false, "notebook": this.props.notebookName.uuid, "updated": noteTimestamp
    }, "notes", "Note created")
    NavigationService.navigate('Notes')
  
}
  


  componentWillMount() {
  }



    componentDidMount() {
    }
    
  
    render() {

      const textBoxStyle = {
        width: "100%",
        padding: 8

      }
      const textStyle = {
        color: this.props.darkTheme ? "white" : "black" ,
        fontSize: 18,
        padding: 4,
      }
  
      return (
        <View style={{ flex: 1, width: "100%" }}>
        <View style={textBoxStyle}>
         <TextInput
              placeholderTextColor={this.props.darkTheme ? "white" : "black"}
              style={textStyle}
              placeholder="Title"
              type="text"
              name="title"
              numberOfLines = {1}
              value={this.state.title}
              onChangeText={(title) => this.setState({ title })}
              />
              </View>
              <View style={{borderBottom: "solid", borderBottomWidth: 0.4, borderBottomColor: "gray"}} />
              <View style={textBoxStyle}>

                 <TextInput
              placeholderTextColor={this.props.darkTheme ? "white" : "black"}
              style={textStyle}
              autoFocus={true}
              multiline = {true}
              type="text"
              name="text"
              value={this.state.text}
              onChangeText={(text) => this.setState({ text })}
              />
                            </View>

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
    setMenuRef = ref => {
      this._menu = ref;
    };
  
    hideMenu = () => {
      this._menu.hide();
    };
  
    showMenu = () => {
      this._menu.show();
    };
    setData = () => {
      this.props.screenProps.filterNotebooksOnDemand(this.props.screenProps.notebooks[0])
    }
    selectNotebook = (notebook) => {
      this.hideMenu()
      this.props.screenProps.filterNotebooksOnDemand(notebook)
    }
    renderMenuItems = () => {

     

      return (
        this.props.screenProps.notebooks.map(item => {
      
    
          return (
            <TouchableNativeFeedback onPress={() => this.selectNotebook(item)}>
            <View style={{display: "flex", width: "100%", padding: 8}}>
            
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
    <HeaderIcon headerIcon="md-arrow-back" color={darkTheme ? "white" : "black"} headerFunction={() => {this.handleBackPress()
    }}/>

      </Left> 
      <TouchableNativeFeedback onPress={() => this.showMenu()}>
     <Body>
       <Title style={{color: darkTheme ? "white" : "black"}}>New note</Title>
       {this.props.screenProps.notebooks.length > 0 
      ?       <Menu
      ref={this.setMenuRef}
      style={{ backgroundColor: darkTheme ? "#373E40" : "#485154", elevation: 8,fontSize: 18, color: darkTheme ? "white" : "black"
    }}
    button={<Text style={{color: darkTheme ? "white" : "black"}} onPress={() => this.showMenu()}>{this.props.screenProps.notebookName.notebook}</Text>}
    >
     {this.renderMenuItems()}
    </Menu>
      : null
      }

        
     </Body>
     </TouchableNativeFeedback>
     <Right>
          <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {
          this.handleBackPress()
        }} />
            </Right>

</Header>
<View style={{ flex: 1, alignItems: 'center', backgroundColor: this.props.screenProps.darkTheme ? "#202124" : "#F7F5F4" }}>

      <NoteInput 
      ref={this.child}
      darkTheme={this.props.screenProps.darkTheme}

      cryptoPassword={this.props.screenProps.cryptoPassword}
      saveNewItem={this.props.screenProps.saveNewItem}
      notebookName={this.props.screenProps.notebookName}
      />

</View>

      </Container>

    );
  }
}


module.exports = NewNoteScreen;

