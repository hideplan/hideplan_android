import React from "react";
import {TextInput, View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableHighlight, Dimensions, Animated, Easing, ScrollView, Modal } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Drawer, Portal, Button } from 'react-native-paper';

const { height, width } = Dimensions.get('window');


export class MyDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

    
        }
        };

        renderContent = () => {
            return this.props.content.map(item => {
                return item
            })
        }
    confirm = () => {
        this.props.confirm()
        this.props.hide()
    }
    render() {
        const wrapper = {
            flex: 1, position: "absolute", height: height, width: width, top: 0, left: 0, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0,0, 0.30)", zIndex: 99996,
        }

        const container = {
            width: width - 48,
            elevation: 16,
            borderRadius: 4,
            maxHeight: (height / 3) * 2  ,
            backgroundColor: this.props.colors.modal,
            alignItems: "flex-start",
            justifyContent: "flex-start"
        }
        const titleText = {
            fontSize: 20,
            margin: 0,
            padding: 0,
            color: this.props.colors.text,
            fontFamily: 'OpenSans', 
        }
        const bodyText = {
            fontSize: 16,
            margin: 0,
            padding: 0,
            color: this.props.colors.text,
            fontFamily: 'OpenSans', 
        }
        const textBoxTitle = {
            padding: 24,
        }
        const textBox = {
            padding: 24,
            paddingTop: 0,
        }
        const buttonsContainer = {
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            flexDirection: "row",
            padding: 16,

        }

        return (
            
            <Modal 
            animationType="none"
            transparent={true}
            visible={true}
            onRequestClose={() => {
              this.props.hide()
            }}>
            <TouchableWithoutFeedback onPress={this.props.hide}>
            <View style={wrapper}>
            <TouchableWithoutFeedback>
            <View style={container}>
                <View style={textBoxTitle}>
                <Text style={titleText}>
                {this.props.title}
                </Text>
                </View>
                {this.props.text
                ?  <View style={textBox}><Text style={bodyText}>{this.props.text}</Text></View>

                : null
    }
   
    {this.props.content
    ? this.props.content()
    : null}
        <View style={buttonsContainer}>
        <Button upperCase={false} mode="text" color={this.props.colors.primary} labelStyle={{fontSize: 14}} dark={this.props.darkTheme ? false : true} onPress={() => this.props.hide()}>
Cancel
              </Button>
              {this.props.confirm
                 ?   <Button upperCase={false} mode="text" color={this.props.colors.primary} labelStyle={{fontSize: 14}} dark={this.props.darkTheme ? false : true} onPress={() => this.confirm()}>
                    Confirm
                                  </Button>
            : null}
        </View>
            </View>
            </TouchableWithoutFeedback>

                </View>
                </TouchableWithoutFeedback>
                </Modal>
        )
    }
}


export class AppHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

    
        }
        };

    renderIcons = (data) => {
        return data.map(item => {
            return (
                <View style={{}}>
                    {item}
                </View>
            )
        })
    } 

    
    render() {
        const headerMain = {
            height: 56,
            elevation: this.props.hasHeaderShadow && this.props.darkTheme == false ? 8 : 0,
            zIndex: 2,
            backgroundColor: !this.props.hasHeaderShadow ?this.props.colors.surface : this.props.colors.header,
            padding: 16,
            paddingRight: 0,
            paddingLeft: 4, 
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",

            
        }
        const titleBox = {
            flex: 1,
            height: 56,
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: 24,
            flexDirection: "column",

        }
        const titleText = {
            fontSize: this.props.screen == "subscreen" ? 18 : 28,
            margin: 0,
            padding: 0,
            color: this.props.colors.text,
            fontFamily: 'OpenSans-Bold', 
            fontWeight: "bold",

            includeFontPadding: false,
   
        }
        const subtitleText = {
            color: this.props.colors.gray,fontFamily: 'OpenSans',includeFontPadding: false,
            fontSize: 12, padding: 0, margin: 0
        }

        return (
            
            <View style={headerMain}>
                {this.props.menuIcon()}
                <View style={{flex: 1,flexDirection: "row-reverse", justifyContent: "center", alignItems: "flex-start"}}>
                <View style={{ height: 56, paddingRight: 4, justifyContent: "center", alignItems: "center", flexDirection: "row", alignSelf: "flex-end"}}>
                {this.renderIcons(this.props.icons)}
                </View>
                <View style={titleBox}>
                <Text numberOfLines={1} style={titleText}>
                {this.props.title}
                </Text>

                {this.props.subtitle
                ? <Text style={subtitleText}>
                {this.props.subtitle}
                </Text>
                : null
                }
                </View>
               
                </View>

            </View>
        )
    }
}


