import { useState } from "react";
import { GameResultModal } from "../game/GameResultModal";
import { Button } from "@/components/ui/button";

export default function GameResultModalExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Show Result</Button>
      <GameResultModal
        isOpen={isOpen}
        result="won"
        onPlayAgain={() => {
          console.log("Play again clicked");
          setIsOpen(false);
        }}
        onBackToLobby={() => {
          console.log("Back to lobby clicked");
          setIsOpen(false);
        }}
        stats={{
          yourScore: 5,
          opponentScore: 3,
          winStreak: 3
        }}
      />
    </>
  );
}
