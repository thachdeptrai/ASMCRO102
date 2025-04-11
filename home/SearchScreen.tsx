import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Text,
  Image,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import DetailScreen from "./DetailScreen"; // đúng path đến file

import API from "@/login/api";

const SearchScreen = () => {
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const apiTree = API.TREE;
  const apiPot = API.POT;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText.trim() !== "") {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 300); // đợi 300ms sau khi ngừng gõ mới tìm

    return () => clearTimeout(delayDebounce);
  }, [searchText]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      const [treeRes, potRes] = await Promise.all([
        axios.get(apiTree),
        axios.get(apiPot),
      ]);
      const allProducts = [...treeRes.data, ...potRes.data];

      const filtered = allProducts.filter((item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase())
      );

      setSearchResults(filtered);
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = (product) => {
    setSearchResults([]);
    setRecentSearches((prev) => {
      const updated = [
        product,
        ...prev.filter((item) => item._id !== product._id),
      ];
      return updated.slice(0, 5);
    });
    navigation.navigate("DetailScreen", { product }); // Điều hướng tới trang chi tiết
  };

  const removeRecentSearch = (_id) => {
    setRecentSearches((prev) => prev.filter((item) => item._id !== _id));
  };

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
          <MaterialIcons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading && (
        <ActivityIndicator size="large" color="#000" style={{ marginVertical: 10 }} />
      )}

      {/* Tìm kiếm gần đây */}
      {!loading && recentSearches.length > 0 && (
        <View style={styles.recentSearchContainer}>
          <Text style={styles.recentTitle}>Tìm kiếm gần đây</Text>
          <FlatList
            data={recentSearches}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => (
              <View style={styles.recentItem}>
                <Text style={styles.recentText}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeRecentSearch(item._id)}>
                  <MaterialIcons name="close" size={20} color="gray" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}

      {/* Kết quả tìm kiếm */}
      {!loading && searchResults.length > 0 && (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultItem}
              onPress={() => handleSelectProduct(item)}
            >
              <Image source={{ uri: item.image }} style={styles.image} />
              <View style={styles.textContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>{item.price}đ</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
  },
  searchButton: {
    padding: 5,
  },
  recentSearchContainer: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  recentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  recentText: {
    fontSize: 14,
    color: "#333",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  textContainer: {
    marginLeft: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "green",
  },
});
