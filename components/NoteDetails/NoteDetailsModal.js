import React from "react";
//import "./Register.css";
import { Keyboard, BackHandler,  View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList, Modal } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon, HeaderIconMenu, HeaderIconEmpty, AppHeader } from "../../customComponents.js";
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { IconButton, Button } from 'react-native-paper';

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
    let valueForEncryption = {title: this.state.title, text: this.state.text, notebook: this.props.notebookName.uuid, updated: time.toString(), isFavourite: this.state.isFavourite };
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
        "uuid": this.state.uuid, "data": encryptedData, "updated": noteTimestamp.toString(), "type": "notes", "shared": "", "invited": "", "parrent": this.props.notebookName.uuid, "isLocal": "true" }, {
          "uuid": this.state.uuid, "title": this.state.title, "text": this.state.text, "notebook": this.props.notebookName.uuid, "updated": noteTimestamp.toString(), "isFavourite": this.state.isFavourite
        }, "notes", "Note created")
      /*
    sendPost("https://api.hideplan.com/edit/note", {
      data: encryptedData, timestamp: noteTimestamp
    }, () => {this.props.editNote("noteId" + this.state.uuid, {
      "id": this.state.uuid, "data": encryptedData, "timestamp": noteTimestamp }, {
        "id": this.state.uuid, "title": this.state.title, "text": this.state.text, "timestamp": noteTimestamp
      })
      */
     this.props.hideModal()

  }

  
  componentWillMount() {
    this.setState({ title: this.props.noteData.title, text: this.props.noteData.text, uuid: this.props.noteData.uuid, notebook: this.props.noteData.notebook, isFavourite: this.props.noteData.isFavourite })
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
        <View style={{ flex: 1,}}>
        <View style={titleBoxStyle}>
         <TextInput
                placeholderTextColor={this.props.colors.gray}
                style={textStyleTitle}
              placeholder="Write title for your note"
              type="text"
              name="title"
              multiline={true}
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
          <ScrollView>
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

        </ScrollView>
                                    </View>

      )
  
    }
  }



export default class NoteDetailsModalScreen extends React.Component {
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

      this.props.hideModal()    
      return true;
    }

    selectNotebook = (notebook) => {
      this.hideMenu()
      this.refs.NoteInput.triggerChange()
      this.props.filterNotebooksOnDemand(notebook)
    }
    convertToText = (item, time) => {
      let favouriteValue;
      if (item.isFavourite == "true") {
        favouriteValue = "false"
      } else {
        favouriteValue = "true"
      }
      let valueForEncryption = {"uuid": item.uuid, "title": item.title, "text": item.text, "notebook": item.notebook, "isFavourite": favouriteValue, "updated": time.toString()};
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
          encryptedData = encryptData(dataForEncryption, this.props.cryptoPassword);
      
      
          this.props.editItem({uuid: item.uuid, data: encryptedData, updated: timestamp.toString(), type: "notes", parrent: item.notebook, needSync: true}, {
            "uuid": item.uuid, "title": item.title, "text": item.text, "notebook": item.notebook, "isFavourite": isFavourite, "updated": timestamp.toString()
          }, this.props.notes)
          this.props.hideModal()
        }
    deleteItem = (item) => {
      let itemObj = {...item, ...{type: "notes"}}
      this.props.deleteItem(itemObj)
      this.props.hideModal()


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
          {text: 'Delete', onPress: () => {this.props.hideModal(), this.deleteItem(item)},
          }
          ],
      );
    }
    
  render() {
    const headerStyle = {
      backgroundColor: this.props.colors.surface,
      color: this.props.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.darkTheme

    return (
      <Modal 
      animationType="slide"
      transparent={false}
      visible={this.props.noteModalVisible}
      onRequestClose={() => {
        this.handleBackPress()
      }}>
<StatusBar backgroundColor={this.props.colors.surface} barStyle={darkTheme ? "light-content" : "dark-content"} />

<AppHeader style={headerStyle}
        screen="notes"
        darkTheme={this.props.darkTheme}
        colors={this.props.colors}
        title={""}
        hasHeaderShadow={this.state.hasHeaderShadow}
        menuIcon={() => { return <IconButton 
          icon="arrow-left"
          theme={{dark: this.props.darkTheme}}
          color={this.props.colors.gray}
          size={24}
          onPress={() => this.handleBackPress()}
        />}}
        icons={[ <IconButton 
          icon="delete"
          theme={{dark: this.props.darkTheme}}
          color={this.props.colors.gray}
          size={24}
          onPress={() => { this.props.hideModal(), this.props._openDeleteDialog(this.props.item) }}
        />,<IconButton 
        icon={this.props.item.isFavourite == "true" ? "star" : "star-outline"}
        theme={{dark: this.props.darkTheme}}
        color={this.props.colors.gray}
        size={24}
        onPress={() => { this.triggerFavourite(this.props.item) }}
      />, <Button dark={!this.props.darkTheme} style={{marginLeft: 16, marginRight: 16}} uppercase={false} mode="contained" color={this.props.colors.primary} onPress={() => this.handleBackPress()}
        >Save</Button>]}
        />
  
         
<View style={{ flex: 1, backgroundColor: this.props.colors.surface }}>

      <NoteInput 
      ref={"NoteInput"}
      noteData={this.props.item}
      cryptoPassword={this.props.cryptoPassword}
      editNote={this.props.editNote}
      editItem={this.props.editItem}
      notes={this.props.notes}
      notebookName={this.props.notebookName}
      deleteItem={this.props.deleteItem}
      darkTheme={this.props.darkTheme}
      colors={this.props.colors}
      hideModal={this.props.hideModal}
      />
     

      </View>
      </Modal>

    );
  }
}


module.exports = NoteDetailsModalScreen;

