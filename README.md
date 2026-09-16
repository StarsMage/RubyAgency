# RubyAgency - System Monitor App

> A lightweight, cross-platform system monitor desktop application built with **Go**, **Wails**, and **HTML5/JavaScript**, featuring real-time hardware metrics and dynamic themes.

---

## 📂 Project Structure

The project follows a standard Wails desktop application architecture, separating the Go backend logic from the frontend UI interface:

```text
RubyAgency/
├── build/                 # Application build assets, platform configs & icons
│   └── windows/           # Windows-specific configurations (manifest, icons, info.json)
├── frontend/              # Web-based frontend UI (HTML, CSS, JS)
│   ├── src/               # Frontend source files
│   │   ├── assets/        # Images, logos, and static assets
│   │   ├── app.js         # Main frontend application logic & Chart.js rendering
│   │   └── style.css      # UI styling and design system
│   └── wailsjs/           # Auto-generated Wails bridge bindings (Go to JS runtime)
├── internal/              # Core Go backend packages
│   └── metrics/           # System metric collectors (gopsutil wrappers)
│       ├── cpu.go         # CPU usage, core info & specs collector
│       ├── disk.go        # Disk space & storage analytics collector
│       ├── network.go     # Network interfaces & bandwidth speed tracker
│       └── ram.go         # Memory (RAM) analytics collector
├── app.go                 # Main application logic controller (Wails bindings)
├── main.go                # Application entry point
├── go.mod                 # Go module dependencies
├── go.sum                 # Go dependencies checksums
├── wails.json             # Wails project configuration file
└── .gitignore             # Git ignored files and build artifacts

```

---

## ✨ Features

* **🖥️ Real-time CPU Monitoring**: Tracks general processor info, architecture, total usage percentage, and individual core statistics.
* **🧠 RAM Usage Analytics**: Live breakdown of total, used, free, and available system memory.
* **💾 Disk Storage Tracker**: Visual representation of mounted drives and storage capacity utilization.
* **🌐 Network Speed Monitor**: Real-time packet throughput tracker (Receive/Send speeds) for active network interfaces.
* **🎨 Custom Accent Themes**: Dynamic UI accent color switcher with persistent storage using `localStorage`.
* **⚡ Native Performance**: Powered by Go and Wails, bridging high-performance system calls with a smooth web-tech UI.

---

## 🛠️ Tech Stack

* **Backend**: [Go](https://www.google.com/search?q=https://golang.org/) (Golang), [gopsutil](https://www.google.com/search?q=https://github.com/shirou/gopsutil)
* **Frontend**: HTML5, Modern CSS3, JavaScript (ES6+), [Chart.js](https://www.google.com/search?q=https://www.chartjs.org/)
* **Framework**: [Wails v2](https://wails.io/) (Desktop apps built with Go)

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

* [Go](https://www.google.com/search?q=https://golang.org/doc/install) (v1.18 or higher)
* [Node.js](https://www.google.com/search?q=https://nodejs.org/) & npm
* [Wails CLI](https://www.google.com/search?q=https://wails.io/docs/getting-started/installation)

### Installation & Development

1. **Clone the repository:**
```bash
git clone [https://github.com/StarsMage/RubyAgency.git](https://github.com/StarsMage/RubyAgency.git)
cd RubyAgency

```


2. **Run in live-development mode:**
```bash
wails dev

```


*This will launch the application window with hot-reload enabled for frontend changes.*
3. **Build for production:**
```bash
wails build

```


*The compiled binary will be placed inside the `build/bin/` directory.*

---
