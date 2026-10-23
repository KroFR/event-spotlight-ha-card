[![HACS Custom](https://img.shields.io/badge/HACS-Custom-orange.svg)](https://hacs.xyz/)
[![GitHub Release](https://img.shields.io/github/v/release/KroFR/calendar-events-ha-card)](https://github.com/KroFR/calendar-events-ha-card/releases)
[![Home Assistant](https://img.shields.io/badge/Home_Assistant-2024.6+-blue)](https://www.home-assistant.io/)
[![HACS Validation](https://github.com/KroFR/calendar-events-ha-card/actions/workflows/hacs.yaml/badge.svg)](https://github.com/KroFR/calendar-events-ha-card/actions/workflows/hacs.yaml)
[![License](https://img.shields.io/github/license/KroFR/calendar-events-ha-card)](https://github.com/KroFR/calendar-events-ha-card/blob/main/LICENSE)

# 📅 Calendar Events Card

A custom Lovelace card for [Home Assistant](https://www.home-assistant.io/) that displays upcoming events from one or more calendar entities.

Calendar Events Card supports multiple layouts, per-calendar display modes, include/exclude filters, custom labels, icons and colors, relative dates, event details, and a full visual editor.

Whether you want to keep track of the next wast collection or never miss a family or friend’s birthday again, this card is made for you!

| From default | To fully customized, no YAML |
|---|---|
| <img width="501" height="277" alt="image" src="https://github.com/user-attachments/assets/7cb87eeb-eacb-4850-b3ef-e3862255fa98" /> | <img width="502" height="276" alt="image" src="https://github.com/user-attachments/assets/65945f8b-fc4d-4822-89c2-6be025238d2c" /> |

## ✨ Features

- Display events from one or more `calendar.*` entities
- Six layouts: Mushroom, Bubble, Chips, List, Pro, and Square
- Show all events or only filtered events independently for each calendar
- Include and exclude filters for title, description, location, and calendar
- Match events using contains, equals, starts with, ends with, or regular expressions
- Customize matching events with a label, MDI icon, and Home Assistant color
- Optional icon and event background colors
- Relative dates such as `Today`, `Tomorrow`, and `In 3 days`
- Optional time, description, location, and calendar name
- Reorder event details directly from the visual editor
- Configurable all-day event hide time
- Configurable search range and refresh interval
- Card header and card background controls
- Left, center, right, and justified alignment
- Light and dark theme support
- Multilanguage support with automatic Home Assistant language detection
- Full Lovelace visual editor, no YAML

## ℹ️ Prerequisites

The card uses standard Home Assistant `calendar.*` entities and retrieves upcoming events with `calendar.get_events`.

At least one calendar entity is required.

## 📦 Installation

### HACS (recommended)

1. Open HACS in Home Assistant.
2. Click on the three dots in the top right corner.
3. Select Custom repositories.
4. Add this repository URL: https://github.com/KroFR/calendar-events-ha-card
5. Select Dashboard as the category.
6. Click Add.
7. Search for Calendar Events Card and install it.

### Manual

1. Download `calendar-events-card.js` from the `dist` folder of this repository.
2. Copy it to `/www/calendar-events-card.js` in your Home Assistant instance.
3. Go to **Settings** > **Dashboards** > three-dot menu > **Resources**.
4. Select **Add resource**.
5. Set the URL to `/local/calendar-events-card.js?v=1`.
6. Set the resource type to **JavaScript module**.
7. Refresh your browser.

## Adding the card

1. Edit a dashboard and select **Add Card**.
2. Search for **Calendar Events Card**, or select **Manual** and use the YAML shown below.
3. Add one or more calendars.
4. Configure the layout, event information, and optional filters in the visual editor.

## ⚙️ Configuration

### Calendar configuration

Each calendar supports two event modes.

| Option | Description |
|---|---|
| `all` | Display all calendar events. Use filters to customize matching events. |
| `filtered` | Display only events that match an include filter. |

Example:

```yaml
calendars:
  - entity: calendar.family
    event_mode: all
  - entity: calendar.waste_collection
    event_mode: filtered
```

### General options

| Name | Type | Required | Default | Description |
|---|---|---:|---|---|
| `type` | string | yes | — | `custom:calendar-events-card` |
| `calendars` | list | yes | — | Calendar entities and their event display modes |
| `name` | string | no | `Calendar events` | Card title |
| `days` | number | no | `30` | Number of days to search for upcoming events |
| `update_interval` | number | no | `60` | Calendar refresh interval in minutes, from 1 to 1440 |
| `all_day_hide_time` | time | no | `23:59` | Time at which today's all-day events disappear |
| `language` | string | no | `auto` | `auto`, `en`, or `fr` |
| `layout` | string | no | `mushroom` | `mushroom`, `bubble`, `chips`, `list`, `pro`, or `square` |
| `card_alignment` | string | no | `left` | `left`, `center`, `right`, or `justified` |
| `show_title` | boolean | no | `true` | Show the card header |
| `show_title_icon` | boolean | no | `true` | Show the calendar icon in the header |
| `show_card_background` | boolean | no | `true` | Show the outer Home Assistant card background |
| `show_relative_date` | boolean | no | `true` | Show relative dates |
| `show_time` | boolean | no | `true` | Show event time when available |
| `show_description` | boolean | no | `false` | Show the event description when available |
| `show_location` | boolean | no | `false` | Show the event location when available |
| `show_calendar_source` | boolean | no | `false` | Show the source calendar name for each event |
| `display_order` | list | no | `date_time`, `description`, `location`, `calendar` | Display order for event details |

## 🎨 Layouts

### Bubble

Groups events by day and displays each event as a compact timeline entry.

> [!Note]
> In the Bubble layout, relative date and event time always remain on the first line. Only description, location, and calendar source can be reordered.

| Light Theme | Dark Theme |
|---|---|
| <img width="472" height="540" alt="image" src="https://github.com/user-attachments/assets/4892331f-cf85-4d3b-83f9-126a73f3cd10" /> | <img width="474" height="540" alt="image" src="https://github.com/user-attachments/assets/82b6cc51-0c4a-4873-a049-3e886f49be26" /> |

### Chips

Displays events as compact pill-shaped chips. Useful when dashboard space is limited.

| Light Theme | Dark Theme |
|---|---|
| <img width="473" height="207" alt="image" src="https://github.com/user-attachments/assets/236926e6-aa38-4470-ac59-6b1f1daba9da" /> | <img width="475" height="209" alt="image" src="https://github.com/user-attachments/assets/6b543acb-abdc-4200-b7a9-8c448e57643d" /> |

### List

Displays one event per full-width row.

| Light Theme | Dark Theme |
|---|---|
| <img width="470" height="528" alt="image" src="https://github.com/user-attachments/assets/9696ab29-6a84-4fc4-baee-90205db0523f" /> | <img width="472" height="531" alt="image" src="https://github.com/user-attachments/assets/59d25bba-1b08-411a-b2b8-8e99db1dd8e3" /> |

### Mushroom

The default compact layout. Each event is displayed as a small Mushroom-style card with an icon, title, and selected event details.

| Light Theme | Dark Theme |
|---|---|
| <img width="474" height="391" alt="image" src="https://github.com/user-attachments/assets/545714d2-1aec-4531-93d1-ae717451c054" /> | <img width="473" height="390" alt="image" src="https://github.com/user-attachments/assets/3f04c9cc-7f94-41d4-9d6c-1ab0ec6b4063" /> |

### Pro

Displays a dedicated date column, a colored event marker, and event information in a compact full-width layout.

| Light Theme | Dark Theme |
|---|---|
| <img width="471" height="618" alt="image" src="https://github.com/user-attachments/assets/f766d5aa-fc6c-4b4d-b62c-f20e1750af8b" /> | <img width="474" height="621" alt="image" src="https://github.com/user-attachments/assets/185b9fff-940d-4197-9ff8-18895903bbce" /> |

### Square

Displays events in responsive square tiles.

| Light Theme | Dark Theme |
|---|---|
| <img width="473" height="489" alt="image" src="https://github.com/user-attachments/assets/87b2bcc3-48cd-4ce6-849b-6448b11392fa" /> | <img width="475" height="491" alt="image" src="https://github.com/user-attachments/assets/0423f078-ce2a-4048-b178-22c155aa7a44" /> |

## 🔎 Filters

Filters let you include or exclude events and customize included events.

A filter contains:

| Name | Values | Description |
|---|---|---|
| `action` | `include`, `exclude` | Include/customize or exclude matching events |
| `field` | `summary`, `description`, `location`, `calendar` | Event field to inspect |
| `operator` | `contains`, `equals`, `starts_with`, `ends_with`, `regex` | Matching method |
| `value` | string | Value to match |
| `label` | string | Optional replacement label for included events |
| `icon` | string | Optional MDI icon such as `mdi:recycle` |
| `color` | string | Optional Home Assistant UI color |
| `show_icon_background_color` | boolean | Apply the selected color to the icon background |
| `show_background_color` | boolean | Apply a subtle selected color to the event background |

> [!Note]
> Exclude filters take priority over include filters.

### Supported colors

The card supports Home Assistant theme colors:

`primary`, `accent`, `red`, `pink`, `purple`, `deep-purple`, `indigo`, `blue`, `light-blue`, `cyan`, `teal`, `green`, `light-green`, `lime`, `yellow`, `amber`, `orange`, `deep-orange`, `brown`, `light-grey`, `grey`, `dark-grey`, and `blue-grey`.

Custom CSS colors are also supported, including hexadecimal values such as `#ff0000` and `#ff000080`

## 📝 Usage examples

### Minimal setup

```yaml
type: custom:calendar-events-card
calendars:
  - entity: calendar.family
```

This uses the default Mushroom layout, searches the next 30 days, and refreshes every 60 minutes.

### Waste collection filters

Use a filtered calendar and customize each matching event with its own label, icon, and color.

```yaml
type: custom:calendar-events-card
name: Waste collection
calendars:
  - entity: calendar.waste_collection
    event_mode: filtered
layout: mushroom
filters:
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
    color: grey
```

### Ignore selected events

Exclude filters apply regardless of whether a calendar uses `all` or `filtered` mode.

```yaml
type: custom:calendar-events-card
name: Business Calendar
calendars:
  - entity: calendar.business
    event_mode: all
layout: mushroom
filters:
  - action: exclude
    field: summary
    operator: contains
    value: Cancelled
```

### Regular expression filter

```yaml
filters:
  - action: include
    field: summary
    operator: regex
    value: "birthday|anniversary"
    icon: mdi:cake-variant
    color: pink
```

## 📅 All-day events

All-day events use date-only values provided by Home Assistant.

`all_day_hide_time` controls when an all-day event occurring today disappears from the card. The default is:

```yaml
all_day_hide_time: "23:59"
```

For example, to hide today's all-day events after 18:00:

```yaml
all_day_hide_time: "18:00"
```

## 📄 License

[![License](https://img.shields.io/github/license/KroFR/calendar-events-ha-card)](https://github.com/KroFR/calendar-events-ha-card/blob/main/LICENSE)
