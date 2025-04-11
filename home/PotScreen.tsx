import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import API from "@/login/api"; // Đường dẫn API của bạn

const PotScreen = () => {
  const [productPot, setProductPot] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const apiPot = API.POT;

  useEffect(() => {
    getList();
  }, []);

  const getList = async () => {
    try {
      const res = await axios.get(apiPot);
      setProductPot(res.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detail", { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      {item.onffo && <Text style={styles.status}>{item.onffo}</Text>}
      <Text style={styles.price}>
        {item.price?.toLocaleString("vi-VN") || 0}đ
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007537" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <FlatList
        data={productPot}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

export default PotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  list: {
    padding: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    margin: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 10,
    resizeMode: "cover",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  status: {
    color: "gray",
    fontSize: 13,
    marginTop: 2,
  },
  price: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
