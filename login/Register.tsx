import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import API from "./api";

const Register = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!username || !email || !phone || !password) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const response = await fetch(API.REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Đăng ký thất bại");
        return;
      }

      alert("Đăng ký thành công");
      navigation.navigate("Login");
    } catch (error) {
      alert("Đăng ký thất bại: " + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        source={require("../assets/images/imgRegister.png")}
        style={styles.img}
      />
      <View style={styles.container_input}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Chào mừng bạn</Text>
        <Text style={{ fontSize: 18, marginBottom: 15 }}>
          Đăng ký tài khoản
        </Text>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tên"
          placeholderTextColor="#888"
          onChangeText={(text) => setUserName(text)}
          value={username}
        />
        <TextInput
          style={styles.textInput}
          placeholder="E-mail"
          placeholderTextColor="#888"
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Số điện thoại"
          placeholderTextColor="#888"
          onChangeText={(text) => setPhone(text)}
          value={phone}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Mật khẩu"
          placeholderTextColor="#888"
          secureTextEntry={true}
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
        <Text style={styles.terms}>
          Để đăng ký tài khoản, bạn đồng ý Terms & Conditions and Privacy Policy
        </Text>

        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.buttonLogin}>Đăng ký</Text>
        </TouchableOpacity>
        <View style={styles.and}>
          <View style={styles.line} />
          <Text style={styles.orText}>Hoặc</Text>
          <View style={styles.line} />
        </View>
        <Image source={require("../assets/images/gg_fb.png")} />
        <View style={styles.addtk}>
          <Text>Bạn không có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.addRegister}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  img: {
    width: "100%",
    height: 210,
  },
  container_input: {
    justifyContent: "center",
    alignItems: "center",
    paddingStart: 30,
    paddingEnd: 30,
  },
  textInput: {
    width: 350,
    height: 56,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fff",
  },
  terms: {
    textAlign: "center",
    fontSize: 14,
    marginHorizontal: 20,
  },
  buttonLogin: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    marginTop: 20,
    width: 350,
    height: 56,
  },
  and: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#4CAF50",
  },
  orText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  addtk: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  addRegister: {
    color: "#4CAF50",
    marginStart: 5,
  },
});
