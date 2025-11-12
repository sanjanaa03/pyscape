# Code Duel - Quick Start Guide

## What is Code Duel?

Code Duel is Pyscape's real-time competitive coding feature where you can challenge other developers in live 1v1 coding battles. Race to solve problems, earn XP, and climb the leaderboard!

## Architecture

### Frontend (React)
- **WebSocket Client**: Maintains persistent connection to duel server
- **Monaco Editor**: Professional code editing experience
- **Real-time UI**: Live updates for opponent progress, timer, and chat

### Backend (Node.js + WebSockets)
- **WebSocket Server** (`backend/duel-server.js`): Handles real-time connections
- **Matchmaking System**: Pairs players by skill level and preferences
- **Judge0 Integration**: Secure code execution and testing
- **Supabase Integration**: Authentication, data persistence, XP updates

## How It Works

### 1. Player Flow
```
Join Queue → Get Matched → Duel Starts → Submit Code → Results → XP Award
```

### 2. Matchmaking
- Players specify difficulty (beginner/intermediate/advanced) and language
- System finds opponents with matching preferences
- If queue gets large, matches players anyway to reduce wait time
- Both players receive the same random problem from the database

### 3. During the Duel
- 15-minute time limit
- Players code independently with live opponent awareness
- Submit code anytime - executes against hidden test cases
- Real-time chat for sportsmanship
- Timer counts down for both players

### 4. Code Execution
- Code sent to Judge0 API via RapidAPI
- Runs in isolated Docker containers (security)
- Tests against hidden test cases
- Returns: pass/fail, runtime, memory, detailed results
- Real-time feedback to player

### 5. Victory Conditions
1. **Both complete**: Fastest time wins (or higher score if tied)
2. **One completes**: That player wins
3. **Neither completes**: Higher score wins
4. **Forfeit/disconnect**: Opponent wins

### 6. Rewards
- **Winner**: 200 XP
- **Loser**: 50 XP (participation)
- **Forfeit winner**: 150 XP
- Stats updated in leaderboard

## Setup Instructions

### Prerequisites
- Node.js 16+
- Supabase project
- RapidAPI account with Judge0 CE subscription

### Backend Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment** (create `backend/.env`):
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   RAPIDAPI_KEY=your-rapidapi-key
   WS_PORT=8080
   ```

3. **Run database migrations**:
   - Go to Supabase SQL Editor
   - Run `migrations/002_create_duel_tables.sql`
   - Verify tables created: `duels`, `duel_submissions`, `duel_stats`

4. **Start WebSocket server**:
   ```bash
   npm run dev:duel
   ```
   
   You should see:
   ```
   🚀 Code Duel WebSocket Server running on ws://localhost:8080
   ```

### Frontend Setup

The frontend is already integrated - just ensure:
1. React app is running (`npm start` in root)
2. Monaco Editor dependency is installed
3. Navigate to `/code-duel` route

## WebSocket Message Protocol

### Client → Server

```javascript
// Authenticate
{ type: 'AUTHENTICATE', token: 'jwt_token' }

// Join matchmaking
{ type: 'JOIN_QUEUE', difficulty: 'beginner', language: 'python' }

// Leave queue
{ type: 'LEAVE_QUEUE' }

// Submit code
{ type: 'SUBMIT_CODE', code: 'def solution()...', language: 'python' }

// Send chat
{ type: 'CHAT_MESSAGE', message: 'Good luck!' }

// Leave duel
{ type: 'LEAVE_DUEL' }
```

### Server → Client

```javascript
// Auth confirmed
{ type: 'AUTH_SUCCESS', userId: '...' }

// Entered queue
{ type: 'QUEUE_JOINED', position: 2, estimatedWait: 10 }

// Duel starting
{ 
  type: 'DUEL_START', 
  duelId: '...', 
  problem: {...}, 
  opponent: {...},
  timeLimit: 900000 
}

// Code result
{ 
  type: 'SUBMISSION_RESULT', 
  result: { status: 'passed', score: 100, runtime: 245, ... }
}

// Duel ended
{ 
  type: 'DUEL_END', 
  winner: 'user_id', 
  results: { player1: {...}, player2: {...} }
}
```

## Database Schema

### `duels`
Stores duel session metadata
- `id`: Unique duel identifier
- `problem_id`: Problem used
- `player1_id`, `player2_id`: Participants
- `status`: active | completed | forfeited | timeout
- `winner_id`: Who won
- `player1_score`, `player2_score`: Final scores
- `started_at`, `ended_at`: Timestamps

### `duel_submissions`
Individual code submissions during duels
- `duel_id`: Which duel
- `user_id`: Who submitted
- `code`: Submitted code
- `status`, `score`, `runtime_ms`: Results

### `duel_stats`
Aggregated player statistics
- `user_id`: Player
- `total_duels`, `wins`, `losses`, `forfeits`
- `win_streak`, `best_win_streak`
- `rank`: Leaderboard position

## Testing

### Local Testing (Single Machine)

1. Start backend server:
   ```bash
   cd backend && npm run dev:duel
   ```

2. Start frontend:
   ```bash
   npm start
   ```

3. Open two browser windows:
   - Window 1: Login as User A → Join queue
   - Window 2: Login as User B (different account) → Join queue
   - Both should be matched and start a duel

### Testing Scenarios

**Test Case 1: Normal duel**
- Both players submit code
- One completes first
- Winner announced, XP awarded

**Test Case 2: Forfeit**
- Player 1 leaves mid-duel
- Player 2 declared winner

**Test Case 3: Timeout**
- Neither completes in 15 minutes
- Higher score wins

**Test Case 4: Chat**
- Send messages during duel
- Messages appear in opponent's chat

## Production Considerations

### Scaling
- Single WebSocket server handles ~1000 concurrent connections
- For more scale, use Redis pub/sub to coordinate multiple WS servers
- Database connection pooling for high traffic

### Security
- JWT authentication required for all WS messages
- Code execution in isolated Judge0 containers
- Rate limiting on code submissions (prevent spam)
- RLS policies prevent data access violations

### Monitoring
- Log all duel outcomes
- Track average matchmaking time
- Monitor Judge0 API latency
- Alert on WebSocket disconnections

## Common Issues

**Issue**: Players can't connect
- Check WebSocket server is running
- Verify port 8080 is open
- Check browser console for errors

**Issue**: No opponents found
- Need 2+ players in queue
- Use incognito/different browsers for testing
- Check difficulty/language matches

**Issue**: Code execution fails
- Verify RapidAPI key is valid
- Check Judge0 API status
- Review error logs in server console

## Future Enhancements

- [ ] Tournaments (bracket-style)
- [ ] Team duels (2v2)
- [ ] Spectator mode
- [ ] Replay system
- [ ] ELO-based matchmaking
- [ ] Language-agnostic problems
- [ ] Mobile app support

## API Reference

See `backend/duel-server.js` for complete WebSocket API implementation.

## Support

For issues, check:
1. Server logs: `backend/duel-server.js` console output
2. Browser console: Network tab for WebSocket messages
3. Supabase logs: Check database errors
4. Judge0 status: https://ce.judge0.com/

---

**Ready to duel?** Navigate to `/code-duel` and find your first opponent! ⚔️
