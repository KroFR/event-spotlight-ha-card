[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)
[![GitHub Release](https://img.shields.io/github/v/release/KroFR/event-spotlight-ha-card)](https://github.com/KroFR/event-spotlight-ha-card/releases)
[![Home Assistant](https://img.shields.io/badge/Home_Assistant-2024.6+-blue)](https://www.home-assistant.io/)
[![HACS Validation](https://github.com/KroFR/event-spotlight-ha-card/actions/workflows/hacs.yaml/badge.svg)](https://github.com/KroFR/event-spotlight-ha-card/actions/workflows/hacs.yaml)
[![License](https://img.shields.io/github/license/KroFR/event-spotlight-ha-card)](https://github.com/KroFR/event-spotlight-ha-card/blob/main/LICENSE)

# 📅 Event Spotlight Card

A custom Lovelace card for [Home Assistant](https://www.home-assistant.io/) that highlights the calendar events that matter to you.

Instead of displaying every event from your calendars, Event Spotlight Card uses rules to select specific events and present them with custom labels, icons, colors, and layouts. Use it for waste collections, birthdays, anniversaries, medical appointments, reminders, or any other events you want to keep in sight.

| Light Theme | Dark Theme |
|---|---|
| image | image |

## ✨ Features

- Monitor one or more `calendar.*` entities
- Display only events matching an Include rule
- Exclude unwanted events with Exclude rules
- Match title, description, location, or calendar source
- Match using `contains`, `equals`, `starts_with`, `ends_with`, or regular expressions
- Customize matching events with labels, MDI icons, Home Assistant colors, or custom CSS colors
- Six layouts: `Bubble`, `Chips`, `List`, `Mushroom`, `Pro`, and `Square`
- Five alignment modes: `Left`, `Center`, `Right`, `Justified`, and `Stretched`
- Optional relative date, event time, description, location, and calendar source
- Reorder event details directly from the visual editor
- Configure when today's all-day events disappear
- Configure search range and automatic refresh interval
- Show or hide the card header, header icon, and outer card background
- Light and dark theme support
- English and French, with automatic Home Assistant language detection
- Full Lovelace visual editor

> [!IMPORTANT]
> Event Spotlight Card is rule-driven. An event must match at least one **Include** rule to be displayed. An **Exclude** rule always takes priority.

## ℹ️ Prerequisites

- Home Assistant 2024.6 or newer
- At least one `calendar.*` entity

The card retrieves upcoming calendar data using Home Assistant's `calendar.get_events` action.

## 📦 Installation

### HACS (recommended)

1. Open HACS in Home Assistant.
2. Open the three-dot menu and select **Custom repositories**.
3. Add: `https://github.com/KroFR/event-spotlight-ha-card`
4. Select **Dashboard** as the category.
5. Click **Add**.
6. Search for **Event Spotlight Card** and install it.
7. Refresh Home Assistant if required.

### Manual

1. Download `event-spotlight-card.js` from the `dist` folder of this repository.
2. Copy it to `/config/www/event-spotlight-card.js`.
3. Go to **Settings > Dashboards > Resources**.
4. Add `/local/event-spotlight-card.js` as a **JavaScript module**.
5. Refresh the browser.

## 🚀 Getting started

1. Edit a dashboard and select **Add Card**.
2. Search for **Event Spotlight Card**.
3. Add one or more calendars.
4. Open **Event rules** and create at least one Include rule.
5. Choose a layout and customize the appearance.

A minimal useful configuration looks like this:

```yaml
type: custom:event-spotlight-card
calendars:
  - entity: calendar.family
rules:
  - action: include
    field: summary
    operator: contains
    value: Birthday
    icon: mdi:cake-variant
    color: pink
```

Without a matching Include rule, the card displays `No matching events`.

## ⚙️ Configuration

### Calendars

Add one or more Home Assistant calendar entities:

```yaml
calendars:
  - entity: calendar.family
  - entity: calendar.personal
  - entity: calendar.waste_collection
```

The calendars are only event sources. Event rules decide which events are displayed.

### General options

| Name | Type | Required | Default | Description |
|---|---|---:|---|---|
| `type` | string | yes | — | `custom:event-spotlight-card` |
| `calendars` | list | yes | — | One or more `calendar.*` entities |
| `name` | string | no | `Event spotlight` | Card header title |
| `days` | number | no | `30` | Number of days to search ahead |
| `update_interval` | number | no | `60` | Calendar refresh interval in minutes, from 1 to 1440 |
| `all_day_hide_time` | time | no | `23:59` | Time at which today's all-day events disappear |
| `language` | string | no | `auto` | `auto`, `en`, or `fr` |
| `layout` | string | no | `mushroom` | `bubble`, `chips`, `list`, `mushroom`, `pro`, or `square` |
| `card_alignment` | string | no | `left` | `left`, `center`, `right`, `justified`, or `stretched` |
| `show_title` | boolean | no | `true` | Show the card header |
| `show_title_icon` | boolean | no | `true` | Show the icon in the card header |
| `show_card_background` | boolean | no | `true` | Show the outer Home Assistant card background |
| `show_relative_date` | boolean | no | `true` | Show relative dates such as `Today` and `In 3 days` |
| `show_time` | boolean | no | `true` | Show event time when available |
| `show_description` | boolean | no | `false` | Show event description when available |
| `show_location` | boolean | no | `false` | Show event location when available |
| `show_calendar_source` | boolean | no | `false` | Show the source calendar name |
| `display_order` | list | no | `date_time`, `description`, `location`, `calendar` | Order of event details |

## 🎯 Event rules

Rules are the core of Event Spotlight Card.

### Include rules

An event must match at least one Include rule to appear. The first matching Include rule also supplies the event's optional label, icon, color, and background settings.

```yaml
rules:
  - action: include
    field: summary
    operator: contains
    value: Birthday
    label: Birthday
    icon: mdi:cake-variant
    color: pink
```

### Exclude rules

Exclude rules remove matching events, even if an Include rule also matches.

```yaml
rules:
  - action: exclude
    field: summary
    operator: contains
    value: Cancelled
```

### Rule options

| Name | Values | Description |
|---|---|---|
| `action` | `include`, `exclude` | Include/customize or exclude a matching event |
| `field` | `summary`, `description`, `location`, `calendar` | Event field to inspect |
| `operator` | `contains`, `equals`, `starts_with`, `ends_with`, `regex` | Matching method |
| `value` | string | Value or pattern to match |
| `label` | string | Optional title replacing the calendar event summary |
| `icon` | string | Optional MDI icon, for example `mdi:recycle` |
| `color` | string | Optional Home Assistant or custom CSS color |
| `show_icon_background_color` | boolean | Apply the selected color to the icon background |
| `show_background_color` | boolean | Apply a subtle selected color to the event background |

### Matching operators

| Operator| Description |
| ------- | ----------- |
| `contains` | Matches when the selected field contains the specified value anywhere in its text. |
| `equals` | Matches only when the entire selected field exactly matches the specified value. |
| `starts_with` | Matches when the selected field starts with the specified value. |
| `ends_with` | Matches when the selected field ends with the specified value. |
| `regex` | Matches the selected field against a JavaScript regular expression for more advanced patterns. |

Regex matching uses JavaScript regular expressions with Unicode and case-insensitive matching. Invalid expressions simply do not match.

Examples:

| Pattern | Example matches |
|---|---|
| `birthday\|anniversary` | Birthday or anniversary anywhere in the selected field |
| `^birthday` | Values starting with `birthday` |
| `birthday$` | Values ending with `birthday` |
| `\b(doctor\|physician\|dentist)\b` | Matches doctor, physician, or dentist as complete words |
| `recycl(e\|ing\|ables)` | Different recycling terms |

Example:

```yaml
rules:
  - action: include
    field: summary
    operator: regex
    value: '\b(doctor\|physician\|dentist\b'
    label: Medical appointment
    icon: mdi:doctor
    color: red
```

## 🎨 Colors

The card supports Home Assistant theme colors:

`primary`, `accent`, `red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`, `brown`, `light-grey`, `grey`, `dark-grey`, and `blue-grey`.

Custom CSS colors are also supported, including hexadecimal values:

```yaml
color: "#ff0000"
```

With transparency:

```yaml
color: "#ff000080"
```

## 🎨 Layouts

### Mushroom

The default layout. Events are displayed as compact Mushroom-style cards with an icon, title, and selected details.

| Light Theme | Dark Theme |
|---|---|
| image | image |

### Chips

Displays matching events as compact pill-shaped chips. Useful when dashboard space is limited.

| Light Theme | Dark Theme |
|---|---|
| image | image |

### Bubble

Groups events by day and displays each event as a compact timeline entry. Event time and relative date stay on the first line. Description, location, and calendar source follow the configured display order.

| Light Theme | Dark Theme |
|---|---|
| image | image |

### List

Displays one event per full-width row with the selected details underneath the event title.

| Light Theme | Dark Theme |
|---|---|
| image | image |

### Pro

Groups events by day in a full-width timeline-style layout. The day is displayed once, and event details use dedicated icons for time, description, location, and calendar source.

| Light Theme | Dark Theme |
|---|---|
| image | image |

### Square

Displays matching events as responsive square-style tiles.

| Light Theme | Dark Theme |
|---|---|
| image | image |

## ↔️ Card alignment

The card provides five alignment modes.

| Alignment | Behavior |
|---|---|
| `left` | Align cards to the left |
| `center` | Center cards |
| `right` | Align cards to the right |
| `justified` | Keep natural card widths and distribute free space between them |
| `stretched` | Determine how many natural-width cards fit, then expand the columns evenly across the available width |

## 📅 All-day events

`all_day_hide_time` controls when an all-day event occurring today disappears from the card. The default is `23:59`.

```yaml
all_day_hide_time: "18:00"
```

In this example, today's all-day matching events disappear after 18:00.

## 🔄 Refresh interval

The default update interval is 60 minutes. Valid values are from 1 to 1440 minutes.

```yaml
update_interval: 15
```

Use a shorter interval when calendar changes need to appear more quickly.

## 📝 Usage examples

### Waste collections

```yaml
type: custom:event-spotlight-card
name: Waste collection
calendars:
  - entity: calendar.waste_collection
layout: mushroom
rules:
  - action: include
    field: summary
    operator: contains
    value: Recyclables
    label: Recyclables
    icon: mdi:recycle
    color: yellow

  - action: include
    field: summary
    operator: contains
    value: Waste
    label: Household waste
    icon: mdi:trash-can
    color: dark-grey
```

### Birthdays and anniversaries

```yaml
type: custom:event-spotlight-card
calendars:
  - entity: calendar.family
rules:
  - action: include
    field: summary
    operator: regex
    value: 'birthday|anniversary'
    icon: mdi:cake-variant
    color: pink
```

### Medical appointments

```yaml
type: custom:event-spotlight-card
calendars:
  - entity: calendar.personal
rules:
  - action: include
    field: summary
    operator: regex
    value: '\b(docteur|médecin|medecin|dentiste)\b'
    label: Medical appointment
    icon: mdi:doctor
    color: red
```

### Include a category but remove cancelled events

```yaml
type: custom:event-spotlight-card
calendars:
  - entity: calendar.personal
rules:
  - action: include
    field: summary
    operator: contains
    value: Appointment
    icon: mdi:calendar-clock
    color: blue

  - action: exclude
    field: summary
    operator: contains
    value: Cancelled
```

### Match a specific source calendar

```yaml
type: custom:event-spotlight-card
calendars:
  - entity: calendar.family
  - entity: calendar.personal
rules:
  - action: include
    field: calendar
    operator: equals
    value: Family
    icon: mdi:account-group
    color: green
```

## 📄 License

[![License](https://img.shields.io/github/license/KroFR/event-spotlight-ha-card)](https://github.com/KroFR/event-spotlight-ha-card/blob/main/LICENSE)

Released under the MIT License.
