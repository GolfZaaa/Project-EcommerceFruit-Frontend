import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';

export default function CreateProduct() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={30} color="#007bff" />
      </TouchableOpacity>

      <Text style={styles.title}>สร้างข้อมูลสินค้า</Text>

<RNPickerSelect
  style={{
    inputIOS: {
      ...styles.dropdown,
    },
    inputAndroid: {
      ...styles.dropdown, 
    },
    viewContainer: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      marginBottom: 20,
    },
  }}
  placeholder={{
    label: "ข้อมูลผลไม้ (GI) *",
    value: null,
    color: "#999",
  }}
  onValueChange={(value) => console.log(value)}
  items={[
    { label: 'ประเภท 1', value: 'category1' },
    { label: 'ประเภท 2', value: 'category2' },
    { label: 'ประเภท 3', value: 'category3' },
  ]}
/>

   <TextInput
        style={styles.input}
        placeholder="น้ำหนัก *"
        placeholderTextColor="#999"
      />

         <TextInput
        style={styles.input}
        placeholder="ราคา *"
        placeholderTextColor="#999"
      />

               <TextInput
        style={styles.input}
        placeholder="จำนวน *"
        placeholderTextColor="#999"
      />


      <TextInput
        style={styles.textArea}
        placeholder="รายละเอียดสินค้า"
        placeholderTextColor="#999"
        multiline={true}
      />

      <View style={styles.uploadSection}>
        <Text style={styles.uploadText}>ลากและวางไฟล์ที่นี่หรือคลิก</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>บันทึก</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    paddingTop: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  dropdown: {
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    height: 100,
    marginBottom: 20,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  uploadSection: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

