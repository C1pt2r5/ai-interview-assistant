# Deployment Guide

## GitHub Pages Deployment

### Prerequisites
1. Create a GitHub repository for your project
2. Push your code to the repository

### Steps to Deploy

1. **Create GitHub Repository**
   ```bash
   # Go to GitHub.com and create a new repository named "ai-interview-assistant"
   ```

2. **Update package.json**
   - Replace `yourusername` in the homepage URL with your actual GitHub username:
   ```json
   "homepage": "https://yourusername.github.io/ai-interview-assistant"
   ```

3. **Add Remote Origin**
   ```bash
   git remote add origin https://github.com/yourusername/ai-interview-assistant.git
   git branch -M main
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Click "Save"

5. **Deploy Using GitHub Actions**
   - The workflow will automatically trigger on push to main branch
   - Check the "Actions" tab to monitor deployment progress

6. **Manual Deployment (Alternative)**
   ```bash
   npm run deploy
   ```

### Accessing Your App
After successful deployment, your app will be available at:
`https://C1pt2r5.github.io/ai-interview-assistant`

### Troubleshooting
- Ensure GitHub Pages is enabled in repository settings
- Check Actions tab for any deployment errors
- Verify the homepage URL in package.json matches your repository

### Local Development
```bash
npm install
npm start
```

### Building for Production
```bash
npm run build
```