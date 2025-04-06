from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  
import uvicorn
import librosa
import numpy as np
import joblib
import tempfile

# Load model and scaler
model = joblib.load("D:\SHLAI(RESEARCH INTERNSHIP)\RandomForest.pkl")
scaler = joblib.load("D:\SHLAI(RESEARCH INTERNSHIP)\scaler.pkl")

app = FastAPI()

# ✅ CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # or ["*"] for all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Feature extraction function (same as your notebook)
def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)
    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
    mfccs_mean = np.mean(mfccs, axis=1)
    return mfccs_mean

@app.post("/predict/")
async def predict_grammar_score(file: UploadFile = File(...)):
    print("asajjndsj")
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as tmp:
            print("asnbdaj")
            tmp.write(await file.read())
            tmp_path = tmp.name
            print(tmp_path)
        # Extract features and predict
        features = extract_features(tmp_path).reshape(1, -1)

        features_scaled = scaler.transform(features)

        prediction = model.predict(features_scaled)[0]


        return JSONResponse(content={"grammar_score": round(float(prediction), 2)})
    
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

# To run: uvicorn grammar_scoring_api:app --reload


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
