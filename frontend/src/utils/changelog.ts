import { Changelog } from "@/models/Changelog";

export const changelogs: Changelog[] = [
	{
		version: "v2.3.0",
		release: "20.11.2021",
		features: [
			"Umstellung des Log Uploads auf dps.report",
			"Multi-Rollen System eingebaut",
			"Tooltips für die Klassen und Rollen Wahl eingebaut",
			"Das Dialog-Fenster beim hinzufügen eines neuen Builds überarbeitet"
		],
		subversions: [
			{
				version: "v2.3.1",
				release: "24.11.2021",
				features: [
					"Button zum Laden des jeweiligen Blankos für die Bosse bei der Aufstellung hinzugefügt",
					"Diverse Bugfixes"
				],
			},
			{
				version: "Multi-Rollen System",
				release: "",
				features: [
					"Es können bis zu 4 Rollen für ein Build hinzugefügt und ausgewählt werden",
					"Ermöglicht dadurch, Hybrid Builds (Power + Condi Builds) einzutragen",
					"Für die Aufstellungen können die Buttons zum Hinzufügen und Entfernen der extra Rollen visuell Ein- bzw. Ausgeschaltet werden."
				]
			},
			{
				version: "v2.3.2",
				release: "06.02.2022",
				features: [
					"Bugfixes."
				]
			}
		]
	},
	{
		version: "v2.2.0",
		release: "07.08.2021",
		features: [
			"Changelog eingebaut.",
			"Lieutenants als Rolle für Raid Gruppen hinzugefügt.",
			"Datum und Uhrzeit für die Termin Preview hinzugefügt.",
		],
		subversions: [
			{
				version: "Lieutenants",
				release: "",
				features: [
					'Lieutenants können über die neu angelegte Seite "Einstellungen" für die jeweilige Raid Gruppe eingesehen und ernannt werden.',
					"Es können maximal 2 Lieutenants pro Raid ernannt werden.",
					"Lieutenants können keine Spieler einladen, kicken oder weitere Lieutenants ernennen, haben aber ansonsten die gleichen Rechte wie Raid Leader.",
				],
			},
		],
	},
	{
		version: "v2.1.0",
		release: "03.07.2021",
		features: [
			"Theme wechsel eingaubt.",
			"Auswahl möglichkeiten zwischen dem Light-Theme, dem neuem Dark Theme (Standard) und dem altem, leicht angepassten Dark Theme.",
		],
	},
	{
		version: "v2.0.0",
		release: "31.08.2019",
		features: [
			"Open Beta!",
			"Update auf Vuetify 2.0 - UI-Änderungen",
			"CMs markieren",
			"Besser Navigation innerhalb von Raids",
			"Einteilung des Archivs in Seiten",
			"Fortlaufende Termine erstellen",
		],
		subversions: [
			{
				version: "v.2.0.5",
				release: "04.06.2021",
				features: [
					"Überarbeitung des Favoriten Systems",
					"Anstelle von einem Stern, nun bis zu 3 Sterne mit farblicher abstufung.",
					"Rollen vergabe von Raid-Rollen im Discord wird nun über RO+ geregelt.",
				],
			},
			{
				version: "v.2.0.4",
				release: "19.03.2021",
				features: ["Anlage von Extra Accounts über die Profil Seite ermöglicht"],
			},
			{
				version: "v2.0.3",
				release: "01.02.2020",
				features: ["Dialogbreiten im Firefox gefixt"],
			},
			{
				version: "v2.0.2",
				release: "20.01.2020",
				features: [
					"Extra-Rollen für Kite und Spezial-Einträge",
					"Menüleiste auf Mobilgeräten gefixt",
					"GCG als Spielereintrag hinzugefügt",
					"Raidleiter können alle Anmeldungen ändern",
				],
			},
			{
				version: "v2.0.1",
				release: "26.12.2019",
				features: [
					"Live-Aufstellungen",
					"Legendäre Trophäen aus Coffern werden mitgezählt",
					"Anmeldungen visuell überarbeitet",
				],
			},
		],
	},
	{
		version: "v1.2.0",
		release: "11.07.2019",
		features: ["Nutzerprofile", "Discord-Integration", "Übersicht über kommende Termine"],
		subversions: [
			{
				version: "v1.2.1",
				release: "26.07.2019",
				features: [
					"Homepage und Profile redesigned",
					"Erfolge sind jetzt im Profil",
					"Kleinere visuelle Verbesserungen",
					"Reports beinhalten jetzt ein Combat Replay",
				],
			},
		],
	},
	{
		version: "v1.1.0",
		release: "08.05.2019",
		features: [
			"Builds in Spielerliste nach Rollen filtern",
			"Erfolgs-Übersicht",
			"Raidleiter in Spielerliste zuerst anzeigen",
			"Kennzeichnen von fehlenden Anmeldungen in Liste",
			"Namen von einem Boss zum anderen kopieren",
			"Buff-Wings hervorheben",
			"Visual Overhaul der Aufstellungen",
		],
		subversions: [
			{
				version: "v1.1.1",
				release: "05.07.2019",
				features: ["Logs hochladen und anzeigen"],
			},
		],
	},
	{
		version: "v1.0.0",
		release: "26.02.2019",
		features: ["Spielerliste", "Termine / Archiv", "Blankos", "Meine Builds", "Weekly Progress", "LI / LD"],
		subversions: [],
	},
];

export default changelogs;
