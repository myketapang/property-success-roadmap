# 🏠 Property Success Roadmap

A minimalist, production-grade web application for first-time Malaysian property investors. Built on four core pillars: **Eligibility → Selection → Strategy → Action**.

---

## ✨ Features

- **Bankability Scanner** — Real-time DSR calculator, good/bad debt tracker, loan eligibility estimator with charts
- **Holy Trinity Property Filter** — Curated Undercon listings scored on Price × Location × Layout
- **OPM Growth Simulator** — Leverage vs cash ROI, 5-year snowball chart, rental strategy selector
- **Guided Execution Hub** — Specialist banker contacts, live loan tracker, unit availability, action checklist

---

## 🧮 Formulas & Financial Logic

All calculations used throughout the app are documented here. Variables are described as they appear in the source code.

---

### 📊 Module 1 — Bankability Scanner (`Bankability.js`)

#### 1.1 Total Monthly Debt Commitment

Sums all user-entered monthly repayments across all debt entries.

```
totalDebt = Σ debt.monthly  (for all debts)
```

#### 1.2 Debt Service Ratio (DSR)

The primary metric banks use to evaluate loan eligibility. Expressed as a percentage.

```
DSR (%) = (totalDebt / grossMonthlyIncome) × 100
```

**DSR Thresholds used in app:**

| DSR Range | Status | Meaning |
|-----------|--------|---------|
| ≤ 50% | ✅ Safe | Excellent bankability |
| 50% – 65% | ⚠️ Caution | Reduce commitments first |
| > 65% | ❌ Danger | Banks likely to reject |

#### 1.3 Maximum DSR Capacity

The maximum monthly commitment the bank allows (set at 65% of gross income).

```
maxDSRCapacity = grossMonthlyIncome × 0.65
```

#### 1.4 Remaining Loan Capacity (Available Monthly for Property Loan)

How much monthly instalment budget remains after existing commitments.

```
remainingCapacity = (grossMonthlyIncome × 0.65) − totalDebt
```

#### 1.5 Maximum Property Loan (Present Value of Annuity)

Converts the remaining monthly capacity into a maximum loan amount using the standard mortgage present value formula. The app uses a fixed 4.5% p.a. interest rate and 30-year (360-month) tenure.

```
rate  = 4.5% ÷ 100 ÷ 12          (monthly interest rate = 0.00375)
n     = 360                        (months = 30 years × 12)

maxLoan = remainingCapacity × [ 1 − (1 + rate)^(−n) ] ÷ rate
```

> This is the **Present Value of an Ordinary Annuity** formula — the maximum lump sum you can borrow if you repay `remainingCapacity` every month for 360 months at 4.5% p.a.

#### 1.6 Property Price from Loan (LTV Back-Calculation)

```
maxPropertyPrice = maxLoan ÷ 0.90       (assuming 90% LTV)
downpaymentNeeded = maxPropertyPrice × 0.10
```

#### 1.7 Debt Tip — Loan Capacity Gain from Clearing Bad Debt

Shows how much additional loan capacity the user gains by clearing a given bad debt amount (`badDebt` = total monthly bad debt commitments).

```
additionalLoanCapacity = badDebt × [ 1 − (1 + 0.00375)^(−360) ] ÷ 0.00375
```

> Uses the same annuity formula: if you free up `badDebt` RM/month, the bank can lend you this much more.

#### 1.8 DSR SVG Gauge Arc Length

Maps the DSR percentage to the SVG circle's `stroke-dasharray` for the animated gauge. The full circumference of the circle (radius = 40, rendered in a 100×100 viewBox) is:

```
circumference = 2π × 40 ≈ 251.3

strokeDasharray = min(DSR, 100) × 2.51
```

---

### 🏙️ Module 2 — Holy Trinity Property Filter (`PropertyFilter.js`)

#### 2.1 Trinity Score

A composite score (0–100) averaging the three pillars of property quality.

```
trinityScore = ROUND[ (priceScore + locationScore + layoutScore) ÷ 3 ]
```

**Score components (set per property):**

| Pillar | Criteria |
|--------|----------|
| **Price Score** | How far below the area average the asking price is |
| **Location Score** | Proximity to job hubs, transport, amenities |
| **Layout Score** | Functional room count; penalises studios & duplexes |

