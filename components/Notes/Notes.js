import React from "react";
//import "./Register.css";
import { ViewPagerAndroid, Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList, RefreshControl } from "react-native"
import { AsyncStorage } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon, FabIcon } from '../../customComponents.js';
import { Toast } from '../../customComponents.js';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import Drawer from '../../drawer/Drawer.js';
import Menu, { MenuItem, MenuDivider } from 'react-native-material-menu';
import { BottomSheet, BottomSheetExpanded } from '../../bottomSheet/BottomSheet.js';
import { encryptData } from '../../encryptionFunctions';
const HEIGHT = Dimensions.get('window').height;

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get('window').width;
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
    const drawerCol = {
      width: WIDTH /5 * 4,
      flexDirection: "column",
    }
    const drawerRowSelected = {
      width: WIDTH /5 * 4,
      backgroundColor: "gray",
      flexDirection: "row",
      padding: 10,
      paddingLeft: 15,

      alignItems: "center"
    }
    const drawerRow = {
      width: WIDTH /5 * 4,
      flexDirection: "row",
      padding: 10,
      paddingLeft: 15,
      alignItems: "center"
    }
    const drawerIcon = {
      width: 40,
    }
    const drawerText = {
      width: WIDTH /5 * 3,
      marginRight: 20,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
    }
    const textStyle = {
      color: this.props.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
        }
    const textGrayStyle = {
      color: "gray",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false,
        }
    return data.map( item => {
      return           <View style = {drawerCol}>
      <TouchableNativeFeedback
          onPress={() => { this.props.filterNotebooksOnDemand(item), this.props.closeDrawer() }}
          background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

        >
    {this.props.notebookName.uuid == item.uuid
    ?  <View style={drawerRowSelected}>
    <View style={drawerIcon}>
    <Ionicons name="md-bookmark" size={26} color={this.props.darkTheme ? "white" : "black"} />
    </View>
    <View style={drawerText}>
    <Text style={textStyle}>{item.notebook}</Text>
    </View>
 
  
    
    </View>
    :  <View style={drawerRow}>
    <View style={drawerIcon}>
    <Ionicons name="md-bookmark" size={26} color={this.props.darkTheme ? "white" : "black"} />
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
    const drawerStyle = {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    }
    const drawerBody = {
      padding: 10
    }
    const drawerCol = {
      width: WIDTH /5 * 4,
      flexDirection: "column",
    }
    const drawerRowSelected = {
      width: WIDTH /5 * 4,
      backgroundColor: "gray",
      flexDirection: "row",
      padding: 10,
      alignItems: "center"
    }
    const drawerRow = {
      width: WIDTH /5 * 4,
      flexDirection: "row",
      padding: 10,
      paddingLeft: 15,
      alignItems: "center"
    }
    const drawerIcon = {
      width: 40,
    }
    const drawerText = {
      width: WIDTH /5 * 3,
      marginRight: 20,
      fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,   }
    const textStyle = {
      color: this.props.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,   }
    const textGrayStyle = {
      color: "gray",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false, includeFontPadding: false,   }
    return (
      <View style={drawerStyle}>
      <ScrollView>
      <View style={drawerBody}>
      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToSettings(), this.props.closeDrawer() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-settings" size={26} color={this.props.darkTheme ? "white" : "black"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Settings</Text>
        </View>
        </View>
        </TouchableNativeFeedback>

      <TouchableNativeFeedback
            onPress={() => { this.props.navigateToNewNotebook(), this.props.closeDrawer() }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-add" size={26} color={this.props.darkTheme ? "white" : "black"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Add notebook</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        </View>

       
        <View style={{ marginTop: 4, marginBottom: 8, left: 0, borderBottomWidth: 0.4, borderBottomColor: "gray", width: 300 }} />
        <View style={drawerBody}>
      
        <TouchableNativeFeedback
            onPress={() => { NavigationService.navigate('EditNotebook', this.props.notebookName) }}
            background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-create" size={26} color={this.props.darkTheme ? "white" : "black"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Rename notebook</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        {this.props.defaultNotebook != this.props.notebookName.uuid

?      <TouchableNativeFeedback
onPress={() => { this.alert(this.props.notebookName.notebook, () => this.deleteNotebook(this.props.notebookName)), this.props.closeDrawer() }}
background={TouchableNativeFeedback.Ripple('#95A3A4', false)}

          >
          <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-trash" size={26} color={this.props.darkTheme ? "white" : "black"} />
        </View>
        <View style={drawerText}>
        <Text style={textStyle}>Delete notebook</Text>
        </View>
        </View>
        </TouchableNativeFeedback>
        : <View style={drawerRow}>
        <View style={drawerIcon}>
        <Ionicons name="md-trash" size={26} color="gray" />
        </View>
        <View style={drawerText}>
        <Text style={textGrayStyle}>Delete notebook</Text>
        </View>
        </View>
        }
        </View>


        <View style={{ marginTop: 4, marginBottom: 8, left: 0, borderBottomWidth: 0.4, borderBottomColor: "gray", width: 300 }} />
        {this.props.notebooks.length > 0
          ? <View style={drawerBody}>
          <Text style={{ paddingLeft: 15, fontSize: 16, color: "#929390", fontFamily: 'Poppins-Regular', includeFontPadding: false }}>Notebooks:</Text>
            
              <ScrollView>
               {this.renderNotebooks(this.props.notebooks)}
      
            </ScrollView>

            
          </View>
          : null
        }
</ScrollView>
      </View>
    )
  }
}


class NotesList extends React.Component {
  constructor(props) {
    super(props);
  this.state = {
    refreshing: false,
  }
}
_onRefresh = () => {
  this.setState({refreshing: true});
  this.props.refreshData().then(() => {
    this.setState({refreshing: false});
  }).catch((error) => {

    this.setState({refreshing: false});

    console.log(error)
  })
}

  filterNotebooks = () => {
    let data = this.props.data
    let filteredData = data.filter(note => {
      return note.notebook == this.props.notebookName.uuid
    })
    return filteredData
  }

  filterNotebooksOnDemand = (selectedItembook) => {
    this.props.filterNotebooksOnDemand(selectedItembook)
  }


  componentDidMount () {
    this.props.findDefaultNotebook()

  }
  
 
  renderNotes(note) {
    const noteBox = {
      padding: 4,
      borderRadius: 8,
      backgroundColor: this.props.darkTheme ? "#515059" : "gainsboro",
      flexDirection: "row",
      flex: 1

    }
    const noteTitle = {
      fontFamily: 'Poppins-Bold', 
      includeFontPadding: false,    
    }
    const noteBody = {

    }
    const noteTextTitle = {
      color: this.props.darkTheme ? "mintcream" : "licorice",
      fontSize: 20,
      padding: 8,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,
    }
    const noteTextBody = {
      color: this.props.darkTheme ? "mintcream" : "licorice",
      fontSize: 16,
      padding: 8,
      fontFamily: 'Poppins-Regular', 
      includeFontPadding: false,

    }

    // Render dots under days with events

        return (
          <View style={{paddingLeft: 12, paddingRight: 12, paddingTop: 12}}>

          <TouchableNativeFeedback 
      onLongPress={() => {this.props.selectItem(note),
        this.props.BottomSheetMenu.open()
      }}
      onPress={() => { NavigationService.navigate('NoteDetails', { text: note.text, uuid: note.uuid, title: note.title, notebook: note.notebook, type: "notes", updated:note.updated, "isFavourite": note.isFavourite })  }}
      background={TouchableNativeFeedback.Ripple('gray', false)}
      >
          <View style={noteBox}>
          <View style={{width: "80%"}}>
          <View style={noteTitle}>
          <Text style={noteTextTitle}>
          {note.title.length === 0
          ? "..."
          : note.title
          }
          </Text>
          </View>
          <View style={noteBody}>
          <Text numberOfLines = {1} style={noteTextBody}>
          {note.text.length === 0
          ? "..."
          : note.text
          }
         
          </Text>
          </View>
          </View>
          {note.isFavourite
              ?             <View style={{ width: "20%",  alignItems: "center", justifyContent: "center", alignSelf: "center" }}>
              <Ionicons name="md-star" size={26} color="gainsboro"/>
              </View>
              : null
              }
          </View>
          </TouchableNativeFeedback>
          
         
          </View>

        )
         
  }


   
    
  
    render() {
      const data = this.filterNotebooks()

      return (
        <View style={{ flex: 1, width: WIDTH}}>
          {data.length > 0 
          ?<ScrollView
          style={{flex: 1}}
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
          style={{ flex: 1, width: WIDTH }}
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
          style={{flex: 1, }}
           refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }>
            <View style={{ flex: 1, justifyContent: "center", height: HEIGHT - 112, }}>
          <Text style={{ fontSize: 20, textAlign: "center", color: this.props.darkTheme ? "white" : "black" }}>
            Empty notebook
        </Text>
        </View>
        </ScrollView>
        }
        </View>
        
         
        )

      }}
      
      


