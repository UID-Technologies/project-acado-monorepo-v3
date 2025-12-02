# 🔧 ACADO-CLIENT BUILD TROUBLESHOOTING

**Issue:** Build canceled / dist folder not created  
**Status:** Needs investigation with verbose output

---

## 🐛 THE PROBLEM

**Error:**
```
=> CANCELED [acado-client builder 4/6] RUN npm ci --legacy-peer-deps
=> ERROR [acado-client production 4/5] COPY --from=builder /app/dist
failed to solve: "/app/dist": not found
```

**What This Means:**
- The build stage was **CANCELED** (didn't complete)
- `npm ci` or `npm run build` failed or was interrupted
- `/app/dist` folder was never created
- Production stage can't find the build output

---

## 🔍 DIAGNOSTIC STEPS

### Step 1: Run with Verbose Output

```bash
cd ~/project-acado-monorepo-v3/deploy

# Build with full output
docker compose build --no-cache --progress=plain acado-client 2>&1 | tee build.log

# This will show:
# - Every command executed
# - Full error messages
# - Build progress
# - Exact failure point
```

### Step 2: Check Build Log

```bash
# View the build log
cat build.log

# Look for:
# - "ERROR" messages
# - "ENOENT" (file not found)
# - "Module not found"
# - TypeScript errors
# - Memory issues
```

### Step 3: Common Issues to Check

#### Issue A: Case Sensitivity

**Symptoms:**
```
Could not load /app/src/components/ui/button
ENOENT: no such file or directory
```

**Solution:**
Check import paths match file names exactly:
```bash
# In acado-client, check for case mismatches
cd ~/project-acado-monorepo-v3/acado-client
grep -r "from.*button" src/ | grep -v "Button"
grep -r "from.*wpShow" src/ | grep -v "WPShow"
```

#### Issue B: Missing Dependencies

**Symptoms:**
```
Module not found: Can't resolve '@/components/...'
```

**Solution:**
```bash
# Verify package.json has all dependencies
cd ~/project-acado-monorepo-v3/acado-client
npm install --legacy-peer-deps
npm run build  # Test build locally first
```

#### Issue C: Memory Issues

**Symptoms:**
```
JavaScript heap out of memory
FATAL ERROR: Reached heap limit
```

**Solution:**
Add memory limit to Dockerfile:
```dockerfile
# In builder stage, before npm run build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build
```

#### Issue D: TypeScript Errors

**Symptoms:**
```
TS2307: Cannot find module
TS2345: Argument of type ... is not assignable
```

**Solution:**
```bash
# Check TypeScript compilation locally
cd ~/project-acado-monorepo-v3/acado-client
npm run build

# If errors, fix them before deploying
```

---

## 🛠️ SOLUTION OPTIONS

### Option 1: Build Locally First (Recommended)

**Test the build on your local machine:**

```bash
cd acado-client

# Install dependencies
npm install --legacy-peer-deps

# Try building
npm run build

# If successful, dist folder will be created
ls -la dist/

# If it works locally, the Docker build should work too
```

**If local build fails:**
- Fix the errors shown
- Commit the fixes
- Push to repository
- Pull on Azure VM
- Try Docker build again

### Option 2: Increase Build Resources

**If memory issues:**

```dockerfile
# Add to Dockerfile.client before npm run build
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN npm run build
```

### Option 3: Skip Build Optimization

**For testing only:**

```dockerfile
# Change build command to skip optimizations
RUN npm run build -- --no-minify
```

### Option 4: Build Without Cache

```bash
# Sometimes cache causes issues
docker compose build --no-cache --progress=plain acado-client
```

---

## 📋 DEBUGGING CHECKLIST

Before deploying, verify:

- [ ] **Local build works**
  ```bash
  cd acado-client
  npm install --legacy-peer-deps
  npm run build
  # Should create dist/ folder
  ```

- [ ] **No TypeScript errors**
  ```bash
  npm run build
  # Check for TS errors
  ```

- [ ] **All imports are correct**
  ```bash
  # Check for case sensitivity issues
  grep -r "from.*'@" src/ | grep -i "button\|card\|input"
  ```

- [ ] **Dependencies installed**
  ```bash
  # Verify node_modules exists
  ls -la node_modules/
  ```

- [ ] **.dockerignore is correct**
  ```bash
  cat .dockerignore
  # Make sure it doesn't exclude needed files
  ```

---

## 🚀 RECOMMENDED WORKFLOW

### 1. Test Build Locally

```bash
cd ~/project-acado-monorepo-v3/acado-client

# Clean install
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Test build
npm run build

# Verify output
ls -la dist/
```

### 2. If Local Build Succeeds

```bash
# Docker build should work
cd ~/project-acado-monorepo-v3/deploy
docker compose build --no-cache --progress=plain acado-client 2>&1 | tee build.log
```

### 3. If Local Build Fails

**Check the error and fix:**
- Import path case sensitivity
- Missing dependencies
- TypeScript errors
- Memory issues

### 4. After Fixing

```bash
# Commit fixes
git add .
git commit -m "Fix build issues"
git push

# On Azure VM
git pull
cd deploy
docker compose build --no-cache acado-client
```

---

## 🔍 COMMON ERRORS & FIXES

### Error 1: "Could not load /app/src/..."

**Fix:** Case sensitivity issue
```bash
# Find the file
find acado-client/src -iname "*button*"

# Fix import to match exact case
# Wrong: from '@/components/ui/button'
# Right: from '@/components/ui/Button'
```

### Error 2: "Module not found"

**Fix:** Missing dependency or wrong path
```bash
# Install missing dependency
npm install <package-name> --legacy-peer-deps

# Or fix import path
```

### Error 3: "JavaScript heap out of memory"

**Fix:** Increase Node.js memory
```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
```

### Error 4: "npm ERR! code ERESOLVE"

**Fix:** Use legacy peer deps
```dockerfile
RUN npm ci --legacy-peer-deps
```

---

## 📊 WHAT TO SHARE

If you need help, share:

1. **Full build output:**
   ```bash
   docker compose build --progress=plain acado-client 2>&1 | tee build.log
   cat build.log
   ```

2. **Local build result:**
   ```bash
   cd acado-client
   npm run build 2>&1 | tee local-build.log
   ```

3. **Package.json:**
   ```bash
   cat acado-client/package.json
   ```

4. **Environment:**
   ```bash
   node --version
   npm --version
   docker --version
   ```

---

## ✅ NEXT STEPS

**Immediate:**
1. Run verbose build command on Azure VM
2. Share the full output
3. Identify the exact error
4. Apply appropriate fix

**Command to run:**
```bash
cd ~/project-acado-monorepo-v3/deploy
docker compose build --no-cache --progress=plain acado-client 2>&1 | tee build.log
```

Then share the output or the last 50 lines:
```bash
tail -50 build.log
```

---

**This will help identify the exact issue!** 🔍

