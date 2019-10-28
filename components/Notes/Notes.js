import React from "react";
//import "./Register.css";
import { Modal,  View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Animated, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList, RefreshControl, LayoutAnimation, UIManager} from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {  AppHeader, HeaderIcon, HeaderIconMenu, HeaderIconEmpty,  DrawerHeader, DrawerRow, DrawerRowGroup, DrawerSubtitle } from "../../customComponents.js";
import { Toast, MyDialog } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Title, Content, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import MyDrawer from '../../drawer/Drawer.js';
import { BottomSheet, BottomSheetExpanded } from '../../bottomSheet/BottomSheet.js';
import { encryptData } from '../../encryptionFunctions';
const HEIGHT = Dimensions.get('window').height;
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import NoteDetailsModalScreen from "../NoteDetails/NoteDetailsModal.js"
import { IconButton, Portal, Button, Menu, Drawer, Snackbar, Divider, Dialog, Paragraph, Surface } from 'react-native-paper';
import DrawerLayout from 'react-native-gesture-handler/DrawerLayout';

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/
UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);

const WIDTH = Dimensions.get('window').width;

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
class ViewContent extends React.Component {

  action = (item) => {
      this.props.func(item.value), this.props.hideModal()
  }

  renderContent = () => {
    return (
      this.props.options.map(item => {
        return (
          <TouchableNativeFeedback onPress={() =>this.action(item)}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
          >
          <View style={{flexDirection: "row", width: "100%", alignItems: "center", justifyContent: "flex-start", paddingTop: 16, paddingBottom: 16,paddingLeft: 20, paddingRight: 20, }}>
          { this.props.currentValue == item.value
                ?<Icon name="radiobox-marked" size={24} color={this.props.colors.primary} />
                :<Icon name="radiobox-blank" size={24} color={this.props.colors.gray} />
              }
    
    <Text style={{color: this.props.colors.text, fontSize: 16, paddingLeft: 16,includeFontPadding: false,
  fontFamily: "OpenSans" }}>{`${item.label}`}</Text>
          </View>
          </TouchableNativeFeedback>
        )
      })
    )
  }
  render() {


      return (
        <ScrollView style={{ width: "100%",  height: "auto", }}>
        {this.renderContent()}
        </ScrollView>
      )
    }
  }
class MenuDrawer extends React.Component {
  
