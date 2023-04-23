import axios, { Method } from "axios";
import { getCookie } from "./cookies";
import config from "./config.json";
import { getCurrentEnvironment } from "../utils/misc";

const instance = axios.create({
	baseURL: config[getCurrentEnvironment()],
	headers: { authentication: getCookie("session") },
});

export default async function fetch<T>(
	endpoint: string,
	method: Method | "form",
	params: any,
	authed: boolean
): Promise<T> {
	if (authed && !instance.defaults.headers.common["authentication"]) {
		instance.defaults.headers.common["authentication"] = getCookie("session");
	}

	switch (method) {
		case "get":
			const response = await instance({ method, url: endpoint, params });
			return response.data;
		case "form":
			const formData = new FormData();
			for (const param in params) {
				formData.append(param, params[param]);
			}
			const headers = { "Content-Type": "multipart/form-data" };
			return (await instance.post<T>(endpoint, formData, { headers })).data;
		default:
			return (await instance({ method, url: endpoint, data: params })).data;
	}
}
