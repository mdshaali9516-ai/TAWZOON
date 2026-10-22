# Implementation Plan - Move App Download Button into Profile Menu

1. **Remove Header Download Button**:
   - Remove the standalone "অ্যাপ ডাউনলোড করুন" button from the main header navigation bar so it's no longer loose in the header.

2. **Add Professional Download Option inside Profile Menu**:
   - Locate the profile dropdown menu in `Navbar.tsx`.
   - Add a professional download item inside the profile menu (e.g. **"Download APK"** for mobile or **"PC App Download"** depending on device) with a bouncing animation badge/pill so users immediately notice it.

3. **Automatic Device Detection & Download**:
   - On mobile devices, clicking it triggers mobile APK download / PWA install instructions or prompt.
   - On desktop/PC, clicking it triggers instant desktop app download / PWA install.
