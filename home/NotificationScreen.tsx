import React, { useCallback, useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import { RefreshControl } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "@/login/api";
import { useFocusEffect } from "@react-navigation/native";

interface Notification {
  userId: string;
  title: string;
  productName: string;
  image: string;
  date: string;
  quantity: number;
}

const NotificationScreen: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {  
    try {
      const email = await AsyncStorage.getItem("userEmail"); // email đã lưu khi đăng nhập
      if (!email) return;

      const res = await axios.get(`${API.BASEURL}/notifications?userId=${email}`);
      setNotifications(res.data); // set danh sách thông báo
    } catch (err) { 
      console.log("Lỗi khi lấy thông báo từ API:", err);
      setNotifications([]); // fallback nếu lỗi thì coi như không có
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications();
    }, [])
  );
  
  useEffect(() => {
    fetchNotifications();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchNotifications().finally(() => setRefreshing(false));
  }, []);
 
  const renderItem = ({ item }: { item: Notification }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.dateText}>{item.date}</Text>
      <View style={styles.notificationCard}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.successText}>{item.title}</Text>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text style={styles.quantityText}>{item.quantity} sản phẩm</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {notifications.length === 0 ? (
        <View style={styles.noNotification}>
          <Text style={styles.noText}>Hiện chưa có thông báo nào cho bạn</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default NotificationScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 80,
  },
  noNotification: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  noText: {
    fontSize: 16,
    color: "#888",
  },
  itemContainer: {
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14, 
    color: "#888",
    marginBottom: 6,
  },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#F6F6F6",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  successText: {
    color: "#4CAF50",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: "600",
  },
  quantityText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
