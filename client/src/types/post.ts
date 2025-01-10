export interface Post {
  id: string;
  bookTitle: string;
  content: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface NewPostData {
  bookTitle: string;
  content: string;
  imageUrl: string;
}
