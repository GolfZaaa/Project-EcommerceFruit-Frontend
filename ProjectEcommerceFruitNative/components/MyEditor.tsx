import React, { SetStateAction } from "react";
import {
  Text,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import * as ImagePicker from "expo-image-picker";
import ImgToBase64 from "react-native-image-base64";
import { observer } from "mobx-react-lite";

const handleHead = ({ tintColor }: { tintColor: string }) => (
  <Text style={{ color: tintColor }}>H1</Text>
);

const MyEditor = ({ value, setValue }: { value: string; setValue: any }) => {
  const richText = React.useRef<RichEditor>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
      base64: true, // Enable base64 encoding
    });

    if (!result.canceled) {
      // Use the base64 data directly
      const base64String = result.assets[0].base64;
      if (base64String) {
        let str = `data:${result.assets[0].mimeType};base64,${base64String}`;
        richText.current?.insertImage(str);
      } else {
        console.log("Base64 string is not available");
      }
    }
  };

  // const convertBase64 = (image: any) => {
  //   // ImgToBase64.getBase64String(image.path)
  //   //   .then((base64String: any) => {
  //   //     let str = `data:${image.mime};base64,${base64String}`;
  //   //     richText.current?.insertImage(str);
  //   //   })
  //   //   .catch((err: any) => console.log("error : ", err));
  //   let str = `data:image/jpeg;base64,${image}`;
  //   richText.current?.insertImage(str);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.toolbarContainer}>
        <RichToolbar
          editor={richText}
          actions={[
            actions.insertImage,
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.keyboard,
            actions.setStrikethrough,
            actions.setUnderline,
            actions.removeFormat,
            actions.insertVideo,
            actions.checkboxList,
            actions.undo,
            actions.redo,
          ]}
          onPressAddImage={() => {
            pickImage();
          }}
          iconMap={{ [actions.heading1]: handleHead }}
          style={styles.toolbar}
          iconTint="#888" // Default color for icons
          selectedIconTint="#000" // Color when an action is active
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollView}>
        <RichEditor
          initialContentHTML={value}
          ref={richText}
          onChange={setValue}
          style={styles.richEditor}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  richEditor: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  toolbarContainer: {
    borderTopColor: "#ddd",
    borderTopWidth: 1,
  },
  toolbar: {
    backgroundColor: "#f5f5f5",
  },
});

export default observer(MyEditor);
