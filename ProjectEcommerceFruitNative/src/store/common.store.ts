import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable, runInAction } from "mobx";
import { login } from "../interfaces/user/login";
import agent from "../api/agent";
import { Alert } from "react-native";
import { router } from "expo-router";
import { Mytoast } from "@/components/MyToast";
import { store } from "./store";
import { register } from "../interfaces/user/register";
import axios from "axios";

export default class CommonStore {
  token: string | null = null;
  loadingCommon: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getToken = async () => {
    const result = await AsyncStorage.getItem("token");
    this.token = result ? JSON.parse(result) : null;
    console.log("res result", result);
    if (result !== null) {
      const res = await store.userStore.getUserDetailbyId().catch(() => {
        this.logout();
      });

      console.log("res getUserDetailbyId", res);

      // if (res?.response?.request?.status !== undefined) {
      //   if (res.response.request.status === 401) {
      //     logout();
      //   }
      // }
    }
  };

  setToken = async (state: string | null) => {
    this.token = state;
    await AsyncStorage.setItem("token", JSON.stringify(state));
  };

  setLoadingCommon = (state: boolean) => (this.loadingCommon = state);

  login = async (values: login) => {
    runInAction(() => this.setLoadingCommon(true));
    try {
      await agent.Common.login(values)
        .then((res) => {
          if (res === "PhoneNumber Wrong") {
            // Mytoast("โปรดตรวจสอบเบอร์โทรศัพท์อีกครั้ง!");
            Alert.alert("ข้อมูลไม่ครบ", "โปรดตรวจสอบเบอร์โทรศัพท์อีกครั้ง!");
          } else if (res === "Password Wrong") {
            // Mytoast("โปรดตรวจสอบรหัสผ่านอีกครั้ง!");
            Alert.alert("ข้อมูลไม่ครบ", "โปรดตรวจสอบรหัสผ่านอีกครั้ง!");
          } else {
            runInAction(() => {
              this.setToken(res);

              this.setLoadingCommon(false);
            });

            router.replace("/(tabs)");
          }
        })
        .catch((err) => {});
    } catch (error) {
      runInAction(() => this.setLoadingCommon(false));

      throw error;
    }
  };

  register = async (values: register) => {
    runInAction(() => this.setLoadingCommon(true));

    try {
      const user = await agent.Common.register(values);

      console.log("user : ", user);

      runInAction(() => this.setLoadingCommon(false));

      return user;
    } catch (error) {
      runInAction(() => this.setLoadingCommon(false));

      if (axios.isAxiosError(error)) {
        // ตรวจสอบว่าสถานะเป็น 400 หรือไม่
        if (error.response && error.response.status === 400) {
          // console.log("Error: Bad Request (400)", error.response.data);

          return 400;
        } else {
          console.log("Error:", error.message);
        }
      } else {
        // จัดการ error ที่ไม่ใช่ AxiosError
        console.log("Unexpected Error:", error);
      }
    }
  };

  logout = async () => {
    await AsyncStorage.removeItem("token");
    this.token = null;
    store.userStore.setUser(null);
    router.push("/login");
  };
}
