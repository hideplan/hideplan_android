import React, { Component } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Dimensions, View, Modal, TouchableOpacity, Animated, PanResponder } from "react-native";
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;


const SUPPORTED_ORIENTATIONS = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right"
];

class Drawer extends Component {
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
        return Math.abs(gestureState.dx) > 5;
    },    
      onPanResponderMove: (e, gestureState) => {
     
      if (this.state.isExpanded) {
        if (gestureState.dx < 0) {
          Animated.event([null, { dx: pan.x  }])(e, gestureState);
        }
      } else {
        if (gestureState.dx < WIDTH /5 * 4) {
          Animated.event([null, { dx: pan.x  }])(e, gestureState);

        }
      }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (this.state.isExpanded) {
          
          if (gestureState.dx < ((WIDTH /3))*-1) {
            //this.state.pan.setValue({ x: 0, y: 0 });
            this.state.pan.setOffset({x: 0, y: 0 })
            this.close()
          
        } else {
          if (gestureState.dx < 0)
          Animated.timing(pan, { toValue: { x: 0, y: 0 },  duration: 200  }).start();

        }
        } else {
          if (gestureState.dx > (WIDTH /5) * 2) {
            Animated.timing(pan, { toValue: { x: (WIDTH /5) * 4, y: 0 },  duration: 200  }).start();
           // this.state.pan.setValue({ x: (WIDTH /5) * 4, y: 0 });
           setTimeout(() => {this.state.pan.setOffset({x: (WIDTH /5) * 4, y: 0 })}, 210);

            this.setState({isExpanded: true })
        } else if (gestureState.dx < WIDTH /5 * 2) {
          Animated.timing(pan, { toValue: { x: 0, y: 0 },  duration: 200  }).start();

        }
        }

    }});
  }


  open = () => {
    const { pan } = this.state;
    this.setState({isExpanded: true })

    Animated.timing(pan, { toValue: { x: (WIDTH /5) * 4, y: 0 },  duration: 200  }).start();
    setTimeout(() => {this.state.pan.setOffset({x: (WIDTH /5) * 4, y: 0 })}, 210);

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
      backgroundColor: "#00000077"
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
      width: 350,
      left: -340,
      height: "100%",
      overflow: "hidden",

    }
    return (
      <View style={{position: "absolute"}}>
        {this.state.isExpanded
        ? <TouchableWithoutFeedback onPress={() => {this.close()}}><View style={{height: "100%", width: "200%", position: "absolute", left: 0, top: 0, backgroundColor: "rgba(20, 20, 20, 0.3)"}}/></TouchableWithoutFeedback>
        : null
        }
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[panStyle,container]}
          >
          <View style={{flexDirection: "row"}}>
          <View style={{width: "90%",height: "100%", }}>
          <View style={[ customStyles.container, { height: HEIGHT - 70 }]}>
          {children}
            </View>
            </View>
            <View style={{width: "10%", backgroundColor: "transparent", height: "100%"}}
            >
            </View>
            </View>

          </Animated.View>
          </View>


      
    );
  }
}

Drawer.propTypes = {
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

Drawer.defaultProps = {
  animationType: "none",
  height: HEIGHT,
  left: -300,
  minClosingHeight: 0,
  duration: 200,
  closeOnSwipeDown: false,
  closeOnPressMask: true,
  customStyles: {},
  onClose: null,
  children: <View />
};

export default Drawer;
