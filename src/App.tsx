import { Capacitor } from "@capacitor/core";
import { useEffect, useState } from "react";
import {
  acceptOffer,
  careerStatus,
  chooseGoal,
  createCareer,
  applyToPost,
  declinePost,
  endDay,
  failInterview,
  finishPlacement,
  finishWork,
  joinCompany,
  netWorth,
  nextMorning,
  resolveEvent,
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
import { videoFor } from "./content/sceneVideo";
import { OfferCard } from "./ui/kit";
import {
  InvestDesk,
  MarketScreen,
  StocksScreen,
  BlackjackScreen,
  ShopDesk,
} from "./ui/PersonalDesk";
import { Placement } from "./ui/Placement";
import { IntroSteps, TitleScreen } from "./ui/Intro";
import { GameView, type NavTab, type ScenePanel } from "./ui/GameView";
import { MeScreen } from "./ui/MeScreen";
import { TopHud } from "./ui/TopHud";
import { useMusic } from "./ui/music";
import { t, useLang } from "./i18n";
import { Sandbox } from "./ui/Sandbox";
import { useSceneLayout } from "./ui/useSceneLayout";
import {
  EndingScreen,
  EventCard,
  FreeTime,
  GoalPicker,
  LifeCard,
} from "./ui/Life";
import { ageOn, weekOfYear } from "./game/life";
import { InterviewSession, WorklineFeed } from "./ui/Workline";
import { WorkSession } from "./ui/WorkSession";

type Mode = "play" | "sandbox";

/** Which bottom tab lights up for the open panel. */
function tabFor(panel: ScenePanel): NavTab {
  if (
    panel === "invest" ||
    panel === "market" ||
    panel === "stocks" ||
    panel === "blackjack"
  )
    return "invest";
  if (panel === "workline") return "jobs";
  if (panel === "shop") return "shop";
  if (panel === "me") return "me";
  return "home";
}

/** Tapping the tab you're already on takes you back to the room. */
function panelFor(tab: NavTab, current: ScenePanel): ScenePanel {
  if (tab === "home" || tabFor(current) === tab) return null;
  if (tab === "jobs") return "workline";
  return tab;
}

/** Play and Sandbox tabs are only for the web dev server, never in the app build. */
const devTools = import.meta.env.DEV && !Capacitor.isNativePlatform();

export function App() {
  const [music, setMusic] = useMusic();
  useLang();
  const [career, setCareer] = useState<CareerState>(
    () => loadGame() ?? createCareer(),
  );
  const [panel, setPanel] = useState<ScenePanel>(null);
  const [market, setMarket] = useState<MarketId>("ATLS");
  const [interview, setInterview] = useState<JobPost | null>(null);
  const [mode, setMode] = useState<Mode>("play");
  /** A new life opens on the title screen until the player taps Start. */
  const [started, setStarted] = useState(false);
  const scene = useSceneLayout();

  useEffect(() => {
    saveGame(career);
  }, [career]);

  useEffect(() => {
    if (career.section !== "room") setPanel(null);
  }, [career.section]);

  function restart() {
    clearGame();
    setStarted(false);
    setCareer(createCareer());
    setPanel(null);
  }

  const forced =
    career.section === "placement" ||
    career.section === "goal" ||
    career.section === "offers" ||
    career.section === "summary" ||
    career.section === "ending";
  const shown = forced ? "screen" : panel;
  const glassLabel =
    career.company === null
      ? t("Job hunt")
      : career.offWeek === "sick"
        ? t("Sick week")
        : career.offWeek === "burnout"
          ? t("Burnout week")
          : t("Free time");

  return (
    <main className="phone">
      {devTools ? (
        <nav className="mode-tabs">
          <button
            type="button"
            className={mode === "play" ? "on" : ""}
            onClick={() => setMode("play")}
          >
            {t("Play")}
          </button>
          <button
            type="button"
            className={mode === "sandbox" ? "on" : ""}
            onClick={() => setMode("sandbox")}
          >
            {t("Sandbox")}
          </button>
        </nav>
      ) : null}
      {career.section === "placement" && !started && !(devTools && mode === "sandbox") ? (
        <TitleScreen onStart={() => setStarted(true)} />
      ) : devTools && mode === "sandbox" ? (
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
          locked={forced}
          panel={panel}
          workDone={career.workDone}
          boxes={scene.boxes}
          video={videoFor(career.company)}
          hud={<TopHud state={career} onOpen={() => setPanel("me")} />}
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
          onWork={() => setPanel("work")}
          onEndDay={() => setPanel("free")}
          glassLabel={glassLabel}
          nav={{
            active: tabFor(panel),
            jobCount: career.feed.posts.length,
            onTab: (tab) => setPanel(panelFor(tab, panel)),
          }}
          overlay={
            career.section === "room" && career.event ? (
              <EventCard
                event={career.event}
                money={career.stats.money}
                onChoose={(choice) => {
                  setPanel(null);
                  setCareer(resolveEvent(career, choice));
                }}
              />
            ) : undefined
          }
          onBack={
            panel === "market" && isStock(market)
              ? () => setPanel("stocks")
              : panel === "market" ||
                  panel === "stocks" ||
                  panel === "blackjack"
                ? () => setPanel("invest")
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
          {career.section === "goal" ? (
            <GoalPicker
              onPick={(goal) => setCareer(chooseGoal(career, goal))}
            />
          ) : null}
          {career.section === "offers" ? (
            <section className="screen">
              <IntroSteps step={3} />
              <h1>{t("Offers")}</h1>
              <p className="ask">{career.placementBlurb}</p>
              <div className="offer-list">
                {career.offers.map((company) => (
                  <OfferCard
                    key={company.id}
                    company={company}
                    note={t(company.summary)}
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
              onApply={(post) => setCareer(applyToPost(career, post.id))}
              onInterview={(post) => {
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
          {shown === "me" ? (
            <MeScreen
              stats={career.stats}
              career={career.company ? careerStatus(career) : undefined}
              lifeCard={career.goal ? <LifeCard state={career} /> : undefined}
              onSwitchTrack={
                career.company
                  ? () => setCareer(switchTrack(career))
                  : undefined
              }
              onRestart={restart}
              music={music}
              onMusic={setMusic}
            />
          ) : null}
          {shown === "shop" ? (
            <ShopDesk state={career} onChange={setCareer} />
          ) : null}
          {shown === "free" ? (
            <FreeTime
              state={career}
              onChange={setCareer}
              onWorkline={() => setPanel("workline")}
              onEndWeek={() => {
                setPanel(null);
                setCareer(endDay(career));
              }}
            />
          ) : null}
          {career.section === "ending" ? (
            <EndingScreen state={career} onRestart={restart} />
          ) : null}
          {career.section === "summary" ? (
            <section className="screen">
              <p className="kicker">
                {t("Age {age} · Week {week}", {
                  age: ageOn(career.day - 1),
                  week: weekOfYear(career.day - 1),
                })}
              </p>
              <h1>{t("The week is done")}</h1>
              <ul className="ledger">
                {career.log.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <p className="projection">
                {t("Net worth {amount}.", {
                  amount: formatMoney(netWorth(career)),
                })}
              </p>
              <button
                type="button"
                className="primary"
                onClick={() => setCareer(nextMorning(career))}
              >
                {t("Next week")}
              </button>
            </section>
          ) : null}
        </GameView>
      )}
    </main>
  );
}
