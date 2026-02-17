import cv2
import json
import os

# --- CONFIGURATION ---
VIDEO_PATH = "MOT20-03.mp4" 
CONFIG_FILE = "config.json"

# Global variables
all_zones = []      # Stores all finished zones
current_points = [] # Stores points for the zone you are drawing right now

def mouse_callback(event, x, y, flags, param):
    if event == cv2.EVENT_LBUTTONDOWN:
        # Add point to current zone
        current_points.append([x, y])
        print(f"Point: {x}, {y}")

def main():
    global current_points, all_zones

    if not os.path.exists(VIDEO_PATH):
        print(f"❌ Error: {VIDEO_PATH} not found.")
        return

    cap = cv2.VideoCapture(VIDEO_PATH)
    ret, frame = cap.read()
    if not ret: return
    
    # Resize for easier drawing if video is huge (optional)
    # frame = cv2.resize(frame, (1280, 720)) 

    print("--- 🏟️ MULTI-ZONE SETUP ---")
    print("🖱️  LEFT CLICK: Add a point to the current gate.")
    print("⌨️  Press 'n':  Finish current gate & start a NEW one.")
    print("💾  Press 's':  SAVE zones and quit.")
    print("❌  Press 'q':  Quit without saving.")

    window_name = "Setup - Draw Zones"
    cv2.imshow(window_name, frame)
    cv2.setMouseCallback(window_name, mouse_callback)

    while True:
        # Always show a fresh clone of the frame so we can draw live updates
        display_frame = frame.copy()

        # Draw all finished zones (Green)
        for zone in all_zones:
            if len(zone) > 0:
                pts = np.array(zone, np.int32)
                cv2.polylines(display_frame, [pts], True, (0, 255, 0), 2)

        # Draw the current zone being drawn (Red)
        if len(current_points) > 0:
            pts = np.array(current_points, np.int32)
            cv2.polylines(display_frame, [pts], False, (0, 0, 255), 2)
            for p in current_points:
                cv2.circle(display_frame, (p[0], p[1]), 4, (0, 0, 255), -1)

        cv2.imshow(window_name, display_frame)
        
        key = cv2.waitKey(1) & 0xFF

        # 'n' for NEW ZONE
        if key == ord('n'):
            if len(current_points) > 2:
                all_zones.append(current_points)
                current_points = []
                print(f"✅ Zone {len(all_zones)} Added!")
            else:
                print("⚠️  A zone needs at least 3 points!")

        # 's' for SAVE
        elif key == ord('s'):
            # Don't forget the one currently being drawn!
            if len(current_points) > 2:
                all_zones.append(current_points)
            
            if len(all_zones) > 0:
                with open(CONFIG_FILE, "w") as f:
                    json.dump({"zones": all_zones}, f)
                print(f"💾 Saved {len(all_zones)} zones to {CONFIG_FILE}")
            break

        # 'q' for QUIT
        elif key == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

# Need numpy for drawing
import numpy as np

if __name__ == "__main__":
    main()