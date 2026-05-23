from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
import io
from PIL import Image
import os

app = FastAPI(title="ReCupare AI Detection Server")

# Enable CORS so your React web app can call it
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resolve path to best.pt in the same directory as server.py
current_dir = os.path.dirname(os.path.abspath(__file__))
model_path = os.path.join(current_dir, "best.pt")

# Check if model exists, otherwise print warning
if os.path.exists(model_path):
    print(f"Loading custom YOLO weights from: {model_path}")
    model = YOLO(model_path)
else:
    print(f"WARNING: 'best.pt' not found at {model_path}. Please place your custom weights file in this folder.")
    model = None

@app.post("/detect")
async def detect(image: UploadFile = File(...)):
    if model is None:
        return {"success": False, "error": "Model weights best.pt not found on server. Please copy best.pt to the backend/ folder."}
        
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        
        # Run YOLO detection
        results = model(img)
        predictions = []
        
        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                name = result.names[cls_id]
                conf = float(box.conf[0])
                # Extract box coordinates (xmin, ymin, xmax, ymax)
                xyxy = box.xyxy[0].tolist()
                
                predictions.append({
                    "class": name,
                    "confidence": conf,
                    "box": {
                        "x": (xyxy[0] + xyxy[2]) / 2, # center x
                        "y": (xyxy[1] + xyxy[3]) / 2, # center y
                        "width": xyxy[2] - xyxy[0],
                        "height": xyxy[3] - xyxy[1]
                    }
                })
                
        return {"success": True, "predictions": predictions}
    except Exception as e:
        return {"success": False, "error": str(e)}

# ── RAZORPAY PAYMENT INTEGRATION ──
import razorpay
import hmac
import hashlib
from pydantic import BaseModel
from dotenv import load_dotenv

# Load env variables — works both locally and on Railway
load_dotenv()

RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID", "rzp_test_SrVRaaDyufAVIb")
RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET", "pdgaohsFv77vlwJbFPnGZt3D")

# Initialize Razorpay client
razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))

class CreateOrderRequest(BaseModel):
    amount: int  # in paise
    currency: str = "INR"
    receipt: str = None

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str

@app.post("/api/create-order")
async def create_order(request: CreateOrderRequest):
    # Validate amount >= 100 paise (1 INR)
    if request.amount < 100:
        return {"success": False, "error": "Minimum transaction amount is 100 paise (₹1)"}
    
    try:
        order_data = {
            "amount": request.amount,
            "currency": request.currency,
            "receipt": request.receipt or f"receipt_order_{int(os.urandom(4).hex(), 16)}"
        }
        order = razorpay_client.order.create(data=order_data)
        return {
            "success": True,
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"]
        }
    except Exception as e:
        return {"success": False, "error": f"Razorpay order creation failed: {str(e)}"}

@app.post("/api/verify-payment")
async def verify_payment(request: VerifyPaymentRequest):
    if not request.razorpay_order_id or not request.razorpay_payment_id or not request.razorpay_signature:
        return {"success": False, "error": "Missing required verification fields"}

    try:
        # Standard HMAC-SHA256 signature verification
        msg = f"{request.razorpay_order_id}|{request.razorpay_payment_id}".encode("utf-8")
        generated_signature = hmac.new(
            RAZORPAY_KEY_SECRET.encode("utf-8"),
            msg,
            hashlib.sha256
        ).hexdigest()
        
        if hmac.compare_digest(generated_signature, request.razorpay_signature):
            return {"success": True, "message": "Payment verified successfully"}
        else:
            return {"success": False, "error": "Payment signature mismatch. Fraudulent transaction detected."}
    except Exception as e:
        return {"success": False, "error": f"Verification failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
