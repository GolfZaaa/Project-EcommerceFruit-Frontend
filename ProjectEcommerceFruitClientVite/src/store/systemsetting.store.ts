import { makeAutoObservable } from "mobx";
import { SystemSetting } from "../models/SystemSetting";
import agent from "../api/agent";

export default class SystemSettingStore {
  systemSetting: SystemSetting[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  getSystemSetting = async () => {
    try {
      const result = await agent.SystemSetting.getSystemSetting();

      this.systemSetting = result;
    } catch (error) {
      throw error;
    }
  };

  createUpdateSystemSetting = async (values: SystemSetting) => {
    try {
      const result = await agent.SystemSetting.createUpdateSystemSetting(
        values
      );
      this.getSystemSetting();
      return result;
    } catch (error) {
      throw error;
    }
  };
}
