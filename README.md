# Credit Simulator PT

[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-latest-646cff?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

A Portuguese credit and loan simulator web application based on Portuguese financial legislation and Bank of Portugal regulations. This tool helps users estimate monthly installments, calculate total interest costs, and understand amortization schedules for various credit types using the French Amortization System (Método de Amortização Francês), the standard method in Portugal.

**Repository:** [https://github.com/andresousadotpt/credit](https://github.com/andresousadotpt/credit)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [Legal References](#legal-references)
- [Disclaimer](#disclaimer)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Credit Simulation**: Calculate monthly installments, total interest, and TAEG (Annual Percentage Rate)
  - Support for 3 credit types:
    - Housing Variable Rate
    - Housing Fixed Rate
    - Consumer (Car/Personal)

- **Interest Rate Calculations**: Displays both TAN (Nominal Interest Rate) and TAEG

- **Early Repayment Analysis**: Simulate early repayment scenarios with legal commission calculations per Portuguese law
  - Commission rates per DL 133/2009:
    - Housing Variable: 0.5% (exempt under certain conditions)
    - Housing Fixed: 2%
    - Consumer >1 year: 0.5%
    - Consumer ≤1 year: 0.25%

- **Interactive Visualizations**:
  - Bar chart showing monthly interest vs. principal composition
  - Full amortization schedule with 24-row preview and expand functionality
  - Detailed breakdown of each payment

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

- **Internationalization**: Full support for Portuguese (default) and English
  - Language preference saved to localStorage

- **Dark/Light Mode**: CSS custom properties-based theming
  - Theme preference saved to localStorage

- **Accessibility**: Comprehensive tooltips explaining every calculation step

- **No External UI Dependencies**: Fully custom styled components using CSS custom properties

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **CSS Custom Properties** - Modern styling without external UI libraries
- **localStorage** - Client-side preferences persistence

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/andresousadotpt/credit.git
cd credit

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Build & Preview

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Configuration

### Language Selection

Toggle between Portuguese (PT) and English (EN) using the language switcher in the header. Your selection is automatically saved to localStorage and restored on your next visit.

### Theme Selection

Switch between Dark and Light modes using the theme toggle in the header. Your preference is saved to localStorage.

### Default Settings

Customize default values and configuration in `src/config.ts`:

```typescript
// Example configuration structure
export const DEFAULT_CONFIG = {
  language: 'pt',
  theme: 'light',
  // ... additional defaults
};
```

## Project Structure

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Root component
├── config.ts                         # App configuration
├── types/index.ts                    # TypeScript interfaces
├── i18n/                             # Internationalization
│   ├── index.tsx                     # I18n provider & hook
│   ├── pt.ts                         # Portuguese translations
│   └── en.ts                         # English translations
├── context/ThemeContext.tsx          # Dark/Light theme provider
├── hooks/
│   └── useCreditSimulator.ts         # Credit calculation logic
├── styles/
│   └── global.css                    # Global styles & CSS variables
└── components/
    ├── ui/                           # Reusable UI components
    │   ├── InfoTooltip.tsx
    │   └── InputField.tsx
    ├── Layout/                       # Layout components
    │   ├── Header.tsx
    │   └── Footer.tsx
    └── CreditSimulator/              # Feature components
        ├── index.tsx                 # Main simulator
        ├── InputPanel.tsx
        ├── EarlyRepayments.tsx
        ├── SummaryCards.tsx
        ├── Chart.tsx
        └── AmortizationTable.tsx
```

## Legal References

This simulator implements calculations based on the following Portuguese financial regulations:

- **French Amortization System** (Método de Amortização Francês) - Standard amortization method in Portugal
- **DL 133/2009** - Commission rates for early repayment of consumer credit
- **DL 74-A/2017** - Consumer credit regulations
- **DL 80-A/2022** - Updates to consumer credit regulations
- **Law No. 1/2025** - Current Portuguese financial legislation
- **Instruction No. 12/2023 BdP** - Bank of Portugal guidance on credit calculations

## Disclaimer

⚠️ **Important Notice**

This simulator was AI-generated ("vibe coded") and has **NOT been audited by financial professionals**. While efforts have been made to ensure accuracy:

- **Values and calculations may contain errors**
- Results are estimates for educational and informational purposes only
- **Do not make financial decisions based solely on these results**
- Always consult your bank or financial advisor before making credit-related decisions
- Actual installments and costs may differ from simulator results due to additional fees, insurance, or bank-specific conditions

The developers and contributors assume no liability for any financial decisions made based on this simulator's output.

## Contributing

We welcome contributions! Whether you've found a bug, have a feature suggestion, or want to improve the code, your help is appreciated.

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/your-feature-name`)
3. **Commit your changes** (`git commit -m 'Add your feature'`)
4. **Push to the branch** (`git push origin feature/your-feature-name`)
5. **Open a Pull Request**

### Reporting Issues

Please use the [GitHub Issues](https://github.com/andresousadotpt/credit/issues) tab to:

- Report bugs
- Suggest new features
- Ask questions
- Share improvements

When reporting bugs, please include:

- Description of the issue
- Steps to reproduce
- Expected vs. actual behavior
- Browser and device information

### Areas for Contribution

- Bug fixes and performance improvements
- Additional credit types or calculation methods
- Enhanced translations or localization
- Accessibility improvements
- UI/UX enhancements
- Documentation improvements
- Test coverage

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

**Built with** React + TypeScript + Vite | **Made in Portugal** 🇵🇹
