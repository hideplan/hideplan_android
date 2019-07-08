import React from "react";
//import "./Register.css";
import { View, Text, StyleSheet, FlatList, TouchableNativeFeedback, TextInput, ScrollView, StatusBar } from "react-native"
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dateFns, { getDate, getYear, getMonth, isFuture} from "date-fns";
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { HeaderIcon } from '../../customComponents.js';

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;

class SearchBar extends React.Component {

  render() {
    const input = {
        width: "100%",
        paddingLeft: "2%",
        paddingRight: "2%",
        color: this.props.darkTheme ? "white" : "black"
      }
    const inputText = {
      fontSize: 20,
      color: this.props.darkTheme ? "white" : "black"
    }
    return (
      <View style={input}>
        <TextInput
          style={inputText}
          name="text"
          type="text"
          autoFocus={true}
          placeholder="Search"
          placeholderTextColor={this.props.darkTheme ? "white" : "black"}
          value={this.props.searchText}
          onChangeText={(text) => this.props.handleChangeText(text) }
        />
      </View>
    )
  }
}

class Results extends React.Component {

renderItems = (item) => {

  const columnStyle = {
    flex: 1,
    flexDirection: "row", 
    width: "100%", 
    borderBottomWidth: 0.4, 
    borderBottomColor: "#C7D2D6",
  }


  const iconBox = {
    paddingTop: 8, paddingBottom: 8, paddingLeft: 20, paddingRight: 20, justifyContent: "center",
  }

  const textStyle = {
    fontSize: 22, 
    paddingTop: 8, 
    paddingBottom: 8, 
    paddingLeft: 6, 
    paddingRight: 20, 
    color: this.props.darkTheme ? "white" : "black"
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

  if (item.calendar) {
    return (
      <TouchableNativeFeedback
      onPress={() => {NavigationService.navigate('EditEvent', {...item, ...{type: "events"}})}}
    >
      <View style={columnStyle}>
  

   <View style={iconBox}>
      <Ionicons name="md-calendar" size={24} color={this.props.darkTheme ? "white" : "black"}/>
      </View>
      {isFuture(item.dateFrom)
      ? <Text style={textStyle}>
      {item.text}</Text>
      : <Text style={markedTextStyle}>
      {item.text}</Text>
      }

      </View>
      </TouchableNativeFeedback>
          )
  } else if (item.list) {
    return (
      <TouchableNativeFeedback
      onPress={() => {NavigationService.navigate('EditTask', {...item, ...{type: "tasks"}})}}
    >
      <View style={columnStyle}>
  

      <View style={iconBox}>
         <Ionicons name="md-checkbox" size={24} color={this.props.darkTheme ? "white" : "black"}/>
         </View>
      {item.isChecked
      ?  <Text style={markedTextStyle}>{item.text}</Text>
      :  <Text style={textStyle}>{item.text}</Text>
      }
      </View>
      </TouchableNativeFeedback>

      )
  } else if (item.title) {
    return (
      <TouchableNativeFeedback
      onPress={() => {NavigationService.navigate('NoteDetails', {...item, ...{type: "notes"}})}}
    >
      <View style={columnStyle}>
  

      <View style={iconBox}>
         <Ionicons name="md-document" size={24} color={this.props.darkTheme ? "white" : "black"}/>
         </View>
         <Text style={textStyle}>
        {item.title}</Text>
      </View>  
      </TouchableNativeFeedback>

      )
  }
}


  formatTime = (dateFrom, dateTill) => {
    let dayFrom = getDate(dateFrom)
    let dayTill = getDate(dateTill)
    let monthFrom = getMonth(dateFrom) + 1
    let monthTill = getMonth(dateTill) + 1
    let year = getYear(dateTill)
    
    return <Text>{dayFrom}.{monthFrom} - {dayTill}.{monthTill}.{year}</Text>
  }
  render() {
    return (
      <View style={{ flex: 1}}>
      <ScrollView >
     
      <FlatList
      data={this.props.foundData}
      keyExtractor={item => item.uuid.toString()}
      style={{ flex: 1 }}
      renderItem={({ item }) =>
      <View style={{flex: 1}}>

      {this.renderItems(item)}

        </View>
      }
      />
      </ScrollView>
      </View>
    )
  }
}



class SearchMain extends React.Component {



  render() {

    return (
      <View style={{ flex: 1 }}>
      {this.props.searchText.length > 1
      ?<View style={{ flex: 1, padding: 8,  }}>
      <Results
      foundData={this.props.foundData}
      darkTheme={this.props.darkTheme}
      />
     
      </View>
      : null
      }
      </View>
      
    )
  }
}


export default class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     searchText: "",
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

clearText = () => {
  this.setState({ searchText: "" })

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
    <HeaderIcon headerIcon="md-arrow-back" color={darkTheme ? "white" : "black"} headerFunction={() => {this.props.navigation.goBack(null)
    }}/>
    </Left>
    <Body>
    <SearchBar 
    darkTheme={darkTheme} 
    searchText={this.state.searchText}
    handleChangeText={this.handleChangeText}/>
    </Body>
    <Right>
      {this.state.searchText.length > 0
      ? <HeaderIcon headerIcon="md-close" color={darkTheme ? "white" : "black"} headerFunction={() => {() => this.clearText()
    }} />
      :  <HeaderIcon headerIcon="md-search" color={darkTheme ? "white" : "black"} headerFunction={() => {() => console.log("search")
    }} />
      }
    
       </Right>
     </Header>
      <View style={{ flex: 1, backgroundColor: this.props.screenProps.darkTheme ? "#202124" : "#F7F5F4" }}>
        {this.props.screenProps.isLoadingData
        ? <Text>Loading</Text> 
        : <SearchMain 
          searchData={this.props.screenProps.searchData}
          foundData={this.props.screenProps.foundData}
          searchText={this.state.searchText}
          darkTheme={this.props.screenProps.darkTheme}
        />
        }
       
      </View>
      </Container>
    );
  }
}





module.exports = SearchScreen;
