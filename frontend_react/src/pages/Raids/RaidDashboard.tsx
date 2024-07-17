import { Link } from "react-router-dom";
import { Card, CardContent, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Box } from "@mui/system";

const RaidDashboard = () => {
	const items = [
		{ id: 1, title: "Spielerliste", route: "spielerliste", icon: "people" },
		{ id: 2, title: "Termine", route: "termine", icon: "calendar_today" },
		{ id: 3, title: "Archiv", route: "archiv", icon: "book" },
		{ id: 4, title: "Blankos", route: "blankos", icon: "border_clear" },
		{ id: 5, title: "Einstellungen", route: "settings", icon: "settings" },
	];

	return (
		<Box>
			<Card>
				<CardContent>
					<List>
						{items.map((item) => (
							<ListItem key={item.id}>
								<ListItemButton component={Link} to={item.route}>
									<ListItemIcon>
										<Icon>{item.icon}</Icon>
									</ListItemIcon>
									<ListItemText primary={item.title} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
		</Box>
	);
};

export default RaidDashboard;
