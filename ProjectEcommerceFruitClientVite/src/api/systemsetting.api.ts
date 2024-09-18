import { createFormData, requests } from "./agent";

export const SystemSetting = {
  getSystemSetting: () => requests.get("SystemSetting/GetSystemSetting"),
  createUpdateSystemSetting: (values: any) =>
    requests.post(
      "SystemSetting/CreateUpdateSystemSetting",
      createFormData(values)
    ),
  getSlideShow: () => requests.get("SystemSetting/GetSlideShow"),
  createUpdateSlideShow: (values: any) =>
    requests.post(
      "SystemSetting/CreateUpdateSlideShow",
      createFormData(values)
    ),
  isUsedSlideShow: (id: any) =>
    requests.onlyPost(`SystemSetting/IsUsedSlideShow?slideShowId=${id}`),
  removeSlideShow: (id: any) =>
    requests.delete(`SystemSetting/RemoveSlideShow?slideShowId=${id}`),
};
