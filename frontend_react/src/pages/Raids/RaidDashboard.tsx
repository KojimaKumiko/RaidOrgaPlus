import { Card, CardContent, Icon, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "react-router-dom";

const RaidDashboard = () => {
	const items = [
		{ id: 1, title: 'Spielerliste', route: '/spielerliste', icon: 'people' },
		{ id: 2, title: 'Termine', route: '/termine', icon: 'calendar_today'},
		{ id: 3, title: 'Archiv', route: '/archiv', icon: 'book' },
		{ id: 4, title: 'Blankos', route: '/blankos', icon: 'border_clear' },
		{ id: 5, title: 'Einstellungen', route: '/settings', icon: 'settings' },
	];

	return (
		<Box>
			<Card>
				<CardContent>
					<List>
						{items.map(i => (
							<ListItem>
								<ListItemButton component={Link} to={i.route}>
									<ListItemIcon>
										<Icon>{i.icon}</Icon>
									</ListItemIcon>
									<ListItemText primary={i.title} />
								</ListItemButton>
							</ListItem>
						))}
					</List>
				</CardContent>
			</Card>
		</Box>
	);
}

export default RaidDashboard;