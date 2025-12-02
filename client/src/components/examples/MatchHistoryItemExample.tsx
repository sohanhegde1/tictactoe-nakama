import { MatchHistoryItem } from "../game/MatchHistoryItem";

export default function MatchHistoryItemExample() {
  return (
    <div className="space-y-2 w-full max-w-md">
      <MatchHistoryItem
        opponent="GamerPro"
        result="won"
        date="2 min ago"
        yourSymbol="X"
      />
      <MatchHistoryItem
        opponent="Champion"
        result="lost"
        date="15 min ago"
        yourSymbol="O"
      />
      <MatchHistoryItem
        opponent="NewPlayer"
        result="draw"
        date="1 hour ago"
        yourSymbol="X"
      />
    </div>
  );
}
