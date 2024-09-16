import { requests } from "./agent";

export const SystemSetting = {
  getSystemSetting: () => requests.get("SystemSetting/GetSystemSetting"),
  createUpdateSystemSetting: (values: any) =>
    requests.post("SystemSetting/CreateUpdateSystemSetting", values),
};
