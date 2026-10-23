/*
 * Calendar Events Card for Home Assistant
 * Displays and customizes events from one or more Home Assistant calendars.
 *
 * License: MIT
 */
 
const CARD_VERSION = "1.0.9";

/* ---------------------------------------------------------------------- */
/*  Main card                                                             */
/* ---------------------------------------------------------------------- */
class CalendarEventsCard extends HTMLElement {
	static TRANSLATIONS = {
		en: {
			title: "Calendar events",
			loading: "Loading events…",
			empty: "No upcoming events",
			today: "Today",
			tomorrow: "Tomorrow",
			in_days: "In {n} days",
			all_day: "All day",
			error: "Unable to load calendar events",
		},
		fr: {
			title: "Événements du calendrier",
			loading: "Chargement des événements…",
			empty: "Aucun événement à venir",
			today: "Aujourd’hui",
			tomorrow: "Demain",
			in_days: "Dans {n} jours",
			all_day: "Toute la journée",
			error: "Impossible de charger les événements",
		},
	};

	static FIELD_DEFAULTS = {
		days: 30,
		update_interval: 60,
		all_day_hide_time: "23:59",
		layout: "mushroom",
		card_alignment: "left",
		language: "auto",
		show_title: true,
		show_title_icon: true,
		show_card_background: true,
		show_calendar_source: false,
		show_relative_date: true,
		show_time: true,
		show_description: false,
		show_location: false,
		display_order: ["date_time", "description", "location", "calendar"],
	};

	static getConfigElement() {
		return document.createElement("calendar-events-card-editor");
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
							event_mode: "all",
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
		this._allDayTimer = null;
		this._updateTimer = null;
	}
	disconnectedCallback() {
		if (this._allDayTimer) clearTimeout(this._allDayTimer);
		if (this._updateTimer) clearTimeout(this._updateTimer);
	}

	setConfig(config) {
		const calendars = this._normalizeCalendars(
			config.calendars || config.entities || [],
		);
		this._config = { ...config, calendars };
		this._scheduleUpdate();
		if (this._hass) this._loadEvents();
	}

	set hass(hass) {
		this._hass = hass;
		if (!this.shadowRoot) this.attachShadow({ mode: "open" });
		this._render();
		const key = JSON.stringify([this._calendarSettingsKey(), this._config?.days, this._config?.filters]);
		if (key !== this._loadKey) this._loadEvents();
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
			.map((item) => {
				const calendar = typeof item === "string" ? { entity: item } : { ...item };

				return {
					...calendar,
					event_mode: calendar.event_mode === "filtered" ? "filtered" : "all",
				};
			})
			.filter((item) => item?.entity?.startsWith("calendar."));
	}

	_calendarSettingsKey() {
		return (this._config?.calendars || []).map((item) => ({
			entity: item.entity,
			event_mode: item.event_mode || "all",
		}));
	}

	_lang() {
		const configured = this._config?.language;
		if (configured && configured !== "auto")
			return CalendarEventsCard.TRANSLATIONS[configured] ? configured : "en";
		const language = (
			this._hass?.locale?.language ||
			this._hass?.language ||
			"en"
		).split("-")[0];
		return CalendarEventsCard.TRANSLATIONS[language] ? language : "en";
	}

	_t(lang, key, n) {
		return (
			CalendarEventsCard.TRANSLATIONS[lang]?.[key] ||
			CalendarEventsCard.TRANSLATIONS.en[key] ||
			key
		).replace("{n}", n ?? "");
	}

	_escape(value = "") {
		return String(value)
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");
	}

	_date(value) {
		if (/^\d{4}-\d{2}-\d{2}$/.test(value || "")) {
			const [y, m, d] = value.split("-").map(Number);
			return new Date(y, m - 1, d);
		}
		return new Date(value);
	}

	_ruleMatches(event, rule) {
		const value = String(rule.value || "").trim();
		if (!value) return false;

		const operator = rule.operator || "contains";
		const normalize = (text) => String(text || "").trim().toLocaleLowerCase();
		const expected = normalize(value);

		if (rule.field === "calendar") {
			const calendarId = normalize(event.calendar);
			const calendarName = normalize(event.calendar_name);

			if (operator === "equals") {
				return calendarId === expected || calendarName === expected;
			}

			const source = `${event.calendar || ""} ${event.calendar_name || ""}`.trim();
			const normalizedSource = normalize(source);
			if (operator === "starts_with") return normalizedSource.startsWith(expected);
			if (operator === "ends_with") return normalizedSource.endsWith(expected);
			if (operator === "regex") {
				try {
					return new RegExp(value, "iu").test(source);
				} catch (_) {
					return false;
				}
			}
			return normalizedSource.includes(expected);
		}

		const source = String(event[rule.field || "summary"] || "");
		const normalizedSource = normalize(source);
		if (operator === "equals") return normalizedSource === expected;
		if (operator === "starts_with") return normalizedSource.startsWith(expected);
		if (operator === "ends_with") return normalizedSource.endsWith(expected);
		if (operator === "regex") {
			try {
				return new RegExp(value, "iu").test(source);
			} catch (_) {
				return false;
			}
		}
		return normalizedSource.includes(expected);
	}
	_decorate(event, calendar) {
		const state = this._hass.states[calendar.entity];
		const calendarName =
			calendar.name || state?.attributes?.friendly_name || calendar.entity;
		const base = {
			...event,
			calendar: calendar.entity,
			calendar_name: calendarName,
			calendar_event_mode: calendar.event_mode || "all",
			start_date: this._date(event.start),
		};
		const match = (this._config.filters || []).find(
			(rule) =>
				(rule.action || "include") === "include" &&
				this._ruleMatches(base, rule),
		);
		return {
			...base,
			label: String(match?.label || "").trim() || event.summary || calendarName,
			icon: this._safeIcon(match?.icon || calendar.icon || state?.attributes?.icon),
			color: this._resolveUiColor(match?.color),
			show_icon_background_color: match?.show_icon_background_color !== false,
			show_background_color: match?.show_background_color !== false,
		};
	}

