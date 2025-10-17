# Zoom Authentication Setup Guide

## Overview
This app now includes a Zoom login screen that allows users to authenticate with their Zoom account credentials. The app features **automatic login** that uses Moodle credentials with your institutional email domain.

## Authentication Flow

```
Moodle Login → [Auto-Login] → Zoom Login → Join Meeting
```

1. **Moodle Login**: User authenticates with Moodle credentials (username + password)
2. **Auto-Login Attempt**: Automatically tries to log into Zoom using:
   - Username + Institutional Domain = Email (e.g., `john.doe` + `@university.edu` = `john.doe@university.edu`)
   - Same password from Moodle login
3. **Zoom Login**: Manual login if auto-login fails or user wants different credentials
4. **Join Meeting**: User can create or join Zoom meetings

## Auto-Login Feature

### How It Works

When a user successfully logs into Moodle, the app:
1. **Captures** the Moodle username and password
2. **Constructs** an institutional email: `username` + `INSTITUTIONAL_EMAIL` (from `.env`)
3. **Automatically attempts** Zoom login with these credentials
4. **If auto-login fails**:
   - Shows an alert explaining the failure
   - Allows manual credential entry
   - **Validates** that the email ends with the institutional domain
   - Only accepts emails from the institutional domain

### Email Domain Validation

The Zoom login screen enforces institutional email domain validation:
- ✅ **Accepted**: `john.doe@university.edu` (if `INSTITUTIONAL_EMAIL=@university.edu`)
- ❌ **Rejected**: `john.doe@gmail.com`
- ❌ **Rejected**: `john.doe@otherdomain.com`

This ensures that only users with institutional email addresses can access Zoom features.

### Configuration

Add to your `.env` file:
```env
INSTITUTIONAL_EMAIL=@your-university.edu
```

**Important**: Include the `@` symbol at the start!

## Components Created

### 1. Zoom Login Screen (`src/screens/zoom-login-screen/`)
- Email/password input form
- Zoom branding with blue theme (#2D8CFF)
- Loading states and error handling
- "Skip for now" option for development

### 2. Zoom Service (`src/services/zoom.ts`)
- OAuth 2.0 authentication support
- Server-to-Server OAuth token generation
- User info retrieval
- Token storage and management with AsyncStorage

## Zoom OAuth Setup

### Getting Zoom OAuth Credentials

1. **Create a Zoom App**:
   - Go to [Zoom App Marketplace](https://marketplace.zoom.us/)
   - Click "Develop" → "Build App"
   - Choose "OAuth" app type

2. **Configure OAuth App**:
   - Set App Name and Description
   - Add Redirect URL for OAuth (for mobile: custom URL scheme)
   - Note down your **Client ID** and **Client Secret**

3. **Add Credentials to `.env`**:
   ```env
   ZOOM_CLIENT_ID=your_client_id_here
   ZOOM_CLIENT_SECRET=your_client_secret_here
   ```

### OAuth Implementation Notes

The current implementation includes:

- ✅ Basic UI and form validation
- ✅ Service structure for OAuth
- ✅ Token storage with AsyncStorage
- ⚠️ OAuth redirect flow (needs mobile-specific implementation)

**For Production**: You'll need to implement the full OAuth 2.0 flow:
1. Open browser/webview to Zoom authorization URL
2. Handle OAuth callback with authorization code
3. Exchange authorization code for access token

### Alternative: Server-to-Server OAuth

For server-side or admin applications, you can use Server-to-Server OAuth:

```typescript
const zoomService = new ZoomService();
const token = await zoomService.getServerToServerToken();
```

This requires:
- Client ID
- Client Secret
- Account ID (from Zoom admin dashboard)

## Navigation Flow

### Current Routes:
- `Login` - Moodle authentication
- `ZoomLogin` - Zoom authentication (NEW)
- `JoinMeeting` - Meeting interface

### Skipping Zoom Login

For development/testing, users can tap "Skip for now" to bypass Zoom authentication and go directly to the Join Meeting screen.

## Environment Variables

Add these to your `.env` file:

```env
# Existing
MOODLE_URL=https://your-moodle-site.com
ZOOM_JWT_TOKEN=your_jwt_token

# New - OAuth Credentials
ZOOM_CLIENT_ID=your_zoom_client_id
ZOOM_CLIENT_SECRET=your_zoom_client_secret

# New - Auto-Login Feature
INSTITUTIONAL_EMAIL=@your-university.edu
```

## TypeScript Declarations

Already updated in `.env.d.ts`:
```typescript
declare module '@env' {
  export const ZOOM_JWT_TOKEN: string;
  export const ZOOM_CLIENT_ID: string;
  export const ZOOM_CLIENT_SECRET: string;
  export const MOODLE_URL: string;
}
```

## Usage Examples

### Navigate to Zoom Login
```typescript
navigation.replace('ZoomLogin');
```

### Use Zoom Service
```typescript
import { ZoomService } from '../services/zoom';

const zoomService = new ZoomService();

// Get stored token
const token = await zoomService.getTokenFromStorage();

// Clear tokens on logout
await zoomService.clearStoredToken();
```

## Security Considerations

⚠️ **Important Security Notes**:

1. **Never commit `.env` file** - It's in `.gitignore`
2. **Client secrets should not be in mobile apps** - Consider using a backend proxy for OAuth
3. **Token storage** - Currently using AsyncStorage (unencrypted). For production, consider:
   - React Native Keychain
   - Encrypted storage solutions

## Next Steps

To fully implement Zoom OAuth authentication:

1. **Set up OAuth redirect handling**:
   - Configure deep linking in your app
   - Handle the OAuth callback URL

2. **Implement OAuth flow**:
   - Open Zoom authorization URL in browser/webview
   - Capture authorization code from callback
   - Exchange code for access token

3. **Integrate with AuthContext**:
   - Add Zoom auth state management
   - Handle both Moodle and Zoom sessions

4. **Testing**:
   - Test OAuth flow with real Zoom credentials
   - Verify token refresh functionality
   - Test token persistence across app restarts

## Troubleshooting

### Common Issues

1. **"Client ID not configured"**:
   - Check `.env` file exists and has correct values
   - Restart Metro bundler after changing `.env`

2. **OAuth callback not working**:
   - Verify redirect URI matches Zoom app settings
   - Check deep linking configuration

3. **Token storage issues**:
   - Clear app data and try again
   - Check AsyncStorage permissions

## Resources

- [Zoom OAuth Documentation](https://marketplace.zoom.us/docs/guides/auth/oauth)
- [Zoom API Reference](https://marketplace.zoom.us/docs/api-reference/zoom-api)
- [React Native Deep Linking](https://reactnative.dev/docs/linking)
