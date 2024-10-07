import React, { useState } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

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

const Container:any = styled(LinearGradient).attrs({
  colors: ['#E8F0FF', '#F7F9FC'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  padding: 20px;
  padding-top: 30px;
`;

const UserInfoSection:any = styled.View`
  margin-bottom: 40px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const UserAvatar:any = styled(LinearGradient).attrs({
  colors: ['#007bff', '#00d2ff'],
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

const UserNameContainer:any = styled.View`
  flex-direction: row;
  align-items: center;
`;

const UserName:any = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #333;
`;

const ButtonCard:any = styled(LinearGradient).attrs({
  colors: ['#ffffff', '#f1f1f1'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding: 15px;
  border-radius: 20px;
  margin-bottom: 15px;
  flex-direction: row;
  align-items: center;
  shadow-color: #000;
  shadow-opacity: 0.15;
  shadow-radius: 10px;
  elevation: 5;
`;

const ButtonText:any = styled.Text`
  color: #333;
  font-size: 18px;
  font-weight: bold;
  margin-left: 10px;
`;

const SaveButton:any = styled(LinearGradient).attrs({
  colors: ['#007bff', '#00d2ff'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  padding: 15px;
  border-radius: 30px;
  align-items: center;
  margin-top: 30px;
  elevation: 5;
  shadow-color: #000;
  shadow-opacity: 0.2;
  shadow-radius: 10px;
`;

const SaveButtonText:any = styled.Text`
  color: #fff;
  font-size: 20px;
  font-weight: bold;
`;

export default function SettingScreen() {
  return (
    <Container>



      <UserInfoSection>
      <UserAvatar>
          <Ionicons name="person" size={50} color="#fff" />
        </UserAvatar>
        <UserNameContainer>
          <UserName>John Doe</UserName>
          {/* เพิ่มไอคอนเปลี่ยนชื่อหลังชื่อผู้ใช้ */}
          <Ionicons name="create-outline" size={24} color="#007bff" style={{ marginLeft: 10 }} />
        </UserNameContainer>
      </UserInfoSection>

      <FadeInView>
        <ButtonCard>
          <Ionicons name="location-outline" size={28} color="#333" />
          <ButtonText>เปลี่ยนที่อยู่</ButtonText>
        </ButtonCard>
      </FadeInView>

      <FadeInView>
        <ButtonCard>
          <Ionicons name="receipt-outline" size={28} color="#333" />
          <ButtonText>ประวัติคำสั่งซื้อ</ButtonText>
        </ButtonCard>
      </FadeInView>

      <FadeInView>
        <ButtonCard>
          <Ionicons name="cash-outline" size={28} color="#333" />
          <ButtonText>สร้างรายได้</ButtonText>
        </ButtonCard>
      </FadeInView>

      <SaveButton onPress={() => alert('ลบบัญชีผู้ใช้')}>
        <SaveButtonText>ลบบัญชีผู้ใช้</SaveButtonText>
      </SaveButton>
    </Container>
  );
}