export class AppHeaderSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

    
        }
        };


    
    render() {
        const headerMain = {
            height: 56,
            elevation: this.props.hasHeaderShadow && this.props.darkTheme == false ? 8 : 0,
            zIndex: 2,
            backgroundColor: !this.props.hasHeaderShadow ?this.props.colors.surface : this.props.colors.header,
            padding: 16,
            paddingRight: 0,
            paddingLeft: 4, 
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",

            
        }
        const titleBox = {
            flex: 1,
            height: 56,
            alignItems: "flex-start",
            justifyContent: "center",
            paddingLeft: 32,
            flexDirection: "column",

        }
        const titleText = {
            margin: 0,
            padding: 0,
   
        }
        const subtitleText = {
            color: this.props.colors.gray,fontFamily: 'OpenSans',includeFontPadding: false,
            fontSize: 12, padding: 0, margin: 0
        }

        return (
            
            <View style={headerMain}>
                {this.props.menuIcon()}
                <View style={{flex: 1,flexDirection: "row-reverse", justifyContent: "center", alignItems: "flex-start"}}>
                <View style={{ height: 56, paddingRight: 4, justifyContent: "center", alignItems: "center", flexDirection: "row", alignSelf: "flex-end"}}>
                {this.props.renderIcon()}
                </View>
                <View style={titleBox}>
     
                {this.props.renderSearchBar()}

               
                </View>
               
                </View>

            </View>
        )
    }
}
export class DrawerHeader extends React.Component {

    render() {
       const headerRow = {
           margin: 16,
           flexDirection: "column",
           flex: 1,
            height: 56
       }
       const titleBox = {
        justifyContent: "flex-end",
        alignItems: "flex-start",
        flex: 1,
        flexDirection: "column",
        height: 36

       }
       const title = {
           fontSize: 20,
           margin: 0,
           padding: 0,
           color: this.props.colors.text,
           fontFamily: 'Poppins-Regular', 
           includeFontPadding: false,
       }
       const subtitleBox = {
        justifyContent: "flex-end",
        alignItems: "flex-start",
        height: 20,

       }
       const subtitle = {
           fontSize: 13,
           margin: 0,
           padding: 0,
           color: this.props.colors.gray,
           fontFamily: 'Poppins-Regular', 
           includeFontPadding: false,


       }

        return (
            <View style={headerRow}>
                <View style={titleBox}>
            <Text style={title}>
                Hideplan
            </Text>
            </View>
            <View style={subtitleBox}>
            <Text style={subtitle}>
            {this.props.user}
            </Text>
            </View>
            </View>
        )
    }
}
export class DrawerDivider extends React.Component {

    render() {
       

        return (
            <View>
             
            </View>
        )
    }
}
export class DrawerRowGroup extends React.Component {



      renderDrawerSection = () => {

        return this.props.options.map(item => {
            let itemName
            if (this.props.title == "Lists") {
                itemName = item.list
            } else {
                itemName = item.notebook
            }

            return (
                <Drawer.Item
                active={this.props.selectedItem.uuid == item.uuid}
                label={itemName}
                icon={this.props.icon}
                onPress={() => { this.props.close(), this.props.func(item) }}
              />
               

            )
        })
       
    }
    
