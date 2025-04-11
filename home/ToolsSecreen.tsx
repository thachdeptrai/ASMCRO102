import {
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import API from "@/login/api";

const ToolsSecreen = () => {
  const [productToolst, setProductToolst] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    console.log("Loading...");
    getList();
  }, []);

  const getList = async () => {
    try {
      const toolsRes = await axios.get(API.TOOLS);
      setProductToolst(toolsRes.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu", error);
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
      <Text style={styles.price}>{item.price}đ</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <StatusBar translucent backgroundColor="transparent" />

        <View style={styles.buttontext}>
          <FlatList
            data={productToolst}
            renderItem={renderItem}
            keyExtractor={(item) => item._id.toString()}
            numColumns={2}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ToolsSecreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 140,
    borderRadius: 10,
  },
  
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  status: {
    color: "gray",
  },
  price: {
    fontSize: 16,
    color: "green",
    fontWeight: "bold",
  },
});
