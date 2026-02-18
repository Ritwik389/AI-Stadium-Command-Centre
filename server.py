from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from main import stadium_ai 
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
class PriceUpdate(BaseModel):
    zone_name: str
    price: float
class ZoneReset(BaseModel):
    zone_name: str
@app.get("/")
def home():
    return {"status": "Online", "endpoints": ["/video_feed", "/data"]}
@app.get("/video_feed")
def video_feed():
    def generate():
        while True:
            frame_bytes = stadium_ai.get_video_frame()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
    return StreamingResponse(generate(), media_type='multipart/x-mixed-replace; boundary=frame')
@app.get("/data")
def get_data():
    return stadium_ai.get_latest_data()
@app.post("/set_price")
def set_price(update: PriceUpdate):
    stadium_ai.set_manual_price(update.zone_name, update.price)
    return {"status": "Manual Mode Activated", "new_price": update.price}
@app.post("/set_auto")
def set_auto(reset: ZoneReset):
    """User clicks 'Resume Auto' -> AI takes over pricing again."""
    stadium_ai.reset_to_auto(reset.zone_name)
    return {"status": "Automatic Pricing Resumed"}

@app.post("/reload_layout")
def reload_layout():
    """User re-ran setup_zone.py and wants to update the live system."""
    stadium_ai.load_zones()
    return {"status": "Layout Reloaded from Config"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)