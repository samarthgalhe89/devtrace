# 🧠 GitHub Intelligence Dashboard

> **A personal developer analytics platform** — visualize your GitHub presence, decode your coding DNA, and surface AI-powered insights about your engineering journey.

---

## ✨ Overview

This is a personal web application I built to go beyond GitHub's native statistics. It connects to your GitHub account via OAuth, pulls data from the GitHub REST API, and transforms raw numbers into a rich, interactive analytics experience — complete with AI-generated insights about your development patterns and growth.

The goal was simple: build something that feels like a genuine tool for self-reflection as a developer, not just a vanity metrics dashboard.

---

## 🚀 Key Features

### 🔐 Secure GitHub OAuth Authentication
Seamless, one-click login powered by **NextAuth.js** with GitHub as the OAuth provider. No passwords, no friction — just a secure token-based session that grants scoped access to your GitHub data.

### 📊 Profile Analytics
A deep dive into your GitHub presence at a glance — total repositories, follower and following counts, public contributions, and a timeline of recent activity. Understand your visibility and reach as a developer over time.

### 🧬 Developer DNA
One of the more unique features: an algorithmic analysis that surfaces your **developer archetype** based on your activity patterns. It measures consistency metrics (how regularly you commit), language diversity (how many technologies you actively use), and synthesizes a profile of your coding identity.

### 🏥 Repository Health Score
A custom-built scoring engine that evaluates each of your repositories across multiple dimensions — stars, fork count, recency of activity, and engagement signals — to produce a single, at-a-glance **Health Score**. Instantly know which projects are thriving and which have gone dormant.

### 🤖 AI-Powered Insights
Leveraging the **OpenAI API**, the dashboard generates a written, narrative analysis of your entire GitHub profile. It draws meaningful conclusions about your growth trajectory, technology preferences, and contribution behavior — the kind of reflection that raw numbers alone can't provide.

### 📈 Beautiful Visualizations
All data is brought to life through dynamic, interactive charts and graphs built with **Recharts**. From language breakdowns to commit frequency over time, every visualization is designed to be both informative and immediately readable.

### 🎨 Modern Glassmorphism UI
A sleek, fully responsive interface built with a dark-mode-first philosophy. The design features a custom animated **grid background**, layered **glassmorphism** card components, ambient **glow effects**, and custom CSS animations (`pulse-glow`, `fade-in`) to create an immersive, polished experience.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript |
| **Authentication** | NextAuth.js v4 (GitHub Provider) |
| **Styling** | Tailwind CSS v4 + Custom CSS Animations |
| **Data Visualization** | Recharts |
| **External APIs** | GitHub REST API, OpenAI API |

---

## 📸 Screenshots

*Coming soon.*

---

*Built with ☕ and curiosity.*