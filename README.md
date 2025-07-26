# My Christian Life 🙏

A modern, responsive web application for managing your spiritual journey, featuring altar practice tracking, sacred registration forms, and mobile-optimized navigation.

## 🌟 Features

### 📱 **Mobile-First Design**
- **Responsive layout** that works perfectly on desktop, tablet, and mobile
- **Collapsible sidebar navigation** with smooth slide-in animation
- **Touch-friendly interface** optimized for mobile interactions
- **Progressive enhancement** from mobile to desktop experience

### ⛪ **Sacred Altar Registration**
- **Multi-step form** with 4 comprehensive sections:
  1. **Basic Information** - Name, purpose, location, and establishment details
  2. **Sacred Practices** - Selection of 9 different Christian practices with informational tooltips
  3. **Sacrifices** - Various types of spiritual offerings and commitments
  4. **Custom Items** - Dynamic addition/removal of personalized altar items
- **Form validation** and user-friendly error handling
- **Progress tracking** with visual indicators
- **Success confirmation** with automatic form reset

### 🧭 **Navigation System**
- **Multi-section website** with dedicated areas for:
  - Dashboard overview
  - Altar Practice (with embedded registration form)
  - Bible Study resources
  - Spiritual Goals tracking
  - Personal Journal
  - Christian Resources
- **Active state management** with visual feedback
- **Smooth transitions** between sections

### 🎨 **Beautiful Design**
- **Warm, earthy color palette** inspired by sacred traditions
- **Typography optimized** for readability and spiritual atmosphere
- **Gradient backgrounds** and subtle shadow effects
- **Consistent design system** throughout the application

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of web navigation

### Installation & Usage

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kittoe99/faith.git
   cd faith
   ```

2. **Open the website:**
   - Open `index.html` in your web browser
   - Or serve it using a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve .
     ```

3. **Navigate the site:**
   - Use the sidebar menu to explore different sections
   - On mobile, tap the **+** button in the top-left to open the menu
   - Click "Altar Practice" to access the Sacred Altar Registration form

## 📱 Mobile Experience

### Navigation
- **Plus icon toggle** in the top-left corner (mobile only)
- **Slide-out menu** from the left side
- **Auto-close** when selecting navigation items
- **Outside tap** to close menu

### Form Optimization
- **Touch-friendly** buttons and inputs
- **Smaller typography** for mobile readability
- **Optimized spacing** for thumb navigation
- **Responsive tooltips** that work on touch devices

## 🛠️ Technologies Used

- **HTML5** - Semantic markup structure
- **CSS3** - Modern styling with Grid, Flexbox, and CSS Variables
- **Vanilla JavaScript** - Interactive functionality without dependencies
- **Font Awesome** - Beautiful iconography
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **Google Fonts** - Inter and Lora font families

## 📂 Project Structure

```
faith/
├── index.html              # Main website file
├── css/
│   └── styles.css         # Custom styles and responsive design
├── js/
│   ├── main.js           # Main application logic & mobile menu
│   └── altar-form.js     # Sacred Altar Registration form handler
├── altar/
│   └── Altar.html        # Standalone altar form (legacy)
├── .gitignore            # Git ignore configuration
└── README.md             # Project documentation
```

## 🎯 Key Components

### Mobile Menu System
- Toggle button with rotating plus/X icon
- Smooth slide animations (280px sidebar)
- Event handling for click outside and window resize
- Responsive breakpoints for different screen sizes

### Sacred Altar Registration Form
- Step-by-step progression with validation
- Dynamic custom item management
- Tooltip system for educational content
- Form persistence and reset functionality

### Responsive Design
- **Mobile:** ≤768px - Full mobile experience with slide menu
- **Tablet:** 769px-1024px - Compact sidebar layout
- **Desktop:** >1024px - Full sidebar always visible

## 🔧 Customization

### Colors
The design uses CSS custom properties for easy customization:
```css
:root {
    --brand-primary: #8B5A2B;    /* Warm brown */
    --brand-secondary: #A67C52;  /* Light brown */
    --accent-color: #D4A76A;     /* Gold accent */
    --bg-main: #F8F4ED;          /* Warm beige */
}
```

### Breakpoints
Responsive breakpoints can be adjusted in `styles.css`:
- Mobile: `@media (max-width: 768px)`
- Tablet: `@media (max-width: 1024px) and (min-width: 769px)`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📖 Spiritual Purpose

This application is designed to support Christians in their spiritual journey by providing:
- **Digital tools** for altar practice and sacred traditions
- **Educational content** about Christian practices and sacrifices
- **Personal tracking** of spiritual growth and commitments
- **Mobile accessibility** for prayer and reflection anywhere

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙋‍♀️ Support

If you have questions or need help:
- Open an issue on GitHub
- Check the documentation in the code comments
- Review the responsive design implementation

---

*"Trust in the Lord with all your heart and lean not on your own understanding."* - Proverbs 3:5

Built with ❤️ for the Christian community.
