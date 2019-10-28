import React from "react";
//import "./Register.css";
import { View, Text, StyleSheet, Dimensions, FlatList, TouchableNativeFeedback, TextInput, ScrollView, StatusBar,   LayoutAnimation,
  Modal,
  UIManager } from "react-native"
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dateFns, { getDate, getYear, getMonth, isFuture, format } from "date-fns";
import { parse } from "../../functions";
import { Container, Header, Left, Body, Right, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { AppHeaderSearch, MyDialog } from '../../customComponents.js';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, IconButton } from 'react-native-paper';
import EditTaskModalScreen from "../../components/Tasks/EditTaskModal.js";
import NoteDetailsModalScreen from "../../components/NoteDetails/NoteDetailsModal.js";
import EditEventModalScreen from "../../components/EditEvent/EditEventModal.js";

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
const WIDTH = Dimensions.get("window").width;
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
class SearchBar extends React.Component {

  render() {
  

    const inputText = {
      fontSize: 18,
      margin: 0,
      padding: 0,
      color: this.props.colors.text,
      fontFamily: 'OpenSans', 
      includeFontPadding: false,
    }
    return (
        <TextInput
          style={inputText}
          name="text"
          type="text"
          autoFocus={true}
          placeholder="Search"
          placeholderTextColor={this.props.colors.gray}
          value={this.props.searchText}
          onChangeText={(text) => this.props.handleChangeText(text) }
        />
    )
  }
}

class Results extends React.Component {

renderIcon = (item) => {
  if (item.calendar) {
    return "calendar-blank"
  } else if (item.notebook) {
    return "note"
  } else if (item.list) {
    if (item.isChecked == "true") {
      return "check-circle"
    } else {
      return "checkbox-blank-circle-outline"
    }
  }
}
renderText = (item) => {
  const listText = {
    color: this.props.colors.text,
    fontSize: 16,
    marginRight: 52,
    fontFamily: 'OpenSans', 
    includeFontPadding: false
  }
  const listTextMarked = {
    color: this.props.colors.text,
    fontSize: 16,
    marginRight: 52,
    fontFamily: 'OpenSans', 
    includeFontPadding: false,
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid',
  }
  if (item.calendar) {
    return (<Text numberOfLines={1} style={isFuture(parse(item.dateTill)) ? listText : listTextMarked}>
    {item.text}
    </Text>)
  } else if (item.notebook) {
    return (<Text numberOfLines={1} style={listText}>
      {item.title}
      </Text>)
  } else if (item.list) {
    return (<Text numberOfLines={1} style={item.isChecked == "true" ? listTextMarked : listText}>
      {item.text}
      </Text>)
  }
}
renderDescription = (item) => {
  const descriptionText = {
    color: this.props.colors.gray,
    fontSize: 14,
    marginRight: 52,
    fontFamily: 'OpenSans', 
    includeFontPadding: false
  }
  const descriptionTextMarked = {
    color: this.props.colors.gray,
    fontSize: 14,
    marginRight: 52,
    fontFamily: 'OpenSans', 
    includeFontPadding: false,
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid',
  }
  if (item.calendar) {
    return ( 
    <Text numberOfLines={2} style={isFuture(parse(item.dateTill)) ? descriptionText : descriptionTextMarked}>
    {format(parse(item.dateFrom), "d. MMM yyyy" ) + " - " + format(parse(item.dateTill), "d. MMM yyyy") + "\n" + format(parse(item.dateFrom), "HH:MM") + " - " + format(parse(item.dateTill), "HH:MM") }
    </Text> )
  } else if (item.notebook) {
    return ( 
    <Text numberOfLines={2} style={descriptionText}>
      {item.text}
      </Text> )  
    } else if (item.list) {
    return
    }
}

renderItems = (item) => {

  const listRow = {
    flex: 1,
    padding: 16,
    height: "auto"
  }
  const listRowPadding = {
    width: "100%",
    flex: 1,
    flexDirection: "row",

  }
  const iconCol = {
    width: 40,
    marginRight: 20,
    justifyContent: "center",
    alignItems: "center", 
  }
  const textCol = {
    width: WIDTH - 40,
    justifyContent: "center",
    flexDirection: "column",
  }
  
 
  const markedTextStyle = {
    fontSize: 22, 
    paddingTop: 8, 
    paddingBottom: 8, 
    paddingLeft: 6, 
    paddingRight: 20, 
    color: "gray",
    textDecorationLine: 'line-through', 
    textDecorationStyle: 'solid',
  }

    return (
      <TouchableNativeFeedback onPress={() => this.props.selectItem(item)} 
      background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
        this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
      >
      <View style={listRow}>
      <View style={listRowPadding}>
  
      <View style={iconCol}>
      <Icon name={this.renderIcon(item)} size={24} color={this.props.colors.gray}/>
      </View>
      <View style={textCol}>
          {this.renderText(item)}
          {this.renderDescription(item)}
  
      </View>
        </View>
        </View>
  
      </TouchableNativeFeedback>
          )

  }




