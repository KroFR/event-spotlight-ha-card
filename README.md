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
| <img width="501" height="277" alt="image" src="https://github.com/user-attachments/assets/5220abff-1fbf-4a76-b8a5-7eba3e0073a3" /> | <img width="502" height="278" alt="image" src="https://github.com/user-attachments/assets/8a2547cf-3487-4b0d-9d3e-166d595494b6" /> |

## ✨ Features

- Monitor one or more `calendar.*` entities
- Display only events matching an Include rule
- Exclude unwanted events with Exclude rules
- Match title, description, location, or calendar source
- Match using `contains`, `equals`, `starts_with`, `ends_with`, or regular expressions
- Customize matching events with labels, `mdi:`, `hacs:`, or `advanced-camera-card:` icons, Home Assistant colors, or custom CSS colors
- Combine overlapping Include rules in order, with later rules overriding only the properties they define
- Show only the first upcoming event matching a rule when repeated events should be hidden
- Six layouts: `Bubble`, `Chips`, `Mushroom`, `Pro`, `Square`, and `Ticker`
- Eight card arrangements for Chips and Mushroom: `Left`, `Center`, `Right`, `Justified`, `Stretched`, `List`, `2 columns`, and `3 columns`
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
| `name` | string | no | `Upcoming Events` | Card header title |
| `days` | number | no | `30` | Number of days to search ahead |
| `update_interval` | number | no | `60` | Calendar refresh interval in minutes, from 1 to 1440 |
| `all_day_hide_time` | time | no | `23:59` | Time at which today's all-day events disappear |
| `language` | string | no | `auto` | `auto`, `en`, or `fr` |
| `layout` | string | no | `mushroom` | `bubble`, `chips`, `mushroom`, `pro`, `square`, or `ticker` |
| `card_arrangement` | string | no | `left` | Arrangement for Chips and Mushroom: `left`, `center`, `right`, `justified`, `stretched`, `list`, `2-columns`, or `3-columns` |
| `show_title` | boolean | no | `true` | Show the card header |
| `show_title_icon` | boolean | no | `true` | Show the icon in the card header |
| `show_card_background` | boolean | no | `true` | Show the outer Home Assistant card background |
| `ticker_mushroom_shape` | boolean | no | `false` | Ticker only. Replace the pill shape with the standard Mushroom card radius |
| `ticker_invert_light_colors` | boolean | no | `false` | Ticker only. In Light theme, use the default Home Assistant card background and the light grey secondary background for the date circle |
| `show_relative_date` | boolean | no | `true` | Show relative dates such as `Today` and `In 3 days` |
| `show_time` | boolean | no | `true` | Show event time when available |
| `show_description` | boolean | no | `false` | Show event description when available |
| `show_location` | boolean | no | `false` | Show event location when available |
| `show_calendar_source` | boolean | no | `false` | Show the source calendar name |
| `display_order` | list | no | `date_time`, `description`, `location`, `calendar` | Order of event details |

## 🎯 Event rules

Rules are the core of Event Spotlight Card.

### Include rules

An event must match at least one Include rule to appear. When several Include rules match, the card applies them from top to bottom. A later rule overrides only the appearance properties it defines, so broad calendar rules can provide defaults while more specific rules customize selected events.

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
| `rule_name` | string | Optional name shown only in the visual editor |
| `action` | `include`, `exclude` | Include/customize or exclude a matching event |
| `field` | `summary`, `description`, `location`, `calendar` | Event field to inspect |
| `operator` | `contains`, `equals`, `starts_with`, `ends_with`, `regex` | Matching method |
| `value` | string | Value or pattern to match |
| `label` | string | Optional title replacing the calendar event summary |
| `icon` | string | Optional `mdi:`, `hacs:`, or `advanced-camera-card:` icon, for example `mdi:recycle` |
| `color` | string | Optional Home Assistant or custom CSS color |
| `show_icon_background_color` | boolean | Apply the selected color to the icon background |
| `show_background_color` | boolean | Apply a subtle selected color to the event background |
| `show_first_match_only` | boolean | Show only the first upcoming match. This is useful for recurring events such as waste collections. |

### Rule priority and cascading

Exclude rules always take priority and are kept at the top of the visual editor. Include rules are evaluated in their configured order and can be reordered in the editor.

```yaml
rules:
  - action: include
    rule_name: Personal calendar
    field: calendar
    operator: contains
    value: Personal
    icon: mdi:calendar
    color: blue

  - action: include
    rule_name: Medical appointments
    field: summary
    operator: regex
    value: '\b(doctor|dentist)\b'
    icon: mdi:doctor
    color: red
```

