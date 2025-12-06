# Network Access Setup Guide

## Changes Made:
1. ✅ Frontend server now binds to all interfaces (`-a 0.0.0.0`)
2. ✅ Backend server now listens on all interfaces (`0.0.0.0`)
3. ✅ Frontend API URL dynamically detects hostname for network access

## Step-by-Step Setup:

### 1. Restart Backend Server
```bash
cd Backend
npm start
```
You should see: `Server is accessible on network at http://0.0.0.0:3000`

### 2. Restart Frontend Server
```bash
cd Frontend
./start-server.sh
```
Or manually:
```bash
npx http-server -p 8000 -a 0.0.0.0 -c-1
```

### 3. Verify Server Output
Frontend should show:
```
Available on:
  http://127.0.0.1:8000
  http://192.168.1.2:8000
  http://10.172.171.173:8000
```

### 4. Access from Remote Device

#### On the Remote Device (phone/tablet/other computer):

1. **Open browser** and go to: `http://10.172.171.173:8000/portfolio.html`

2. **Clear browser cache** (IMPORTANT!):
   - **Chrome Mobile**: Settings → Privacy → Clear browsing data → Cached images and files
   - **Safari Mobile**: Settings → Safari → Clear History and Website Data
   - **Desktop**: Hard refresh with `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)

3. **Open DevTools** (if possible) and check:
   - Console tab for errors
   - Network tab to verify files are loading
   - Check if API calls are going to `http://10.172.171.173:3000/api`

### 5. Test the Connection

#### Test Backend API from Remote Device:
Open in browser: `http://10.172.171.173:3000/health`
Should return: `{"status":"OK","message":"Server is running"}`

#### Test Frontend:
Open in browser: `http://10.172.171.173:8000/portfolio.html`
Should show the portfolio page with the "Create a student portfolio" button

## Troubleshooting:

### Issue: Still can't see changes on remote device

1. **Verify both servers are running**:
   - Backend: `http://localhost:3000/health` should work
   - Frontend: `http://localhost:8000` should work

2. **Check firewall settings** (Mac):
   ```bash
   # Check if firewall is blocking
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --getglobalstate
   ```
   - System Settings → Network → Firewall
   - Make sure Node.js/Terminal is allowed

3. **Verify IP address**:
   ```bash
   ifconfig | grep "inet "
   ```
   Make sure `10.172.171.173` is listed

4. **Test backend from remote device**:
   - Open `http://10.172.171.173:3000/health` on remote device
   - If this doesn't work, backend isn't accessible

5. **Check browser console on remote device**:
   - Open DevTools (if available)
   - Look for CORS errors or network errors
   - Check if API calls are failing

6. **Try incognito/private mode**:
   - This bypasses all cache
   - If it works in incognito, it's a cache issue

### Issue: API calls failing from remote device

The frontend now automatically detects the hostname. When you access:
- `http://localhost:8000` → API uses `http://localhost:3000`
- `http://10.172.171.173:8000` → API uses `http://10.172.171.173:3000`

If API calls fail, check:
1. Backend is running and accessible
2. CORS is enabled (already done in server.js)
3. Firewall allows port 3000

### Issue: Changes not appearing

1. **Hard refresh** on remote device (most common)
2. **Restart frontend server** with `-c-1` flag (cache disabled)
3. **Check file timestamps** to ensure files were saved
4. **Use incognito mode** to bypass cache

## Quick Test Commands:

```bash
# Test backend locally
curl http://localhost:3000/health

# Test backend from network (run from another device)
curl http://10.172.171.173:3000/health

# Test frontend locally
curl http://localhost:8000

# Check what's listening on ports
lsof -i :3000
lsof -i :8000
```

## Important Notes:

- Both servers must be running for the app to work
- Backend must be accessible on port 3000 from network
- Frontend must be accessible on port 8000 from network
- Always hard refresh on remote devices to clear cache
- Use incognito mode for testing to avoid cache issues

