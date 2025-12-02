import { MatchStatus } from "../game/MatchStatus";

export default function MatchStatusExample() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <MatchStatus status="searching" />
      <MatchStatus status="your_turn" timeRemaining={25} />
      <MatchStatus status="opponent_turn" opponentName="Alex" />
      <MatchStatus status="won" />
    </div>
  );
}
