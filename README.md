
# 📦 AI-Powered Sustainable Rental Platform — RentFlow

A next-generation role-based rental management system built to streamline operations, detect rental damages using AI, and promote eco-friendly usage through sustainability dashboards.  
Includes a friendly AI assistant **SewaSaathi** and a YOLO-style **Damage Detector** for automated condition checks.

----------

## 🚀 Quick Start

### Prerequisites

-   Node.js (v18+)
    
-   PostgreSQL
    
-   Redis (optional: OTP/session)
    
-   Python 3.8+ (for AI Damage Detector)
    
-   (Optional) GPU for faster AI inference
    

### Install & Run (summary)



```
git clone <repo-url>
cd rental-management-system

# Install everything (root task runner)
npm run install:all

# Backend
cd backend
cp .env.example .env
# edit backend/.env
npx prisma generate
npx prisma db push
npm run seed # optional
npm run dev:backend

# Frontend
cd ../frontend
cp .env.example .env
# edit frontend/.env (e.g. NEXT_PUBLIC_API_URL)
npm run dev:frontend

# AI Chat
cd ../SewaSaathi
# follow python/npm instructions in /SewaSaathi
npm run dev:ai-chat

# Damage Detector (python service)
cd ../AI
# create venv, install requirements then:
python app.py  # or uvicorn app:app --reload --port 8000

``` 

Default hosts used in the repo:

-   Backend API: `http://localhost:5000`
    
-   Frontend: `http://localhost:5173`
    
-   AI Chat (SewaSaathi): `http://localhost:2003`
    
-   AI Damage Detector: `http://localhost:8000`
    

----------

## 🔍 Focused Overview: SewaSaathi (AI Chatbot)

**SewaSaathi** is the user-facing conversational assistant that helps customers:

-   discover products,
    
-   ask pricing/availability,
    
-   get booking help,
    
-   report damage & escalate to staff,
    
-   receive sustainability tips.
    

### Architecture

-   Node/Express or Python microservice that interfaces with OpenAI (or your LLM of choice).
    
-   Maintains short-term context per-session and integrates with backend via APIs (product, rentals, invoices).
    
-   Optionally uses vector DB (e.g. Pinecone, Redis) for knowledge retrieval from docs/manuals or product descriptions.
    

### Key Features

-   Natural language product search (intent parsing).
    
-   Guided booking flows (collect dates, product, quantity).
    
-   Damage reporting assistant that can request images and call the Damage Detector endpoint.
    
-   Admin mode for staff: `/api/sewasaathi/admin` to retrieve transcripts & recommended actions.
    

### How to run

1.  `cd SewaSaathi`
    
2.  `cp .env.example .env` and set `OPENAI_API_KEY`, `API_URL`, etc.
    
3.  `npm install` (or `pip install -r requirements.txt` if Python)
    
4.  `npm run dev` (or `uvicorn sewasaathi:app --reload --port 2003`)
    

### API (example)

-   `POST /chat` — send user message, returns bot reply and optional action suggestions.
    

    
 ```
   // Request
{
  "sessionId": "sess_123",
  "message": "I want to rent a projector next weekend"
}

// Response
{
  "reply": "Great — how many days do you need it?",
  "suggestedActions": ["GetAvailability:projector", "CreateQuote"]
}
``` 
    

### Frontend integration (quick)

Use fetch or your `api.ts` service. Example (React):


```
const res = await fetch(`${CHAT_URL}/chat`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ sessionId, message }),
});
const data = await res.json();
``` 

If you need streaming for low-latency replies, use a websocket endpoint (`/ws/chat`) or SSE.

----------

## 🛠️ Focused Overview: AI Damage Detector

The Damage Detector is a Python-based service (YOLO / Detectron / custom model) that analyses uploaded images and returns:

-   bounding boxes for damaged regions,
    
-   damage classification (scratch, dent, crack),
    
-   confidence scores,
    
-   suggested repair cost range.
    

### Architecture

-   FastAPI (or Flask) serving inference endpoints.
    
-   Model: YOLOv8/YOLOv5 or similar (or custom model trained on labeled damage images).
    
-   Optional: Redis or DB to store reports and link them with rentals/invoices.
    
-   Optional background job runner (Celery/RQ) for heavy processing.
    

### How to run

1.  `cd AI`
    
2.  Create venv and install:
    
    
    ```
    python -m venv .venv 
    source .venv/bin/activate
    pip install -r requirements.txt
    ``` 
    
3.  Ensure model weights exist (instructions in `/AI/README.md` if present).
    
4.  Start server:

    
    `uvicorn app:app --reload --port 8000` 
    

### Endpoints & Example Requests

**POST `/api/ai/detect`** — upload a single image for detection

-   Content: `multipart/form-data` with field `image`, and optional `rentalId`, `productId`.
    
-   Response:


