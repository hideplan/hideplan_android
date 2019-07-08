import React from "react";
import { Button, TextInput, View, Text, StyleSheet, FlatList, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableHighlight, Dimensions, Animated, Easing, ScrollView } from "react-native"
import Ionicons from 'react-native-vector-icons/Ionicons';
import { FAB } from 'react-native-paper';

const { height, width } = Dimensions.get('window');

const MyComponent = () => (
    <FAB
      style={styles.fab}
      small
      icon="add"
      onPress={() => console.log('Pressed')}
    />
  );
  
  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      margin: 16,
      right: 0,
      bottom: 0,
    },
  })
  


export class ActionBar extends React.Component {
    render() {
        const container = {
            width: "100%",
            position: "absolute",
            bottom: 25,
            alignItems: "center",
            zIndex: 99999999999999999999999999999,
            
        }
        const fabButtonContainer = {
            borderRadius: 12,
            zIndex: 99999999999999999999999999999,
            justifyContent: "center",
            elevation: 6,
            opacity: 1,

        }
        const fabButton = {
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            elevation: 1,
            padding: 12,
            backgroundColor: '#185abc',
            borderRadius: 14,
            paddingLeft: 14,
            paddingRight: 14,
            zIndex: 99999999999999999999999999999,

        }
        const fabText = {
            marginLeft: 10,
            color: "white",
            fontSize: 17,
            alignSelf: "center",

        }

        return (
            <View style={container}>
     
                <View style={fabButtonContainer}>
                <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('gray', true)}
                onPress={this.props.onPress}
            >
                <View style={fabButton}>
                <Ionicons name="md-add" size={20} color="white" />
                <Text style={fabText}>{this.props.title}</Text>
                </View>
                </TouchableNativeFeedback>

                </View>
            </View>
        )
    }
}

export class FabIcon extends React.Component {
    render() {
        const container = {
            position: 'absolute',
            width: 60,
            height: 60,
            bottom: 25,
            opacity: 1,
            right: 35,
            elevation: 8,
            zIndex: 99999999999999999,

        }
        const fabView = {
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#185abc',
      
            justifyContent: "center",
            alignItems: "center",
        }

        return (
            <View style={container}>
            <TouchableNativeFeedback
                background={TouchableNativeFeedback.Ripple('gray', true)}
                onPress={this.props.onPress}
            >
                <View style={fabView}>
                <Ionicons name="md-add" size={30} color="white" />
                </View>
            </TouchableNativeFeedback>
            </View>
        )
    }
}