  alert = (listName, func) => {
    Alert.alert(
      'Delete notebook',
      `Do you want to delete notebook "${listName}" and all associated notes?`,
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => {func()},
        }
        ],
    );
  }
  reloadView = () => {
    this.props.findDefaultNotebook().then(notebook => {
      this.props.filterNotebooksOnDemand(notebook)
    })
  }
  deleteNotebook = (notebook) => {
    this.reloadView()

    this.props.deleteParrent(notebook, "notebooks", "notes")
  }

  renderNotebooks = (data) => {
    const drawerRowSelected = {
      flexDirection: "row", padding: 10,
      paddingLeft: 20, 
      paddingRight: 20,
      backgroundColor: this.props.colors.gray

    }
    const drawerRow = {
      flexDirection: "row", padding: 10,
      paddingLeft: 20, 
      paddingRight: 20,
    }
    const drawerIcon = {
      width: "15%", alignItems: "center", justifyContent: "center"    }
    const drawerText = {
      width: "85%", 
      flexDirection: "row",
      alignItems: "center",
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textStyle = {
      color: this.props.colors.gray,
      fontSize: 16,
      paddingLeft: 10,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textStyleSelected = {
      color: this.props.colors.text,
      fontSize: 16,
      paddingLeft: 10,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    
    const textStyleCircle = {
      color: this.props.colors.gray,
      fontSize: 16,
      paddingLeft: 10,

      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textGrayStyle = {
      color: this.props.colors.gray,
      fontSize: 14,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    return data.map( item => {
      return           <View>
      <TouchableNativeFeedback
          onPress={() => { this.props.filterNotebooksOnDemand(item), this.props.closeDrawer() }}
          background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
            this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
          
        >
    {this.props.notebookName.uuid == item.uuid
    ?  <View style={drawerRowSelected}>
    <View style={drawerIcon}>
    <Ionicons name="md-bookmark" size={26} color={this.props.colors.text} />
    </View>
    <View style={drawerText}>
    <Text style={textStyleSelected}>{item.notebook}</Text>
    </View>
 
  
    
    </View>
    :  <View style={drawerRow}>
    <View style={drawerIcon}>
    <Ionicons name="md-bookmark" size={26} color={this.props.colors.gray} />
    </View>
    <View style={drawerText}>
    <Text style={textStyle}>{item.notebook}</Text>
    </View>
    </View>

    }    
    </TouchableNativeFeedback>
    </View>

    })
  }

  render() {
    
    const drawerRowSelected = {
      flexDirection: "row", padding: 10,
      backgroundColor: this.props.colors.primary

    }
    const drawerRow = {
      flexDirection: "row", padding: 10,
      paddingLeft: 20, 
      paddingRight: 20,
    }
    const drawerIcon = {
      width: "15%", alignItems: "center", justifyContent: "center"    }
    const drawerText = {
      width: "85%", 
      alignItems: "flex-start", justifyContent: "center",
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textStyle = {
      color: this.props.colors.gray,
      fontSize: 16,
      paddingLeft: 10,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textStyleCircle = {
      color: this.props.colors.gray,
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    const textGrayStyle = {
      color: this.props.colors.gray,
      fontSize: 14,
      fontFamily: 'Poppins-Regular', includeFontPadding: false
    }
    return (
      <View >

      <View>
     
      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToNewNotebook(), this.props.closeDrawer() }}
            background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
              this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
            

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-add" size={26} color={this.props.colors.gray} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Add notebook</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>

       

       


        {this.props.notebooks.length > 0
          ? <View >
          <View style={{paddingTop: 15, paddingBottom: 15}}>
        <Text style={{ paddingLeft: 25, fontSize: 16, color: this.props.colors.gray, fontFamily: 'Poppins-Regular', includeFontPadding: false }}>NOTEBOOKS</Text>
        </View>
               {this.renderNotebooks(this.props.notebooks)}
      

            
          </View>
          : null
        }

      </View>
    )
  }
}

class NotesList extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
    refreshing: false,
    contentOffsetYBefore: "",
    fabVisible: true,


  }
}
_onRefresh = () => {
  this.setState({refreshing: true});
  this.props.refreshData().then(() => {
    this.setState({refreshing: false});
  }).catch((error) => {

    this.setState({refreshing: false});

  })
}


  renderNotes(note) {
    const noteBox = {
      flexDirection: "column",
      flex: 1,
      padding: 16,

    }
    const noteTitle = {
      flexDirection: "row",
      width: "100%",  
    }
    const noteBody = {
      paddingTop: 4,
      justifyContent: "center",
      alignItems: "flex-start",
    }
    const noteTextTitle = {
      color: this.props.colors.text,
      fontSize: 16,
      padding: 0,
      margin: 0,
      fontFamily: 'OpenSans-Bold', 
      includeFontPadding: false,
    }
    const noteTextBody = {
      color: this.props.colors.gray,
      fontSize: 14,
      padding: 0,
      margin: 0,
      fontFamily: 'OpenSans', 
      includeFontPadding: false,

    }


        return (
          <View style={{flex:1, height: "auto", borderBottomWidth: 0.2,borderBottomColor: this.props.colors.border, 
          margin: 0, padding: 0, flexDirection: "row", }}>

          <TouchableNativeFeedback 
  background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
    this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
  
      onPress={() => { this.props.selectItem(note)  }}
      >
          <View style={noteBox}>
          <View style={noteTitle}>
          <View style={{justifyContent: "center",
            alignItems: "flex-start", width: note.isFavourite == "true" ?  WIDTH - (16+16+18) :  WIDTH - (16 + 16),
}}>

          <Text numberOfLines={1} style={noteTextTitle}>
          {note.title.length === 0
          ? "..."
          : note.title
          }
          </Text>
          </View>
          <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        
      }}
    >
          {note.isFavourite == "true"
              ?           <Icon
              name={"star"}
              size={18}
              color={this.props.colors.gray}
            />
              : null
              }
                   </View>
                   </View>

          <View style={noteBody}>
          <Text numberOfLines={2} style={noteTextBody}>
          {note.text.length === 0
          ? "..."
          : note.text
          }
         
          </Text>
          </View>
         
          </View>
          </TouchableNativeFeedback>
          
         
          </View>

        )
         
  }

  componentDidUpdate (prevProps) {
    //Compare array and check for completed tasks
    if (JSON.stringify(prevProps.data) != JSON.stringify(this.props.data)) {
      LayoutAnimation.configureNext(CustomLayoutLinear);
  
     
    }
  }
    
   
    render() {
      const data = this.props.data
      const isScrollingUp = ({layoutMeasurement, contentOffset, contentSize}) => {
        this.setState({ contentOffsetYBefore: contentOffset.y})
        return contentOffset.y < this.state.contentOffsetYBefore ;
      };
      return (
        <View style={{ flex: 1, width: WIDTH, }}>
          {data.length > 0 
          ?<ScrollView
          onScroll={({nativeEvent}) => {
            if (nativeEvent.contentOffset.y == 0) {
              if (this.props.hasHeaderShadow) {

                this.props.changeHeaderShadow(false)
                  if (!this.props.fabVisible){
                    this.props.snackbarVisible
                      ? this.props.moveFab(50)
                      : this.props.moveFab(0)
                  }
              }
            } else {
                if (!isScrollingUp(nativeEvent)) {
                  if (!this.props.hasHeaderShadow) {
                    
                    this.props.changeHeaderShadow(true)
                  }
                  if (this.props.fabVisible) {
                    this.props.moveFab(-80)
                  } 
    
                } else {

                  //Show FAB on scroll up
                  if (!this.props.fabVisible) {
                    this.props.snackbarVisible
                    ? this.props.moveFab(50)
                    : this.props.moveFab(0)
                  }
                }
            }

          }
          }
          scrollEventThrottle={400}
           refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
            <FlatList
          initialNumToRender={15}
          windowSize={8}
          data={data}
          style={{ flex: 1, width: WIDTH, paddingBottom: 40 }}
          keyExtractor={(item, index) => item.uuid}
          pagingEnabled
          removeClippedSubviews={true}

          renderItem={({ index, item }) =>
            <View style={{  flex: 1,  }}>
              {item.notebook == this.props.notebookName.uuid
              ? this.renderNotes(item)
              : null
              }
             
            </View>

          }
        />
        </ScrollView>
          : <ScrollView
          onLayout={() => {
            this.props.moveFab(0)
          }}
          style={{flex: 1, }}
           refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
            <View style={{ flex: 1,
                justifyContent: "center",
                width: "100%",
                height: HEIGHT - 140 }}>
          <Text style={{   fontSize: 20,
                  textAlign: "center",
                  color: this.props.colors.gray,
                  fontFamily: "OpenSans",
                  includeFontPadding: false
             }}>
            Empty notebook
        </Text>
        </View>
        </ScrollView>
        }
        </View>
        
         
        )

      }}
      
      
