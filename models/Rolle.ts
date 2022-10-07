export interface Role {
	id: number;
	name: string;
	abbr: string;
	visible: boolean;
	order?: number;
}

export const ROLES: Role[] = [
	{ id: 1, name: 'Power', abbr: 'P', visible: true, order: 1 },
	{ id: 2, name: 'Condi', abbr: 'C', visible: true, order: 2 },
	{ id: 3, name: 'Tank', abbr: 'T', visible: true, order: 3 },
	{ id: 4, name: 'Healer', abbr: 'H', visible: true, order: 4 },
	{ id: 5, name: 'Support', abbr: 'U', visible: false, order: null },
	{ id: 6, name: 'Banner Slave', abbr: 'B', visible: false, order: null },
	{ id: 7, name: 'Special', abbr: 'S', visible: true, order: 8 },
	{ id: 8, name: 'Kiter', abbr: 'K', visible: true, order: 7 },
	{ id: 9, name: 'Quickness', abbr: 'Q', visible: true, order: 5 },
	{ id: 10, name: 'Alacrity', abbr: 'A', visible: true, order: 6 },
];