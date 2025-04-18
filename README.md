# AI_ResearchIntern
This project automatically evaluates the grammar quality of spoken English. It takes an audio input, transcribes it, analyzes grammar, and predicts a grammar score between 0 and 5 using a trained machine learning model.

*Documentation* :- https://docs.google.com/document/d/1hcmvIjdNEBOygpAAxTi8s2hSwJOm0QlgQwPIg-N-EbU/edit?usp=sharing



# 🗣️ Grammar Scoring Engine from Spoken Audio

This project implements a Grammar Scoring Engine that evaluates spoken audio samples by transcribing them, extracting features from both audio and text, and predicting a grammar score using a machine learning model.

---

## 🔍 Features

- 🎙️ **Speech Transcription**: Uses OpenAI's Whisper model to convert speech to text.
- 🧠 **Grammar Scoring**: Predicts grammar scores (1–5 scale) using a trained RandomForestRegressor.
- 🔊 **Audio Features**: Extracts MFCCs from audio files using Librosa.
- ✍️ **Text Features**: Uses TF-IDF from the transcription for text-based analysis.
- 📈 **Visualization**: Displays feature importance and model performance.
- 📝 **Grammar Feedback**: Optionally provides grammatical error insights with `language_tool_python`.

---

## 📁 File Structure

```
├── train.csv                        # Training metadata (filename, grammar score)
├── test.csv                         # Testing metadata (filename only)
├── Grammar(score).csv               # Output file with predicted scores
├── RandomForest_with_text.pkl       # Trained model saved with joblib
├── your_script.py / .ipynb          # Main training and prediction pipeline
```

---

## 🧰 Requirements

Install dependencies before running:

```bash
pip install numpy pandas librosa matplotlib seaborn scikit-learn tqdm whisper openai-whisper
```

You’ll also need to install FFmpeg for Whisper:
- Windows: https://www.gyan.dev/ffmpeg/builds/
- Linux/macOS: `sudo apt install ffmpeg` or `brew install ffmpeg`

---

## 🚀 How to Run

1. **Prepare Data**:
   - Place `.wav` files in your training and testing directories.
   - Generate `train.csv` with columns: `filename`, `score`.
   - Generate `test.csv` with column: `filename`.

2. **Run Training and Prediction**:
   - Run the notebook or Python script.
   - The script:
     - Transcribes audio using Whisper
     - Extracts MFCCs and TF-IDF features
     - Trains a RandomForestRegressor
     - Predicts grammar scores for test data

3. **Results**:
   - Check `Grammar(score).csv` for predicted scores on test data.
   - Model saved as `RandomForest_with_text.pkl`.

---

## 📊 Evaluation Metrics

- ✅ **Mean Squared Error (MSE)**
- ✅ **R² Score**
- ✅ **Feature Importance Plot**

---

## 📬 Output Sample

```csv
filename,transcription,predicted_score
audio1.wav,"This is a transcribed sentence",4.2
audio2.wav,"He go to school everyday",2.8
```

---

## 🤖 Model Info

- Model: `RandomForestRegressor`
- Features used:
  - Audio: MFCC (13 coefficients)
  - Text: TF-IDF (100 features)

---

## 📌 Notes

- Replace random scores with real MOS ratings if available.
- Model performance can be improved by:
  - Increasing dataset size
  - Using more advanced text features (e.g., grammar parse trees)
  - Fine-tuning audio preprocessing

---

## 📜 License

This project is for educational and research purposes.
```
