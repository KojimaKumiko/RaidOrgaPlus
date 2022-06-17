import express, { Request } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import fs from "fs";
import http from "http";
import https from "https";
import nodeLogger from "simple-node-logger";
import consoleStamp from "console-stamp";

import { auth } from "./authentication/auth";
import * as websocket from "./websocket/websocket";
import { Endpoint } from "models/Endpoint";
import { Authentication } from "models/Auth";
import { startUserCheckTimer } from "./timer";

import { Dictionary } from "../models/Dictionary";

const app = express();
const loggerOptions = {
	logFilePath: "backend.log",
	timestampFormat: "YYYY-MM-DD HH:mm:ss.SSS",
};
export const logger = nodeLogger.createSimpleLogger(loggerOptions);

consoleStamp(console, {
	format: ":date(dd.mm.yyyy HH:MM:ss.l) :label",
});

const endpoints: Dictionary<Dictionary<Endpoint>> = {};

const corsOptions = {
	origin: "*",
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	//credentials : true
};

app.use(cors(corsOptions));
app.use(express.json()); // to support JSON-encoded bodies
app.use("/icons", express.static("icons"));
app.use("/reports", express.static("reports/parsed"));
app.use(fileUpload());

fs.readdir("./endpoints/", (err, folders) => {
	folders.forEach((folder) => {
		fs.readdir(`./endpoints/${folder}`, (err, files) => {
			files.forEach(async (file) => {
				if (file === "controller.js") {
					const endpoints = await import(`./endpoints/${folder}/controller.js`);
					endpoints.default.forEach((endpoint) => {
						registerEndpoint(folder, endpoint);
					});
				} else if (file === "controller.ts") {
					const endpoints = await import(`./endpoints/${folder}/controller.ts`);
					endpoints.default.forEach((endpoint) => {
						registerEndpoint(folder, endpoint);
					});
				}
			});
		});
	});
});

function registerEndpoint(path: string, endpoint: Endpoint) {
	const method = endpoint.method;
	const fullPath = `/${path}${endpoint.path}`;
	if (!endpoints[method]) endpoints[method] = {};
	logger.debug(`Register ${method} @ ${fullPath}`);
	endpoints[method][fullPath] = endpoint;
}

app.route("*").all(async function (req, res) {
	res.send(await requestHandler(req));
});

async function requestHandler(request: Request) {
	const method: string = request.method.toLowerCase();
	const endpoint = endpoints[method][request.path];
	if (!endpoint) return [];

	const agent = request.header("user-agent");
	let uuid: string, authentication: Authentication;
	uuid = request.header("authentication");
	
	if (!uuid) {
		if (method === "get") {
			uuid = request.query.auth as string;
		} else {
			uuid = request.body.auth;
		}
	}

	if (uuid) {
		authentication = await auth(uuid, agent);
	}

	const authNeeded = endpoint.authed;

	if (authentication) {
		logRequest(method, request.originalUrl, authentication.user);
		return await endpoint.function(request, authentication);
	} else {
		logRequest(method, request.originalUrl);
		if (!authNeeded) {
			return await endpoint.function(request);
		}
		logger.warn("Missing Authentication!");
		return null;
	}
}

try {
	// Certificate
	const privateKey = fs.readFileSync("/etc/letsencrypt/live/sv.rising-light.de/privkey.pem", "utf8");
	const certificate = fs.readFileSync("/etc/letsencrypt/live/sv.rising-light.de/cert.pem", "utf8");
	const ca = fs.readFileSync("/etc/letsencrypt/live/sv.rising-light.de/chain.pem", "utf8");

	const credentials = {
		key: privateKey,
		cert: certificate,
		ca: ca,
	};

	const env = process.argv[2];
	if (env === "http") {
		serveHTTP();
	} else {
		serveHTTPS(credentials);
	}
} catch (e) {
	logger.warn("Server konnte über HTTPS nicht gestartet werden");
	serveHTTP();
}

function serveHTTPS(credentials) {
	const server = https.createServer(credentials, app);
	server.listen(8080, function () {
		logger.info("Server über HTTPS gestartet auf Port 8080!");
	});
	websocket.start(server);

	startUserCheckTimer();
}

function serveHTTP() {
	const server = http.createServer(app);
	server.listen(8081, function () {
		logger.info("Server über HTTP gestartet auf Port 8081!");
	});
	websocket.start(server);
}

function logRequest(method: string, endpoint: string, user?: number) {
	if (user) {
		logger.info(method, " @ ", endpoint, " by ", user);
	} else {
		logger.info(method, " @ ", endpoint);
	}
}
