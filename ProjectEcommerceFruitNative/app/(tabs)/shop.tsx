import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window'); 

export default function ShopScreen() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current; 

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(slideAnim, {
        toValue: -width, 
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false));
    } else {
      Animated.timing(slideAnim, {
        toValue: 0, 
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(true));
    }
  };

  const Card = ({ icon, number, label }:any) => (
    <View style={styles.card}>
      <Ionicons name={icon} size={40} color="#333" />
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.burgerIcon} onPress={toggleDrawer}>
        <Ionicons name="menu-outline" size={30} color="#333" />
      </TouchableOpacity>

      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.drawerTitle}>เมนูเพิ่มเติม</Text>
        <MenuItem icon="cart-outline" title="แก้ไขร้านค้า" />
        <MenuItem icon="people-outline" title="เพิ่มข้อมูลสินค้า (GI)" />
        <MenuItem icon="bar-chart-outline" title="เพิ่มสินค้า" />
        <MenuItem icon="bar-chart-outline" title="คำสั่งซื้อ" />
        <MenuItem icon="receipt-outline" title="ตั้งค่า" />
        <TouchableOpacity style={styles.closeButton} onPress={toggleDrawer}>
          <Text style={styles.closeButtonText}>ปิด</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.cardContainer}>
        <Card icon="chatbubble-outline" number="2,203" label="รายได้รวมการจำหน่ายสินค้า" />
        <Card icon="sync-outline" number="5" label="จำนวนสินค้าที่ซื้อ" />
        <Card icon="chatbubbles-outline" number="3" label="ยอดคำสั่งซื้อที่สำเร็จ" />
        <Card icon="close-circle-outline" number="0" label="ยอดคำสั่งซื้อที่ยกเลิก" />
      </View>
    </View>
  );
}

const MenuItem = ({ icon, title }:any) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={30} color="#333" />
    <Text style={styles.menuText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F7F9FC',
    paddingTop:60
  },
  burgerIcon: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 15,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75, 
    backgroundColor: '#fff',
    padding: 20,
    elevation: 5,
    zIndex: 2,
    paddingTop:60

  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    width: 150,
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  number: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 5,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', 
    marginTop: 20,
  },
});