    render() {


        return (
            <Drawer.Section title={this.props.title}>
            {this.renderDrawerSection()}
            </Drawer.Section>
        )
    }
}
export class DrawerRowGroupCalendars extends React.Component {

    
  getCalendarColor = (item) => {
    
    //TODO Temporary till migrate all old settings for calendars
    if (item.color.s200) {
      if (this.props.darkTheme) {
        return item.color.s200
      } else {
        return item.color.s600
      }
    } else {
      return item.color
    }
  }

  renderDrawerSection = () => {
     
        return this.props.options.map(item => {
            let calendarColor = this.getCalendarColor(item)

            return (
                <Drawer.Item
                theme={{colors: {text: calendarColor}}}
                style={{color: calendarColor}}
                label={<Text style={{color: this.props.colors.gray}}>{item.calendar}</Text>}
                icon={item.isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
                onPress={() => { this.props.func(item.uuid) }}
              />
            )
        })
    }

    render() {


        return (
            <Drawer.Section title={this.props.title}>
            {this.renderDrawerSection()}
            </Drawer.Section>
        )
    }
}
export class DrawerRow extends React.Component {

    render() {
        const drawerRow = {

            flex: 1,
            height: 48
        }
        const rowTouchable = {
            flexDirection: "row",
            flex: 1,
            borderRadius: 4,
            margin: 16
        }
        const iconBox = {
            alignItems: "flex-start",
            justifyContent: "center",
        }
        const labelBox = {
            alignItems: "flex-start",
            justifyContent: "center",
            marginLeft: 16,
        }
        const labelText = {
            fontSize: 16,
            margin: 0,
        padding: 0,
        color: this.props.colors.gray,
        fontFamily: 'Poppins-Regular', 
        includeFontPadding: false,


    }

        return (
            <View style={{flex: 1}}>
            <TouchableNativeFeedback
            onPress={() => {
              this.props.func(), this.props.drawer.close()
             }
            }
            background={this.props.darkTheme ? TouchableNativeFeedback.Ripple(
              this.props.colors.ripple) : TouchableNativeFeedback.SelectableBackground() }>
            <View style={drawerRow}>
            
            <View style={rowTouchable}>
                        <View style={iconBox}>
                        <Icon
                          name={this.props.icon}
                          size={24}
                          color={this.props.colors.gray}
                        />
                        </View>
                        <View style={labelBox}>
                        <Text style={labelText}>
                        {this.props.label}
                        </Text>
                        </View>
                      </View>
            </View>
            </TouchableNativeFeedback>
                </View>

        )
    }
}
export class DrawerSubtitle extends React.Component {

    render() {
        const subtitleRow = {
            justifyContent: "flex-end",
            alignItems: "flex-start",
            flex: 1,
            height: 28,
            marginTop: 8,
            marginLeft: 16,
            marginBottom: 8
        }
        const subtitleText = {
            fontSize: 16,
            margin: 0,
        padding: 0,
        color: this.props.colors.gray,
        fontFamily: 'Poppins-Regular', 
        includeFontPadding: false,
        }

        return (
            <View style={subtitleRow}>
             <Text style={subtitleText}>
                 {this.props.subtitle}
            </Text>
            </View>
        )
    }
}
export class LabelBottom extends React.Component {

