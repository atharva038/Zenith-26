# Marathon Upload Cancel Fix

## Issue
When a user uploads a payment screenshot and then immediately deletes it while the upload is still in progress, the UI would still show the image as "uploading" or would complete the upload even after deletion. This created confusion and a poor user experience.

## Root Cause
The original implementation had several issues:
1. **No upload cancellation mechanism** - Once upload started, it couldn't be cancelled
2. **State race condition** - If user deleted while uploading, the upload completion would still update the form data
3. **Incomplete state cleanup** - Removing the screenshot didn't properly reset all related states
4. **No visual feedback** - Users couldn't tell if upload was in progress or completed

## Solution Implemented

### 1. Added AbortController for Upload Cancellation
```javascript
// New state for managing upload cancellation
const [uploadAbortController, setUploadAbortController] = useState(null);
```

### 2. Enhanced Upload Handler (`handleScreenshotChange`)
**Added:**
- ✅ AbortController creation and storage
- ✅ Signal passed to API request for cancellation support
- ✅ Proper error handling for cancelled uploads
- ✅ Don't show error toast when upload is intentionally cancelled

**Changes:**
```javascript
// Create abort controller for this upload
const abortController = new AbortController();
setUploadAbortController(abortController);

const response = await api.post(
  "/marathon/upload-payment-screenshot",
  formDataToUpload,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: abortController.signal, // ← NEW: Enable cancellation
  }
);

// Handle cancellation gracefully
catch (error) {
  if (error.name === 'CanceledError' || error.code === 'ERR_CANCELED') {
    console.log("Upload cancelled by user");
    return; // Don't show error
  }
  // ... handle other errors
}
```

### 3. Improved Remove Handler (`handleRemoveScreenshot`)
**Added:**
- ✅ Cancel ongoing upload using AbortController
- ✅ Dismiss upload toast notifications
- ✅ Reset file input element
- ✅ Clear uploading state
- ✅ Show user-friendly "Upload cancelled" message

**Complete Implementation:**
```javascript
const handleRemoveScreenshot = () => {
  // Cancel ongoing upload if any
  if (uploadAbortController) {
    uploadAbortController.abort();
    setUploadAbortController(null);
    toast.dismiss(); // Dismiss any upload toast
    toast.info("Upload cancelled");
  }
  
  // Clear all screenshot-related states
  setPaymentScreenshot(null);
  setScreenshotPreview(null);
  setIsUploadingScreenshot(false);
  setFormData((prev) => ({
    ...prev,
    paymentScreenshotUrl: "",
  }));
  
  // Reset file input
  const fileInput = document.getElementById("payment-screenshot");
  if (fileInput) {
    fileInput.value = "";
  }
};
```

### 4. Added Cleanup Effect
**Purpose:** Cancel uploads when component unmounts (user navigates away)
```javascript
useEffect(() => {
  return () => {
    if (uploadAbortController) {
      uploadAbortController.abort();
    }
  };
}, [uploadAbortController]);
```

### 5. Enhanced UI Feedback
**Added visual indicators:**
- ✅ Animated spinner icon during upload
- ✅ "Uploading..." text with animation
- ✅ Better button tooltip (shows "Cancel upload" during upload)
- ✅ Clear visual distinction between uploading/uploaded states

**Updated Status Display:**
```jsx
{isUploadingScreenshot ? (
  <p className="text-yellow-400 text-xs mt-1 flex items-center">
    <svg className="animate-spin h-3 w-3 mr-1" ...>
    Uploading...
  </p>
) : formData.paymentScreenshotUrl ? (
  <p className="text-green-400 text-xs mt-1">
    ✓ Uploaded successfully
  </p>
) : null}
```

## User Experience Improvements

### Before Fix ❌
- Upload starts → User clicks remove → Upload continues → Form data gets populated
- Confusing state where deleted file still shows as uploading
- No way to cancel an upload
- User might submit form with unintended screenshot

### After Fix ✅
- Upload starts → User clicks remove → Upload **cancelled immediately**
- All states properly cleared
- User gets feedback: "Upload cancelled"
- Clear visual indicators of upload progress
- Prevents accidental form submission with wrong screenshot

## Testing Scenarios

1. **Normal Upload Flow**
   - ✅ Upload completes successfully
   - ✅ Shows "✓ Uploaded successfully"
   - ✅ Can remove after upload

2. **Cancel During Upload**
   - ✅ Upload is cancelled
   - ✅ Shows "Upload cancelled" toast
   - ✅ All states cleared properly
   - ✅ No error shown

3. **Navigate Away During Upload**
   - ✅ Upload automatically cancelled on unmount
   - ✅ No memory leaks

4. **Upload Failure**
   - ✅ Shows error message
   - ✅ States cleared automatically
   - ✅ User can try again

## Technical Benefits

1. **Prevents Race Conditions** - Upload can't complete after removal
2. **Better Resource Management** - Cancelled uploads don't waste bandwidth
3. **Improved State Management** - All related states are properly synchronized
4. **User Control** - Users can cancel uploads at any time
5. **Clear Feedback** - Users always know the current state

## Files Modified

- `frontend/src/pages/MarathonRegistration.jsx`
  - Added `uploadAbortController` state
  - Enhanced `handleScreenshotChange()` with cancellation support
  - Improved `handleRemoveScreenshot()` with proper cleanup
  - Added cleanup effect for component unmount
  - Enhanced UI with better visual feedback

## Impact

- **User Experience**: Significantly improved - users have full control
- **Bug Prevention**: Eliminates state inconsistencies
- **Performance**: Cancelled uploads save bandwidth
- **Code Quality**: Better error handling and state management

---

**Date:** January 29, 2026
**Issue Type:** UX Bug Fix + Enhancement
**Priority:** High
**Status:** ✅ Completed
