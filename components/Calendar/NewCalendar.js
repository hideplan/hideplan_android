import React from "react";
//import "./Register.css";
import { Keyboard, ViewPagerAndroid, Button, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areRangesOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderIcon } from '../../customComponents.js';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { createId } from '../../functions';
import { Container, Header, Left, Body, Right, Icon, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import { Picker } from "native-base";

/*import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: ...']);
<script src="http://localhost:8097"></script>
console.disableYellowBox = true;
*/

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;


class ListInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      calendar: "",
      color: "springgreen",
      colorsVisible: false
    };
  }

  saveCalendar = () => {
    let timestamp = new Date().getTime()
    let calendarName = this.state.calendar
    let color = this.state.color
    let calendar = this.state.calendar
    let calendarObj
    let uuid = createId("calendar")

    calendarObj = JSON.stringify({calendar: this.state.calendar, color: color, isChecked: true})

      let encryptedData = encryptData(calendarObj, this.props.cryptoPassword)

      this.props.saveNewItem({
        "uuid": uuid, "data": encryptedData, "updated": timestamp, "type": "calendars", "parrent": "", "shared": "" }, {"uuid": uuid, "calendar": calendar, "color": color, "isChecked": true}, "calendars", "Calendar created")
    


  
    NavigationService.navigate('Calendar')

    }
    showColors = () => {
      this.state.colorsVisible
        ? this.setState({ colorsVisible: false })
        : this.setState({ colorsVisible: true }, Keyboard.dismiss())
    }
    selectColor = (color) => {
      this.setState({ color: color, colorsVisible: false })
    }
    renderColors = (colorList) => {
      return colorList.map(color => {
        return <TouchableNativeFeedback onPress={() => this.selectColor(color)}>
          <View style={{width: "100%", flexDirection: "row", paddingLeft: 14, paddingRight: 14, paddingBottom: 7, paddingTop: 7}}>
            <View style={{width: "20%"}}>
              <View style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: color,  
              }}
              >
              </View>          
          </View>
          <View style={{width: "80%"}}>
          <Text style={{color: this.props.darkTheme ? "white" : "black", fontSize: 18}}>
            {color}
          </Text>
          </View>


          </View>

        </TouchableNativeFeedback>
      
      })
    }
  
    render() {
      const colorList = ["salmon", "red", "crimson", "tomato", "orange", "darkkhaki", "violet", "magenta",  "springgreen", "seagreen", "teal", "mediumaquamarine", "slateblue", "blue", "mediumslateblue", "indigo", "navy", "steelblue", "royalblue", "peru", "sienna" ]

      const textBoxStyle = {
        width: "100%",
        padding: 8

      }
      const textStyle = {
        color: "white",
        fontSize: 18,
        padding: 4,
      }
      const floatRow = {
        height: 40,
        width: "100%",

        flexDirection: "row",
        padding: 5,
      }
      const floatColorBox = {
        padding: 9,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#1C1E28",
        borderBottomLeftRadius: 6,
        borderTopLeftRadius: 6,
        alignSelf: "center",
  
      }
      const floatColorContent = {
        backgroundColor: "#1C1E28",
        width: 30,
        position: "absolute",
        height: 150
      }
      const floatColorInput = {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: this.state.color,
        flex: 1,
  
      }
  
      return (
        <View style={{ flex: 1, backgroundColor: "rgb(29, 31, 38)" }}>
        <View style={textBoxStyle}>
         <TextInput
              placeholderTextColor="gray"
              style={textStyle}
              placeholder="Calendar name"
              autoFocus={true}
              type="text"
              name="calendar"
              numberOfLines = {1}
              value={this.state.calendar}
              onChangeText={(calendar) => this.setState({ calendar })}
              />
              </View>
              <View style={{borderBottom: "solid", borderBottomWidth: 0.4, borderBottomColor: "gray"}} />

              <TouchableNativeFeedback onPress={() => { this.showColors() }}>
              <View style={{width: "100%",flexDirection: "row", paddingLeft: 14, paddingRight: 14, paddingBottom: 7, paddingTop: 7}}>
            <View style={{width: "20%"}}>
              <View style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                backgroundColor: this.state.color,  
              }}
              >
              </View>          
          </View>
          <View style={{width: "80%"}}>
          <Text style={{color: this.props.darkTheme ? "white" : "black", fontSize: 18}}>
            {this.state.color}
          </Text>
          </View>


          </View>

                </TouchableNativeFeedback>


 


             
{this.state.colorsVisible
  ? <TouchableWithoutFeedback onPress={() => this.showColors()}>
    <View style={{ width: WIDTH, height: HEIGHT, position: "absolute", backgroundColor: "#00000077", alignItems: "center", justifyContent: "center" }}>
    <View style={{borderRadius: 8, width: WIDTH - 40, height: (HEIGHT / 6) * 4 ,  backgroundColor: "#202526", padding: 14, elevation: 8}}>
    <ScrollView>
    {this.renderColors(colorList)}
  </ScrollView>
  </View>
  </View>
  </TouchableWithoutFeedback>

  : 
  null
}

        </View>
      )
  
    }
  }



export default class NewCalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };



  componentDidMount() {
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
          <HeaderIcon headerIcon="md-arrow-back" color={darkTheme ? "white" : "black"} headerFunction={() => {
        this.props.navigation.goBack(null)
        }} />
         

            </Left>
          <Body>
            <Title>Add calendar</Title>
          </Body>
          <Right>
          <HeaderIcon headerIcon="md-checkmark" color={darkTheme ? "white" : "black"} headerFunction={() => {
          this.child.current.saveCalendar()
        }} />
            </Right>

</Header>
      <View style={{ flex: 1, backgroundColor: darkTheme ? "#202124" : "#F7F5F4" }}>
      <View style={{ flex: 1}}>

      <ListInput 
      ref={this.child}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      saveNewItem={this.props.screenProps.saveNewItem}
      darkTheme={this.props.screenProps.darkTheme}

      />
      </View>

      </View>
      </Container>

    );
  }
}


module.exports = NewCalendarScreen;