class NotesSorted extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.state = {

      animatedLayout: false,

    };
  }
_
  filterData = () => {
    //Filter only tasks for selected notebook
    let data = this.props.data;
    let filteredData = data.filter(item => {
      return item.notebook == this.props.notebookName.uuid;
    });
    return filteredData;
  };

  sortData = (data, rule) => {
    let sortedData
    if (rule == "favourite") {
      sortedData = data.sort((a, b) => {
        let aItem = a.isFavourite == "true" ? true : false;
        let bItem = b.isFavourite == "true" ? true : false;
        return aItem - bItem;
      });
    } else if (rule == "updated") {
      sortedData = data.sort((a, b) => {
        return parse(b.updated) - parse(a.updated);
      });
    } else if (rule == "newest") {
      sortedData = data.sort((a, b) => {
        let aItem = a.uuid.slice(4,17)
        let bItem = b.uuid.slice(4,17)
        return parseInt(a.uuid) - parseInt(b.uuid);
      });

    }else if (rule == "name") {
      sortedData = data.sort((a, b) => {
        let aItem = a.title == "" ? "zzZZZZZZZZZZ" : a.title.slice(0,1).toUpperCase()
        let bItem = b.title == "" ? "zzZZZZZZZZZZ" : b.title.slice(0,1).toUpperCase()
        return aItem.localeCompare(bItem);
      });
    }
    return sortedData;
  };
   
  filterAllData = data => {
    let favouriteArray = []
    let normalArray = []
    let favouriteSorted
    let normalSorted
    let result = []
    data.forEach((item, index) => {
      if (item.isFavourite == "true") {
        //On top
        favouriteArray.push(item);

        if (index + 1 == data.length) {
          favouriteSorted = this.sortData(favouriteArray, this.props.notebookName.sortBy)
          normalSorted = this.sortData(normalArray, this.props.notebookName.sortBy)
          result = favouriteSorted.concat(normalSorted)
        }

      } else {
       

          normalArray.push(item);
        
          if (index + 1 == data.length) {
            favouriteSorted = this.sortData(favouriteArray, this.props.notebookName.sortBy)
            normalSorted = this.sortData(normalArray, this.props.notebookName.sortBy)
            result = favouriteSorted.concat(normalSorted)
          }
        }
      });
        //BUG: to prevent white flash, custom layout needs to be disabled on mounting
        if (this.state.animatedLayout) {
        }
    return result;
  };
  componentDidMount () {
    setTimeout(() => this.setState({ animatedLayout: true }), 100)
  }
  
    render() {
      const data = this.filterAllData(this.filterData())
     
      return (
        <NotesList
        data={data}
        darkTheme={this.props.darkTheme}
        notebookName={this.props.notebookName}
        defaultNotebook={this.props.defaultNotebook}
        findDefaultNotebook={this.props.findDefaultNotebook}
        filterNotebooksOnDemand={this.props.filterNotebooksOnDemand}
        filterNotebooksOnLoad={this.props.filterNotebooksOnLoad}
        cryptoPassword={this.props.cryptoPassword}
        editItem={this.props.editItem}
        deleteItem={this.props.deleteItem}
        selectItem={this.props.selectItem}
        refreshData={this.props.refreshData}
        colors={this.props.colors}
        moveFab={this.props.moveFab}
        changeHeaderShadow={this.props.changeHeaderShadow}
        hasHeaderShadow={this.props.hasHeaderShadow}
        fabVisible={this.props.fabVisible}
      />
         
        )

      }}
      
      