    render() {
        const labelBottom = {
            paddingLeft: 18,
            paddingTop: 30,
            width: width,
            height: 14,
        }

        const textWarning = {
            fontSize: 14,
            color: this.props.gray,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,

        }

        const textNormal = {
            fontSize: 14,
            color: this.props.gray,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,

        }

        return (
            <View style={labelBottom}>
                {this.props.isVisible
                    ? <View>
                        {this.props.type === "warning"
                            ? <Text style={textWarning}>
                                {this.props.text}
                            </Text>
                            : <Text style={textNormal}>
                                {this.props.text}
                            </Text>
                        }
                    </View>
                    : null
                }
            </View>
        )
    }
}

export class Input extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            borderColor: "",
            textColor: "",
            labelColor: "",
            textInputBackground: "",
            textForInput: "",
            borderWidth: 1,
            isPassword: false,
            passwordIsHidden: false,
            icon: "md-eye-off"
        };
    }

    componentWillMount() {
        //Choose hidden input if it is password

        this.props.icon
            ? this.setState({ passwordIsHidden: true })
            : this.setState({ passwordIsHidden: false })
        this.setState({ 
            labelColor: this.props.colors.gray,
            textInputBackground: this.props.darkTheme ? this.props.colors.modal : this.props.colors.surface,
            textColor: this.props.darkTheme ?  this.props.colors.text : this.props.colors.gray,
            borderColor: this.props.darkTheme ?  this.props.colors.modal : this.props.colors.gray
        })
    }

    onFocus = () => {
        this.setState({ labelColor: this.props.colors.primary, borderColor: this.props.colors.primary, textColor: this.props.colors.text, textInputBackground: this.props.darkTheme? this.props.colors.modal : this.props.colors.surface })
    }

    onBlur = () => {
        this.setState({ labelColor: this.props.colors.gray, borderColor: this.props.darkTheme ?  this.props.colors.modal : this.props.colors.gray, textColor: this.props.darkTheme ?  this.props.colors.gray : this.props.colors.gray, textInputBackground: this.props.darkTheme ? this.props.colors.modal : this.props.colors.surface })
    }

    changePasswordView = () => {
        this.state.passwordIsHidden
            ? this.setState({ passwordIsHidden: false, icon: "md-eye" })
            : this.setState({ passwordIsHidden: true, icon: "md-eye-off" })
    }

    render() {
        const inputBoxStyle = {
            padding: 12,
            paddingBottom: 20,
            paddingTop: 20,
            width: width,
            height: 80,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,

        }

        const labelStyle = {
            paddingBottom: 4,
            paddingLeft: 10,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,

        }

        const labelText = {
            fontSize: 16,
            color: this.state.labelColor,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,

        }
        const labelTextError = {
            fontSize: 16,
            color: "#ef9a9a",
            fontFamily: 'Poppins-Regular', includeFontPadding: false,

        }

        const textInputStyle = {
            height: 60,
            borderColor: this.state.borderColor,
            borderWidth: 2,
            borderRadius: 6,
            padding: 12,
            fontSize: 16,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,
            color: this.state.textColor,
            backgroundColor: this.state.textInputBackground

        }

        const errorStyle = {
            height: 60,
            borderColor: "#ef9a9a",
            borderWidth: this.state.borderWidth,
            borderRadius: 6,
            padding: 12,
            paddingRight: 20,
            fontSize: 16,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,
            color: this.state.textColor,
            backgroundColor: "#ef9a9a",

        }

        const iconStyle = {
            position: "absolute",
            right: 25,
            top: 20,
        }


        return (

            <View style={inputBoxStyle}>
                <View style={labelStyle}>
                    {this.props.error
                        ? <Text style={labelTextError}>
                            {this.props.label}
                        </Text>
                        : <Text style={labelText}>
                            {this.props.label}
                        </Text>
                    }
                </View>
                {this.props.error
                    ? <TextInput
                        placeholderTextColor= "#eeeeee"
                        secureTextEntry={this.state.passwordIsHidden}
                        style={errorStyle}
                        onFocus={() => { this.onFocus() }}
                        onBlur={() => { this.onBlur() }}
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                    />
                    : <TextInput
                        placeholderTextColor={this.props.colors.gray}
                        secureTextEntry={this.state.passwordIsHidden}
                        style={textInputStyle}
                        onFocus={() => { this.onFocus() }}
                        onBlur={() => { this.onBlur() }}
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                    />
                }

                {this.props.icon 
                    ? <View style={iconStyle}>
                        <TouchableNativeFeedback onPress={() => { this.changePasswordView() }}>
                            <View style={{width: "100%"}}>
                                {this.state.passwordIsHidden
                                ? <Text style={{color: this.props.colors.gray, fontSize: 15}}>Show</Text>
                                : <Text style={{color: this.props.colors.gray, fontSize: 15}}>Hide</Text>
                                }
                            </View>
                        </TouchableNativeFeedback>
                    </View>
                    : null
                }

            </View>
        )
    }
}