export class BasicButton extends React.Component {
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
            fontFamily: "Roboto"
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

export class FormButton extends React.Component {
    render() {

        const buttonView = {
            flex: 1,
            padding: 30,
            paddingLeft: width / 3,
            paddingRight: width / 3,
            width: width,
            fontSize: 26,
            height: 30,
        }

        return (
            <View style={buttonView}>
                <TouchableNativeFeedback
                    background={TouchableNativeFeedback.Ripple('gray', true)}
                    onPress={() => { }}
                >
                    <Button
                        disabled={this.props.disabled}
                        color="#EF2647"
                        loading={this.props.isLoading}
                        onPress={this.props.onPress}
                        title={this.props.title}
                    />
                </TouchableNativeFeedback>

            </View>
        )
    }
}

export class Dialog extends React.Component {
    render() {
        const dialogMainView = {
            flex: 1,
            width: width,
            height: height,
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: "rgba(10, 15, 14, 0.253)",
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
            fontFamily: "Roboto",
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
            <View>
                {this.props.isVisible
                    ? <View style={dialogMainView}>
                        <View style={dialogBox}>
                            <View style={dialogTexView}>
                                <Text style={dialogText}>{this.props.text}</Text>
                            </View>
                            <View style={buttonRow}>
                                <View style={buttonView}>
                                    <TouchableNativeFeedback
                                        background={TouchableNativeFeedback.Ripple('gray', true)}
                                        onPress={() => { this.props.confirmFunction() }}
                                    >
                                        <Button title={this.props.confirmText} onPress={() => { this.props.confirmFunction() }} />
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={buttonView}>
                                    <TouchableNativeFeedback
                                        background={TouchableNativeFeedback.Ripple('gray', true)}
                                        onPress={() => { this.props.cancelFunction() }}
                                    >
                                        <Button title={this.props.cancelText} onPress={() => { this.props.cancelFunction() }} />
                                    </TouchableNativeFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                    : null
                }
            </View>
        )
    }
}


export class LabelBottom extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            textColor: "gray",
        };
    }
    render() {
        const labelBottom = {
            paddingLeft: 18,
            paddingTop: 30,
            width: width,
            height: 14,
        }

        const textWarning = {
            fontSize: 14,
            color: "red",
            fontFamily: "Roboto"

        }

        const textNormal = {
            fontSize: 14,
            color: "gray",
            fontFamily: "Roboto"

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
            borderColor: "gray",
            textColor: "gray",
            textInputBackground: "gray",
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
    }

    onFocus = () => {
        this.setState({ borderColor: "dodgerblue", textColor: "dodgerblue", textInputBackground: "dodgerblue" })
    }

    onBlur = () => {
        this.setState({ borderColor: "gray", textColor: "gray", textInputBackground: "gray" })
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
            fontSize: 18,
            color: this.state.textColor,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,

        }
        const labelTextError = {
            fontSize: 18,
            color: "red",
            fontFamily: 'Poppins-Regular', includeFontPadding: false,

        }

        const textInputStyle = {
            height: 60,
            borderColor: this.state.borderColor,
            borderWidth: 1,
            borderRadius: 6,
            padding: 12,
            fontSize: 18,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,
            color: "white",
            backgroundColor: this.state.textInputBackground

        }

        const errorStyle = {
            height: 60,
            borderColor: "red",
            borderWidth: this.state.borderWidth,
            borderRadius: 6,
            padding: 12,
            paddingRight: 20,
            fontSize: 18,
            fontFamily: 'Poppins-Regular', includeFontPadding: false,
            color: "white",
            backgroundColor: "red",

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
                        placeholderTextColor= "gray"
                        secureTextEntry={this.state.passwordIsHidden}
                        style={errorStyle}
                        onFocus={() => { this.onFocus() }}
                        onBlur={() => { this.onBlur() }}
                        onChangeText={this.props.onChangeText}
                        value={this.props.value}
                    />
                    : <TextInput
                        placeholderTextColor= "mintcream"
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
                                ? <Text style={{color: this.props.value.length > 0 ? "mintcream" : "gray", fontSize: 15}}>Show</Text>
                                : <Text style={{color: this.props.value.length > 0 ? "mintcream" : "gray", fontSize: 15}}>Hide</Text>
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

export class HeaderIcon extends React.Component {
    render() {
        const headerViewStyle = {
            marginRight: 10,
            borderRadius: 20,
            width: 40,
            color: this.props.color,
            height: 40,
            justifyContent: "center"
        }

        return (
            <View style={headerViewStyle}>
                <TouchableNativeFeedback
                    onPress={this.props.headerFunction}
                    background={TouchableNativeFeedback.Ripple('gray', true)}
                >
                    <View style={{ alignItems: "center" }}>
                        <Ionicons name={this.props.headerIcon} size={30} color={this.props.color} />
                    </View>
                </TouchableNativeFeedback>
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
            this.setState({ toastColor: "#17191d" })
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
            bottom: 10,
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
            fontSize: 18,
            color: "white"
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
            fontSize: 18,
            color: "white"
        }

        return (
            <Animated.View style={boxStyle}>
                 {this.props.children}
            </Animated.View>
        )
    }
}


export class Modal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
  
      };
    }
  
  
    render() {
  
      const wrapper = {
        display: "flex",
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "rgba(27, 23, 37, 0.473)",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 20,
        flex: 1,
  
      }
  
      const body = {
        padding: 20,
        backgroundColor: "#202526",
        width: (width / 3) * 2,
        height: height / 8 ,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        elevation: 5,
        zIndex: 9999999999999,
      }
  
  
  
      return (
        <TouchableWithoutFeedback onPress={() => { this.props.hideModal() }}>
          <View style={wrapper}>
            <TouchableWithoutFeedback>
                {this.props.renderContent()}
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
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
            fontFamily: "Roboto",
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