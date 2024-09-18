import { SlideShow } from "./SlideShow";

export interface SystemSetting {
  id: number;
  image?: string | null;
  webName: string;
  description: string;

  slideShows: SlideShow[];
}
