export interface NEWS {
  id: number;
  title: string;
  imageName?: string | null;
  description: string;
  isUsed: boolean;
  createdAt: Date;
  hidden: boolean;
}
