export interface Post {
  id: string;
  bookTitle: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
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
