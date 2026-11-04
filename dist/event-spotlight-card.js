/*
* Event Spotlight Card for Home Assistant
* Displays and customizes events from one or more Home Assistant calendars.
*
* License: MIT
*/

const CARD_VERSION = "1.1.5";

/* ---------------------------------------------------------------------- */
/*  Languages                                                             */
/* ---------------------------------------------------------------------- */
const TRANSLATIONS = {
	en: {
		meta: {
			name: "English",
		},
		card: {
			title: "Upcoming Events",
			loading: "Loading events…",
			empty: "No events to display",
			today: "Today",
			tomorrow: "Tomorrow",
			in_days: "In {n} days",
			all_day: "All day",
			error: "Unable to load events",
		},
		editor: {
			sections: {
				calendars: "Calendars",
				general: "General",
				appearance: "Appearance",
				rules: "Display rules",
			},
			calendars: {
				add: "Add a calendar",
				empty: "No calendar selected",
				remove: "Remove this calendar",
			},
			general: {
				card_title: "Card title",
				card_title_placeholder: "Upcoming Events",
				search_range: "Search range (days)",
				update_interval: "Refresh every (minutes)",
				all_day_hide_time: "Hide all-day events after",
				language: "Language",
			},
			appearance: {
				layout: "Display style",
				arrangement: "Event arrangement",
				show_header: "Show title",
				show_header_icon: "Show title icon",
				show_card_background: "Show card background",
				show_relative_date: "Show relative date",
				show_time: "Show time",
				show_description: "Show description",
				show_location: "Show location",
				show_calendar: "Show calendar name",
				mushroom_shape: "Use Mushroom style",
				invert_light_colors: "Invert colors in light theme",
			},
			rules: {
				add: "Add a rule",
				empty: "No rules defined",
				remove: "Remove this rule",
				fallback_name: "Rule {n}",
				group_rule: "Conditions",
				group_appearance: "Appearance",
				group_behavior: "Display",
				group_highlight: "Animation",
				rule_name: "Rule name",
				rule_name_placeholder: "Optional name",
				action: "Action",
				field: "Search in",
				match: "Condition",
				value: "Search text",
				value_placeholder: "Enter the text to search for",
				label: "Display name",
				label_placeholder: "Replace the event name",
				icon: "Icon",
				color: "Color",
				icon_background: "Show color behind the icon",
				card_background: "Show color in the background",
				next_match_only: "Only show the next matching event",
				blink: "Blink",
				pulse: "Pulse",
				start_before: "Before the event starts",
				minutes: "Minutes",
				hours: "Hours",
				all_day_blink: "For all-day events, blinking starts on the event day.",
				all_day_pulse: "For all-day events, pulsing starts on the event day.",
			},
			options: {
				auto: "Automatic",
				include: "Show",
				exclude: "Hide",
				summary: "Title",
				description: "Description",
				location: "Location",
				calendar: "Calendar",
				contains: "Contains",
				equals: "Matches exactly",
				starts_with: "Starts with",
				ends_with: "Ends with",
				regex: "Regular expression",
				left: "Left",
				center: "Centered",
				right: "Right",
				justified: "Justified",
				stretched: "Stretched",
				list: "List",
				two_columns: "2 columns",
				three_columns: "3 columns",
			},
		},
	},
	fr: {
		meta: {
			name: "Français",
		},
		card: {
			title: "Prochains événements",
			loading: "Chargement des événements…",
			empty: "Aucun événement à afficher",
			today: "Aujourd’hui",
			tomorrow: "Demain",
			in_days: "Dans {n} jours",
			all_day: "Toute la journée",
			error: "Impossible de charger les événements",
		},
		editor: {
			sections: {
				calendars: "Calendriers",
				general: "Général",
				appearance: "Apparence",
				rules: "Règles d’affichage",
			},
			calendars: {
				add: "Ajouter un calendrier",
				empty: "Aucun calendrier sélectionné",
				remove: "Supprimer ce calendrier",
			},
			general: {
				card_title: "Titre de la carte",
				card_title_placeholder: "Prochains événements",
				search_range: "Période de recherche (jours)",
				update_interval: "Actualiser toutes les (minutes)",
				all_day_hide_time: "Masquer les événements de la journée après",
				language: "Langue",
			},
			appearance: {
				layout: "Style d’affichage",
				arrangement: "Organisation des événements",
				show_header: "Afficher le titre",
				show_header_icon: "Afficher l’icône du titre",
				show_card_background: "Afficher le fond de la carte",
				show_relative_date: "Afficher la date relative",
				show_time: "Afficher l’heure",
				show_description: "Afficher la description",
				show_location: "Afficher le lieu",
				show_calendar: "Afficher le nom du calendrier",
				mushroom_shape: "Utiliser le style Mushroom",
				invert_light_colors: "Inverser les couleurs en thème clair",
			},
			rules: {
				add: "Ajouter une règle",
				empty: "Aucune règle définie",
				remove: "Supprimer cette règle",
				fallback_name: "Règle {n}",
				group_rule: "Conditions",
				group_appearance: "Apparence",
				group_behavior: "Affichage",
				group_highlight: "Animation",
				rule_name: "Nom de la règle",
				rule_name_placeholder: "Nom facultatif",
				action: "Action",
				field: "Rechercher dans",
				match: "Condition",
				value: "Texte recherché",
				value_placeholder: "Saisissez le texte à rechercher",
				label: "Nom affiché",
				label_placeholder: "Remplacer le nom de l’événement",
				icon: "Icône",
				color: "Couleur",
				icon_background: "Afficher la couleur derrière l’icône",
				card_background: "Afficher la couleur en arrière-plan",
				next_match_only: "Afficher uniquement le prochain événement",
				blink: "Faire clignoter",
				pulse: "Faire pulser",
				start_before: "Avant le début de l’événement",
				minutes: "Minutes",
				hours: "Heures",
				all_day_blink: "Pour un événement de la journée, le clignotement commence le jour de l’événement.",
				all_day_pulse: "Pour un événement de la journée, la pulsation commence le jour de l’événement.",
			},
			options: {
				auto: "Automatique",
				include: "Afficher",
				exclude: "Masquer",
				summary: "Titre",
				description: "Description",
				location: "Lieu",
				calendar: "Calendrier",
				contains: "Contient",
				equals: "Correspond exactement à",
				starts_with: "Commence par",
				ends_with: "Se termine par",
				regex: "Expression régulière",
				left: "À gauche",
				center: "Centré",
				right: "À droite",
				justified: "Justifié",
				stretched: "Étendu",
				list: "Liste",
				two_columns: "2 colonnes",
				three_columns: "3 colonnes",
			},
		},
	},
};

function resolveLanguage(hass, configuredLanguage = "auto") {
	if (configuredLanguage !== "auto" && TRANSLATIONS[configuredLanguage]) return configuredLanguage;
	const language = (hass?.locale?.language || hass?.language || "en").toLowerCase().split("-")[0];
	return TRANSLATIONS[language] ? language : "en";
}

function translate(language, path, replacements = {}) {
	const readPath = (source) => path.split(".").reduce((value, key) => value?.[key], source);
	let text = readPath(TRANSLATIONS[language]) ?? readPath(TRANSLATIONS.en) ?? path;
	Object.entries(replacements).forEach(([key, value]) => {
		text = String(text).replaceAll(`{${key}}`, String(value));
	});
	return String(text);
}

/* ---------------------------------------------------------------------- */
/*  Main card                                                             */
/* ---------------------------------------------------------------------- */
class EventSpotlightCard extends HTMLElement {
	static FIELD_DEFAULTS = {
		days: 30,
		update_interval: 60,
		all_day_hide_time: "23:59",
		layout: "mushroom",
		card_arrangement: "left",
		language: "auto",
		show_title: true,
		show_title_icon: true,
		show_card_background: true,
		ticker_mushroom_shape: false,
		ticker_invert_light_colors: false,
		show_calendar_source: false,
		show_relative_date: true,
		show_time: true,
		show_description: false,
		show_location: false,
		display_order: ["date_time", "description", "location", "calendar"],
	};

	static SECURITY_LIMITS = {
		days: { min: 1, max: 365 },
		max_rendered_events: 500,
		regex_pattern: 256,
		regex_source: 4096,
		title: 512,
		description: 8192,
		location: 1024,
		calendar: 512,
		rule_value: 4096,
	};

	static ICON_PREFIXES = ["mdi", "hacs", "advanced-camera-card"];
	static RULE_ACTIONS = ["include", "exclude"];
	static RULE_FIELDS = ["summary", "description", "location", "calendar"];
	static RULE_OPERATORS = ["contains", "equals", "starts_with", "ends_with", "regex"];

	static getConfigElement() {
		return document.createElement("event-spotlight-card-editor");
	}

	static getStubConfig(hass, entities, entitiesFallback) {
		const availableEntities = [
			...(entities || []),
			...(entitiesFallback || []),
		];

		const calendar = availableEntities.find((entityId) =>
			entityId.startsWith("calendar.")
		);

		return {
			calendars: calendar
				? [
						{
							entity: calendar,
						},
					]
				: [],
			days: 30,
		};
	}

	constructor() {
		super();
		this._events = [];
		this._loading = false;
		this._error = "";
		this._loadKey = "";
		this._pendingLoad = false;
		this._allDayTimer = null;
		this._updateTimer = null;
		this._tickerTimer = null;
		this._tickerIndex = 0;
		this._blinkTimer = null;
		this._activeTickerEvents = [];
	}

	connectedCallback() {
		if (!this._config || !this._hass) return;

		this._scheduleUpdate();

		const layout =
			this._config.layout || EventSpotlightCard.FIELD_DEFAULTS.layout;

		if (layout === "ticker") {
			this._startTicker();
		}
	}

	disconnectedCallback() {
		if (this._allDayTimer) clearTimeout(this._allDayTimer);
		if (this._updateTimer) clearTimeout(this._updateTimer);
		if (this._tickerTimer) clearInterval(this._tickerTimer);

		this._allDayTimer = null;
		this._updateTimer = null;
		this._tickerTimer = null;
		this._blinkTimer = null;
	}

	setConfig(config) {
		const previousLoadKey = this._config
			? this._dataLoadKey(this._config)
			: null;

		const calendars = this._normalizeCalendars(
			config.calendars || config.entities || [],
		);

		this._config = {
			...config,
			calendars,
		};

		const nextLoadKey = this._dataLoadKey(this._config);

		this._scheduleUpdate();

		if (!this._hass || !this.shadowRoot) {
			return;
		}

		if (previousLoadKey !== nextLoadKey) {
			this._requestEventsLoad();
			return;
		}

		this._render();
	}

	set hass(hass) {
		const initialHass = !this._hass;
		const previousDarkMode = Boolean(this._hass?.themes?.darkMode);
		const darkMode = Boolean(hass?.themes?.darkMode);
		const themeChanged =
			!initialHass && previousDarkMode !== darkMode;
		const previousLanguage = this._hass
			? resolveLanguage(this._hass, this._config?.language || "auto")
			: null;
		const currentLanguage = resolveLanguage(
			hass,
			this._config?.language || "auto",
		);
		const languageChanged =
			!initialHass && previousLanguage !== currentLanguage;

		this._hass = hass;

		if (!this.shadowRoot) {
			this.attachShadow({ mode: "open" });
		}

		if (!this._config) {
			return;
		}

		const loadKey = this._dataLoadKey();

		if (loadKey !== this._loadKey) {
			this._requestEventsLoad();
			return;
		}

		if (initialHass || themeChanged || languageChanged) {
			this._render();
		}
	}

	getCardSize() {
		if (!this.shadowRoot) {
			return 1;
		}

		const card = this.shadowRoot.querySelector("ha-card");
		const height = card?.getBoundingClientRect().height || 0;

		if (!height) {
			return 1;
		}

		return Math.max(1, Math.ceil(height / 50));
	}

	getGridOptions() {
		return {
			columns: 12,
			rows: "auto",
			min_columns: 3,
		};
	}

	_normalizeCalendars(items) {
		return (Array.isArray(items) ? items : [items])
			.map((item) => (typeof item === "string" ? { entity: item } : { ...item }))
			.filter((item) => item?.entity?.startsWith("calendar."));
	}

	_dataLoadKey(config = this._config) {
		const calendars = this._normalizeCalendars(
			config?.calendars || config?.entities || [],
		);

		const rules = (config?.rules || []).map((rule) => ({
			action: this._normalizeRuleAction(rule.action),
			field: this._normalizeRuleField(rule.field),
			operator: this._normalizeRuleOperator(rule.operator),
			value: rule.value,
		}));

		return JSON.stringify([
			calendars.map((calendar) => calendar.entity),
			config?.days ?? EventSpotlightCard.FIELD_DEFAULTS.days,
			rules,
		]);
	}

	_lang() {
		return resolveLanguage(
			this._hass,
			this._config?.language || "auto",
		);
	}

	_t(lang, key, n) {
		return translate(lang, `card.${key}`, { n: n ?? "" });
	}

	_escape(value = "") {
		return String(value)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");
	}

	_limitText(value, limit) {
		const text = String(value ?? "");
		return text.length > limit ? `${text.slice(0, limit)}…` : text;
	}

	_clampedNumber(value, fallback, min, max) {
		const number = Number(value);
		if (!Number.isFinite(number)) return fallback;
		return Math.min(max, Math.max(min, number));
	}

	_normalizeRuleAction(action) {
		return EventSpotlightCard.RULE_ACTIONS.includes(action) ? action : "include";
	}

	_normalizeRuleField(field) {
		return EventSpotlightCard.RULE_FIELDS.includes(field) ? field : "summary";
	}

	_normalizeRuleOperator(operator) {
		return EventSpotlightCard.RULE_OPERATORS.includes(operator)
			? operator
			: "contains";
	}

