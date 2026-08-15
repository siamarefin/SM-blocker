# SM Blocker

A lightweight Chrome extension designed to help users control Facebook usage and reduce visual distractions across the web.

## Features

- Continuous Facebook usage timer
- Automatically blocks Facebook after the configured usage limit
- Leaving Facebook resets the current session
- Automatic cooldown after Facebook is blocked
- Tracks daily Facebook usage
- Optional global image and video blur
- Lightweight and simple
- No external backend required
- Uses Chrome local storage for settings and usage data

## How It Works

### Facebook Usage Control

The timer only runs while Facebook is the active tab.

```text
Facebook
   |
Timer starts
   |
2 minutes
   |
Leave Facebook
   |
Timer resets
   |
Open Facebook again
   |
Timer starts from 0
```

If Facebook remains active continuously until the configured limit:

```text
Facebook
   |
5 continuous minutes
   |
Facebook blocked
   |
1 hour cooldown
   |
Facebook available again
```

Other websites remain available while Facebook is blocked:

```text
Facebook -> Blocked
YouTube  -> Available
Google   -> Available
Gmail    -> Available
Other websites -> Available
```

## Global Image Blur

SM Blocker provides an optional global visual blur feature.

When enabled, supported visual media can be blurred across supported websites.

Supported elements include:

- Images
- Videos
- Canvas elements
- CSS background images

The feature can be enabled or disabled from the extension popup.

```text
Image Blur OFF
      |
Normal images

Image Blur ON
      |
Blurred images
```

## Configuration

The Facebook usage limit and cooldown period can be configured in `background.js`.

Default configuration:

```javascript
const USAGE_TIME = 5 * 60 * 1000;
const BLOCK_TIME = 60 * 60 * 1000;
```

### Usage Time

```javascript
const USAGE_TIME = 5 * 60 * 1000;
```

This means Facebook is blocked after 5 continuous minutes of active usage.

### Block Time

```javascript
const BLOCK_TIME = 60 * 60 * 1000;
```

This means Facebook remains blocked for 1 hour.

## Testing

For development and testing, temporarily reduce the usage time:

```javascript
const USAGE_TIME = 59 * 1000;
```

After testing, restore:

```javascript
const USAGE_TIME = 5 * 60 * 1000;
```

## Project Structure

```text
SM-blocker/
|
├── manifest.json
├── background.js
├── content.js
├── popup.html
├── popup.js
|
├── services/
│   ├── timer.js
│   ├── storage.js
│   ├── usageTracker.js
│   └── imageBlur.js
|
├── README.md
├── LICENSE
└── .gitignore
```

## Architecture

The project separates responsibilities into different modules.

```text
                    SM Blocker
                        |
        +---------------+---------------+
        |                               |
 Facebook Blocker                 Global Image Blur
        |                               |
   background.js                  imageBlur.js
        |
        +-- timer.js
        +-- usageTracker.js
        +-- storage.js
```

### background.js

Responsible for:

- Facebook active-tab detection
- Session management
- Blocking logic
- Cooldown management
- Chrome alarms
- Tab state

### content.js

Responsible for:

- Facebook-specific blocking UI
- Facebook page state
- Showing the blocked screen

### timer.js

Responsible for:

- Timer creation
- Timer management
- Timer-related operations

### storage.js

Responsible for:

- Chrome local storage operations
- Reading application state
- Saving application state

### usageTracker.js

Responsible for:

- Tracking Facebook usage
- Managing usage sessions
- Maintaining usage data

### imageBlur.js

Responsible for:

- Detecting visual media
- Applying blur
- Removing blur
- Observing dynamically loaded content

### popup.js

Responsible for:

- Showing current status
- Showing daily usage
- Managing the Image Blur setting

## Technologies

- JavaScript
- Chrome Extensions Manifest V3
- Chrome Storage API
- Chrome Alarms API
- Chrome Tabs API
- Chrome Windows API
- MutationObserver
- Web APIs

No external framework is required.

## Installation

### Install from Source

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/SM-blocker.git
cd SM-blocker
```

Open Chrome:

```text
chrome://extensions
```

Then:

1. Enable Developer mode.
2. Click Load unpacked.
3. Select the `SM-blocker` folder.
4. The extension will appear in your Chrome extensions list.

## Updating the Extension

After changing the source code:

1. Open `chrome://extensions`
2. Find **SM Blocker**
3. Click **Reload**
4. Refresh the affected website

## Privacy

SM Blocker is designed to work locally inside the browser.

The extension does not require an external backend for its core functionality.

Usage data and settings are stored using:

```text
chrome.storage.local
```

The project does not require sending Facebook browsing activity to an external server.

## Design Principles

The project follows a simple modular architecture.

Main goals:

- Separation of responsibilities
- Reusable components
- Minimal dependencies
- Simple architecture
- Maintainable code
- Easy future extension

The project aims to follow:

- Single Responsibility Principle
- Open/Closed Principle
- Separation of Concerns
- Modular Design

## Roadmap

- [ ] Better blocked-page UI
- [ ] Configurable Facebook usage limit
- [ ] Configurable cooldown duration
- [ ] Improved usage statistics
- [ ] Weekly usage statistics
- [ ] Better image detection
- [ ] Improved video blur support
- [ ] Website-specific settings
- [ ] Dark mode
- [ ] Chrome Web Store release
- [ ] More customization options

## Contributing

Contributions are welcome.

### Create a branch

```bash
git checkout -b feature/your-feature
```

### Make your changes

Test the extension locally before submitting a pull request.

### Commit your changes

```bash
git add .
git commit -m "Add your feature"
```

### Push your branch

```bash
git push origin feature/your-feature
```

Then open a Pull Request on GitHub.

## Bug Reports

If you find a bug, please open an issue and provide:

- Chrome version
- Operating system
- Steps to reproduce the issue
- Expected behavior
- Actual behavior
- Console errors, if any

## Feature Requests

Feature requests are welcome.

Please describe:

- What problem the feature solves
- How the feature should work
- Why the feature would be useful

## License

This project is licensed under the MIT License.

See the `LICENSE` file for details.

## Author

**Siam Arefin**

Machine Learning Engineer  
Software Engineering

---

SM Blocker is an open-source productivity-focused Chrome extension designed to help users build healthier browsing habits.
