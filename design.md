# Multiplayer Tic-Tac-Toe Design Guidelines

## Design Approach
**System-Based with Gaming Polish**: Material Design principles adapted for casual gaming, prioritizing clarity and real-time feedback while maintaining a playful, engaging aesthetic.

## Core Design Principles
1. **Gameplay First**: All UI elements support immediate game comprehension and action
2. **Mobile-Optimized**: Touch-friendly, thumb-zone aware layouts
3. **Real-time Clarity**: Visual feedback for all state changes (player moves, turn switches, matchmaking)
4. **Minimal Cognitive Load**: Simple, focused screens with clear CTAs

---

## Typography

**Primary Font**: Inter (via Google Fonts CDN)
- Headings: 600-700 weight, used for game status, screen titles
- Body: 400-500 weight for player names, stats, leaderboard entries
- Monospace variant for timer countdowns if implemented

**Scale**:
- Large: 32-40px (screen titles, game result)
- Medium: 20-24px (player names, current turn indicator)
- Small: 14-16px (stats, timestamps, secondary info)
- Micro: 12px (metadata, footer text)

---

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16** (p-4, m-6, gap-8, etc.)

**Container Strategy**:
- Max width: `max-w-md` (448px) for game screens - keeps board proportional on desktop
- Full width on mobile with `px-4` padding
- Centered layouts: `mx-auto` for all game containers

**Vertical Rhythm**:
- Screen padding: `py-8` (mobile), `py-12` (desktop)
- Section spacing: `space-y-6` between major UI blocks
- Component internal spacing: `p-4` to `p-6`

---

## Component Library

### Game Board
- 3x3 grid with equal square cells
- Responsive sizing: `aspect-square` for each cell
- Grid gap: `gap-2` (8px between cells)
- Cell dimensions: Calculate to fit mobile viewport (~100-120px per cell on phones)
- Border treatment: Rounded corners `rounded-lg` on cells, subtle borders

### Player Cards
- Horizontal layout showing: avatar placeholder, name, score indicator
- Fixed height: `h-16` to `h-20`
- Display both players side-by-side or stacked depending on screen state
- Active player gets visual emphasis (border glow, subtle scale)

### Match Status Banner
- Fixed position at top: shows "Your Turn" / "Opponent's Turn" / "Searching for opponent..."
- Height: `h-12` to `h-16`
- Icon + text combination using Heroicons (clock, user-group, trophy icons)

### Leaderboard Entries
- List items with rank badge, player name, W/L/Streak stats
- Row height: `h-14` to `h-16`
- Alternating subtle background for readability
- Current player row highlighted distinctly

### Modal Overlays
- Match result screen (Win/Lose/Draw) as full-screen overlay
- Backdrop blur: `backdrop-blur-sm`
- Content card: `rounded-2xl`, centered with `max-w-sm`
- Action buttons: Primary "Play Again", Secondary "Back to Lobby"

### Navigation
- Bottom tab bar on mobile: Home, Leaderboard, Profile (3-4 tabs max)
- Icon-first with small labels
- Height: `h-16`, safe area padding on notched devices

---

## Icons
**Library**: Heroicons via CDN (outline style for most UI, solid for active states)

**Key Icons**:
- Users/user-group: Multiplayer/matchmaking
- Trophy: Wins, leaderboard
- Clock: Timer mode
- X-mark, Check: Game symbols
- Arrow-path: Rematch
- Bars-3: Menu

---

## Images

### Avatar Placeholders
- **Location**: Player cards, leaderboard entries
- **Style**: Circular, 40-48px diameter, placeholder initials or simple geometric patterns
- **Description**: Generated colored circles with player initials in white text

### Game State Illustrations
- **Location**: Empty states (waiting for match, no leaderboard data yet)
- **Style**: Simple line art or minimal illustrations, 120-200px size
- **Description**: 
  - Matchmaking: Two user silhouettes with connecting line
  - Empty leaderboard: Trophy with dashed outline
  - Connection lost: Broken chain link icon

### Result Screen Icons
- **Location**: Game over modal
- **Style**: Large icon (80-100px) above result text
- **Description**:
  - Win: Trophy or star burst (celebratory)
  - Loss: Neutral game-over icon
  - Draw: Handshake or equal symbol

**No Hero Image**: This is an application interface, not a landing page

---

## Screen Structure

### Main Screens (4-5 primary views)

1. **Lobby/Home**
   - "Find Match" large button (primary CTA)
   - Player stats card (compact: name, recent W/L)
   - Recent matches list (last 3-5 games)

2. **Matchmaking**
   - Centered spinner/animation
   - "Searching for opponent..." text
   - Cancel button below

3. **Active Game**
   - Top: Match status banner
   - Upper: Opponent card
   - Center: Game board (dominant focus)
   - Lower: Your player card
   - Bottom: Safe padding above nav bar

4. **Leaderboard**
   - Filter tabs: Global / Friends (if applicable)
   - Scrollable ranked list
   - Your rank highlighted/pinned at top if not in view

5. **Profile/Stats**
   - Win/Loss/Draw percentages
   - Win streak tracker
   - Match history

---

## Animations
**Minimal, Purposeful Only**:
- Cell selection: Quick scale bounce (0.2s)
- Turn switch: Gentle fade transition on status banner
- Matchmaking: Subtle pulse on search indicator
- Victory: Confetti or particle burst (brief, 1-2s)

**No**: Excessive page transitions, decorative animations, background effects

---

## State Indicators

**Visual Feedback Patterns**:
- Active turn: Glowing border on player card
- Opponent thinking: Subtle pulse on their avatar
- Move made: Brief flash on board cell
- Connection issues: Banner notification with retry button
- Loading states: Skeleton screens, not blank white

---

## Accessibility
- Touch targets: Minimum 48x48px for all interactive elements
- Contrast ratios: WCAG AA compliance for all text
- Focus indicators: Visible keyboard focus rings
- Screen reader: Proper ARIA labels for game state, turn order
- Reduced motion: Respect `prefers-reduced-motion` for all animations

---

## Key Differentiators
- **Not** a traditional three-column card layout - game board is the hero
- Compact, game-focused UI without marketing fluff
- Real-time status always visible, never hidden
- Mobile-first proportions that scale up gracefully
- Playful without being childish - appeal to all ages
