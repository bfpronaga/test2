# Next.js PWA with OneSignal Setup Guide

This project has been configured as a Progressive Web App (PWA) with OneSignal push notifications.

## Features Added

✅ **PWA Features:**

-   Service Worker for offline functionality
-   Web App Manifest for installability
-   PWA installation prompts
-   Offline support

✅ **OneSignal Integration:**

-   Push notification subscription management
-   Custom OneSignal React hook
-   API endpoints for sending notifications
-   Test notification functionality

## Setup Instructions

### 1. OneSignal Configuration

1. Go to [OneSignal.com](https://onesignal.com) and create an account
2. Create a new app for your website
3. In the OneSignal dashboard, go to **Settings > Platforms > Web Push**
4. Configure your site settings:
    - Site Name: Your app name
    - Site URL: Your domain (e.g., `https://yourdomain.com`)
    - Integration Type: **Custom Code**

### 2. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# OneSignal Configuration
NEXT_PUBLIC_ONESIGNAL_APP_ID=your_onesignal_app_id_here
ONESIGNAL_APP_ID=your_onesignal_app_id_here
ONESIGNAL_REST_API_KEY=your_onesignal_rest_api_key_here
```

**How to get these values:**

-   `ONESIGNAL_APP_ID`: Found in your OneSignal dashboard under **Settings > Keys & IDs**
-   `ONESIGNAL_REST_API_KEY`: Found in your OneSignal dashboard under **Settings > Keys & IDs > REST API Key**

### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

## API Endpoints

### Send Notification

-   **Endpoint:** `POST /api/send-notification`
-   **Body:**
    ```json
    {
        "title": "Notification Title",
        "message": "Notification message",
        "userId": "optional_user_id",
        "url": "optional_url"
    }
    ```

### Test Notification

-   **Endpoint:** `POST /api/test-notification`
-   **Description:** Sends a test notification to all subscribed users

## PWA Features

### Installation

-   Users can install the app from their browser
-   Install prompt appears automatically on supported browsers
-   App can be launched from home screen like a native app

### Offline Support

-   Service worker caches essential resources
-   App works offline with cached content
-   Online/offline status indicator

### Push Notifications

-   Subscribe/unsubscribe to notifications
-   Send test notifications
-   User ID tracking for targeted notifications

## File Structure

```
├── public/
│   ├── manifest.json          # PWA manifest
│   ├── sw.js                  # Service worker
│   ├── OneSignalSDKWorker.js  # OneSignal service worker
│   └── icon-*.svg            # PWA icons
├── src/
│   ├── hooks/
│   │   └── useOneSignal.ts    # OneSignal React hook
│   ├── pages/
│   │   ├── api/
│   │   │   ├── send-notification.ts
│   │   │   └── test-notification.ts
│   │   ├── _document.tsx     # PWA meta tags
│   │   └── index.tsx         # Main page with PWA features
│   └── styles/
└── next.config.ts            # PWA configuration
```

## Testing

1. **PWA Installation:**

    - Open the app in Chrome/Edge
    - Look for the install button in the address bar
    - Or use the "Install App" button on the page

2. **Push Notifications:**

    - Click "Subscribe" to enable notifications
    - Click "Send Test" to send a test notification
    - Check your browser's notification settings

3. **Offline Testing:**
    - Open DevTools > Network tab
    - Check "Offline" to simulate offline mode
    - The app should still work with cached content

## Deployment

When deploying to production:

1. Set the environment variables in your hosting platform
2. Ensure HTTPS is enabled (required for PWA and push notifications)
3. Update the OneSignal site URL to your production domain
4. Test the PWA installation and notifications

## Troubleshooting

### OneSignal Not Working

-   Check that environment variables are set correctly
-   Verify the OneSignal App ID is correct
-   Ensure the site URL in OneSignal matches your domain
-   Check browser console for errors

### PWA Not Installing

-   Ensure the app is served over HTTPS
-   Check that the manifest.json is accessible
-   Verify service worker is registered (check DevTools > Application > Service Workers)

### Notifications Not Working

-   Check browser notification permissions
-   Verify OneSignal configuration
-   Test with the "Send Test" button first
