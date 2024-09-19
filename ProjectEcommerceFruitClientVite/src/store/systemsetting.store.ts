import { makeAutoObservable } from "mobx";
import { SystemSetting } from "../models/SystemSetting";
import agent from "../api/agent";
import { SlideShow } from "../models/SlideShow";
import { NEWS } from "../models/NEWS";

export default class SystemSettingStore {
  systemSetting: SystemSetting[] = [];
  slideShow: SlideShow[] = [];
  news: NEWS[] = [];
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

  getSlideShowAdmin = async () => {
    try {
      const result = await agent.SystemSetting.getSlideShowAdmin();

      this.slideShow = result;
    } catch (error) {
      throw error;
    }
  };

  createUpdateSlideShow = async (values: any) => {
    try {
      const result = await agent.SystemSetting.createUpdateSlideShow(values);
      this.getSlideShowAdmin();
      return result;
    } catch (error) {
      throw error;
    }
  };

  isUsedSlideShow = async (id: any) => {
    try {
      const result = await agent.SystemSetting.isUsedSlideShow(id);
      this.getSlideShowAdmin();
      return result;
    } catch (error) {
      throw error;
    }
  };

  removeSlideShow = async (id: any) => {
    try {
      const result = await agent.SystemSetting.removeSlideShow(id);
      this.getSlideShowAdmin();
      return result;
    } catch (error) {
      throw error;
    }
  };

  //-------------------------------------------news---------------------------------------------//

  getNEWSs = async () => {
    try {
      const result = await agent.SystemSetting.getNEWSs();

      this.news = result;
    } catch (error) {
      throw error;
    }
  };

  getNEWSsAdmin = async () => {
    try {
      const result = await agent.SystemSetting.getNEWSsAdmin();

      this.news = result;
    } catch (error) {
      throw error;
    }
  };

  createUpdateNEWS = async (values: any) => {
    try {
      const result = await agent.SystemSetting.createUpdateNEWS(values);
      this.getNEWSsAdmin();
      return result;
    } catch (error) {
      throw error;
    }
  };

  isUsedNEWS = async (id: any) => {
    try {
      const result = await agent.SystemSetting.isUsedNEWS(id);
      this.getNEWSsAdmin();
      return result;
    } catch (error) {
      throw error;
    }
  };

  removeNEWS = async (id: any) => {
    try {
      const result = await agent.SystemSetting.removeNEWS(id);
      this.getNEWSsAdmin();
      return result;
    } catch (error) {
      throw error;
    }
  };
}
