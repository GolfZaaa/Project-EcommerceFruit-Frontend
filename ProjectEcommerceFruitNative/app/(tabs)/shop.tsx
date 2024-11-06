import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useStore } from "@/src/store/store";

const { width } = Dimensions.get("window");

export default function ShopScreen() {
  const { GetShopByUserId } = useStore().shopUserStore;
  const { GetAddressByStore } = useStore().addressStore;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;

  const toggleDrawer = () => {
    if (isDrawerOpen) {
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(false));
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setIsDrawerOpen(true));
    }
  };

  const handleEditStoreName = async () => {
    await GetShopByUserId();
    await GetAddressByStore();
    router.push("../storeuser/editname");
  };

  const handleListproductgi = () => {
    router.push("../storeuser/listproductgi");
  };

  const handleListproduct = () => {
    router.push("../storeuser/listproduct");
  };

  const handleOrderHistoryStore = () => {
    router.push("../storeuser/orderhistorystore");
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.burgerIcon} onPress={toggleDrawer}>
        <Ionicons name="menu-outline" size={30} color="#333" />
      </TouchableOpacity>

      {isDrawerOpen && (
        <TouchableWithoutFeedback onPress={toggleDrawer}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}
      >
        <Text style={styles.drawerTitle}>เมนูเพิ่มเติม</Text>

        <TouchableOpacity onPress={handleEditStoreName} style={styles.menuItem}>
          <Ionicons name="cart-outline" size={30} color="#333" />
          <Text style={styles.menuText}>แก้ไขร้านค้า</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleListproductgi} style={styles.menuItem}>
          <Ionicons name="people-outline" size={30} color="#333" />
          <Text style={styles.menuText}>เพิ่มข้อมูลสินค้า (GI)</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleListproduct} style={styles.menuItem}>
          <Ionicons name="people-outline" size={30} color="#333" />
          <Text style={styles.menuText}>เพิ่มสินค้า</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOrderHistoryStore}
          style={styles.menuItem}
        >
          <Ionicons name="people-outline" size={30} color="#333" />
          <Text style={styles.menuText}>รายการคำสั่งซื้อ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.closeButton} onPress={toggleDrawer}>
          <Text style={styles.closeButtonText}>ปิด</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.cardContainer}>
        <View
          style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        >
          <Text
            style={{
              fontSize: 20,
              color: "#8a8a8a",
              fontWeight: "bold",
              letterSpacing: 1.2,
              marginBottom: 10,
            }}
          >
            รายได้รวมจากการจำหน่ายสินค้า
          </Text>
          <Text
            style={{
              fontSize: 40,
              color: "#28a745",
              fontWeight: "bold",
              letterSpacing: 1.5,
            }}
          >
            ฿17,000
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F7F9FC",
    paddingTop: 60,
  },
  burgerIcon: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  menuText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginLeft: 15,
  },
  drawer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "#fff",
    padding: 20,
    elevation: 5,
    zIndex: 2,
    paddingTop: 60,
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  card: {
    width: 170,
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    paddingLeft: 15,
  },
  label: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 20,
  },
  overlay: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },
  iconNumberContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
