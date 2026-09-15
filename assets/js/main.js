/* Shared behaviour for every variant's index.html.
   Vanilla JS, no dependencies, ~2KB uncompressed — kept deliberately small
   since the page is often opened inside the Instagram/Facebook in-app
   browser, where a slow WebView makes every extra script cost more.
   Each function below is a self-contained "component": it does nothing
   until it finds its markup on the page, so any variant can include or
   drop a section without touching this file. */
(() => {
  "use strict";

  /* ---- team rail: prev/next + click-to-advance ----
     Desktop shows most of the row at once (small peek), so the arrows
     jump straight to either end — only two states, nothing to get out of
     sync. Mobile shows far fewer cards at a time, so jumping to the end
     would skip most of the team; there the same arrows (and clicking the
     cropped edge card) instead step exactly one card at a time. */
  function initTeamRail(root) {
    const rail = root.querySelector("[data-rail]");
    if (!rail) return;
    const prev = root.querySelector("[data-rail-prev]");
    const next = root.querySelector("[data-rail-next]");
    const isDesktop = window.matchMedia("(min-width: 721px)");

    const cardStep = () => {
      const card = rail.querySelector(".team-card");
      const gap = parseFloat(getComputedStyle(rail).columnGap) || 16;
      return (card ? card.getBoundingClientRect().width : 240) + gap;
    };
    const goToStart = () => rail.scrollTo({ left: 0, behavior: "smooth" });
    const goToEnd = () => rail.scrollTo({ left: rail.scrollWidth - rail.clientWidth, behavior: "smooth" });
    const stepBy = (dir) => {
      const max = rail.scrollWidth - rail.clientWidth;
      const target = Math.max(0, Math.min(max, rail.scrollLeft + dir * cardStep()));
      rail.scrollTo({ left: target, behavior: "smooth" });
    };

    const goPrev = () => (isDesktop.matches ? goToStart() : stepBy(-1));
    const goNext = () => (isDesktop.matches ? goToEnd() : stepBy(1));

    prev && prev.addEventListener("click", goPrev);
    next && next.addEventListener("click", goNext);

    rail.addEventListener("click", (e) => {
      const card = e.target.closest(".team-card");
      if (!card) return;
      const cardRect = card.getBoundingClientRect();
      const railRect = rail.getBoundingClientRect();
      if (cardRect.left < railRect.left - 1) goPrev();
      else if (cardRect.right > railRect.right + 1) goNext();
    });
  }

  /* ---- sticky mobile CTA: reveal once the hero has scrolled past ----
     A plain scroll listener (rAF-throttled) instead of IntersectionObserver:
     more predictable across the range of WebViews this page gets opened in
     (Instagram/Facebook in-app browsers included), which don't all agree
     on IO timing once the page has fully loaded and later reflows (lazy
     images, fonts) shift the sentinel. */
  function initStickyCta(root) {
    const bar = root.querySelector("[data-sticky-cta]");
    const sentinel = root.querySelector("[data-sticky-sentinel]");
    if (!bar || !sentinel) return;

    const mq = window.matchMedia("(max-width: 1024px)");
    let ticking = false;

    const update = () => {
      ticking = false;
      const pastSentinel = sentinel.getBoundingClientRect().bottom < 0;
      bar.classList.toggle("is-visible", mq.matches && pastSentinel);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    mq.addEventListener("change", update);
    update();
  }

  /* ---- cookie notice: closing it is permanent, scrolling isn't ----
     ✕ / "Compris" are an actual answer — remembered in localStorage so it
     never comes back. Scrolling just gets it out of the way for this page
     view (no write to storage): on mobile, a single swipe on arrival can
     cross the scroll threshold before anyone's consciously seen the
     banner, and treating that as a permanent dismissal made it look like
     the notice "didn't work" on the next visit — it had just silently
     dismissed itself. */
  function initCookieNotice(root) {
    const box = root.querySelector("[data-cookie-notice]");
    if (!box) return;
    const STORAGE_KEY = "ascencio-cookie-notice-dismissed";

    let dismissed = false;
    try { dismissed = localStorage.getItem(STORAGE_KEY) === "1"; } catch (e) {}
    if (dismissed) return;

    box.hidden = false;
    requestAnimationFrame(() => box.classList.add("is-visible"));

    const hide = () => {
      box.classList.remove("is-visible");
      window.removeEventListener("scroll", onScroll);
      setTimeout(() => { box.hidden = true; }, 280);
    };
    const dismissForGood = () => {
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch (e) {}
      hide();
    };
    const onScroll = () => { if (window.scrollY > 80) hide(); };

    const closeBtn = root.querySelector("[data-cookie-close]");
    const acceptBtn = root.querySelector("[data-cookie-accept]");
    closeBtn && closeBtn.addEventListener("click", dismissForGood);
    acceptBtn && acceptBtn.addEventListener("click", dismissForGood);
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-component='team']").forEach(initTeamRail);
    initStickyCta(document);
    initCookieNotice(document);
  });
})();
