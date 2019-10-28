import React from "react";
//import "./Register.css";
import { Keyboard, View, Text, TextInput, FlatList, ScrollView, TouchableOpacity, Switch, StyleSheet, StatusBar, Alert, Dimensions, TouchableWithoutFeedback, TouchableNativeFeedback, VirtualizedList } from "react-native"
import dateFns, { isFuture, getISOWeek, getMinutes, getHours, getDay, getYear, getMonth, getDate, addMinutes, isSameDay, isWithinRange, isSameHour, areIntervalsOverlapping, differenceInMinutes, addDays, subDays, addWeeks, subWeeks, getTime, differenceInCalendarDays } from "date-fns";
import { parse } from "../../functions";
import NavigationService from '../../NavigationService.js';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AppHeader } from '../../customComponents.js';
import { encryptData } from '../../encryptionFunctions';
import { sendPost, hashForComparingChanges } from '../../functions.js';
import { createId } from '../../functions';
import { Container, Header, Left, Body, Right, Title, Content, Fab, ListItem, CheckBox, Tab, Tabs, TabHeading } from 'native-base';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MyModal } from '../../customComponents.js';
import { IconButton, Button } from 'react-native-paper';

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
      color: "",
      colorsVisible: false
    };
  }

  componentDidMount () {

    this.setState({calendar: this.props.item.calendar, color: this.props.item.color})
  }  

  editCalendar = () => {
    let timestamp = parse(new Date())
    let calendarName = this.state.calendar
    let color = this.state.color
    let calendar = this.state.calendar
    let calendarObj
    let uuid = this.props.item.uuid

    calendarObj = JSON.stringify({calendar: this.state.calendar, color: color, isChecked: true, updated: timestamp.toString()})

      let encryptedData = encryptData(calendarObj, this.props.cryptoPassword)

      this.props.editItem({
        "uuid": uuid, "data": encryptedData, "updated": timestamp.toString(), "type": "calendars", "parrent": "", "shared": "" }, {"uuid": uuid, "calendar": calendar, "color": color, "isChecked": true, updated: timestamp.toString()}, "calendars", "Calendar created")
    


  
    NavigationService.navigate('CalendarsSettings')

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
        return <TouchableNativeFeedback onPress={() => {this.selectColor(color), this.MyModal.close()}}
        background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
          this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
        <View style={{flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", width: "100%", padding: 14}}>
              <View style={{
                 height: 18,
                 width: 18,
                 borderRadius: 9,
                 marginRight: 15,
                backgroundColor: this.props.darkTheme? color.s200 : color.s600,  
              }}
              >
          </View>
          <Text style={{ fontSize: 16 }}> 
            {color.name}
          </Text>


          </View>

        </TouchableNativeFeedback>
      })
    }
  
    render() {
      const colorListOLD = [{"red": {"name": "red", "s200": "#ef9a9a", "s600": "#e53935"}}, {"pink": {"name": "pink", "s200": "#f48fb1", "s600": "#d81b60"}}, {"purple": {"name": "purple", "s200": "#ce93d8", "s600": "#8e24aa"}}, {"deepPurple": {"name": "deep purple", "s200": "#b39ddb", "s600": "#5e35b1"}}, {"indigo": {"name": "indigo", "s200": "#9fa8da", "s600": "#3949ab"}}, {"blue": {"name": "blue", "s200": "#90caf9", "s600": "#1e88e5"}}, {"lightBlue": {"name": "light blue", "s200": "#81d4fa", "s600": "#039be5"}}, {"cyan": {"name": "cyan", "s200": "#80deea", "s600": "#00acc1"}}, {"teal": {"name": "teal", "s200": "#80cbc4", "s600": "#00897b"}}, {"green": {"name": "green", "s200": "#a5d6a7", "s600": "#43a047"}}, {"lightGreen": {"name": "light green", "s200": "#c5e1a5", "s600": "#7cb342"}}, {"lime": {"name": "lime", "s200": "#e6ee9c", "s600": "#c0ca33"}}, {"yellow": {"name": "yellow", "s200": "#fff59d", "s600": "#fdd835"}}, {"amber": {"name": "amber", "s200": "#ffe082", "s600": "#ffb300"}}, {"orange": {"name": "orange", "s200": "#ffcc80", "s600": "#fb8c00"}}, {"deepOrange": {"name": "deep orange", "s200": "#ffab91", "s600": "#f4511e"}}, {"brown": {"name": "brown", "s200": "#bcaaa4", "s600": "#6d4c41"}}, {"blueGrey": {"name": "blue grey", "s200": "#b0bec5", "s600": "#546e7a"}}]

      const colorList = [{"name": "red", "s200": "#ef9a9a", "s600": "#e53935"}, {"name": "pink", "s200": "#f48fb1", "s600": "#d81b60"}, {"name": "purple", "s200": "#ce93d8", "s600": "#8e24aa"}, {"name": "deep purple", "s200": "#b39ddb", "s600": "#5e35b1"}, {"name": "indigo", "s200": "#9fa8da", "s600": "#3949ab"}, {"name": "blue", "s200": "#90caf9", "s600": "#1e88e5"}, {"name": "light blue", "s200": "#81d4fa", "s600": "#039be5"}, {"name": "cyan", "s200": "#80deea", "s600": "#00acc1"}, {"name": "teal", "s200": "#80cbc4", "s600": "#00897b"}, {"name": "green", "s200": "#a5d6a7", "s600": "#43a047"}, {"name": "light green", "s200": "#c5e1a5", "s600": "#7cb342"}, {"name": "lime", "s200": "#e6ee9c", "s600": "#c0ca33"}, {"name": "yellow", "s200": "#fff59d", "s600": "#fdd835"}, {"name": "amber", "s200": "#ffe082", "s600": "#ffb300"},  {"name": "orange", "s200": "#ffcc80", "s600": "#fb8c00"}, {"name": "deep orange", "s200": "#ffab91", "s600": "#f4511e"}, {"name": "brown", "s200": "#bcaaa4", "s600": "#6d4c41"}, {"name": "blue grey", "s200": "#b0bec5", "s600": "#546e7a"}]

      const textBoxStyle = {
        width: "100%",
        padding: 16

      }
      const textStyle = {
        color: this.props.colors.text,
        fontSize: 18,
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
        backgroundColor: this.props.colors.header,
        borderBottomLeftRadius: 6,
        borderTopLeftRadius: 6,
        alignSelf: "center",
  
      }
      const floatColorContent = {
        backgroundColor: this.props.colors.header,
        width: 30,
        position: "absolute",
        height: 150
      }
      const floatColorInput = {
        width: 30,
        height: 30,
        borderRadius: 15,
        flex: 1,
  
      }
  
  
      return (
        <View style={{ flex: 1, backgroundColor: this.props.colors.surface}}>
        <View style={textBoxStyle}>
         <TextInput
              placeholderTextColor={this.props.colors.gray}
              style={textStyle}
              placeholder="Type calendar name"
              autoFocus={true}
              type="text"
              name="calendar"
              numberOfLines = {1}
              value={this.state.calendar}
              onChangeText={(calendar) => this.setState({ calendar })}
              />
              </View>
              <View style={{borderBottom: "solid", borderBottomWidth: 0.2,
          borderBottomColor: this.props.colors.border}} />
              <TouchableNativeFeedback onPress={() => this.MyModal.open()} background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
    this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
            <View
              style={{
                padding: 16
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: 26,
                    marginRight: 16
                  }}
                >
                  <Icon
                    name="checkbox-blank-circle"
                    size={24}
                    color={this.props.darkTheme ? this.state.color.s200 : this.state.color.s600
                    }
                  />
                </View>

                <Text
                  style={{
                    fontSize: 16,
                    color: this.props.colors.text
                  }}
                >
                  {this.state.color.name}
                </Text>
              </View>
            </View>
          </TouchableNativeFeedback>

                <View
            style={{
              borderBottomWidth: 0.2,
              borderBottomColor: this.props.colors.border
            }}
          />
             
 
             <MyModal ref={ref => {this.MyModal = ref;}} fullHeight={true} darkTheme={this.props.darkTheme}>
          <View style={{flex: 1, width: "100%"}}>
          <ScrollView style={{flex: 1, width: "100%"}}>

          {this.renderColors(colorList)}
          </ScrollView>

          </View>
        </MyModal>


             


        </View>
      )
  
    }
  }