	_safeIcon(icon, fallback = "mdi:calendar") {
		const value = String(icon || "").trim();
		return /^mdi:[a-z0-9-]+$/i.test(value) ? value : fallback;
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
			this._config?.update_interval ?? CalendarEventsCard.FIELD_DEFAULTS.update_interval,
		);
		return Number.isFinite(value) && value >= 1 && value <= 1440
			? value
			: CalendarEventsCard.FIELD_DEFAULTS.update_interval;
	}

	_scheduleUpdate() {
		if (this._updateTimer) clearTimeout(this._updateTimer);
		if (!this.isConnected || !this._config) return;
		this._updateTimer = setTimeout(() => {
			this._updateTimer = null;
			this._loadEvents();
			this._scheduleUpdate();
		}, this._updateIntervalMinutes() * 60 * 1000);
	}

	_allDayHideTime() {
		const value = String(this._config?.all_day_hide_time ?? CalendarEventsCard.FIELD_DEFAULTS.all_day_hide_time).trim();
		return /^([01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : CalendarEventsCard.FIELD_DEFAULTS.all_day_hide_time;
	}

	_isAllDayEventVisible(event, now = new Date()) {
		if (!/^\d{4}-\d{2}-\d{2}$/.test(event.start || "")) return true;
		const [hour, minute] = this._allDayHideTime().split(":").map(Number);
		const hideAt = new Date(event.start_date.getFullYear(), event.start_date.getMonth(), event.start_date.getDate(), hour, minute, 0, 0);
		return now < hideAt;
	}

	_scheduleAllDayRefresh() {
		if (this._allDayTimer) clearTimeout(this._allDayTimer);
		const now = new Date();
		const [hour, minute] = this._allDayHideTime().split(":").map(Number);
		const next = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute, 0, 0);
		if (next <= now) next.setDate(next.getDate() + 1);
		this._allDayTimer = setTimeout(() => {
			this._allDayTimer = null;
			this._render();
		}, Math.min(next.getTime() - now.getTime() + 1000, 2147483647));
	}

	_passes(event) {
		const rules = this._config.filters || [];
		const excludeRules = rules.filter(
			(rule) => (rule.action || "include") === "exclude" && rule.value,
		);

		if (excludeRules.some((rule) => this._ruleMatches(event, rule))) {
			return false;
		}

		if (event.calendar_event_mode === "all") {
			return true;
		}

		const includeRules = rules.filter(
			(rule) => (rule.action || "include") === "include" && rule.value,
		);

		return includeRules.some((rule) => this._ruleMatches(event, rule));
	}
	async _loadEvents() {
		if (!this._hass || !this._config || this._loading) return;
		const calendars = this._config.calendars || [];
		if (!calendars.length) {
			this._events = [];
			this._render();
			return;
		}
		this._loading = true;
		this._error = "";
		this._render();
		const days = Number(
			this._config.days ?? CalendarEventsCard.FIELD_DEFAULTS.days,
		);
		const start = new Date();
		const end = new Date(start.getTime() + days * 86400000);
		try {
			const result = await this._hass.connection.sendMessagePromise({
				type: "execute_script",
				sequence: [
					{
						action: "calendar.get_events",
						target: { entity_id: calendars.map((calendar) => calendar.entity) },
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
			const responses = calendars.map((calendar) => {
				const events = response?.[calendar.entity]?.events || [];
				return events.map((event) => this._decorate(event, calendar));
			});
			this._events = responses
				.flat()
				.filter((event) => this._passes(event))
				.sort((a, b) => a.start_date - b.start_date);
			this._loadKey = JSON.stringify([this._calendarSettingsKey(), this._config.days, this._config.filters]);
		} catch (error) {
			console.error(
				"Calendar Events Card: failed to load calendar events",
				error,
			);
			this._error = error?.message || "error";
		} finally {
			this._loading = false;
			this._render();
			this._scheduleUpdate();
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
			CalendarEventsCard.FIELD_DEFAULTS.show_relative_date;
		if (!showRelativeDate)
			label = new Intl.DateTimeFormat(lang, {
				weekday: "short",
				day: "numeric",
				month: "short",
			}).format(d);
		const showTime =
			this._config.show_time ?? CalendarEventsCard.FIELD_DEFAULTS.show_time;
		if (
			showTime &&
			!/^\d{4}-\d{2}-\d{2}$/.test(event.start || "")
		)
			label += ` · ${new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit" }).format(d)}`;
		return label;
	}

	_displayOrder() {
		const defaults = CalendarEventsCard.FIELD_DEFAULTS.display_order;
		const configured = Array.isArray(this._config.display_order) ? this._config.display_order : [];
		return [...configured.filter((key) => defaults.includes(key)), ...defaults.filter((key) => !configured.includes(key))];
	}

	_render() {
		if (!this.shadowRoot || !this._config || !this._hass) {
			return;
		}

		const lang = this._lang();
		const configuredLayout = this._config.layout || CalendarEventsCard.FIELD_DEFAULTS.layout;
		const layout = ["bubble", "chips", "list", "mushroom", "pro", "square"].includes(configuredLayout)
			? configuredLayout
			: CalendarEventsCard.FIELD_DEFAULTS.layout;
		const configuredAlignment = this._config.card_alignment || CalendarEventsCard.FIELD_DEFAULTS.card_alignment;
		const cardAlignment = ["left", "center", "right", "justified"].includes(configuredAlignment)
			? configuredAlignment
			: CalendarEventsCard.FIELD_DEFAULTS.card_alignment;
		const darkMode = Boolean(this._hass?.themes?.darkMode);
		const visibleEvents = this._events.filter((event) => this._isAllDayEventVisible(event));
		this._scheduleAllDayRefresh();

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
			if (layout === "bubble") {
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
						const showTime = this._config.show_time ?? CalendarEventsCard.FIELD_DEFAULTS.show_time;
						const showRelativeDate = this._config.show_relative_date ?? CalendarEventsCard.FIELD_DEFAULTS.show_relative_date;
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
							description: (this._config.show_description ?? CalendarEventsCard.FIELD_DEFAULTS.show_description) && event.description
								? `<div class="event-detail">${this._escape(event.description)}</div>` : "",
							location: (this._config.show_location ?? CalendarEventsCard.FIELD_DEFAULTS.show_location) && event.location
								? `<div class="event-detail">${this._escape(event.location)}</div>` : "",
							calendar: (this._config.show_calendar_source ?? CalendarEventsCard.FIELD_DEFAULTS.show_calendar_source)
								? `<div class="event-detail">${this._escape(event.calendar_name)}</div>` : "",
						};
						const extras = this._displayOrder()
							.filter((key) => key !== "date_time")
							.map((key) => extraBlocks[key] || "")
							.join("");
						return `<div class="bubble-event-line" style="--bubble-dot-color:${this._escape(dotColor)};--bubble-row-background:${this._escape(rowBackground)}">
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
						const showRelativeDate = this._config.show_relative_date ?? CalendarEventsCard.FIELD_DEFAULTS.show_relative_date;
						const showTime = this._config.show_time ?? CalendarEventsCard.FIELD_DEFAULTS.show_time;
						const showDescription = this._config.show_description ?? CalendarEventsCard.FIELD_DEFAULTS.show_description;
						const showLocation = this._config.show_location ?? CalendarEventsCard.FIELD_DEFAULTS.show_location;
						const showCalendarSource = this._config.show_calendar_source ?? CalendarEventsCard.FIELD_DEFAULTS.show_calendar_source;
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
							event.show_icon_background_color ? "" : "no-icon-background-color",
							event.show_background_color ? "" : "no-card-background-color",
						].filter(Boolean).join(" ");
						const backgroundMix = event.show_background_color ? "9%" : "0%";

						return `<div class="${eventClasses}" style="--event-color:${this._escape(event.color)};--event-background-mix:${backgroundMix}">
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
						description: (this._config.show_description ?? CalendarEventsCard.FIELD_DEFAULTS.show_description) && event.description
							? `<div class="event-detail">${this._escape(event.description)}</div>` : "",
						location: (this._config.show_location ?? CalendarEventsCard.FIELD_DEFAULTS.show_location) && event.location
							? `<div class="event-detail">${this._escape(event.location)}</div>` : "",
						calendar: (this._config.show_calendar_source ?? CalendarEventsCard.FIELD_DEFAULTS.show_calendar_source)
							? `<div class="event-detail">${this._escape(event.calendar_name)}</div>` : "",
					};
					const orderedDetails = this._displayOrder().map((key) => detailBlocks[key] || "").join("");

					const eventClasses = [
						"event",
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
						<div class="${eventClasses}" style="--event-color:${this._escape(event.color)};--event-background-mix:${backgroundMix};--event-background-base:${backgroundBase};--event-border-color:${borderColor}">
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
				<div class="events ${layout} align-${cardAlignment}">
					${eventBlocks}
				</div>`;
		}

		const title = this._escape(
			this._config.name || this._t(lang, "title"),
		);
		const showTitle = this._config.show_title ?? CalendarEventsCard.FIELD_DEFAULTS.show_title;
		const showTitleIcon = this._config.show_title_icon ?? CalendarEventsCard.FIELD_DEFAULTS.show_title_icon;
		const showCardBackground = this._config.show_card_background ?? CalendarEventsCard.FIELD_DEFAULTS.show_card_background;
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
	}

	_baseStyles() {
		return `
			/* ------------------------------------------------------------------ */
			/* Card shell and header                                               */
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
			.dark-mode .h-icon {
				background: var(--secondary-background-color);
				box-shadow:
					0 2px 8px rgba(0, 0, 0, 0.5),
					0 0 0 1px rgba(255, 255, 255, 0.06);
			}
			.h-icon ha-icon {
				color: #0288d1;
			}
			.title {
				font-size: 1.2em;
				font-weight: 600;
				color: var(--primary-text-color);
			}

			/* ------------------------------------------------------------------ */
			/* Shared container alignment                                         */
			/* ------------------------------------------------------------------ */
			.events.align-left { justify-content: start; }
			.events.align-center { justify-content: center; }
			.events.align-right { justify-content: end; }
			.events.align-justified { justify-content: space-between; width: 100%; }

			/* ------------------------------------------------------------------ */
			/* Bubble layout                                                       */
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
			/* Chips layout                                                        */
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
			/* List layout                                                         */
			/* ------------------------------------------------------------------ */
			.events.list {
				display: grid;
				grid-template-columns: 1fr;
				align-items: start;
				width: 100%;
				gap: 8px;
			}
			.list .event {
				display: flex;
				box-sizing: border-box;
				align-items: center;
				align-self: flex-start;
				gap: 10px;
				width: 100%;
				max-width: 100%;
				min-width: 0;
				min-height: 0;
				height: fit-content;
				padding: 10px;
				border: 1px solid var(--divider-color);
				border-radius: 12px;
				background: color-mix(
					in srgb,
					var(--event-color) var(--event-background-mix, 9%),
					var(--event-background-base, var(--ha-card-background, var(--card-background-color)))
				);
			}
			.list .event-icon {
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
			.list .event.no-icon-background-color .event-icon {
				background: transparent;
			}
			.list .event-text {
				min-width: 0;
			}
			.list .event-title {
				overflow: hidden;
				font-size: 14px;
				font-weight: 600;
				white-space: nowrap;
				text-overflow: ellipsis;
				color: var(--primary-text-color);
			}
			.list .event-date,
			.list .event-detail {
				font-size: 12px;
				color: var(--secondary-text-color);
			}
			.list .event-date {
				font-weight: 600;
			}

			/* ------------------------------------------------------------------ */
			/* Mushroom layout                                                     */
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
			/* Pro layout                                                          */
			/* ------------------------------------------------------------------ */
			.events.pro {
				display: grid;
				grid-template-columns: minmax(0, 1fr);
				width: 100%;
				gap: 0px;
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
				padding-right: 0;
				padding-left: 0;
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
				grid-template-columns: 18px minmax(0, 1fr);
				align-items: start;
				gap: 4px;
				font-size: 12px;
				font-weight: 400;
				color: var(--secondary-text-color);
			}
			.pro-detail ha-icon {
				--mdc-icon-size: 15px;
				color: currentColor;
			}
			.pro-detail span {
				min-width: 0;
				overflow-wrap: anywhere;
			}

			/* ------------------------------------------------------------------ */
			/* Square layout                                                       */
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
class CalendarEventsCardEditor extends HTMLElement {
	static SECTION_ICONS = {
		general: "mdi:cog-outline",
		calendars: "mdi:calendar-multiple",
		appearance: "mdi:palette-outline",
		filters: "mdi:filter-outline",
	};

	static _getDeepActiveElement() {
		let active = document.activeElement;
		while (active?.shadowRoot?.activeElement)
			active = active.shadowRoot.activeElement;
		return active;
	}

	constructor() {
		super();
		this._rendered = false;
		this._filterInputTimer = null;
		this._sectionState = {
			calendars: false,
			general: false,
			appearance: false,
			filters: false,
		};
	}

	setConfig(config) {
		this._config = {
			...config,
		};

		if (!this._rendered) {
			this._render();
			this._rendered = true;
		}

		this._updateValues();
	}

	set hass(hass) {
		this._hass = hass;
		if (!this._rendered && this._config) {
			this._render();
			this._rendered = true;
		}
		this._updateValues();
	}

	connectedCallback() {
		if (!this._rendered && this._config) {
			this._render();
			this._rendered = true;
			this._updateValues();
		}
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
		const defaults = CalendarEventsCard.FIELD_DEFAULTS.display_order;
		const configured = Array.isArray(this._config.display_order) ? this._config.display_order : [];
		return [...configured.filter((key) => defaults.includes(key)), ...defaults.filter((key) => !configured.includes(key))];
	}

	_appearanceRows() {
		const isBubble = (this._config.layout || CalendarEventsCard.FIELD_DEFAULTS.layout) === "bubble";
		const rows = {
			date_time: `<div class="appearance-switches">${this._switchRow("show_relative_date", "Show relative date")}${this._switchRow("show_time", "Show event time")}</div>`,
			description: this._switchRow("show_description", "Show description"),
			location: this._switchRow("show_location", "Show location"),
			calendar: this._switchRow("show_calendar_source", "Show calendar name"),
		};
		const order = isBubble
			? ["date_time", ...this._displayOrder().filter((key) => key !== "date_time")]
			: this._displayOrder();
		return order.map((key) => {
			const locked = isBubble && key === "date_time";
			return `<div class="appearance-order-row${locked ? " locked" : ""}" draggable="${locked ? "false" : "true"}" data-display-key="${key}"><ha-icon class="drag-handle" icon="${locked ? "mdi:lock-outline" : "mdi:drag"}"></ha-icon><div class="appearance-order-content">${rows[key]}</div></div>`;
		}).join("");
	}

	_calendarSettingsRows() {
		return (this._config.calendars || [])
			.map((calendar) => {
				const entityId = typeof calendar === "string" ? calendar : calendar.entity;
				const eventMode = typeof calendar === "string"
					? "all"
					: calendar.event_mode || "all";
				const state = this._hass?.states?.[entityId];
				const name = state?.attributes?.friendly_name || entityId;

				return `
					<div class="calendar-setting" data-calendar-entity="${this._escapeAttribute(entityId)}">
						<div class="calendar-setting-name">
							<ha-icon icon="${this._escapeAttribute(this._safeIcon(state?.attributes?.icon))}"></ha-icon>
							<div>
								<span>${this._escapeAttribute(name)}</span>
								<small>${this._escapeAttribute(entityId)}</small>
							</div>
						</div>
						<label>
							Event display
							<select data-calendar-mode>
								<option value="all"${eventMode === "all" ? " selected" : ""}>All events</option>
								<option value="filtered"${eventMode === "filtered" ? " selected" : ""}>Filtered events only</option>
							</select>
						</label>
						<button class="calendar-remove" data-calendar-remove type="button" title="Remove calendar">
							<ha-icon icon="mdi:delete-outline"></ha-icon>
						</button>
					</div>`;
			})
			.join("");
	}

	_safeCustomColor(color) {
		const value = String(color || "").trim();
		if (!value || /[;{}<>"']/.test(value)) return "";
		if (/^#[0-9a-f]{3,4}([0-9a-f]{3,4})?$/i.test(value)) return value;
		if (typeof CSS !== "undefined" && CSS.supports?.("color", value)) return value;
		return "";
	}

	_filterIconColor(rule) {
		if ((rule.action || "include") === "exclude") return "#64748b";
		const rawValue = String(rule.color || "").trim();
		const value = rawValue.toLowerCase();
		const themeColors = new Set([
			"accent", "red", "pink", "purple", "deep-purple", "indigo",
			"blue", "light-blue", "cyan", "teal", "green", "light-green",
			"lime", "yellow", "amber", "orange", "deep-orange", "brown",
			"light-grey", "grey", "dark-grey", "blue-grey",
		]);
		if (value === "accent") return "var(--accent-color)";
		if (value === "light-grey") return "var(--light-grey-color, #bdbdbd)";
		if (value === "dark-grey") return "var(--dark-grey-color, #616161)";
		if (themeColors.has(value)) return `var(--${value}-color, var(--secondary-text-color))`;
		return this._safeCustomColor(rawValue) || "var(--secondary-text-color)";
	}

	_filterRow(rule, index) {
		const action = rule.action || "include";
		const field = rule.field || "summary";
		const operator = rule.operator || "contains";
		const rawLabel = String(rule.label || "").trim();
		const rawValue = String(rule.value || "").trim();
		const label = this._escapeAttribute(rawLabel);
		const value = this._escapeAttribute(rawValue);
		const title = this._escapeAttribute(rawLabel || rawValue || `Filter ${index + 1}`);
		const rawIcon = rule.icon || (action === "exclude" ? "mdi:filter-remove-outline" : "");
		const icon = rawIcon ? this._escapeAttribute(this._safeIcon(rawIcon, "")) : "";
		const iconColor = this._escapeAttribute(this._filterIconColor(rule));
		const actionLabel = action === "exclude" ? "Exclude" : "Include";

		return `
			<details class="filter-rule" data-filter-index="${index}">
				<summary class="filter-rule-summary">
					<span class="filter-rule-identity">
						${icon ? `<ha-icon class="filter-rule-icon" icon="${icon}" style="color:${iconColor}"></ha-icon>` : ""}
						<span class="filter-rule-title">${title}</span>
					</span>
					<span class="filter-rule-actions">
						<span class="filter-type filter-type-${action}">${actionLabel}</span>
						<button class="filter-remove" data-filter-remove="${index}" type="button" title="Remove filter"><ha-icon icon="mdi:delete-outline"></ha-icon></button>
						<span class="filter-toggle-icons" aria-hidden="true">
							<ha-icon class="filter-toggle-down" icon="mdi:chevron-down"></ha-icon>
							<ha-icon class="filter-toggle-up" icon="mdi:chevron-up"></ha-icon>
						</span>
					</span>
				</summary>
				<div class="filter-rule-content">
				<div class="filter-grid">
					<div class="field">
						<span>Action</span>
						<select data-filter-key="action">
							<option value="include"${action === "include" ? " selected" : ""}>Include</option>
							<option value="exclude"${action === "exclude" ? " selected" : ""}>Exclude</option>
						</select>
					</div>
					<div class="field">
						<span>Field</span>
						<select data-filter-key="field">
							<option value="summary"${field === "summary" ? " selected" : ""}>Title</option>
							<option value="description"${field === "description" ? " selected" : ""}>Description</option>
							<option value="location"${field === "location" ? " selected" : ""}>Location</option>
							<option value="calendar"${field === "calendar" ? " selected" : ""}>Calendar</option>
						</select>
					</div>
					<div class="field">
						<span>Match</span>
						<select data-filter-key="operator">
							<option value="contains"${operator === "contains" ? " selected" : ""}>Contains</option>
							<option value="equals"${operator === "equals" ? " selected" : ""}>Equals</option>
							<option value="starts_with"${operator === "starts_with" ? " selected" : ""}>Starts with</option>
							<option value="ends_with"${operator === "ends_with" ? " selected" : ""}>Ends with</option>
							<option value="regex"${operator === "regex" ? " selected" : ""}>Regular expression</option>
						</select>
					</div>
				</div>
				<label>
					Value
					<input data-filter-key="value" type="text" value="${value}" placeholder="Text to match">
				</label>
				<label>
					Label
					<input data-filter-key="label" type="text" value="${label}" placeholder="Optional display label">
				</label>
				<div class="filter-appearance${action === "exclude" ? " hidden" : ""}">
					<ha-form class="filter-appearance-form" data-filter-form="${index}"></ha-form>
					<div class="filter-color-options">
						<label class="compact-option">
							<ha-switch data-filter-option="show_icon_background_color" ${rule.show_icon_background_color !== false ? "checked" : ""}></ha-switch>
							<span>Icon background color</span>
						</label>
						<label class="compact-option">
							<ha-switch data-filter-option="show_background_color" ${rule.show_background_color !== false ? "checked" : ""}></ha-switch>
							<span>Card background color</span>
						</label>
					</div>
				</div>
			</details>`;
	}
	_safeIcon(icon, fallback = "mdi:calendar") {
		const value = String(icon || "").trim();
		return /^mdi:[a-z0-9-]+$/i.test(value) ? value : fallback;
	}

	_escapeAttribute(value) {
		return String(value)
			.replaceAll("&", "&amp;")
			.replaceAll('"', "&quot;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;");
	}

	_render() {
		const icons = CalendarEventsCardEditor.SECTION_ICONS;
		const calendarSettingsRows = this._calendarSettingsRows();
		const filterBlocks = (this._config.filters || [])
			.map((rule, index) => this._filterRow(rule, index))
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

				.filter-list {
					display: grid;
					gap: 12px;
				}

				.filter-empty {
					padding: 14px;
					border: 1px dashed var(--divider-color);
					border-radius: 10px;
					color: var(--secondary-text-color);
					font-size: 13px;
					text-align: center;
				}

				.filter-rule { overflow: hidden; border: 1px solid var(--divider-color); border-radius: 10px; background: var(--secondary-background-color); }
				.filter-rule-summary { display:flex; align-items:center; gap:12px; padding:10px 12px; list-style:none; cursor:pointer; }
				.filter-rule-summary::-webkit-details-marker, .filter-rule-summary::after { display:none; }
				.filter-rule[open] .filter-rule-summary { border-bottom:1px solid var(--divider-color); }
				.filter-rule-identity { display:flex; align-items:center; gap:9px; min-width:0; flex:1 1 auto; }
				.filter-rule-actions { display:flex; align-items:center; gap:8px; margin-left:auto; justify-content:flex-end; flex:0 0 auto; }
				.filter-rule-icon { --mdc-icon-size:20px; color:var(--secondary-text-color); flex-shrink:0; }
				.filter-rule-title { overflow:hidden; color:var(--primary-text-color); font-size:14px; font-weight:600; text-overflow:ellipsis; white-space:nowrap; }
				.filter-type { padding:3px 7px; border-radius:999px; font-size:11px; font-weight:600; }
				.filter-type-include { color:var(--success-color,#43a047); background:color-mix(in srgb,var(--success-color,#43a047) 14%,transparent); }
				.filter-type-exclude { color:var(--error-color,#f44336); background:color-mix(in srgb,var(--error-color,#f44336) 14%,transparent); }
				.filter-remove {
					width: 32px;
					min-height: 32px;
					padding: 0;
					border: 0;
					border-radius: 0;
					color: var(--secondary-text-color);
					background: transparent;
				}
				.filter-toggle-icons { display:flex; align-items:center; justify-content:center; width:24px; color:var(--secondary-text-color); }
				.filter-toggle-icons ha-icon { --mdc-icon-size:20px; }
				.filter-toggle-up { display:none; }
				.filter-rule[open] .filter-toggle-down { display:none; }
				.filter-rule[open] .filter-toggle-up { display:block; }
				.filter-rule-content { display:grid; gap:12px; padding:12px; }
				.filter-grid {
					display: grid;
					grid-template-columns: repeat(3, minmax(0, 1fr));
					gap: 10px;
				}

				.filter-appearance-form {
					display: block;
					width: 100%;
				}

				.filter-color-options {
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

				.filter-icon-field,
				.filter-icon-selector {
					min-width: 0;
					max-width: 100%;
				}

				.filter-rule select {
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

				.filter-remove,
				.filter-add {
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

				.filter-remove {
					width: 38px;
					padding: 0;
					color: var(--secondary-text-color);
				}

				.filter-add {
					justify-self: start;
					color: var(--primary-color);
				}
				.filter-remove {
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
					.filter-grid,
					.filter-color-options,
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
					${this._sectionSummary(icons.calendars, "Calendars")}
					<div class="section-content">
						<div class="field">
							<span>Add calendar</span>
							<ha-selector data-calendar-add></ha-selector>
						</div>
						<div class="calendar-settings">
							${calendarSettingsRows || `<div class="calendar-empty">No calendar selected.</div>`}
						</div>
					</div>
				</details>

				<details class="section" data-section="general"${this._sectionState.general ? " open" : ""}>
					${this._sectionSummary(icons.general, "General")}
					<div class="section-content">
						<label>
							Card name
							<input data-config="name" type="text" placeholder="Calendar events">
						</label>
						<div class="grid">
							<label>
								Search range (days)
								<input data-config="days" type="number" min="1" max="365">
							</label>
							<label>
								Update interval (minutes)
								<input data-config="update_interval" type="number" min="1" max="1440" step="1">
							</label>
						</div>
						${this._selector("all_day_hide_time", "All-day event hide time")}
						${this._selector("language", "Card display language")}
					</div>
				</details>

				<details class="section" data-section="appearance"${this._sectionState.appearance ? " open" : ""}>
					${this._sectionSummary(icons.appearance, "Appearance")}
					<div class="section-content">
						<div class="grid">
							${this._selector("layout", "Layout")}
							${this._selector("card_alignment", "Card alignment")}
						</div>
						${this._switchRow("show_title", "Show card header")}
						${this._switchRow("show_title_icon", "Show header icon")}
						${this._switchRow("show_card_background", "Show card background")}
						<div class="appearance-order-list">${this._appearanceRows()}</div>
					</div>
				</details>

				<details class="section" data-section="filters"${this._sectionState.filters ? " open" : ""}>
					${this._sectionSummary(icons.filters, "Filters")}
					<div class="section-content">
						<div class="filter-list">
							${filterBlocks || `<div class="filter-empty">No filters configured.</div>`}
						</div>
						<button class="filter-add" id="add-filter" type="button">
							<ha-icon icon="mdi:plus"></ha-icon>
							Add filter
						</button>
					</div>
				</details>
			</div>`;

		this._initializeSelectors();
		this._initializeCalendarSettings();
		this._initializeInputs();
		this._initializeSwitches();
		this._initializeAppearanceOrder();
		this._initializeFilters();
		this._initializeSectionState();
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
					calendars.push({
						entity: entityId,
						event_mode: "all",
					});
					this._setCalendarConfig(calendars, true);
				} else {
					addSelector.value = "";
				}
			});
		}

		this.querySelectorAll("[data-calendar-mode]").forEach((select) => {
			select.addEventListener("change", () => {
				const row = select.closest("[data-calendar-entity]");
				const entityId = row?.dataset.calendarEntity;

				if (!entityId) {
					return;
				}

				const calendars = (this._config.calendars || []).map((calendar) => {
					const item = typeof calendar === "string" ? { entity: calendar } : { ...calendar };

					if (item.entity === entityId) {
						item.event_mode = select.value;
					}

					return item;
				});

				this._setCalendarConfig(calendars, false);
			});
		});

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
		this.dispatchEvent(
			new CustomEvent("config-changed", {
				detail: { config: { ...config } },
				bubbles: true,
				composed: true,
			}),
		);

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
		if (JSON.stringify(order) === JSON.stringify(CalendarEventsCard.FIELD_DEFAULTS.display_order)) delete config.display_order;
		this._config = config;
		this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: { ...config } }, bubbles: true, composed: true }));
	}

	_initializeFilters() {
		const appearanceSchema = [
			{
				type: "grid",
				name: "",
				schema: [
					{
						name: "icon",
						label: "Icon",
						selector: { icon: {} },
						context: { icon_entity: "entity" },
					},
					{
						name: "color",
						label: "Color",
						selector: { ui_color: {} },
					},
				],
			},
		];

		this.querySelectorAll("[data-filter-form]").forEach((form) => {
			const index = Number(form.dataset.filterForm);
			const rule = (this._config.filters || [])[index] || {};

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
				const filters = [...(this._config.filters || [])];
				const current = { ...(filters[index] || {}) };
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

				filters[index] = current;
				this._config = { ...this._config, filters };
				const row = form.closest("[data-filter-index]");
				const desiredIcon = current.icon || ((current.action || "include") === "exclude" ? "mdi:filter-remove-outline" : "");
				this._updateFilterTitleIcon(row, desiredIcon, this._filterIconColor(current));
				this._setFilters(filters, false);
			});
		});
		this.querySelectorAll("[data-filter-option]").forEach((toggle) => {
			toggle.addEventListener("change", () => {
				const row = toggle.closest("[data-filter-index]");
				const index = Number(row?.dataset.filterIndex);
				const key = toggle.dataset.filterOption;
				const filters = [...(this._config.filters || [])];
				const current = { ...(filters[index] || {}) };

				if (toggle.checked) {
					delete current[key];
				} else {
					current[key] = false;
				}

				filters[index] = current;
				this._setFilters(filters, false);
			});
		});

		this.querySelector("#add-filter")?.addEventListener("click", () => {
			const filters = [
				...(this._config.filters || []),
				{
					action: "include",
					field: "summary",
					operator: "contains",
					value: "",
				},
			];

			this._sectionState.filters = true;
			this._setFilters(filters, true);
		});

		this.querySelectorAll("[data-filter-remove]").forEach((button) => {
			button.addEventListener("click", (event) => {
				event.preventDefault(); event.stopPropagation();
				const index = Number(button.dataset.filterRemove);
				const filters = (this._config.filters || []).filter(
					(_, filterIndex) => filterIndex !== index,
				);

				this._sectionState.filters = true;
				this._setFilters(filters, true);
			});
		});

		this.querySelectorAll("[data-filter-key]").forEach((element) => {
			if (element.tagName === "HA-SELECTOR") {
				element.hass = this._hass;
				element.selector = { icon: {} };
				element.value = element.dataset.filterValue || "";
				element.addEventListener("value-changed", (event) => {
					this._updateFilterElement(element, event.detail?.value ?? "", false);
				});
				return;
			}

			const eventName = element.tagName === "SELECT" ? "change" : "input";
			element.addEventListener(eventName, () => {
				this._updateFilterElement(element, element.value, false);
			});
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

	_updateFilterVisual(row, key, value) {
		if (!row) return;
		const index = Number(row.dataset.filterIndex);
		const current = this._config.filters?.[index] || {};

		if (key === "label" || key === "value") {
			const title = row.querySelector(".filter-rule-title");
			const label = key === "label" ? value : current.label;
			const filterValue = key === "value" ? value : current.value;
			if (title) {
				title.textContent = String(label || "").trim() || String(filterValue || "").trim() || `Filter ${index + 1}`;
			}
		}

		if (key === "action") {
			const isExclude = value === "exclude";
			const badge = row.querySelector(".filter-type");
			const appearance = row.querySelector(".filter-appearance");
			if (badge) {
				badge.textContent = isExclude ? "Exclude" : "Include";
				badge.className = `filter-type filter-type-${isExclude ? "exclude" : "include"}`;
			}
			appearance?.classList.toggle("hidden", isExclude);
			this._updateFilterTitleIcon(
				row,
				current.icon || (isExclude ? "mdi:filter-remove-outline" : ""),
				this._filterIconColor({ ...current, action: value }),
			);
		}
	}

	_updateFilterTitleIcon(row, iconValue, colorValue) {
		const identity = row?.querySelector(".filter-rule-identity");
		let icon = row?.querySelector(".filter-rule-icon");
		const desiredIcon = iconValue ? this._safeIcon(iconValue, "") : "";
		if (!desiredIcon) {
			icon?.remove();
			return;
		}
		if (!icon && identity) {
			icon = document.createElement("ha-icon");
			icon.className = "filter-rule-icon";
			identity.prepend(icon);
		}
		icon?.setAttribute("icon", desiredIcon);
		if (icon) icon.style.color = colorValue || "var(--secondary-text-color)";
	}

	_updateFilterElement(element, value, rerender) {
		const row = element.closest("[data-filter-index]");
		const index = Number(row?.dataset.filterIndex);
		const key = element.dataset.filterKey;

		if (!Number.isInteger(index) || !key) {
			return;
		}

		this._updateFilterVisual(row, key, value);

		const filters = (this._config.filters || []).map((rule, filterIndex) =>
			filterIndex === index
				? { ...rule, [key]: value }
				: rule,
		);

		if (this._filterInputTimer) {
			clearTimeout(this._filterInputTimer);
		}

		if (rerender) {
			this._setFilters(filters, true);
			return;
		}

		this._config = {
			...this._config,
			filters,
		};

		this._filterInputTimer = setTimeout(() => {
			this._setFilters(this._config.filters || [], false);
		}, 200);
	}

	_setFilters(filters, rerender = true) {
		const config = {
			...this._config,
			filters,
		};

		if (!filters.length) {
			delete config.filters;
		}

		this._config = config;
		this.dispatchEvent(
			new CustomEvent("config-changed", {
				detail: {
					config: { ...config },
				},
				bubbles: true,
				composed: true,
			}),
		);

		if (rerender) {
			this._sectionState.filters = true;
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
							{ value: "auto", label: "Auto" },
							{ value: "en", label: "English" },
							{ value: "fr", label: "Français" },
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
							{ value: "list", label: "List" },
							{ value: "mushroom", label: "Mushroom" },
							{ value: "pro", label: "Pro" },
							{ value: "square", label: "Square" },
						],
					},
				};
			else if (key === "card_alignment")
				s.selector = {
					select: {
						mode: "dropdown",
						options: [
							{ value: "left", label: "Left" },
							{ value: "center", label: "Center" },
							{ value: "right", label: "Right" },
							{ value: "justified", label: "Justified" },
						],
					},
				};
			else s.selector = { object: {} };
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
					this._config[key] ?? CalendarEventsCard.FIELD_DEFAULTS[key];
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
			else if (CalendarEventsCardEditor._getDeepActiveElement() !== e)
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
		const defaultValue = CalendarEventsCard.FIELD_DEFAULTS[key];
		if (
			value === "" ||
			value === undefined ||
			value === defaultValue
		)
			delete config[key];
		this._config = config;
		this.dispatchEvent(
			new CustomEvent("config-changed", {
				detail: { config: { ...config } },
				bubbles: true,
				composed: true,
			}),
		);
		if (key === "layout") {
			this._render();
			this._updateValues();
		}
	}
}

/* ---------------------------------------------------------------------- */
/*  Registration                                                          */
/* ---------------------------------------------------------------------- */
if (!customElements.get("calendar-events-card"))
	customElements.define("calendar-events-card", CalendarEventsCard);

if (!customElements.get("calendar-events-card-editor"))
	customElements.define(
		"calendar-events-card-editor",
		CalendarEventsCardEditor,
	);

window.customCards = window.customCards || [];

window.customCards.push({
	type: "calendar-events-card",
	name: "Calendar Events Card",
	description:
		"Display upcoming calendar events, appointments, schedules and reminders, trash, birthday, anniversary from Home Assistant calendars.",
	preview: true,
	documentationURL: "https://github.com/KroFR/calendar-events-ha-card",

	getEntitySuggestion: (hass, entityId) => {
		if (!entityId.startsWith("calendar.")) {
			return null;
		}
		return {
			config: {
				type: "custom:calendar-events-card",
				calendars: [
					{
						entity: entityId,
						event_mode: "all",
					},
				],
			},
		};
	},
});

console.info(`%c 📅 CALENDAR-EVENTS-CARD %c v${CARD_VERSION} `, "color:white;background:#0288d1;font-weight:700;", "color:#0288d1;background:white;font-weight:700;");
