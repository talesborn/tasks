import React, {Component} from "react";
import {Alert, FlatList, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Task from "../components/Task";

import commonStyles from "../commonStyles";
import todayImage from '../../assets/imgs/today.jpg';

import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from 'react-native-vector-icons/FontAwesome';

import moment from "moment";
import 'moment/locale/pt-br';
import AddTask from "./AddTask";

const initialState = {
    showDoneTasks: true,
    visibleTasks: [],
    showAddTask: false,
    tasks:[]
};

class TaskList extends Component {

    state = {
        ...initialState
    }

    componentDidMount = async () => {
        const stateString = await AsyncStorage.getItem('taskState');
        const state = JSON.parse(stateString) || initialState;
        this.setState(state, this.filterTasks);
    }

    toogleFilter = () => {
        this.setState({showDoneTasks: !this.state.showDoneTasks}, this.filterTasks);
    }

    filterTasks = () => {
        let visibleTasks = null;
        if(this.state.showDoneTasks){
            visibleTasks = [...this.state.tasks];
        }else{
            const pending = task => task.doneAt === null;
            visibleTasks = this.state.tasks.filter(pending);
        }

        this.setState({visibleTasks});
        AsyncStorage.setItem('taskState', JSON.stringify(this.state));
    }

    toogleTask = taskId => {
        const tasks = [...this.state.tasks];
        tasks.forEach(task=>{
            if(task.id === taskId){
                task.doneAt = task.doneAt ? null : new Date();
            }
        })

        this.setState({tasks}, this.filterTasks);
    }

    addTask = newTask => {
        if(!newTask.desc || !newTask.desc.trim()){
            return Alert.alert('Dados Inválidos', 'Descrição não informada');
        }

        const tasks = [...this.state.tasks];
        tasks.push({
            id: Math.random(),
            desc: newTask.desc,
            estimateAt: newTask.date,
            doneAt: null,
        });

        this.setState({tasks, showAddTask: false}, this.filterTasks);
    }

    deleteTask = id => {
        const tasks = this.state.tasks.filter(task => task.id !== id);
        this.setState({tasks}, this.filterTasks);
    }

    render() {
        const today = moment().locale('pt-br').format('ddd, D [de] MMMM')

        return (
            <View style={styles.container}>
                <AddTask isVisible={this.state.showAddTask}
                         onCancel={()=>this.setState({showAddTask:false})}
                         onSave={this.addTask} />
                <ImageBackground style={styles.background} source={todayImage}>
                    <View style={styles.iconBar}>
                        <TouchableOpacity onPress={this.toogleFilter}>
                            <Icon name={this.state.showDoneTasks ? 'eye':'eye-slash'} size={20} color={commonStyles.colors.secundary}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.titleBar}>
                        <Text style={styles.title}>Hoje</Text>
                        <Text style={styles.subtitle}>{today}</Text>
                    </View>
                </ImageBackground>
                <View style={styles.taskList}>
                    <FlatList data={this.state.visibleTasks}
                              keyExtractor={item=>`${item.id}`}
                              renderItem={({item}) => <Task {...item} onToogleTask={this.toogleTask} onDelete={this.deleteTask}/>}/>
                </View>
                <TouchableOpacity style={styles.addButton} activeOpacity={0.7} onPress={()=>this.setState({showAddTask: true})}>
                    <Icon name="plus" size={20} color={commonStyles.colors.secundary}/>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    background:{
        flex:3,
    },
    taskList:{
        flex:7,
    },
    titleBar:{
        flex:1,
        justifyContent:'flex-end',
    },
    title:{
        fontFamily: commonStyles.fontFamily,
        fontSize:50,
        color:commonStyles.colors.secundary,
        marginLeft: 20,
        marginBottom: 20,
    },
    subtitle:{
        fontFamily: commonStyles.fontFamily,
        color:commonStyles.colors.secundary,
        fontSize:20,
        marginLeft: 20,
        marginBottom: 30,
    },
    iconBar:{
        flexDirection:'row',
        marginHorizontal: 20,
        justifyContent: 'flex-end',
        marginTop: Platform.OS === 'ios' ? 40 : 10,
    },
    addButton:{
        position:'absolute',
        right:30,
        bottom:30,
        width:50,
        height:50,
        borderRadius:25,
        backgroundColor: commonStyles.colors.today,
        justifyContent:'center',
        alignItems:'center',
    }
})

export default TaskList;