export default class EditCalendarScreen extends React.Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  static navigationOptions = {
    header: null,
    };

    alertCalendar = (item) => {

      Alert.alert(
        'Delete calendar',
        `Do you want to delete calendar "${item.calendar}" and all associated events?`,
        [
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
          {text: 'Delete', onPress: () => {this.props.screenProps.deleteParrent(item, "calendars", "events"), NavigationService.navigate('Calendar')
        },
          }
          ],
      );
    }

  componentDidMount() {
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
                 <StatusBar backgroundColor={this.props.screenProps.colors.header} barStyle={darkTheme ? "light-content" : "dark-content"} />

<AppHeader style={headerStyle}
screen="subscreen"
darkTheme={this.props.screenProps.darkTheme}
colors={this.props.screenProps.colors}
title={"Edit calendar"}
hasHeaderShadow={true}
menuIcon={() => { return <IconButton 
icon="arrow-left"
theme={{dark: this.props.screenProps.darkTheme}}
color={this.props.screenProps.colors.gray}
size={24}
onPress={() => this.props.navigation.goBack(null)}
 /> }}
 icons={[ <Button uppercase={false} mode="text" color={this.props.screenProps.colors.primary} onPress={() => this.child.current.editCalendar()}>Save</Button>]}
 />
      <View style={{ flex: 1, backgroundColor: this.props.screenProps.colors.surface}}>
      <View style={{ flex: 1}}>
      {this.props.navigation.state.params
      ?<ListInput 
      ref={this.child}
      cryptoPassword={this.props.screenProps.cryptoPassword}
      editItem={this.props.screenProps.editItem}
      darkTheme={this.props.screenProps.darkTheme}
      item={this.props.navigation.state.params}
      calendars={this.props.screenProps.calendars}
      colors={this.props.screenProps.colors}
      />
    : null
    }
      
      </View>

      </View>
      </Container>

    );
  }
}


module.exports = EditCalendarScreen;

