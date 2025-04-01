import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const categories = [
  { id: "all", title: "Tất cả" },
  { id: "new", title: "Hàng mới về" },
  { id: "light", title: "Ưa sáng" },
  { id: "shade", title: "Ưa bóng" },
];

const TreeScreen = () => {
  const [productTree, setProductTree] = useState([]);
  const [filteredTree, setFilteredTree] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigation = useNavigation();
  const apiTree = "http://10.24.30.107:3000/product_tree";

  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    filterList(selectedCategory);
  }, [selectedCategory, productTree]);

  const getList = async () => {
    try {
      const response = await axios.get(apiTree);
      setProductTree(response.data);
      setFilteredTree(response.data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu", error);
    }
  };

  const filterList = (category) => {
    if (category === "all") {
      setFilteredTree(productTree);
    } else if (category === "new") {
      setFilteredTree(productTree); // Giữ nguyên nếu hàng mới về cũng hiển thị tất cả
    } else if (category === "light") {
      setFilteredTree(productTree.filter((item) => item.onffo === "Ưa sáng"));
    } else if (category === "shade") {
      setFilteredTree(productTree.filter((item) => item.onffo === "Ưa bóng"));
    }
  };

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonSelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextSelected,
        ]}
      >
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("Detail", { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.status}>{item.onffo}</Text>
      <Text style={styles.price}>{item.price}đ</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh danh mục ngang */}
      <FlatList
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryList}
      />

      {/* Danh sách sản phẩm */}
      <FlatList
        data={filteredTree}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
      />
    </SafeAreaView>
  );
};

export default TreeScreen;

const styles = StyleSheet.create({
  categoryList: {
    paddingVertical: 10,
  },
  categoryButton: {
    paddingVertical: 5, // Giảm padding dọc để không quá cao
    paddingHorizontal: 10, // Giảm padding ngang để không quá dài
    borderRadius: 15, // Giữ bo góc phù hợp
    backgroundColor: "#f0f0f0",
    marginHorizontal: 5,
  },

  categoryButtonSelected: {
    backgroundColor: "#007537",
  },
  categoryText: {
    fontSize: 16,
    color: "#000",
  },
  categoryTextSelected: {
    color: "#fff",
    fontWeight: "bold",
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
});
