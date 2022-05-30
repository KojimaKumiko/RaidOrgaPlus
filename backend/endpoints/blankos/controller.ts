import * as _blanko from "./blanko";
import * as _roles from "../../authentication/role";
import { Request } from "express";
import { Authentication } from "models/Auth";
import { OkPacket } from "mysql";
import { ControllerEndpoint } from "models/ControllerEndpoint";
import { blankoElement } from "models/Types";
import { mapRoleStringToRoles } from "../../util/misc";

const endpoints: ControllerEndpoint[] = [
	{ function: getElements, path: "", method: "get", authed: true },
	{ function: postElement, path: "", method: "post", authed: true },
	{ function: copyFromTo, path: "/copy", method: "post", authed: true },
];
export default endpoints;

async function getElements(req: Request, authentication: Authentication): Promise<blankoElement[]> {
	const raid = Number(req.query.raid);
	const enc = Number(req.query.enc);
	let elements: blankoElement[];

	if (raid) {
		const role = _roles.forRaid(authentication, raid);
		if (role != null) {
			if (enc) {
				elements = await _blanko.getElementsByEncounter(raid, enc);
			} else {
				elements = await _blanko.getAllElements(raid);
			}

			elements.forEach(setRoles);
			return elements;
		}
	}
	return [];
}

async function postElement(req: Request, authentication: Authentication): Promise<OkPacket> {
	const raid = Number(req.body.raid);
	const enc = Number(req.body.enc);
	const position = Number(req.body.position);
	const type: string = req.body.type;
	let value: string | number = req.body.value;
	if (raid && enc && position && type && (value || value === 0)) {
		const role = _roles.forRaid(authentication, raid);
		if (role > 0) {
			if (type === "class") {
				value = Number(value);
				return _blanko.setClass(raid, enc, position, value);
			} else if (type === "role") {
				value = value.toString();
				const ok = value.split(", ").every((r) => !Number.isNaN(Number(r)));
				if (ok) {
					return _blanko.setRole(raid, enc, position, value);
				}
			}
		}
	}
	return;
}

async function copyFromTo(req: Request, authentication: Authentication): Promise<blankoElement[]> {
	const raid = Number(req.body.raid);
	const from = Number(req.body.from);
	const to = Number(req.body.to);
	if (raid && from && to) {
		const role = _roles.forRaid(authentication, raid);
		if (role > 0) {
			return _blanko.copyFromTo(raid, from, to).then(async () => {
				const elements = await _blanko.getAllElements(raid);
				elements.forEach(setRoles);
				return elements;
			});
		}
	}
}

function setRoles(value: blankoElement) {
	if (value.roleIds) {
		const roleIds = value.roleIds.split(",");
		value.roles = roleIds.map(mapRoleStringToRoles);
	} else {
		value.roles = [];
	}
}
