import Post from '../components/Post/Post';

export interface Post {
  _id: string;
  bookTitle: string;
  content: string;
  imageUrl: string;
  createdAt: Date;
  userId: string;
  likes: string[];
  readingProgress?: string;
  authorName?: string;
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

export interface PostsResponse {
  posts: Post[];
  totalPages: number;
}
