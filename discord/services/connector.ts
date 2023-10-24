// const axios = require('axios');
import axios, { Method } from "axios";
import config from "./config.json";

export default async function fetch(endpoint: string, method: Method, params: any, auth?) {
	const env = process.env.NODE_ENV || 'development';
    try {
        const url = config[env] + endpoint;
        if (auth) {
            params.auth = auth;
        }
        if (method === 'get') {
            return (await axios({method, url, params})).data;
        } else {
            return (await axios({method, url, data: params})).data;
        }
    } catch (e) {
        return null;
    }
}