#### 2.2 Below-Market Discount (%)

Shows how much cheaper the property is versus the area average asking price.

```
discount (%) = [ (areaAvgPrice − askingPrice) ÷ areaAvgPrice ] × 100
```

#### 2.3 Gross Rental Yield

Annual rental income as a percentage of the property's purchase price.

```
grossRentalYield (%) = (estimatedMonthlyRent × 12 ÷ askingPrice) × 100
```

---

### 📈 Module 3 — OPM Growth Simulator (`GrowthSimulator.js`)

#### 3.1 Loan Amount & Downpayment

```
loanAmt     = propertyPrice × (LTV% ÷ 100)
downpayment = propertyPrice − loanAmt
```

#### 3.2 Monthly Mortgage Installment

Standard amortising loan formula (fixed rate, equal monthly payments).

```
monthlyRate  = 4.5 ÷ 100 ÷ 12          (= 0.00375)
n            = 360                       (30 years)

monthlyInstallment = loanAmt × [ monthlyRate × (1 + monthlyRate)^n ]
                               ÷ [ (1 + monthlyRate)^n − 1 ]
```

> This is the **Payment on a Present Value** formula — the fixed monthly amount needed to fully repay `loanAmt` over 360 months at 4.5% p.a.

#### 3.3 Cash-Only ROI (Benchmark)

Simplified annual return if you paid 100% cash (no leverage). Uses 5% of annual rent as net income proxy.

```
cashOnlyROI (%) = (annualRent × 0.05) ÷ propertyPrice × 100
```

#### 3.4 Cash-on-Cash ROI (Leveraged)

The true return on your actual cash invested (downpayment only), after servicing the mortgage.

```
annualRent  = effectiveMonthlyRent × 12
netAnnual   = annualRent − (monthlyInstallment × 12)

cashOnCashROI (%) = (netAnnual ÷ downpayment) × 100
```

> **This is the core OPM insight:** by putting in only 10% cash, your ROI is calculated against that 10%, not the full price — dramatically amplifying the percentage return.

#### 3.5 Effective Monthly Rent (Rental Strategy Multiplier)

Each rental strategy applies a multiplier to the base market rent.

```
effectiveRent = baseMarketRent × strategyMultiplier
```

| Strategy | Multiplier | Rationale |
|----------|-----------|-----------|
| 🏠 Whole Unit | × 1.0 | Single tenant, market rate |
| 🛏️ Co-Living | × 1.5 | Room-by-room, ~50% premium |
| ✈️ AirBnB / STR | × 2.2 | Short-term nightly rates |

#### 3.6 Gross Rental Yield (per strategy)

```
grossYield (%) = (effectiveRent × 12 ÷ propertyPrice) × 100
```

#### 3.7 Net Monthly Cash Flow

The actual money in your pocket each month after paying the mortgage.

```
netMonthlyCashFlow = effectiveRent − monthlyInstallment
```

> Positive = positively geared (cash flow positive). Negative = negatively geared (top-up required).

#### 3.8 5-Year Snowball — Capital Growth Projection

Compound annual growth applied to the property price for each year.

```
propertyValue(yr) = purchasePrice × (1 + annualGrowthRate%)^yr
```

#### 3.9 5-Year Snowball — Equity

The portion of the property value you actually own (value minus outstanding loan).

```
equity(yr) = propertyValue(yr) − loanAmt
```

> Note: For simplicity the model holds `loanAmt` constant (principal reduction is minor in early years). A full amortisation schedule would reduce it each year.

#### 3.10 5-Year Snowball — Cumulative Rental Income

```
cumulativeRent(yr) = effectiveRent × 12 × yr
```

#### 3.11 Equity Recycling — Extractable Equity at Year 3

When you refinance at Year 3, banks allow you to borrow up to ~80–90% of the new valuation. The app estimates extractable equity as 30% of the appreciated value (conservative margin).

```
extractableEquity(yr=3) = propertyValue(yr=3) × 0.30
                        = purchasePrice × (1 + growth%)^3 × 0.30
```

#### 3.12 Equity Recycling — Total Portfolio Value at Year 5

