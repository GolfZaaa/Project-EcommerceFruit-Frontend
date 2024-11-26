import React from "react";
import {
  View,
  Text,
  FlatList,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const users = [
  { id: 1, name: "Admin1", phone: "0123456789", status: true },
  { id: 2, name: "User Haha", phone: "0987654321", status: true },
  { id: 3, name: "1", phone: "1111111111", status: true },
  { id: 4, name: "2", phone: "2222222222", status: true },
];

const ListUser = () => {
  const renderItem = ({ item }: any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <Text style={styles.cell}>{item.phone}</Text>
      <View style={styles.cell}>
        <Switch value={item.status} />
      </View>
      <View style={styles.cell}>
        <TouchableOpacity>
          <Ionicons name="pencil-outline" size={24} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={24} color="blue" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerCell}>ลำดับ</Text>
        <Text style={styles.headerCell}>ชื่อ - นามสกุล</Text>
        <Text style={styles.headerCell}>เบอร์โทรศัพท์</Text>
        <Text style={styles.headerCell}>สถานะการใช้งาน</Text>
        <Text style={styles.headerCell}>ตั้งค่า</Text>
      </View>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

export default ListUser;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    textAlign: "center",
    justifyContent: "center",
  },
});
