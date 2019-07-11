
import React, { Component } from 'react';
import { View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Container, Header, Left, Body, Right, Icon, Title, Radio, Fab} from 'native-base';

class BottomNavigator extends Component {
    render() {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: '#f8f4f4'

            }}>
                <View style={{ position: 'absolute', alignSelf: 'center', backgroundColor: '#f8f4f4', width: 70, height: 70, borderRadius: 35, bottom: 25, zIndex: 10 }}>
                    <Icon
                        name='add'
                        type='material'
                        color='#f00'
                        containerStyle={{ alignSelf: 'center' }}
                        reverse
                        size={28}
                        onPress={() => {}}
                    />
                </View>
                <View style={{ position: 'absolute', backgroundColor: '#2196F3', bottom: 0, zIndex: 1, width: '100%', height: 60, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 15, paddingVertical: 10 }}>
                    <Icon
                        name='menu'
                        type='material'
                        color='#fff'
                        onPress={() => {}}

                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon
                            name='favorite'
                            type='material'
                            color='#fff'
                            onPress={() => {}}
                            containerStyle={{ marginHorizontal: 16 }}
                        />
                        <Icon
                            name='search'
                            type='material'
                            color='#fff'
                        />
                    </View>
                </View>
            </View>
        );
    }
}

export default BottomNavigator;
