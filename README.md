# FocusGuard – Distraction Detection Chrome Extension

FocusGuard is a productivity-focused Chrome extension designed to help students maintain concentration during study sessions. The extension monitors tab activity and detects distractions when users switch away from their designated study tab.

When a distraction is detected, the extension blurs the webpage and displays a warning message encouraging the user to return to their study session.

## Features

* Focus Mode activation
* Study tab monitoring
* Automatic distraction detection
* Page blur effect on distraction
* Warning message when switching tabs
* Start and Stop focus session control
* Lightweight and easy to use

## How It Works

1. User clicks **Start Study** in the extension popup.
2. The current tab becomes the **Study Tab**.
3. If the user switches to another tab, the extension detects it as a distraction.
4. The page becomes blurred and displays a warning message.
5. When the user returns to the study tab, the page remains normal.
6. Clicking **Stop Study** disables the monitoring.

## Project Structure

```
FocusGuard-Extension
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
└── style.css
```

## Installation (Manual)

1. Download or clone this repository.
2. Open Google Chrome.
3. Navigate to:

chrome://extensions

4. Enable **Developer Mode**.
5. Click **Load Unpacked**.
6. Select the **FocusGuard-Extension** folder.

The extension will now appear in the Chrome toolbar.

## Usage

1. Click the **FocusGuard extension icon**.
2. Click **Start Study** to activate Focus Mode.
3. The current tab becomes the study tab.
4. Opening other tabs will trigger distraction detection.
5. Click **Stop Study** to end the session.

## Technologies Used

* JavaScript
* HTML
* CSS
* Chrome Extension API

## Future Improvements

* Pomodoro focus timer
* Custom blocked websites
* Productivity analytics dashboard
* Focus score calculation
* Chrome Web Store deployment

## Author

Nihanth B
BTech Student | AI & Autonomous Systems

## License

This project is open-source and available for educational use.
