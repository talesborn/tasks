import React from 'react';
import {StackActions} from '@react-navigation/native';
import {DrawerContentScrollView,DrawerItemList} from "@react-navigation/drawer";
import {Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Gravatar} from "react-native-gravatar";
import commonStyles from "../commonStyles";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default props => {

    const optionsAvatar = {
        email: props.params.email,
        secure: true
    }

    const logout = () => {
        delete axios.defaults.headers.common['Authorization'];
        AsyncStorage.removeItem('userData');
        props.navigation.dispatch(
            StackActions.replace('AuthOrApp')
        );
    }

    return (
        <DrawerContentScrollView {...props}>
            <View styles={styles.header}>
                <Text style={styles.title}>Tasks</Text>
                <Gravatar style={styles.avatar} options={optionsAvatar}/>
                <View style={styles.userInfo}>
                    <Text style={styles.name}>{props.params.name}</Text>
                    <Text style={styles.email}>{props.params.email}</Text>
                </View>
                <TouchableOpacity onPress={logout}>
                    <View style={styles.logoutIcon}>
                        <Icon name='sign-out' size={30} color='#800'/>
                    </View>
                </TouchableOpacity>
            </View>
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    header:{
        borderBottomWidth: 1,
        borderColor: '#DDD'
    },
    title:{
        color: '#000',
        fontFamily: commonStyles.fontFamily,
        fontSize:30,
        paddingTop:30,
        padding:10,
        marginTop: Platform.OS === 'ios' ? 50 : 10,
    },
    avatar:{
        width:60,
        height: 60,
        borderWidth: 3,
        borderRadius: 30,
        margin: 10,
        backgroundColor:'#222',
    },
    userInfo:{
        marginLeft:10,
    },
    name:{
        fontFamily: commonStyles.fontFamily,
        fontSize: 20,
        color: commonStyles.colors.mainText,
        marginBottom: 5
    },
    email:{
        fontFamily: commonStyles.fontFamily,
        fontSize: 15,
        color: commonStyles.colors.subText,
        marginBottom:10
    },
    logoutIcon:{
        marginLeft: 10,
        marginBottom: 10,

    }
})
