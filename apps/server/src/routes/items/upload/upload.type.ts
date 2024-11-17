export type MyFile = {
  path: string;
  originalname: string;
  filename: string;
  size: number;
  mimetype: string;
};

export type uploadPayload = {
  file: MyFile;
  userId: string;
};