  render() {
    return (
      <View style={{ flex: 1}}>
     
      <FlatList
      data={this.props.foundData}
      keyExtractor={item => item.uuid.toString()}
      scrollEnables={true}
      style={{ flex: 1 }}
      renderItem={({ item }) =>
      <View style={{flex: 1, borderBottomColor: this.props.colors.border, borderBottomWidth: 0.2}}>

      {this.renderItems(item)}

        </View>
      }
      />
      </View>
    )
  }
}



class SearchMain extends React.Component {



  render() {

    return (
      <View style={{ flex: 1 }}>
      {this.props.searchText.length > 1
      ?<View style={{ flex: 1}}>
      <Results
      foundData={this.props.foundData}
      darkTheme={this.props.darkTheme}
      colors={this.props.colors}
      selectItem={this.props.selectItem}
      />
     
      </View>
      : null
      }
      </View>
      
    )
  }
}
const CustomLayoutLinear = {
  duration: 200,
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  },
  update: {
    type: LayoutAnimation.Types.easeInEaseOut
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity
  }
};

export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     searchText: "",
     selectedItem: "",
     modalVisible: false,
     dialogDeleteVisible: false,
    }
  }
  static navigationOptions = {
    header: null,
    }


handleChangeText = (text) => {
  this.setState({ searchText: text })

  //Search text after 2 characters
  this.state.searchText.length > 0 
  ? this.props.screenProps.searchData(text)
  : null
}

selectItem = (item) => {
  this.setState({ selectedItem: item, modalVisible: true })
}
hideModal = () => {
  this.setState({ selectedItem: "", modalVisible: false })

}

getItemType = () => {
  if (this.state.selectedItem.calendar) {
    return "event"
  } else if (this.state.selectedItem.list) {
    return "task"
  } else {
    return "note"
  }
}

clearText = () => {
  this.setState({ searchText: "" })
}
_hideDeleteDialog = () => {
  this.setState({ dialogDeleteVisible: false, selectedItem: "" })
}
_openDeleteDialog = (item) => {
  this.setState({ selectedItem: item, dialogDeleteVisible: true })
}

 
deleteItem = (item) => {
  let itemType
  if (item.calendar) {
    itemType = "events"
  } else if (item.list) {
    itemType = "tasks"
  } else {
    itemType = "notes"
  }
  let itemObj = { ...item, ...{ type: itemType } };
  this.props.screenProps.deleteItem(itemObj);
  setTimeout(() => this.props.screenProps.updateFoundData(item), 100)
  setTimeout(() =>  LayoutAnimation.configureNext(CustomLayoutLinear), 140)

 

};

 
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

<AppHeaderSearch style={headerStyle}
screen="subscreen"
darkTheme={this.props.screenProps.darkTheme}
colors={this.props.screenProps.colors}
hasHeaderShadow={true}
renderSearchBar={() => {return (
  <SearchBar 
  darkTheme={darkTheme} 
  colors={this.props.screenProps.colors}
  searchText={this.state.searchText}
  handleChangeText={this.handleChangeText}/>
)}}
menuIcon={() => { return <IconButton 
icon="arrow-left"
theme={{dark: this.props.screenProps.darkTheme}}
color={this.props.screenProps.colors.gray}
size={24}
onPress={() => this.props.navigation.goBack(null)}
 /> }}
