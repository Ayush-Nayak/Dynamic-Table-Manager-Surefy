# 📊 Dynamic Data Table Manager

> **Internship Project for SUREFY TECHNOLOGIES PRIVATE LIMITED**  
> Frontend Development Internship Task

A powerful, feature-rich data table management system built with modern React technologies, demonstrating advanced frontend development skills including state management, dynamic UI components, and real-world data handling capabilities.

## 🎯 Project Overview

This project showcases a comprehensive data table solution with dynamic column management, CSV import/export functionality, advanced filtering, and inline editing capabilities. Built as part of my frontend development internship assessment for **SUREFY TECHNOLOGIES PRIVATE LIMITED**.

## ✨ Key Features

### Core Functionality
- **📋 Dynamic Data Table**: Responsive table with default columns (Name, Email, Age, Role)
- **🔄 Advanced Sorting**: Click column headers for ASC/DESC toggle sorting
- **🔍 Global Search**: Real-time search across all table fields
- **📄 Client-side Pagination**: Optimized viewing with 10 rows per page
- **🎛️ Dynamic Column Management**: Add/remove columns with persistent preferences

### Data Management
- **📥 CSV Import**: Upload and parse CSV files with error handling
- **📤 CSV Export**: Export current table view to CSV format
- **💾 Data Persistence**: Column preferences saved in localStorage
- **🔄 State Management**: Centralized state handling with Redux Toolkit

### Enhanced User Experience
- **✏️ Inline Editing**: Double-click to edit cells with validation
- **🗑️ Row Actions**: Edit and delete operations with confirmation
- **🌗 Theme Toggle**: Light/Dark mode switching
- **📱 Responsive Design**: Mobile-first approach with MUI components
- **🎯 Input Validation**: Form validation using React Hook Form

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14** (App Router)
- **React 18** with TypeScript
- **Material-UI (MUI) v5+**

### State Management
- **Redux Toolkit** for centralized state
- **Redux Persist** for data persistence

### Data Processing
- **PapaParse** for CSV parsing
- **FileSaver.js** for file downloads

### Form Handling
- **React Hook Form** with validation

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ayush-Nayak/dynamic-table-manager.git
   cd dynamic-table-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── common/           # Shared components
│   ├── modals/           # Modal components
│   └── table/            # Table-specific components
├── hooks/                # Custom React hooks
├── providers/            # Context providers
├── store/                # Redux store configuration
│   └── slices/           # Redux slices
├── types/                # TypeScript type definitions
└── utils/                # Utility functions
```

## 🎯 Core Features Implementation

### Dynamic Column Management
- Modal interface for adding new columns (Department, Location, etc.)
- Checkbox controls for showing/hiding columns
- Real-time table updates with column changes
- Persistent column preferences

### CSV Operations
- **Import**: Drag-and-drop or file selection with validation
- **Export**: Downloads current table view with only visible columns
- Error handling for malformed CSV files

### Advanced Table Features
- Multi-field search functionality
- Sortable columns with visual indicators
- Pagination with customizable page sizes
- Row selection and bulk operations

## 🏆 Technical Achievements

- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized rendering with React.memo and useMemo
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Mobile Responsive**: Adaptive design for all screen sizes
- **Error Handling**: Comprehensive error boundaries and validation
- **Code Quality**: Clean, maintainable code with proper separation of concerns

## 📋 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

## 🔧 Configuration

The project includes configurations for:
- **ESLint**: Code linting and formatting
- **TypeScript**: Type checking and compilation
- **Next.js**: Framework configuration
- **Redux**: State management setup

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Adaptive table layouts
- Touch-friendly interactions
- Optimized performance across devices

## 🎨 Theming

- Light and Dark mode support
- Material-UI theming system
- Consistent color palette
- Accessible contrast ratios

## 📊 Performance Features

- Lazy loading for large datasets
- Efficient rendering with virtualization
- Optimized bundle size
- Fast CSV processing

## 🤝 About This Project

This project was developed as part of my **Frontend Development Internship** application for **SUREFY TECHNOLOGIES PRIVATE LIMITED**. It demonstrates proficiency in:

- Modern React development patterns
- State management with Redux
- TypeScript implementation
- Material-UI component library
- File handling and processing
- Responsive web design
- Clean code practices

## 👨‍💻 Developer

Ayush Nayak  
Frontend Development Intern Candidate  
SUREFY TECHNOLOGIES PRIVATE LIMITED

---

## 📄 License

This project is created for internship assessment purposes.

---

*Built with ❤️ for SUREFY TECHNOLOGIES PRIVATE LIMITED*