	_safeRegex(pattern) {
		const value = String(pattern ?? "");
		if (!value || value.length > EventSpotlightCard.SECURITY_LIMITS.regex_pattern) {
			return null;
		}
		const unsafePatterns = [
			/\([^)]*[+*][^)]*\)[+*{]/,
			/\.\*[+*{]/,
			/\.\+[+*{]/,
		];
		if (unsafePatterns.some((test) => test.test(value))) return null;
		try {
			return new RegExp(value, "iu");
		} catch {
			return null;
		}
	}

	_date(value) {
		if (/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
			const [y, m, d] = value.split("-").map(Number);
			return new Date(y, m - 1, d);
		}
		return new Date(value);
	}

	_ruleMatches(event, rule) {
		const value = this._limitText(
			rule?.value,
			EventSpotlightCard.SECURITY_LIMITS.rule_value,
		).trim();
		if (!value) return false;

		const field = this._normalizeRuleField(rule?.field);
		const operator = this._normalizeRuleOperator(rule?.operator);
		const normalize = (text) => String(text ?? "").trim().toLocaleLowerCase();
		const expected = normalize(value);
		let source;

		if (field === "calendar") {
			const calendarId = this._limitText(
				event.calendar,
				EventSpotlightCard.SECURITY_LIMITS.calendar,
			);
			const calendarName = this._limitText(
				event.calendar_name,
				EventSpotlightCard.SECURITY_LIMITS.calendar,
			);
			if (operator === "equals") {
				return normalize(calendarId) === expected || normalize(calendarName) === expected;
			}
			source = `${calendarId} ${calendarName}`.trim();
		} else {
			const limit = field === "description"
				? EventSpotlightCard.SECURITY_LIMITS.description
				: field === "location"
					? EventSpotlightCard.SECURITY_LIMITS.location
					: EventSpotlightCard.SECURITY_LIMITS.title;
			source = this._limitText(event[field], limit);
		}

		const searchableSource = source.slice(
			0,
			EventSpotlightCard.SECURITY_LIMITS.regex_source,
		);
		const normalizedSource = normalize(searchableSource);

		if (operator === "equals") return normalizedSource === expected;
		if (operator === "starts_with") return normalizedSource.startsWith(expected);
		if (operator === "ends_with") return normalizedSource.endsWith(expected);
		if (operator === "regex") {
			const regex = this._safeRegex(value);
			return regex ? regex.test(searchableSource) : false;
		}
		return normalizedSource.includes(expected);
	}

	_decorate(event, calendar) {
		const state = this._hass.states[calendar.entity];
		const calendarName =
			calendar.name || state?.attributes?.friendly_name || calendar.entity;

		const base = {
			...event,
			summary: this._limitText(
				event.summary,
				EventSpotlightCard.SECURITY_LIMITS.title,
			),
			description: this._limitText(
				event.description,
				EventSpotlightCard.SECURITY_LIMITS.description,
			),
			location: this._limitText(
				event.location,
				EventSpotlightCard.SECURITY_LIMITS.location,
			),
			calendar: this._limitText(
				calendar.entity,
				EventSpotlightCard.SECURITY_LIMITS.calendar,
			),
			calendar_name: this._limitText(
				calendarName,
				EventSpotlightCard.SECURITY_LIMITS.calendar,
			),
			start_date: this._date(event.start),
			default_icon: this._safeIcon(
				calendar.icon || state?.attributes?.icon,
			),
		};

		const rules = this._config.rules || [];
		const matchIndex = rules.findIndex(
			(rule) =>
				this._normalizeRuleAction(rule.action) === "include" &&
				Boolean(rule.value) &&
				this._ruleMatches(base, rule),
		);

		return {
			...base,
			primary_rule_index: matchIndex,
		};
	}

	_applyRuleAppearance(event) {
		const rule =
			event.primary_rule_index >= 0
				? this._config.rules?.[event.primary_rule_index]
				: null;

		return {
			...event,
			label:
				String(rule?.label || "").trim() ||
				event.summary ||
				event.calendar_name,
			icon: this._safeIcon(rule?.icon || event.default_icon),
			color: this._resolveUiColor(rule?.color),
			show_icon_background_color:
				rule?.show_icon_background_color !== false,
			show_background_color:
				rule?.show_background_color !== false,
			blink_background: rule?.blink_background === true,
			pulse_background: rule?.pulse_background === true,
			blink_start_minutes: this._clampedNumber(
				rule?.blink_start_minutes,
				30,
				1,
				1440,
			),
			pulse_start_minutes: this._clampedNumber(
				rule?.pulse_start_minutes,
				30,
				1,
				1440,
			),
			show_first_match_only:
				rule?.show_first_match_only === true,
		};
	}

	_filterFirstRuleMatches(events) {
		const matchedRules = new Set();

		return events.filter((event) => {
			if (
				!event.show_first_match_only ||
				event.primary_rule_index < 0
			) {
				return true;
			}

			if (matchedRules.has(event.primary_rule_index)) {
				return false;
			}

			matchedRules.add(event.primary_rule_index);
			return true;
		});
	}

	_safeIcon(icon, fallback = "mdi:calendar") {
		const value = String(icon ?? "").trim();
		const parts = value.split(":");
		if (parts.length !== 2) return fallback;
		const [prefix, name] = parts;
		if (!EventSpotlightCard.ICON_PREFIXES.includes(prefix.toLowerCase())) return fallback;
		if (!/^[a-z0-9_-]+$/i.test(name)) return fallback;
		return `${prefix.toLowerCase()}:${name}`;
	}

	_safeCustomColor(color) {
		const value = String(color || "").trim();
		if (!value || /[;{}<>"']/.test(value)) return "";
		if (/^#[0-9a-f]{3,4}([0-9a-f]{3,4})?$/i.test(value)) return value;
		if (typeof CSS !== "undefined" && CSS.supports?.("color", value)) return value;
		return "";
	}

	_resolveUiColor(color) {
		const rawValue = String(color || "primary").trim();
		const value = rawValue.toLowerCase();
		const themeColors = new Set([
			"primary", "accent", "red", "pink", "purple", "deep-purple",
			"indigo", "blue", "light-blue", "cyan", "teal", "green",
			"light-green", "lime", "yellow", "amber", "orange",
			"deep-orange", "brown", "light-grey", "grey", "dark-grey", "blue-grey",
		]);
		if (value === "primary") return "var(--primary-color)";
		if (value === "accent") return "var(--accent-color)";
		if (value === "light-grey") return "var(--light-grey-color, #bdbdbd)";
		if (value === "dark-grey") return "var(--dark-grey-color, #616161)";
		if (themeColors.has(value)) return `var(--${value}-color)`;
		return this._safeCustomColor(rawValue) || "var(--primary-color)";
	}

	_updateIntervalMinutes() {
		const value = Number(
			this._config?.update_interval ?? EventSpotlightCard.FIELD_DEFAULTS.update_interval,
		);
		return Number.isFinite(value) && value >= 1 && value <= 1440
			? value
			: EventSpotlightCard.FIELD_DEFAULTS.update_interval;
	}

	_scheduleUpdate() {
		if (this._updateTimer) clearTimeout(this._updateTimer);
		if (!this.isConnected || !this._config) return;
		this._updateTimer = setTimeout(() => {
			this._updateTimer = null;
			this._loadKey = "";
			this._requestEventsLoad();
			this._scheduleUpdate();
		}, this._updateIntervalMinutes() * 60 * 1000);
	}

	_allDayHideTime() {
		const value = String(this._config?.all_day_hide_time ?? EventSpotlightCard.FIELD_DEFAULTS.all_day_hide_time).trim();
		return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : EventSpotlightCard.FIELD_DEFAULTS.all_day_hide_time;
	}

	_isHighlightEffectActive(event, effect, now = new Date()) {
		const enabled = effect === "blink"
			? event.blink_background
			: event.pulse_background;
		if (!enabled) return false;

		const allDay = /^\d{4}-\d{2}-\d{2}$/.test(event.start || "");
		if (allDay) {
			return now.getFullYear() === event.start_date.getFullYear() &&
				now.getMonth() === event.start_date.getMonth() &&
				now.getDate() === event.start_date.getDate() &&
				this._isAllDayEventVisible(event, now);
		}

		const configuredMinutes = effect === "blink"
			? event.blink_start_minutes
			: event.pulse_start_minutes;
		const leadMinutes = this._clampedNumber(
			configuredMinutes,
			30,
			1,
			1440,
		);
		return now.getTime() >= event.start_date.getTime() - leadMinutes * 60000;
	}

	_highlightClasses(event, now = new Date()) {
		return [
			this._isHighlightEffectActive(event, "blink", now) ? "event-blink" : "",
			this._isHighlightEffectActive(event, "pulse", now) ? "event-pulse" : "",
		].filter(Boolean).join(" ");
	}

	_scheduleBlinkRefresh(events, now = new Date()) {
		if (this._blinkTimer) clearTimeout(this._blinkTimer);
		this._blinkTimer = null;

		const nextStarts = [];
		events.forEach((event) => {
			const allDay = /^\d{4}-\d{2}-\d{2}$/.test(event.start || "");
			if (allDay) {
				if (
					(event.blink_background || event.pulse_background) &&
					!this._isHighlightEffectActive(event, "blink", now) &&
					!this._isHighlightEffectActive(event, "pulse", now)
				) {
					const startOfDay = new Date(
						event.start_date.getFullYear(),
						event.start_date.getMonth(),
						event.start_date.getDate(),
					).getTime();
					if (startOfDay > now.getTime()) nextStarts.push(startOfDay);
				}
				return;
			}

			[
				["blink", event.blink_background, event.blink_start_minutes],
				["pulse", event.pulse_background, event.pulse_start_minutes],
			].forEach(([effect, enabled, configuredMinutes]) => {
				if (!enabled || this._isHighlightEffectActive(event, effect, now)) return;
				const leadMinutes = this._clampedNumber(
					configuredMinutes,
					30,
					1,
					1440,
				);
				const startAt = event.start_date.getTime() - leadMinutes * 60000;
				if (startAt > now.getTime()) nextStarts.push(startAt);
			});
		});

		nextStarts.sort((a, b) => a - b);
		if (!nextStarts.length) return;

		this._blinkTimer = setTimeout(() => {
			this._blinkTimer = null;
			this._render();
		}, Math.min(nextStarts[0] - now.getTime() + 250, 2147483647));
	}

	_isAllDayEventVisible(event, now = new Date()) {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(event.start || "")) return true;
		const [hour, minute] = this._allDayHideTime().split(":").map(Number);
		const hideAt = new Date(event.start_date.getFullYear(), event.start_date.getMonth(), event.start_date.getDate(), hour, minute, 0, 0);
		return now < hideAt;
	}

	_isEventVisible(event, now = new Date()) {
		const allDay = /^\d{4}-\d{2}-\d{2}$/.test(event.start || "");
		if (allDay) return this._isAllDayEventVisible(event, now);
		return now < event.start_date;
	}

	_scheduleVisibilityRefresh(events, now = new Date()) {
		if (this._allDayTimer) clearTimeout(this._allDayTimer);
		this._allDayTimer = null;

		const refreshTimes = [];
		const [hour, minute] = this._allDayHideTime().split(":").map(Number);

		events.forEach((event) => {
			const allDay = /^\d{4}-\d{2}-\d{2}$/.test(event.start || "");
			if (allDay) {
				const hideAt = new Date(
					event.start_date.getFullYear(),
					event.start_date.getMonth(),
					event.start_date.getDate(),
					hour,
					minute,
					0,
					0,
				).getTime();
				if (hideAt > now.getTime()) refreshTimes.push(hideAt);
				return;
			}

			const startAt = event.start_date.getTime();
			if (startAt > now.getTime()) refreshTimes.push(startAt);
		});

		refreshTimes.sort((a, b) => a - b);
		if (!refreshTimes.length) return;

		this._allDayTimer = setTimeout(() => {
			this._allDayTimer = null;
			this._render();
		}, Math.min(refreshTimes[0] - now.getTime() + 250, 2147483647));
	}

	_passes(event) {
		const rules = this._config.rules || [];

		const excluded = rules.some(
			(rule) =>
				this._normalizeRuleAction(rule.action) === "exclude" &&
				Boolean(rule.value) &&
				this._ruleMatches(event, rule),
		);
		if (excluded) return false;

		return rules.some(
			(rule) =>
				this._normalizeRuleAction(rule.action) === "include" &&
				Boolean(rule.value) &&
				this._ruleMatches(event, rule),
		);
	}

	_requestEventsLoad() {
		if (!this._hass || !this._config) {
			return;
		}

		const requestedLoadKey = this._dataLoadKey();

		if (requestedLoadKey === this._loadKey) {
			this._render();
			return;
		}

		if (this._loading) {
			this._pendingLoad = true;
			return;
		}

		this._loadEvents(requestedLoadKey);
	}

	async _loadEvents(requestedLoadKey = this._dataLoadKey()) {
		if (!this._hass || !this._config) {
			return;
		}

		if (this._loading) {
			this._pendingLoad = true;
			return;
		}

		const calendars = this._config.calendars || [];
		const requestedCalendars = calendars.map((calendar) => ({
			...calendar,
		}));

		const requestedDays = this._clampedNumber(
			this._config.days,
			EventSpotlightCard.FIELD_DEFAULTS.days,
			EventSpotlightCard.SECURITY_LIMITS.days.min,
			EventSpotlightCard.SECURITY_LIMITS.days.max,
		);
		if (!calendars.length) {
			this._events = [];
			this._loadKey = requestedLoadKey;
			this._render();
			return;
		}
		this._pendingLoad = false;
		this._loading = true;
		this._error = "";
		this._render();

		const start = new Date();
		const end = new Date(
			start.getTime() + requestedDays * 86400000,
		);
		try {
			const result = await this._hass.connection.sendMessagePromise({
				type: "execute_script",
				sequence: [
					{
						action: "calendar.get_events",
						target: { entity_id: requestedCalendars.map((calendar) => calendar.entity) },
						data: {
							start_date_time: start.toISOString(),
							end_date_time: end.toISOString(),
						},
						response_variable: "calendar_events",
					},
					{
						stop: "done",
						response_variable: "calendar_events",
					},
				],
			});
			const response = result?.response || result || {};
			const responses = requestedCalendars.map((calendar) => {
				const events = response?.[calendar.entity]?.events || [];
				return events.map((event) => this._decorate(event, calendar));
			});
			const sortedEvents = responses
				.flat()
				.filter((event) => this._passes(event))
				.sort((a, b) => a.start_date - b.start_date);
			this._events = sortedEvents.slice(
				0,
				EventSpotlightCard.SECURITY_LIMITS
					.max_rendered_events,
			);
			this._loadKey = requestedLoadKey;
		} catch (error) {
			console.error(
				"Event Spotlight Card: failed to load spotlight events",
				error?.message || "Unknown error",
			);
			this._error = error?.message || "error";
		} finally {
			this._loading = false;
			this._render();
			this._scheduleUpdate();

			const currentLoadKey = this._dataLoadKey();

			if (
				this._pendingLoad ||
				currentLoadKey !== this._loadKey
			) {
				this._pendingLoad = false;
				queueMicrotask(() => {
					this._requestEventsLoad();
				});
			}
		}
	}

	_relativeDateLabel(event, lang) {
		const d = event.start_date;
		const now = new Date();
		const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
		const target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		const diff = Math.round((target - today) / 86400000);
		if (diff === 0) return this._t(lang, "today");
		if (diff === 1) return this._t(lang, "tomorrow");
		if (diff > 1) return this._t(lang, "in_days", diff);
		return new Intl.DateTimeFormat(lang, { weekday: "short", day: "numeric", month: "short" }).format(d);
	}

	_dateLabel(event, lang) {
		const d = event.start_date,
			now = new Date(),
			today = new Date(now.getFullYear(), now.getMonth(), now.getDate()),
			target = new Date(d.getFullYear(), d.getMonth(), d.getDate());
		const diff = Math.round((target - today) / 86400000);
		let label =
			diff === 0
				? this._t(lang, "today")
				: diff === 1
					? this._t(lang, "tomorrow")
					: diff > 1
						? this._t(lang, "in_days", diff)
						: new Intl.DateTimeFormat(lang, {
								weekday: "short",
								day: "numeric",
								month: "short",
							}).format(d);
		const showRelativeDate =
			this._config.show_relative_date ??
			EventSpotlightCard.FIELD_DEFAULTS.show_relative_date;
		if (!showRelativeDate)
			label = new Intl.DateTimeFormat(lang, {
				weekday: "short",
				day: "numeric",
				month: "short",
			}).format(d);
		const showTime =
			this._config.show_time ?? EventSpotlightCard.FIELD_DEFAULTS.show_time;
		if (
			showTime &&
			!/^\d{4}-\d{2}-\d{2}$/.test(event.start || "")
		)
			label += ` · ${new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(d)}`;
		return label;
	}

	_displayOrder() {
		const defaults = EventSpotlightCard.FIELD_DEFAULTS.display_order;
		const configured = Array.isArray(this._config.display_order) ? this._config.display_order : [];
		return [...configured.filter((key) => defaults.includes(key)), ...defaults.filter((key) => !configured.includes(key))];
	}

	_tickerEvents(events) {
		return events;
	}

	_updateTickerDate(event) {
		const day = this.shadowRoot?.querySelector(".ticker-day");
		const month = this.shadowRoot?.querySelector(".ticker-month");
		if (!event || !day || !month) return;
		const lang = this._lang();
		day.textContent = new Intl.DateTimeFormat(lang, { day: "2-digit" })
			.format(event.start_date);
		month.textContent = new Intl.DateTimeFormat(lang, { month: "short" })
			.format(event.start_date)
			.replace(/\.$/, "");
	}

	_stopTicker() {
		if (this._tickerTimer) clearInterval(this._tickerTimer);
		this._tickerTimer = null;
		this._tickerIndex = 0;
		this._activeTickerEvents = [];
	}

	_startTicker() {
		this._stopTicker();
		const track = this.shadowRoot?.querySelector(".ticker-track");
		const rows = [...(track?.querySelectorAll(".ticker-event") || [])];
		if (!track || rows.length <= 2) return;
		this._tickerTimer = setInterval(() => {
			const maxIndex = rows.length - 2;
			this._tickerIndex = this._tickerIndex >= maxIndex ? 0 : this._tickerIndex + 1;
			track.style.transform = `translateY(-${this._tickerIndex * 26}px)`;
			this._updateTickerDate(this._activeTickerEvents[this._tickerIndex]);
		}, 3000);
	}

	_applyDynamicStyles(events, layout) {
		if (!this.shadowRoot || !events.length) return;
		const applyBlinkColor = (element, event) => {
			if (element && event) element.style.setProperty("--event-blink-color", event.color);
		};

		if (layout === "ticker") {
			const tickerEvents = this._tickerEvents(events);
			this.shadowRoot.querySelectorAll(".ticker-event").forEach((row, index) => {
				const event = tickerEvents[index];
				if (!event) return;
				applyBlinkColor(row, event);
				row.style.setProperty(
					"--ticker-dot-color",
					event.show_icon_background_color ? event.color : "#0288d1",
				);
				row.style.setProperty(
					"--ticker-event-background",
					event.show_background_color
						? `color-mix(in srgb, ${event.color} 9%, transparent)`
						: "transparent",
				);
			});
			return;
		}
		if (layout === "bubble") {
			const rows = [...this.shadowRoot.querySelectorAll(".bubble-event-line")];
			rows.forEach((row, index) => {
				const event = events[index];
				if (!event) return;
				applyBlinkColor(row, event);
				row.style.setProperty(
					"--bubble-dot-color",
					event.show_icon_background_color ? event.color : "var(--primary-color)",
				);
				row.style.setProperty(
					"--bubble-row-background",
					event.show_background_color
						? `color-mix(in srgb, ${event.color} 9%, var(--ha-card-background, var(--card-background-color)))`
						: "transparent",
				);
			});
			return;
		}

		const selector = layout === "pro" ? ".pro-event" : ".events > .event";
		const cards = [...this.shadowRoot.querySelectorAll(selector)];
		cards.forEach((card, index) => {
			const event = events[index];
			if (!event) return;
			applyBlinkColor(card, event);
			card.style.setProperty("--event-color", event.color);
			card.style.setProperty(
				"--event-background-mix",
				event.show_background_color ? "9%" : "0%",
			);
			if (layout !== "pro") {
				card.style.setProperty(
					"--event-background-base",
					"var(--ha-card-background, var(--card-background-color))",
				);
				card.style.setProperty(
					"--event-border-color",
					event.show_background_color ? event.color : "var(--divider-color)",
				);
			}
		});
	}

	_render() {
		if (!this.shadowRoot || !this._config || !this._hass) {
			return;
		}

		const lang = this._lang();
		const configuredLayout = this._config.layout || EventSpotlightCard.FIELD_DEFAULTS.layout;
		const layout = ["bubble", "chips", "mushroom", "pro", "square", "ticker"].includes(configuredLayout)
			? configuredLayout
			: EventSpotlightCard.FIELD_DEFAULTS.layout;
		const configuredArrangement = this._config.card_arrangement || EventSpotlightCard.FIELD_DEFAULTS.card_arrangement;
		const supportsCardArrangement = ["chips", "mushroom"].includes(layout);
		const cardArrangement = supportsCardArrangement && ["left", "center", "right", "justified", "stretched", "list", "2-columns", "3-columns"].includes(configuredArrangement)
			? configuredArrangement
			: EventSpotlightCard.FIELD_DEFAULTS.card_arrangement;
		const darkMode = Boolean(this._hass?.themes?.darkMode);
		const now = new Date();
		const visibleEvents =
			this._filterFirstRuleMatches(
				this._events
					.map((event) =>
						this._applyRuleAppearance(event),
					)
					.filter((event) =>
						this._isEventVisible(event, now),
					),
			);
		this._scheduleVisibilityRefresh(visibleEvents, now);
		this._scheduleBlinkRefresh(visibleEvents, now);

		let contentBlock = "";

		if (this._loading && !visibleEvents.length) {
			contentBlock = `
				<div class="state">
					<ha-circular-progress active></ha-circular-progress>
					${this._t(lang, "loading")}
				</div>`;
		} else if (this._error) {
			contentBlock = `
				<div class="state error">
					<ha-icon icon="mdi:alert-circle-outline"></ha-icon>
					${this._t(lang, "error")}
				</div>`;
		} else if (!visibleEvents.length) {
			contentBlock = `
				<div class="state">
					<ha-icon icon="mdi:calendar-blank-outline"></ha-icon>
					${this._t(lang, "empty")}
				</div>`;
		} else {
			let eventBlocks = "";
			if (layout === "ticker") {
				const tickerEvents = this._tickerEvents(visibleEvents);
				this._activeTickerEvents = tickerEvents;
				const firstEvent = tickerEvents[0];
				const day = new Intl.DateTimeFormat(lang, { day: "2-digit" })
					.format(firstEvent.start_date);
				const month = new Intl.DateTimeFormat(lang, { month: "short" })
					.format(firstEvent.start_date)
					.replace(/\.$/, "");
				const showRelativeDate = this._config.show_relative_date ?? EventSpotlightCard.FIELD_DEFAULTS.show_relative_date;
				const showTime = this._config.show_time ?? EventSpotlightCard.FIELD_DEFAULTS.show_time;
				const showDescription = this._config.show_description ?? EventSpotlightCard.FIELD_DEFAULTS.show_description;
				const showLocation = this._config.show_location ?? EventSpotlightCard.FIELD_DEFAULTS.show_location;
				const showCalendarSource = this._config.show_calendar_source ?? EventSpotlightCard.FIELD_DEFAULTS.show_calendar_source;
				const rows = tickerEvents.map((event) => {
					const dateTime = [];
					dateTime.push(
						showRelativeDate
							? this._relativeDateLabel(event, lang)
							: new Intl.DateTimeFormat(lang, {
								weekday: "short",
								day: "numeric",
								month: "short",
							}).format(event.start_date),
					);
					if (showTime && !/^\d{4}-\d{2}-\d{2}$/.test(event.start || "")) {
						dateTime.push(new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(event.start_date));
					}
					const middleDetails = {
						description: showDescription ? event.description : "",
						location: showLocation ? event.location : "",
						calendar: showCalendarSource ? event.calendar_name : "",
					};
					const detailItems = this._displayOrder()
						.filter((key) => key !== "date_time")
						.map((key) => middleDetails[key])
						.filter(Boolean)
						.map((value) => `<span class="ticker-detail">${this._escape(value)}</span>`)
						.join("");
					const dateMeta = dateTime.length
						? `<span class="ticker-meta">${this._escape(dateTime.join(" · "))}</span>`
						: "";
					return `<div class="ticker-event${this._highlightClasses(event) ? ` ${this._highlightClasses(event)}` : ""}"><span class="ticker-dot"></span><span class="ticker-title">${this._escape(event.label)}</span>${detailItems ? `<span class="ticker-details">${detailItems}</span>` : ""}${dateMeta}</div>`;
				}).join("");
				const tickerClasses = [
					"ticker-card",
					this._config.ticker_mushroom_shape ? "ticker-mushroom-shape" : "",
					this._config.ticker_invert_light_colors ? "ticker-invert-light-colors" : "",
				].filter(Boolean).join(" ");
				eventBlocks = `<div class="${tickerClasses}"><div class="ticker-date"><span class="ticker-day">${this._escape(day)}</span><span class="ticker-month">${this._escape(month)}</span></div><div class="ticker-viewport"><div class="ticker-track">${rows}</div></div></div>`;
			} else if (layout === "bubble") {
				const groups = new Map();
				visibleEvents.forEach((event) => {
					const d = event.start_date;
					const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
					if (!groups.has(key)) groups.set(key, []);
					groups.get(key).push(event);
				});
				eventBlocks = [...groups.values()].map((dayEvents) => {
					const first = dayEvents[0];
					const bubbleDay = new Intl.DateTimeFormat(lang, { day: "2-digit" }).format(first.start_date);
					const bubbleMonth = new Intl.DateTimeFormat(lang, { month: "short" }).format(first.start_date).replace(/\.$/, "");
					const rows = dayEvents.map((event) => {
						const showTime = this._config.show_time ?? EventSpotlightCard.FIELD_DEFAULTS.show_time;
						const showRelativeDate = this._config.show_relative_date ?? EventSpotlightCard.FIELD_DEFAULTS.show_relative_date;
						const isAllDay = /^\d{4}-\d{2}-\d{2}$/.test(event.start || "");
						let bubbleTime = "";
						if (showTime) {
							bubbleTime = this._t(lang, "all_day");
							if (!isAllDay) {
								const startTime = new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(event.start_date);
								const endDate = event.end ? this._date(event.end) : null;
								const endTime = endDate && !Number.isNaN(endDate.getTime()) ? new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(endDate) : "";
								bubbleTime = endTime ? `${startTime} – ${endTime}` : startTime;
							}
						}
						const relativeDate = showRelativeDate ? this._relativeDateLabel(event, lang) : "";
						const dotColor = event.show_icon_background_color ? event.color : "var(--primary-color)";
						const rowBackground = event.show_background_color
							? `color-mix(in srgb, ${event.color} 9%, var(--ha-card-background, var(--card-background-color)))`
							: "transparent";
						const extraBlocks = {
							description: (this._config.show_description ?? EventSpotlightCard.FIELD_DEFAULTS.show_description) && event.description
								? `<div class="event-detail">${this._escape(event.description)}</div>` : "",
							location: (this._config.show_location ?? EventSpotlightCard.FIELD_DEFAULTS.show_location) && event.location
								? `<div class="event-detail">${this._escape(event.location)}</div>` : "",
							calendar: (this._config.show_calendar_source ?? EventSpotlightCard.FIELD_DEFAULTS.show_calendar_source)
								? `<div class="event-detail">${this._escape(event.calendar_name)}</div>` : "",
						};
						const extras = this._displayOrder()
							.filter((key) => key !== "date_time")
							.map((key) => extraBlocks[key] || "")
							.join("");
						return `<div class="bubble-event-line${this._highlightClasses(event) ? ` ${this._highlightClasses(event)}` : ""}">
							<div class="bubble-main"><span class="bubble-dot"></span>${bubbleTime ? `<span class="bubble-time">${this._escape(bubbleTime)}</span>` : ""}<span class="event-title bubble-title">${this._escape(event.label)}${relativeDate ? ` <span class="bubble-relative">(${this._escape(relativeDate)})</span>` : ""}</span></div>
							${extras ? `<div class="bubble-extra">${extras}</div>` : ""}
						</div>`;
					}).join("");
					return `<div class="bubble-day-card"><div class="bubble-date"><div class="bubble-day-number">${this._escape(bubbleDay)}</div><div class="bubble-month">${this._escape(bubbleMonth)}</div></div><div class="bubble-body">${rows}</div></div>`;
				}).join("");
			} else if (layout === "pro") {
				const groups = new Map();
				visibleEvents.forEach((event) => {
					const date = event.start_date;
					const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
					if (!groups.has(key)) groups.set(key, []);
					groups.get(key).push(event);
				});

				eventBlocks = [...groups.values()].map((dayEvents) => {
					const first = dayEvents[0];
					const dayName = new Intl.DateTimeFormat(lang, { weekday: "short" }).format(first.start_date);
					const dayNumber = new Intl.DateTimeFormat(lang, { day: "2-digit" }).format(first.start_date);

					const rows = dayEvents.map((event) => {
						const showRelativeDate = this._config.show_relative_date ?? EventSpotlightCard.FIELD_DEFAULTS.show_relative_date;
						const showTime = this._config.show_time ?? EventSpotlightCard.FIELD_DEFAULTS.show_time;
						const showDescription = this._config.show_description ?? EventSpotlightCard.FIELD_DEFAULTS.show_description;
						const showLocation = this._config.show_location ?? EventSpotlightCard.FIELD_DEFAULTS.show_location;
						const showCalendarSource = this._config.show_calendar_source ?? EventSpotlightCard.FIELD_DEFAULTS.show_calendar_source;
						let dateTime = showRelativeDate ? this._relativeDateLabel(event, lang) : "";
						if (showTime) {
							const isAllDay = /^\d{4}-\d{2}-\d{2}$/.test(event.start || "");
							let timeLabel = this._t(lang, "all_day");
							if (!isAllDay) {
								const startTime = new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(event.start_date);
								const endDate = event.end ? this._date(event.end) : null;
								const endTime = endDate && !Number.isNaN(endDate.getTime())
									? new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(endDate)
									: "";
								timeLabel = endTime ? `${startTime} – ${endTime}` : startTime;
							}
							dateTime += `${dateTime ? " · " : ""}${timeLabel}`;
						}

						const details = {
							date_time: dateTime ? `<div class="pro-detail"><ha-icon icon="mdi:clock-outline"></ha-icon><span>${this._escape(dateTime)}</span></div>` : "",
							description: showDescription && event.description ? `<div class="pro-detail"><ha-icon icon="mdi:text-box-outline"></ha-icon><span>${this._escape(event.description)}</span></div>` : "",
							location: showLocation && event.location ? `<div class="pro-detail"><ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${this._escape(event.location)}</span></div>` : "",
							calendar: showCalendarSource ? `<div class="pro-detail"><ha-icon icon="mdi:calendar-outline"></ha-icon><span>${this._escape(event.calendar_name)}</span></div>` : "",
						};
						const orderedDetails = this._displayOrder().map((key) => details[key] || "").join("");
						const eventClasses = [
							"pro-event",
							...this._highlightClasses(event).split(" ").filter(Boolean),
							event.show_icon_background_color ? "" : "no-icon-background-color",
							event.show_background_color ? "" : "no-card-background-color",
						].filter(Boolean).join(" ");
						const backgroundMix = event.show_background_color ? "9%" : "0%";

						return `<div class="${eventClasses}">
							<div class="event-title pro-title"><span class="pro-icon"><ha-icon icon="${this._escape(event.icon)}"></ha-icon></span>${this._escape(event.label)}</div>
							<div class="pro-details">${orderedDetails}</div>
						</div>`;
					}).join("");

					return `<div class="pro-day-group">
						<div class="pro-date"><div class="pro-day">${this._escape(dayName)}</div><div class="pro-day-number">${this._escape(dayNumber)}</div></div>
						<div class="pro-accent"></div>
						<div class="pro-events">${rows}</div>
					</div>`;
				}).join("");
			} else {
				eventBlocks = visibleEvents
				.map((event) => {
					const detailBlocks = {
						date_time: `<div class="event-date">${this._escape(this._dateLabel(event, lang))}</div>`,
						description: (this._config.show_description ?? EventSpotlightCard.FIELD_DEFAULTS.show_description) && event.description
							? `<div class="event-detail">${this._escape(event.description)}</div>` : "",
						location: (this._config.show_location ?? EventSpotlightCard.FIELD_DEFAULTS.show_location) && event.location
							? `<div class="event-detail">${this._escape(event.location)}</div>` : "",
						calendar: (this._config.show_calendar_source ?? EventSpotlightCard.FIELD_DEFAULTS.show_calendar_source)
							? `<div class="event-detail">${this._escape(event.calendar_name)}</div>` : "",
					};
					const orderedDetails = this._displayOrder().map((key) => detailBlocks[key] || "").join("");

					const eventClasses = [
						"event",
						...this._highlightClasses(event).split(" ").filter(Boolean),
						event.show_icon_background_color ? "" : "no-icon-background-color",
						event.show_background_color ? "" : "no-card-background-color",
					].filter(Boolean).join(" ");
					const backgroundMix = event.show_background_color ? "9%" : "0%";
					const backgroundBase =
						"var(--ha-card-background, var(--card-background-color))";
					const borderColor = event.show_background_color
						? this._escape(event.color)
						: "var(--divider-color)";

					return `
						<div class="${eventClasses}">
							<div class="event-icon">
								<ha-icon icon="${this._escape(event.icon)}"></ha-icon>
							</div>
							<div class="event-text">
								<div class="event-title">${this._escape(event.label)}</div>
								${orderedDetails}
							</div>
						</div>`;
				})
				.join("");

			}
			contentBlock = `
				<div class="events ${layout} arrange-${cardArrangement}">
					${eventBlocks}
				</div>`;
		}

		const title = this._escape(
			this._config.name || this._t(lang, "title"),
		);
		const showTitle = this._config.show_title ?? EventSpotlightCard.FIELD_DEFAULTS.show_title;
		const showTitleIcon = this._config.show_title_icon ?? EventSpotlightCard.FIELD_DEFAULTS.show_title_icon;
		const showCardBackground = this._config.show_card_background ?? EventSpotlightCard.FIELD_DEFAULTS.show_card_background;
		const headerBlock = showTitle
			? `<div class="header">${showTitleIcon ? `<div class="h-icon"><ha-icon icon="mdi:calendar-star"></ha-icon></div>` : ""}<div class="title">${title}</div></div>`
			: "";

		this.shadowRoot.innerHTML = `
			<style>
				${this._baseStyles()}
			</style>
			<ha-card class="${showCardBackground ? "" : "no-card-background"}">
				<div class="card-content${darkMode ? " dark-mode" : ""}">
					${headerBlock}
					${contentBlock}
				</div>
			</ha-card>`;

		this._applyDynamicStyles(visibleEvents, layout);
		if (layout === "ticker") this._startTicker();
		else this._stopTicker();
	}

	_baseStyles() {
		return `
			/* ------------------------------------------------------------------ */
			/* Card shell and header                                              */
			/* ------------------------------------------------------------------ */
			:host {
				display: block;
				width: 100%;
			}
			ha-card {
				box-sizing: border-box;
				width: 100%;
				padding: 0;
				overflow: hidden;
			}
			ha-card.no-card-background {
				background: transparent;
				border-color: transparent;
				box-shadow: none;
			}
			.card-content {
				padding: 16px;
			}
			ha-card.no-card-background .card-content {
				padding: 0;
			}
			.header {
				display: flex;
				align-items: center;
				gap: 10px;
				margin-bottom: 16px;
			}
			.h-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 44px;
				height: 44px;
				flex-shrink: 0;
				border: 1px solid var(--divider-color);
				border-radius: 14px;
				background: #f4f6f8;
				box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
			}
			.card-content.dark-mode .h-icon {
				background: var(--secondary-background-color);
				box-shadow:
					0 2px 8px rgba(0, 0, 0, 0.5),
					0 0 0 1px rgba(255, 255, 255, 0.06);
			}
			.h-icon ha-icon {
				--mdc-icon-size: 24px;
				color: #0288d1;
			}
			.title {
				font-size: 1.2em;
				font-weight: 600;
				color: var(--primary-text-color);
			}

			/* ------------------------------------------------------------------ */
			/* Bubble layout                                                      */
			/* ------------------------------------------------------------------ */
			.events.bubble {
				display: grid;
				grid-template-columns: minmax(0, 1fr);
				width: 100%;
				gap: 8px;
			}
			.bubble-day-card {
				display: grid;
				grid-template-columns: 48px minmax(0, 1fr);
				align-items: start;
				width: 100%;
				gap: 10px;
			}
			.bubble-date {
				display: grid;
				justify-items: center;
				align-content: start;
				padding-top: 5px;
				line-height: 1;
			}
			.bubble-day-number {
				font-size: 1.45em;
				font-weight: 700;
				color: var(--primary-text-color);
			}
			.bubble-month {
				margin-top: 1px;
				font-size: 0.72em;
				font-weight: 400;
				text-transform: capitalize;
				color: var(--secondary-text-color);
			}
			.bubble-body {
				display: grid;
				min-width: 0;
				gap: 2px;
			}
			.bubble-event-line {
				box-sizing: border-box;
				width: 100%;
				padding: 5px 7px;
				border-radius: 7px;
				background: var(--bubble-row-background, transparent);
			}
			.bubble-main {
				display: flex;
				align-items: center;
				min-width: 0;
				gap: 7px;
			}
			.bubble-dot {
				width: 12px;
				height: 12px;
				flex: 0 0 12px;
				border-radius: 50%;
				background: var(--bubble-dot-color, var(--primary-color));
			}
			.bubble-time {
				flex: 0 0 auto;
				font-size: 14px;
				font-weight: 500;
				color: var(--secondary-text-color);
			}
			.bubble-title {
				overflow: hidden;
				min-width: 0;
				font-size: 14px;
				font-weight: 600;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: var(--primary-text-color);
			}
			.bubble-relative {
				font-size: 14px;
				font-weight: 500;
				color: var(--secondary-text-color);
			}
			.bubble-extra {
				display: grid;
				gap: 1px;
				margin-left: 19px;
			}
			.bubble-extra .event-detail {
				font-size: 12px;
				font-weight: 400;
				color: var(--secondary-text-color);
			}

			/* ------------------------------------------------------------------ */
			/* Chips layout                                                       */
			/* ------------------------------------------------------------------ */
			.events.chips {
				display: flex;
				flex-wrap: wrap;
				gap: 6px;
			}
			.chips .event {
				display: flex;
				align-items: center;
				gap: 7px;
				width: auto;
				min-width: 0;
				padding: 4px 10px 4px 6px;
				border: 1px solid var(--divider-color);
				border-radius: 999px;
				background: color-mix(
					in srgb,
					var(--event-color) var(--event-background-mix, 9%),
					var(--event-background-base, var(--ha-card-background, var(--card-background-color)))
				);
			}
			.chips .event-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 28px;
				height: 28px;
				flex-shrink: 0;
				border-radius: 50%;
				color: var(--event-color);
				background: color-mix(in srgb, var(--event-color) 18%, transparent);
			}
			.chips .event.no-icon-background-color .event-icon {
				background: transparent;
			}
			.chips .event-icon ha-icon {
				--mdc-icon-size: 18px;
			}
			.chips .event-text {
				display: grid;
				gap: 0;
				min-width: 0;
				line-height: 1.05;
			}
			.chips .event-title {
				overflow: hidden;
				font-size: 14px;
				font-weight: 500;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: var(--primary-text-color);
			}
			.chips .event-date,
			.chips .event-detail {
				font-size: 12px;
				line-height: 1.1;
				color: var(--secondary-text-color);
			}
			.chips .event-date {
				font-weight: 500;
			}

			/* ------------------------------------------------------------------ */
			/* Mushroom layout                                                    */
			/* ------------------------------------------------------------------ */
			.events.mushroom {
				display: flex;
				flex-wrap: wrap;
				align-items: flex-start;
				align-content: flex-start;
				gap: 8px;
			}
			.mushroom .event {
				display: flex;
				box-sizing: border-box;
				align-items: center;
				align-self: flex-start;
				flex: 0 1 auto;
				gap: 8px;
				width: auto;
				max-width: 100%;
				min-width: 0;
				min-height: 54px;
				height: auto;
				padding: 6px 8px;
				border: 1px solid var(--divider-color);
				border-radius: var(--ha-card-border-radius, 12px);
				background: color-mix(
					in srgb,
					var(--event-color) var(--event-background-mix, 9%),
					var(--event-background-base, var(--ha-card-background, var(--card-background-color)))
				);
				box-shadow: var(--ha-card-box-shadow, none);
			}
			.mushroom .event-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 36px;
				height: 36px;
				flex-shrink: 0;
				border-radius: 50%;
				color: var(--event-color);
				background: color-mix(in srgb, var(--event-color) 18%, transparent);
			}
			.mushroom .event.no-icon-background-color .event-icon {
				background: transparent;
			}
			.mushroom .event-icon ha-icon {
				--mdc-icon-size: 20px;
			}
			.mushroom .event-text {
				display: grid;
				gap: 1px;
				min-width: 0;
				line-height: 1.12;
			}
			.mushroom .event-title {
				overflow: hidden;
				font-size: 14px;
				font-weight: 600;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: var(--primary-text-color);
			}
			.mushroom .event-date,
			.mushroom .event-detail {
				font-size: 12px;
				line-height: 1.15;
				color: var(--secondary-text-color);
			}
			.mushroom .event-date {
				font-weight: 800;
			}

			/* ------------------------------------------------------------------ */
			/* Pro layout                                                         */
			/* ------------------------------------------------------------------ */
			.events.pro {
				display: grid;
				grid-template-columns: minmax(0, 1fr);
				width: 100%;
				gap: 0;
			}
			.pro-day-group {
				display: grid;
				box-sizing: border-box;
				grid-template-columns: 48px 3px minmax(0, 1fr);
				align-items: stretch;
				width: 100%;
				gap: 10px;
				padding: 4px 8px;
			}
			.pro-date {
				display: grid;
				align-content: center;
				justify-items: center;
				line-height: 1;
			}
			.pro-day {
				font-size: 0.72em;
				font-weight: 500;
				text-transform: capitalize;
				color: var(--secondary-text-color);
			}
			.pro-day-number {
				margin-top: 2px;
				font-size: 1.45em;
				font-weight: 700;
				color: var(--primary-text-color);
			}
			.pro-accent {
				width: 3px;
				height: 100%;
				min-height: 42px;
				border-radius: 999px;
				background: var(--primary-color);
			}
			.pro-events {
				display: grid;
				min-width: 0;
				gap: 0;
			}
			.pro-event {
				min-width: 0;
				padding: 5px 7px;
				border-radius: 0;
				background: color-mix(
					in srgb,
					var(--event-color) var(--event-background-mix, 9%),
					var(--ha-card-background, var(--card-background-color))
				);
			}
			.pro-event.no-card-background-color {
				border-radius: 0;
				background: transparent;
			}
			.pro-title {
				display: flex;
				align-items: center;
				gap: 6px;
				overflow: hidden;
				font-size: 14px;
				font-weight: 600;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: var(--primary-text-color);
			}
			.pro-icon {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 24px;
				height: 24px;
				flex-shrink: 0;
				border-radius: 50%;
				background: color-mix(in srgb, var(--event-color) 18%, transparent);
			}
			.pro-event.no-icon-background-color .pro-icon {
				background: transparent;
			}
			.pro-title ha-icon {
				--mdc-icon-size: 16px;
				color: var(--event-color);
			}
			.pro-details {
				display: grid;
				gap: 2px;
				margin-top: 2px;
			}
			.pro-detail {
				display: grid;
				grid-template-columns: 24px minmax(0, 1fr);
				align-items: start;
				gap: 6px;
				font-size: 12px;
				font-weight: 400;
				color: var(--secondary-text-color);
			}
			.pro-detail ha-icon {
				--mdc-icon-size: 15px;
				justify-self: center;
				color: currentColor;
			}
			.pro-detail span {
				min-width: 0;
				overflow-wrap: anywhere;
			}

			/* ------------------------------------------------------------------ */
			/* Square layout                                                      */
			/* ------------------------------------------------------------------ */
			.events.square {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
				width: 100%;
				gap: 8px;
			}
			.square .event {
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				gap: 10px;
				min-width: 0;
				min-height: 100px;
				padding: 10px;
				border: 1px solid var(--divider-color);
				border-radius: 12px;
				text-align: center;
				background: color-mix(
					in srgb,
					var(--event-color) var(--event-background-mix, 9%),
					var(--event-background-base, var(--ha-card-background, var(--card-background-color)))
				);
			}
			.square .event-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 36px;
				height: 36px;
				flex-shrink: 0;
				border-radius: 50%;
				color: var(--event-color);
				background: color-mix(in srgb, var(--event-color) 18%, transparent);
			}
			.square .event.no-icon-background-color .event-icon {
				background: transparent;
			}
			.square .event-text {
				min-width: 0;
			}
			.square .event-title {
				overflow: hidden;
				font-size: 14px;
				font-weight: 600;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: var(--primary-text-color);
			}
			.square .event-date,
			.square .event-detail {
				font-size: 12px;
				color: var(--secondary-text-color);
			}
			.square .event-date {
				font-weight: 600;
			}

			/* ------------------------------------------------------------------ */
			/* Ticker layout                                                      */
			/* ------------------------------------------------------------------ */
			.events.ticker {
				display: block;
				width: 100%;
			}
			.ticker-card {
				display: grid;
				grid-template-columns: 62px minmax(0, 1fr);
				align-items: center;
				box-sizing: border-box;
				width: 100%;
				min-height: 66px;
				padding: 5px 12px 5px 6px;
				border: 1px solid var(--divider-color);
				border-radius: 999px;
				background: var(--secondary-background-color);
			}
			.ticker-card.ticker-mushroom-shape {
				border-radius: var(--ha-card-border-radius, 12px);
			}
			.card-content:not(.dark-mode) .ticker-card.ticker-invert-light-colors {
				background: var(--ha-card-background, var(--card-background-color));
			}
			.card-content:not(.dark-mode) .ticker-card.ticker-invert-light-colors .ticker-date {
				background: var(--secondary-background-color);
			}
			.ticker-date {
				display: grid;
				align-content: center;
				justify-items: center;
				width: 52px;
				height: 52px;
				border-radius: 50%;
				background: var(--ha-card-background, var(--card-background-color));
				box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
				line-height: 1;
			}
			.ticker-day {
				font-size: 22px;
				font-weight: 700;
				color: var(--primary-text-color);
			}
			.ticker-month {
				margin-top: 2px;
				font-size: 11px;
				font-weight: 500;
				text-transform: lowercase;
				color: var(--secondary-text-color);
			}
			.ticker-viewport {
				height: 52px;
				overflow: hidden;
			}
			.ticker-track {
				display: grid;
				grid-auto-rows: 26px;
				transition: transform 450ms ease;
			}
			.ticker-event {
				display: flex;
				align-items: center;
				gap: 7px;
				min-width: 0;
				height: 26px;
				padding: 0 5px;
				box-sizing: border-box;
				border-radius: 6px;
				font-size: 14px;
				background: var(--ticker-event-background, transparent);
			}
			.ticker-dot {
				width: 14px;
				height: 14px;
				flex: 0 0 14px;
				border-radius: 50%;
				background: var(--ticker-dot-color, #0288d1);
			}
			.ticker-title {
				flex: 0 0 auto;
				font-weight: 600;
				white-space: nowrap;
				color: var(--primary-text-color);
			}
			.ticker-details {
				display: flex;
				align-items: center;
				gap: 0;
				overflow: hidden;
				min-width: 0;
				flex: 1 1 0;
				color: var(--secondary-text-color);
			}
			.ticker-detail {
				overflow: hidden;
				min-width: 0;
				font-size: 12px;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.ticker-detail::before {
				content: " · ";
				padding: 0 4px;
				color: var(--secondary-text-color);
			}
			.ticker-meta {
				margin-left: auto;
				padding-left: 8px;
				flex: 0 0 auto;
				font-size: 12px;
				font-weight: 800;
				white-space: nowrap;
				color: var(--secondary-text-color);
			}
			@media (prefers-reduced-motion: reduce) {
				.ticker-track {
					transition: none;
				}
			}

			/* ------------------------------------------------------------------ */
			/* Card arrangements                                                  */
			/* ------------------------------------------------------------------ */

			/* Left / Center / Right */
			.events.arrange-left {
				justify-content: flex-start;
			}
			.events.arrange-center {
				justify-content: center;
			}
			.events.arrange-right {
				justify-content: flex-end;
			}

			/* Justified */
			.events.arrange-justified {
				width: 100%;
				justify-content: space-between;
			}

			/* Stretched */
			.events.chips.arrange-stretched,
			.events.mushroom.arrange-stretched {
				display: flex;
				flex-wrap: wrap;
				align-items: stretch;
				align-content: flex-start;
				justify-content: flex-start;
				width: 100%;
			}
			.events.chips.arrange-stretched .event,
			.events.mushroom.arrange-stretched .event {
				box-sizing: border-box;
				flex: 1 1 auto;
				width: auto;
				max-width: 100%;
			}
			.events.chips.arrange-stretched .event {
				min-width: max-content;
			}

			/* List / 2 columns / 3 columns */
			.events.chips.arrange-list,
			.events.mushroom.arrange-list,
			.events.chips.arrange-2-columns,
			.events.mushroom.arrange-2-columns,
			.events.chips.arrange-3-columns,
			.events.mushroom.arrange-3-columns {
				display: grid;
				align-items: start;
				align-content: start;
				width: 100%;
			}
			.events.chips.arrange-list,
			.events.mushroom.arrange-list {
				grid-template-columns: minmax(0, 1fr);
			}
			.events.chips.arrange-2-columns,
			.events.mushroom.arrange-2-columns {
				grid-template-columns: repeat(2, minmax(0, 1fr));
			}
			.events.chips.arrange-3-columns,
			.events.mushroom.arrange-3-columns {
				grid-template-columns: repeat(3, minmax(0, 1fr));
			}

			/* Shared constrained-card behavior */
			.events:is(.arrange-list, .arrange-2-columns, .arrange-3-columns) .event {
				box-sizing: border-box;
				width: 100%;
				max-width: 100%;
				min-width: 0;
			}
			.events:is(.arrange-list, .arrange-2-columns, .arrange-3-columns) .event-text {
				overflow: hidden;
				min-width: 0;
			}
			.events:is(.arrange-2-columns, .arrange-3-columns) :is(.event-title, .event-date, .event-detail) {
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			/* ------------------------------------------------------------------ */
			/* Rule highlight animation                                           */
			/* ------------------------------------------------------------------ */
			.event-blink {
				animation: event-spotlight-background-blink 1.2s ease-in-out infinite;
			}
			@keyframes event-spotlight-background-blink {
				0%, 100% {
					background-color: transparent;
				}
				50% {
					background-color: color-mix(
						in srgb,
						var(--event-blink-color, var(--primary-color)) 38%,
						transparent
					);
				}
			}
			.event-pulse {
				animation: event-spotlight-background-pulse 1.8s ease-in-out infinite;
			}
			.event-blink.event-pulse {
				animation:
					event-spotlight-background-blink 1.2s ease-in-out infinite,
					event-spotlight-background-pulse 1.8s ease-in-out infinite;
			}
			@keyframes event-spotlight-background-pulse {
				0%, 100% {
					box-shadow: 0 0 0 0 color-mix(
						in srgb,
						var(--event-blink-color, var(--primary-color)) 0%,
						transparent
					);
					transform: scale(1);
				}
				50% {
					box-shadow: 0 0 0 5px color-mix(
						in srgb,
						var(--event-blink-color, var(--primary-color)) 24%,
						transparent
					);
					transform: scale(1.015);
				}
			}
			@media (prefers-reduced-motion: reduce) {
				.event-blink,
				.event-pulse {
					animation: none;
					background-color: color-mix(
						in srgb,
						var(--event-blink-color, var(--primary-color)) 24%,
						transparent
					);
				}
			}

			/* ------------------------------------------------------------------ */
			/* Empty, loading, error, and responsive states                        */
			/* ------------------------------------------------------------------ */
			.state {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 8px;
				min-height: 64px;
				color: var(--secondary-text-color);
			}
			.error {
				color: var(--error-color, #f44336);
			}
			@media (max-width: 400px) {
				.events.square {
					grid-template-columns: repeat(2, minmax(0, 1fr));
				}
				.mushroom .event {
					max-width: 100%;
				}
			}
		`;
	}
}

/* ---------------------------------------------------------------------- */
/*  Visual editor                                                         */
/* ---------------------------------------------------------------------- */
class EventSpotlightCardEditor extends HTMLElement {
	static SECTION_ICONS = {
		general: "mdi:cog-outline",
		calendars: "mdi:calendar-multiple",
		appearance: "mdi:palette-outline",
		rules: "mdi:format-list-checks",
	};

	constructor() {
		super();
		this._rendered = false;
		this._ruleInputTimer = null;
		this._configDispatchTimer = null;
		this._pendingConfigDispatch = null;
		this._lastEmittedConfigKey = null;
		this._pendingOpenRuleIndex = null;
		this._sectionState = {
			calendars: false,
			general: false,
			appearance: false,
			rules: false,
		};
	}

	disconnectedCallback() {
		if (this._configDispatchTimer) clearTimeout(this._configDispatchTimer);
		this._configDispatchTimer = null;
		this._pendingConfigDispatch = null;
	}

	_scheduleConfigChanged(config = this._config) {
		this._pendingConfigDispatch = { ...config };

		if (this._configDispatchTimer) return;

		this._configDispatchTimer = setTimeout(() => {
			this._configDispatchTimer = null;

			const pendingConfig = this._pendingConfigDispatch;
			this._pendingConfigDispatch = null;

			if (!pendingConfig) return;

			this._lastEmittedConfigKey = JSON.stringify(pendingConfig);

			this.dispatchEvent(
				new CustomEvent("config-changed", {
					detail: { config: pendingConfig },
					bubbles: true,
					composed: true,
				}),
			);
		}, 0);
	}

	setConfig(config) {
		const nextConfig = { ...config };

		if (Array.isArray(nextConfig.rules)) {
			nextConfig.rules = this._orderRules(nextConfig.rules);
		}

		const incomingKey = JSON.stringify(nextConfig);

		if (
			this._rendered &&
			incomingKey === this._lastEmittedConfigKey
		) {
			const languageChanged =
				this._config?.language !== nextConfig.language;

			this._config = nextConfig;
			this._lastEmittedConfigKey = null;

			if (languageChanged) {
				this._render();
			}

			this._updateValues();
			return;
		}

		this._lastEmittedConfigKey = null;

		const previousConfig = this._config;

		const structureChanged =
			!previousConfig ||
			(previousConfig.calendars || []).length !==
				(nextConfig.calendars || []).length ||
			(previousConfig.rules || []).length !==
				(nextConfig.rules || []).length ||
			previousConfig.layout !== nextConfig.layout ||
			previousConfig.language !== nextConfig.language;

		this._config = nextConfig;

		if (!this._rendered || structureChanged) {
			this._render();
			this._rendered = true;
		} else {
			this._syncRuleEditor();
		}

		this._updateValues();
	}

	set hass(hass) {
		const configuredLanguage = this._config?.language || "auto";

		const previousLanguage = this._hass
			? resolveLanguage(
					this._hass,
					configuredLanguage,
				)
			: null;

		this._hass = hass;

		const currentLanguage = resolveLanguage(hass, configuredLanguage);

		if (
			this._rendered &&
			previousLanguage &&
			previousLanguage !== currentLanguage
		) {
			this._render();
			this._updateValues();
			return;
		}

		if (!this._rendered && this._config) {
			this._render();
			this._rendered = true;
			this._updateValues();
			return;
		}

		this.querySelectorAll("ha-selector, ha-form").forEach((element) => {
			element.hass = hass;
		});
	}

	connectedCallback() {
		if (!this._rendered && this._config) {
			this._render();
			this._rendered = true;
			this._updateValues();
		}
	}

	_lang() {
		return resolveLanguage(
			this._hass,
			this._config?.language || "auto",
		);
	}

	_t(path, replacements = {}) {
		return translate(this._lang(), `editor.${path}`, replacements);
	}

	_ruleFallbackName(index) {
		return this._t("rules.fallback_name", { n: index + 1 });
	}

	_sectionSummary(icon, title) {
		return `<summary><span class="section-title"><ha-icon icon="${icon}"></ha-icon>${title}</span></summary>`;
	}

	_selector(key, label) {
		return `<div class="field"><span>${label}</span><ha-selector data-config="${key}"></ha-selector></div>`;
	}

	_switchRow(key, label) {
		return `<div class="switch-row"><span>${label}</span><ha-switch data-config="${key}"></ha-switch></div>`;
	}

	_displayOrder() {
		const defaults = EventSpotlightCard.FIELD_DEFAULTS.display_order;
		const configured = Array.isArray(this._config.display_order) ? this._config.display_order : [];
		return [...configured.filter((key) => defaults.includes(key)), ...defaults.filter((key) => !configured.includes(key))];
	}

	_appearanceRows() {
		const layout = this._config.layout || EventSpotlightCard.FIELD_DEFAULTS.layout;
		const isBubble = layout === "bubble";
		const locksDateTime = isBubble || layout === "ticker";
		const rows = {
			date_time: `<div class="appearance-switches">${this._switchRow("show_relative_date", this._t("appearance.show_relative_date"))}${this._switchRow("show_time", this._t("appearance.show_time"))}</div>`,
			description: this._switchRow("show_description", this._t("appearance.show_description")),
			location: this._switchRow("show_location", this._t("appearance.show_location")),
			calendar: this._switchRow("show_calendar_source", this._t("appearance.show_calendar")),
		};
		const order = locksDateTime
			? ["date_time", ...this._displayOrder().filter((key) => key !== "date_time")]
			: this._displayOrder();
		return order.map((key) => {
			const locked = locksDateTime && key === "date_time";
			return `<div class="appearance-order-row${locked ? " locked" : ""}" draggable="${locked ? "false" : "true"}" data-display-key="${key}"><ha-icon class="drag-handle" icon="${locked ? "mdi:lock-outline" : "mdi:drag"}"></ha-icon><div class="appearance-order-content">${rows[key]}</div></div>`;
		}).join("");
	}

	_calendarSettingsRows() {
		return (this._config.calendars || [])
			.map((calendar) => {
				const item = typeof calendar === "string" ? { entity: calendar } : calendar;
				const state = this._hass?.states?.[item.entity];
				const name = state?.attributes?.friendly_name || item.entity;
				return `
					<div class="calendar-setting" data-calendar-entity="${this._escapeAttribute(item.entity)}">
						<div class="calendar-setting-name">
							<ha-icon icon="${this._escapeAttribute(this._safeIcon(state?.attributes?.icon))}"></ha-icon>
							<div><span>${this._escapeAttribute(name)}</span><small>${this._escapeAttribute(item.entity)}</small></div>
						</div>
						<button class="calendar-remove" data-calendar-remove type="button" title="${this._t("calendars.remove")}"><ha-icon icon="mdi:delete-outline"></ha-icon></button>
					</div>`;
			})
			.join("");
	}

	_normalizeRuleAction(action) {
		return EventSpotlightCard.RULE_ACTIONS.includes(action) ? action : "include";
	}
	_normalizeRuleField(field) {
		return EventSpotlightCard.RULE_FIELDS.includes(field) ? field : "summary";
	}
	_normalizeRuleOperator(operator) {
		return EventSpotlightCard.RULE_OPERATORS.includes(operator)
			? operator
			: "contains";
	}

	_highlightDurationValue(minutes) {
		const totalMinutes = Math.min(1440, Math.max(1, Number(minutes) || 30));
		return totalMinutes >= 60 && totalMinutes % 60 === 0
			? totalMinutes / 60
			: totalMinutes;
	}

	_highlightDurationUnit(minutes) {
		const totalMinutes = Math.min(1440, Math.max(1, Number(minutes) || 30));
		return totalMinutes >= 60 && totalMinutes % 60 === 0
			? "hours"
			: "minutes";
	}

	_highlightDurationMinutes(value, unit) {
		const number = Number(value);
		const safeValue = Number.isFinite(number) ? number : 30;
		return Math.min(
			1440,
			Math.max(1, Math.round(safeValue * (unit === "hours" ? 60 : 1))),
		);
	}

	_ruleRow(rule, index) {
		const action = this._normalizeRuleAction(rule.action);
		const field = this._normalizeRuleField(rule.field);
		const operator = this._normalizeRuleOperator(rule.operator);
		const rawRuleName = String(rule.rule_name || "").trim();
		const rawLabel = String(rule.label || "").trim();
		const rawValue = String(rule.value || "").trim();
		const ruleName = this._escapeAttribute(rawRuleName);
		const label = this._escapeAttribute(rawLabel);
		const value = this._escapeAttribute(rawValue);
		const title = this._escapeAttribute(rawRuleName || rawValue || this._ruleFallbackName(index));
		const rawIcon = rule.icon || "mdi:calendar";
		const icon = action === "exclude"
			? ""
			: this._escapeAttribute(this._safeIcon(rawIcon, "mdi:calendar"));
		const iconColor = this._escapeAttribute(this._ruleIconColor(rule));
		const actionLabel = this._t(`options.${action}`);
		const blinkDurationValue = this._highlightDurationValue(rule.blink_start_minutes);
		const blinkDurationUnit = this._highlightDurationUnit(rule.blink_start_minutes);
		const pulseDurationValue = this._highlightDurationValue(rule.pulse_start_minutes);
		const pulseDurationUnit = this._highlightDurationUnit(rule.pulse_start_minutes);

		return `
			<details class="rule-card" data-rule-index="${index}" draggable="false">
				<summary class="rule-card-summary">
					<ha-icon class="rule-drag-handle${action === "exclude" ? " exclude-lock" : ""}" icon="${action === "exclude" ? "mdi:lock-outline" : "mdi:drag"}" draggable="true"></ha-icon>
					<span class="rule-card-identity">${icon ? `<ha-icon class="rule-card-icon" icon="${icon}" style="color:${iconColor}"></ha-icon>` : ""}<span class="rule-card-title">${title}</span></span>
					<span class="rule-card-actions"><span class="rule-type rule-type-${action}">${actionLabel}</span><button class="rule-remove" data-rule-remove="${index}" type="button" title="${this._t("rules.remove")}"><ha-icon icon="mdi:delete-outline"></ha-icon></button><span class="rule-toggle-icons" aria-hidden="true"><ha-icon class="rule-toggle-down" icon="mdi:chevron-down"></ha-icon><ha-icon class="rule-toggle-up" icon="mdi:chevron-up"></ha-icon></span></span>
				</summary>
				<div class="rule-card-content">
					<section class="rule-editor-group">
						<div class="rule-editor-group-title">${this._t("rules.group_rule")}</div>
						<label>${this._t("rules.rule_name")}<input data-rule-key="rule_name" type="text" value="${ruleName}" placeholder="${this._t("rules.rule_name_placeholder")}"></label>
						<div class="rule-grid">
							<div class="field"><span>${this._t("rules.action")}</span><select data-rule-key="action"><option value="include"${action === "include" ? " selected" : ""}>${this._t("options.include")}</option><option value="exclude"${action === "exclude" ? " selected" : ""}>${this._t("options.exclude")}</option></select></div>
							<div class="field"><span>${this._t("rules.field")}</span><select data-rule-key="field"><option value="summary"${field === "summary" ? " selected" : ""}>${this._t("options.summary")}</option><option value="description"${field === "description" ? " selected" : ""}>${this._t("options.description")}</option><option value="location"${field === "location" ? " selected" : ""}>${this._t("options.location")}</option><option value="calendar"${field === "calendar" ? " selected" : ""}>${this._t("options.calendar")}</option></select></div>
							<div class="field"><span>${this._t("rules.match")}</span><select data-rule-key="operator"><option value="contains"${operator === "contains" ? " selected" : ""}>${this._t("options.contains")}</option><option value="equals"${operator === "equals" ? " selected" : ""}>${this._t("options.equals")}</option><option value="starts_with"${operator === "starts_with" ? " selected" : ""}>${this._t("options.starts_with")}</option><option value="ends_with"${operator === "ends_with" ? " selected" : ""}>${this._t("options.ends_with")}</option><option value="regex"${operator === "regex" ? " selected" : ""}>${this._t("options.regex")}</option></select></div>
						</div>
						<label>${this._t("rules.value")}<input data-rule-key="value" type="text" value="${value}" placeholder="${this._t("rules.value_placeholder")}"></label>
					</section>
					<div class="rule-appearance${action === "exclude" ? " hidden" : ""}">
						<section class="rule-editor-group">
							<div class="rule-editor-group-title">${this._t("rules.group_appearance")}</div>
							<label>${this._t("rules.label")}<input data-rule-key="label" type="text" value="${label}" placeholder="${this._t("rules.label_placeholder")}"></label>
							<ha-form class="rule-appearance-form" data-rule-form="${index}"></ha-form>
							<div class="rule-color-options"><label class="compact-option"><ha-switch data-rule-option="show_icon_background_color" ${rule.show_icon_background_color !== false ? "checked" : ""}></ha-switch><span>${this._t("rules.icon_background")}</span></label><label class="compact-option"><ha-switch data-rule-option="show_background_color" ${rule.show_background_color !== false ? "checked" : ""}></ha-switch><span>${this._t("rules.card_background")}</span></label></div>
						</section>
						<section class="rule-editor-group">
							<div class="rule-editor-group-title">${this._t("rules.group_behavior")}</div>
							<label class="compact-option"><ha-switch data-rule-option="show_first_match_only" ${rule.show_first_match_only === true ? "checked" : ""}></ha-switch><span>${this._t("rules.next_match_only")}</span></label>
						</section>
						<section class="rule-editor-group">
							<div class="rule-editor-group-title">${this._t("rules.group_highlight")}</div>
							<div class="rule-highlight-grid">
								<div class="rule-highlight-card">
									<label class="compact-option rule-highlight-toggle"><ha-switch data-rule-option="blink_background" ${rule.blink_background === true ? "checked" : ""}></ha-switch><span>${this._t("rules.blink")}</span></label>
									<div class="rule-highlight-options${rule.blink_background === true ? "" : " hidden"}" data-rule-highlight-options="blink">
										<div class="rule-duration-row">
											<input data-rule-highlight-value="blink" type="number" min="1" max="${blinkDurationUnit === "hours" ? 24 : 59}" step="1" value="${blinkDurationValue}">
											<select data-rule-highlight-unit="blink"><option value="minutes"${blinkDurationUnit === "minutes" ? " selected" : ""}>${this._t("rules.minutes")}</option><option value="hours"${blinkDurationUnit === "hours" ? " selected" : ""}>${this._t("rules.hours")}</option></select>
										</div>
										<span class="rule-highlight-label">${this._t("rules.start_before")}</span>
										<small>${this._t("rules.all_day_blink")}</small>
									</div>
								</div>
								<div class="rule-highlight-card">
									<label class="compact-option rule-highlight-toggle"><ha-switch data-rule-option="pulse_background" ${rule.pulse_background === true ? "checked" : ""}></ha-switch><span>${this._t("rules.pulse")}</span></label>
									<div class="rule-highlight-options${rule.pulse_background === true ? "" : " hidden"}" data-rule-highlight-options="pulse">
										<div class="rule-duration-row">
											<input data-rule-highlight-value="pulse" type="number" min="1" max="${pulseDurationUnit === "hours" ? 24 : 59}" step="1" value="${pulseDurationValue}">
											<select data-rule-highlight-unit="pulse"><option value="minutes"${pulseDurationUnit === "minutes" ? " selected" : ""}>${this._t("rules.minutes")}</option><option value="hours"${pulseDurationUnit === "hours" ? " selected" : ""}>${this._t("rules.hours")}</option></select>
										</div>
										<span class="rule-highlight-label">${this._t("rules.start_before")}</span>
										<small>${this._t("rules.all_day_pulse")}</small>
									</div>
								</div>
							</div>
						</section>
					</div>
				</div>
			</details>`;
	}

	_safeIcon(icon, fallback = "mdi:calendar") {
		const value = String(icon || "").trim();
		return /^(?:mdi|hacs|advanced-camera-card):[a-z0-9_-]+$/i.test(value) ? value : fallback;
	}

	_supportsCardArrangement() {
		const layout =
			this._config.layout ?? EventSpotlightCard.FIELD_DEFAULTS.layout;
		return ["chips", "mushroom"].includes(layout);
	}

	_ruleIconColor(rule) {
		if ((rule?.action || "include") === "exclude") {
			return "#64748b";
		}

		const color = String(rule?.color || "").trim();
		if (!color) {
			return "var(--primary-color)";
		}

		return EventSpotlightCard.prototype._resolveUiColor.call(
			{ _safeCustomColor: EventSpotlightCard.prototype._safeCustomColor },
			color,
		);
	}

	_escapeAttribute(value) {
		return String(value)
			.replaceAll("&", "&amp;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;");
	}

	_orderRules(rules) {
		return [
			...rules.filter((rule) => this._normalizeRuleAction(rule.action) === "exclude"),
			...rules.filter((rule) => this._normalizeRuleAction(rule.action) !== "exclude"),
		];
	}

	_render() {
		const icons = EventSpotlightCardEditor.SECTION_ICONS;
		const calendarSettingsRows = this._calendarSettingsRows();
		const ruleBlocks = (this._config.rules || [])
			.map((rule, index) => this._ruleRow(rule, index))
			.join("");

		this.innerHTML = `
			<style>
				.editor {
					display: grid;
					gap: 12px;
					padding: 8px 0;
				}

				details.section {
					overflow: hidden;
					background: var(--ha-card-background, var(--card-background-color));
					border: 1px solid var(--divider-color);
					border-radius: var(--ha-card-border-radius, 12px);
				}

				summary {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 12px;
					padding: 16px;
					color: var(--primary-text-color);
					font-size: 16px;
					font-weight: 600;
					cursor: pointer;
					list-style: none;
					user-select: none;
				}

				summary::-webkit-details-marker {
					display: none;
				}

				.section-title {
					display: flex;
					align-items: center;
					gap: 10px;
					min-width: 0;
				}

				.section-title ha-icon {
					--mdc-icon-size: 20px;
					color: var(--secondary-text-color);
					flex-shrink: 0;
				}

				summary::after {
					content: "";
					width: 8px;
					height: 8px;
					flex-shrink: 0;
					border-right: 2px solid var(--secondary-text-color);
					border-bottom: 2px solid var(--secondary-text-color);
					transform: rotate(45deg);
					transition: transform .2s ease;
				}

				details[open] summary::after {
					transform: rotate(225deg);
				}

				details[open] summary {
					border-bottom: 1px solid var(--divider-color);
				}

				.section-content {
					display: grid;
					gap: 14px;
					padding: 16px;
				}

				.grid {
					display: grid;
					grid-template-columns: repeat(2, minmax(0, 1fr));
					gap: 12px;
				}

				.field,
				label {
					display: grid;
					gap: 6px;
					color: var(--secondary-text-color);
					font-size: 12px;
				}

				input {
					box-sizing: border-box;
					width: 100%;
					min-height: 42px;
					padding: 8px 10px;
					color: var(--primary-text-color);
					background: var(--ha-card-background, var(--card-background-color));
					border: 1px solid var(--divider-color);
					border-radius: 8px;
					font: inherit;
				}

				ha-selector {
					display: block;
					width: 100%;
				}  
				.arrangement-field.disabled {
					opacity: 0.5;
					pointer-events: none;
				}

				.calendar-settings {
					display: grid;
					gap: 10px;
				}

				.calendar-setting {
					display: grid;
					grid-template-columns: minmax(0, 1fr) minmax(120px, 160px) 38px;
					align-items: end;
					gap: 12px;
					padding: 6px 0;
				}
				.calendar-setting-name {
					display: flex;
					align-items: center;
					gap: 10px;
					min-width: 0;
					color: var(--primary-text-color);
				}

				.calendar-setting-name div {
					display: grid;
					min-width: 0;
				}

				.calendar-setting-name span,
				.calendar-setting-name small {
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.calendar-setting-name small {
					color: var(--secondary-text-color);
				}

				.calendar-setting > label {
					gap: 3px;
					font-size: 10px;
				}

				.calendar-setting > label select {
					min-height: 32px;
					padding: 4px 7px;
					font-size: 12px;
				}

				.calendar-empty {
					padding: 14px;
					border: 1px dashed var(--divider-color);
					border-radius: 10px;
					color: var(--secondary-text-color);
					font-size: 13px;
					text-align: center;
				}

				.calendar-remove {
					display: flex;
					align-items: center;
					justify-content: center;
					align-self: end;
					justify-self: end;
					width: 38px;
					height: 38px;
					padding: 0;
					border: 0;
					color: var(--secondary-text-color);
					background: transparent;
					cursor: pointer;
				}
				.ticker-appearance-options {
					display: grid;
					gap: 2px;
					padding-left: 16px;
				}
				.appearance-order-list { display:grid; gap:8px; }
				.appearance-order-row { display:grid; grid-template-columns:28px minmax(0,1fr); align-items:center; gap:8px; padding:8px; border:1px solid var(--divider-color); border-radius:9px; background:var(--secondary-background-color); }
				.appearance-order-row.dragging { opacity:.45; }
				.appearance-order-row.drag-over { border-color:var(--primary-color); }
				.appearance-order-row.locked { opacity:.8; }
				.appearance-order-row.locked .drag-handle { cursor:not-allowed; }
				.drag-handle { color:var(--secondary-text-color); cursor:grab; }
				.appearance-order-content { min-width:0; }
				.appearance-switches { display:grid; gap:2px; }
				.switch-row {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 16px;
					min-height: 42px;
					color: var(--primary-text-color);
				}

				.rule-list {
					display: grid;
					gap: 12px;
				}

				.rule-empty {
					padding: 14px;
					border: 1px dashed var(--divider-color);
					border-radius: 10px;
					color: var(--secondary-text-color);
					font-size: 13px;
					text-align: center;
				}

				.rule-card { overflow: hidden; border: 1px solid var(--divider-color); border-radius: 10px; background: var(--secondary-background-color); }
				.rule-card.dragging { opacity:.45; }
				.rule-card.drag-over { border-color:var(--primary-color); }
				.rule-drag-handle {
					--mdc-icon-size:20px;
					width:20px;
					height:20px;
					color:var(--secondary-text-color);
					cursor:grab;
					flex:0 0 20px;
				}
				.rule-card-summary { display:flex; align-items:center; gap:12px; padding:10px 12px; list-style:none; cursor:pointer; }
				.rule-card-summary::-webkit-details-marker, .rule-card-summary::after { display:none; }
				.rule-card[open] .rule-card-summary { border-bottom:1px solid var(--divider-color); }
				.rule-card-identity { display:flex; align-items:center; gap:9px; min-width:0; flex:1 1 auto; }
				.rule-card-actions { display:flex; align-items:center; gap:8px; margin-left:auto; justify-content:flex-end; flex:0 0 auto; }
				.rule-card-icon { --mdc-icon-size:20px; color:var(--secondary-text-color); flex-shrink:0; }
				.rule-card-title { overflow:hidden; color:var(--primary-text-color); font-size:14px; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }
				.rule-type { padding:3px 7px; border-radius:999px; font-size:11px; font-weight:600; }
				.rule-type-include { color:var(--success-color,#43a047); background:color-mix(in srgb,var(--success-color,#43a047) 14%,transparent); }
				.rule-type-exclude { color:var(--error-color,#f44336); background:color-mix(in srgb,var(--error-color,#f44336) 14%,transparent); }
				.rule-remove {
					width: 32px;
					min-height: 32px;
					padding: 0;
					border: 0;
					border-radius: 0;
					color: var(--secondary-text-color);
					background: transparent;
				}
				.rule-toggle-icons { display:flex; align-items:center; justify-content:center; width:24px; color:var(--secondary-text-color); }
				.rule-toggle-icons ha-icon { --mdc-icon-size:20px; }
				.rule-toggle-up { display:none; }
				.rule-card[open] .rule-toggle-down { display:none; }
				.rule-card[open] .rule-toggle-up { display:block; }
				.rule-card-content { display:grid; gap:12px; padding:12px; }
				.rule-appearance { display:grid; gap:12px; }
				.rule-editor-group { display:grid; gap:10px; padding:12px; border:1px solid var(--divider-color); border-radius:10px; background:var(--ha-card-background,var(--card-background-color)); }
				.rule-grid { display:grid; gap:10px; }
				.rule-editor-group-title { color:var(--primary-text-color); font-size:12px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
				.rule-highlight-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; }
				.rule-highlight-card { display:grid; align-content:start; gap:8px; padding:10px; border:1px solid var(--divider-color); border-radius:9px; background:var(--secondary-background-color); }
				.rule-highlight-toggle { font-weight:600; }
				.rule-highlight-options { display:grid; gap:6px; }
				.rule-highlight-label { color:var(--secondary-text-color); font-size:12px; }
				.rule-duration-row { display:grid; grid-template-columns:minmax(0,1fr) minmax(100px,auto); gap:8px; }
				.rule-duration-row input,
				.rule-duration-row select { min-width:0; }

				.rule-appearance-form {
					display: block;
					width: 100%;
				}

				.rule-highlight-options small {
					margin-top: 4px;
					color: var(--secondary-text-color);
					line-height: 1.35;
				}

				.rule-color-options {
					display: grid;
					grid-template-columns: repeat(2, minmax(0, 1fr));
					gap: 12px;
					margin-top: 8px;
				}

				.compact-option {
					display: flex;
					align-items: center;
					gap: 6px;
					min-width: 0;
					color: var(--primary-text-color);
					font-size: 12px;
				}

				.rule-icon-field,
				.rule-icon-selector {
					min-width: 0;
					max-width: 100%;
				}

				.rule-card select {
					box-sizing: border-box;
					width: 100%;
					min-height: 42px;
					padding: 8px 10px;
					color: var(--primary-text-color);
					background: var(--ha-card-background, var(--card-background-color));
					border: 1px solid var(--divider-color);
					border-radius: 8px;
					font: inherit;
				}

				.rule-remove,
				.rule-add {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 6px;
					min-height: 38px;
					padding: 7px 10px;
					border: 1px solid var(--divider-color);
					border-radius: 9px;
					color: var(--primary-text-color);
					background: var(--ha-card-background, var(--card-background-color));
					cursor: pointer;
				}

				.rule-remove {
					width: 38px;
					padding: 0;
					color: var(--secondary-text-color);
				}

				.rule-add {
					justify-self: start;
					color: var(--primary-color);
				}
				.rule-remove {
					width: 32px;
					min-height: 32px;
					padding: 0;
					border: 0;
					border-radius: 0;
					color: var(--secondary-text-color);
					background: transparent;
				}

				.color-field {
					display: flex;
					align-items: center;
					gap: 8px;
				}

				.color-field .color-picker {
					width: 48px;
					flex-shrink: 0;
					padding: 4px;
				}

				.color-field .color-hex {
					flex: 1;
					min-width: 0;
					font-family: var(--code-font-family, monospace);
				}

				.hidden {
					display: none !important;
				}

				@media (max-width: 600px) {
					.grid,
					.rule-grid,
					.rule-color-options,
					.rule-highlight-grid,
					.calendar-setting {
						grid-template-columns: 1fr;
					}

					/* calendar-remove-mobile-alignment */
					.calendar-remove {
						align-self: end;
						justify-self: end;
					}
				}
			</style>
			<div class="editor">
				<details class="section" data-section="calendars"${this._sectionState.calendars ? " open" : ""}>
					${this._sectionSummary(icons.calendars, this._t("sections.calendars"))}
					<div class="section-content">
						<div class="field">
							<span>${this._t("calendars.add")}</span>
							<ha-selector data-calendar-add></ha-selector>
						</div>
						<div class="calendar-settings">
							${calendarSettingsRows || `<div class="calendar-empty">${this._t("calendars.empty")}</div>`}
						</div>
					</div>
				</details>

				<details class="section" data-section="general"${this._sectionState.general ? " open" : ""}>
					${this._sectionSummary(icons.general, this._t("sections.general"))}
					<div class="section-content">
						<label>
							${this._t("general.card_title")}
							<input data-config="name" type="text" placeholder="${this._t("general.card_title_placeholder")}">
						</label>
						<div class="grid">
							<label>
								${this._t("general.search_range")}
								<input data-config="days" type="number" min="1" max="365">
							</label>
							<label>
								${this._t("general.update_interval")}
								<input data-config="update_interval" type="number" min="1" max="1440" step="1">
							</label>
						</div>
						${this._selector("all_day_hide_time", this._t("general.all_day_hide_time"))}
						${this._selector("language", this._t("general.language"))}
					</div>
				</details>

				<details class="section" data-section="appearance"${this._sectionState.appearance ? " open" : ""}>
					${this._sectionSummary(icons.appearance, this._t("sections.appearance"))}
					<div class="section-content">
						<div class="grid">
							${this._selector("layout", this._t("appearance.layout"))}
							<div class="arrangement-field${this._supportsCardArrangement() ? "" : " disabled"}">
								${this._selector("card_arrangement", this._t("appearance.arrangement"))}
							</div>
						</div>
						${this._switchRow("show_title", this._t("appearance.show_header"))}
						${this._switchRow("show_title_icon", this._t("appearance.show_header_icon"))}
						${this._switchRow("show_card_background", this._t("appearance.show_card_background"))}
						${(this._config.layout || EventSpotlightCard.FIELD_DEFAULTS.layout) === "ticker" ? `
							<div class="ticker-appearance-options">
								${this._switchRow("ticker_mushroom_shape", this._t("appearance.mushroom_shape"))}
								${this._switchRow("ticker_invert_light_colors", this._t("appearance.invert_light_colors"))}
							</div>` : ""}
						<div class="appearance-order-list">${this._appearanceRows()}</div>
					</div>
				</details>

				<details class="section" data-section="rules"${this._sectionState.rules ? " open" : ""}>
					${this._sectionSummary(icons.rules, this._t("sections.rules"))}
					<div class="section-content">
						<div class="rule-list">
							${ruleBlocks || `<div class="rule-empty">${this._t("rules.empty")}</div>`}
						</div>
						<button class="rule-add" id="add-rule" type="button">
							<ha-icon icon="mdi:plus"></ha-icon>
							${this._t("rules.add")}
						</button>
					</div>
				</details>
			</div>`;

		this._initializeSelectors();
		this._initializeCalendarSettings();
		this._initializeInputs();
		this._initializeSwitches();
		this._initializeAppearanceOrder();
		this._initializeRules();
		this._initializeSectionState();
		if (Number.isInteger(this._pendingOpenRuleIndex)) {
			const pendingRow = this.querySelector(`[data-rule-index="${this._pendingOpenRuleIndex}"]`);
			if (pendingRow) pendingRow.open = true;
			this._pendingOpenRuleIndex = null;
		}
	}

	_initializeCalendarSettings() {
		const addSelector = this.querySelector("ha-selector[data-calendar-add]");

		if (addSelector) {
			addSelector.hass = this._hass;
			addSelector.selector = {
				entity: {
					filter: { domain: "calendar" },
				},
			};
			addSelector.value = "";
			addSelector.addEventListener("value-changed", (event) => {
				const entityId = event.detail?.value || "";

				if (!entityId) {
					return;
				}

				const calendars = [...(this._config.calendars || [])];
				const exists = calendars.some((calendar) => {
					const item = typeof calendar === "string" ? { entity: calendar } : calendar;
					return item.entity === entityId;
				});

				if (!exists) {
					calendars.push({ entity: entityId });
					this._setCalendarConfig(calendars, true);
				} else {
					addSelector.value = "";
				}
			});
		}

		this.querySelectorAll("[data-calendar-remove]").forEach((button) => {
			button.addEventListener("click", () => {
				const row = button.closest("[data-calendar-entity]");
				const entityId = row?.dataset.calendarEntity;

				if (!entityId) {
					return;
				}

				const calendars = (this._config.calendars || []).filter((calendar) => {
					const item = typeof calendar === "string" ? { entity: calendar } : calendar;
					return item.entity !== entityId;
				});

				this._setCalendarConfig(calendars, true);
			});
		});
	}

	_setCalendarConfig(calendars, rerender = true) {
		const config = {
			...this._config,
			calendars,
		};

		this._config = config;
		this._scheduleConfigChanged(config);

		if (rerender) {
			this._rendered = false;
			this._render();
			this._rendered = true;
			this._updateValues();
		}
	}

	_initializeAppearanceOrder() {
		const list = this.querySelector(".appearance-order-list");
		if (!list) return;
		let dragged = null;
		list.querySelectorAll(".appearance-order-row").forEach((row) => {
			if (row.classList.contains("locked")) return;
			row.addEventListener("dragstart", () => { dragged = row; row.classList.add("dragging"); });
			row.addEventListener("dragover", (event) => {
				event.preventDefault();
				if (!dragged || dragged === row) return;
				row.classList.add("drag-over");
				const rect = row.getBoundingClientRect();
				list.insertBefore(dragged, event.clientY < rect.top + rect.height / 2 ? row : row.nextSibling);
			});
			row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
			row.addEventListener("dragend", () => {
				row.classList.remove("dragging");
				list.querySelectorAll(".drag-over").forEach((item) => item.classList.remove("drag-over"));
				dragged = null;
				this._setDisplayOrder([...list.querySelectorAll(".appearance-order-row")].map((item) => item.dataset.displayKey));
			});
		});
	}

	_setDisplayOrder(order) {
		const config = { ...this._config, display_order: order };
		if (JSON.stringify(order) === JSON.stringify(EventSpotlightCard.FIELD_DEFAULTS.display_order)) delete config.display_order;
		this._config = config;
		this._scheduleConfigChanged(config);
	}

	_initializeRules() {
		const appearanceSchema = [
			{
				type: "grid",
				name: "",
				schema: [
					{
						name: "icon",
						label: this._t("rules.icon"),
						selector: { icon: {} },
						context: { icon_entity: "entity" },
					},
					{
						name: "color",
						label: this._t("rules.color"),
						selector: { ui_color: {} },
					},
				],
			},
		];

		this.querySelectorAll("[data-rule-form]").forEach((form) => {
			const index = Number(form.dataset.ruleForm);
			const rule = (this._config.rules || [])[index] || {};

			form.hass = this._hass;
			form.data = {
				icon: rule.icon || "",
				color: rule.color || "",
			};
			form.schema = appearanceSchema;
			form.computeLabel = (schema) => schema.label || schema.name;
			form.computeHelper = () => "";
			form.addEventListener("value-changed", (event) => {
				event.stopPropagation();
				const rules = [...(this._config.rules || [])];
				const current = { ...(rules[index] || {}) };
				const data = event.detail?.value || {};

				if (data.icon) {
					current.icon = data.icon;
				} else {
					delete current.icon;
				}

				if (data.color) {
					current.color = data.color;
				} else {
					delete current.color;
				}

				rules[index] = current;
				this._config = { ...this._config, rules };
				const row = form.closest("[data-rule-index]");
				const desiredIcon = current.icon || ((current.action || "include") === "exclude" ? "mdi:rule-remove-outline" : "mdi:calendar");
				this._updateRuleTitleIcon(row, desiredIcon, this._ruleIconColor(current));
				this._setRules(rules, false);
			});
		});

		this.querySelectorAll("[data-rule-option]").forEach((toggle) => {
			toggle.addEventListener("change", () => {
				const row = toggle.closest("[data-rule-index]");
				const index = Number(row?.dataset.ruleIndex);
				const key = toggle.dataset.ruleOption;
				const rules = [...(this._config.rules || [])];
				const current = { ...(rules[index] || {}) };

				if (["show_first_match_only", "blink_background", "pulse_background"].includes(key)) {
					if (toggle.checked) {
						current[key] = true;
						if (key === "blink_background" && current.blink_start_minutes === undefined) {
							current.blink_start_minutes = 30;
						}
						if (key === "pulse_background" && current.pulse_start_minutes === undefined) {
							current.pulse_start_minutes = 30;
						}
					} else {
						delete current[key];
					}
				} else if (toggle.checked) {
					delete current[key];
				} else {
					current[key] = false;
				}

				rules[index] = current;
				if (key === "blink_background" || key === "pulse_background") {
					const effect = key === "blink_background" ? "blink" : "pulse";
					const options = row.querySelector(`[data-rule-highlight-options="${effect}"]`);
					options?.classList.toggle("hidden", !toggle.checked);
					const valueInput = row.querySelector(`[data-rule-highlight-value="${effect}"]`);
					const unitSelect = row.querySelector(`[data-rule-highlight-unit="${effect}"]`);
					if (toggle.checked) {
						if (valueInput) {
							valueInput.value = "30";
							valueInput.max = "59";
						}
						if (unitSelect) unitSelect.value = "minutes";
					}
				}
				this._setRules(rules, false);
			});
		});

		this.querySelectorAll("[data-rule-highlight-value], [data-rule-highlight-unit]").forEach((control) => {
			const eventName = control.dataset.ruleHighlightValue ? "input" : "change";
			control.addEventListener(eventName, () => {
				const row = control.closest("[data-rule-index]");
				const index = Number(row?.dataset.ruleIndex);
				if (!Number.isInteger(index)) return;
				const effect = control.dataset.ruleHighlightValue || control.dataset.ruleHighlightUnit;
				if (!["blink", "pulse"].includes(effect)) return;
				const valueInput = row.querySelector(`[data-rule-highlight-value="${effect}"]`);
				const unitSelect = row.querySelector(`[data-rule-highlight-unit="${effect}"]`);
				if (!valueInput || !unitSelect) return;
				const unit = unitSelect.value === "hours" ? "hours" : "minutes";
				const max = unit === "hours" ? 24 : 59;
				const duration = Math.min(max, Math.max(1, Number(valueInput.value) || 1));
				valueInput.min = "1";
				valueInput.max = String(max);
				valueInput.value = String(duration);
				const rules = [...(this._config.rules || [])];
				const current = { ...(rules[index] || {}) };
				const key = effect === "blink" ? "blink_start_minutes" : "pulse_start_minutes";
				current[key] = this._highlightDurationMinutes(duration, unit);
				rules[index] = current;
				this._setRules(rules, false);
			});
		});

		const addRuleButton = this.querySelector("#add-rule");

		if (addRuleButton) {
			addRuleButton.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();

				const rules = [
				...(this._config.rules || []),
				{
					action: "include",
					field: "summary",
					operator: "contains",
					value: "",
				},
			];

				this._sectionState.rules = true;
				this._setRules(rules, true);
			});
		}

		this.querySelectorAll("[data-rule-remove]").forEach((button) => {
			button.addEventListener("click", (event) => {
				event.preventDefault(); event.stopPropagation();
				const index = Number(button.dataset.ruleRemove);
				const rules = (this._config.rules || []).filter(
					(_, ruleIndex) => ruleIndex !== index,
				);

				this._sectionState.rules = true;
				this._setRules(rules, true);
			});
		});

		this._initializeRuleOrder();

		this.querySelectorAll("[data-rule-key]").forEach((element) => {
			const key = element.dataset.ruleKey;

			if (key === "rule_name") {
				element.addEventListener("input", () => {
					this._updateRuleName(element, element.value);
				});
				return;
			}

			const eventName = element.tagName === "SELECT" ? "change" : "input";
			element.addEventListener(eventName, () => {
				if (key === "action") {
					this._updateRuleAction(element, element.value);
					return;
				}
				this._updateRuleElement(element, element.value);
			});
		});
	}

	_initializeRuleOrder() {
		const list = this.querySelector(".rule-list");
		if (!list) return;

		let draggedRow = null;
		list.querySelectorAll(".rule-card").forEach((row) => {
			const handle = row.querySelector(".rule-drag-handle");
			if (!handle) return;

			handle.addEventListener("dragstart", (event) => {
				draggedRow = row;
				row.classList.add("dragging");
				event.dataTransfer.effectAllowed = "move";
				event.dataTransfer.setData("text/plain", row.dataset.ruleIndex || "");
			});

			handle.addEventListener("dragend", () => {
				if (!draggedRow) return;
				draggedRow.classList.remove("dragging");
				list.querySelectorAll(".drag-over").forEach((item) => item.classList.remove("drag-over"));
				const currentRules = this._config.rules || [];
				const ruleByIndex = new Map(currentRules.map((rule, index) => [index, rule]));
				const ordered = [...list.querySelectorAll(".rule-card")]
					.map((item) => ruleByIndex.get(Number(item.dataset.ruleIndex)))
					.filter(Boolean);
				draggedRow = null;
				this._setRules(ordered, true);
			});
		});

		list.querySelectorAll(".rule-card").forEach((row) => {
			row.addEventListener("dragover", (event) => {
				if (!draggedRow || draggedRow === row) return;
				const draggedIndex = Number(draggedRow.dataset.ruleIndex);
				const targetIndex = Number(row.dataset.ruleIndex);
				const rules = this._config.rules || [];
				const draggedAction = rules[draggedIndex]?.action || "include";
				const targetAction = rules[targetIndex]?.action || "include";
				if (draggedAction !== targetAction) return;
				event.preventDefault();
				event.dataTransfer.dropEffect = "move";
				row.classList.add("drag-over");
				const rect = row.getBoundingClientRect();
				list.insertBefore(draggedRow, event.clientY < rect.top + rect.height / 2 ? row : row.nextSibling);
			});
			row.addEventListener("dragleave", () => row.classList.remove("drag-over"));
			row.addEventListener("drop", (event) => {
				event.preventDefault();
				row.classList.remove("drag-over");
			});
		});
	}

	_syncRuleEditor() {
		(this._config.rules || []).forEach((rule, index) => {
			const row = this.querySelector(`[data-rule-index="${index}"]`);
			if (!row) return;

			const title = row.querySelector(".rule-card-title");
			if (title) {
				title.textContent = String(rule.rule_name || "").trim() || String(rule.value || "").trim() || this._ruleFallbackName(index);
			}

			row.querySelectorAll("[data-rule-key]").forEach((element) => {
				const key = element.dataset.ruleKey;
				if (document.activeElement !== element) element.value = rule[key] ?? "";
			});

			const action = this._normalizeRuleAction(rule.action);
			const isExclude = action === "exclude";
			const badge = row.querySelector(".rule-type");
			if (badge) {
				badge.textContent = this._t(`options.${isExclude ? "exclude" : "include"}`);
				badge.className = `rule-type rule-type-${action}`;
			}
			row.querySelector(".rule-appearance")?.classList.toggle("hidden", isExclude);

			const form = row.querySelector("[data-rule-form]");
			if (form) form.data = { icon: rule.icon || "", color: rule.color || "" };

			row.querySelectorAll("[data-rule-option]").forEach((toggle) => {
				const optionKey = toggle.dataset.ruleOption;
				toggle.checked = ["show_first_match_only", "blink_background", "pulse_background"].includes(optionKey)
					? rule[optionKey] === true
					: rule[optionKey] !== false;
			});

			[
				["blink", rule.blink_background === true, rule.blink_start_minutes],
				["pulse", rule.pulse_background === true, rule.pulse_start_minutes],
			].forEach(([effect, enabled, startMinutes]) => {
				const valueInput = row.querySelector(`[data-rule-highlight-value="${effect}"]`);
				const unitSelect = row.querySelector(`[data-rule-highlight-unit="${effect}"]`);
				const unit = this._highlightDurationUnit(startMinutes);
				if (unitSelect) unitSelect.value = unit;
				if (valueInput) {
					valueInput.min = "1";
					valueInput.max = unit === "hours" ? "24" : "59";
					valueInput.value = String(this._highlightDurationValue(startMinutes));
				}
				row.querySelector(`[data-rule-highlight-options="${effect}"]`)
					?.classList.toggle("hidden", !enabled);
			});
			this._updateRuleTitleIcon(
				row,
				isExclude ? "" : (rule.icon || "mdi:calendar"),
				this._ruleIconColor(rule),
			);
		});
	}

	_initializeSectionState() {
		this.querySelectorAll("details.section[data-section]").forEach((section) => {
			section.addEventListener("toggle", () => {
				this._sectionState = {
					...this._sectionState,
					[section.dataset.section]: section.open,
				};
			});
		});
	}

	_updateRuleVisual(row, key, value) {
		if (!row) return;
		const index = Number(row.dataset.ruleIndex);
		const current = this._config.rules?.[index] || {};

		if (key === "rule_name" || key === "value") {
			const title = row.querySelector(".rule-card-title");
			const ruleName = key === "rule_name" ? value : current.rule_name;
			const ruleValue = key === "value" ? value : current.value;
			if (title) {
				title.textContent = String(ruleName || "").trim() || String(ruleValue || "").trim() || this._ruleFallbackName(index);
			}
		}

		if (key === "action") {
			const isExclude = value === "exclude";
			const badge = row.querySelector(".rule-type");
			const appearance = row.querySelector(".rule-appearance");
			if (badge) {
				badge.textContent = this._t(`options.${isExclude ? "exclude" : "include"}`);
				badge.className = `rule-type rule-type-${isExclude ? "exclude" : "include"}`;
			}
			row.querySelector(".rule-appearance")?.classList.toggle("hidden", isExclude);
			this._updateRuleTitleIcon(
				row,
				isExclude ? "" : (current.icon || "mdi:calendar"),
				this._ruleIconColor({ ...current, action: value }),
			);
		}
	}

	_updateRuleTitleIcon(row, iconValue, colorValue) {
		const identity = row?.querySelector(".rule-card-identity");
		let icon = row?.querySelector(".rule-card-icon");
		if (!iconValue) {
			icon?.remove();
			return;
		}
		const desiredIcon = this._safeIcon(iconValue, "mdi:calendar");
		if (!icon && identity) {
			icon = document.createElement("ha-icon");
			icon.className = "rule-card-icon";
			identity.prepend(icon);
		}
		icon?.setAttribute("icon", desiredIcon);
		if (icon) icon.style.color = colorValue || "var(--secondary-text-color)";
	}

	_updateRuleName(element, value) {
		const row = element.closest("[data-rule-index]");
		const index = Number(row?.dataset.ruleIndex);
		if (!Number.isInteger(index)) return;

		const rules = [...(this._config.rules || [])];
		const current = rules[index];
		if (!current) return;

		const updated = { ...current };
		const ruleName = String(value || "");
		const trimmedRuleName = ruleName.trim();

		if (trimmedRuleName) {
			updated.rule_name = ruleName;
		} else {
			delete updated.rule_name;
		}

		rules[index] = updated;
		this._config = { ...this._config, rules };

		const title = row.querySelector(".rule-card-title");
		if (title) {
			title.textContent =
				trimmedRuleName ||
				String(current.value || "").trim() ||
				this._ruleFallbackName(index);
		}

		this._scheduleConfigChanged(this._config);
	}

	_updateRuleAction(element, value) {
		const row = element.closest("[data-rule-index]");
		const index = Number(row?.dataset.ruleIndex);
		if (!Number.isInteger(index)) return;

		const sourceRule = this._config.rules?.[index];
		if (!sourceRule) return;

		const updated = { ...sourceRule, action: this._normalizeRuleAction(value) };

		const rules = [...(this._config.rules || [])];
		rules[index] = updated;
		const orderedRules = this._orderRules(rules);
		this._pendingOpenRuleIndex = orderedRules.indexOf(updated);
		this._setRules(orderedRules, true);
	}

	_updateRuleElement(element, value) {
		const row = element.closest("[data-rule-index]");
		const index = Number(row?.dataset.ruleIndex);
		const key = element.dataset.ruleKey;
		if (!Number.isInteger(index) || !key) return;

		this._updateRuleVisual(row, key, value);
		const rules = (this._config.rules || []).map((rule, ruleIndex) => {
			if (ruleIndex !== index) return rule;
			return { ...rule, [key]: value };
		});

		this._config = { ...this._config, rules };
		if (element.tagName === "SELECT") {
			this._setRules(rules, false);
			return;
		}

		if (this._ruleInputTimer) clearTimeout(this._ruleInputTimer);
		this._ruleInputTimer = setTimeout(() => {
			this._setRules(this._config.rules || [], false);
		}, 200);
	}

	_setRules(rules, rerender = true) {
		const nextRules = rerender ? this._orderRules(rules) : rules;
		const config = {
			...this._config,
			rules: nextRules,
		};

		if (!nextRules.length) {
			delete config.rules;
		}

		this._config = config;
		this._scheduleConfigChanged(config);

		if (rerender) {
			this._sectionState.rules = true;
			this._render();
			this._updateValues();
		}
	}

	_initializeSelectors() {
		this.querySelectorAll("ha-selector[data-config]").forEach((s) => {
			const key = s.dataset.config;
			s.hass = this._hass;
			if (key === "all_day_hide_time")
				s.selector = { time: {} };
			else if (key === "language")
				s.selector = {
					select: {
						mode: "dropdown",
						options: [
							{ value: "auto", label: this._t("options.auto") },
							...Object.entries(TRANSLATIONS).map(([code, language]) => ({
								value: code,
								label: language.meta?.name || code,
							})),
						],
					},
				};
			else if (key === "layout")
				s.selector = {
					select: {
						mode: "dropdown",
						options: [
							{ value: "bubble", label: "Bubble" },
							{ value: "chips", label: "Chips" },
							{ value: "mushroom", label: "Mushroom" },
							{ value: "pro", label: "Pro" },
							{ value: "square", label: "Square" },
							{ value: "ticker", label: "Ticker" },
						],
					},
				};
			else if (key === "card_arrangement")
				s.selector = {
					select: {
						mode: "dropdown",
						options: [
							{ value: "left", label: this._t("options.left") },
							{ value: "center", label: this._t("options.center") },
							{ value: "right", label: this._t("options.right") },
							{ value: "justified", label: this._t("options.justified") },
							{ value: "stretched", label: this._t("options.stretched") },
							{ value: "list", label: this._t("options.list") },
							{ value: "2-columns", label: this._t("options.two_columns") },
							{ value: "3-columns", label: this._t("options.three_columns") },
						],
					},
				};
			else s.selector = { object: {} };
			if (key === "card_arrangement") {
				s.disabled = !this._supportsCardArrangement();
			}
			s.addEventListener("value-changed", (e) => this._valueChanged(e));
		});
	}

	_initializeInputs() {
		this.querySelectorAll("input[data-config]").forEach((e) =>
			e.addEventListener("input", (event) => this._valueChanged(event)),
		);
	}

	_initializeSwitches() {
		this.querySelectorAll("ha-switch[data-config]").forEach((e) =>
			e.addEventListener("change", (event) => this._valueChanged(event)),
		);
	}

	_updateValues() {
		if (!this._rendered || !this._config) return;
		this.querySelectorAll("[data-config]").forEach((e) => {
			const key = e.dataset.config,
				value =
					this._config[key] ?? EventSpotlightCard.FIELD_DEFAULTS[key];
			if (e.tagName === "HA-SELECTOR") {
				e.hass = this._hass;

				e.value =
					value ??
					(key === "language"
						? "auto"
						: key === "layout"
							? "chips"
							: []);
			} else if (e.tagName === "HA-SWITCH") {
				e.checked = Boolean(value);
			}
			else if (document.activeElement !== e)
				e.value = value ?? "";
		});
	}

	_valueChanged(event) {
		if (!this._config) return;
		const target = event.currentTarget,
			key = target?.dataset?.config;
		if (!key) return;
		let value;
		if (target.tagName === "HA-SELECTOR") {
			value = event.detail?.value ?? target.value;
			if (key === "all_day_hide_time") {
				const match = String(value || "").match(/^([01]\d|2[0-3]):([0-5]\d)(?::[0-5]\d)?$/);
				value = match ? `${match[1]}:${match[2]}` : undefined;
			}
		}
		else if (target.tagName === "HA-SWITCH") value = Boolean(target.checked);
		else if (target.type === "number") {
			const number = target.value === "" ? undefined : Number(target.value);
			const min = target.min === "" ? -Infinity : Number(target.min);
			const max = target.max === "" ? Infinity : Number(target.max);
			value = number === undefined || !Number.isFinite(number)
				? undefined
				: Math.min(max, Math.max(min, number));
		}
		else value = target.value;
		const config = { ...this._config, [key]: value };
		const defaultValue = EventSpotlightCard.FIELD_DEFAULTS[key];
		if (
			value === "" ||
			value === undefined ||
			value === defaultValue
		)
			delete config[key];
		this._config = config;
		this._scheduleConfigChanged(config);
		if (key === "layout" || key === "language") {
			this._render();
			this._updateValues();
		}
	}
}

/* ---------------------------------------------------------------------- */
/*  Registration                                                          */
/* ---------------------------------------------------------------------- */
if (!customElements.get("event-spotlight-card"))
	customElements.define("event-spotlight-card", EventSpotlightCard);

if (!customElements.get("event-spotlight-card-editor"))
	customElements.define(
		"event-spotlight-card-editor",
		EventSpotlightCardEditor,
	);

window.customCards = window.customCards || [];

window.customCards.push({
	type: "event-spotlight-card",
	name: "Event Spotlight Card",
	description:
		"Highlight the calendar events that matter to you, from waste collections and birthdays to medical appointments, anniversaries, reminders, trash and more.",
	preview: true,
	documentationURL: "https://github.com/KroFR/event-spotlight-ha-card",

	getEntitySuggestion: (hass, entityId) => {
		if (!entityId.startsWith("calendar.")) {
			return null;
		}
		return {
			config: {
				type: "custom:event-spotlight-card",
				calendars: [
					{
						entity: entityId,
					},
				],
			},
		};
	},
});

console.info(`%c 📅 EVENT-SPOTLIGHT-CARD %c v${CARD_VERSION} `, "color:white;background:#0288d1;font-weight:700;", "color:#0288d1;background:white;font-weight:700;");
