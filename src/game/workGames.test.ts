import { describe, expect, it } from "vitest";
import { dealSpot, spotSolved } from "./spot";
import { dealWires, turnPipe, wiresSolved } from "./wires";
import { pickGame, type WorkGame } from "./workGames";

describe("spot the bug", () => {
  it("hides one change on easy and three on hard", () => {
    expect(dealSpot(3, "easy", 0).puzzle.bugs).toHaveLength(1);
    const hard = dealSpot(3, "hard", 0).puzzle;
    expect(hard.bugs).toHaveLength(3);
    expect(hard.columns).toBe(3);
  });

  it("only changes the bug tiles", () => {
    const { puzzle } = dealSpot(9, "normal", 50);
    puzzle.design.forEach((tile, index) => {
      const same =
        JSON.stringify(tile) === JSON.stringify(puzzle.shipped[index]);
      expect(same).toBe(!puzzle.bugs.includes(index));
    });
    expect(puzzle.hint).toBe(puzzle.bugs[0]);
    expect(spotSolved(puzzle, puzzle.bugs)).toBe(true);
  });
});

describe("connect the wires", () => {
  it("starts unsolved and can always be solved by turning path tiles", () => {
    for (let seed = 1; seed < 60; seed += 1) {
      for (const difficulty of ["easy", "normal", "hard"] as const) {
        const { puzzle } = dealWires(seed, difficulty, 0);
        expect(wiresSolved(puzzle)).toBe(false);
        const answered = {
          ...puzzle,
          pipes: puzzle.pipes.map((pipe) => ({
            ...pipe,
            rotation: pipe.answer,
          })),
        };
        expect(wiresSolved(answered)).toBe(true);
      }
    }
  });

  it("locks the first pieces when a teammate is close", () => {
    const { puzzle } = dealWires(5, "normal", 45);
    expect(puzzle.pipes.filter((pipe) => pipe.locked)).toHaveLength(2);
    expect(
      turnPipe(
        puzzle,
        puzzle.pipes.findIndex((pipe) => pipe.locked),
      ),
    ).toBe(puzzle);
  });
});

describe("game mix", () => {
  it("deals more wires at a remote job and more bugs at a startup", () => {
    const count = (type: "remote" | "startup") => {
      const tally: Record<WorkGame, number> = {
        tidy: 0,
        spot: 0,
        wires: 0,
        ship: 0,
        inbox: 0,
        oneonone: 0,
        sprint: 0,
        roadmap: 0,
      };
      let seed = 1;
      for (let index = 0; index < 3000; index += 1) {
        const picked = pickGame(seed, type);
        tally[picked.game] += 1;
        seed = picked.rngState;
      }
      return tally;
    };
    const remote = count("remote");
    const startup = count("startup");
    expect(remote.wires).toBeGreaterThan(remote.spot);
    expect(startup.spot).toBeGreaterThan(startup.wires);
  });
});
