import { PlayerCard } from "../game/PlayerCard";

export default function PlayerCardExample() {
  return (
    <div className="space-y-4 w-full max-w-md">
      <PlayerCard 
        name="Player1" 
        symbol="X" 
        isActive={true}
        isYou={true}
        score={5}
      />
      <PlayerCard 
        name="Opponent" 
        symbol="O" 
        isActive={false}
        score={3}
      />
    </div>
  );
}
