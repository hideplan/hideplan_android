import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Dimensions, View, Modal, TouchableOpacity, Animated, PanResponder } from "react-native";
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
import { Portal } from 'react-native-paper';

const drawerHeight = HEIGHT / 2

const SUPPORTED_ORIENTATIONS = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right"
];

class MyBottom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: true,
      animatedHeight: new Animated.Value(0),
      pan: new Animated.ValueXY(),
      isExpanded: false
    };

    this.createPanResponder(props);
  }

  setModalVisible(visible) {
    const { height, minClosingHeight, duration, onClose } = this.props;
    const { animatedHeight, pan } = this.state;
    if (visible) {
      this.setState({ modalVisible: visible });
      Animated.timing(animatedHeight, {
        toValue: HEIGHT,
        duration
      }).start(status => {
        //this.state.pan.x.setOffset(200);

      });
    } else {
      Animated.timing(animatedHeight, {
        toValue: minClosingHeight,
        duration
      }).start(() => {
        pan.setValue({ x: 0, y: 0 });
        this.setState({
          modalVisible: visible,
          animatedHeight: new Animated.Value(0)
        });

        if (typeof onClose === "function") onClose();
      });
    }
  }

  createPanResponder(props) {
    const { closeOnSwipeDown, height } = props;
    const { pan } = this.state;
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
    },    
      onPanResponderMove: (e, gestureState) => {

      if (this.state.isExpanded) {
        this.state.pan.setOffset({x: 0, y: drawerHeight }) //Set offset for opened drawer 
        if (gestureState.dy < 0) {
          Animated.event([null, { dy: pan.y  }])(e, gestureState);
        }
      } else {
        this.state.pan.setOffset({x: 0, y: 0 })  //Set offset for closed drawer 

        if (gestureState.dy < drawerHeight) {
          Animated.event([null, { dy: pan.y  }])(e, gestureState);

        }
      }
      },
      onPanResponderRelease: (e, gestureState) => {
        
        if (this.state.isExpanded) {
          
          if (gestureState.dy < (drawerHeight/3)*-1) {
            //this.state.pan.setValue({ x: 0, y: 0 });
            this.state.pan.setOffset({x: 0, y: 0 })
            this.close()
          
        } else {
          if (gestureState.dy < 0)
          Animated.timing(pan, { toValue: { x: 0, y: 0 },  duration: 200  }).start();

        }
        } else {
          if (gestureState.dy > drawerHeight) {
            Animated.timing(pan, { toValue: { x: 0, y: drawerHeight },  duration: 200  }).start();
           // this.state.pan.setValue({ x: (WIDTH /5) * 4, y: 0 });
           setTimeout(() => {this.state.pan.setOffset({x: 0, y: drawerHeight })}, 210);

            this.setState({isExpanded: true })
        } else if (gestureState.dy < drawerHeight) {
          Animated.timing(pan, { toValue: { x: 0, y: 0 },  duration: 200  }).start();

        }
        }

    }});
  }


  open = () => {
    const { pan } = this.state;
      this.setState({isExpanded: true })
      Animated.timing(pan, { toValue: { x: 0, y: 900 },  duration: 200  }).start();
      //setTimeout(() => {this.state.pan.setOffset({x: (WIDTH /5) * 4, y: 0 })}, 210);

    
  }

  close() {
    const { pan } = this.state;
    this.state.pan.setOffset({x: 0, y: 0 })

    Animated.spring(this.state.pan, { toValue: { x: 0, y: 0 } }).start();
    this.setState({isExpanded: false })

  }

  componentDidMount() {

  }

  render() {
    const { animationType, closeOnPressMask, children, customStyles } = this.props;
    const { animatedHeight, pan, modalVisible } = this.state;
    const panStyle = {
      transform: pan.getTranslateTransform(),
    };
    const wrapper = {
      flex: 1,
      backgroundColor: "#00000077",
      elevation: 12,
      zIndex: 9999999
    }
  const mask = {
      flex: 1,
      backgroundColor: "transparent",
    }

  const controlBar = {
    width: "100%",
    height: 60,
    justifyContent: "center",
  }
  const controlBarIcon = {
    alignSelf: "center",
    paddingTop: 20,
  }
  const container = {
      width: WIDTH,
      height: 0,
      bottom: - (HEIGHT / 4 * 3),
      overflow: "hidden",
      zIndex: 999999, elevation: 16, 

    }
    return (
      <Portal>
        {!this.state.isExpanded
        ? <TouchableWithoutFeedback onPress={() => {this.close()}}><View style={{height: "200%", width: "100%", position: "absolute", left: 0, top: 0, backgroundColor: "rgba(20, 20, 20, 0.3)", zIndex: 99999, elevation: 8}}/></TouchableWithoutFeedback>
        : null
        }
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[panStyle,container]}
          >
          <View style={[ customStyles.container, { height: HEIGHT - 70, zIndex: 999999, elevation: 16, } ]}>
          {children}

            </View>

          </Animated.View>
          </Portal>


      
    );
  }
}

MyBottom.propTypes = {
  animationType: PropTypes.oneOf(["none", "slide", "fade"]),
  height: PropTypes.number,
  minClosingHeight: PropTypes.number,
  duration: PropTypes.number,
  closeOnSwipeDown: PropTypes.bool,
  closeOnPressMask: PropTypes.bool,
  customStyles: PropTypes.objectOf(PropTypes.object),
  onClose: PropTypes.func,
  children: PropTypes.node
};

MyBottom.defaultProps = {
  animationType: "none",
  height: (HEIGHT / 5) * 4,
  heightExpanded: HEIGHT,
  minClosingHeight: 0,
  duration: 200,
  closeOnSwipeDown: false,
  closeOnPressMask: true,
  customStyles: {},
  onClose: null,
  children: <View />
};

export default MyBottom;
