export interface Encounter {
	id: number;
	name: string;
	abbr: string;
	apiname: string;
	wing: number;
	strike: number;
	main: boolean;
	kp_id: number;
	has_cm: boolean;
}