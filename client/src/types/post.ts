export interface Post {
  _id: string;
  bookTitle: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  userId: string;
  likes: string[];
  readingProgress?: string; // Optional field
  authorName?: string; // Optional field
}

export interface NewPostFormData {
  bookTitle: string;
  content?: string;
  imageUrl?: string;
  readingProgress?: string; // Optional field
  authorName?: string;
}

export interface NewPostData extends NewPostFormData {
  userId: string;
}
 export interface BookVolumeInfo {
  title: string;
  authors: string[];
  description: string;
  imageLinks: {
    thumbnail: string;
  };
 }