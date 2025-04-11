import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { login } from "../redux/auth/authSlice";
import API from "./api";
const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  const emailNormalized = email.trim().toLowerCase();
  const handleEmailLogin = async () => {
    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ!");
      return;
    }
  
    const emailNormalized = email.trim().toLowerCase();
  
    try {
      const response = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailNormalized, password }),
      });
  
      const text = await response.text();
      console.log("Raw response from server:", text);
  
      const data = JSON.parse(text);
  
      if (!response.ok) {
        alert(data.message || "Đăng nhập thất bại");
        return;
      }
      // Lưu Redux
      dispatch(login({ uid: data.user.id, email: emailNormalized }));
      // AsyncStorage
      await AsyncStorage.setItem("userEmail", emailNormalized); // luôn lưu
      if (rememberMe) {
        await AsyncStorage.setItem("userPassword", password); // chỉ lưu pass nếu tick
      } else {
        await AsyncStorage.removeItem("userPassword");
      }
      alert("Đăng nhập thành công!");
      navigation.navigate("AppHome");
    } catch (err) {
      console.error("Lỗi parse hoặc fetch:", err);
      alert("Đã có lỗi xảy ra khi đăng nhập");
    }
  };  
  return (
    <ScrollView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image
        source={require("../assets/images/anhLogin.png")}
        style={styles.img}
      />

      <View style={styles.container_input}>
        <Text style={{ fontSize: 30, fontWeight: "bold" }}>Chào mừng bạn</Text>
        <Text style={{ fontSize: 18, marginBottom: 15 }}>
          Đăng nhập tài khoản
        </Text>

        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Mật khẩu"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <MaterialIcons
              name={showPassword ? "visibility" : "visibility-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.rememberMeContainer}>
          <TouchableOpacity
            onPress={() => setRememberMe(!rememberMe)}
            style={styles.checkbox}
          >
            {rememberMe && <View style={styles.checked} />}
          </TouchableOpacity>
          <Text style={styles.rememberMeText}>Ghi nhớ tài khoản</Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.buttonLogin} onPress={handleEmailLogin}>
            Đăng Nhập
          </Text>
        </TouchableOpacity>

        <View style={styles.addtk}>
          <Text>Bạn chưa có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text style={styles.addRegister}>Tạo tài khoản</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Login;
const styles = StyleSheet.create({
  container: { flex: 1 },
  img: { width: "100%", resizeMode: "cover" },
  container_input: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  rememberMeContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    marginBottom: 10,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "gray",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  checked: {
    width: 12,
    height: 12,
    backgroundColor: "#4CAF50",
  },

  rememberMeText: {
    fontSize: 16,
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
    backgroundColor: "#fff",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    width: 350,
    height: 56,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  eyeIcon: { padding: 10 },
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
