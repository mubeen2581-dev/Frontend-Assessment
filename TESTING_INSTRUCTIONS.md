# Testing Instructions

This document provides comprehensive instructions for testing the Architecture Dashboard application.

## Prerequisites

1. **Environment Setup**
   - Node.js 18+ installed
   - npm installed
   - OAuth credentials configured (Google and/or GitHub)

2. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`

## Testing Methods

### 1. Browser Testing (Recommended for Full Flow)

#### A. Testing Authentication Flow

**Test Google OAuth:**
1. Navigate to `http://localhost:3000`
2. Click "Sign in with Google"
3. You should be redirected to Google's login page
4. After successful authentication, you should be redirected to `/dashboard`
5. Verify you see:
   - Your profile information (name, email, profile picture)
   - The architecture diagram

**Test GitHub OAuth:**
1. Navigate to `http://localhost:3000`
2. Click "Sign in with GitHub"
3. You should be redirected to GitHub's login page
4. After successful authentication, you should be redirected to `/dashboard`
5. Verify the same information as above

**Test Logout:**
1. While on the dashboard, click "Sign Out"
2. You should be redirected to the home page
3. Verify you're no longer authenticated

**Test Route Protection:**
1. While logged out, try to access `http://localhost:3000/dashboard` directly
2. You should be redirected to the home page (login page)
3. This confirms middleware is protecting the route

#### B. Testing Architecture Diagram

1. Log in to the dashboard
2. Verify the diagram displays:
   - 4 nodes: Next.js Client, OAuth Provider, Backend API, Database
   - 3 links connecting the nodes
3. Test interactive features:
   - **Hover**: Hover over nodes - they should expand and labels should highlight
   - **Drag**: Click and drag nodes - they should move smoothly
   - **Animation**: Nodes should have smooth physics-based animations
   - **Colors**: Verify color coding:
     - Frontend (Next.js Client): Blue
     - Auth (OAuth Provider): Green
     - Backend (Backend API): Orange
     - Database: Red
4. Test responsiveness:
   - Resize the browser window
   - The diagram should adjust accordingly

### 2. Postman/API Testing

#### Import the Collection

1. Open Postman
2. Click "Import" button
3. Select the `postman_collection.json` file from the project root
4. The collection will be imported with all API endpoints

#### Set Up Environment Variables

1. In Postman, create a new environment or use the default
2. Set the following variables:
   - `base_url`: `http://localhost:3000`
   - `csrf_token`: (will be populated after getting CSRF token)

#### Test API Endpoints

**1. Get Architecture Data**
- **Endpoint**: `GET {{base_url}}/api/architecture`
- **Expected Response**: JSON with nodes and links
- **Status Code**: 200
- **Test**: Verify the response contains 4 nodes and 3 links

**2. Get Session (Unauthenticated)**
- **Endpoint**: `GET {{base_url}}/api/auth/session`
- **Expected Response**: `{}` (empty object)
- **Status Code**: 200
- **Test**: Should return empty object when not logged in

**3. Get Providers**
- **Endpoint**: `GET {{base_url}}/api/auth/providers`
- **Expected Response**: JSON object with available providers
- **Status Code**: 200
- **Test**: Should show Google and/or GitHub based on your configuration

**4. Get CSRF Token**
- **Endpoint**: `GET {{base_url}}/api/auth/csrf`
- **Expected Response**: JSON with `csrfToken` field
- **Status Code**: 200
- **Test**: Copy the token and save it to `{{csrf_token}}` variable for other requests

**5. Sign In (Google/GitHub)**
- **Note**: OAuth sign-in typically requires browser redirects, so this is best tested in the browser
- **Endpoint**: `POST {{base_url}}/api/auth/signin/google` or `/api/auth/signin/github`
- **Body**: 
  ```
  callbackUrl: {{base_url}}/dashboard
  csrfToken: {{csrf_token}}
  json: true
  ```
- **Test**: This will redirect to the OAuth provider, so browser testing is recommended

**6. Get Session (Authenticated)**
- **Endpoint**: `GET {{base_url}}/api/auth/session`
- **Prerequisites**: Must be authenticated (use browser to log in first, then use cookies)
- **Expected Response**: JSON with user information
- **Status Code**: 200
- **Test**: Should return user object with name, email, image, etc.

