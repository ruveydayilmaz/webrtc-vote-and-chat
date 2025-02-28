"use client";

import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";

import { Button } from "./ui/button";

interface VoteFormProps {
  votes: { yes: number; no: number };
  castVote: (vote: "yes" | "no") => void;
  resetVotes: () => void;
}

export default function VoteForm({
  castVote,
  votes,
  resetVotes,
}: VoteFormProps) {
  const castNo = () => castVote("no");
  const castYes = () => castVote("yes");

  return (
    <div className="absolute top-0 right-4 py-2 bg-black/70 rounded-b-lg shadow-black shadow-md">
      <p className="text-zinc-200 text-xs text-center">Vote your experience</p>
      <div className="w-full px-4 flex-col items-center justify-center space-y-1">
        <div className="gap-0 flex justify-center items-center select-none">
          <Button
            onClick={castNo}
            variant="secondary"
            className="rounded-full text-blue-500 hover:text-blue-800"
          >
            <ArrowDown />
          </Button>
          <p className="text-blue-500">{votes.yes - votes.no}</p>
          <Button
            onClick={castYes}
            variant="secondary"
            className="rounded-full text-blue-500 hover:text-blue-800"
          >
            <ArrowUp />
          </Button>
        </div>
        <p
          onClick={resetVotes}
          className="text-blue-500 text-[10px] text-center cursor-pointer"
        >
          Reset Votes for everyone
        </p>
      </div>
    </div>
  );
}
