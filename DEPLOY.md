# Deployment Guide

## GitHub Setup

This algorithm visualizer is ready to be deployed to GitHub. Follow these steps:

### 1. Create GitHub Repository
1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it: `algorithm-visualizer` or `algowiz`
4. Description: "Interactive Algorithm Visualizer with comprehensive DSA coverage"
5. Set to Public (recommended for portfolio)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Push to GitHub
Copy and run these commands in your terminal:

```bash
# Remove any existing remote
git remote remove origin 2>/dev/null || true

# Add your GitHub repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Add all files
git add .

# Commit with a descriptive message
git commit -m "Initial commit: Interactive Algorithm Visualizer

- Complete sorting algorithms (Bubble Sort, Quick Sort)
- Searching algorithms (Linear Search, Binary Search)
- Graph algorithms (Dijkstra's Algorithm, BFS)
- Data structure visualizations (Stack, Queue)
- Real-time complexity analysis and performance metrics
- Modern React/TypeScript frontend with Canvas visualizations
- Express.js backend with algorithm storage
- Dark/light theme support
- Interactive controls (play, pause, step-through)
- Responsive design with Tailwind CSS"

# Push to GitHub
git push -u origin main
```

### 3. If you get branch name errors
If the push fails due to branch naming, try:
```bash
git branch -M main
git push -u origin main
```

### 4. Repository Features to Enable
After pushing, consider enabling:
- Issues (for bug reports and feature requests)
- Discussions (for community engagement)
- Wiki (for detailed documentation)
- GitHub Pages (for live demo deployment)

## Live Deployment Options

### Option 1: Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy automatically

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Connect GitHub repository
3. Build settings:
   - Build Command: `npm run build`
   - Publish Directory: `dist`

### Option 3: GitHub Pages
1. In your GitHub repository settings
2. Go to "Pages" section
3. Enable GitHub Actions deployment
4. Create `.github/workflows/deploy.yml` for automatic builds

## Environment Variables
For production deployment, you may need:
- `NODE_ENV=production`
- Database connection strings (if using external DB)
- API keys (if adding external services)

## Project Structure
```
algorithm-visualizer/
├── client/                 # React frontend
├── server/                 # Express.js backend
├── shared/                 # Shared types/schemas
├── README.md              # Project documentation
├── LICENSE                # MIT License
└── package.json           # Dependencies and scripts
```