**7. Sign Out**
- **Endpoint**: `POST {{base_url}}/api/auth/signout`
- **Body**:
  ```
  csrfToken: {{csrf_token}}
  callbackUrl: {{base_url}}
  ```
- **Expected Response**: Redirect or success message
- **Test**: Should log out the user

### 3. Manual API Testing with cURL

#### Get Architecture Data
```bash
curl http://localhost:3000/api/architecture
```

#### Get Session
```bash
curl http://localhost:3000/api/auth/session
```

#### Get Providers
```bash
curl http://localhost:3000/api/auth/providers
```

#### Get CSRF Token
```bash
curl http://localhost:3000/api/auth/csrf
```

#### Sign Out (requires CSRF token and session cookie)
```bash
# First get CSRF token
CSRF_TOKEN=$(curl -s http://localhost:3000/api/auth/csrf | jq -r '.csrfToken')

# Then sign out (requires session cookie from browser)
curl -X POST http://localhost:3000/api/auth/signout \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "csrfToken=$CSRF_TOKEN&callbackUrl=http://localhost:3000" \
  -b "next-auth.session-token=YOUR_SESSION_COOKIE"
```

## Testing Checklist

### Authentication
- [ ] Google OAuth login works
- [ ] GitHub OAuth login works (if configured)
- [ ] Login redirects to dashboard
- [ ] Logout works and redirects to home
- [ ] Protected routes redirect unauthenticated users
- [ ] Session persists across page refreshes
- [ ] Only configured providers show login buttons

### Dashboard
- [ ] User profile displays correctly
- [ ] Profile picture shows (if available)
- [ ] Name and email display correctly
- [ ] Dashboard is accessible only when authenticated

### Architecture Diagram
- [ ] Diagram renders with all nodes
- [ ] All links are visible
- [ ] Nodes are color-coded correctly
- [ ] Hover effects work
- [ ] Nodes are draggable
- [ ] Animations are smooth
- [ ] Diagram is responsive to window resize
- [ ] Empty state shows when no data

### API Endpoints
- [ ] `/api/architecture` returns correct data
- [ ] `/api/auth/session` returns user when authenticated
- [ ] `/api/auth/session` returns empty when not authenticated
- [ ] `/api/auth/providers` shows configured providers
- [ ] `/api/auth/csrf` returns valid token

### Error Handling
- [ ] Application handles missing OAuth credentials gracefully
- [ ] Application handles API errors gracefully
- [ ] No console errors in browser
- [ ] No infinite loops or performance issues

## Common Issues and Solutions

### Issue: "Maximum update depth exceeded" error
**Solution**: This was fixed in the ArchitectureDiagram component. If you see this, make sure you have the latest code.

### Issue: OAuth redirect not working
**Solution**: 
- Verify redirect URI in Google/GitHub console matches exactly: `http://localhost:3000/api/auth/callback/google`
- Check that credentials are in `.env.local` (not `.env`)
- Restart the dev server after adding credentials

### Issue: Diagram not rendering
**Solution**:
- Check browser console for errors
- Verify `/api/architecture` returns data
- Check that `data.nodes.length > 0`

### Issue: Session not persisting
**Solution**:
- Check that `NEXTAUTH_SECRET` is set in `.env.local`
- Clear browser cookies and try again
- Verify cookies are not being blocked

## Performance Testing

1. **Load Time**: Dashboard should load within 2-3 seconds
2. **Diagram Rendering**: Diagram should render smoothly without lag
3. **Resize Performance**: Window resize should not cause performance issues
4. **Memory**: No memory leaks when navigating between pages

## Browser Compatibility

Test in the following browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## Mobile Testing (Optional)

If testing on mobile:
- [ ] Responsive layout works
- [ ] Touch interactions work for dragging nodes
- [ ] OAuth flow works on mobile browser

## Next Steps After Testing

1. Fix any issues found during testing
2. Document any known limitations
3. Prepare for deployment (if applicable)
4. Update README with any additional setup requirements

---

**Note**: For OAuth authentication, browser testing is recommended as it provides the full user experience including redirects and cookie handling. Postman is best for testing the architecture API endpoint and session management.

