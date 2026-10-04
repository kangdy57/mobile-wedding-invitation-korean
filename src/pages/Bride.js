import React, { useCallback, useState } from "react";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";

import "../App.css";
import Reveal from "../components/Reveal";
import Countdown from "../components/Countdown";
import Lightbox from "../components/Lightbox";
import AccountModal from "../components/AccountModal";
import brideAccountData from "../assets/bride_account_number_data.json";
import pinIcon from "../assets/location-pin.png";
import hero800 from "../assets/hero/hero-800.jpg";
import hero1200 from "../assets/hero/hero-1200.jpg";
import hero1800 from "../assets/hero/hero-1800.jpg";

/* ---------------------------------------------------------------- details */

const CEREMONY = new Date("2026-10-24T15:00:00+09:00");

const VENUE = {
  name: "세종대왕기념관",
  english: "Sejong Memorial Hall",
  address: "서울 동대문구 회기로 56",
  tel: "02-960-1700",
  lat: 37.5909615011864,
  lng: 127.04363162642107,
};

const LINKS = {
  naverMaps: `https://map.naver.com/p/search/${encodeURIComponent(VENUE.name)}`,
  kakaoMaps: `https://map.kakao.com/link/search/${encodeURIComponent(VENUE.name)}`,
  calendar:
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent("강다연 ♥ 프라노이 물미 전통혼례식") +
    "&dates=20261024T060000Z/20261024T090000Z" +
    "&location=" +
    encodeURIComponent(`${VENUE.name}, ${VENUE.address}`) +
    "&details=" +
    encodeURIComponent("저희의 출발을 알리는 전통혼례식에 함께 해 주세요."),
};

/* ---------------------------------------------------------------- gallery */

// where the layout switches from the single-column phone sheet to the
// two-column desktop one — kept in sync with the @media block in App.css
const DESKTOP = 900;

const CDN = "https://5hiexw8se9.ucarecd.net/";

// Uploadcare ids, in the order they should appear in the gallery.
const PHOTOS = [
  "86d81d21-9992-4ca0-acdf-e70a6091babb",
  "3e8a1691-8cca-4cb4-8636-0b826f27444c",
  "029806d5-acd0-41ef-86c0-a3910d5f245a",
  "63993ddf-3b95-4dd5-b111-5a9a91b718f6",
  "3e9f7e65-da93-41e6-a504-3265fdc65047",
  "59d31548-b1fa-420c-b895-d2187e5a6037",
  "b4d499f5-938a-4837-9024-4adf1022d009",
  "e96d2dbc-b9f9-4542-a276-4530a8740142",
  "68625584-770c-4b66-84dd-1158e6cf1b7a",
  "3aff7748-5a4a-45ec-9400-c19c02e0da4e",
  "38c241e5-8ece-471d-a903-2ed652603b1b",
  "6cf895ec-ad76-466f-a662-7466ed754569",
];

// The originals are ~4000x5500. Never ship those to a phone — let the CDN
// crop and re-encode to the size of the tile it lands in. `smart` crops
// around the faces, which a centre crop of a tall portrait loses.
const thumbUrl = (i, w, ratio = 1.333) =>
  `${CDN}${PHOTOS[i]}/-/scale_crop/${w}x${Math.round(w * ratio)}/smart/` +
  `-/quality/smart/-/format/auto/`;

const fullUrl = (i) =>
  `${CDN}${PHOTOS[i]}/-/preview/1400x1400/-/quality/smart/-/format/auto/`;

/* --------------------------------------------------------------- calendar */

const MONTH_LABEL = "2026년 10월";
const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];
const FIRST_WEEKDAY = new Date(Date.UTC(2026, 9, 1)).getUTCDay(); // 목요일
const DAYS_IN_MONTH = 31;
const WEDDING_DAY = 24;

const calendarCells = [
  ...Array.from({ length: FIRST_WEEKDAY }, () => null),
  ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
];

/* ------------------------------------------------------------------ icons */

