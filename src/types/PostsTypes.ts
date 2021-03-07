export type User = {
  id: number;
  name: string;
  email: string;
  imageVersion: number;
  languages: Option[];
  platforms: Option[];
};

export interface PostUser {
  id: number;
  name: string;
  email: string;
  imageVersion: number;
  languages: Option[];
  platforms: Option[];
}

export interface PostInfo {
  id: number;
  title: string;
  game: string;
  language: Option;
  platforms: Option[];
  user: PostUser | null;
  lastUpdate: any;
}

export interface Comment {
  id: number | null;
  text: string;
  lastUpdate?: any;
  author: User;
}

export interface SelectItem {
  id: number;
  name: string;
  value: boolean;
  image?: string;
}

export interface Filter {
  title: string;
  game: string;
  languages: Option[];
  platforms: Option[];
}

export interface Option {
  id: number;
  name: string;
  image?: string;
}

export const availablePlatforms = [
  {id: 1, name: 'PC', image: 'pc'},
  {id: 2, name: 'PS 5', image: 'ps4'},
  {id: 3, name: 'Xbox Series', image: 'xbox'},
  {id: 4, name: 'PS 4', image: 'ps4'},
  {id: 5, name: 'Xbox One', image: 'xbox'},
  {id: 6, name: 'Nintendo Switch', image: 'nintendo'},
  {id: 7, name: 'Android', image: 'android'},
  {id: 8, name: 'iOS', image: 'iphone'},
  {id: 9, name: 'PS 3', image: 'ps4'},
  {id: 10, name: 'Xbox 360', image: 'xbox'},
  {id: 11, name: 'Other', image: 'gamepad'},
];

export interface LoginResponse {
  token: string;
  user: User;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PostsResponse {
  content: PostInfo[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface CommentResponse {
  content: Comment[];
  pageable: Pageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
