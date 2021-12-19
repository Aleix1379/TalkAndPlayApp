export interface Product {
    id: number
    name: string
    // legalText: string
    extra?: string
    type: 'roguee' | 'game'
    items: ProductItem[] | Game[]
}

export interface ProductItem {
    id: number
    title: string
    link: string
    image: string,
    price: string
    platforms?: string[]
}

export interface ProductItemRender {
    item: ProductItem | Game
    index: number
}

export interface Game {
    id: number;
    link: string;
    imageName: string;
    platform: string;
    base64?: any;
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

export interface Sort2 {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
}

export interface GameResponse {
    content: Game[];
    pageable: Pageable;
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    sort: Sort2;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}

