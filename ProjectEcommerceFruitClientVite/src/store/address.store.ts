import { makeAutoObservable } from "mobx";
import agent from "../api/agent";
import { Address } from "../models/Address";
import { store } from "./store";

export default class AddressStore {
  address: Address | null = null;
  myAddress: Address[] | null = null;
  myAddressgotoOrder: Address | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setAddress = (state: any) => (this.myAddress = state);
  setAddressa = (state: any) => (this.address = state);
  setAddressb = (state: any) => (this.myAddressgotoOrder = state);

  getAddressByUserId = async () => {
    try {
      const result = await agent.Address.GetAddressByUserId();
      this.myAddress = result;
    } catch (error) {
      throw error;
    }
  };

  getAddressgotoOrderByUserId = async () => {
    try {
      const result = await agent.Address.getAddressgotoOrderByUserId();
      this.myAddressgotoOrder = result;
      return result;
    } catch (error) {
      throw error;
    }
  };

  GetAddressByStore = async () => {
    try {
      const result = await agent.Address.GetAddressByStore();
      this.address = result;
    } catch (error) {
      throw error;
    }
  };

  createUpdateAddress = async (values: any) => {
    store.systemSettingStore.setLoading(true);
    try {
      const result = await agent.Address.createUpdateAddress(values);
    store.systemSettingStore.setLoading(false);
      return result;
    } catch (error) {
      return error;
    }
  };

  isUsedAddress = async (values: { addressId: any; storeormine: any }) => {
    // console.log("values", values);

    // this.setAddress(
    //   this.myAddress?.map((item) => {
    //     console.log(
    //       "test : ",
    //       values.storeormine === false
    //         ? item.id === values.addressId
    //           ? true
    //           : false
    //         : item.isUsed
    //     );

    //     return {
    //       ...item,
    //       isUsed:
    //         values.storeormine === false
    //           ? item.id === values.addressId
    //             ? true
    //             : false
    //           : item.isUsed,
    //       isUsed_Store:
    //         values.storeormine === true
    //           ? item.id === values.addressId
    //             ? true
    //             : false
    //           : item.isUsed_Store,
    //     };
    //   })
    // );

    try {
      const result = await agent.Address.isUsedAddress(values);

      return result;
    } catch (error) {
      return error;
    }
  };
}
