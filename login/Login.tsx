import {
  Image,
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons"; // Thư viện icon
import { useNavigation } from "@react-navigation/native";

const Login = () => {
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const apiLogin = "http://10.24.30.107:3000/LOGIN"; // Thay bằng API thực tế

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const response = await fetch(apiLogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Đăng nhập thành công!");
        navigation.navigate("AppHome");
      } else {
        alert(data.message || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Lỗi", error);
      alert("Đã có lỗi xảy ra, vui lòng thử lại.");
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
          placeholder="Nhập email hoặc số điện thoại"
          onChangeText={(text) => setUserName(text)}
          value={username}
        />

        {/* Ô nhập mật khẩu có icon con mắt */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPassword} // Đổi trạng thái khi bấm icon
            onChangeText={(text) => setPassword(text)}
            value={password}
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
        <Text
          style={{
            color: "red",
            textAlign: "left",
            alignSelf: "flex-start",
          }}
        >
          Invalid email or Password. Try Again!
        </Text>

        <View style={styles.saveLogin}>
          <TouchableOpacity
            style={styles.radio}
            onPress={() => setIsChecked(!isChecked)}
          >
            {/* Icon Radio */}
            <MaterialIcons
              name={
                isChecked ? "radio-button-checked" : "radio-button-unchecked"
              }
              size={24}
              color="#007AFF" // Màu xanh khi chọn
            />
            {/* Chữ "Lưu mật khẩu" */}
            <Text>Lưu mật khẩu</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Text style={styles.buttonLogin} onPress={handleLogin}>
            Đăng Nhập
          </Text>
        </TouchableOpacity>
        <View style={styles.and}>
          <View style={styles.line} />
          <Text style={styles.orText}>Hoặc</Text>
          <View style={styles.line} />
        </View>
        <Image source={require("../assets/images/gg_fb.png")} />
        <View style={styles.addtk}>
          <Text>bạn không có tải khoản?</Text>
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
  container: {
    flex: 1,
    flexDirection: "column",
  },
  img: {
    width: "100%",
    resizeMode: "cover",
  },

  container_input: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
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
    flex: 1, // Cho phép nhập liệu chiếm toàn bộ khoảng trống
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10, // Tăng vùng bấm cho icon
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
  saveLogin: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  radio: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    backgroundColor: "#4CAF50", // Màu đường kẻ
  },
  orText: {
    marginHorizontal: 10, // Khoảng cách giữa chữ và đường kẻ
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
