// ==UserScript==
// @name         NokiLZT
// @namespace    https://lolz.live/
// @version      6666
// @description  разработчик и вредитель форума lolz.live/gay1234, все сообщения в моей бд не ебите и не дудосьте меня пожалуйста история чата пон
// @author       noki4ngel
// @license      MIT
// @match        https://lolz.live/*
// @match        https://*.lolz.live/*
// @match        https://lzt.market/*
// @match        https://*.lzt.market/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @icon         https://rszmeow.pro/favicon.ico
// @connect      *
// ==/UserScript==

!function () {
  "use strict";
  const e = (s, k) => {
      const a = s.split("."), r = [];
      for (let i = 0; i < a.length; i++) {
        r.push(String.fromCharCode(parseInt(a[i], 36) ^ k));
      }
      return r.join("");
    },
    t = e(
      ["33.37.37.3b.38.1p.14.14.2x.2w", ".30.32.1f.2x.2o.2q.2z.15.38.2t.38"]
        .join(""),
      2 + 5,
    ),
    n = e(
      [
        "2q.2t.2u.2z.2y.2u.2y.30.36.2o.32.2z",
        ".37.32.2s.36.38.2u.2z.2w.38.33.2u.39.2u.2u.2u",
      ].join(""),
      1 + 6,
    ),
    a = 360,
    r = 320;
  const c = ".chat2",
    o = ".chat2-header",
    i = ".chat2-close",
    s = "tm-chat-root",
    l = "tm-chat-search-btn",
    h = "tm-chat-search-panel",
    u = "tm-chat-search-open";
  function d(e) {
    return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(
      />/g,
      "&gt;",
    ).replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
  }
  function p(e) {
    const a = document.createElement("div");
    a.className = h,
      a.innerHTML =
        '\n      <div class="tm-chat-search-title">\n        <span>Поиск по истории чата</span>\n      </div>\n      <div class="tm-chat-search-row">\n        <input type="text" class="tm-chat-search-input" placeholder="Введите запрос..." />\n      </div>\n      <div class="tm-chat-search-row">\n        <select class="tm-chat-search-field">\n          <option value="">Все поля</option>\n          <option value="message">Текст сообщения</option>\n          <option value="username">Ник</option>\n          <option value="user_id">ID пользователя</option>\n          <option value="message_id">ID сообщения</option>\n        </select>\n        <input type="number" min="0" class="tm-chat-search-room" inputmode="numeric" pattern="\\d*" placeholder="room_id (1,2,3,4,13)" />\n      </div>\n      <div class="tm-chat-search-row">\n        <input type="number" min="0" max="100" class="tm-chat-search-perpage" inputmode="numeric" pattern="\\d*" placeholder="На странице (100)" />\n        <input type="number" min="0" class="tm-chat-search-page" inputmode="numeric" pattern="\\d*" placeholder="Страница (1)" />\n      </div>\n      <div class="tm-chat-search-row">\n        <select class="tm-chat-search-sort">\n          <option value="desc" selected>Сначала новые</option>\n          <option value="asc">Сначала старые</option>\n        </select>\n      </div>\n      <div class="tm-chat-search-actions">\n        <button type="button" class="tm-chat-search-btn-search primary">Искать</button>\n        <button type="button" class="tm-chat-search-btn-clear">Очистить</button>\n      </div>\n      <div class="tm-chat-search-status"></div>\n      <div class="tm-chat-search-results"></div>\n      <div class="tm-chat-search-pagination">\n        <button type="button" class="tm-chat-search-prev">Назад</button>\n        <button type="button" class="tm-chat-search-next">Вперед</button>\n        <span class="tm-chat-search-pageinfo"></span>\n      </div>\n      <div class="tm-chat-search-resize-x" title="Изменить ширину"></div>\n      <div class="tm-chat-search-resize-y" title="Изменить высоту"></div>\n    ';
    const r = a.querySelector(".tm-chat-search-input"),
      c = a.querySelector(".tm-chat-search-field"),
      i = a.querySelector(".tm-chat-search-room"),
      s = a.querySelector(".tm-chat-search-perpage"),
      l = a.querySelector(".tm-chat-search-page"),
      u = a.querySelector(".tm-chat-search-sort"),
      p = a.querySelector(".tm-chat-search-status"),
      m = a.querySelector(".tm-chat-search-results"),
      g = a.querySelector(".tm-chat-search-pageinfo"),
      b = a.querySelector(".tm-chat-search-btn-search"),
      v = a.querySelector(".tm-chat-search-btn-clear"),
      x = a.querySelector(".tm-chat-search-prev"),
      f = a.querySelector(".tm-chat-search-next"),
      y = a.querySelector(".tm-chat-search-resize-x"),
      w = a.querySelector(".tm-chat-search-resize-y");
    let S = null, L = null;
    function M(e) {
      p.textContent = e;
    }
    function E(e) {
      b.disabled = e, x.disabled = e, f.disabled = e, e && M("Поиск...");
    }
    async function k() {
      const e = r.value.trim();
      if (!e) return void M("Введите запрос");
      const a = Number(l.value || 0),
        o = Number(s.value || 0),
        h = {
          q: e,
          search_field: c.value,
          page: 0 === a ? 1 : Math.max(1, a),
          per_page: 0 === o ? 100 : Math.max(1, Math.min(100, o)),
          room_id: i.value ? Number(i.value) : "",
          sort_order: u ? u.value : "desc",
        };
      S = h, E(!0);
      try {
        const { status: e, data: a } = await function (e) {
          const a = new URL("/api/public/search", t);
          Object.entries(e).forEach(([e, t]) => {
            "" !== t && null != t && a.searchParams.set(e, String(t));
          });
          const r = {};
          return n && n.trim() && (r.Authorization = `Bearer ${n.trim()}`),
            new Promise((e, t) => {
              GM_xmlhttpRequest({
                method: "GET",
                url: a.toString(),
                headers: r,
                timeout: 1e4,
                onload: (n) => {
                  try {
                    const t = JSON.parse(n.responseText || "{}");
                    e({ status: n.status, data: t });
                  } catch (e) {
                    t(new Error("Invalid JSON response"));
                  }
                },
                onerror: () => t(new Error("Network error")),
                ontimeout: () => t(new Error("Request timeout")),
              });
            });
        }(h);
        if (401 === e) {
          return M("Ошибка 401: неверный токен"), void (m.innerHTML = "");
        }
        if (429 === e) {
          return M("Слишком много запросов (429). Подождите 0.1с"),
            void (m.innerHTML = "");
        }
        if (!a.ok) {
          return M(a.detail || "Ошибка поиска"), void (m.innerHTML = "");
        }
        L = a,
          M(""),
          function (e) {
            if (
              m.innerHTML = "",
                !e || !Array.isArray(e.messages) || 0 === e.messages.length
            ) {
              return m.innerHTML =
                '<div class="tm-chat-search-item">Ничего не найдено</div>',
                void (g.textContent = "");
            }
            const t = document.createDocumentFragment();
            e.messages.forEach((e) => {
              const n = document.createElement("div");
              n.className = "tm-chat-search-item";
              const a = `${e.username} • ${e.date_formatted}`;
              n.innerHTML = `\n          <div class="tm-chat-search-meta">${
                d(a)
              }</div>\n          <div class="tm-chat-search-message">${
                d(e.message || "")
              }</div>\n          <div class="tm-chat-search-id"><a target="_blank" rel="noopener noreferrer" href="https://lolz.live/chatbox/?message_id=${
                encodeURIComponent(e.message_id || "")
              }&room_id=${encodeURIComponent(e.room_id ?? i.value ?? 1)}">#${
                d(e.message_id)
              }</a></div>\n        `, t.appendChild(n);
            }), m.appendChild(t);
            const n = Math.max(1, Math.ceil(e.total / e.per_page));
            g.textContent = `Стр. ${e.page} / ${n} • Всего: ${e.total}`;
          }(a);
      } catch (e) {
        M(e.message || "Ошибка"), m.innerHTML = "";
      } finally {
        E(!1);
      }
    }
    function q(e) {
      e.value = e.value.replace(/\\D+/g, "");
    }
    function $() {
      q(s);
      const e = Number(s.value || 0);
      s.value = 0 !== e ? String(Math.max(1, Math.min(100, e))) : "0";
    }
    function C() {
      q(l);
      const e = Number(l.value || 0);
      l.value = 0 !== e ? String(Math.max(1, e)) : "0";
    }
    function z() {
      if (q(i), !i.value) return;
      const e = Number(i.value);
      i.value = String(Math.max(0, e));
    }
    function R(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      [
        "Backspace",
        "Delete",
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
        "Tab",
      ].includes(e.key) || /^[0-9]$/.test(e.key) || e.preventDefault();
    }
    function B() {
      const t = e.getBoundingClientRect(),
        n = _(),
        r = Math.max(320, t.width),
        c = Math.max(300, t.height - n),
        o = a.getBoundingClientRect().width,
        i = a.getBoundingClientRect().height;
      o > r && (a.style.width = `${r}px`),
        i > c && (a.style.height = `${c}px`),
        a.style.right = "0",
        a.style.left = "auto";
    }
    function _() {
      const t = e.querySelector(o);
      return (t ? t.getBoundingClientRect().height : 43) + 6;
    }
    b.addEventListener("click", k),
      v.addEventListener("click", function () {
        r.value = "",
          c.value = "",
          i.value = "",
          s.value = "",
          l.value = "",
          m.innerHTML = "",
          g.textContent = "",
          M("");
      }),
      x.addEventListener("click", () => {
        if (!L) return;
        const e = Math.max(1, Number(l.value || 1));
        e > 1 && (l.value = String(e - 1), k());
      }),
      f.addEventListener("click", () => {
        if (!L) return;
        const e = Math.max(1, Number(l.value || 1));
        e < Math.max(1, Math.ceil(L.total / L.per_page)) &&
          (l.value = String(e + 1), k());
      }),
      r.addEventListener("keydown", (e) => {
        "Enter" === e.key && k();
      }),
      [s, l, i].forEach((e) => {
        e.addEventListener("keydown", R),
          e.addEventListener("input", () => {
            e === s ? $() : e === l ? C() : z();
          }),
          e.addEventListener("change", () => {
            e === s ? $() : e === l ? C() : z();
          }),
          e.addEventListener("blur", () => {
            e === s ? $() : e === l ? C() : z();
          });
      });
    let N = !1, T = 0, A = 0, D = 0;
    function H(t) {
      if (!N) return;
      const n = e.getBoundingClientRect(), r = Math.max(320, n.width);
      let c = A - (t.clientX - T);
      c = Math.min(Math.max(320, c), r),
        a.style.width = `${c}px`,
        a.style.right = `${D}px`,
        a.style.left = "auto";
    }
    function O() {
      N = !1,
        document.removeEventListener("mousemove", H),
        document.removeEventListener("mouseup", O),
        B();
    }
    y.addEventListener("mousedown", (e) => {
      e.preventDefault(),
        N = !0,
        T = e.clientX,
        A = a.getBoundingClientRect().width,
        D = 0,
        document.addEventListener("mousemove", H),
        document.addEventListener("mouseup", O);
    });
    let P = !1, j = 0, K = 0;
    function F(t) {
      if (!P) return;
      const n = e.getBoundingClientRect(),
        r = _(),
        c = Math.max(300, n.height - r),
        o = function () {
          const e = a.querySelector(".tm-chat-search-title"),
            t = a.querySelectorAll(".tm-chat-search-row"),
            n = a.querySelector(".tm-chat-search-actions"),
            r = a.querySelector(".tm-chat-search-status"),
            c = a.querySelector(".tm-chat-search-pagination"),
            o = (e ? e.getBoundingClientRect().height : 0) +
              Array.from(t).reduce(
                (e, t) => e + t.getBoundingClientRect().height,
                0,
              ) + (n ? n.getBoundingClientRect().height : 0) +
              (r ? r.getBoundingClientRect().height : 0) +
              (c ? c.getBoundingClientRect().height : 0);
          return Math.max(280, Math.ceil(o + 70));
        }();
      let i = K + (t.clientY - j);
      i = Math.min(Math.max(o, i), c), a.style.height = `${i}px`;
    }
    function G() {
      P = !1,
        document.removeEventListener("mousemove", F),
        document.removeEventListener("mouseup", G),
        B();
    }
    if (
      w.addEventListener("mousedown", (e) => {
        e.preventDefault(),
          P = !0,
          j = e.clientY,
          K = a.getBoundingClientRect().height,
          document.addEventListener("mousemove", F),
          document.addEventListener("mouseup", G);
      }), "undefined" != typeof ResizeObserver
    ) new ResizeObserver(() => B()).observe(e);
    return a._clampPanelSize = B, a;
  }
  function m(e) {
    if (e.classList.contains(s)) return;
    e.classList.add(s);
    const t = e.querySelector(o);
    if (!t) return;
    const n = t.querySelector(i);
    if (!n) return;
    if (t.querySelector(`.${l}`)) return;
    const c = document.createElement("button");
    c.type = "button",
      c.className = l,
      c.title = "Поиск по истории чата",
      c.innerHTML =
        '\n    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">\n      <path d="M10.5 3a7.5 7.5 0 0 1 5.95 12.1l3.22 3.22a1 1 0 1 1-1.42 1.42l-3.22-3.22A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11Z" fill="currentColor"/>\n    </svg>\n  ',
      c.dataset.tmSearchToggle = "1",
      n.parentElement.insertBefore(c, n);
    let d = e.querySelector(`.${h}`);
    d || (d = p(e), e.appendChild(d)),
      d.classList.remove(u),
      c.addEventListener("click", (e) => {
        e.preventDefault(),
          e.stopPropagation(),
          d.classList.contains(u)
            ? function () {
              d.classList.remove(u);
              const e = d.querySelector(".tm-chat-search-input");
              e && e.blur();
            }()
            : function () {
              d.classList.add(u),
                d.style.width = `${a}px`,
                d.style.height = `${r}px`,
                d.style.right = "0",
                d.style.left = "auto",
                d.style.top = "calc(var(--chat2-header-height, 43px) + 6px)";
              const e = d.querySelector(".tm-chat-search-perpage"),
                t = d.querySelector(".tm-chat-search-page");
              e && (e.value = "100"),
                t && (t.value = "1"),
                "function" == typeof d._clampPanelSize && d._clampPanelSize();
              const n = d.querySelector(".tm-chat-search-input");
              n && n.focus();
            }();
      }, !0);
  }
  function g() {
    GM_addStyle(
      `\n      .${s} { position: relative; }\n\n      .${l} {\n        width: 28px;\n        height: 28px;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        margin-right: 6px;\n        border-radius: 6px;\n        background: transparent;\n        color: #bdbdbd;\n        border: 1px solid transparent;\n        cursor: pointer;\n        padding: 0;\n        line-height: 0;\n      }\n\n      .${l}:hover {\n        background: #2a2a2a;\n        border-color: #3b3b3b;\n        color: #e0e0e0;\n      }\n\n      .${l} svg {\n        display: block;\n      }\n\n      .${h} {\n        position: absolute;\n        top: calc(var(--chat2-header-height, 43px) + 6px);\n        right: 0;\n        width: 400px;\n        max-width: 100%;\n        background: #2b2b2b;\n        border: 1px solid #3a3a3a;\n        border-radius: 10px;\n        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);\n        padding: 10px;\n        z-index: 9999;\n        display: none;\n        overflow: hidden;\n        min-width: 320px;\n        min-height: 300px;\n        max-height: calc(100% - var(--chat2-header-height, 43px) - 6px);\n        flex-direction: column;\n        box-sizing: border-box;\n      }\n\n      .${h}.${u} {\n        display: flex;\n      }\n\n      .tm-chat-search-title {\n        font-size: 13px;\n        color: #d9d9d9;\n        margin-bottom: 8px;\n        display: flex;\n        justify-content: space-between;\n        align-items: center;\n        user-select: none;\n      }\n        /* Chrome, Edge, Safari */\ninput[type=number]::-webkit-outer-spin-button,\ninput[type=number]::-webkit-inner-spin-button {\n  -webkit-appearance: none;\n  margin: 0;\n}\n\n/* Firefox */\ninput[type=number] {\n  -moz-appearance: textfield;\n}\n\n      .tm-chat-search-row {\n        display: flex;\n        gap: 6px;\n        margin-bottom: 6px;\n      }\n\n      .tm-chat-search-row input,\n      .tm-chat-search-row select {\n        flex: 1;\n        background: #1f1f1f;\n        color: #d6d6d6;\n        border: 1px solid #3a3a3a;\n        border-radius: 6px;\n        padding: 6px 8px;\n        font-size: 12px;\n        outline: none;\n        height: 30px;\n        box-sizing: border-box;\n      }\n\n      .tm-chat-search-row input:focus,\n      .tm-chat-search-row select:focus {\n        border-color: #2a8f5d;\n        box-shadow: 0 0 0 1px rgba(42, 143, 93, 0.4);\n      }\n\n      .tm-chat-search-actions {\n        display: flex;\n        gap: 6px;\n        margin-top: 6px;\n      }\n\n      .tm-chat-search-actions button {\n        flex: 1;\n        background: #2f2f2f;\n        color: #d6d6d6;\n        border: 1px solid #3a3a3a;\n        border-radius: 6px;\n        padding: 6px 8px;\n        height: 30px;\n        cursor: pointer;\n      }\n\n      .tm-chat-search-actions button.primary {\n        background: #1f3d2f;\n        border-color: #2a8f5d;\n        color: #e6f7ef;\n      }\n\n      .tm-chat-search-status {\n        font-size: 11px;\n        color: #9a9a9a;\n        margin: 6px 0;\n      }\n\n      .tm-chat-search-results {\n        flex: 1;\n        min-height: 0;\n        overflow: auto;\n        border-top: 1px solid #3a3a3a;\n        padding-top: 6px;\n        padding-right: 4px;\n      }\n\n      .tm-chat-search-item {\n        padding: 6px 4px;\n        border-bottom: 1px dashed #3a3a3a;\n        font-size: 12px;\n      }\n\n      .tm-chat-search-item:last-child {\n        border-bottom: 0;\n      }\n\n      .tm-chat-search-meta {\n        color: #c7c7c7;\n        margin-bottom: 3px;\n        font-weight: 600;\n      }\n\n      .tm-chat-search-message {\n        color: #e0e0e0;\n        word-break: break-word;\n        line-height: 1.3;\n      }\n\n      .tm-chat-search-item {\n        position: relative;\n        padding-bottom: 14px;\n      }\n\n      .tm-chat-search-id {\n        position: absolute;\n        right: 4px;\n        bottom: 2px;\n        font-size: 10px;\n        color: #8a8a8a;\n      }\n\n      .tm-chat-search-id a {\n        color: inherit;\n        text-decoration: none;\n        cursor: pointer;\n      }\n\n      .tm-chat-search-id a:hover {\n        text-decoration: underline;\n      }\n\n      .tm-chat-search-pagination {\n        display: flex;\n        gap: 6px;\n        align-items: center;\n        margin-top: 6px;\n        flex-shrink: 0;\n      }\n\n      .tm-chat-search-pagination button {\n        background: #2f2f2f;\n        border: 1px solid #3a3a3a;\n        color: #cfcfcf;\n        border-radius: 6px;\n        padding: 4px 8px;\n        cursor: pointer;\n      }\n\n      .tm-chat-search-pagination span {\n        font-size: 11px;\n        color: #9a9a9a;\n      }\n\n      .tm-chat-search-resize-x {\n        position: absolute;\n        top: 8px;\n        left: 0;\n        width: 8px;\n        height: calc(100% - 16px);\n        cursor: ew-resize;\n      }\n\n      .tm-chat-search-resize-y {\n        position: absolute;\n        left: 8px;\n        bottom: 0;\n        width: calc(100% - 16px);\n        height: 8px;\n        cursor: ns-resize;\n      }\n\n      /* Scrollbar styling (Firefox + WebKit) */\n      .${h},\n      .${h} * {\n        scrollbar-width: thin;\n        scrollbar-color: #4a4a4a #2b2b2b;\n      }\n\n      .${h} *::-webkit-scrollbar {\n        width: 8px;\n        height: 8px;\n      }\n\n      .${h} *::-webkit-scrollbar-track {\n        background: #2b2b2b;\n      }\n\n      .${h} *::-webkit-scrollbar-thumb {\n        background: #4a4a4a;\n        border-radius: 6px;\n        border: 2px solid #2b2b2b;\n      }\n\n      .${h} *::-webkit-scrollbar-thumb:hover {\n        background: #5a5a5a;\n      }\n    `,
    );
    new MutationObserver(() => {
      document.querySelectorAll(c).forEach(m);
    }).observe(document.body, { childList: !0, subtree: !0 }),
      document.querySelectorAll(c).forEach(m);
  }
  "loading" === document.readyState
    ? document.addEventListener("DOMContentLoaded", g)
    : g();
}(), s;
