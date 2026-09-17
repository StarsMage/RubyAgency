# RubyAgency System Monitor 🚷

A lightweight, modern system monitoring desktop application built with **Go (Wails v2)** and a sleek HTML/CSS/JavaScript frontend powered by **Chart.js**. 

RubyAgency runs quietly in the background with full **System Tray integration**, allowing you to minimize, hide, and restore the application instantly.

---

## Features

- **Real-time Performance Metrics**: Clean visual charts tracking system resource usage.
- **System Tray Support**: Runs in the background and sits neatly in your system tray (minimize-to-tray functionality).
- **Fast & Lightweight**: Built with Go for high performance and minimal memory footprint, combined with a web frontend.
- **Cross-Platform Foundation**: Engineered with Wails v2 architecture.

---

## Tech Stack

- **Backend**: Go (Wails v2, `github.com/getlantern/systray`)
- **Frontend**: HTML5, CSS3, JavaScript, Chart.js
- **Desktop Runtime**: Wails

---

## Installation & Development

### Prerequisites
Make sure you have the following installed on your system:
- [Go](https://golang.org/) (v1.18+)
- [Node.js](https://nodejs.org/) (for frontend assets)
- [Wails CLI](https://wails.io/docs/gettingstarted/installation)

### Running in Development Mode
Clone the repository and run the Wails development server with live reload:
```bash
wails dev
```

Building for Production

To build a standalone production-ready binary:
```Bash

wails build
```

The compiled executable will be located in the build/bin directory.
License

This project is open-source and available under the MIT License.
