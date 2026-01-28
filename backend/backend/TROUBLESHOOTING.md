# Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: "Not getting output" / "Images not processing"

**Symptoms:**
- Uploading images but no results shown
- Camera captures but no analysis
- Backend receives request but returns error

**Solutions:**

1. **Check Backend Server is Running**
   ```bash
   # In backend directory
   python main.py
   ```
   Should see: `INFO: Uvicorn running on http://0.0.0.0:8000`

2. **Check Backend URL in Frontend**
   - Verify `.env` file has: `VITE_BACKEND_URL=http://localhost:8000`
   - Restart frontend after changing `.env`

3. **Check Browser Console**
   - Open DevTools (F12)
   - Look for errors in Console tab
   - Check Network tab for failed API calls

4. **Test Backend Directly**
   ```bash
   curl -X POST http://localhost:8000/api/v1/medicine/scan \
     -F "file=@path/to/image.jpg"
   ```

### Issue 2: Camera Not Working

**Symptoms:**
- "Open Camera" button does nothing
- Camera permission denied
- Black screen in camera preview

**Solutions:**

1. **Check Browser Permissions**
   - Allow camera access when prompted
   - Check browser settings: Settings → Privacy → Camera

2. **Use HTTPS or localhost**
   - Camera requires secure context
   - Use `http://localhost:8080` (works)
   - Or `https://` (required for production)

3. **Check Camera Availability**
   - Ensure camera is not used by another app
   - Try refreshing the page

4. **Fallback to Upload**
   - Use "Upload Image" button instead
   - Works the same way

### Issue 3: "Backend Error" / "Server Error"

**Symptoms:**
- Error messages in frontend
- 500/503 errors from backend
- "Model not available" errors

**Solutions:**

1. **Check Backend Logs**
   - Look at terminal where backend is running
   - Check for Python errors or warnings

2. **Verify Model Files**
   - Models are optional (fallback works)
   - Check if `models/` directory exists
   - Models will load if available, otherwise use OCR/rule-based

3. **Check Image Format**
   - Supported: JPG, JPEG, PNG
   - File size: < 10MB
   - Image dimensions: > 50x50 pixels

4. **Reinstall Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

### Issue 4: Low Accuracy / Wrong Predictions

**Symptoms:**
- Medicine name incorrect
- Conditions not detected properly
- Low confidence scores

**Solutions:**

1. **Image Quality**
   - Use clear, well-lit images
   - Avoid blurry or dark images
   - Ensure text is readable (for medicines)

2. **Train Models**
   - Organize dataset in folders
   - Run training scripts:
     ```bash
     python train_medicine_model.py
     python train_skin_model.py
     ```
   - More data = better accuracy

3. **Check OCR (for medicines)**
   - Ensure Tesseract is installed
   - Medicine packages should have clear text
   - Try different angles/lighting

### Issue 5: CORS Errors

**Symptoms:**
- "CORS policy" errors in browser console
- API calls blocked

**Solutions:**

1. **Check Backend CORS Settings**
   - Verify `allow_origins` in `backend/main.py`
   - Should include your frontend URL

2. **Check Frontend URL**
   - Frontend should be on allowed origin
   - Default: `http://localhost:8080` or `http://localhost:5173`

### Issue 6: Images in Backend Folder Not Used

**Note:** Images in `backend/data/medicines/` and `backend/data/Skin_images/` are for **training models**, not for processing user uploads.

**To Use Your Training Data:**

1. **Organize Images**
   ```bash
   python organize_data.py
   ```

2. **Train Models**
   ```bash
   python train_medicine_model.py
   python train_skin_model.py
   ```

3. **Models Will Be Used**
   - Trained models in `models/` will be used automatically
   - Better accuracy than OCR/rule-based

## Quick Diagnostic Steps

1. **Backend Running?**
   ```bash
   curl http://localhost:8000/health
   ```

2. **Frontend Connected?**
   - Check browser console for API calls
   - Verify `VITE_BACKEND_URL` in `.env`

3. **Image Processing?**
   - Check backend terminal for logs
   - Look for "Processing..." messages

4. **Results Showing?**
   - Check browser console for response
   - Verify result transformation in frontend

## Getting Help

If issues persist:

1. Check all logs (backend terminal + browser console)
2. Verify all steps in setup guides
3. Test with simple images first
4. Ensure all dependencies installed
5. Check network connectivity

## Expected Behavior

**Working Flow:**
1. User uploads/captures image
2. Frontend sends to backend API
3. Backend processes image
4. Backend returns results
5. Frontend displays results

**If any step fails, check logs for that step!**
