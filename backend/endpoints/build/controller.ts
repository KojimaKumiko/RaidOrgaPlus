import { Request } from "express";
import { ControllerEndpoint } from "models/ControllerEndpoint";

const endpoints: ControllerEndpoint[] = [{ function: checkBuildVersion, path: "", method: "get", authed: false }];
export default endpoints;

const EXPECTED_BUILD = "v2.4.4";

async function checkBuildVersion(req: Request): Promise<string> {
	const fe_build = req.query.build;
	if (fe_build && fe_build === EXPECTED_BUILD) {
		return "Success";
	}
	return EXPECTED_BUILD;
}