```
portfolioValue(yr=5) = singlePropertyValue(yr=5) × 3
                     = purchasePrice × (1 + growth%)^5 × 3
```

---

### ✅ Module 4 — Guided Execution (`Execution.js`)

No financial formulas. This module handles:
- **Checklist progress %** = (completed items ÷ total items) × 100
- **Loan stage tracking** — sequential status display (completed / active / pending)
- **Unit availability** — static status labels (Available / Reserved / Sold)

---

## 📐 Key Financial Constants

| Constant | Value | Used In |
|----------|-------|---------|
| Interest Rate | **4.5% p.a.** | Bankability, Simulator |
| Loan Tenure | **30 years (360 months)** | Bankability, Simulator |
| Max DSR Threshold | **65%** | Bankability |
| Safe DSR Zone | **≤ 50%** | Bankability |
| First-Buyer Max LTV | **90%** | Bankability, Simulator |
| Co-Living Premium | **×1.5** | Simulator |
| AirBnB / STR Premium | **×2.2** | Simulator |
| Equity Extraction Buffer | **30% of new valuation** | Simulator (Equity Recycling) |

---

## 🚀 Quick Start (Local)

```bash
git clone https://github.com/YOUR_USERNAME/property-success-roadmap.git
cd property-success-roadmap
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

---

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

---

## 🌐 Deploy to Netlify

### Method 1: GitHub + Netlify (Recommended)

```bash
git init
git add .
git commit -m "feat: initial Property Success Roadmap"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/property-success-roadmap.git
git push -u origin main
```

Then: [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import from GitHub** → select repo → **Deploy site** ✅

Build settings are auto-detected from `netlify.toml` (`npm run build` → `build/`).

### Method 2: Drag & Drop (Fastest)

```bash
npm run build
```

Drag the `/build` folder to [app.netlify.com/drop](https://app.netlify.com/drop).

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Routing | React Router v6 (HashRouter) |
| Charts | Recharts |
| Icons | Lucide React |
| Fonts | Playfair Display + DM Sans + DM Mono |
| Styling | Pure CSS with CSS Variables |
| Deploy | Netlify |

---

## 🎨 Design System

| Variable | Value | Usage |
|----------|-------|-------|
| `--cream` | `#F7F4EF` | Page background |
| `--warm-white` | `#FAFAF8` | Card backgrounds |
| `--beige` | `#EDE8DF` | Borders, dividers |
| `--accent-gold` | `#C9A84C` | Primary accent, DSR gauge, scores |
| `--accent-sage` | `#7A9E7E` | Positive indicators, cash flow |
| `--accent-rust` | `#B85C38` | Warnings, bad debt |
| `--accent-blue` | `#4A7FA5` | Info labels, location tags |
| `--charcoal` | `#2C2825` | Body text |
| `--ink` | `#1A1714` | Headings |

---

## 🔧 Customization

### Add New Properties
Edit the `PROPERTIES` array in `src/pages/PropertyFilter.js`:

```js
{
  id: 7,
  name: 'Your Property Name',
  location: 'City, State',
  price: 450000,       // asking price (RM)
  avgArea: 540000,     // area average price (RM) — used for discount % calc
  type: 'Undercon',
  layout: 'Serviced Apartment',
  sqft: 900,
  rooms: '3',
  status: 'available', // 'available' | 'limited' | 'sold'
  score: { price: 88, location: 90, layout: 85 }, // 0–100 each
  completionYear: 2026,
  developer: 'Developer Name',
  jobAreas: ['Area 1', 'Area 2'],
  rentEst: 2500,       // estimated monthly rent (RM) — used for yield calc
  emoji: '🏙️',
  packages: ['Package 1', 'Package 2'],
}
```

### Update Banker Contacts
Edit the `BANKERS` array in `src/pages/Execution.js`.

### Adjust Financial Constants
Key rates are hardcoded — search for `4.5` (interest rate) and `360` (tenure months) in the source files to update them globally.

### Adjust Design Tokens
All colors are CSS variables in `src/index.css` under `:root {}`.

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| > 1024px | Full two-column layouts |
| 768–1024px | Adapted single/stacked grids |
| < 768px | Single column, collapsible nav |

---

## 📄 License

MIT — Free to use, modify, and deploy.