export default class NotesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
      fabBottom: new Animated.Value(0),
      fabVisible: true,
      noteModalVisible: false,
      snackbarVisible: false,
      hasHeaderShadow: false,
      dropdownVisible: false,
      dialogVisible: false,
      dialogSortVisible: false,
      dialogDeleteVisible: false,
    }
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };
    _hideDeleteDialog = () => {
      this.setState({ dialogDeleteVisible: false, selectedItem: "" })
    }
    _openDeleteDialog = (item) => {
      this.setState({ selectedItem: item, dialogDeleteVisible: true })
    }
    _hideSortDialog = () => {
      this.setState({ dialogSortVisible: false })
    }
    _openSortDialog = () => {
      this.setState({ dropdownVisible: false, dialogSortVisible: true })
  
    }
    _openMenu = () => this.setState({ dropdownVisible: true });

    _closeMenu = () => this.setState({ dropdownVisible: false });

    componentDidMount() {

    }
    componentWillUnmount () {
  
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
          encryptedData = encryptData(dataForEncryption, this.props.screenProps.cryptoPassword);
      
      
          this.props.screenProps.editItem({uuid: item.uuid, data: encryptedData, updated: timestamp.toString(), type: "notes", parrent: item.notebook, needSync: true}, {
            "uuid": item.uuid, "title": item.title, "text": item.text, "notebook": item.notebook, "isFavourite": isFavourite, "updated": timestamp.toString()
          }, this.props.screenProps.notes)
    }
  
    deleteItem = (item) => {
      let itemObj = {...item, ...{type: "notes"}}
      this.props.screenProps.deleteItem(itemObj)
    }

    selectItem = (item) => {
      this.setState({ selectedItem: item, noteModalVisible: true })
    }
    hideModal = () => {
      this.setState({ noteModalVisible: false })
    }
    moveFab = (value) => {
      if (value >= 0) {
        this.setState({ fabVisible: true })
      } else {
        this.setState({ fabVisible: false })
      }
        Animated.timing(this.state.fabBottom, {
        toValue: value,
        duration: 200
      }).start()
    }

    changeHeaderShadow = (value) => {
      this.setState({hasHeaderShadow: value})
    }
    changeSortBy = (sortValue) => {
      let timestamp = parse(new Date())
      let item = this.props.screenProps.notebookName
      let itemObj = JSON.stringify({uuid: item.uuid, notebook: item.notebook, sortBy: sortValue, updated: timestamp.toString()})
        let encryptedData = encryptData(itemObj, this.props.screenProps.cryptoPassword)
  
        this.props.screenProps.editItem({
          "uuid": item.uuid, "data": encryptedData, "updated": timestamp.toString(), "type": "notebooks", "parrent": "", "shared": "", "isLocal": "true"}, {"uuid": item.uuid, "notebook": item.notebook, sortBy: sortValue, "timestamp": timestamp.toString() }, "notebooks", "Notebook created")
  
    }
    openDrawer = () => {
      this.refs['DRAWER_REF'].openDrawer();
    }
    closeDrawer = () => {
      this.refs['DRAWER_REF'].closeDrawer();
    }
    renderDrawer = () => {
      return (
        <View
        style={{
          flex: 1,
          elevation: 16,
          backgroundColor: this.props.screenProps.darkTheme
            ? "#1C1C1C"
            : "#F7F5F4"
        }}
      >
        <View
          style={{
            flex: 1,

          }}
        >
            <ScrollView style={{
            flex: 1}}>
          
          <Drawer.Section title={`${this.props.screenProps.user}'s account`}>
    <Drawer.Item
      label="Settings"
      icon="settings"
      onPress={() => { this.closeDrawer(), NavigationService.navigate("Settings") }}
    />
    <Drawer.Item
      label="Notifications"
      icon="bell"
      onPress={() => { this.closeDrawer(), NavigationService.navigate("Notifications") }}
    />
            <Drawer.Item
      label="Search"
      icon="magnify"
      onPress={() => { this.closeDrawer(), NavigationService.navigate("Search") }}
    />
 </Drawer.Section>
 {this.props.screenProps.notebooks && this.props.screenProps.notebookName
        ?  <DrawerRowGroup
        close={this.closeDrawer}
        colors={this.props.screenProps.colors}
        darkTheme={this.props.screenProps.darkTheme}
        icon={"bookmark"}
        title="Notebooks"
        options={this.props.screenProps.notebooks}
        selectedItem={this.props.screenProps.notebookName}
        func={this.props.screenProps.filterNotebooksOnDemand}
        />
        : null
        }
    
    </ScrollView>
  </View>
  </View>

      )
    }
  render() {
    const headerStyle = {
      backgroundColor: this.props.screenProps.colors.header,
      color: this.props.screenProps.colors.text,
      elevation: this.state.hasHeaderShadow && this.props.screenProps.darkTheme == false ? 8 : 0
    }
    const darkTheme = this.props.screenProps.darkTheme
    return (
      <DrawerLayout
      ref={'DRAWER_REF'}
      backgroundColor={this.props.screenProps.colors.modal}
      drawerWidth={300}

    renderNavigationView={this.renderDrawer}
    >
      <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface}}>
         <StatusBar
            backgroundColor={this.state.hasHeaderShadow ? this.props.screenProps.colors.header : this.props.screenProps.colors.surface}
            barStyle={darkTheme ? "light-content" : "dark-content"}
          />
        <AppHeader style={headerStyle}
        screen="notes"
        darkTheme={this.props.screenProps.darkTheme}
        colors={this.props.screenProps.colors}
        title={this.props.screenProps.notebookName.notebook}
        hasHeaderShadow={this.state.hasHeaderShadow}
        menuIcon={() => { return  <IconButton 
          icon="menu"
          theme={{dark: this.props.screenProps.darkTheme}}
          color={this.props.screenProps.colors.gray}
          size={24}
          onPress={() => this.openDrawer()}
           /> }}
        icons={[<Menu
          visible={this.state.dropdownVisible}
          onDismiss={this._closeMenu}
          contentStyle={{backgroundColor: this.props.screenProps.colors.modal}}
          theme={{colors: {surface: this.props.screenProps.colors.modal, backgroundColor: "gray", text: this.props.screenProps.colors.text}}}
          anchor={
            <IconButton 
            icon="dots-vertical"
            theme={{dark: this.props.screenProps.darkTheme}}
            color={this.props.screenProps.colors.gray}
            size={24}
            onPress={() => this._openMenu()}
             />
          }
        >
          <Menu.Item 
        onPress={() => {this._openSortDialog(), this._closeMenu()}} title={`Sort by ${this.props.screenProps.notebookName.sortBy}`} />
      
                      <Divider style={{backgroundColor: this.props.screenProps.colors.border}} />
          <Menu.Item onPress={() => {NavigationService.navigate("NewNotebook"), this._closeMenu()}} title="Add notebook" />
          <Menu.Item onPress={() => {NavigationService.navigate("NotebooksSettings"), this._closeMenu()}} title="Edit notebooks" />
        </Menu>]}
        />
         
        
        {this.props.screenProps.notes && this.props.screenProps.defaultNotebook && this.props.screenProps.notebookName 
        ?<NotesSorted
            data={this.props.screenProps.notes}
            darkTheme={darkTheme}
            notebookName={this.props.screenProps.notebookName}
            defaultNotebook={this.props.screenProps.defaultNotebook}
            findDefaultNotebook={this.props.screenProps.findDefaultNotebook}
            filterNotebooksOnDemand={this.props.screenProps.filterNotebooksOnDemand}
            filterNotebooksOnLoad={this.props.screenProps.filterNotebooksOnLoad}
            cryptoPassword={this.props.screenProps.cryptoPassword}
            editItem={this.props.screenProps.editItem}
            deleteItem={this.props.screenProps.deleteItem}
            BottomSheetMenu={this.BottomSheetMenu}
            selectItem={this.selectItem}
            refreshData={this.props.screenProps.refreshData}
            colors={this.props.screenProps.colors}
            moveFab={this.moveFab}
            changeHeaderShadow={this.changeHeaderShadow}
            hasHeaderShadow={this.state.hasHeaderShadow}
            changeSortBy={this.changeSortBy}
            fabVisible={this.state.fabVisible}
          />
        :  null
        }
 {this.props.screenProps.toastIsVisible
          ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} 
          darkTheme={this.props.screenProps.darkTheme}
          colors={this.props.screenProps.colors}/>
          : null
        }
       <Animated.View style={{
 position: 'absolute',
 margin: 16,
 bottom: this.state.fabBottom,
 alignSelf: "center",
 }}>
 <FAB
    style={{
    backgroundColor: this.props.screenProps.colors.primary,
  }}
  color={this.props.screenProps.colors.primaryText}

  label="Add note"
    icon="plus"
    onPress={() => NavigationService.navigate('NewNote') }
  />
  </Animated.View> 

     
 
         
                    {this.state.noteModalVisible && this.state.selectedItem
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

{this.state.dialogSortVisible
? <MyDialog
colors={this.props.screenProps.colors}
darkTheme={this.props.screenProps.darkTheme}
hide={this._hideSortDialog}
title={"Sort by"}
content={() => {return <ViewContent 
  stateName={"sortValue"}
  currentValue={this.props.screenProps.notebookName.sortBy}
  colors={this.props.screenProps.colors}
  darkTheme={this.props.screenProps.darkTheme}
  options={[{label: "newest", value: "newest"}, {label: "updated", value: "updated"}, {label: "name", value: "name"}]}
  hideModal={this._hideSortDialog}
  func={this.changeSortBy}
  />}}


/>
: null
}

{this.state.dialogDeleteVisible
  ?    
  <MyDialog
  colors={this.props.screenProps.colors}
  darkTheme={this.props.screenProps.darkTheme}
  hide={this._hideDeleteDialog}
  title={"Delete note"}
  text={`Do you want to delete note "${this.state.selectedItem.title}"?`}
    hide={this._hideDeleteDialog}
    confirm={() => this.deleteItem(this.state.selectedItem)}
    />
  

 
    : null
          }
           

      </View>
      </DrawerLayout>


    );
  }
}


module.exports = NotesScreen;

