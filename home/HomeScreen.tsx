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

const HomeScreen = () => {
  const [productTree, setProductTree] = useState([]);
  const [productPot, setProductPot] = useState([]);
  const [productToolst, setProductToolst] = useState([]);
  const navigation = useNavigation();

  const apiTree = "http://10.24.30.107:3000/product_tree";
  const apiPot = "http://10.24.30.107:3000/product_pot";
  const apiToolst = "http://10.24.30.107:3000/product_tools";

  useEffect(() => {
    console.log("Loading...");
    getList();
  }, []);

  const getList = async () => {
    try {
      const [treeRes, potRes, toolsRes] = await Promise.all([
        axios.get(apiTree),
        axios.get(apiPot),
        axios.get(apiToolst),
      ]);
      setProductTree(treeRes.data);
      setProductPot(potRes.data);
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
        <View style={styles.shopping}>
          <Text style={styles.title}>
            Planta - tỏa sáng {"\n"}
            <Text style={{ fontWeight: "bold" }}>không gian nhà bạn</Text>
          </Text>
          <View style={styles.cartContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate("GioHang")} // Điều hướng tới "Giỏ hàng"
            >
              <MaterialIcons name="shopping-cart" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <Image
          source={require("../assets/images/banner.png")}
          style={styles.banner}
        />

        <View style={styles.list}>
          <Text style={styles.sectionTitle}>Cây trồng</Text>
          <FlatList
            data={productTree}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate("TreeScreen", { productTree })}
          >
            <Text style={styles.viewMore}>Xem thêm cây trồng</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Chậu cây trồng</Text>
          <FlatList
            data={productPot}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.buttontext}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("PotScreen", { productPot });
            }}
          >
            <Text style={styles.viewMore}>Xem thêm Phụ kiện</Text>
          </TouchableOpacity>

          <FlatList
            data={productToolst}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            scrollEnabled={false}
          />
        </View>
        <View style={styles.buttontext}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ToolsSecreen", { productToolst });
            }}
          >
            <Text style={styles.viewMore}>Xem thêm dụng cụ</Text>
          </TouchableOpacity>

          <Text>Sản phẩm mới</Text>
          <View style={styles.spNew}>
            <View style={styles.textContainer}>
              <Text style={{ fontWeight: "bold" }}>Lemon Balm Grow Kit</Text>
              <Text>
                Gồm: hạt giống Lemon Balm, gói đất hữu cơ, chậu Planta, marker
                đánh dấu...
              </Text>
            </View>
            <Image source={require("../assets/images/buttonbanner.png")} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
  },
  shopping: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  cartContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
  },
  banner: {
    width: "100%",
    height: 205,
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
  buttontext: {
    paddingLeft: 20,
    marginRight: 20,
  },
  viewMore: {
    textDecorationLine: "underline",
    alignSelf: "flex-end",
    fontSize: 16,
    marginTop: 10,
  },
  spNew: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "gray",
    borderRadius: 10, // Bo góc nhiều hơn cho mềm mại
    padding: 10, // Tạo khoảng cách bên trong
    marginTop: 10, // Khoảng cách với phần trên
  },
  textContainer: {
    flex: 1, // Để text chiếm toàn bộ không gian bên trái
    paddingRight: 10, // Tạo khoảng cách giữa chữ và ảnh
  },
  imageStyle: {
    width: 80, // Điều chỉnh kích thước ảnh
    height: 80,
    borderRadius: 10, // Bo góc ảnh nếu cần
  },
});
