import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { logout } from "../redux/auth/authSlice";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import API from "@/login/api";

const UserScreen: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const email = await AsyncStorage.getItem("userEmail");
        if (!email) throw new Error("Không tìm thấy email người dùng");
        console.log("Email đang gửi:", email); // ✅ đúng giá trị email lấy từ AsyncStorage
        const res = await axios.get(`${API.GETUSER}?email=${email}`); // <- gửi đúng param
        setUser(res.data);
      } catch (err) {
        console.log("Lỗi khi lấy user từ Mongo:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    dispatch(logout());
    navigation.navigate("Login");
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00aaff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>PROFILE</Text>

      <View style={styles.profileContainer}>
        <Image
          source={{
            uri:
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.username}>{user?.username || "Người dùng"}</Text>
          <Text style={styles.email}>{user?.email || "Chưa có email"}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chung</Text>
        <TouchableOpacity
          style={styles.item}
          onPress={() => navigation.navigate("EditUser", { user })}
        >
          <Text style={styles.itemText}>Chỉnh sửa thông tin</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Cẩm nang trồng cây</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Lịch sử giao dịch</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Q & A</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bảo mật và Điều khoản</Text>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Điều khoản và điều kiện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Chính sách quyền riêng tư</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 24,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#999",
    marginBottom: 8,
  },
  item: {
    paddingVertical: 10,
  },
  itemText: {
    fontSize: 15,
  },
  logoutButton: {
    marginTop: 10,
    marginBottom: 30,
  },
  logoutText: {
    color: "red",
    fontSize: 15,
    fontWeight: "bold",
  },
});
