import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeAutoObservable, runInAction } from "mobx";
import { login } from "../interfaces/user/login";
import agent from "../api/agent";
import { Alert } from "react-native";
import { router } from "expo-router";
import { Mytoast } from "@/components/MyToast";
import { store } from "./store";

export default class CommonStore {
  token: string | null = null;
  loadingCommon: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  getToken = async () => {
    const result = await AsyncStorage.getItem("token");
    this.token = result ? JSON.parse(result) : null;

    if (result !== null) {
      store.userStore.getUserDetailbyId().then((res) => {
        console.log("res getUserDetailbyId", res);

        // if (res?.response?.request?.status !== undefined) {
        //   if (res.response.request.status === 401) {
        //     logout();
        //   }
        // }
      });
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

  logout = async () => {
    await AsyncStorage.removeItem("token");
    router.push("/login");
  };
}