export class HeaderIconMenu extends React.Component {
    render() {

        const container = {
            height: 28,
            width: 28,
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
        }
        return (

            <TouchableNativeFeedback
            style={container}
            onPress={this.props.headerFunction}
            hitSlop={
             {top: 10, left: 10, bottom: 10, right: 10 }}
            background={TouchableNativeFeedback.Ripple(
                this.props.ripple, true)}
        >
            <View>


           
                
                        <Icon name={this.props.headerIcon} size={24} color={this.props.color} />
                        </View>

            </TouchableNativeFeedback>


        )
    }
}
export class HeaderIcon extends React.Component {
    render() {

        const container = {
            height: 28,
            width: 28,
            margin: 10,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'visible',
        }

        return (
            <TouchableNativeFeedback
            style={container}
            onPress={this.props.headerFunction}
            hitSlop={
             {top: 10, left: 10, bottom: 10, right: 10 }}
            background={TouchableNativeFeedback.Ripple(
                this.props.ripple, true)}
        >
            <View>

                        <Icon name={this.props.headerIcon} size={24} color={this.props.color} />
                        </View>

                </TouchableNativeFeedback>
        )
    }
}
export class HeaderIconEmpty extends React.Component {
    render() {
        const headerViewStyle = {
            width: 48,
            justifyContent: "center",
            alignItems: "flex-end",

        }

        return (
            <View style={headerViewStyle}>
                

                        <Icon name={"settings"} size={24} color={"transparent"} />
            </View>
        )
    }
}
export class Toast extends React.Component {
    constructor(props) {
        super(props);
        this._bottom = new Animated.Value(0 - height / 4);
        this.state = {
            isShown: false,
            toastColor: "",
            duration: 4000
        };
    }

    configToast = () => {
        let toastType = this.props.toastType
        if (toastType === "normal") {
            this.setState({ toastColor: this.props.colors.modal })
        } else if (toastType === "warning") {
            this.setState({ toastColor: "#A82656" })
        } else if (toastType === "success") {
            this.setState({ toastColor: "#39BA80" })
        } else if (toastType === "info") {
            this.setState({ toastColor: "#D2691E" })
        }
    }

    componentWillMount() {
        this.configToast()
    }

    componentDidMount() {
     
    }

    show = () => {
        Animated.sequence([
            Animated.timing(this._bottom, {
                toValue: 100,
                easing: Easing.back(),
                duration: 600,
            }),
        ]).start();
    }

    hideFromView = () => {
        Animated.sequence([
            Animated.timing(this._bottom, {
                toValue: 0 - height / 4,
                duration: 600,
            }),
        ]).start();
    }



    render() {

        const containerStyle = {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 80,
            elevation: 8,
            alignItems: 'center',
            zIndex: 9999910000,
        }

        const boxStyle = {
            width: "95%",
            backgroundColor: this.state.toastColor,
            borderRadius: 5,
            justifyContent: "center",
            padding: 10,
            height: 50,
            elevation: 5,
            zIndex: 9999910000,

        }

        const textStyle = {
            fontSize: 16,
            color: this.props.colors.text
        }

        return (
            <View style={containerStyle}>
                <View style={boxStyle}>
                    <Text style={textStyle}>
                        {this.props.text}
                    </Text>
                </View>
            </View>
        )
    }
}

export class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this._height = new Animated.Value(0);
        this.state = {
            isShown: false,
            backgroundColor: "",
        };
    }

  

    componentWillMount() {
        this.setState({ backgroundColor: this.props.backgroundColor })
    }

    componentDidMount() {
        this.show()
        this.setState({ isShown: true })

        // Hide toast 
    }

    show = () => {
        Animated.sequence([
            Animated.timing(this._height, {
                toValue: 200,
                duration: 400,
            }),
        ]).start();
    }

    hideFromView = () => {
        Animated.sequence([
            Animated.timing(this._height, {
                toValue: 0,
                duration: 600,
            }),
        ]).start();
    }



    render() {

        const containerStyle = {
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: "100%",
            backgroundColor: 'rgba(52, 52, 52, 0.1)'
        }

        const boxStyle = {
            position: "absolute",
            top: 60,
            left: 50,
            width: "50%",
            backgroundColor: this.props.backgroundColor,
            borderRadius: 5,
            justifyContent: "center",
            padding: 10,
            height: this._height,
            elevation: 12,
            zIndex: 999991000990,

        }

        const textStyle = {
            fontSize: 16,
            color: "white"
        }

        return (
            <Animated.View style={boxStyle}>
                 {this.props.children}
            </Animated.View>
        )
    }
}


