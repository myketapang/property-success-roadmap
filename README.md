# 🏠 Property Success Roadmap

A minimalist, production-grade web application for first-time Malaysian property investors. Built on four core pillars: Eligibility, Selection, Strategy, and Action.

## ✨ Features

- **Bankability Scanner** — Real-time DSR calculator, good/bad debt tracker, loan eligibility estimator with charts
- **Holy Trinity Property Filter** — Curated Undercon listings with Trinity Score (Price × Location × Layout)
- **OPM Growth Simulator** — Leverage vs cash ROI comparison, 5-year snowball chart, rental strategy selector
- **Guided Execution Hub** — Specialist banker contacts, live loan tracker, unit availability, action checklist

## 🚀 Quick Start (Local)

```bash
# Clone your repo
git clone https://github.com/YOUR_USERNAME/property-success-roadmap.git
cd property-success-roadmap

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## 📁 Folder Structure

```
property-success-roadmap/
├── public/
│   └── index.html              # HTML entry point (Google Fonts loaded here)
├── src/
│   ├── components/
│   │   ├── Navbar.js           # Fixed top nav with mobile menu
│   │   └── Navbar.css
│   ├── pages/
│   │   ├── Landing.js          # Hero, pillars overview, philosophy section
│   │   ├── Landing.css
│   │   ├── Bankability.js      # DSR calculator + debt tracker + pie chart
│   │   ├── Bankability.css
│   │   ├── PropertyFilter.js   # Property listings with Trinity Score filter
│   │   ├── PropertyFilter.css
│   │   ├── GrowthSimulator.js  # ROI simulator + snowball + rental modes
│   │   ├── GrowthSimulator.css
│   │   ├── Execution.js        # Bankers, loan tracker, checklist
│   │   └── Execution.css
│   ├── App.js                  # Router and layout
│   ├── App.css                 # Global component styles, buttons, cards
│   ├── index.js                # React entry point
│   └── index.css               # CSS variables, reset, global utilities
├── netlify.toml                # Netlify deploy config (SPA redirects)
├── .gitignore
├── package.json
└── README.md
```

## 🌐 Deploy to Netlify (3 steps)

### Method 1: GitHub + Netlify (Recommended)

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial Property Success Roadmap"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/property-success-roadmap.git
   git push -u origin main
   ```

2. **Connect to Netlify:**
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **GitHub** → Select your repo
   - Build settings are auto-detected from `netlify.toml`:
     - Build command: `npm run build`
     - Publish directory: `build`
   - Click **"Deploy site"** ✅

3. **Done!** Netlify will give you a URL like `https://property-roadmap-abc123.netlify.app`

### Method 2: Netlify CLI (Advanced)

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Build the app
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=build
```

### Method 3: Drag & Drop (Fastest)

```bash
npm run build
```
Then drag the `/build` folder to [https://app.netlify.com/drop](https://app.netlify.com/drop)

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Routing | React Router v6 (HashRouter for Netlify) |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Playfair Display + DM Sans + DM Mono |
| Styling | Pure CSS with CSS Variables |
| Deploy | Netlify |

## 🎨 Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--cream` | `#F7F4EF` | Page background |
| `--warm-white` | `#FAFAF8` | Card backgrounds |
| `--beige` | `#EDE8DF` | Borders, dividers |
| `--accent-gold` | `#C9A84C` | Primary accent, DSR, scores |
| `--accent-sage` | `#7A9E7E` | Positive indicators |
| `--accent-rust` | `#B85C38` | Warnings, bad debt |
| `--accent-blue` | `#4A7FA5` | Info, location tags |
| `--charcoal` | `#2C2825` | Body text |
| `--ink` | `#1A1714` | Headings |

## 📱 Responsive Breakpoints

- **Desktop** (>1024px): Full two-column layouts
- **Tablet** (768–1024px): Adapted grids
- **Mobile** (<768px): Single column, collapsible nav

## 🔧 Customization

### Add New Properties
Edit the `PROPERTIES` array in `src/pages/PropertyFilter.js`:
```js
{
  id: 7,
  name: 'Your Property Name',
  location: 'City, State',
  price: 450000,
  avgArea: 540000,
  type: 'Undercon',
  layout: 'Serviced Apartment',
  sqft: 900,
  rooms: '3',
  status: 'available',  // 'available' | 'limited' | 'sold'
  score: { price: 88, location: 90, layout: 85 },
  completionYear: 2026,
  developer: 'Developer Name',
  jobAreas: ['Area 1', 'Area 2'],
  rentEst: 2500,
  emoji: '🏙️',
  packages: ['Package 1', 'Package 2'],
}
```

### Update Banker Contacts
Edit the `BANKERS` array in `src/pages/Execution.js`

### Adjust Design Tokens
All colors are in `src/index.css` under `:root {}` CSS variables.

## 📄 License

MIT — Free to use, modify, and deploy.
