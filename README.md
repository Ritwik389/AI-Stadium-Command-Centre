#  AI Stadium Command Center

> **Next-Gen Stadium Operations: Smart Crowds, Dynamic Pricing, and Automated Safety.**

![Tech Stack](https://img.shields.io/badge/Stack-Python_|_React_|_YOLOv8-blue)

##  The Pitch
The **AI Stadium Command Center** is a computer-vision powered dashboard that transforms standard CCTV footage into actionable business intelligence.

Instead of just recording video, our system **understands** it. It tracks crowd density in real-time to:
1.  **Maximize Revenue:** Automatically adjust ticket/product prices based on demand (Dynamic Pricing).
2.  **Ensure Safety:** Instantly flag overcrowding risks before they become stampedes.
3.  **Optimize Energy:** Smartly control lighting/HVAC in empty zones to cut costs.

##  Key Features
* **Live Crowd Analytics:** Real-time people counting using YOLOv8 object detection.
* **Dynamic Pricing Engine:** Zone-specific pricing updates automatically based on crowd density.
* **Automated Safety Alerts:** "Green/Yellow/Red" status indicators for immediate risk assessment.
* **Energy Efficiency Mode:** Detects empty areas to suggest "Eco Mode" (dimming lights/AC).
* **Custom Zone Layout:** Draw your own tracking zones on any camera feed with a simple GUI.
* **Enterprise Dashboard:** A clean, React-based control room with live video, data logs, and manual overrides.

##  Tech Stack
* **AI/Backend:** Python 3.10, Ultralytics YOLOv8, OpenCV, FastAPI, Supervision.
* **Frontend:** React (Vite), Tailwind CSS, Lucide Icons, Axios.
* **DevOps:** Shell scripting for one-click setup.

##  Quick Start (One-Click)
We have automated the entire setup process.

### Prerequisites
* Python 3.10+
* Node.js & npm
* Git

### 1. Clone the Repository
```bash
git clone https://github.com/Ritwik389/AI-Stadium-Command-Centre.git
cd AI-Stadium-Command-Centre
```

### 2. Run Setup (First Time Only)
This script creates the virtual environment and installs all Python/Node dependencies.
```bash
chmod +x setup.sh start.sh
./setup.sh
```

### 3. Launch the System
This script opens the Zone Drawer, starts the Backend, starts the Frontend, and opens your browser.
```bash
./start.sh
```

---

##  Manual Setup
If the scripts don't work for you, here is how to run it manually:

**1. Backend (Terminal 1)**
```bash
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python server.py
```

**2. Frontend (Terminal 2)**
```bash
cd frontend
npm install
npm run dev
```

**3. Zone Configuration (Optional)**
To redraw the tracking zones:
```bash
python setup_zone.py
```

##  API Endpoints
The backend runs on `http://localhost:8000`.

* **`GET /video_feed`**: MJPEG stream of the processed video with bounding boxes.
* **`GET /data`**: JSON object containing live counts, prices, and status for all zones.
* **`POST /set_price`**: Manually override dynamic pricing for a specific zone.
* **`POST /reload_layout`**: Hot-reload the zone configuration without restarting the server.

---

**Built with ❤️ by Ritwik Jain**
