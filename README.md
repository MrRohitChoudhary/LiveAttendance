
# GeoTrust Attendance System - Deployment Guide

## Core Security Features
1. **Hardened Geofencing**: Uses the browser's high-accuracy Geolocation API combined with distance calculations on both client and (intended) server.
2. **Visual Proof**: Requires a live camera capture to prevent buddy-punching.
3. **Session Integrity**: Simulated session persistence using localStorage.

## Backend Architecture Recommendation
While this demo uses a simulated service layer, a production build should:
1. **Node.js/Express Backend**: Implement endpoints for `/auth` and `/attendance`.
2. **Firestore / MongoDB**:
   - `users` collection: `{ id, email, hashed_password, role, employee_id }`
   - `attendance` collection: `{ id, user_id, timestamp, geo: { lat, lng }, photo_url, status, verified_by }`
3. **Storage**: Use AWS S3 or Firebase Storage for the high-resolution proof photos.
4. **Validation Logic**: Always recalculate distance on the server using the client-sent coordinates before marking as 'Valid'.

## Deployment Steps
1. **Domain**: Must serve over HTTPS (required for Camera/Geo APIs).
2. **PWA**: Add a `manifest.json` and service worker to allow field workers to install it as an app for better offline/online handling.
3. **Environment Variables**: Configure your Cloudinary or S3 keys for photo uploads.

## Preventing Spoofing
- **IP Reconciliation**: Compare the device's IP geolocation with the browser's GPS.
- **Timestamp Drift**: Only allow check-ins within a 5-minute window of the server's current time.
- **Hardware IDs**: Track device fingerprints to identify duplicate accounts on one phone.
