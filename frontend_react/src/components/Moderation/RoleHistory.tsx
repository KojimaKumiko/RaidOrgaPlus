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
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TableSortLabel,
	Toolbar,
	Typography,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import { useCallback, useEffect, useState } from "react";

import { RoleHistory } from "models/RoleHistory";

interface RowData {
	roleName: string;
	type: string;
	date: string;
	executor: string;
}

interface HeadCell {
	id: keyof RowData;
	label: string;
}

type Order = "asc" | "desc";

const headCells: HeadCell[] = [
	{
		id: "roleName",
		label: "Rolle",
	},
	{
		id: "type",
		label: "Typ",
	},
	{
		id: "date",
		label: "Datum",
	},
	{
		id: "executor",
		label: "Durchgeführt durch",
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
	(roleFilter: string[], typeFilter: string[], executorFilter: string[]) =>
	(row: RowData): boolean => {
		let included = true;

		if (roleFilter != null && roleFilter.length > 0) {
			included &&= roleFilter.includes(row.roleName);
		}

		if (typeFilter != null && typeFilter.length > 0) {
			included &&= typeFilter.includes(row.type);
		}

		if (executorFilter != null && executorFilter.length > 0) {
			included &&= executorFilter.includes(row.executor);
		}

		return included;
	};

interface IEnhancedTableHeadProps {
	order: Order;
	orderBy: string;
	onRequestSort: (event: React.MouseEvent<unknown>, newOrderBy: keyof RowData) => void;
}

const EnhancedTableHead = (props: IEnhancedTableHeadProps) => {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler = (newOrderBy: keyof RowData) => (event: React.MouseEvent<unknown>) => {
		onRequestSort(event, newOrderBy);
	};

	return (
		<TableHead>
			<TableRow>
				{headCells.map(headCell => (
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
}

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

const TYPES: string[] = ["ADD", "REMOVE"];

enum SelectFilter {
	role,
	type,
	executor,
}

interface ITableToolbarProps {
	roleNames: string[];
	executorNames: string[];
	roleFilter: string[];
	typeFilter: string[];
	executorFilter: string[];
	handleSelectChange: (filter: SelectFilter, event: string | string[]) => void;
}

const TableToolbar = (props: ITableToolbarProps) => {
	const { roleNames, executorNames, roleFilter, typeFilter, executorFilter, handleSelectChange } = props;

	return (
		<Toolbar
			sx={{
				pl: { xs: 1, sm: 2 },
				pr: { xs: 1, sm: 1 },
				pt: 1,
				pb: 1,
				"&.MuiToolbar-root": { minHeight: "unset" },
			}}>
			<Stack>
				<Typography sx={{ flex: "1 1 100%", pb: 1 }} variant="h6" id="tableTitle" component="div">
					Rollenhistorie
				</Typography>
				<Stack direction="row" flexWrap="wrap">
					<FormControl sx={{ m: 0.5, width: 240 }}>
						<InputLabel id="checkbox-label-role">Rollen Filter</InputLabel>
						<Select
							labelId="checkbox-label-role"
							id="checkbox-select-role"
							multiple
							value={roleFilter}
							onChange={(e) => handleSelectChange(SelectFilter.role, e.target.value)}
							input={<OutlinedInput label="Rollen Filter" />}
							renderValue={(selected) => selected.join(", ")}
							MenuProps={MenuProps}>
							{roleNames.map((name) => (
								<MenuItem key={name} value={name}>
									<Checkbox checked={roleFilter.indexOf(name) > -1} />
									<ListItemText primary={name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ m: 0.5, width: 240 }}>
						<InputLabel id="checkbox-label-type">Type Filter</InputLabel>
						<Select
							labelId="checkbox-label-type"
							id="checkbox-select-type"
							multiple
							value={typeFilter}
							onChange={(e) => handleSelectChange(SelectFilter.type, e.target.value)}
							input={<OutlinedInput label="Type Filter" />}
							renderValue={(selected) => selected.join(", ")}
							MenuProps={MenuProps}>
							{TYPES.map((type) => (
								<MenuItem key={type} value={type}>
									<Checkbox checked={typeFilter.indexOf(type) > -1} />
									<ListItemText primary={type} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl sx={{ m: 0.5, width: 240 }}>
						<InputLabel id="checkbox-label-executor">Ausführender Filter</InputLabel>
						<Select
							labelId="checkbox-label-executor"
							id="checkbox-select-executor"
							multiple
							value={executorFilter}
							onChange={(e) => handleSelectChange(SelectFilter.executor, e.target.value)}
							input={<OutlinedInput label="Ausführender Filter" />}
							renderValue={(selected) => selected.join(", ")}
							MenuProps={MenuProps}>
							{executorNames.map((name) => (
								<MenuItem key={name} value={name}>
									<Checkbox checked={executorFilter.indexOf(name) > -1} />
									<ListItemText primary={name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</Stack>
			</Stack>
		</Toolbar>
	);
};

const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = "roleName";

interface IRoleHistoryTableProps {
	roleHistory: RoleHistory[];
}

const RoleHistoryTable = (props: IRoleHistoryTableProps) => {
	const { roleHistory } = props;

	const [order, setOrder] = useState<Order>(DEFAULT_ORDER);
	const [orderBy, setOrderBy] = useState<keyof RowData>(DEFAULT_ORDER_BY);
	const [roleFilter, setRoleFilter] = useState<string[]>([]);
	const [typeFilter, setTypeFilter] = useState<string[]>([]);
	const [executorFilter, setExecutorFilter] = useState<string[]>([]);
	const [rows, setRows] = useState<RowData[]>([]);
	const [dataRows, setDataRows] = useState<RowData[] | null>(null);
	const [roleNames, setRoleNames] = useState<string[]>([]);
	const [executorNames, setExecutorNames] = useState<string[]>([]);

	useEffect(() => {
		let data: RowData[] = [];

		const getDate = (date: Date) => {
			return new Date(date).toLocaleString("de-DE", { dateStyle: "medium", timeStyle: "medium" });
		};

		data = roleHistory.map(history => {
			return {
				roleName: history.name,
				type: history.type,
				date: getDate(history.date),
				executor: history.changer,
			} as RowData;
		});

		setRows(data);
		setRoleNames(roleHistory.map(r => r.name).filter((value, index, array) => array.indexOf(value) === index).sort());
		setExecutorNames(roleHistory.map(r => r.changer).filter((value, index, array) => array.indexOf(value) === index).sort());
	}, [roleHistory]);

	useEffect(() => {
		let rowsOnMount = rows.slice().sort(getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY));
		setDataRows(rowsOnMount);
	}, [roleHistory, rows]);

	const handleRequestSort = useCallback(
		(event: React.MouseEvent<unknown>, newOrderBy: keyof RowData) => {
			const isAsc = orderBy === newOrderBy && order === "asc";
			const toggledOrder = isAsc ? "desc" : "asc";
			setOrder(toggledOrder);
			setOrderBy(newOrderBy);

			const filteredRows = rows.slice().filter(filterRows(roleFilter, typeFilter, executorFilter));
			const sortedRows = filteredRows.sort(getComparator(toggledOrder, newOrderBy));
			setDataRows(sortedRows);
		},
		[order, orderBy, roleFilter, typeFilter, executorFilter, rows]
	);

	const handleSelectChange = (filter: SelectFilter, value: string | string[]) => {
		switch (filter) {
			case SelectFilter.role:
				setRoleFilter(typeof value === "string" ? value.split(",") : value);
				break;
			case SelectFilter.type:
				setTypeFilter(typeof value === "string" ? value.split(",") : value);
				break;
			case SelectFilter.executor:
				setExecutorFilter(typeof value === "string" ? value.split(",") : value);
				break;
		}
	};

	useEffect(() => {
		let filteredRows = rows.slice().filter(filterRows(roleFilter, typeFilter, executorFilter));
		let sortedRows = filteredRows.sort(getComparator(order, orderBy));
		setDataRows(sortedRows);
	}, [order, orderBy, roleFilter, typeFilter, executorFilter, rows]);

	return (
		<Paper sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
			<TableToolbar
				roleNames={roleNames}
				executorNames={executorNames}
				roleFilter={roleFilter}
				typeFilter={typeFilter}
				executorFilter={executorFilter}
				handleSelectChange={handleSelectChange}
			/>
			<TableContainer>
				<Table aria-labelledby="tableTitle" stickyHeader>
					<EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} />
					{dataRows ? dataRows.map(row => (
						<TableRow key={row.roleName + "_" + row.type + "_" + row.date}>
							<TableCell>{row.roleName}</TableCell>
							<TableCell>{row.type}</TableCell>
							<TableCell>{row.date}</TableCell>
							<TableCell>{row.executor}</TableCell>
						</TableRow>
					)) : null}
				</Table>
			</TableContainer>
		</Paper>
	);
};

export default RoleHistoryTable;
