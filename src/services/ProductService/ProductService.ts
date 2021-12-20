import Api from "../Api"
import {Game, GameResponse, Product} from "../../types/Product"

class ProductService extends Api {
    private readonly data: Product[] = []

    constructor(max: number = 10) {
        super("/products/games")
        this.data = this.getProduct(max)
    }

    getProduct(maxItems: number) {
        const prods: Product[] = [
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
                items: this.getPlaceHolderItem(maxItems, "pc"),
                type: "game"
            },
            {
                id: 3,
                name: "ps 5",
                items: this.getPlaceHolderItem(maxItems, "ps 5"),
                type: "game"
            },
            {
                id: 4,
                name: "xbox series",
                items: this.getPlaceHolderItem(maxItems, "xbox series"),
                type: "game"
            },
            {
                id: 5,
                name: "nintendo switch",
                items: this.getPlaceHolderItem(maxItems, "nintendo switch"),
                type: "game"
            },
            {
                id: 6,
                name: "ps 4",
                items: this.getPlaceHolderItem(maxItems, "ps 4"),
                type: "game"
            },
            {
                id: 7,
                name: "xbox one",
                items: this.getPlaceHolderItem(maxItems, "xbox one"),
                type: "game"
            }
        ]
        return prods
    }

    getPlaceHolderItem(max: number, platformName: string) {
        const items: Game[] = []
        for (let i = 0; i < max; i++) {
            items.push({
                id: i,
                link: '',
                imageName: '',
                platform: platformName,
                base64: null
            })
        }
        return items
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