export default class NotesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: "",
    }
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };
    convertToText = (item, time) => {
      let favouriteValue;
      if (item.isFavourite) {
        favouriteValue = false
      } else {
        favouriteValue = true
      }
      let valueForEncryption = `{"uuid": "${item.uuid}", "title": "${item.title}", "text": "${item.text}", "notebook": "${item.notebook}", "isFavourite": ${favouriteValue}, "updated": "${time}"}`;
      return valueForEncryption;
    }
    triggerFavourite = (item) => {
      let dataForEncryption
      let encryptedData
      let isFavourite;
      let timestamp = new Date().getTime()
  
      if (item.isFavourite) {
        isFavourite = false
      } else {
        isFavourite = true
      }
    
          dataForEncryption = this.convertToText(item, timestamp);
          encryptedData = encryptData(dataForEncryption, this.props.screenProps.cryptoPassword);
      
      
          this.props.screenProps.editItem({uuid: item.uuid, data: encryptedData, updated: timestamp, type: "notes", parrent: item.notebook, needSync: true}, {
            "uuid": item.uuid, "title": item.title, "text": item.text, "notebook": item.notebook, "isFavourite": isFavourite, "updated": timestamp
          }, this.props.screenProps.notes)
      this.BottomSheetMenu.close()
    }
  
    deleteItem = (item) => {
      let itemObj = {...item, ...{type: "notes"}}
      this.props.screenProps.deleteItem(itemObj)
    }
    deleteAlert = (noteName, item) => {
      this.BottomSheetMenu.close()
      Alert.alert(
        'Delete note',
        `Do you want to delete note "${noteName}"?`,
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
    selectItem = (item) => {
      this.setState({ selectedItem: item })
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
        >
                      <StatusBar backgroundColor={darkTheme ? "#17191d" : "mintcream"} barStyle={darkTheme ? "light-content" : "dark-content"} />

          <Left>
          <TouchableNativeFeedback
            onPress={() => {     this.Drawer.open()
            }}
            background={TouchableNativeFeedback.Ripple('gray', true)}
          >
            <View style={{ alignItems: "center" }}>
              <Ionicons name="md-menu" size={30} color={darkTheme ? 'white' : "black"} />
            </View>
          </TouchableNativeFeedback>
            </Left>
          <Body>
          <Title style={{color: darkTheme ? "white" : "black", fontFamily: 'Poppins-Bold'}}>{this.props.screenProps.notebookName.notebook}</Title>
          </Body>
          <Right>
          <HeaderIcon headerIcon="md-search" color={darkTheme ? "white" : "black"} headerFunction={() => {
          NavigationService.navigate('Search')
        }} />
            </Right>

</Header>
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4" }}>

        {this.props.screenProps.isLoadingData
          ? <Text>Loading data</Text>
          : null
          }
        {this.props.screenProps.notes && this.props.screenProps.defaultNotebook && this.props.screenProps.notebookName 
        ?<NotesList
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
          />
        :  null
        }
 {this.props.screenProps.toastIsVisible
          ? <Toast toastType={this.props.screenProps.toastType} text={this.props.screenProps.toastText} duration={this.props.screenProps.duration} callback={this.props.screenProps.hideToast} />
          : null
        }
      
        <Fab
      style={{ backgroundColor: 'dodgerblue', borderRadius: 50 }}
            position="bottomRight"
      onPress={() => { NavigationService.navigate('NewNote') }}>
      <Icon name="add" />
      </Fab>
      <BottomSheet
          ref={ref => {
            this.BottomSheetMenu = ref;
          }}
          height={168}
          duration={200}
          closeOnSwipeDown={true}
          darkTheme={this.props.darkTheme}
          customStyles={{
            container: {
              
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: this.props.darkTheme ? "#17191d" : "white",
              elevation: 8
            }
          }}
        >
           <ScrollView style={{flex: 1, backgroundColor: this.props.screenProps.darkTheme ? "#17191d" : "white", paddingTop: 10, paddingBottom: 10}}>
       <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), this.triggerFavourite(this.state.selectedItem) }}>
          <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-add" size={26} color={this.props.screenProps.darkTheme ? "white" : "black"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
         {this.state.selectedItem.isFavourite
        ?<Text style={{ color: this.props.screenProps.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Remove from favourites</Text>
      : <Text style={{ color: this.props.screenProps.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Add to favourites</Text>
         }
        </View>
        </View>
       
        </TouchableNativeFeedback>
        <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), NavigationService.navigate('NoteDetails', { text: this.state.selectedItem.text, uuid: this.state.selectedItem.uuid, title: this.state.selectedItem.title, notebook: this.state.selectedItem.notebook, type: "notes", updated:this.state.selectedItem.updated })}}>
           <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-create" size={26} color={this.props.screenProps.darkTheme ? "white" : "black"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
        <Text style={{ color: this.props.screenProps.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Edit note</Text>
     
        </View>
        </View>
       
        </TouchableNativeFeedback>
        <TouchableNativeFeedback 
        onPress={() => {this.BottomSheetMenu.close(), this.deleteAlert(this.state.selectedItem.title, this.state.selectedItem)}}>
                     <View style={{  width: "100%",
      flexDirection: "row", paddingLeft: 20, paddingRight: 20, paddingTop: 10, paddingBottom: 10}}>
      <View style={{width: "10%", justifyContent: "center"}}>
        <Ionicons name="md-trash" size={26} color={this.props.screenProps.darkTheme ? "white" : "black"} />
        </View>
        <View style={{width: "90%", justifyContent: "center"}}>
        <Text style={{ color: this.props.screenProps.darkTheme ? "white" : "black",
      fontSize: 16,
      fontFamily: 'Poppins-Regular', includeFontPadding: false}}>Delete note</Text>
     
        </View>
        </View>
       
        </TouchableNativeFeedback>
          </ScrollView>
      
      

        </BottomSheet>
      </View>
      <Drawer
                    ref={ref => {
                      this.Drawer = ref;
                    }}
          height={120}
          heightExpanded={300}
          duration={250}
          closeOnSwipeDown={true}
          darkTheme={this.props.screenProps.darkTheme}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              backgroundColor: this.props.screenProps.darkTheme ? "#17191d" : "white",
              elevation: 4
            }
          }}
        >
          <View style={{flex:1,  elevation: 12, backgroundColor: this.props.screenProps.darkTheme ? "#1C1C1C" : "#F7F5F4", }}>
            {this.props.screenProps.notebooks && this.props.screenProps.notebookName
            ? <MenuDrawer
            darkTheme={this.props.screenProps.darkTheme}
            closeDrawer={() => this.Drawer.close()}
            navigateToSettings={() => {NavigationService.navigate('Settings')}}
            navigateToNewNotebook={() => {NavigationService.navigate('NewNotebook')}}
            filterNotebooksOnDemand={this.props.screenProps.filterNotebooksOnDemand}
            notebooks={this.props.screenProps.notebooks}
            deleteParrent={this.props.screenProps.deleteParrent}
            defaultNotebook={this.props.screenProps.defaultNotebook}
            findDefaultNotebook={this.props.screenProps.findDefaultNotebook}
            notebookName={this.props.screenProps.notebookName}

          />
            : null
            }
        
              </View>
          </Drawer>
         
      </Container>
    

    );
  }
}


module.exports = NotesScreen;

