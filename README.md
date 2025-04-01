# Superhuman Benchmark

A more challenging version of Human Benchmark with deceptive gameplay elements. Test your cognitive abilities with hardcore twists on classic brain games.

## Overview

Superhuman Benchmark is inspired by the popular Human Benchmark website but takes each game to the next level with intentionally deceptive mechanics that test your ability to adapt, focus, and overcome challenging distractions.

## Games

### Reaction Time
Test your reactions by clicking when the screen turns green, but watch out for "bait" colors like pink or light green designed to trick you into clicking too early.

### Verbal Memory
Keep as many words in memory as possible. The twist: words you've seen before will be modified with added letters or misspelled to confuse you about whether you've seen them already.

### Sequence Memory
Remember patterns of flashing squares, but with increasing difficulty as squares move around while you're trying to recall them, and some even temporarily disappear in later levels.

### Typing Speed
How fast can you type when text is constantly changing? The upcoming text will change while you type, and even previously typed text might change, forcing you to delete and retype.

## Technology Stack

- Next.js with App Router
- TypeScript
- Tailwind CSS
- Local storage for score tracking

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages
- `/components` - Reusable React components
  - `/components/games` - Individual game components
- `/utils` - Utility functions including score tracking service

## Next Steps & Potential Improvements

- Add more games with hardcore twists
- Implement user accounts for permanent score tracking
- Add global leaderboards
- Add difficulty settings for each game
- Enhance accessibility options
- Add sound effects and visual feedback