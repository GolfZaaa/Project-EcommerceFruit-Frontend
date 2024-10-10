import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ใช้สำหรับแอนิเมชันการแสดงผลของ Card
const FadeInView = (props: any) => {
  const [fadeAnim] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnim,
      }}
    >
      {props.children}
    </Animated.View>
  );
};

const Container: any = styled(LinearGradient).attrs({
  colors: ["#E8F0FF", "#F7F9FC"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
  padding-top: 60px;
`;

const UserInfoSection: any = styled.View`
  margin-bottom: 40px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const UserAvatar: any = styled(LinearGradient).attrs({
  colors: ["#007bff", "#00d2ff"],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
  elevation: 5;
`;

const UserNameContainer: any = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserName: any = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
`;

const ButtonCard = styled(TouchableOpacity)`
  padding: 15px;
  border-radius: 20px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  elevation: 5;
  background-color: #ffffff;
`;

const ButtonText = styled.Text`
  color: #333;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
`;

const SaveButton: any = ({ children, onPress }: any) => (
  <TouchableOpacity onPress={onPress}>
    <LinearGradient
      colors={["#007bff", "#00d2ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        padding: 15,
        borderRadius: 30,
        alignItems: "center",
        marginTop: 30,
        elevation: 5,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
      }}
    >
      {children}
    </LinearGradient>
  </TouchableOpacity>
);

const SaveButtonText: any = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

const logout = async () => {
  try {
    await AsyncStorage.removeItem("token");
    router.push("/login");
  } catch (error) {
    console.error("Error removing token", error);
  }
};

const handleOrderhistory = async () => {
  router.push("/orderhistory");
}

const handleAddress = async () => {
  router.push("/editaddress");
}

export default function SettingScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [userName, setUserName] = useState("John Doe");
  const [newUserName, setNewUserName] = useState("");

  const handleSaveUserName = () => {
    if (newUserName) {
      setUserName(newUserName);
      setModalVisible(false);
    }
  };

  return (
    <Container>
      <UserInfoSection>
        <UserAvatar>
          <Ionicons name="person" size={50} color="#fff" />
        </UserAvatar>
        <UserNameContainer>
          <UserName>{userName}</UserName>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Ionicons
              name="create-outline"
              size={24}
              color="#007bff"
              style={{ marginLeft: 10 }}
            />
          </TouchableOpacity>
        </UserNameContainer>
      </UserInfoSection>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              width: 300,
              backgroundColor: "#fff",
              borderRadius: 10,
              padding: 20,
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              เปลี่ยนชื่อผู้ใช้งาน
            </Text>
            <TextInput
              style={{
                width: "100%",
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                marginBottom: 15,
              }}
              placeholder="ใส่ชื่อใหม่"
              value={newUserName}
              onChangeText={setNewUserName}
            />
            <TouchableOpacity
              style={{
                backgroundColor: "#007bff",
                padding: 10,
                borderRadius: 5,
                width: "100%",
                alignItems: "center",
              }}
              onPress={handleSaveUserName}
            >
              <Text style={{ color: "#fff", fontSize: 16 }}>บันทึก</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FadeInView>
        <ButtonCard onPress={handleAddress}>
          <Ionicons name="location-outline" size={28} color="#333" />
          <ButtonText>เปลี่ยนที่อยู่</ButtonText>
        </ButtonCard>
      </FadeInView>

      <FadeInView>
        <ButtonCard onPress={handleOrderhistory}>
          <Ionicons name="receipt-outline" size={28} color="#333" />
          <ButtonText>ประวัติคำสั่งซื้อ</ButtonText>
        </ButtonCard>
      </FadeInView>

      {/* <FadeInView>
        <ButtonCard>
          <Ionicons name="cash-outline" size={28} color="#333" />
          <ButtonText>สร้างรายได้</ButtonText>
        </ButtonCard>
      </FadeInView> */}

      <SaveButton onPress={logout}>
        <SaveButtonText>ออกจากระบบ</SaveButtonText>
      </SaveButton>
    </Container>
  );
}
