import { Text, StyleSheet, View, Image } from 'react-native'
import React, { Component } from 'react'
import { router } from 'expo-router';

export default class first extends Component {
  render() {

    const handleLogin = async () => {
          router.replace("/login");
    };

    return (
      <View>
        <Image source={require("../assets/images/firstPage.jpg")}
        style={{width: '100%', height: 450}}
        />
        <View style={styles.container}>
            <Text style={{fontSize:24, fontWeight:600,textAlign:'center',marginTop:10}} >จำหน่ายสินค้าเกษตรออนไลน์</Text>
            <Text style={{fontSize:17,textAlign:'center',color:'#a2a2a2',marginTop:10}}>จากสวนสู่บ้านคุณ: ผลไม้สดใหม่ คัดสรรคุณภาพ ส่งตรงถึงประตูบ้าน เพื่อประสบการณ์การรับประทานผลไม้ที่เหนือระดับ</Text>
            <View style={styles.button}>
            <Text onPress={handleLogin} style={{color:'#ffffff',textAlign:'center',fontSize:17}}>เยี่ยมชมแอปพลิเคชัน</Text>
        </View>
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
        borderTopLeftRadius:25,
        padding:25
    },
    button:{
        padding:15,
        backgroundColor:'#34d83c',
        borderRadius:99,
        marginTop:'25%',
    }
})