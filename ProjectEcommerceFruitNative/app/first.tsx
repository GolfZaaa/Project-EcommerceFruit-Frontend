import { Text, StyleSheet, View, Image } from 'react-native'
import React, { Component } from 'react'

export default class first extends Component {
  render() {
    return (
      <View>
        <Image source={require("../assets/images/firstPage.jpg")}
        style={{width: '100%', height: 450}}
        />
        <View style={styles.container}>
            <Text style={{fontSize:28, fontWeight:600,textAlign:'center',marginTop:10}} >E-Commerce Fruit</Text>
            <Text style={{fontSize:17,textAlign:'center',color:'#f2f2f2'}}>Tasdzxcj zkasenjwq ,zxcjaweba ksda sidjasda</Text>
        </View>
        <View style={styles.button}>
            <Text style={{color:'#fff',textAlign:'center',fontSize:17,marginTop:20}}>Sign In With Google</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    container:{
        backgroundColor:'#fff',
        marginTop:-20,
        height:'100%',
        borderTopRightRadius:20,
        padding:25
    },
    button:{
        padding:15,
        backgroundColor:'#ffffff',
        borderRadius:99,
        marginTop:'25%'
    }
})