A matching medical event first receives the Personal calendar defaults, then the Medical appointments icon and color override them.

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
| `\b(doctor\\|dentist)\b` | Matches doctor or dentist as complete words |
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
| <img width="501" height="277" alt="image" src="https://github.com/user-attachments/assets/5220abff-1fbf-4a76-b8a5-7eba3e0073a3" /> | <img width="502" height="278" alt="image" src="https://github.com/user-attachments/assets/8a2547cf-3487-4b0d-9d3e-166d595494b6" /> |

### Chips

Displays matching events as compact pill-shaped chips. Useful when dashboard space is limited.

| Light Theme | Dark Theme |
|---|---|
| <img width="503" height="225" alt="image" src="https://github.com/user-attachments/assets/d54137be-ea3d-40f6-9fa5-24ef06b142f4" /> | <img width="505" height="226" alt="image" src="https://github.com/user-attachments/assets/ff679e36-9b57-48f2-abfc-05787058252f" /> |

### Bubble

Groups events by day and displays each event as a compact timeline entry. Event time and relative date stay on the first line. Description, location, and calendar source follow the configured display order.

| Light Theme | Dark Theme |
|---|---|
| <img width="501" height="407" alt="image" src="https://github.com/user-attachments/assets/ed04553f-fbe0-48f9-8d54-4d6954c04a25" /> | <img width="503" height="408" alt="image" src="https://github.com/user-attachments/assets/e3e572c8-b8d0-450a-afca-3007e889e774" /> |

### Pro

Groups events by day in a full-width timeline-style layout. The day is displayed once, and event details use dedicated icons for time, description, location, and calendar source.

| Light Theme | Dark Theme |
|---|---|
| <img width="501" height="706" alt="image" src="https://github.com/user-attachments/assets/774b8d09-aae1-44b6-ae2a-8255860cceed" /> | <img width="501" height="708" alt="image" src="https://github.com/user-attachments/assets/e498ea7a-c439-4461-9e70-aa0c9d49d165" /> |

### Square

Displays matching events as responsive square-style tiles.

| Light Theme | Dark Theme |
|---|---|
| <img width="501" height="480" alt="image" src="https://github.com/user-attachments/assets/516473d5-a714-4556-9c4c-7c9c6bed4625" /> | <img width="502" height="481" alt="image" src="https://github.com/user-attachments/assets/dd62c880-2d38-4ee4-9b01-42d71a42d35c" /> |

### Ticker

Displays two upcoming events in a compact horizontal card. A date circle shows the date of the first visible event. When more than two events are available, the list scrolls vertically every three seconds and the date circle follows the first visible event.

Ticker-specific options:

- `ticker_mushroom_shape`: use the standard Mushroom card radius instead of the default pill shape.
- `ticker_invert_light_colors`: in Light theme, use the default Home Assistant card background and the secondary light grey background for the date circle.

| Light Theme | Dark Theme |
|---|---|
| <img width="500" height="162" alt="image" src="https://github.com/user-attachments/assets/49ee6baa-e7cb-4820-b0c3-9b2e3864a2b0" /> <img width="501" height="164" alt="image" src="https://github.com/user-attachments/assets/ad5d6821-e40e-42fe-8907-96ab5822fc62" /> | <img width="503" height="164" alt="image" src="https://github.com/user-attachments/assets/10d2ab17-9229-40ad-953e-75b049b88bff" /> <img width="503" height="166" alt="image" src="https://github.com/user-attachments/assets/aea685da-1a2f-49fb-bf2f-645f42bb5028" /> |

## ↔️ Card arrangements

Card arrangements are available for the `Chips` and `Mushroom` layouts. Other layouts use their own fixed presentation.

| Arrangement | Behavior |
|---|---|
| `left` | Keep natural card widths and align cards to the left |
| `center` | Keep natural card widths and center cards |
| `right` | Keep natural card widths and align cards to the right |
| `justified` | Keep natural card widths and distribute free space between cards |
| `stretched` | Use natural card widths to determine wrapping, then let cards on each row share the full available width |
| `list` | Display one full-width card per row |
| `2-columns` | Display cards in two equal-width columns and truncate overflowing text |
| `3-columns` | Display cards in three equal-width columns and truncate overflowing text |

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

## 🔒 Runtime safeguards

The card applies defensive limits to keep the dashboard responsive and reduce unsafe input handling:

- Calendar search range is clamped from 1 to 365 days.
- Up to 500 matching events are rendered.
- Regular expression patterns are limited to 256 characters and tested against at most 4,096 characters per field.
- Rule actions, fields, operators, icon prefixes, and custom colors are validated before rendering.

## 📝 Usage examples

### Waste collections

```yaml
type: custom:event-spotlight-card
name: Waste collection
calendars:
  - entity: calendar.waste_collection
layout: mushroom
card_arrangement: stretched
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
    value: '\b(doctor|dentist)\b'
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