const Icon = ({ path, filled = false }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      d={path}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PATHS = {
  map: "M9 3L3 5.5v15L9 18l6 3 6-2.5v-15L15 6 9 3zm0 0v15m6-12v15",
  copy: "M9 9h10v12H9V9zM5 15H4V3h12v1",
  check: "M4 12.5l5 5L20 6.5",
  heart:
    "M12 20.3l-1.4-1.3C5.9 14.9 3 12.3 3 9a4.5 4.5 0 018.1-2.7l.9 1.2.9-1.2A4.5 4.5 0 0121 9c0 3.3-2.9 5.9-7.6 10l-1.4 1.3z",
  car:
    "M3.4 15.6v-2.9c0-.3 0-.5.2-.8l1.9-3.5A2 2 0 017.2 7.3h9.6a2 2 0 011.7 1.1l1.9 3.5c.2.3.2.5.2.8v2.9H3.4z" +
    "M3.4 15.6v1.9h3v-1.9m11.2 0v1.9h3v-1.9M5.3 12.4h13.4",
  phone:
    "M21 16.9v2.5a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 011.1 3.7 2 2 0 013.1 1.5h2.5a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L6.7 9.3a16 16 0 006 6l1.2-1.1a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z",
};

/* ------------------------------------------------------------------- page */

function Bride() {
  const navermaps = useNavermaps();

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [accountsOpen, setAccountsOpen] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(null);
  const [copied, setCopied] = useState(false);

  const copyAddress = useCallback(async () => {
    const text = `${VENUE.address} ${VENUE.name}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  }, []);

  const copyAccount = useCallback((accountNumber) => {
    setCopiedAccount(accountNumber);
    setTimeout(() => setCopiedAccount(null), 3000);
  }, []);

  return (
    <div className="page">
      {/* ------------------------------------------------------------ hero */}
      <header className="hero">
        <img
          className="hero-img"
          src={hero1200}
          srcSet={`${hero800} 800w, ${hero1200} 1200w, ${hero1800} 1800w`}
          sizes="100vw"
          alt="함부르크 시청 앞에서 손을 맞잡은 다연과 프라노이"
          fetchpriority="high"
        />
        <div className="hero-scrim" />

        <div className="hero-top">
          <p className="eyebrow eyebrow--light">저희 결혼합니다</p>
          <h1 className="hero-names">
            강다연
            <span className="hero-amp">&amp;</span>
            프라노이 물미
          </h1>
        </div>

        <div className="hero-bottom">
          <p className="hero-meta">
            2026 · 10 · 24<span className="dot">·</span>서울
          </p>
          <span className="scroll-cue" aria-hidden="true" />
        </div>
      </header>

      <main className="sheet">
        {/* -------------------------------------------------------- when */}
        <section className="section section--sand">
          <Reveal>
            <p className="eyebrow">Save the date</p>

            {/* grid areas so this stacks on a phone and goes side-by-side
                on a wide screen without reordering the DOM */}
            <div className="date-grid">
              <div className="date-head">
                <p className="when-line">2026년 10월 24일 토요일</p>
                <p className="when-time">오후 3시</p>
              </div>

              <div className="calendar" role="img" aria-label="2026년 10월 24일">
                <p className="calendar-month">{MONTH_LABEL}</p>
                <div className="calendar-grid">
                  {DAY_NAMES.map((d, i) => (
                    <span
                      className={`calendar-dow ${
                        i === 0
                          ? "calendar-dow--sun"
                          : i === 6
                          ? "calendar-dow--sat"
                          : ""
                      }`}
                      key={d}
                    >
                      {d}
                    </span>
                  ))}
                  {calendarCells.map((day, i) => (
                    <span
                      key={i}
                      className={`calendar-day ${
                        day === WEDDING_DAY ? "is-wedding" : ""
                      }`}
                    >
                      {day || ""}
                    </span>
                  ))}
                </div>
              </div>

              <div className="date-tail">
                <Countdown target={CEREMONY} />
                <a
                  className="btn btn--ghost"
                  href={LINKS.calendar}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  캘린더에 추가
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* -------------------------------------------------- invitation */}
        <section className="section">
          <Reveal>
            <p className="eyebrow">Invitation</p>
            <span className="ornament" aria-hidden="true" />

            <div className="story">
              <p>
                <strong>한국</strong>에서 태어난 <strong>다연</strong>과
                <br />
                <strong>네팔</strong>에서 태어난 <strong>프라노이</strong>가
                <br />
                <strong>독일, 함부르크</strong>에서 운명처럼 만나
                <br />
                한 가정을 이루게 되었습니다.
              </p>
              <p className="story-call">
                저희의 출발을 알리는 <strong>전통혼례식</strong>에
                <br />
                함께 해 주시면 감사하겠습니다.
              </p>
            </div>

            <div className="parents">
              <p>
                <span>강정배・진효정(숙희)</span>
                <em>의 딸</em> <strong>강다연</strong>
              </p>
              <p>
                <span>람 물미・저너히타 물미</span>
                <em>의 아들</em> <strong>프라노이 물미</strong>
              </p>
            </div>
          </Reveal>
        </section>

        {/* ----------------------------------------------------- gallery */}
        <section className="section section--flush">
          <Reveal>
            <p className="eyebrow">Gallery</p>
            <span className="ornament" aria-hidden="true" />
          </Reveal>

          <div className="gallery">
            {PHOTOS.map((id, i) => {
              // two full-width photos break up the grid; placed so no row
              // is ever left half-empty
              const wide = i === 0 || i === 7;
              return (
                <Reveal
                  key={id}
                  className={`gallery-cell ${wide ? "gallery-cell--wide" : ""}`}
                  delay={(i % 2) * 70}
                >
                  <button
                    className="gallery-btn"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`${i + 1}번째 사진 보기`}
                  >
                    <picture>
                      {/* the wide tiles are square only on narrow screens;
                          desktop lays every tile out 3:4, so ask the CDN for
                          that crop rather than letting CSS squash the square */}
                      {wide && (
                        <source
                          media={`(min-width: ${DESKTOP}px)`}
                          srcSet={`${thumbUrl(i, 480)} 480w, ${thumbUrl(i, 760)} 760w`}
                          sizes="360px"
                        />
                      )}
                      <img
                        src={wide ? thumbUrl(i, 900, 1) : thumbUrl(i, 480)}
                        srcSet={
                          wide
                            ? `${thumbUrl(i, 560, 1)} 560w, ${thumbUrl(i, 900, 1)} 900w, ${thumbUrl(i, 1200, 1)} 1200w`
                            : `${thumbUrl(i, 320)} 320w, ${thumbUrl(i, 480)} 480w, ${thumbUrl(i, 760)} 760w`
                        }
                        sizes={
                          wide
                            ? "(max-width: 440px) 100vw, 440px"
                            : "(max-width: 440px) 50vw, 360px"
                        }
                        alt={`강다연 프라노이 물미, ${i + 1} / ${PHOTOS.length}`}
                        loading={i < 2 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </picture>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------- location */}
        <section className="section section--flush">
          <Reveal>
            <p className="eyebrow">Location</p>
            <span className="ornament" aria-hidden="true" />
          </Reveal>

          <div className="location-grid">
            <div className="map-frame">
              <MapDiv style={{ width: "100%", height: "100%" }}>
                <NaverMap
                  defaultCenter={new navermaps.LatLng(VENUE.lat, VENUE.lng)}
                  defaultZoom={16}
                >
                  <Marker
                    position={new navermaps.LatLng(VENUE.lat, VENUE.lng)}
                    icon={{ url: pinIcon, size: new navermaps.Size(64, 64) }}
                  />
                </NaverMap>
              </MapDiv>
            </div>

            <div className="section-inner">
              <Reveal className="venue">
                <h2 className="venue-name">{VENUE.name}</h2>
                <p className="venue-korean">{VENUE.english}</p>
                <p className="venue-address">{VENUE.address}</p>
                <a
                  className="venue-tel"
                  href={`tel:${VENUE.tel.replace(/-/g, "")}`}
                >
                  <Icon path={PATHS.phone} /> {VENUE.tel}
                </a>

                <div className="venue-actions">
                  <a
                    className="chip"
                    href={LINKS.naverMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon path={PATHS.map} /> 네이버 지도
                  </a>
                  <a
                    className="chip"
                    href={LINKS.kakaoMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon path={PATHS.map} /> 카카오맵
                  </a>
                  <button className="chip" onClick={copyAddress}>
                    <Icon path={copied ? PATHS.check : PATHS.copy} />
                    {copied ? "복사되었습니다" : "주소 복사"}
                  </button>
                </div>
              </Reveal>

              <Reveal className="transit">
                <h3 className="transit-title">오시는 길</h3>

                <div className="transit-row">
                  <span className="transit-badge transit-badge--line6">6</span>
                  <div>
                    <strong>지하철</strong>
                    <p>
                      6호선 고려대역 3번 출구
                      <br />
                      도보 10분 · 15분 간격 셔틀버스 운영
                    </p>
                  </div>
                </div>

                <div className="transit-row">
                  <span className="transit-badge transit-badge--bus">Bus</span>
                  <div>
                    <strong>버스</strong>
                    <p>
                      지선버스 1226 · 간선버스 201, 273
                      <br />
                      세종대왕기념관 정류장 하차
                    </p>
                  </div>
                </div>

                <div className="transit-row">
                  <span className="transit-badge transit-badge--car">
                    <Icon path={PATHS.car} />
                  </span>
                  <div>
                    <strong>자가용</strong>
                    <p>
                      네비게이션에 “세종대왕기념관”을 입력하세요.
                      <br />
                      주차 무료
                    </p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ notice */}
        <section className="section section--sand">
          <Reveal>
            <p className="eyebrow eyebrow--ko">안내 드립니다</p>
            <span className="ornament" aria-hidden="true" />

            <div className="notice">
              <p>본 예식에는 외국인 하객분들도 다수 참석할 예정입니다.</p>
              <p>
                한국의 아름다움을 직접 느끼고자 많은 분들께서{" "}
                <strong>한복</strong>을 입고 참석하실 예정이오니, 평소 소장하고
                계시던 한복이 있으시다면 부담없이 착용해 주셔도 좋겠습니다.
              </p>
              <p>
                물론 한복이 아니어도 전혀 무방하오니, 편안한 마음으로 참석해
                주시면 감사하겠습니다.
              </p>
            </div>
          </Reveal>
        </section>

        {/* ------------------------------------------------------- video */}
        <section className="section">
          <Reveal>
            <p className="eyebrow eyebrow--ko">전통혼례</p>
            <p className="video-caption">
              전통혼례의 분위기를 미리 느껴보실 수 있도록
              <br />
              예시 영상을 준비했습니다.
            </p>
            <div className="video-frame">
              <iframe
                title="전통혼례 예시 영상"
                src="https://www.youtube-nocookie.com/embed/oFP1a4Ra2Qs"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Reveal>
        </section>

        {/* -------------------------------------------------------- gift */}
        <section className="section section--sand">
          <Reveal>
            <p className="eyebrow eyebrow--ko">마음 전하실 곳</p>
            <span className="ornament" aria-hidden="true" />

            <p className="gift-intro">
              참석이 어려우신 분들을 위해 계좌번호를 함께 안내드립니다.
              <br />
              전해주시는 마음, 감사히 간직하겠습니다.
            </p>

            <button
              className="btn btn--solid"
              onClick={() => setAccountsOpen(true)}
            >
              <Icon path={PATHS.heart} filled /> 신부 측 계좌번호
            </button>
          </Reveal>
        </section>

        {/* ------------------------------------------------------ footer */}
        <footer className="footer">
          <span className="ornament ornament--light" aria-hidden="true" />
          <p>
            저희의 새로운 시작을
            <br />
            함께 축복해 주시면 더없이 기쁘겠습니다.
          </p>
          <p className="footer-sign">다연 &amp; 프라노이</p>
          <p className="footer-credit">
            컴퓨터공학을 전공하고 개발자로 일하는
            <br />
            신랑·신부가 직접 만든 청첩장입니다
            <br />© 2025 Prannoy &amp; Dayeon
          </p>
        </footer>
      </main>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          count={PHOTOS.length}
          srcFor={fullUrl}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      {accountsOpen && (
        <AccountModal
          accounts={brideAccountData.data}
          copied={copiedAccount}
          onCopy={copyAccount}
          onClose={() => {
            setAccountsOpen(false);
            setCopiedAccount(null);
          }}
        />
      )}
    </div>
  );
}

export default Bride;
