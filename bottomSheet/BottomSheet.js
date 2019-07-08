import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dimensions, View, Text, Modal, TouchableOpacity, Animated, PanResponder } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Button } from 'native-base';

const HEIGHT = Dimensions.get('window').height;
const WIDTH = Dimensions.get('window').width;

const SUPPORTED_ORIENTATIONS = [
  "portrait",
  "portrait-upside-down",
  "landscape",
  "landscape-left",
  "landscape-right"
];


export class BottomSheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      pan: new Animated.ValueXY()
    };

    this.createPanResponder(props);
  }

  setModalVisible(visible) {
    const { height, minClosingHeight, duration, onClose } = this.props;
    const { animatedHeight, pan } = this.state;
    if (visible) {
      this.setState({ modalVisible: visible });
      Animated.timing(animatedHeight, {
        toValue: height,
        duration
      }).start();
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
    },onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          Animated.event([null, { dy: pan.y }])(e, gestureState);

        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (height / 4 - gestureState.dy < 0) {
          this.setModalVisible(false);
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
        }
      }
    });
  }

  open() {
    this.setModalVisible(true);
  }

  close() {
    this.setModalVisible(false);
  }

  render() {

    const { animationType, closeOnPressMask, children, customStyles } = this.props;
    const { animatedHeight, pan, modalVisible } = this.state;
    const panStyle = {
      transform: pan.getTranslateTransform()
    };

    const wrapper = {
    flex: 1,
    backgroundColor: "#00000077"
  }
    const mask = {
    flex: 1,
    backgroundColor: "transparent"
  }
    const container = {
    backgroundColor: "#fff",
    width: "100%",
    height: 0,
    overflow: "hidden"
  }

    return (
      <Modal
        transparent
        animationType={animationType}
        visible={modalVisible}
        supportedOrientations={SUPPORTED_ORIENTATIONS}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <View style={[wrapper, wrapper]}>
          <TouchableOpacity
            style={mask}
            activeOpacity={1}
            onPress={() => (closeOnPressMask ? this.close() : {})}
          />
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[panStyle, container, customStyles.container, { height: animatedHeight }]}
          >
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

BottomSheet.propTypes = {
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

BottomSheet.defaultProps = {
  animationType: "none",
  height: 260,
  minClosingHeight: 0,
  duration: 300,
  closeOnSwipeDown: false,
  closeOnPressMask: true,
  customStyles: {},
  onClose: null,
  children: <View />
};


export class BottomSheetExpanded extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalExpanded: false,
      animatedHeight: new Animated.Value(0),
      pan: new Animated.ValueXY(),
      isExpanded: false,
      scroll: true,

    };

    this.createPanResponder(props);
  }

  setModalVisible(visible) {
    const { height, heightExpanded, minClosingHeight, duration, onClose } = this.props;
    const { animatedHeight, pan } = this.state;
    if (visible) {
      this.setState({ modalVisible: visible });
      Animated.timing(animatedHeight, {
        toValue: height + (HEIGHT / 4 * 3),
        duration
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: - (HEIGHT / 4 * 3),
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

  setModalExpanded(expanded) {
    const { height, heightExpanded, minClosingHeight, duration, onClose } = this.props;
    const { animatedHeight, pan } = this.state;
    if (expanded) {
      this.setState({ isExpanded: expanded });
      Animated.timing(new Animated.Value( height + (HEIGHT / 4 * 3)), {
        toValue: height + (HEIGHT / 4 * 3) + 300,
        duration
      }).start(status => {
        this.state.pan.y.setOffset(-100);
      });
    }
  }
  createPanResponder(props) {
    const { closeOnSwipeDown, height, duration } = props;
    const { pan } = this.state;
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onShouldBlockNativeResponder: () => false,
      onPanResponderGrant: (evt, gestureState) => {
        this.state.pan.setOffset(this.state.pan.__getValue());
        this.state.pan.setValue({ x: 0, y: 0 });
        this.setState({scroll: false})
      },
      onPanResponderMove: (e, gestureState) => {
        if (this.state.isExpanded) {
          if (gestureState.dy > 0) {
            Animated.event([null, { dy: pan.y }])(e, gestureState);
          } 
        } else {
          if (gestureState.dy > 0) {
            Animated.event([null, { dy: pan.y }])(e, gestureState);
          } else if (gestureState.dy < 0) {
            Animated.event([null, { dy:  pan.y }])(e, gestureState);
  
          }
        }

      },
      onPanResponderRelease: (e, gestureState) => {
        this.setState({scroll: true})
        if ( gestureState.dy > 0) {
          this.setModalVisible(false);
        }  else if (gestureState.dy < 0) {
          if (this.state.isExpanded == false) {
            Animated.spring(pan, { toValue: { x: 0, y: -400 } }).start();
            this.setState({ isExpanded: true})
            this.setModalExpanded(true)
          }
  
        } 
      }
    });
  }

  open() {
    this.setModalVisible(true);
  }

  close() {
    this.setModalVisible(false);
  }

  render() {
    const { animationType, closeOnPressMask, children, customStyles } = this.props;
    const { animatedHeight, pan, modalVisible } = this.state;
    const panStyle = {
      transform: pan.getTranslateTransform()
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
      height: 40,
    }
    const controlBarIcon = {
      alignSelf: "center",
    }
    const container = {
        backgroundColor: "#fff",
        width: "100%",
        height: 0,
        bottom: - (HEIGHT / 4 * 3),
        overflow: "hidden"
      }

    return (
      <Modal
        transparent
        animationType={animationType}
        visible={modalVisible}
        supportedOrientations={SUPPORTED_ORIENTATIONS}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
      <TouchableOpacity
      style={mask}
      activeOpacity={1}
      onPress={() => this.close()}
    >
        <View style={[wrapper, wrapper]}>
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[panStyle, container, customStyles.container, { height: animatedHeight }]}
          >
          <View style={controlBar} >
          <View style={controlBarIcon}>
          <Ionicons name="md-remove" size={40} color="gray" />
          </View>
          </View>
            {children}
          </Animated.View>
        </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

BottomSheetExpanded.propTypes = {
  animationType: PropTypes.oneOf(["none", "slide", "fade"]),
  height: PropTypes.number,
  heightExpanded: PropTypes.number,
  minClosingHeight: PropTypes.number,
  duration: PropTypes.number,
  closeOnSwipeDown: PropTypes.bool,
  closeOnPressMask: PropTypes.bool,
  customStyles: PropTypes.objectOf(PropTypes.object),
  onClose: PropTypes.func,
  children: PropTypes.node
};

BottomSheetExpanded.defaultProps = {
  animationType: "none",
  height: (HEIGHT / 5) * 4,
  heightExpanded: 350,
  minClosingHeight: 0,
  duration: 300,
  closeOnSwipeDown: false,
  closeOnPressMask: true,
  customStyles: {},
  onClose: null,
  children: <View />
};


export class Sheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      animatedHeight: new Animated.Value(0),
      pan: new Animated.ValueXY()
    };

    this.createPanResponder(props);
  }

  setModalVisible(visible) {
    const { height, minClosingHeight, duration, onClose } = this.props;
    const { animatedHeight, pan } = this.state;
    if (visible) {
      this.setState({ modalVisible: visible });
      Animated.timing(animatedHeight, {
        toValue: height + (HEIGHT / 4 * 3),
        duration
      }).start();
    } else {
      Animated.timing(animatedHeight, {
        toValue: minClosingHeight,
        duration
      }).start(() => {
        pan.setValue({ x: 0, y: 300 });
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
      onStartShouldSetPanResponder: () => closeOnSwipeDown,
      onPanResponderMove: (e, gestureState) => {
          Animated.event([null, { dy: pan.y }])(e, gestureState);
      },
      onPanResponderRelease: (e, gestureState) => {
        if (height / 4 - gestureState.dy < 0) {
          this.setModalVisible(false);
        } else {
          Animated.spring(pan, { toValue: { x: 0, y: 0 } }).start();
        }
      }
    });
  }

  open() {
    this.setModalVisible(true);
  }

  close() {
    this.setModalVisible(false);
  }

  render() {

    const { animationType, closeOnPressMask, children, customStyles } = this.props;
    const { animatedHeight, pan, modalVisible } = this.state;
    const panStyle = {
      transform: pan.getTranslateTransform()
    };

    const wrapper = {
    flex: 1,
    backgroundColor: "#00000077"
  }
    const mask = {
    flex: 1,
    backgroundColor: "transparent"
  }
    const container = {
    backgroundColor: "#fff",
    width: "100%",
    height: 0,
    bottom: - (HEIGHT / 4 * 3),

    overflow: "hidden"
  }

    return (
      <Modal
        transparent
        animationType={animationType}
        visible={modalVisible}
        supportedOrientations={SUPPORTED_ORIENTATIONS}
        onRequestClose={() => {
          this.setModalVisible(false);
        }}
      >
        <View style={[wrapper, wrapper]}>
          <TouchableOpacity
            style={mask}
            activeOpacity={1}
            onPress={() => (closeOnPressMask ? this.close() : {})}
          />
          <Animated.View
            {...this.panResponder.panHandlers}
            style={[panStyle, container, customStyles.container, { height: animatedHeight }]}
          >
            {children}
          </Animated.View>
        </View>
      </Modal>
    );
  }
}

Sheet.propTypes = {
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

Sheet.defaultProps = {
  animationType: "none",
  height: (HEIGHT / 5) * 4,
  heightExpanded: 350,
  minClosingHeight: 0,
  duration: 300,
  closeOnSwipeDown: false,
  closeOnPressMask: true,
  customStyles: {},
  onClose: null,
  children: <View />
};

