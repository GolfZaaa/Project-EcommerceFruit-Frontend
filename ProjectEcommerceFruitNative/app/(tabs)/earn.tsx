import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { LinearGradient } from 'expo-linear-gradient';

const Container = styled(LinearGradient).attrs({
  colors: ['#e0f7fa', '#ffffff'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  flex: 1;
  justify-content: flex-start;
  padding: 20px;
  background-color: #f8f9fa;
`;

const Title = styled.Text`
  font-size: 24px;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: 20px;
`;

const Card = styled(LinearGradient).attrs({
  colors: ['#ffffff', '#f7f9fc'],
  start: { x: 0, y: 0 },
  end: { x: 1, y: 1 },
})`
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 15px;
  shadow-color: #000;
  shadow-opacity: 0.1;
  shadow-radius: 10px;
  elevation: 2;
`;

const CardText = styled.Text`
  font-size: 18px;
  color: #333;
  font-weight: bold;
  margin-bottom: 10px;
`;

const CardDescription = styled.Text`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const Button = styled.TouchableOpacity`
  background-color: #007bff;
  padding: 10px;
  border-radius: 8px;
  align-items: center;
`;

const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;

export default function TabTwoScreen() {
  const data = [
    { id: '1', title: 'Card 1', description: 'This is the description for card 1.' },
    { id: '2', title: 'Card 2', description: 'This is the description for card 2.' },
    { id: '3', title: 'Card 3', description: 'This is the description for card 3.' },
    { id: '4', title: 'Card 4', description: 'This is the description for card 4.' },
  ];

  const renderItem = ({ item }: any) => (
    <Card>
      <CardText>{item.title}</CardText>
      <CardDescription>{item.description}</CardDescription>
      <Button onPress={() => alert(`${item.title} Button Pressed`)}>
        <ButtonText>Press me</ButtonText>
      </Button>
    </Card>
  );

  return (
    <Container>
      {/* ข้อความที่อยู่ตรงกลาง */}
      <Title>คำสั่งซื้อที่สามารถรับหิ้วได้</Title>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </Container>
  );
}
