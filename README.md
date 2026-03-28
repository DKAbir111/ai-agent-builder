# AI Agent Profile Builder

A modern, interactive web application for building and managing AI agent profiles with an intuitive drag-and-drop interface.

## 🎯 Issues Fixed & Improvements

This project started with a partially built interface suffering from **performance issues**, **logical bugs**, and **styling problems**. Here's what was identified and fixed:

### 🐛 Bugs Fixed

| Issue | Fix | Impact |
|-------|-----|--------|
| **Type Safety** | Replaced `err: any` with `err: unknown` in fetchAPI catch block | Better type checking and error handling |
| **Dependency Bug** | Added missing `agentName` dependency to analytics useEffect | Fixed infinite loops and stale closures |
| **State Mutation** | Replaced direct state mutation with immutable updates in `handleLayerSelect` | Prevented unexpected behavior and React warnings |
| **Memory Leaks** | Used stable unique IDs instead of array indices for list keys | Proper component identity and state preservation |

### ⚡ Performance Optimizations

| Performance Issue | Solution | Result |
|------------------|----------|--------|
| **Duplicate State** | Removed duplicate `sessionTime` state and interval from App component | Eliminated unnecessary re-renders and memory usage |
| **App-wide Re-renders** | Isolated session timer into dedicated component | Prevented cascading re-renders across entire app |
| **Redundant API Calls** | Removed redundant `fetchAPI()` calls triggered on user selections | Faster response times and reduced server load |
| **Component Memoization** | Applied React.memo to prevent unnecessary re-renders | Smoother UI interactions |

### 🎨 Benefits You'll Notice Now

✅ **Faster Performance** - App responds instantly without lag or delays  
✅ **Smooth Interactions** - No more unnecessary re-renders or flickering  
✅ **Reliable State Management** - Fixed bugs mean stable, predictable behavior  
✅ **Better Developer Experience** - Type-safe code with proper error handling  
✅ **Professional UI** - Beautiful drag-and-drop interface with Tailwind styling  

---

## ✨ Features

- **Intuitive Drag-and-Drop**: Build agent profiles by dragging skills onto the canvas (powered by dnd-kit)
- **Modern Design**: Responsive UI built with Tailwind CSS that looks professional on all devices
- **Clean Architecture**: Well-structured React components following best practices
- **Reliable Session Management**: Real-time timer tracking without performance issues
- **Persistent Storage**: Save multiple agent configurations and load them instantly

## 🚀 Live Demo

[**Try the Live Demo**](https://ai-agent-builder-sandy.vercel.app/)

## 🛠 Tech Stack

- **React 18** - Latest hooks and concurrent features
- **TypeScript** - Type-safe development for reliability
- **Tailwind CSS** - Modern, utility-first styling
- **dnd-kit** - Performant drag-and-drop library
- **Vite** - Lightning-fast build tool

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd ai-agent-builder

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📂 Project Structure

```
src/
├── components/
│   ├── AgentCanvas.tsx      - Drag-and-drop canvas
│   ├── DraggableItem.tsx    - Draggable item component
│   ├── Header.tsx           - Navigation header with CV link
│   ├── ProfileCard.tsx      - Agent profile display
│   ├── SavedAgentCard.tsx   - Saved agents selector
│   └── SkillsPanel.tsx      - Available skills
├── App.tsx                  - Main application
├── types.ts                 - Type definitions
└── index.css                - Global styles
```

## 👤 About

Built with focus on **code quality**, **performance**, and **user experience**. This project demonstrates practical React optimization techniques and modern web development practices.

**[View My CV](https://tinyurl.com/darunkaras)** - See my professional background and experience
