export interface Post {
  _id: string;
  bookTitle: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  userId: string;
}

export interface NewPostFormData {
  bookTitle: string;
  content: string;
  imageUrl: string;
}

export interface NewPostData extends NewPostFormData {
  userId: string;
}