renderIcon={() => {return ( 
  this.state.searchText.length > 0 ? <IconButton 
  icon="close"
  theme={{dark: this.props.screenProps.darkTheme}}
  color={this.props.screenProps.colors.gray}
  size={24}
  onPress={() => this.clearText()}
   /> : null) }}
/>
     
    

     <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface }}>
        {this.props.screenProps.isLoadingData
        ? <Text>Loading</Text> 
        : <SearchMain 
          searchData={this.props.screenProps.searchData}
          foundData={this.props.screenProps.foundData}
          searchText={this.state.searchText}
          darkTheme={this.props.screenProps.darkTheme}
          colors={this.props.screenProps.colors}
          selectItem={this.selectItem}
        />
        }
       
      </View>
      {this.state.dialogDeleteVisible
        ?    
        <MyDialog
        colors={this.props.screenProps.colors}
        darkTheme={this.props.screenProps.darkTheme}
        hide={this._hideDeleteDialog}
        title={`Delete ${this.getItemType()}`}
        text={`Do you want to delete ${this.getItemType()} "${this.state.selectedItem.notebook ? this.state.selectedItem.title : this.state.selectedItem.text}"?`}
          confirm={() => this.deleteItem(this.state.selectedItem)}
          />
        
      
       
          : null
                }
      {this.state.modalVisible && this.state.selectedItem.list
        ? <EditTaskModalScreen 
        cryptoPassword={this.props.screenProps.cryptoPassword}
        editItem={this.props.screenProps.editItem}
        darkTheme={this.props.screenProps.darkTheme}
        user={this.props.screenProps.user}
        filterTasksOnDemand={this.props.screenProps.filterTasksOnDemand}
        item={this.state.selectedItem}
        tagName={this.props.screenProps.tagName}
        findPassword={this.props.screenProps.findPassword}
        primaryColor={this.props.screenProps.primaryColor}
        colors={this.props.screenProps.colors}
        hideModal={this.hideModal}
        taskModalVisible={this.state.taskModalVisible}
        showSnackbar={this.showSnackbar}
        deleteItem={this.props.screenProps.deleteItem}
        cancelNotification={this.props.screenProps.cancelNotification}
        _openDeleteDialog={this._openDeleteDialog}
        />
        : null
        }
      {this.state.modalVisible && this.state.selectedItem.calendar
        ? <EditEventModalScreen 
                      item={this.state.selectedItem}
        hideModal={this.hideModal}
        eventModalVisible={this.state.eventModalVisible}
        showSnackbar={this.showSnackbar}
        deleteItem={this.props.screenProps.deleteItem}
        cryptoPassword={this.props.screenProps.cryptoPassword}
      editItem={this.props.screenProps.editItem}
      calendars={this.props.screenProps.calendars}
      selectedCalendar={this.state.selectedCalendar}
      darkTheme={this.props.screenProps.darkTheme}
      saveNewItem={this.props.screenProps.saveNewItem}
      primaryColor={this.props.screenProps.primaryColor}
      colors={this.props.screenProps.colors}
      cancelNotification={this.props.screenProps.cancelNotification}
      _openDeleteDialog={this._openDeleteDialog}


        />
        : null
        }
      {this.state.modalVisible && this.state.selectedItem.notebook
        ? <NoteDetailsModalScreen 
                      item={this.state.selectedItem}
        hideModal={this.hideModal}
        noteModalVisible={this.state.noteModalVisible}
        showSnackbar={this.showSnackbar}
        deleteItem={this.props.screenProps.deleteItem}
        cryptoPassword={this.props.screenProps.cryptoPassword}
      editItem={this.props.screenProps.editItem}
      calendars={this.props.screenProps.calendars}
      darkTheme={this.props.screenProps.darkTheme}
      saveNewItem={this.props.screenProps.saveNewItem}
      primaryColor={this.props.screenProps.primaryColor}
      colors={this.props.screenProps.colors}
      notebookName={this.props.screenProps.notebookName}
      _openDeleteDialog={this._openDeleteDialog}
      snackbarVisible={this.state.snackbarVisible}
        />
        : null
        }
      </Container>
    );
  }
}





module.exports = SearchScreen;
