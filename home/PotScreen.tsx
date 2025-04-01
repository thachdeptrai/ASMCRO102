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

const PotScreen = () => {
  const [productPot, setProductPot] = useState([]);
  const navigation = useNavigation();

  const apiPot = "http://10.24.30.107:3000/product_pot";

  useEffect(() => {
    console.log("Loading...");
    getList();
  }, []);

  const getList = async () => {
    try {
      const potRes = await axios.get(apiPot);
      setProductPot(potRes.data);
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

        <View style={styles.list}>
          <FlatList
            data={productPot}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PotScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  card: {
    flex: 1,
    justifyContent: "center",
    margin: 10,
    borderRadius: 10,
    shadowColor: "#000",
  },
  image: {
    width: 150,
    height: 140,
    borderRadius: 5,
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
  list: {
    padding: 20,
  },
});
