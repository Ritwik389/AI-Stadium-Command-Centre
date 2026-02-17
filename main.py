import cv2
import numpy as np
from ultralytics import YOLO
import supervision as sv
import json
import os
import threading
import time
from logic import pricing_engine, energy_controller, safety_check

# CONFIGURATION
VIDEO_SOURCE = "MOT20-03.mp4" 
CONFIG_FILE = "config.json"

class StadiumSystem:
    def __init__(self):
        print("🚀 Initializing Stadium AI System...")
        self.model = YOLO('yolov8n.pt')
        self.box_annotator = sv.BoxAnnotator()
        
        # State
        self.zones = []
        self.annotators = []
        self.zone_names = []
        self.manual_overrides = {} # Stores { "Zone 1": True } if user took control
        
        self.lock = threading.Lock()
        self.cap = cv2.VideoCapture(VIDEO_SOURCE)
        
        # Initial Load
        self.load_zones()
        
        self.system_data = {
            "zones": {},
            "total_count": 0,
            "global_status": "SAFE"
        }

    def load_zones(self):
        if not os.path.exists(CONFIG_FILE):
            print("⚠️ No config.json found! Run setup_zone.py first.")
            return

        with self.lock:
            self.zones = []
            self.annotators = []
            self.zone_names = []
            
            with open(CONFIG_FILE, "r") as f:
                data = json.load(f)
                polygons = [np.array(z, np.int32) for z in data["zones"]]
                
            for i, poly in enumerate(polygons):
                z = sv.PolygonZone(polygon=poly)
                self.zones.append(z)
                # We will create the annotator dynamically in the loop to change colors
                self.zone_names.append(f"Zone {i+1}")
                
            print(f"✅ (Re)Loaded {len(self.zones)} zones.")

    def get_video_frame(self):
        success, frame = self.cap.read()
        if not success:
            self.cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            success, frame = self.cap.read()

        results = self.model(frame, verbose=False)[0]
        detections = sv.Detections.from_ultralytics(results)
        detections = detections[detections.class_id == 0]

        # Draw Boxes
        frame = self.box_annotator.annotate(scene=frame, detections=detections)

        total_count = 0
        zone_data_snapshot = {}

        for i, zone in enumerate(self.zones):
            # 1. Count
            mask = zone.trigger(detections=detections)
            count = int(mask.sum())
            total_count += count
            z_name = self.zone_names[i]
            
            # 2. Logic & Colors
            status = safety_check(count)
            energy = energy_controller(count)
            
            # Determine Color based on status
            if status == "CRITICAL":
                color = sv.Color.RED
            elif status == "WARNING":
                color = sv.Color.YELLOW
            else:
                color = sv.Color.GREEN
            
            # Draw Zone with Dynamic Color
            za = sv.PolygonZoneAnnotator(
                zone=zone, 
                color=color,
                thickness=2,
                text_thickness=2,
                text_scale=1
            )
            frame = za.annotate(scene=frame)

            # 3. Pricing Logic (Handle Manual Override)
            # Check if this zone is in "Manual Mode"
            is_manual = self.manual_overrides.get(z_name, False)
            
            if is_manual:
                # Keep the old price (don't update it)
                current_price = self.system_data["zones"].get(z_name, {}).get("price", 25.00)
                price = current_price 
            else:
                # Use AI Pricing
                price = pricing_engine(count)

            zone_data_snapshot[z_name] = {
                "count": count,
                "price": price,
                "energy": energy,
                "status": status,
                "manual": is_manual
            }

        with self.lock:
            self.system_data = {
                "zones": zone_data_snapshot,
                "total_count": total_count,
                "global_status": safety_check(total_count)
            }

        ret, buffer = cv2.imencode('.jpg', frame)
        return buffer.tobytes()

    def get_latest_data(self):
        with self.lock:
            return self.system_data

    def set_manual_price(self, zone_name, price):
        with self.lock:
            # Turn on Manual Mode for this zone
            self.manual_overrides[zone_name] = True
            # Update the price immediately in the cache
            if zone_name in self.system_data["zones"]:
                self.system_data["zones"][zone_name]["price"] = price

    def reset_to_auto(self, zone_name):
        with self.lock:
            if zone_name in self.manual_overrides:
                del self.manual_overrides[zone_name]

# Create Global Instance
stadium_ai = StadiumSystem()