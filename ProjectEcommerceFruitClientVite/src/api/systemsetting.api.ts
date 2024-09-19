import { createFormData, requests } from "./agent";

export const SystemSetting = {
  getSystemSetting: () => requests.get("SystemSetting/GetSystemSetting"),
  createUpdateSystemSetting: (values: any) =>
    requests.post(
      "SystemSetting/CreateUpdateSystemSetting",
      createFormData(values)
    ),

  //-------------------------------------------slide Show---------------------------------------------//

  getSlideShow: () => requests.get("SystemSetting/GetSlideShow"),
  getSlideShowAdmin: () => requests.get("SystemSetting/GetSlideShowAdmin"),
  createUpdateSlideShow: (values: any) =>
    requests.post(
      "SystemSetting/CreateUpdateSlideShow",
      createFormData(values)
    ),
  isUsedSlideShow: (id: any) =>
    requests.onlyPost(`SystemSetting/IsUsedSlideShow?slideShowId=${id}`),
  removeSlideShow: (id: any) =>
    requests.delete(`SystemSetting/RemoveSlideShow?slideShowId=${id}`),

  //-------------------------------------------news---------------------------------------------//

  getNEWSs: () => requests.get("SystemSetting/GetNEWSs"),
  getNEWSsAdmin: () => requests.get("SystemSetting/GetNEWSsAdmin"),
  createUpdateNEWS: (values: any) =>
    requests.post("SystemSetting/CreateUpdateNEWS", createFormData(values)),
  isUsedNEWS: (id: any) =>
    requests.onlyPost(`SystemSetting/IsUsedNEWS?newsId=${id}`),
  removeNEWS: (id: any) =>
    requests.delete(`SystemSetting/RemoveNEWS?newsId=${id}`),
};
