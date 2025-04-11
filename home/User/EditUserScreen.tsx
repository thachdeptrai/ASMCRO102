import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import axios from "axios";
import API from "@/login/api";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

const EditUserScreen = ({ route }: any) => {
  const { user } = route.params;
  const navigation = useNavigation();

  const [username, setUsername] = useState(user.username);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [address, setAddress] = useState(user.address || "");
  const [avatar, setAvatar] = useState(user.avatar || "");
  const [isImageError, setIsImageError] = useState(false);

  const handleSave = async () => {
    try {
      await axios.put(`${API.UPDATEUSER}/${user._id}`, {
        username,
        email,
        phone,
        address,
        avatar,
      });
      // Reset stack: chỉ giữ lại màn hình UserScreen
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "UserScreen",
              params: { refresh: true },
            },
          ],
        })
      );
    } catch (error) {
      console.log("Lỗi cập nhật thông tin:", error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Tên người dùng:</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput value={email} onChangeText={setEmail} style={styles.input} />

      <Text style={styles.label}>Số điện thoại:</Text>
      <TextInput value={phone} onChangeText={setPhone} style={styles.input} />

      <Text style={styles.label}>Địa chỉ:</Text>
      <TextInput
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />

      <Text style={styles.label}>Link Avatar:</Text>
      <TextInput
        value={avatar}
        onChangeText={(text) => {
          setAvatar(text);
          setIsImageError(false); // reset lỗi nếu user nhập link mới
        }}
        style={styles.input}
      />

      <Image
        source={{
          uri:
            isImageError || avatar === ""
              ? "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              : avatar,
        }}
        onError={() => setIsImageError(true)}
        onLoad={() => setIsImageError(false)}
        style={styles.avatarPreview}
      />

      <TouchableOpacity onPress={handleSave} style={styles.button}>
        <Text style={styles.buttonText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditUserScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontWeight: "bold", marginTop: 20 },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    marginBottom: 10,
  },
  avatarPreview: {
    width: 100,
    height: 100,
    marginTop: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 12,
    marginTop: 30,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});
