import { useCallback, useEffect } from "react";
import { useRouteLoaderData } from "react-router-dom";
import axios from "axios";

import { Box } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";

import Toolbar from "../../components/Aufstellung/Toolbar";
import Composition from "../../components/Aufstellung/Composition";
import {
	addBoss,
	addStrike,
	addWing,
	getAnmeldungForSpieler,
	getAnmeldungenForTermin,
} from "../../services/endpoints/termine";
import { Encounter } from "models/Encounter";
import { Aufstellung } from "models/Aufstellung";
import { getElements, getForTermin } from "../../services/endpoints/aufstellungen";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
	selectComposition,
	setComposition,
	setElements,
	setSignUpPlayer,
	setSignUps,
	setTermin,
} from "../../store/slices/terminSlice";
import { CompPageLoader } from "../../models/types";

const CompositionPage = () => {
	const { termin } =
		(useRouteLoaderData("compPage") as CompPageLoader) || (useRouteLoaderData("archivePage") as CompPageLoader);

	const dispatch = useAppDispatch();
	const compositions = useAppSelector(selectComposition);

	const fetchData = useCallback(
		async (signal?: AbortSignal) => {
			try {
				console.log("fetching data in CompPage");

				const comps = await getForTermin(termin.id, signal);
				const elements = await getElements(termin.id, signal);
				const signUps = await getAnmeldungenForTermin(termin.id, signal);
				const signUpPlayer = await getAnmeldungForSpieler(termin.id, signal);

				dispatch(setComposition(comps));
				dispatch(setElements(elements));
				dispatch(setSignUps(signUps));
				dispatch(setSignUpPlayer(signUpPlayer));
			} catch (error) {
				if (axios.isCancel(error)) {
					console.log(error);
				} else {
					throw error;
				}
			}
		},
		[dispatch, termin.id]
	);

	const handleRefresh = () => {
		fetchData().catch(console.error);
	};

	useEffect(() => {
		dispatch(setTermin(termin));

		const abortController = new AbortController();

		fetchData(abortController.signal).catch(console.error);

		return () => {
			abortController.abort();
		};
	}, [termin, dispatch, fetchData]);

	const handleEncounterClick = async (encounter: Encounter) => {
		let result: (Aufstellung & Encounter)[];
		if (encounter.id === 0) {
			if (encounter.wing != null && encounter.wing > 0) {
				result = await addWing(termin.id, encounter.wing);
			} else {
				result = await addStrike(termin.id, encounter.strike);
			}
		} else {
			result = await addBoss(termin.id, encounter.id);
		}

		dispatch(setComposition(result));
		dispatch(setElements(await getElements(termin.id)));
	};

	return (
		<Box>
			<Toolbar onEncounterClick={handleEncounterClick} onRefresh={handleRefresh} isArchived={termin.isArchived} />
			<Grid container m={2} spacing={1}>
				{compositions.map((c) => (
					<Grid key={c.id} xs={12} md={6} xl={3}>
						<Composition comp={c} />
					</Grid>
				))}
			</Grid>
		</Box>
	);
};

export default CompositionPage;
