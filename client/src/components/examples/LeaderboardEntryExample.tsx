import { LeaderboardEntry } from "../game/LeaderboardEntry";

export default function LeaderboardEntryExample() {
  return (
    <div className="space-y-2 w-full max-w-md">
      <LeaderboardEntry 
        rank={1} 
        name="Champion" 
        wins={42} 
        losses={8} 
        winStreak={12}
        trend="up"
      />
      <LeaderboardEntry 
        rank={2} 
        name="Player1" 
        wins={35} 
        losses={15} 
        winStreak={5}
        isCurrentUser
        trend="up"
      />
      <LeaderboardEntry 
        rank={3} 
        name="ProGamer" 
        wins={30} 
        losses={20} 
        winStreak={2}
        trend="down"
      />
      <LeaderboardEntry 
        rank={4} 
        name="Newbie" 
        wins={10} 
        losses={5} 
        winStreak={0}
        trend="same"
      />
    </div>
  );
}
