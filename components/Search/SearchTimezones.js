import React from "react";
//import "./Register.css";
import { View, Text, StyleSheet, FlatList, TouchableNativeFeedback, TextInput, ScrollView, StatusBar, Dimensions } from "react-native"
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import dateFns, { getDate, getYear, getMonth, isFuture} from "date-fns";
import { parse } from "../../functions";
import { Container, Header, Left, Body, Right, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { HeaderIcon } from '../../customComponents.js';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import timezones from "./timezones.js"

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
const WIDTH = Dimensions.get("window").width;

class SearchBar extends React.Component {

  render() {
    const input = {
      }
    const inputText = {
      fontSize: 16,
      color: this.props.colors.text,
      fontFamily: "OpenSans",
      includeFontPadding: false,
    }
    return (
      <View style={input}>
        <TextInput
        ref={input => { this.textInput = input }} 
          style={inputText}
          name="text"
          type="text"
          autoFocus={true}
          placeholder="Type timezone"
          placeholderTextColor={this.props.colors.gray}
          value={this.props.searchText}
          onChangeText={(text) => this.props.handleChangeText(text) }
        />
      </View>
    )
  }
}

class Results extends React.Component {

renderItems = (item) => {

  const listRow = {
    width: "100%",
    height: 60,
  }
  const listRowPadding = {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    padding: 16

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
  const listText = {
    color: this.props.colors.text,
    fontSize: 16,
    fontFamily: 'Poppins-Regular', 
    includeFontPadding: false
  }
  const descriptionText = {
    color: this.props.colors.gray,
    fontSize: 14,
    fontFamily: 'Poppins-Regular', 
    includeFontPadding: false
  }
  return (
    <TouchableNativeFeedback onPress={() => this.props.selectTimezone(item)} 
    background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
      this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }
    >
    <View style={listRow}>
    <View style={listRowPadding}>

    <View style={iconCol}>
    <Icon name="earth" size={24} color={this.props.colors.gray}/>
    </View>
    <View style={textCol}>
      <Text style={listText}>
        {item.name}
        </Text>
        <Text style={descriptionText}>
        {item.value}
        </Text>

    </View>
      </View>
      </View>

    </TouchableNativeFeedback>
          )
  } 



  render() {
    return (
      <View style={{ flex: 1}}>
      <ScrollView >
     
      <FlatList
      data={this.props.results}
      keyExtractor={item => item.name}
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
      ?<View style={{ flex: 1, padding: 16,  }}>
      <Results
      results={this.props.results}
      darkTheme={this.props.darkTheme}
      colors={this.props.colors}
      selectTimezone={this.props.selectTimezone}

      />
     
      </View>
      : null
      }
      </View>
      
    )
  }
}


export default class SearchTimezones extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     searchText: "",
     results: [],
    }
  }
  static navigationOptions = {
    header: null,
    }


handleChangeText = (text) => {
  this.setState({ searchText: text })

  //Search text after 2 characters
  this.state.searchText.length > 0 
  ? this.searchData(text)
  : null
}

clearText = () => {
  this.setState({ searchText: "" })
}

compareWords = (text, searchText) => {
  let wordsInText = text.split("/");

  if (searchText.indexOf("/") < 1) {
    for (let i = 0; i < wordsInText.length; i++) {
      if (wordsInText[i].slice(0, searchText.length).toLowerCase() === searchText.toLowerCase()) {
        return true
      }
    }
  } else {
    //split text in search to words
    let wordsInSearchText = searchText.split("/");
    for (let i = 0; i < wordsInText.length; i++) {
      for (let j = 0; j < wordsInSearchText.length; j++) {
        if (wordsInText[i].slice(0, wordsInSearchText[j].length).toLowerCase() === wordsInSearchText[j].toLowerCase() && wordsInSearchText[j].length > 1) {
          return true
        }
      }
    }
  }

}
searchData = (text) => {
  //Search all stored data in state

  let data = []

  let foundTimezones = timezones.filter(item => {
    return this.compareWords(item.name, text)
  })
  this.setState({ results: foundTimezones})
}

 
  render() {
    const headerStyle = {
      backgroundColor: this.props.colors.header,
      color: this.props.colors.text,
      elevation: 0
    }
    const darkTheme = this.props.darkTheme
    

    return (
      <Container>
      <Header 
   style={headerStyle}
   >
                   <StatusBar backgroundColor={this.props.colors.surface} barStyle={darkTheme ? "light-content" : "dark-content"} />
       <Left>
    <HeaderIcon darkTheme={this.props.darkTheme} ripple={this.props.colors.ripple} headerIcon="arrow-left" color={this.props.colors.gray } headerFunction={() => {this.props.hideModalTime()
    }}/>
    </Left>
    <Body >
    <SearchBar 
    darkTheme={darkTheme} 
    colors={this.props.colors}
    searchText={this.state.searchText}
    handleChangeText={this.handleChangeText}/>
    
    </Body>
    <Right>
      {this.state.searchText.length > 0
      ? <HeaderIcon darkTheme={this.props.darkTheme} ripple={this.props.colors.ripple} headerIcon="close" color={this.props.colors.gray } headerFunction={() => this.clearText()
    } />
      : null
      }
    
       </Right>
     </Header>
     <View style={{ flex: 1, backgroundColor: this.props.colors.surface }}>
        {this.props.isLoadingData
        ? <Text>Loading</Text> 
        : <SearchMain 
          searchData={this.searchData}
          results={this.state.results}
          searchText={this.state.searchText}
          darkTheme={this.props.darkTheme}
          colors={this.props.colors}
          selectTimezone={this.props.selectTimezone}
        />
        }
       
      </View>
      </Container>
    );
  }
}





