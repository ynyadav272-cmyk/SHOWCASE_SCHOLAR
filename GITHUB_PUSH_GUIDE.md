# Guide: Push Local Branch to GitHub

## Step-by-Step Instructions

### Step 1: Initialize Git Repository (if not already done)
```bash
cd "/Users/skasaudhan/Downloads/SHOW CASE SCHOLAR"
git init
```

### Step 2: Add All Files to Git
```bash
git add .
```

### Step 3: Make Your First Commit
```bash
git commit -m "Initial commit: Student Portfolio Platform"
```

### Step 4: Create/Checkout Branch (if you want a specific branch)
```bash
# Create and switch to a new branch (optional)
git checkout -b main

# OR if you want to use 'master'
git checkout -b master
```

### Step 5: Create Repository on GitHub
1. Go to https://github.com
2. Click the **"+"** icon → **"New repository"**
3. Enter repository name (e.g., `show-case-scholar`)
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click **"Create repository"**

### Step 6: Add GitHub Remote
After creating the repo, GitHub will show you commands. Use this format:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

**Example:**
```bash
git remote add origin https://github.com/yourusername/show-case-scholar.git
```

**OR if using SSH:**
```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Step 7: Push to GitHub
```bash
# Push main branch (or master if you used that)
git push -u origin main

# OR if using master branch
git push -u origin master
```

The `-u` flag sets up tracking so future pushes can just use `git push`.

## Complete Command Sequence (Copy & Paste)

```bash
# Navigate to project directory
cd "/Users/skasaudhan/Downloads/SHOW CASE SCHOLAR"

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Student Portfolio Platform"

# Create main branch
git checkout -b main

# Add remote (REPLACE WITH YOUR GITHUB REPO URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

## For Future Updates

After the initial push, for future changes:

```bash
# Add changed files
git add .

# Commit changes
git commit -m "Your commit message describing changes"

# Push to GitHub
git push
```

## Troubleshooting

### Issue: "remote origin already exists"
**Solution:**
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

### Issue: "failed to push some refs"
**Solution:** If GitHub repo has files you don't have locally:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

### Issue: Authentication failed
**Solution:** 
- Use Personal Access Token instead of password
- Or set up SSH keys
- Or use GitHub CLI: `gh auth login`

### Issue: "branch 'main' does not exist"
**Solution:**
```bash
git branch -M main
git push -u origin main
```

## Verify Remote is Set

Check if remote is configured:
```bash
git remote -v
```

Should show:
```
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (fetch)
origin  https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git (push)
```

## Check Current Status

```bash
git status
git branch
git log --oneline
```