```
{
  "imageId": "img_001",
  "detections": [
    { "label": "scratch", "bbox": [x,y,w,h], "confidence": 0.93, "area_ratio": 0.04 },
    { "label": "dent",    "bbox": [x,y,w,h], "confidence": 0.82, "area_ratio": 0.02 }
  ],
  "summary": {
    "damageCount": 2,
    "estimatedRepairCost": 45.0,
    "severity": "minor"
  }
}
``` 

**POST `/api/ai/compare`** — compare pre-rental and post-rental images

-   Body: JSON referencing two image IDs or two uploaded images
    
-   Response: returns differences and highlights only _new_ damage.
    

### Model & Training (short)

-   Use curated dataset with labels: `scratch`, `dent`, `crack`, `broken`.
    
-   Augment with brightness/rotation; train with transfer learning.
    
-   Provide thresholds for `confidence` and `area_ratio` to decide actionable damages.
    
-   Retraining: provide labeled corrections from staff UI; scheduled retrain CI job.
    

### Frontend integration example (React)

Upload image and show results:


```
const form = new FormData();
form.append('image', file);
form.append('rentalId', rentalId);

const res = await fetch(`${API_BASE}/ai/detect`, {
  method: 'POST',
  body: form
});
const json = await res.json();
// display boxes over image using bbox coordinates

``` 

----------

## 🔗 How SewaSaathi + Damage Detector Work Together

1.  Customer chats with **SewaSaathi** and wants to report damage.
    
2.  Chatbot asks for required photos and calls `/api/ai/detect`.
    
3.  Detector returns structured results. SewaSaathi:
    
    -   Formats results into a readable message,
        
    -   Suggests next steps (keep, charge deposit, schedule inspection),
        
    -   Optionally creates an incident in backend (`/api/notification`, `/api/invoice` for deduction).
        
4.  Admins see detected damage in the Admin UI with the original image, boxes, severity, and suggested cost.
    

----------

## ✅ Suggested End-to-End Demo Flow (for product demos)

1.  Seed backend with a rental and invoice.
    
2.  Log in as customer, go to `My Rentals`.
    
3.  Use SewaSaathi to ask: "I returned the projector — I think it's scratched."
    
4.  Upload pre/post images when prompted.
    
5.  SewaSaathi calls AI detector and returns results; Payment/invoice updated automatically (or flagged for admin review).
    

----------

## 🔐 Data & Privacy Considerations

-   Store images securely (S3 or similar) and encrypt in transit (HTTPS) and at rest.
    
-   Only keep images and analysis as long as required for legal/compliance needs.
    
-   Allow customers to request deletion of images and data (GDPR/CCPA).
    
-   Log only anonymized model inference results for retraining.
    

----------

## 🧪 Testing & Local Development Tips

-   Add a `/mock` flag or an environment variable to bypass the real model and return deterministic responses for frontend dev.
    
-   Provide a simple `mock_responses/` folder with JSON files and a small express route `/api/ai/mock-detect` that returns them — great for UI dev without GPU.
    

----------

## 📦 DevOps & Production Notes

-   Serve AI model behind a GPU-enabled machine or use a managed inference service.
    
-   Use load balancing and autoscaling for the chat and detection services.
    
-   Add monitoring: Prometheus/Grafana for latency and error rates.
    
-   Use a queue for heavy requests, show user a progress spinner while processing.
    

----------

## 🧾 API Summary (new AI / Chat endpoints)

-   `POST /api/chat` — send message to SewaSaathi
    
-   `WS /ws/chat` — optional websocket for streaming replies
    
-   `POST /api/ai/detect` — single image damage detection
    
-   `POST /api/ai/compare` — compare two images for new damage
    

----------

## 📌 Example Dummy Data (for demos)

**Payments / Invoices**


```
{
  "invoices": [
    { "id": "inv_1001", "rentalId": "rent_01", "totalAmount": 120.0, "status": "PENDING" }
  ],
  "payments": [
    { "id": "pay_001", "invoiceId": "inv_1001", "rentalId": "rent_01", "amount": "$120.00", "method": "demo_card", "status": "completed", "date": "2025-08-12" }
  ]
}
``` 

**AI detection mock**


```
{
  "imageId": "img_demo_01",
  "detections": [
    { "label": "scratch", "bbox": [120, 40, 200, 70], "confidence": 0.95 }
  ],
  "summary": { "damageCount": 1, "estimatedRepairCost": 30, "severity": "minor" }
}
``` 

----------

## 🛠️ Next Steps & Roadmap (short)

-   🔁 Add webhook flows: AI triggers invoice updates automatically.
    
-   🤖 Improve SewaSaathi with RAG (retrieval-augmented generation) for manuals & TOS.
    
-   📦 Provide Docker compose/dev scripts that start frontend, backend, AI detector, and mock services together.
    

----------

## 📞 Support / Contributing

-   Open an issue in the repo for bugs/feature requests.
    
-   See `/docs` for architecture diagrams and AI training notes.
    
-   PRs welcome — follow the contribution steps in the original README.
