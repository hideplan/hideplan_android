import React from "react";
//import "./Register.css";
import { Keyboard, BackHandler,  View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import { parse } from "../../functions";
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
    let noteTimestamp = parse(new Date())

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
        padding: 16

      }
      const textStyle = {
        color: this.props.colors.text,
        fontSize: 16,
      }
      const textStyleTitle = {
        color: this.props.colors.text,
        fontSize: 18,
      }
      return (
        <View style={{ flex: 1, width: "100%" }}>
        <View style={textBoxStyle}>
         <TextInput
                placeholderTextColor={this.props.colors.gray}
                style={textStyleTitle}
              placeholder="Title"
              type="text"
              name="title"
              numberOfLines = {1}
              value={this.state.title}
              onChangeText={(title) => {this.setState({ title }), this.setState({hasChanged: true})}}
              />
              </View>
              <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />
              <View style={textBoxStyle}>

                 <TextInput
                placeholderTextColor={this.props.colors.gray}
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

    selectNotebook = (notebook) => {
      this.hideMenu()
      this.refs.NoteInput.triggerChange()
      this.props.screenProps.filterNotebooksOnDemand(notebook)
    }
    convertToText = (item, time) => {
      let favouriteValue;
      if (item.isFavourite == "true") {
        favouriteValue = "false"
      } else {
        favouriteValue = "true"
      }
      let valueForEncryption = {"uuid": item.uuid, "title": item.title, "text": item.text, "notebook": item.notebook, "isFavourite": favouriteValue, "updated": time};
      return valueForEncryption;
    }
    triggerFavourite = (item) => {
      let dataForEncryption
      let encryptedData
      let isFavourite;
      let timestamp = parse(new Date())
  
      if (item.isFavourite == "true") {
        isFavourite = "false"
      } else {
        isFavourite = "true"
      }
    
          dataForEncryption = JSON.stringify(this.convertToText(item, timestamp));
          encryptedData = encryptData(dataForEncryption, this.props.screenProps.cryptoPassword);
      
      
          this.props.screenProps.editItem({uuid: item.uuid, data: encryptedData, updated: timestamp, type: "notes", parrent: item.notebook, needSync: true}, {
            "uuid": item.uuid, "title": item.title, "text": item.text, "notebook": item.notebook, "isFavourite": isFavourite, "updated": timestamp
          }, this.props.screenProps.notes)
          NavigationService.navigate('Notes')
        }
    deleteItem = (item) => {
      let itemObj = {...item, ...{type: "notes"}}
      this.props.screenProps.deleteItem(itemObj)
      NavigationService.navigate('Notes')

    }
    deleteAlert = (item) => {
      Alert.alert(
        'Delete note',
        `Do you want to delete note "${item.text}"?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => {this.deleteItem(item)},
          }
          ],
      );
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
           <Header 
        style={headerStyle}
        >

<StatusBar backgroundColor={this.props.screenProps.colors.surface} barStyle={darkTheme ? "light-content" : "dark-content"} />
           <Left>
          <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="arrow-left" color={this.props.screenProps.colors.gray } headerFunction={() => {
        this.handleBackPress()
        }} />
            </Left>

          <Body>
          <Title style={{
                color: this.props.screenProps.colors.text,
                fontFamily: "Poppins-Bold",
                fontWeight: "bold",
                includeFontPadding: false,
                padding: 0,
                margin: 0,
                fontSize: 26
              }}>Edit note</Title>
         
          </Body>
          <Right>
          <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="delete" color={this.props.screenProps.colors.gray } headerFunction={() => {
          this.deleteAlert(this.props.navigation.state.params)
        }} />
                  <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon={this.props.navigation.state.params.isFavourite == "true" ? "star" : "star-outline"}color={this.props.screenProps.colors.gray } headerFunction={() => {
          this.triggerFavourite(this.props.navigation.state.params)
        }} />
          <HeaderIcon darkTheme={this.props.screenProps.darkTheme} ripple={this.props.screenProps.colors.ripple} headerIcon="check"color={this.props.screenProps.colors.gray } headerFunction={() => {
          this.handleBackPress()
        }} />
            </Right>
        

</Header>
<View style={{ flex: 1, alignItems: 'center', backgroundColor: this.props.screenProps.colors.surface }}>

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
      colors={this.props.screenProps.colors}
      />
     

      </View>
      </Container>

    );
  }
}


module.exports = NoteDetailsScreen;

