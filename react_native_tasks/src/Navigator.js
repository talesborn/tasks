import React from "react";
import Auth from "./screens/Auth";
import TaskList from "./screens/TaskList";
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {createDrawerNavigator} from "@react-navigation/drawer";
import Menu from "./screens/Menu";
import commonStyles from "./commonStyles";
import AuthOrApp from "./screens/AuthOrApp";

const Drawer = createDrawerNavigator();

const drawerOptions = {
    headerShown: false,
    drawerLabelStyle:{
        fontFamily:commonStyles.fontFamily,
        fontWeight: 'normal',
        fontSize:20,
    },
    drawerActiveTintColor:'#080',
    drawerActiveBackgroundColor:'#e9e9e9'

}

const DrawerNavigator = ({route}) => {
    return (
        <Drawer.Navigator initialRouteName='Today' screenOptions={drawerOptions} drawerContent={(props) =><Menu {...props} {...route}/>}>
            <Drawer.Screen name="Today" options={{title:'Hoje'}}>
                {props => <TaskList title='Hoje' daysAhead={0} {...props}/>}
            </Drawer.Screen>
            <Drawer.Screen name="Tomorrow" options={{title:'Amanhã'}}>
                {props=> <TaskList title='Amanhã' daysAhead={1} {...props}/>}
            </Drawer.Screen>
            <Drawer.Screen name="Week" options={{title:'Semana'}}>
                {props=> <TaskList title='Semana' daysAhead={7} {...props}/>}
            </Drawer.Screen>
            <Drawer.Screen name="Month" options={{title:'Mês'}}>
                {props=> <TaskList title='Mês' daysAhead={30} {...props}/>}
            </Drawer.Screen>
        </Drawer.Navigator>
    );
}

const stackOptions = {
    headerShown: false
}

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="AuthOrApp" screenOptions={stackOptions}>
            <Stack.Screen name="AuthOrApp" component={AuthOrApp} />
            <Stack.Screen name="Auth" component={Auth} />
            <Stack.Screen name="Home" component={DrawerNavigator} />
        </Stack.Navigator>
    );
}

const navigatorContainer = () => {
    return(
        <NavigationContainer>
            <StackNavigator/>
        </NavigationContainer>
    )
}

export default navigatorContainer;
