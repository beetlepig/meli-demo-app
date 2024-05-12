interface ISearchItem {
	id: string;
	title: string;
	condition: string;
	thumbnail_id: string;
	thumbnail: string;
	currency_id: string;
	price: number;
	catalog_product_id: string | null;
	shipping: {
		store_pick_up: boolean;
		free_shipping: boolean;
		logistic_type: string;
		mode: string;
		tags: string[];
		benefits?: unknown;
		promise?: unknown;
	};
	seller: {
		id: number;
		nickname: string;
	};
}

export type { ISearchItem };
