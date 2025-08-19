# 🚀 KCT Menswear - Vercel Deployment Instructions

## Quick Deployment Steps

### 1. Download the Package
Download `kct-deployment-package.tar.gz` from this workspace (12MB)

### 2. Open Terminal and Run These Commands:

```bash
# Navigate to your desired directory
cd ~/Desktop  # or wherever you want to extract

# Extract the deployment package
tar -xzf kct-deployment-package.tar.gz
cd kct-menswear-ai-enhanced

# Install dependencies
npm install

# Test build locally (optional but recommended)
npm run build

# Deploy to Vercel
npx vercel --prod
```

### 3. During Vercel Deployment:
When prompted:
- **"Set up and deploy?"** → Press `y`
- **"Which scope?"** → Choose your account
- **"Link to existing project?"** → Press `n` (new project)
- **"Project name?"** → Press Enter (uses `kct-menswear-ai-enhanced`)
- **"In which directory?"** → Press Enter (current directory)
- **"Want to override settings?"** → Press `n`

### 4. Expected Result:
```
✅ Production: https://kct-menswear-ai-enhanced-[random].vercel.app
```

## Environment Variables (IMPORTANT!)
After deployment, add these in Vercel Dashboard:

```
NEXT_PUBLIC_KNOWLEDGE_BANK_API=https://kct-knowledge-api-production.up.railway.app
NEXT_PUBLIC_KNOWLEDGE_BANK_KEY=kct-menswear-api-2024-secret
NEXT_PUBLIC_SIZE_BOT_API=https://kct-sizebot-api-production.up.railway.app
NEXT_PUBLIC_SIZE_BOT_KEY=kct-menswear-api-2024-secret
NEXT_PUBLIC_FASHION_CLIP_API=https://fashion-clip-kct-production.up.railway.app
NEXT_PUBLIC_FASHION_CLIP_KEY=kct-menswear-api-2024-secret
REPLICATE_API_TOKEN=r8_5WBPNPhs4UR09CWE34iSZbrgSrTvART2RFOJY

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=[your_supabase_url]
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your_supabase_anon_key]
SUPABASE_SERVICE_ROLE_KEY=[your_service_role_key]

# Add your Stripe credentials
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[your_stripe_key]
STRIPE_SECRET_KEY=[your_stripe_secret]
```

## What's Included:
✅ Complete luxury homepage with Hugo Boss carousel
✅ Product catalog (suits, shirts, accessories)
✅ Shopping cart & checkout
✅ AI features (Style Analysis, Size Bot, Visual Search)
✅ Bundle builder
✅ CDN optimization
✅ Mobile responsive design
✅ 174 static pages pre-generated

**Total Build Time:** ~30 seconds  
**Expected Status:** ✅ Ready for production