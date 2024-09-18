import { makeAutoObservable } from "mobx";
import { SystemSetting } from "../models/SystemSetting";
import agent from "../api/agent";
import { SlideShow } from "../models/SlideShow";

export default class SystemSettingStore {
  systemSetting: SystemSetting[] = [];
  slideShow: SlideShow[] = [];
  loadings: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading = (state: boolean) => (this.loadings = state);

  getSystemSetting = async () => {
    this.setLoading(true);

    try {
      const result = await agent.SystemSetting.getSystemSetting();

      this.systemSetting = result;

      this.setLoading(false);
    } catch (error) {
      this.setLoading(false);

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

  //-------------------------------------------slide show---------------------------------------------//

  getSlideShow = async () => {
    try {
      const result = await agent.SystemSetting.getSlideShow();

      this.slideShow = result;
    } catch (error) {
      throw error;
    }
  };

  createUpdateSlideShow = async (values: any) => {
    try {
      const result = await agent.SystemSetting.createUpdateSlideShow(values);
      this.getSlideShow();
      return result;
    } catch (error) {
      throw error;
    }
  };

  isUsedSlideShow = async (id: any) => {
    try {
      const result = await agent.SystemSetting.isUsedSlideShow(id);
      this.getSlideShow();
      return result;
    } catch (error) {
      throw error;
    }
  };

  removeSlideShow = async (id: any) => {
    try {
      const result = await agent.SystemSetting.removeSlideShow(id);
      this.getSlideShow();
      return result;
    } catch (error) {
      throw error;
    }
  };
}
