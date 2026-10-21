# Implementation Plan - Website Header & App Download Button Fix

1. **Brand Logo Verification & Replacement**:
   - Ensure the application header displays the correct custom brand logo configured in `brandSettings.logoUrl` or fallback cleanly without any placeholder branding.
   - Remove any unwanted fallback titles/logos and use the exact brand assets.

2. **Header App Download Button**:
   - Place a clean, compact, responsive button with the exact text **"অ্যাপ ডাউনলোড করুন"** in the website header right beside the profile icon / actions.
   - Configure the button to trigger direct PWA installation or APK download action.

3. **Verification**:
   - Compile and lint the applet to ensure zero build errors.