export class MyModal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        isOpen: false
      };
    }

    open = () => {
        this.setState({ isOpen: true })
    }
    close = () => {
       
        this.setState({ isOpen: false })
    }
    preventDefault = (event) => {
        event.stopPropagation()
        event.preventDefault()
    }

  
    render() {
  
      const wrapper = {
        width: width,
        backgroundColor: this.props.darkTheme ? "rgba(27, 23, 37, 0.4)" : "rgba(27, 23, 37, 0.6)",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        zIndex: 40,
        top: 0,
        left: 0,
        flex: 1,
        zIndex: 9999,
        elevation: 12,

      }
  
      const bodyStyle = {
        padding: 14,
        width: width - 40,
        height: this.props.fullHeight ? height - 150 : this.props.itemCount * 60,
        maxHeight: height - 150,
        minHeight: height / 4, 
        backgroundColor: this.props.darkTheme ? "#353639" : "#F9F9F9",
        borderRadius: 6,
        elevation: 12,
        zIndex: 99999,
        flexDirection: "column",
      }
  
  
      return (
        <Modal
        animationType="none"
        transparent={true}
        visible={this.state.isOpen}
        onRequestClose={() => {
          this.close()
        }}>
        <TouchableWithoutFeedback onPress={() => this.close()}>
        <View style={wrapper}>
        <TouchableWithoutFeedback onPress={(e) => this.preventDefault(e)}>
        <View style={bodyStyle}>
        {this.props.children}
        </View>
        </TouchableWithoutFeedback>
        </View>
        </TouchableWithoutFeedback>
        </Modal>

        
      )
    }
  }


export class AlertModal extends React.Component {
    render() {
        const dialogMainView = {
            flex: 1,
            width: width,
            height: height + 100,
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 99999999999999,
            backgroundColor: "black",
            justifyContent: "center",
        }
        const dialogBox = {
            flex: 1,
            backgroundColor: "white",
            left: width / 8,
            right: width / 8,
            width: (width / 8) * 6,
            height: height / 5,
            top: height / 4,
            position: "absolute",
            borderColor: "dodgerblue",
            borderRadius: 8,
            elevation: 10,
            color: "black",
            zIndex: 99999,
        }
        const dialogTexView = {
            flex: 1,
            padding: 14
        }
        const dialogText = {
            fontSize: 20,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,
            textAlign: "center"
        }
        const buttonRow = {
            flex: 1,
            flexDirection: "row",
        }
        const buttonView = {
            width: ((width / 8) * 6) / 2,
            height: 40
        }

        return (
 <View style={dialogMainView}>
                        <View style={dialogBox}>
                            <View style={dialogTexView}>
                                <Text style={dialogText}>{this.props.text}</Text>
                            </View>
                            <View style={buttonRow}>
                                <View style={buttonView}>
         
                                </View>
                            </View>
                        </View>
                    </View>

        )
    }
}



export class ListRow extends React.Component {
    render() {
        const buttonView = {
            flex: 1,
            padding: 30,
            width: width / 2,
            fontSize: 20,
            height: 25,
        }
        const buttonStyle = {
            background: "white",
            borderColor: "dodgerblue",
            color: "black",
            fontFamily: 'Poppins-Regular', includeFontPadding: false,
        }

        return (
            <View style={buttonView}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('gray', true)}
                    onPress={() => { }}
                >
                    <Button
                        style={buttonStyle}
                        loading={this.props.isLoading}
                        onPress={this.props.onPress}
                        title={this.props.title}
                    />
                </TouchableNativeFeedback>

            </View>
        )
    }
}
