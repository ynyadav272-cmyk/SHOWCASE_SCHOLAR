# Troubleshooting: Edit/Delete Buttons Not Visible

## Quick Fixes:

### 1. **Hard Refresh Browser** (Most Important!)
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`
- This clears cached CSS/JS files

### 2. **Check Browser Console**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for any red error messages
4. Type: `document.querySelector('.btn-icon')`
5. Should return a button element (not null)

### 3. **Verify CSS is Loading**
1. Open DevTools (F12)
2. Go to Network tab
3. Refresh page
4. Look for `style.css` - should show status 200
5. Click on it and verify `.btn-icon` styles are present

### 4. **Check if Buttons Exist in HTML**
1. Open DevTools (F12)
2. Go to Elements/Inspector tab
3. Find a portfolio card
4. Look for `<div class="portfolio-actions">`
5. Should contain two `<button>` elements with class `btn-icon`

### 5. **Test Functions are Available**
In browser console, type:
```javascript
typeof openEditModal
typeof confirmDeleteStudent
```
Both should return "function"

### 6. **Visual Test**
In browser console, run:
```javascript
// Make buttons super visible for testing
document.querySelectorAll('.btn-icon').forEach(btn => {
    btn.style.background = 'red';
    btn.style.border = '3px solid yellow';
    btn.style.padding = '10px';
});
```
If buttons appear red/yellow, they exist but CSS might not be loading properly.

## Common Issues:

### Issue: Buttons don't exist in HTML
**Solution**: Check if `loadPortfolios()` is being called and if students data is loading

### Issue: Buttons exist but are invisible
**Solution**: 
1. Hard refresh (Ctrl+Shift+R)
2. Check CSS file is loading
3. Verify `.btn-icon` styles in DevTools

### Issue: Functions not defined
**Solution**: 
1. Check browser console for JavaScript errors
2. Verify `setupEditAndDeleteModals()` is being called
3. Check if it's called after DOM is loaded

### Issue: Buttons visible but not clickable
**Solution**: 
1. Check for JavaScript errors in console
2. Verify `onclick` handlers are in the HTML
3. Test functions manually: `openEditModal(1)`

## Still Not Working?

1. **Clear all browser cache**:
   - Chrome: Settings → Privacy → Clear browsing data → Cached images and files
   - Firefox: Settings → Privacy → Clear Data → Cached Web Content

2. **Try incognito/private mode**:
   - This bypasses all cache
   - If it works in incognito, it's definitely a cache issue

3. **Check file timestamps**:
   ```bash
   ls -la Frontend/css/style.css Frontend/js/main.js
   ```
   Files should have recent modification times

4. **Restart frontend server**:
   ```bash
   cd Frontend
   ./start-server.sh
   ```

5. **Verify the code**:
   - Open `Frontend/js/main.js`
   - Search for "portfolio-actions" - should find it around line 109
   - Open `Frontend/css/style.css`
   - Search for ".btn-icon" - should find styles around line 573

