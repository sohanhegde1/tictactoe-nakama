import { StatsCard } from "../game/StatsCard";

export default function StatsCardExample() {
  return (
    <div className="w-full max-w-md">
      <StatsCard
        wins={25}
        losses={12}
        draws={5}
        winStreak={4}
        bestStreak={8}
      />
    </div>
  );
}
