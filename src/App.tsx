import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import {
  acceptOffer,
  careerStatus,
  createCareer,
  declinePost,
  endDay,
  failInterview,
  finishPlacement,
  finishWork,
  joinCompany,
  netWorth,
  nextMorning,
  sceneFor,
  startInterview,
  switchTrack,
  type CareerState,
} from "./game/career";
import { formatMoney } from "./game/format";
import { isStock, type MarketId } from "./game/market";
import type { PlacementOutcome } from "./game/placement";
import { clearGame, loadGame, saveGame } from "./game/save";
import type { JobPost } from "./game/workline";
import { HOME_VIDEO } from "./content/sceneVideo";
import { OfferCard } from "./ui/kit";
import {
  InvestDesk,
  MarketScreen,
  StocksScreen,
  BlackjackScreen,
  ShopDesk,
} from "./ui/PersonalDesk";
import { Placement } from "./ui/Placement";
import { GameView, type ScenePanel } from "./ui/GameView";
import { Sandbox } from "./ui/Sandbox";
import { useSceneLayout } from "./ui/useSceneLayout";
import { InterviewSession, WorklineFeed } from "./ui/Workline";
import { WorkSession } from "./ui/WorkSession";

type Mode = "play" | "sandbox";

/** Play and Sandbox tabs are only for the web dev server, never in the app build. */
const devTools = import.meta.env.DEV && !Capacitor.isNativePlatform();

export function App() {
  const [career, setCareer] = useState<CareerState>(
    () => loadGame() ?? createCareer(),
  );
  const [panel, setPanel] = useState<ScenePanel>(null);
  const [market, setMarket] = useState<MarketId>("ATLS");
  const [interview, setInterview] = useState<JobPost | null>(null);
  const [mode, setMode] = useState<Mode>("play");
  const scene = useSceneLayout();

  useEffect(() => {
    saveGame(career);
  }, [career]);

  useEffect(() => {
    if (career.section !== "room") setPanel(null);
  }, [career.section]);

  function restart() {
    clearGame();
    setCareer(createCareer());
    setPanel(null);
  }

  const forced =
    career.section === "placement" ||
    career.section === "offers" ||
    career.section === "summary";
  const shown = forced ? "screen" : panel;

  return (
    <main className="phone">
      {devTools ? (
        <nav className="mode-tabs">
          <button
            type="button"
            className={mode === "play" ? "on" : ""}
            onClick={() => setMode("play")}
          >
            Play
          </button>
          <button
            type="button"
            className={mode === "sandbox" ? "on" : ""}
            onClick={() => setMode("sandbox")}
          >
            Sandbox
          </button>
        </nav>
      ) : null}
      {devTools && mode === "sandbox" ? (
        <Sandbox
          boxes={scene.boxes}
          onEdit={scene.edit}
          onReset={scene.reset}
          career={career}
          onCareer={(next) => {
            setPanel(null);
            setCareer(next);
          }}
          onPlay={() => setMode("play")}
        />
      ) : (
        <GameView
          environment={sceneFor(career)}
          deviceId={career.deviceId}
          lookId={career.lookId}
          stats={career.section === "placement" ? null : career.stats}
          locked={forced}
          panel={panel}
          workDone={career.workDone}
          boxes={scene.boxes}
          video={HOME_VIDEO}
          screenTone={
            panel === "market"
              ? isStock(market)
                ? "stock"
                : market
              : panel === "stocks"
                ? "stock"
                : panel === "blackjack"
                  ? "blackjack"
                  : panel === "workline" || panel === "interview"
                    ? "workline"
                    : undefined
          }
          career={career.company ? careerStatus(career) : undefined}
          onSwitchTrack={
            career.company && career.section === "room"
              ? () => {
                  setPanel(null);
                  setCareer(switchTrack(career));
                }
              : undefined
          }
          onWork={() => setPanel("work")}
          onEndDay={() => setCareer(endDay(career))}
          onInvest={() => setPanel("invest")}
          onShop={() => setPanel("shop")}
          onWorkline={
            career.company && career.section === "room"
              ? () => setPanel("workline")
              : undefined
          }
          jobCount={career.feed.posts.length}
          onBack={
            panel === "market" && isStock(market)
              ? () => setPanel("stocks")
              : undefined
          }
          onClose={() => setPanel(null)}
        >
          {career.section === "placement" ? (
            <Placement
              onDone={(outcome: PlacementOutcome, moves: number) =>
                setCareer(finishPlacement(career, outcome, moves))
              }
            />
          ) : null}
          {career.section === "offers" ? (
            <section className="screen">
              <h1>Offers</h1>
              <p className="ask">{career.placementBlurb}</p>
              <div className="offer-list">
                {career.offers.map((company) => (
                  <OfferCard
                    key={company.id}
                    company={company}
                    note={company.summary}
                    onPick={() => setCareer(acceptOffer(career, company.id))}
                  />
                ))}
              </div>
            </section>
          ) : null}
          {shown === "work" ? (
            <WorkSession
              state={career}
              onChange={setCareer}
              onFinish={() => {
                setCareer(finishWork(career));
                setPanel(null);
              }}
            />
          ) : null}
          {shown === "invest" ? (
            <InvestDesk
              state={career}
              onOpenMarket={(id) => {
                setMarket(id);
                setPanel("market");
              }}
              onOpenBlackjack={() => setPanel("blackjack")}
              onOpenStocks={() => setPanel("stocks")}
            />
          ) : null}
          {shown === "stocks" ? (
            <StocksScreen
              state={career}
              onOpenMarket={(id) => {
                setMarket(id);
                setPanel("market");
              }}
            />
          ) : null}
          {shown === "market" ? (
            <MarketScreen state={career} id={market} onChange={setCareer} />
          ) : null}
          {shown === "workline" ? (
            <WorklineFeed
              state={career}
              onApply={(post) => {
                const started = startInterview(career, post.id);
                if (started === career) return;
                setCareer(started);
                setInterview(post);
                setPanel("interview");
              }}
            />
          ) : null}
          {shown === "interview" && interview ? (
            <InterviewSession
              key={interview.id}
              state={career}
              post={interview}
              onPass={(offer) => {
                setCareer(joinCompany(career, offer));
                setInterview(null);
                setPanel(null);
              }}
              onFail={() => {
                setCareer(failInterview(career, interview.id));
                setInterview(null);
                setPanel("workline");
              }}
              onPulled={() => {
                setCareer(failInterview(career, interview.id));
                setInterview(null);
                setPanel("workline");
              }}
              onReject={() => {
                setCareer(declinePost(career, interview.id));
                setInterview(null);
                setPanel("workline");
              }}
            />
          ) : null}
          {shown === "blackjack" ? (
            <BlackjackScreen state={career} onChange={setCareer} />
          ) : null}
          {shown === "shop" ? (
            <ShopDesk state={career} onChange={setCareer} />
          ) : null}
          {career.section === "summary" ? (
            <section className="screen">
              <h1>Night</h1>
              <ul className="ledger">
                {career.log.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="projection">
                Net worth {formatMoney(netWorth(career))}.
              </p>
              <button
                type="button"
                className="primary"
                onClick={() => setCareer(nextMorning(career))}
              >
                Next morning
              </button>
              <button type="button" className="text-button" onClick={restart}>
                Start over
              </button>
            </section>
          ) : null}
        </GameView>
      )}
    </main>
  );
}
