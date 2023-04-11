import {
	Box,
	Checkbox,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	OutlinedInput,
	Paper,
	Select,
	Stack,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	TextField,
	Toolbar,
	Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { ModRaid } from "models/Raid";
import { useCallback, useEffect, useState } from "react";

interface RowData {
	raidName: string;
	playerAccountName: string;
	playerName: string;
	role: string;
}

type Order = "asc" | "desc";

interface HeadCell {
	id: keyof RowData;
	label: string;
}

const headCells: readonly HeadCell[] = [
	{
		id: "raidName",
		label: "Raid",
	},
	{
		id: "playerAccountName",
		label: "Account Name",
	},
	{
		id: "playerName",
		label: "Name",
	},
	{
		id: "role",
		label: "Rolle",
	},
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}

	if (b[orderBy] > a[orderBy]) {
		return 1;
	}

	return 0;
}

function getComparator<Key extends keyof any>(
	order: Order,
	orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

const filterRows =
	(raidFilter: string[], roleFilter: string[], nameFilter: string) =>
	(row: RowData): boolean => {
		let included = true;

		if (raidFilter != null && raidFilter.length > 0) {
			included &&= raidFilter.includes(row.raidName);
		}

		if (roleFilter != null && roleFilter.length > 0) {
			included &&= roleFilter.includes(row.role);
		}

		if (nameFilter != null && nameFilter.trim() != null) {
			included &&=
				row.playerAccountName.toLowerCase().indexOf(nameFilter) > -1 ||
				row.playerName.toLowerCase().indexOf(nameFilter) > -1;
		}

		return included;
	};

interface IEnhancedTableHeadProps {
	onRequestSort: (event: React.MouseEvent<unknown>, newOrderBy: keyof RowData) => void;
	order: Order;
	orderBy: string;
}

const EnhancedTableHead = (props: IEnhancedTableHeadProps) => {
	const { onRequestSort, order, orderBy } = props;
	const createSortHandler = (newOrderBy: keyof RowData) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, newOrderBy);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map((headCell) => (
					<TableCell key={headCell.id} sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel
							active={orderBy === headCell.id}
							direction={orderBy === headCell.id ? order : "asc"}
							onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? (
								<Box component="span" sx={visuallyHidden}>
									{order === "desc" ? "sorted descending" : "sorted ascending"}
								</Box>
							) : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	);
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

const ROLES: string[] = ["Raid-Lead", "Lieutenant"];

enum SelectFilter {
	raid,
	role,
}

interface ITableToolbarProps {
	raidNames: string[];
	raidFilter: string[];
	roleFilter: string[];
	nameFilter: string;
	handleSelectChange: (filter: SelectFilter, event: string | string[]) => void;
	handleInputChange: (value: string) => void;
}

const TableToolbar = (props: ITableToolbarProps) => {
	const { raidNames, raidFilter, roleFilter, nameFilter, handleSelectChange, handleInputChange } = props;

	return (
		<Toolbar sx={{ pl: { xs: 1, sm: 2 }, pr: { xs: 1, sm: 1 }, pt: 1, pb: 1, "&.MuiToolbar-root": { minHeight: "unset" } }}>
			<Stack>
				<Typography sx={{ flex: "1 1 100%", pb: 1 }} variant="h6" id="tableTitle" component="div">
					Raid Overview
				</Typography>
				<Stack direction="row" flexWrap="wrap">
					<FormControl sx={{ m: 0.5, width: 240 }}>
						<InputLabel id="checkbox-label-raid">Raid Filter</InputLabel>
						<Select
							labelId="checkbox-label-raid"
							id="checkbox-select-raid"
							multiple
							value={raidFilter}
							onChange={(e) => handleSelectChange(SelectFilter.raid, e.target.value)}
							input={<OutlinedInput label="Raid Filter" />}
							renderValue={(selected) => selected.join(", ")}
							MenuProps={MenuProps}>
							{raidNames.map((name) => (
								<MenuItem key={name} value={name}>
									<Checkbox checked={raidFilter.indexOf(name) > -1} />
									<ListItemText primary={name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ m: 0.5, width: 240 }}>
						<InputLabel id="checkbox-label-role">Rollen Filter</InputLabel>
						<Select
							labelId="checkbox-label-role"
							id="checkbox-select-role"
							multiple
							value={roleFilter}
							onChange={(e) => handleSelectChange(SelectFilter.role, e.target.value)}
							input={<OutlinedInput label="Role Filter" />}
							renderValue={(selected) => selected.join(", ")}
							MenuProps={MenuProps}>
							{ROLES.map((role) => (
								<MenuItem key={role} value={role}>
									<Checkbox checked={roleFilter.indexOf(role) > -1} />
									<ListItemText primary={role} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						sx={{ m: 0.5, width: 240 }}
						id="input-name-filter"
						label="Name Filter"
						value={nameFilter}
						variant="outlined"
						onChange={(e) => handleInputChange(e.target.value)}
					/>
				</Stack>
			</Stack>
		</Toolbar>
	);
};

const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "raidName";

interface IRaidOverviewProps {
	raids: ModRaid[];
}

const RaidOverview = (props: IRaidOverviewProps) => {
	const { raids } = props;

	const [order, setOrder] = useState<Order>(DEFAULT_ORDER);
	const [orderBy, setOrderBy] = useState<keyof RowData>(DEFAULT_ORDER_BY);
	const [raidFilter, setRaidFilter] = useState<string[]>([]);
	const [roleFilter, setRoleFilter] = useState<string[]>([]);
	const [nameFilter, setNameFilter] = useState("");
	const [rows, setRows] = useState<RowData[]>([]);
	const [dataRows, setDataRows] = useState<RowData[] | null>(null);

	useEffect(() => {
		let data: RowData[] = [];

		raids.forEach((raid) => {
			const raidRow = raid.spieler
				.filter((s) => s.role > 0)
				.map((spieler) => {
					const role = spieler.role === 2 ? "Raid-Lead" : "Lieutenant";
					return {
						raidName: raid.name,
						playerAccountName: spieler.accname,
						playerName: spieler.name,
						role: role,
					} as RowData;
				});

			data = data.concat(raidRow);
		});

		setRows(data);
	}, [raids]);

	useEffect(() => {
		let rowsOnMount = rows.slice().sort(getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));
		setDataRows(rowsOnMount);
	}, [raids, rows]);

	const handleRequestSort = useCallback(
		(event: React.MouseEvent<unknown>, newOrderBy: keyof RowData) => {
			const isAsc = orderBy === newOrderBy && order === "asc";
			const toggledOrder = isAsc ? "desc" : "asc";
			setOrder(toggledOrder);
			setOrderBy(newOrderBy);

			const filteredRows = rows.slice().filter(filterRows(raidFilter, roleFilter, nameFilter));
			const sortedRows = filteredRows.sort(getComparator(toggledOrder, newOrderBy));
			setDataRows(sortedRows);
		},
		[order, orderBy, raidFilter, roleFilter, nameFilter, rows]
	);

	const handleSelectChange = (filter: SelectFilter, value: string | string[]) => {
		switch (filter) {
			case SelectFilter.raid:
				setRaidFilter(typeof value === "string" ? value.split(",") : value);
				break;
			case SelectFilter.role:
				setRoleFilter(typeof value === "string" ? value.split(",") : value);
				break;
		}
	};

	const handleInputChange = (value: string) => {
		setNameFilter(value);
	};

	useEffect(() => {
		let filteredRows = rows.slice().filter(filterRows(raidFilter, roleFilter, nameFilter));
		let sortedRows = filteredRows.sort(getComparator(order, orderBy));
		setDataRows(sortedRows);
	}, [order, orderBy, raidFilter, roleFilter, nameFilter, rows]);

	return (
		<Paper sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
			<TableToolbar
				raidNames={raids.map((r) => r.name)}
				handleSelectChange={handleSelectChange}
				handleInputChange={handleInputChange}
				raidFilter={raidFilter}
				roleFilter={roleFilter}
				nameFilter={nameFilter}
			/>
			<TableContainer>
				<Table aria-labelledby="tableTitle" stickyHeader>
					<EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
					<TableBody>
						{dataRows
							? dataRows.map((row) => (
									<TableRow key={row.raidName + "_" + row.playerAccountName}>
										<TableCell>{row.raidName}</TableCell>
										<TableCell>{row.playerAccountName}</TableCell>
										<TableCell>{row.playerName}</TableCell>
										<TableCell>{row.role}</TableCell>
									</TableRow>
							  ))
							: null}
					</TableBody>
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default RaidOverview;
