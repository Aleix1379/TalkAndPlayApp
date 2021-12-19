import Api from "../Api"
import {GameResponse, Product} from "../../types/Product";

class ProductService extends Api {
    private readonly data: Product[] = [
        {
            id: 1,
            name: 'Rogue Energy',
            extra: 'Coupon code: TALKANDPLAY',
            type: 'roguee',
            items: [
                {
                    id: 1,
                    title: 'Black Cherry (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/black-cherry-energy',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/BCA-min_800x.png?v=1636734768',
                    price: '$34.99',
                },
                {
                    id: 2,
                    title: 'Blood Orange (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/blood-orange-energy',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/BOA_800x.png?v=1638196072',
                    price: '$34.99',
                },
                {
                    id: 3,
                    title: 'Blue Raspberry (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/blue-raspberry-tub',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/BRA_800x.png?v=1638196120',
                    price: '$34.99',
                },
                {
                    id: 4,
                    title: 'Strawberry Kiwi (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/strawberry-kiwi-tub',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/SKA_800x.png?v=1638197127',
                    price: '$34.99',
                },
                {
                    id: 5,
                    title: 'Grape Popsicle (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/grape-popsicle-tub-30-servings',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/GPA_800x.png?v=1638197024',
                    price: '$34.99',
                },
                {
                    id: 6,
                    title: 'Pink Lemonade (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/pink-lemonade-tub',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/PLA_800x.png?v=1638197080',
                    price: '$34.99',
                },
                {
                    id: 7,
                    title: 'Mango Pineapple (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/mango-pineapple-tub',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/MPA_800x.png?v=1638197059',
                    price: '$34.99',
                },
                {
                    id: 8,
                    title: 'Watermelon (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/watermelon-tub',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/WA_800x.png?v=1638197459',
                    price: '$34.99',
                },
                {
                    id: 9,
                    title: 'Cherry Limeade (Energy)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/cherry-limeade-tub',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/CLA_800x.png?v=1638196155',
                    price: '$34.99',
                },
                {
                    id: 10,
                    title: 'Raspberry Peach (Hydration)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/raspberry-peach-hydration',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/RPA_800x.png?v=1638197099',
                    price: '$34.99',
                },
                {
                    id: 11,
                    title: 'Dragon Fruit Mango (Hydration)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/dragon-fruit-mango-tub',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/DFMA_800x.png?v=1638196983',
                    price: '$34.99',
                },
                {
                    id: 12,
                    title: 'Fruit Punch (Hydration)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/fruit-punch-tub',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/FPA_800x.png?v=1638197005',
                    price: '$34.99',
                },
                {
                    id: 13,
                    title: 'Caramel Vanilla Latte (Shake)',
                    link: 'https://rogueenergy.com/collections/all-flavors/products/caramel-vanilla-latte',
                    image: 'https:////cdn.shopify.com/s/files/1/1734/8595/products/CLVA_800x.png?v=1638196139',
                    price: '$34.99',
                }
            ]
        },
        {
            id: 2,
            name: "pc",
            items: [
                {
                    "id": 979,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 980,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 981,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 982,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 983,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 984,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 985,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 986,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 987,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 988,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                }
            ],
            type: "game"
        },
        {
            id: 3,
            name: "ps 5",
            items: [
                {
                    "id": 1000,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1003,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1004,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1006,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1008,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1010,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1012,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1013,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1015,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1018,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                }
            ],
            type: "game"
        },
        {
            id: 4,
            name: "xbox series",
            items: [
                {
                    "id": 1073,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1074,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1075,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1076,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1077,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1078,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1079,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1080,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1081,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1082,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                }
            ],
            type: "game"
        },
        {
            id: 5,
            name: "nintendo switch",
            items: [
                {
                    "id": 1128,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1129,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1130,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1131,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1132,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1133,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1134,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1135,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1136,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1137,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                }
            ],
            type: "game"
        },
        {
            id: 6,
            name: "ps 4",
            items: [
                {
                    "id": 1197,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1205,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1207,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1209,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1210,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1211,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1212,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1213,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1214,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1215,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                }
            ],
            type: "game"
        },
        {
            id: 7,
            name: "xbox one",
            items: [
                {
                    "id": 1250,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1251,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1253,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1254,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1256,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1257,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1258,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1260,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1261,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                },
                {
                    "id": 1262,
                    "link": "",
                    "imageName": "",
                    "platform": "",
                    "base64": ""
                }
            ],
            type: "game"
        }
    ]

    constructor() {
        super("/products/games")
    }

    getGames(platform = '', page: number = 0, size: number = 10): Promise<GameResponse> {
        return this.http.get(`${this.getUrl()}?platform=${platform}&page=${page}&size=${size}`).then(res => res.data)
    }

    getLocalProducts(): Product[] {
        return this.data
    }

    getLocalProductByName(name: string): Product | undefined {
        return this.data.find(product => product.name === name)
    }

}

export default ProductService
