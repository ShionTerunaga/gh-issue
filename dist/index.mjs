#!/usr/bin/env node
import { Command as e } from "commander";
import { copyFile as t, mkdir as n, readFile as r, unlink as i, writeFile as a } from "node:fs/promises";
import { existsSync as o, readFileSync as s, readdirSync as c, rmSync as l } from "node:fs";
import { basename as u, dirname as d, join as f, resolve as p } from "node:path";
import { fileURLToPath as m } from "node:url";
import h from "fast-glob";
import { stripVTControlCharacters as g, styleText as _ } from "node:util";
import v, { stdin as y, stdout as b } from "node:process";
import * as x from "node:readline";
import S from "node:readline";
import { ReadStream as ee } from "node:tty";
import { execFileSync as te, spawnSync as ne } from "node:child_process";
import { dirname as re, join as C } from "path";
import { randomInt as ie, randomUUID as ae } from "node:crypto";
import { tmpdir as oe } from "node:os";
import { resultUtility as se } from "ts-shared";
import { fileURLToPath as ce } from "url";
//#region \0rolldown/runtime.js
var le = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), ue = {
	OPTION_SOME: "some",
	OPTION_NONE: "none"
}, de = (function() {
	let { OPTION_SOME: e, OPTION_NONE: t } = ue, n = (t) => Object.freeze({
		kind: e,
		isSome: !0,
		isNone: !1,
		value: t
	}), r = () => Object.freeze({
		kind: t,
		isSome: !1,
		isNone: !0
	});
	return Object.freeze({
		createSome: n,
		createNone: r,
		optionConversion: (e) => e == null ? r() : n(e)
	});
})(), fe = {
	RESULT_OK: "ok",
	RESULT_NG: "ng"
}, pe = Symbol("UNIT_SYMBOL"), w = (function() {
	let { RESULT_NG: e, RESULT_OK: t } = fe, n = Object.freeze({ _unit: pe }), r = async ({ fn: e, err: t, finalFn: n = () => {} }) => {
		try {
			return s(await e());
		} catch (e) {
			return t(e);
		} finally {
			n();
		}
	}, i = async ({ fn: e, err: t, finalFn: r = () => {} }) => {
		try {
			return await e(), s(n);
		} catch (e) {
			return t(e);
		} finally {
			r();
		}
	}, a = ({ fn: e, err: t, finalFn: n = () => {} }) => {
		try {
			return s(e());
		} catch (e) {
			return t(e);
		} finally {
			n();
		}
	}, o = ({ fn: e, err: t, finalFn: r = () => {} }) => {
		try {
			return e(), s(n);
		} catch (e) {
			return t(e);
		} finally {
			r();
		}
	}, s = (e) => Object.freeze({
		kind: t,
		isOk: !0,
		isErr: !1,
		value: e
	});
	return Object.freeze({
		UNIT: n,
		checkResultReturn: a,
		checkResultVoid: o,
		checkPromiseReturn: r,
		checkPromiseVoid: i,
		createOk: s,
		createNg: (t) => Object.freeze({
			kind: e,
			isOk: !1,
			isErr: !0,
			err: t
		})
	});
})(), me = (e) => e, he = h.async;
async function ge(e, r, { cwd: i, rename: a = me, parents: o = !0 }) {
	let { createNg: s, createOk: c, checkPromiseReturn: l } = w, m = typeof e == "string" ? [e] : e;
	if (m.length === 0 || r === "") return s(/* @__PURE__ */ Error("src or dest is empty"));
	let h = await l({
		fn: () => he(m, {
			cwd: i,
			dot: !0,
			absolute: !1,
			stats: !1,
			onlyFiles: !0
		}),
		err: () => s(/* @__PURE__ */ Error("Failed to glob source files"))
	});
	if (h.isErr) return h;
	let g = i ? p(i, r) : r;
	for (let e of h.value) {
		let r = d(e), s = a(u(e)), c = i ? p(i, e) : e, l = o ? f(g, r, s) : f(g, s);
		await n(d(l), { recursive: !0 }), await t(c, l);
	}
	return c(() => {});
}
//#endregion
//#region src/shared/error.ts
function _e(e, t) {
	return t instanceof Error ? /* @__PURE__ */ Error(`${e}: ${t.message}`) : /* @__PURE__ */ Error(`${e}: ${String(t)}`);
}
//#endregion
//#region node_modules/.pnpm/fast-string-truncated-width@3.0.3/node_modules/fast-string-truncated-width/dist/utils.js
var ve = (() => {
	let e = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	return (t) => {
		let n = 0;
		for (e.lastIndex = 0; e.test(t);) n += 1;
		return t.length - n;
	};
})(), ye = (e) => e === 12288 || e >= 65281 && e <= 65376 || e >= 65504 && e <= 65510, be = (e) => e === 8987 || e === 9001 || e >= 12272 && e <= 12287 || e >= 12289 && e <= 12350 || e >= 12441 && e <= 12543 || e >= 12549 && e <= 12591 || e >= 12593 && e <= 12686 || e >= 12688 && e <= 12771 || e >= 12783 && e <= 12830 || e >= 12832 && e <= 12871 || e >= 12880 && e <= 19903 || e >= 65040 && e <= 65049 || e >= 65072 && e <= 65106 || e >= 65108 && e <= 65126 || e >= 65128 && e <= 65131 || e >= 127488 && e <= 127490 || e >= 127504 && e <= 127547 || e >= 127552 && e <= 127560 || e >= 131072 && e <= 196605 || e >= 196608 && e <= 262141, xe = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|\u001b\]8;[^;]*;.*?(?:\u0007|\u001b\u005c)/y, Se = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y, Ce = /(?:(?![\uFF61-\uFF9F\uFF00-\uFFEF])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Tangut}]){1,1000}/uy, we = /\t{1,1000}/y, Te = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/uy, Ee = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y, De = /\p{M}+/gu, Oe = {
	limit: Infinity,
	ellipsis: ""
}, ke = (e, t = {}, n = {}) => {
	let r = t.limit ?? Infinity, i = t.ellipsis ?? "", a = t?.ellipsisWidth ?? (i ? ke(i, Oe, n).width : 0), o = n.controlWidth ?? 0, s = n.tabWidth ?? 8, c = n.emojiWidth ?? 2, l = n.regularWidth ?? 1, u = n.wideWidth ?? 2, d = [
		[Ee, l],
		[xe, 0],
		[Se, o],
		[we, s],
		[Te, c],
		[Ce, u]
	], f = 0, p = 0, m = e.length, h = 0, g = !1, _ = m, v = Math.max(0, r - a), y = 0, b = 0, x = 0, S = 0;
	outer: for (;;) {
		if (b > y || p >= m && p > f) {
			let t = e.slice(y, b) || e.slice(f, p);
			h = 0;
			for (let e of t.replaceAll(De, "")) {
				let t = e.codePointAt(0) || 0;
				if (S = ye(t) ? 2 : be(t) ? u : l, x + S > v && (_ = Math.min(_, Math.max(y, f) + h)), x + S > r) {
					g = !0;
					break outer;
				}
				h += e.length, x += S;
			}
			y = b = 0;
		}
		if (p >= m) break outer;
		for (let t = 0, n = d.length; t < n; t++) {
			let [n, i] = d[t];
			if (n.lastIndex = p, n.test(e)) {
				if (h = n === Ce ? ve(e.slice(p, n.lastIndex)) : n === Te ? 1 : n.lastIndex - p, S = h * i, x + S > v && (_ = Math.min(_, p + Math.floor((v - x) / i))), x + S > r) {
					g = !0;
					break outer;
				}
				x += S, y = f, b = p, p = f = n.lastIndex;
				continue outer;
			}
		}
		p += 1;
	}
	return {
		width: g ? v : x,
		index: g ? _ : m,
		truncated: g,
		ellipsed: g && r >= a
	};
}, Ae = {
	limit: Infinity,
	ellipsis: "",
	ellipsisWidth: 0
}, T = (e, t = {}) => ke(e, Ae, t).width, je = "\x1B", Me = "", Ne = 39, Pe = "\x07", Fe = "[", Ie = "]", Le = "m", Re = `${Ie}8;;`, ze = RegExp(`(?:\\${Fe}(?<code>\\d+)m|\\${Re}(?<uri>.*)${Pe})`, "y"), Be = (e) => {
	if (e >= 30 && e <= 37 || e >= 90 && e <= 97) return 39;
	if (e >= 40 && e <= 47 || e >= 100 && e <= 107) return 49;
	if (e === 1 || e === 2) return 22;
	if (e === 3) return 23;
	if (e === 4) return 24;
	if (e === 7) return 27;
	if (e === 8) return 28;
	if (e === 9) return 29;
	if (e === 0) return 0;
}, Ve = (e) => `${je}${Fe}${e}${Le}`, He = (e) => `${je}${Re}${e}${Pe}`, Ue = (e, t, n) => {
	let r = t[Symbol.iterator](), i = !1, a = !1, o = e.at(-1), s = o === void 0 ? 0 : T(o), c = r.next(), l = r.next(), u = 0;
	for (; !c.done;) {
		let o = c.value, d = T(o);
		s + d <= n ? e[e.length - 1] += o : (e.push(o), s = 0), (o === je || o === Me) && (i = !0, a = t.startsWith(Re, u + 1)), i ? a ? o === Pe && (i = !1, a = !1) : o === Le && (i = !1) : (s += d, s === n && !l.done && (e.push(""), s = 0)), c = l, l = r.next(), u += o.length;
	}
	o = e.at(-1), !s && o !== void 0 && o.length && e.length > 1 && (e[e.length - 2] += e.pop());
}, We = (e) => {
	let t = e.split(" "), n = t.length;
	for (; n && !T(t[n - 1]);) n--;
	return n === t.length ? e : t.slice(0, n).join(" ") + t.slice(n).join("");
}, Ge = (e, t, n = {}) => {
	if (n.trim !== !1 && e.trim() === "") return "";
	let r = "", i, a, o = e.split(" "), s = [""], c = 0;
	for (let e = 0; e < o.length; e++) {
		let r = o[e];
		if (n.trim !== !1) {
			let e = s.at(-1) ?? "", t = e.trimStart();
			e.length !== t.length && (s[s.length - 1] = t, c = T(t));
		}
		e !== 0 && (c >= t && (n.wordWrap === !1 || n.trim === !1) && (s.push(""), c = 0), (c || n.trim === !1) && (s[s.length - 1] += " ", c++));
		let i = T(r);
		if (n.hard && i > t) {
			let e = t - c, n = 1 + Math.floor((i - e - 1) / t);
			Math.floor((i - 1) / t) < n && s.push(""), Ue(s, r, t), c = T(s.at(-1) ?? "");
			continue;
		}
		if (c + i > t && c && i) {
			if (n.wordWrap === !1 && c < t) {
				Ue(s, r, t), c = T(s.at(-1) ?? "");
				continue;
			}
			s.push(""), c = 0;
		}
		if (c + i > t && n.wordWrap === !1) {
			Ue(s, r, t), c = T(s.at(-1) ?? "");
			continue;
		}
		s[s.length - 1] += r, c += i;
	}
	n.trim !== !1 && (s = s.map((e) => We(e)));
	let l = s.join("\n"), u = !1;
	for (let e = 0; e < l.length; e++) {
		let t = l[e];
		if (r += t, u) u = !1;
		else if (u = t >= "\ud800" && t <= "\udbff", u) continue;
		if (t === je || t === Me) {
			ze.lastIndex = e + 1;
			let t = ze.exec(l)?.groups;
			if (t?.code !== void 0) {
				let e = Number.parseFloat(t.code);
				i = e === Ne ? void 0 : e;
			} else t?.uri !== void 0 && (a = t.uri.length === 0 ? void 0 : t.uri);
		}
		if (l[e + 1] === "\n") {
			a && (r += He(""));
			let e = i ? Be(i) : void 0;
			i && e && (r += Ve(e));
		} else t === "\n" && (i && Be(i) && (r += Ve(i)), a && (r += He(a)));
	}
	return r;
}, Ke = /\r?\n/;
function qe(e, t, n) {
	return String(e).normalize().split(Ke).map((e) => Ge(e, t, n)).join("\n");
}
//#endregion
//#region node_modules/.pnpm/@clack+core@1.3.0/node_modules/@clack/core/dist/index.mjs
var E = (/* @__PURE__ */ le(((e, t) => {
	var n = "\x1B", r = `${n}[`, i = "\x07", a = {
		to(e, t) {
			return t ? `${r}${t + 1};${e + 1}H` : `${r}${e + 1}G`;
		},
		move(e, t) {
			let n = "";
			return e < 0 ? n += `${r}${-e}D` : e > 0 && (n += `${r}${e}C`), t < 0 ? n += `${r}${-t}A` : t > 0 && (n += `${r}${t}B`), n;
		},
		up: (e = 1) => `${r}${e}A`,
		down: (e = 1) => `${r}${e}B`,
		forward: (e = 1) => `${r}${e}C`,
		backward: (e = 1) => `${r}${e}D`,
		nextLine: (e = 1) => `${r}E`.repeat(e),
		prevLine: (e = 1) => `${r}F`.repeat(e),
		left: `${r}G`,
		hide: `${r}?25l`,
		show: `${r}?25h`,
		save: `${n}7`,
		restore: `${n}8`
	};
	t.exports = {
		cursor: a,
		scroll: {
			up: (e = 1) => `${r}S`.repeat(e),
			down: (e = 1) => `${r}T`.repeat(e)
		},
		erase: {
			screen: `${r}2J`,
			up: (e = 1) => `${r}1J`.repeat(e),
			down: (e = 1) => `${r}J`.repeat(e),
			line: `${r}2K`,
			lineEnd: `${r}K`,
			lineStart: `${r}1K`,
			lines(e) {
				let t = "";
				for (let n = 0; n < e; n++) t += this.line + (n < e - 1 ? a.up() : "");
				return e && (t += a.left), t;
			}
		},
		beep: i
	};
})))();
function D(e, t, n) {
	if (!n.some((e) => !e.disabled)) return e;
	let r = e + t, i = Math.max(n.length - 1, 0), a = r < 0 ? i : r > i ? 0 : r;
	return n[a].disabled ? D(a, t < 0 ? -1 : 1, n) : a;
}
function Je(e, t, n, r) {
	let i = r.split("\n"), a = 0, o = e;
	for (let e of i) {
		if (o <= e.length) break;
		o -= e.length + 1, a++;
	}
	for (a = Math.max(0, Math.min(i.length - 1, a + n)), o = Math.min(o, i[a].length) + t; o < 0 && a > 0;) a--, o += i[a].length + 1;
	for (; o > i[a].length && a < i.length - 1;) o -= i[a].length + 1, a++;
	o = Math.max(0, Math.min(i[a].length, o));
	let s = 0;
	for (let e = 0; e < a; e++) s += i[e].length + 1;
	return s + o;
}
var O = {
	actions: new Set([
		"up",
		"down",
		"left",
		"right",
		"space",
		"enter",
		"cancel"
	]),
	aliases: new Map([
		["k", "up"],
		["j", "down"],
		["h", "left"],
		["l", "right"],
		["", "cancel"],
		["escape", "cancel"]
	]),
	messages: {
		cancel: "Canceled",
		error: "Something went wrong"
	},
	withGuide: !0,
	date: {
		monthNames: [...[
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December"
		]],
		messages: {
			required: "Please enter a valid date",
			invalidMonth: "There are only 12 months in a year",
			invalidDay: (e, t) => `There are only ${e} days in ${t}`,
			afterMin: (e) => `Date must be on or after ${e.toISOString().slice(0, 10)}`,
			beforeMax: (e) => `Date must be on or before ${e.toISOString().slice(0, 10)}`
		}
	}
};
function Ye(e, t) {
	if (typeof e == "string") return O.aliases.get(e) === t;
	for (let n of e) if (n !== void 0 && Ye(n, t)) return !0;
	return !1;
}
function Xe(e, t) {
	if (e === t) return;
	let n = e.split("\n"), r = t.split("\n"), i = Math.max(n.length, r.length), a = [];
	for (let e = 0; e < i; e++) n[e] !== r[e] && a.push(e);
	return {
		lines: a,
		numLinesBefore: n.length,
		numLinesAfter: r.length,
		numLines: i
	};
}
var Ze = globalThis.process.platform.startsWith("win"), Qe = Symbol("clack:cancel");
function $e(e) {
	return e === Qe;
}
function et(e, t) {
	let n = e;
	n.isTTY && n.setRawMode(t);
}
function tt({ input: e = y, output: t = b, overwrite: n = !0, hideCursor: r = !0 } = {}) {
	let i = x.createInterface({
		input: e,
		output: t,
		prompt: "",
		tabSize: 1
	});
	x.emitKeypressEvents(e, i), e instanceof ee && e.isTTY && e.setRawMode(!0);
	let a = (i, { name: o, sequence: s }) => {
		if (Ye([
			String(i),
			o,
			s
		], "cancel")) {
			r && t.write(E.cursor.show), process.exit(0);
			return;
		}
		if (!n) return;
		let c = o === "return" ? 0 : -1, l = o === "return" ? -1 : 0;
		x.moveCursor(t, c, l, () => {
			x.clearLine(t, 1, () => {
				e.once("keypress", a);
			});
		});
	};
	return r && t.write(E.cursor.hide), e.once("keypress", a), () => {
		e.off("keypress", a), r && t.write(E.cursor.show), e instanceof ee && e.isTTY && !Ze && e.setRawMode(!1), i.terminal = !1, i.close();
	};
}
var nt = (e) => "columns" in e && typeof e.columns == "number" ? e.columns : 80, rt = (e) => "rows" in e && typeof e.rows == "number" ? e.rows : 20;
function k(e, t, n, r = n, i) {
	return qe(t, nt(e ?? b) - n.length, {
		hard: !0,
		trim: !1
	}).split("\n").map((e, t) => {
		let a = i ? i(e, t) : e;
		return `${t === 0 ? r : n}${a}`;
	}).join("\n");
}
var it = class {
	input;
	output;
	_abortSignal;
	rl;
	opts;
	_render;
	_track = !1;
	_prevFrame = "";
	_subscribers = /* @__PURE__ */ new Map();
	_cursor = 0;
	state = "initial";
	error = "";
	value;
	userInput = "";
	constructor(e, t = !0) {
		let { input: n = y, output: r = b, render: i, signal: a, ...o } = e;
		this.opts = o, this.onKeypress = this.onKeypress.bind(this), this.close = this.close.bind(this), this.render = this.render.bind(this), this._render = i.bind(this), this._track = t, this._abortSignal = a, this.input = n, this.output = r;
	}
	unsubscribe() {
		this._subscribers.clear();
	}
	setSubscriber(e, t) {
		let n = this._subscribers.get(e) ?? [];
		n.push(t), this._subscribers.set(e, n);
	}
	on(e, t) {
		this.setSubscriber(e, { cb: t });
	}
	once(e, t) {
		this.setSubscriber(e, {
			cb: t,
			once: !0
		});
	}
	emit(e, ...t) {
		let n = this._subscribers.get(e) ?? [], r = [];
		for (let e of n) e.cb(...t), e.once && r.push(() => n.splice(n.indexOf(e), 1));
		for (let e of r) e();
	}
	prompt() {
		return new Promise((e) => {
			if (this._abortSignal) {
				if (this._abortSignal.aborted) return this.state = "cancel", this.close(), e(Qe);
				this._abortSignal.addEventListener("abort", () => {
					this.state = "cancel", this.close();
				}, { once: !0 });
			}
			this.rl = S.createInterface({
				input: this.input,
				tabSize: 2,
				prompt: "",
				escapeCodeTimeout: 50,
				terminal: !0
			}), this.rl.prompt(), this.opts.initialUserInput !== void 0 && this._setUserInput(this.opts.initialUserInput, !0), this.input.on("keypress", this.onKeypress), et(this.input, !0), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
				this.output.write(E.cursor.show), this.output.off("resize", this.render), et(this.input, !1), e(this.value);
			}), this.once("cancel", () => {
				this.output.write(E.cursor.show), this.output.off("resize", this.render), et(this.input, !1), e(Qe);
			});
		});
	}
	_isActionKey(e, t) {
		return e === "	";
	}
	_shouldSubmit(e, t) {
		return !0;
	}
	_setValue(e) {
		this.value = e, this.emit("value", this.value);
	}
	_setUserInput(e, t) {
		this.userInput = e ?? "", this.emit("userInput", this.userInput), t && this._track && this.rl && (this.rl.write(this.userInput), this._cursor = this.rl.cursor);
	}
	_clearUserInput() {
		this.rl?.write(null, {
			ctrl: !0,
			name: "u"
		}), this._setUserInput("");
	}
	onKeypress(e, t) {
		if (this._track && t.name !== "return" && (t.name && this._isActionKey(e, t) && this.rl?.write(null, {
			ctrl: !0,
			name: "h"
		}), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), t?.name && (!this._track && O.aliases.has(t.name) && this.emit("cursor", O.aliases.get(t.name)), O.actions.has(t.name) && this.emit("cursor", t.name)), e && (e.toLowerCase() === "y" || e.toLowerCase() === "n") && this.emit("confirm", e.toLowerCase() === "y"), this.emit("key", e?.toLowerCase(), t), t?.name === "return" && this._shouldSubmit(e, t)) {
			if (this.opts.validate) {
				let e = this.opts.validate(this.value);
				e && (this.error = e instanceof Error ? e.message : e, this.state = "error", this.rl?.write(this.userInput));
			}
			this.state !== "error" && (this.state = "submit");
		}
		Ye([
			e,
			t?.name,
			t?.sequence
		], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
	}
	close() {
		this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write("\n"), et(this.input, !1), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
	}
	restoreCursor() {
		let e = qe(this._prevFrame, process.stdout.columns, {
			hard: !0,
			trim: !1
		}).split("\n").length - 1;
		this.output.write(E.cursor.move(-999, e * -1));
	}
	render() {
		let e = qe(this._render(this) ?? "", process.stdout.columns, {
			hard: !0,
			trim: !1
		});
		if (e !== this._prevFrame) {
			if (this.state === "initial") this.output.write(E.cursor.hide);
			else {
				let t = Xe(this._prevFrame, e), n = rt(this.output);
				if (this.restoreCursor(), t) {
					let r = Math.max(0, t.numLinesAfter - n), i = Math.max(0, t.numLinesBefore - n), a = t.lines.find((e) => e >= r);
					if (a === void 0) {
						this._prevFrame = e;
						return;
					}
					if (t.lines.length === 1) {
						this.output.write(E.cursor.move(0, a - i)), this.output.write(E.erase.lines(1));
						let t = e.split("\n");
						this.output.write(t[a]), this._prevFrame = e, this.output.write(E.cursor.move(0, t.length - a - 1));
						return;
					} else if (t.lines.length > 1) {
						if (r < i) a = r;
						else {
							let e = a - i;
							e > 0 && this.output.write(E.cursor.move(0, e));
						}
						this.output.write(E.erase.down());
						let t = e.split("\n").slice(a);
						this.output.write(t.join("\n")), this._prevFrame = e;
						return;
					}
				}
				this.output.write(E.erase.down());
			}
			this.output.write(e), this.state === "initial" && (this.state = "active"), this._prevFrame = e;
		}
	}
}, at = class extends it {
	get cursor() {
		return +!this.value;
	}
	get _value() {
		return this.cursor === 0;
	}
	constructor(e) {
		super(e, !1), this.value = !!e.initialValue, this.on("userInput", () => {
			this.value = this._value;
		}), this.on("confirm", (e) => {
			this.output.write(E.cursor.move(0, -1)), this.value = e, this.state = "submit", this.close();
		}), this.on("cursor", () => {
			this.value = !this.value;
		});
	}
}, ot = class extends it {
	#e = !1;
	#t;
	focused = "editor";
	get userInputWithCursor() {
		if (this.state === "submit") return this.userInput;
		let e = this.userInput;
		if (this.cursor >= e.length) return `${e}\u2588`;
		let t = e.slice(0, this.cursor), n = e[this.cursor], r = e.slice(this.cursor + 1);
		return n === "\n" ? `${t}\u2588
${r}` : `${t}${_("inverse", n)}${r}`;
	}
	get cursor() {
		return this._cursor;
	}
	#n(e) {
		if (this.userInput.length === 0) {
			this._setUserInput(e);
			return;
		}
		this._setUserInput(this.userInput.slice(0, this.cursor) + e + this.userInput.slice(this.cursor));
	}
	#r(e) {
		let t = this.value ?? "";
		switch (e) {
			case "up":
				this._cursor = Je(this._cursor, 0, -1, t);
				return;
			case "down":
				this._cursor = Je(this._cursor, 0, 1, t);
				return;
			case "left":
				this._cursor = Je(this._cursor, -1, 0, t);
				return;
			case "right":
				this._cursor = Je(this._cursor, 1, 0, t);
				return;
		}
	}
	_shouldSubmit(e, t) {
		if (this.#t) return this.focused === "submit" ? !0 : (this.#n("\n"), this._cursor++, !1);
		let n = this.#e;
		return this.#e = !0, n ? (this.userInput[this.cursor - 1] === "\n" && (this._setUserInput(this.userInput.slice(0, this.cursor - 1) + this.userInput.slice(this.cursor)), this._cursor--), !0) : (this.#n("\n"), this._cursor++, !1);
	}
	constructor(e) {
		super(e, !1), this.#t = e.showSubmit ?? !1, this.on("key", (e, t) => {
			if (t?.name && O.actions.has(t.name)) {
				this.#r(t.name);
				return;
			}
			if (e === "	" && this.#t) {
				this.focused = this.focused === "editor" ? "submit" : "editor";
				return;
			}
			if (t?.name !== "return") {
				if (this.#e = !1, t?.name === "backspace" && this.cursor > 0) {
					this._setUserInput(this.userInput.slice(0, this.cursor - 1) + this.userInput.slice(this.cursor)), this._cursor--;
					return;
				}
				if (t?.name === "delete" && this.cursor < this.userInput.length) {
					this._setUserInput(this.userInput.slice(0, this.cursor) + this.userInput.slice(this.cursor + 1));
					return;
				}
				e && (this.#t && this.focused === "submit" && (this.focused = "editor"), this.#n(e ?? ""), this._cursor++);
			}
		}), this.on("userInput", (e) => {
			this._setValue(e);
		}), this.on("finalize", () => {
			this.value ||= e.defaultValue, this.value === void 0 && (this.value = "");
		});
	}
}, st = class extends it {
	options;
	cursor = 0;
	get _value() {
		return this.options[this.cursor].value;
	}
	get _enabledOptions() {
		return this.options.filter((e) => e.disabled !== !0);
	}
	toggleAll() {
		let e = this._enabledOptions, t = this.value !== void 0 && this.value.length === e.length;
		this.value = t ? [] : e.map((e) => e.value);
	}
	toggleInvert() {
		let e = this.value;
		if (!e) return;
		let t = this._enabledOptions.filter((t) => !e.includes(t.value));
		this.value = t.map((e) => e.value);
	}
	toggleValue() {
		this.value === void 0 && (this.value = []);
		let e = this.value.includes(this._value);
		this.value = e ? this.value.filter((e) => e !== this._value) : [...this.value, this._value];
	}
	constructor(e) {
		super(e, !1), this.options = e.options, this.value = [...e.initialValues ?? []];
		let t = Math.max(this.options.findIndex(({ value: t }) => t === e.cursorAt), 0);
		this.cursor = this.options[t].disabled ? D(t, 1, this.options) : t, this.on("key", (e) => {
			e === "a" && this.toggleAll(), e === "i" && this.toggleInvert();
		}), this.on("cursor", (e) => {
			switch (e) {
				case "left":
				case "up":
					this.cursor = D(this.cursor, -1, this.options);
					break;
				case "down":
				case "right":
					this.cursor = D(this.cursor, 1, this.options);
					break;
				case "space":
					this.toggleValue();
					break;
			}
		});
	}
}, ct = class extends it {
	options;
	cursor = 0;
	get _selectedValue() {
		return this.options[this.cursor];
	}
	changeValue() {
		this.value = this._selectedValue.value;
	}
	constructor(e) {
		super(e, !1), this.options = e.options;
		let t = this.options.findIndex(({ value: t }) => t === e.initialValue), n = t === -1 ? 0 : t;
		this.cursor = this.options[n].disabled ? D(n, 1, this.options) : n, this.changeValue(), this.on("cursor", (e) => {
			switch (e) {
				case "left":
				case "up":
					this.cursor = D(this.cursor, -1, this.options);
					break;
				case "down":
				case "right":
					this.cursor = D(this.cursor, 1, this.options);
					break;
			}
			this.changeValue();
		});
	}
}, lt = class extends it {
	get userInputWithCursor() {
		if (this.state === "submit") return this.userInput;
		let e = this.userInput;
		if (this.cursor >= e.length) return `${this.userInput}\u2588`;
		let t = e.slice(0, this.cursor), [n, ...r] = e.slice(this.cursor);
		return `${t}${_("inverse", n)}${r.join("")}`;
	}
	get cursor() {
		return this._cursor;
	}
	constructor(e) {
		super({
			...e,
			initialUserInput: e.initialUserInput ?? e.initialValue
		}), this.on("userInput", (e) => {
			this._setValue(e);
		}), this.on("finalize", () => {
			this.value ||= e.defaultValue, this.value === void 0 && (this.value = "");
		});
	}
};
//#endregion
//#region node_modules/.pnpm/@clack+prompts@1.3.0/node_modules/@clack/prompts/dist/index.mjs
function ut() {
	return v.platform === "win32" ? !!v.env.CI || !!v.env.WT_SESSION || !!v.env.TERMINUS_SUBLIME || v.env.ConEmuTask === "{cmd::Cmder}" || v.env.TERM_PROGRAM === "Terminus-Sublime" || v.env.TERM_PROGRAM === "vscode" || v.env.TERM === "xterm-256color" || v.env.TERM === "alacritty" || v.env.TERMINAL_EMULATOR === "JetBrains-JediTerm" : v.env.TERM !== "linux";
}
var dt = ut(), ft = () => process.env.CI === "true", A = (e, t) => dt ? e : t, pt = A("◆", "*"), mt = A("■", "x"), ht = A("▲", "x"), gt = A("◇", "o"), j = A("│", "|"), M = A("└", "—"), _t = A("●", ">"), vt = A("○", " "), yt = A("◻", "[•]"), bt = A("◼", "[+]"), xt = A("◻", "[ ]"), St = A("●", "•"), Ct = A("◆", "*"), wt = A("▲", "!"), Tt = A("■", "x"), Et = (e) => {
	switch (e) {
		case "initial":
		case "active": return _("cyan", pt);
		case "cancel": return _("red", mt);
		case "error": return _("yellow", ht);
		case "submit": return _("green", gt);
	}
}, Dt = (e) => {
	switch (e) {
		case "initial":
		case "active": return _("cyan", j);
		case "cancel": return _("red", j);
		case "error": return _("yellow", j);
		case "submit": return _("green", j);
	}
}, Ot = (e, t, n, r, i) => {
	let a = t, o = 0;
	for (let t = n; t < r; t++) {
		let n = e[t];
		if (a -= n.length, o++, a <= i) break;
	}
	return {
		lineCount: a,
		removals: o
	};
}, kt = ({ cursor: e, options: t, style: n, output: r = process.stdout, maxItems: i = Infinity, columnPadding: a = 0, rowPadding: o = 4 }) => {
	let s = nt(r) - a, c = rt(r), l = _("dim", "..."), u = Math.max(c - o, 0), d = Math.max(Math.min(i, u), 5), f = 0;
	e >= d - 3 && (f = Math.max(Math.min(e - d + 3, t.length - d), 0));
	let p = d < t.length && f > 0, m = d < t.length && f + d < t.length, h = Math.min(f + d, t.length), g = [], v = 0;
	p && v++, m && v++;
	let y = f + +!!p, b = h - +!!m;
	for (let r = y; r < b; r++) {
		let i = qe(n(t[r], r === e), s, {
			hard: !0,
			trim: !1
		}).split("\n");
		g.push(i), v += i.length;
	}
	if (v > u) {
		let t = 0, n = 0, r = v, i = e - y, a = (e, t) => Ot(g, r, e, t, u);
		p ? ({lineCount: r, removals: t} = a(0, i), r > u && ({lineCount: r, removals: n} = a(i + 1, g.length))) : ({lineCount: r, removals: n} = a(i + 1, g.length), r > u && ({lineCount: r, removals: t} = a(0, i))), t > 0 && (p = !0, g.splice(0, t)), n > 0 && (m = !0, g.splice(g.length - n, n));
	}
	let x = [];
	p && x.push(l);
	for (let e of g) for (let t of e) x.push(t);
	return m && x.push(l), x;
}, At = (e) => {
	let t = e.active ?? "Yes", n = e.inactive ?? "No";
	return new at({
		active: t,
		inactive: n,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValue: e.initialValue ?? !0,
		render() {
			let r = e.withGuide ?? O.withGuide, i = `${Et(this.state)}  `, a = r ? `${_("gray", j)}  ` : "", o = k(e.output, e.message, a, i), s = `${r ? `${_("gray", j)}
` : ""}${o}
`, c = this.value ? t : n;
			switch (this.state) {
				case "submit": return `${s}${r ? `${_("gray", j)}  ` : ""}${_("dim", c)}`;
				case "cancel": return `${s}${r ? `${_("gray", j)}  ` : ""}${_(["strikethrough", "dim"], c)}${r ? `
${_("gray", j)}` : ""}`;
				default: {
					let i = r ? `${_("cyan", j)}  ` : "", a = r ? _("cyan", M) : "";
					return `${s}${i}${this.value ? `${_("green", _t)} ${t}` : `${_("dim", vt)} ${_("dim", t)}`}${e.vertical ? r ? `
${_("cyan", j)}  ` : "\n" : ` ${_("dim", "/")} `}${this.value ? `${_("dim", vt)} ${_("dim", n)}` : `${_("green", _t)} ${n}`}
${a}
`;
				}
			}
		}
	}).prompt();
}, N = {
	message: (e = [], { symbol: t = _("gray", j), secondarySymbol: n = _("gray", j), output: r = process.stdout, spacing: i = 1, withGuide: a } = {}) => {
		let o = [], s = a ?? O.withGuide, c = s ? n : "", l = s ? `${t}  ` : "", u = s ? `${n}  ` : "";
		for (let e = 0; e < i; e++) o.push(c);
		let d = Array.isArray(e) ? e : e.split("\n");
		if (d.length > 0) {
			let [e, ...r] = d;
			e.length > 0 ? o.push(`${l}${e}`) : o.push(s ? t : "");
			for (let e of r) e.length > 0 ? o.push(`${u}${e}`) : o.push(s ? n : "");
		}
		r.write(`${o.join("\n")}
`);
	},
	info: (e, t) => {
		N.message(e, {
			...t,
			symbol: _("blue", St)
		});
	},
	success: (e, t) => {
		N.message(e, {
			...t,
			symbol: _("green", Ct)
		});
	},
	step: (e, t) => {
		N.message(e, {
			...t,
			symbol: _("green", gt)
		});
	},
	warn: (e, t) => {
		N.message(e, {
			...t,
			symbol: _("yellow", wt)
		});
	},
	warning: (e, t) => {
		N.warn(e, t);
	},
	error: (e, t) => {
		N.message(e, {
			...t,
			symbol: _("red", Tt)
		});
	}
}, P = (e = "", t) => {
	let n = t?.output ?? process.stdout, r = t?.withGuide ?? O.withGuide ? `${_("gray", M)}  ` : "";
	n.write(`${r}${_("red", e)}

`);
}, jt = (e = "", t) => {
	let n = t?.output ?? process.stdout, r = t?.withGuide ?? O.withGuide ? `${_("gray", j)}
${_("gray", M)}  ` : "";
	n.write(`${r}${e}

`);
}, Mt = (e) => new ot({
	validate: e.validate,
	placeholder: e.placeholder,
	defaultValue: e.defaultValue,
	initialValue: e.initialValue,
	showSubmit: e.showSubmit,
	output: e.output,
	signal: e.signal,
	input: e.input,
	render() {
		let t = e?.withGuide ?? O.withGuide, n = `${`${t ? `${_("gray", j)}
` : ""}${Et(this.state)}  `}${e.message}
`, r = e.placeholder ? _("inverse", e.placeholder[0]) + _("dim", e.placeholder.slice(1)) : _(["inverse", "hidden"], "_"), i = this.userInput ? this.userInputWithCursor : r, a = this.value ?? "", o = e.showSubmit ? `
  ${_(this.focused === "submit" ? "cyan" : "dim", "[ submit ]")}` : "";
		switch (this.state) {
			case "error": {
				let r = `${_("yellow", j)}  `;
				return `${n}${t ? k(e.output, i, r, void 0) : i}
${_("yellow", M)}  ${_("yellow", this.error)}${o}
`;
			}
			case "submit": {
				let r = `${_("gray", j)}  `;
				return `${n}${t ? k(e.output, a, r, void 0, (e) => _("dim", e)) : a ? _("dim", a) : ""}`;
			}
			case "cancel": {
				let r = `${_("gray", j)}  `;
				return `${n}${t ? k(e.output, a, r, void 0, (e) => _(["strikethrough", "dim"], e)) : a ? _(["strikethrough", "dim"], a) : ""}`;
			}
			default: {
				let r = t ? `${_("cyan", j)}  ` : "", a = t ? _("cyan", M) : "";
				return `${n}${t ? k(e.output, i, r) : i}
${a}${o}
`;
			}
		}
	}
}).prompt(), Nt = (e, t) => e.split("\n").map((e) => t(e)).join("\n"), Pt = (e) => {
	let t = (e, t) => {
		let n = e.label ?? String(e.value);
		return t === "disabled" ? `${_("gray", xt)} ${Nt(n, (e) => _(["strikethrough", "gray"], e))}${e.hint ? ` ${_("dim", `(${e.hint ?? "disabled"})`)}` : ""}` : t === "active" ? `${_("cyan", yt)} ${n}${e.hint ? ` ${_("dim", `(${e.hint})`)}` : ""}` : t === "selected" ? `${_("green", bt)} ${Nt(n, (e) => _("dim", e))}${e.hint ? ` ${_("dim", `(${e.hint})`)}` : ""}` : t === "cancelled" ? `${Nt(n, (e) => _(["strikethrough", "dim"], e))}` : t === "active-selected" ? `${_("green", bt)} ${n}${e.hint ? ` ${_("dim", `(${e.hint})`)}` : ""}` : t === "submitted" ? `${Nt(n, (e) => _("dim", e))}` : `${_("dim", xt)} ${Nt(n, (e) => _("dim", e))}`;
	}, n = e.required ?? !0;
	return new st({
		options: e.options,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValues: e.initialValues,
		required: n,
		cursorAt: e.cursorAt,
		validate(e) {
			if (n && (e === void 0 || e.length === 0)) return `Please select at least one option.
${_("reset", _("dim", `Press ${_([
				"gray",
				"bgWhite",
				"inverse"
			], " space ")} to select, ${_("gray", _("bgWhite", _("inverse", " enter ")))} to submit`))}`;
		},
		render() {
			let n = e.withGuide ?? O.withGuide, r = k(e.output, e.message, n ? `${Dt(this.state)}  ` : "", `${Et(this.state)}  `), i = `${n ? `${_("gray", j)}
` : ""}${r}
`, a = this.value ?? [], o = (e, n) => {
				if (e.disabled) return t(e, "disabled");
				let r = a.includes(e.value);
				return n && r ? t(e, "active-selected") : r ? t(e, "selected") : t(e, n ? "active" : "inactive");
			};
			switch (this.state) {
				case "submit": {
					let r = this.options.filter(({ value: e }) => a.includes(e)).map((e) => t(e, "submitted")).join(_("dim", ", ")) || _("dim", "none");
					return `${i}${k(e.output, r, n ? `${_("gray", j)}  ` : "")}`;
				}
				case "cancel": {
					let r = this.options.filter(({ value: e }) => a.includes(e)).map((e) => t(e, "cancelled")).join(_("dim", ", "));
					return r.trim() === "" ? `${i}${_("gray", j)}` : `${i}${k(e.output, r, n ? `${_("gray", j)}  ` : "")}${n ? `
${_("gray", j)}` : ""}`;
				}
				case "error": {
					let t = n ? `${_("yellow", j)}  ` : "", r = this.error.split("\n").map((e, t) => t === 0 ? `${n ? `${_("yellow", M)}  ` : ""}${_("yellow", e)}` : `   ${e}`).join("\n"), a = i.split("\n").length, s = r.split("\n").length + 1;
					return `${i}${t}${kt({
						output: e.output,
						options: this.options,
						cursor: this.cursor,
						maxItems: e.maxItems,
						columnPadding: t.length,
						rowPadding: a + s,
						style: o
					}).join(`
${t}`)}
${r}
`;
				}
				default: {
					let t = n ? `${_("cyan", j)}  ` : "", r = i.split("\n").length, a = n ? 2 : 1;
					return `${i}${t}${kt({
						output: e.output,
						options: this.options,
						cursor: this.cursor,
						maxItems: e.maxItems,
						columnPadding: t.length,
						rowPadding: r + a,
						style: o
					}).join(`
${t}`)}
${n ? _("cyan", M) : ""}
`;
				}
			}
		}
	}).prompt();
}, Ft = (e) => _("magenta", e), It = ({ indicator: e = "dots", onCancel: t, output: n = process.stdout, cancelMessage: r, errorMessage: i, frames: a = dt ? [
	"◒",
	"◐",
	"◓",
	"◑"
] : [
	"•",
	"o",
	"O",
	"0"
], delay: o = dt ? 80 : 120, signal: s, ...c } = {}) => {
	let l = ft(), u, d, f = !1, p = !1, m = "", h, g = performance.now(), v = nt(n), y = c?.styleFrame ?? Ft, b = (e) => {
		let n = e > 1 ? i ?? O.messages.error : r ?? O.messages.cancel;
		p = e === 1, f && (oe(n, e), p && typeof t == "function" && t());
	}, x = () => b(2), S = () => b(1), ee = () => {
		process.on("uncaughtExceptionMonitor", x), process.on("unhandledRejection", x), process.on("SIGINT", S), process.on("SIGTERM", S), process.on("exit", b), s && s.addEventListener("abort", S);
	}, te = () => {
		process.removeListener("uncaughtExceptionMonitor", x), process.removeListener("unhandledRejection", x), process.removeListener("SIGINT", S), process.removeListener("SIGTERM", S), process.removeListener("exit", b), s && s.removeEventListener("abort", S);
	}, ne = () => {
		if (h === void 0) return;
		l && n.write("\n");
		let e = qe(h, v, {
			hard: !0,
			trim: !1
		}).split("\n");
		e.length > 1 && n.write(E.cursor.up(e.length - 1)), n.write(E.cursor.to(0)), n.write(E.erase.down());
	}, re = (e) => e.replace(/\.+$/, ""), C = (e) => {
		let t = (performance.now() - e) / 1e3, n = Math.floor(t / 60), r = Math.floor(t % 60);
		return n > 0 ? `[${n}m ${r}s]` : `[${r}s]`;
	}, ie = c.withGuide ?? O.withGuide, ae = (t = "") => {
		f = !0, u = tt({ output: n }), m = re(t), g = performance.now(), ie && n.write(`${_("gray", j)}
`);
		let r = 0, i = 0;
		ee(), d = setInterval(() => {
			if (l && m === h) return;
			ne(), h = m;
			let t = y(a[r]), o;
			if (l) o = `${t}  ${m}...`;
			else if (e === "timer") o = `${t}  ${m} ${C(g)}`;
			else {
				let e = ".".repeat(Math.floor(i)).slice(0, 3);
				o = `${t}  ${m}${e}`;
			}
			let s = qe(o, v, {
				hard: !0,
				trim: !1
			});
			n.write(s), r = r + 1 < a.length ? r + 1 : 0, i = i < 4 ? i + .125 : 0;
		}, o);
	}, oe = (t = "", r = 0, i = !1) => {
		if (!f) return;
		f = !1, clearInterval(d), ne();
		let a = r === 0 ? _("green", gt) : r === 1 ? _("red", mt) : _("red", ht);
		m = t ?? m, i || (e === "timer" ? n.write(`${a}  ${m} ${C(g)}
`) : n.write(`${a}  ${m}
`)), te(), u();
	};
	return {
		start: ae,
		stop: (e = "") => oe(e, 0),
		message: (e = "") => {
			m = re(e ?? m);
		},
		cancel: (e = "") => oe(e, 1),
		error: (e = "") => oe(e, 2),
		clear: () => oe("", 0, !0),
		get isCancelled() {
			return p;
		}
	};
}, Lt = (e, t) => e.includes("\n") ? e.split("\n").map((e) => t(e)).join("\n") : t(e), Rt = (e) => {
	let t = (e, t) => {
		let n = e.label ?? String(e.value);
		switch (t) {
			case "disabled": return `${_("gray", vt)} ${Lt(n, (e) => _("gray", e))}${e.hint ? ` ${_("dim", `(${e.hint ?? "disabled"})`)}` : ""}`;
			case "selected": return `${Lt(n, (e) => _("dim", e))}`;
			case "active": return `${_("green", _t)} ${n}${e.hint ? ` ${_("dim", `(${e.hint})`)}` : ""}`;
			case "cancelled": return `${Lt(n, (e) => _(["strikethrough", "dim"], e))}`;
			default: return `${_("dim", vt)} ${Lt(n, (e) => _("dim", e))}`;
		}
	};
	return new ct({
		options: e.options,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValue: e.initialValue,
		render() {
			let n = e.withGuide ?? O.withGuide, r = `${Et(this.state)}  `, i = `${Dt(this.state)}  `, a = k(e.output, e.message, i, r), o = `${n ? `${_("gray", j)}
` : ""}${a}
`;
			switch (this.state) {
				case "submit": {
					let r = n ? `${_("gray", j)}  ` : "";
					return `${o}${k(e.output, t(this.options[this.cursor], "selected"), r)}`;
				}
				case "cancel": {
					let r = n ? `${_("gray", j)}  ` : "";
					return `${o}${k(e.output, t(this.options[this.cursor], "cancelled"), r)}${n ? `
${_("gray", j)}` : ""}`;
				}
				default: {
					let r = n ? `${_("cyan", j)}  ` : "", i = n ? _("cyan", M) : "", a = o.split("\n").length, s = n ? 2 : 1;
					return `${o}${r}${kt({
						output: e.output,
						cursor: this.cursor,
						options: this.options,
						maxItems: e.maxItems,
						columnPadding: r.length,
						rowPadding: a + s,
						style: (e, n) => t(e, e.disabled ? "disabled" : n ? "active" : "inactive")
					}).join(`
${r}`)}
${i}
`;
				}
			}
		}
	}).prompt();
}, zt = `${_("gray", j)}  `, Bt = {
	message: async (e, { symbol: t = _("gray", j) } = {}) => {
		process.stdout.write(`${_("gray", j)}
${t}  `);
		let n = 3;
		for await (let t of e) {
			t = t.replace(/\n/g, `
${zt}`), t.includes("\n") && (n = 3 + g(t.slice(t.lastIndexOf("\n"))).length);
			let e = g(t).length;
			n + e < process.stdout.columns ? (n += e, process.stdout.write(t)) : (process.stdout.write(`
${zt}${t.trimStart()}`), n = 3 + g(t.trimStart()).length);
		}
		process.stdout.write("\n");
	},
	info: (e) => Bt.message(e, { symbol: _("blue", St) }),
	success: (e) => Bt.message(e, { symbol: _("green", Ct) }),
	step: (e) => Bt.message(e, { symbol: _("green", gt) }),
	warn: (e) => Bt.message(e, { symbol: _("yellow", wt) }),
	warning: (e) => Bt.warn(e),
	error: (e) => Bt.message(e, { symbol: _("red", Tt) })
}, Vt = (e) => new lt({
	validate: e.validate,
	placeholder: e.placeholder,
	defaultValue: e.defaultValue,
	initialValue: e.initialValue,
	output: e.output,
	signal: e.signal,
	input: e.input,
	render() {
		let t = e?.withGuide ?? O.withGuide, n = `${`${t ? `${_("gray", j)}
` : ""}${Et(this.state)}  `}${e.message}
`, r = e.placeholder ? _("inverse", e.placeholder[0]) + _("dim", e.placeholder.slice(1)) : _(["inverse", "hidden"], "_"), i = this.userInput ? this.userInputWithCursor : r, a = this.value ?? "";
		switch (this.state) {
			case "error": {
				let e = this.error ? `  ${_("yellow", this.error)}` : "", r = t ? `${_("yellow", j)}  ` : "", a = t ? _("yellow", M) : "";
				return `${n.trim()}
${r}${i}
${a}${e}
`;
			}
			case "submit": {
				let e = a ? `  ${_("dim", a)}` : "";
				return `${n}${t ? _("gray", j) : ""}${e}`;
			}
			case "cancel": {
				let e = a ? `  ${_(["strikethrough", "dim"], a)}` : "", r = t ? _("gray", j) : "";
				return `${n}${r}${e}${a.trim() ? `
${r}` : ""}`;
			}
			default: return `${n}${t ? `${_("cyan", j)}  ` : ""}${i}
${t ? _("cyan", M) : ""}
`;
		}
	}
}).prompt(), F = (/* @__PURE__ */ le(((e, t) => {
	var n = String, r = function() {
		return {
			isColorSupported: !1,
			reset: n,
			bold: n,
			dim: n,
			italic: n,
			underline: n,
			inverse: n,
			hidden: n,
			strikethrough: n,
			black: n,
			red: n,
			green: n,
			yellow: n,
			blue: n,
			magenta: n,
			cyan: n,
			white: n,
			gray: n,
			bgBlack: n,
			bgRed: n,
			bgGreen: n,
			bgYellow: n,
			bgBlue: n,
			bgMagenta: n,
			bgCyan: n,
			bgWhite: n,
			blackBright: n,
			redBright: n,
			greenBright: n,
			yellowBright: n,
			blueBright: n,
			magentaBright: n,
			cyanBright: n,
			whiteBright: n,
			bgBlackBright: n,
			bgRedBright: n,
			bgGreenBright: n,
			bgYellowBright: n,
			bgBlueBright: n,
			bgMagentaBright: n,
			bgCyanBright: n,
			bgWhiteBright: n
		};
	};
	t.exports = r(), t.exports.createColors = r;
})))();
function Ht(e) {
	return e.hint ? {
		label: e.title,
		value: e.value,
		hint: e.hint
	} : {
		label: e.title,
		value: e.value
	};
}
async function Ut({ message: e, placeholder: t, cancelMessage: n = "Selection canceled.", errorMessage: r = "Failed to select an option" }) {
	let { checkPromiseReturn: i, createNg: a } = w, o = await i({
		fn: async () => await Vt({
			message: e,
			placeholder: t
		}),
		err: (e) => a(_e(r, e))
	});
	return o.isErr || $e(o.value) && (P(n), process.exit(0)), o;
}
async function Wt({ message: e, placeholder: t, cancelMessage: n = "Selection canceled.", errorMessage: r = "Failed to select an option" }) {
	let { checkPromiseReturn: i, createNg: a } = w;
	N.message(`${(0, F.bold)("To send, press the Tab key and then press Enter.")}\n`), O.actions.delete("space");
	let o = await i({
		fn: async () => await Mt({
			message: e,
			placeholder: t,
			showSubmit: !0
		}),
		err: (e) => a(_e(r, e))
	});
	return O.actions.add("space"), o.isErr || $e(o.value) && (P(n), process.exit(0)), o;
}
async function Gt({ message: e, options: t, cancelMessage: n = "Selection canceled.", errorMessage: r = "Failed to select an option" }) {
	let { createNg: i, createOk: a, checkPromiseReturn: o } = w, s = t.find((e) => e.selected)?.value, c = await o({
		fn: async () => await Rt({
			message: e,
			initialValue: s,
			options: t.map((e) => Ht(e))
		}),
		err: (e) => i(_e(r, e))
	});
	return c.isErr ? c : ($e(c.value) && (P(n), process.exit(0)), a(c.value));
}
async function Kt({ message: e, options: t, required: n, cancelMessage: r = "Selection canceled.", errorMessage: i = "Failed to select options" }) {
	let { createNg: a, createOk: o, checkPromiseReturn: s } = w, c = t.filter((e) => e.selected).map((e) => e.value), l = await s({
		fn: async () => await Pt({
			message: e,
			required: n,
			initialValues: c,
			options: t.map((e) => Ht(e))
		}),
		err: (e) => a(_e(i, e))
	});
	return l.isErr ? l : ($e(l.value) && (P(r), process.exit(0)), o(l.value));
}
//#endregion
//#region src/command/init.ts
var qt = [{
	title: "Bug report",
	value: "bug_report",
	selected: !0
}, {
	title: "Feature request",
	value: "feature_request",
	selected: !0
}], Jt = [{
	title: "English",
	value: "en",
	selected: !0
}, {
	title: "Japanese",
	value: "ja",
	selected: !1
}];
async function Yt() {
	return await Kt({
		message: "Select issue template types",
		options: qt,
		cancelMessage: "No template types selected. Canceled.",
		errorMessage: "Failed to select issue template types"
	});
}
async function Xt() {
	return await Kt({
		message: "Select template languages",
		options: Jt,
		cancelMessage: "No languages selected. Canceled.",
		errorMessage: "Failed to select template languages"
	});
}
async function Zt() {
	let { checkPromiseReturn: e, createNg: t, createOk: n } = w, r = await e({
		fn: async () => await At({ message: "This will create issue templates in .github/ISSUE_TEMPLATE. Do you want to continue?" }),
		err: (e) => t(_e("Failed to get user confirmation", e))
	});
	return r.isErr ? r : ($e(r.value) && (P("Initialization canceled."), process.exit(0)), n(r.value));
}
async function Qt() {
	let { checkPromiseReturn: e, createNg: t, createOk: n } = w, r = await e({
		fn: async () => await At({ message: "Do you want to create issue templates in .github/ISSUE_TEMPLATE?" }),
		err: (e) => t(_e("Failed to get user confirmation", e))
	});
	return r.isErr ? r : ($e(r.value) && (P("Initialization canceled."), process.exit(0)), n(r.value));
}
//#endregion
//#region src/action/init.ts
async function $t() {
	let e = f(process.cwd(), ".gh-issue"), t = f(e, "README.md"), r = It();
	o(e) && (P(".gh-issue already exists. Initialization has already been completed."), process.exit(0));
	let i = await Qt();
	i.isErr && (N.error(`Error: ${i.err.message}`), process.exit(1)), i.value || (await n(e, { recursive: !0 }), o(t) || await a(t, "# gh-issue\n\nThis directory is managed by gh-issue."), jt("All done!"), process.exit(0));
	let s = await Yt();
	s.isErr && (N.error(`Error: ${s.err.message}`), process.exit(1)), s.value.length === 0 && (P("No template types selected. Canceled."), process.exit(0));
	let c = await Xt();
	c.isErr && (N.error(`Error: ${c.err.message}`), process.exit(1)), c.value.length === 0 && (P("No languages selected. Canceled."), process.exit(0));
	let l = await Zt();
	l.isErr && (N.error(`Error: ${l.err.message}`), process.exit(1)), l.value || (P("Canceled."), process.exit(0));
	let u = [];
	for (let e of c.value) for (let t of s.value) u.push({
		lang: e,
		file: `${t}_${e}.yml`
	});
	let p = f(process.cwd(), ".github"), h = f(p, "ISSUE_TEMPLATE"), g = f(d(m(import.meta.url)), "template");
	await n(p, { recursive: !0 }), await n(h, { recursive: !0 }), r.start("Creating issue templates...");
	for (let e of u) {
		let t = f(h, e.file);
		if (o(t)) {
			r.error(`Already exists ${t}. Skipped.`);
			continue;
		}
		let n = f(g, e.lang);
		r.message(`Creating ${e.file}...`);
		let i = await ge(e.file, h, {
			parents: !1,
			cwd: n
		});
		i.isErr && (r.error(`Error: ${i.err.message}`), process.exit(1)), r.message(`Created ${t}\n`);
	}
	r.stop(), await n(e, { recursive: !0 }), o(t) || await a(t, "# gh-issue\n\nThis directory is managed by gh-issue."), jt("All done!");
}
//#endregion
//#region src/helper/find-template.ts
function en() {
	let { createNg: e, createOk: t } = w, n = C(process.cwd(), ".github", "ISSUE_TEMPLATE");
	if (!o(n)) return e(/* @__PURE__ */ Error(".github/ISSUE_TEMPLATE directory does not exist"));
	let r = c(n, { withFileTypes: !0 }).filter((e) => e.isFile()).map((e) => e.name);
	return r.length === 0 ? e(/* @__PURE__ */ Error("No issue templates found in .github/ISSUE_TEMPLATE")) : t(r);
}
//#endregion
//#region node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/dist/js-yaml.mjs
function tn(e) {
	return e == null;
}
function nn(e) {
	return typeof e == "object" && !!e;
}
function rn(e) {
	return Array.isArray(e) ? e : tn(e) ? [] : [e];
}
function an(e, t) {
	var n, r, i, a;
	if (t) for (a = Object.keys(t), n = 0, r = a.length; n < r; n += 1) i = a[n], e[i] = t[i];
	return e;
}
function on(e, t) {
	var n = "", r;
	for (r = 0; r < t; r += 1) n += e;
	return n;
}
function sn(e) {
	return e === 0 && 1 / e == -Infinity;
}
var I = {
	isNothing: tn,
	isObject: nn,
	toArray: rn,
	repeat: on,
	isNegativeZero: sn,
	extend: an
};
function cn(e, t) {
	var n = "", r = e.reason || "(unknown reason)";
	return e.mark ? (e.mark.name && (n += "in \"" + e.mark.name + "\" "), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet), r + " " + n) : r;
}
function ln(e, t) {
	Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = cn(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (/* @__PURE__ */ Error()).stack || "";
}
ln.prototype = Object.create(Error.prototype), ln.prototype.constructor = ln, ln.prototype.toString = function(e) {
	return this.name + ": " + cn(this, e);
};
var L = ln;
function un(e, t, n, r, i) {
	var a = "", o = "", s = Math.floor(i / 2) - 1;
	return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
		str: a + e.slice(t, n).replace(/\t/g, "→") + o,
		pos: r - t + a.length
	};
}
function dn(e, t) {
	return I.repeat(" ", t - e.length) + e;
}
function fn(e, t) {
	if (t = Object.create(t || null), !e.buffer) return null;
	t.maxLength ||= 79, typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
	for (var n = /\r?\n|\r|\0/g, r = [0], i = [], a, o = -1; a = n.exec(e.buffer);) i.push(a.index), r.push(a.index + a[0].length), e.position <= a.index && o < 0 && (o = r.length - 2);
	o < 0 && (o = r.length - 1);
	var s = "", c, l, u = Math.min(e.line + t.linesAfter, i.length).toString().length, d = t.maxLength - (t.indent + u + 3);
	for (c = 1; c <= t.linesBefore && !(o - c < 0); c++) l = un(e.buffer, r[o - c], i[o - c], e.position - (r[o] - r[o - c]), d), s = I.repeat(" ", t.indent) + dn((e.line - c + 1).toString(), u) + " | " + l.str + "\n" + s;
	for (l = un(e.buffer, r[o], i[o], e.position, d), s += I.repeat(" ", t.indent) + dn((e.line + 1).toString(), u) + " | " + l.str + "\n", s += I.repeat("-", t.indent + u + 3 + l.pos) + "^\n", c = 1; c <= t.linesAfter && !(o + c >= i.length); c++) l = un(e.buffer, r[o + c], i[o + c], e.position - (r[o] - r[o + c]), d), s += I.repeat(" ", t.indent) + dn((e.line + c + 1).toString(), u) + " | " + l.str + "\n";
	return s.replace(/\n$/, "");
}
var pn = fn, mn = [
	"kind",
	"multi",
	"resolve",
	"construct",
	"instanceOf",
	"predicate",
	"represent",
	"representName",
	"defaultStyle",
	"styleAliases"
], hn = [
	"scalar",
	"sequence",
	"mapping"
];
function gn(e) {
	var t = {};
	return e !== null && Object.keys(e).forEach(function(n) {
		e[n].forEach(function(e) {
			t[String(e)] = n;
		});
	}), t;
}
function _n(e, t) {
	if (t ||= {}, Object.keys(t).forEach(function(t) {
		if (mn.indexOf(t) === -1) throw new L("Unknown option \"" + t + "\" is met in definition of \"" + e + "\" YAML type.");
	}), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
		return !0;
	}, this.construct = t.construct || function(e) {
		return e;
	}, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = gn(t.styleAliases || null), hn.indexOf(this.kind) === -1) throw new L("Unknown kind \"" + this.kind + "\" is specified for \"" + e + "\" YAML type.");
}
var R = _n;
function vn(e, t) {
	var n = [];
	return e[t].forEach(function(e) {
		var t = n.length;
		n.forEach(function(n, r) {
			n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
		}), n[t] = e;
	}), n;
}
function yn() {
	var e = {
		scalar: {},
		sequence: {},
		mapping: {},
		fallback: {},
		multi: {
			scalar: [],
			sequence: [],
			mapping: [],
			fallback: []
		}
	}, t, n;
	function r(t) {
		t.multi ? (e.multi[t.kind].push(t), e.multi.fallback.push(t)) : e[t.kind][t.tag] = e.fallback[t.tag] = t;
	}
	for (t = 0, n = arguments.length; t < n; t += 1) arguments[t].forEach(r);
	return e;
}
function bn(e) {
	return this.extend(e);
}
bn.prototype.extend = function(e) {
	var t = [], n = [];
	if (e instanceof R) n.push(e);
	else if (Array.isArray(e)) n = n.concat(e);
	else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit))) e.implicit && (t = t.concat(e.implicit)), e.explicit && (n = n.concat(e.explicit));
	else throw new L("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
	t.forEach(function(e) {
		if (!(e instanceof R)) throw new L("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		if (e.loadKind && e.loadKind !== "scalar") throw new L("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
		if (e.multi) throw new L("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
	}), n.forEach(function(e) {
		if (!(e instanceof R)) throw new L("Specified list of YAML types (or a single Type object) contains a non-Type object.");
	});
	var r = Object.create(bn.prototype);
	return r.implicit = (this.implicit || []).concat(t), r.explicit = (this.explicit || []).concat(n), r.compiledImplicit = vn(r, "implicit"), r.compiledExplicit = vn(r, "explicit"), r.compiledTypeMap = yn(r.compiledImplicit, r.compiledExplicit), r;
};
var xn = new bn({ explicit: [
	new R("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: function(e) {
			return e === null ? "" : e;
		}
	}),
	new R("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: function(e) {
			return e === null ? [] : e;
		}
	}),
	new R("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: function(e) {
			return e === null ? {} : e;
		}
	})
] });
function Sn(e) {
	if (e === null) return !0;
	var t = e.length;
	return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function Cn() {
	return null;
}
function wn(e) {
	return e === null;
}
var Tn = new R("tag:yaml.org,2002:null", {
	kind: "scalar",
	resolve: Sn,
	construct: Cn,
	predicate: wn,
	represent: {
		canonical: function() {
			return "~";
		},
		lowercase: function() {
			return "null";
		},
		uppercase: function() {
			return "NULL";
		},
		camelcase: function() {
			return "Null";
		},
		empty: function() {
			return "";
		}
	},
	defaultStyle: "lowercase"
});
function En(e) {
	if (e === null) return !1;
	var t = e.length;
	return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function Dn(e) {
	return e === "true" || e === "True" || e === "TRUE";
}
function On(e) {
	return Object.prototype.toString.call(e) === "[object Boolean]";
}
var kn = new R("tag:yaml.org,2002:bool", {
	kind: "scalar",
	resolve: En,
	construct: Dn,
	predicate: On,
	represent: {
		lowercase: function(e) {
			return e ? "true" : "false";
		},
		uppercase: function(e) {
			return e ? "TRUE" : "FALSE";
		},
		camelcase: function(e) {
			return e ? "True" : "False";
		}
	},
	defaultStyle: "lowercase"
});
function An(e) {
	return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function jn(e) {
	return 48 <= e && e <= 55;
}
function Mn(e) {
	return 48 <= e && e <= 57;
}
function Nn(e) {
	if (e === null) return !1;
	var t = e.length, n = 0, r = !1, i;
	if (!t) return !1;
	if (i = e[n], (i === "-" || i === "+") && (i = e[++n]), i === "0") {
		if (n + 1 === t) return !0;
		if (i = e[++n], i === "b") {
			for (n++; n < t; n++) if (i = e[n], i !== "_") {
				if (i !== "0" && i !== "1") return !1;
				r = !0;
			}
			return r && i !== "_";
		}
		if (i === "x") {
			for (n++; n < t; n++) if (i = e[n], i !== "_") {
				if (!An(e.charCodeAt(n))) return !1;
				r = !0;
			}
			return r && i !== "_";
		}
		if (i === "o") {
			for (n++; n < t; n++) if (i = e[n], i !== "_") {
				if (!jn(e.charCodeAt(n))) return !1;
				r = !0;
			}
			return r && i !== "_";
		}
	}
	if (i === "_") return !1;
	for (; n < t; n++) if (i = e[n], i !== "_") {
		if (!Mn(e.charCodeAt(n))) return !1;
		r = !0;
	}
	return !(!r || i === "_");
}
function Pn(e) {
	var t = e, n = 1, r;
	if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
	if (r === "0") {
		if (t[1] === "b") return n * parseInt(t.slice(2), 2);
		if (t[1] === "x") return n * parseInt(t.slice(2), 16);
		if (t[1] === "o") return n * parseInt(t.slice(2), 8);
	}
	return n * parseInt(t, 10);
}
function Fn(e) {
	return Object.prototype.toString.call(e) === "[object Number]" && e % 1 == 0 && !I.isNegativeZero(e);
}
var In = new R("tag:yaml.org,2002:int", {
	kind: "scalar",
	resolve: Nn,
	construct: Pn,
	predicate: Fn,
	represent: {
		binary: function(e) {
			return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
		},
		octal: function(e) {
			return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
		},
		decimal: function(e) {
			return e.toString(10);
		},
		hexadecimal: function(e) {
			return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
		}
	},
	defaultStyle: "decimal",
	styleAliases: {
		binary: [2, "bin"],
		octal: [8, "oct"],
		decimal: [10, "dec"],
		hexadecimal: [16, "hex"]
	}
}), Ln = /* @__PURE__ */ RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function Rn(e) {
	return !(e === null || !Ln.test(e) || e[e.length - 1] === "_");
}
function zn(e) {
	var t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1;
	return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Infinity : -Infinity : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var Bn = /^[-+]?[0-9]+e/;
function Vn(e, t) {
	var n;
	if (isNaN(e)) switch (t) {
		case "lowercase": return ".nan";
		case "uppercase": return ".NAN";
		case "camelcase": return ".NaN";
	}
	else if (e === Infinity) switch (t) {
		case "lowercase": return ".inf";
		case "uppercase": return ".INF";
		case "camelcase": return ".Inf";
	}
	else if (e === -Infinity) switch (t) {
		case "lowercase": return "-.inf";
		case "uppercase": return "-.INF";
		case "camelcase": return "-.Inf";
	}
	else if (I.isNegativeZero(e)) return "-0.0";
	return n = e.toString(10), Bn.test(n) ? n.replace("e", ".e") : n;
}
function Hn(e) {
	return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 != 0 || I.isNegativeZero(e));
}
var Un = new R("tag:yaml.org,2002:float", {
	kind: "scalar",
	resolve: Rn,
	construct: zn,
	predicate: Hn,
	represent: Vn,
	defaultStyle: "lowercase"
}), Wn = xn.extend({ implicit: [
	Tn,
	kn,
	In,
	Un
] }), Gn = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), Kn = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function qn(e) {
	return e === null ? !1 : Gn.exec(e) !== null || Kn.exec(e) !== null;
}
function Jn(e) {
	var t, n, r, i, a, o, s, c = 0, l = null, u, d, f;
	if (t = Gn.exec(e), t === null && (t = Kn.exec(e)), t === null) throw Error("Date resolve error");
	if (n = +t[1], r = t[2] - 1, i = +t[3], !t[4]) return new Date(Date.UTC(n, r, i));
	if (a = +t[4], o = +t[5], s = +t[6], t[7]) {
		for (c = t[7].slice(0, 3); c.length < 3;) c += "0";
		c = +c;
	}
	return t[9] && (u = +t[10], d = +(t[11] || 0), l = (u * 60 + d) * 6e4, t[9] === "-" && (l = -l)), f = new Date(Date.UTC(n, r, i, a, o, s, c)), l && f.setTime(f.getTime() - l), f;
}
function Yn(e) {
	return e.toISOString();
}
var Xn = new R("tag:yaml.org,2002:timestamp", {
	kind: "scalar",
	resolve: qn,
	construct: Jn,
	instanceOf: Date,
	represent: Yn
});
function Zn(e) {
	return e === "<<" || e === null;
}
var Qn = new R("tag:yaml.org,2002:merge", {
	kind: "scalar",
	resolve: Zn
}), $n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function er(e) {
	if (e === null) return !1;
	var t, n, r = 0, i = e.length, a = $n;
	for (n = 0; n < i; n++) if (t = a.indexOf(e.charAt(n)), !(t > 64)) {
		if (t < 0) return !1;
		r += 6;
	}
	return r % 8 == 0;
}
function tr(e) {
	var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, a = $n, o = 0, s = [];
	for (t = 0; t < i; t++) t % 4 == 0 && t && (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)), o = o << 6 | a.indexOf(r.charAt(t));
	return n = i % 4 * 6, n === 0 ? (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)) : n === 18 ? (s.push(o >> 10 & 255), s.push(o >> 2 & 255)) : n === 12 && s.push(o >> 4 & 255), new Uint8Array(s);
}
function nr(e) {
	var t = "", n = 0, r, i, a = e.length, o = $n;
	for (r = 0; r < a; r++) r % 3 == 0 && r && (t += o[n >> 18 & 63], t += o[n >> 12 & 63], t += o[n >> 6 & 63], t += o[n & 63]), n = (n << 8) + e[r];
	return i = a % 3, i === 0 ? (t += o[n >> 18 & 63], t += o[n >> 12 & 63], t += o[n >> 6 & 63], t += o[n & 63]) : i === 2 ? (t += o[n >> 10 & 63], t += o[n >> 4 & 63], t += o[n << 2 & 63], t += o[64]) : i === 1 && (t += o[n >> 2 & 63], t += o[n << 4 & 63], t += o[64], t += o[64]), t;
}
function rr(e) {
	return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var ir = new R("tag:yaml.org,2002:binary", {
	kind: "scalar",
	resolve: er,
	construct: tr,
	predicate: rr,
	represent: nr
}), ar = Object.prototype.hasOwnProperty, or = Object.prototype.toString;
function sr(e) {
	if (e === null) return !0;
	var t = [], n, r, i, a, o, s = e;
	for (n = 0, r = s.length; n < r; n += 1) {
		if (i = s[n], o = !1, or.call(i) !== "[object Object]") return !1;
		for (a in i) if (ar.call(i, a)) if (!o) o = !0;
		else return !1;
		if (!o) return !1;
		if (t.indexOf(a) === -1) t.push(a);
		else return !1;
	}
	return !0;
}
function cr(e) {
	return e === null ? [] : e;
}
var lr = new R("tag:yaml.org,2002:omap", {
	kind: "sequence",
	resolve: sr,
	construct: cr
}), ur = Object.prototype.toString;
function dr(e) {
	if (e === null) return !0;
	var t, n, r, i, a, o = e;
	for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) {
		if (r = o[t], ur.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
		a[t] = [i[0], r[i[0]]];
	}
	return !0;
}
function fr(e) {
	if (e === null) return [];
	var t, n, r, i, a, o = e;
	for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) r = o[t], i = Object.keys(r), a[t] = [i[0], r[i[0]]];
	return a;
}
var pr = new R("tag:yaml.org,2002:pairs", {
	kind: "sequence",
	resolve: dr,
	construct: fr
}), mr = Object.prototype.hasOwnProperty;
function hr(e) {
	if (e === null) return !0;
	var t, n = e;
	for (t in n) if (mr.call(n, t) && n[t] !== null) return !1;
	return !0;
}
function gr(e) {
	return e === null ? {} : e;
}
var _r = new R("tag:yaml.org,2002:set", {
	kind: "mapping",
	resolve: hr,
	construct: gr
}), vr = Wn.extend({
	implicit: [Xn, Qn],
	explicit: [
		ir,
		lr,
		pr,
		_r
	]
}), z = Object.prototype.hasOwnProperty, yr = 1, br = 2, xr = 3, Sr = 4, Cr = 1, wr = 2, Tr = 3, Er = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, Dr = /[\x85\u2028\u2029]/, Or = /[,\[\]\{\}]/, kr = /^(?:!|!!|![a-z\-]+!)$/i, Ar = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function jr(e) {
	return Object.prototype.toString.call(e);
}
function B(e) {
	return e === 10 || e === 13;
}
function V(e) {
	return e === 9 || e === 32;
}
function H(e) {
	return e === 9 || e === 32 || e === 10 || e === 13;
}
function Mr(e) {
	return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function Nr(e) {
	var t;
	return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Pr(e) {
	return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Fr(e) {
	return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ir(e) {
	return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? "\n" : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? "\"" : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? "\xA0" : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Lr(e) {
	return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
}
function Rr(e, t, n) {
	t === "__proto__" ? Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !0,
		writable: !0,
		value: n
	}) : e[t] = n;
}
for (var zr = Array(256), Br = Array(256), Vr = 0; Vr < 256; Vr++) zr[Vr] = +!!Ir(Vr), Br[Vr] = Ir(Vr);
function Hr(e, t) {
	this.input = e, this.filename = t.filename || null, this.schema = t.schema || vr, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Ur(e, t) {
	var n = {
		name: e.filename,
		buffer: e.input.slice(0, -1),
		position: e.position,
		line: e.line,
		column: e.position - e.lineStart
	};
	return n.snippet = pn(n), new L(t, n);
}
function U(e, t) {
	throw Ur(e, t);
}
function Wr(e, t) {
	e.onWarning && e.onWarning.call(null, Ur(e, t));
}
var Gr = {
	YAML: function(e, t, n) {
		var r, i, a;
		e.version !== null && U(e, "duplication of %YAML directive"), n.length !== 1 && U(e, "YAML directive accepts exactly one argument"), r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), r === null && U(e, "ill-formed argument of the YAML directive"), i = parseInt(r[1], 10), a = parseInt(r[2], 10), i !== 1 && U(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Wr(e, "unsupported YAML version of the document");
	},
	TAG: function(e, t, n) {
		var r, i;
		n.length !== 2 && U(e, "TAG directive accepts exactly two arguments"), r = n[0], i = n[1], kr.test(r) || U(e, "ill-formed tag handle (first argument) of the TAG directive"), z.call(e.tagMap, r) && U(e, "there is a previously declared suffix for \"" + r + "\" tag handle"), Ar.test(i) || U(e, "ill-formed tag prefix (second argument) of the TAG directive");
		try {
			i = decodeURIComponent(i);
		} catch {
			U(e, "tag prefix is malformed: " + i);
		}
		e.tagMap[r] = i;
	}
};
function W(e, t, n, r) {
	var i, a, o, s;
	if (t < n) {
		if (s = e.input.slice(t, n), r) for (i = 0, a = s.length; i < a; i += 1) o = s.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || U(e, "expected valid JSON character");
		else Er.test(s) && U(e, "the stream contains non-printable characters");
		e.result += s;
	}
}
function Kr(e, t, n, r) {
	var i, a, o, s;
	for (I.isObject(n) || U(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), o = 0, s = i.length; o < s; o += 1) a = i[o], z.call(t, a) || (Rr(t, a, n[a]), r[a] = !0);
}
function qr(e, t, n, r, i, a, o, s, c) {
	var l, u;
	if (Array.isArray(i)) for (i = Array.prototype.slice.call(i), l = 0, u = i.length; l < u; l += 1) Array.isArray(i[l]) && U(e, "nested arrays are not supported inside keys"), typeof i == "object" && jr(i[l]) === "[object Object]" && (i[l] = "[object Object]");
	if (typeof i == "object" && jr(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge") if (Array.isArray(a)) for (l = 0, u = a.length; l < u; l += 1) Kr(e, t, a[l], n);
	else Kr(e, t, a, n);
	else !e.json && !z.call(n, i) && z.call(t, i) && (e.line = o || e.line, e.lineStart = s || e.lineStart, e.position = c || e.position, U(e, "duplicated mapping key")), Rr(t, i, a), delete n[i];
	return t;
}
function Jr(e) {
	var t = e.input.charCodeAt(e.position);
	t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : U(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function G(e, t, n) {
	for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0;) {
		for (; V(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
		if (t && i === 35) do
			i = e.input.charCodeAt(++e.position);
		while (i !== 10 && i !== 13 && i !== 0);
		if (B(i)) for (Jr(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
		else break;
	}
	return n !== -1 && r !== 0 && e.lineIndent < n && Wr(e, "deficient indentation"), r;
}
function Yr(e) {
	var t = e.position, n = e.input.charCodeAt(t);
	return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || H(n)));
}
function Xr(e, t) {
	t === 1 ? e.result += " " : t > 1 && (e.result += I.repeat("\n", t - 1));
}
function Zr(e, t, n) {
	var r, i, a, o, s, c, l, u, d = e.kind, f = e.result, p = e.input.charCodeAt(e.position);
	if (H(p) || Mr(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), H(i) || n && Mr(i))) return !1;
	for (e.kind = "scalar", e.result = "", a = o = e.position, s = !1; p !== 0;) {
		if (p === 58) {
			if (i = e.input.charCodeAt(e.position + 1), H(i) || n && Mr(i)) break;
		} else if (p === 35) {
			if (r = e.input.charCodeAt(e.position - 1), H(r)) break;
		} else if (e.position === e.lineStart && Yr(e) || n && Mr(p)) break;
		else if (B(p)) if (c = e.line, l = e.lineStart, u = e.lineIndent, G(e, !1, -1), e.lineIndent >= t) {
			s = !0, p = e.input.charCodeAt(e.position);
			continue;
		} else {
			e.position = o, e.line = c, e.lineStart = l, e.lineIndent = u;
			break;
		}
		s &&= (W(e, a, o, !1), Xr(e, e.line - c), a = o = e.position, !1), V(p) || (o = e.position + 1), p = e.input.charCodeAt(++e.position);
	}
	return W(e, a, o, !1), e.result ? !0 : (e.kind = d, e.result = f, !1);
}
function Qr(e, t) {
	var n = e.input.charCodeAt(e.position), r, i;
	if (n !== 39) return !1;
	for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0;) if (n === 39) if (W(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39) r = e.position, e.position++, i = e.position;
	else return !0;
	else B(n) ? (W(e, r, i, !0), Xr(e, G(e, !1, t)), r = i = e.position) : e.position === e.lineStart && Yr(e) ? U(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
	U(e, "unexpected end of the stream within a single quoted scalar");
}
function $r(e, t) {
	var n, r, i, a, o, s = e.input.charCodeAt(e.position);
	if (s !== 34) return !1;
	for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0;) if (s === 34) return W(e, n, e.position, !0), e.position++, !0;
	else if (s === 92) {
		if (W(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), B(s)) G(e, !1, t);
		else if (s < 256 && zr[s]) e.result += Br[s], e.position++;
		else if ((o = Pr(s)) > 0) {
			for (i = o, a = 0; i > 0; i--) s = e.input.charCodeAt(++e.position), (o = Nr(s)) >= 0 ? a = (a << 4) + o : U(e, "expected hexadecimal character");
			e.result += Lr(a), e.position++;
		} else U(e, "unknown escape sequence");
		n = r = e.position;
	} else B(s) ? (W(e, n, r, !0), Xr(e, G(e, !1, t)), n = r = e.position) : e.position === e.lineStart && Yr(e) ? U(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
	U(e, "unexpected end of the stream within a double quoted scalar");
}
function ei(e, t) {
	var n = !0, r, i, a, o = e.tag, s, c = e.anchor, l, u, d, f, p, m = Object.create(null), h, g, _, v = e.input.charCodeAt(e.position);
	if (v === 91) u = 93, p = !1, s = [];
	else if (v === 123) u = 125, p = !0, s = {};
	else return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = s), v = e.input.charCodeAt(++e.position); v !== 0;) {
		if (G(e, !0, t), v = e.input.charCodeAt(e.position), v === u) return e.position++, e.tag = o, e.anchor = c, e.kind = p ? "mapping" : "sequence", e.result = s, !0;
		n ? v === 44 && U(e, "expected the node content, but found ','") : U(e, "missed comma between flow collection entries"), g = h = _ = null, d = f = !1, v === 63 && (l = e.input.charCodeAt(e.position + 1), H(l) && (d = f = !0, e.position++, G(e, !0, t))), r = e.line, i = e.lineStart, a = e.position, si(e, t, yr, !1, !0), g = e.tag, h = e.result, G(e, !0, t), v = e.input.charCodeAt(e.position), (f || e.line === r) && v === 58 && (d = !0, v = e.input.charCodeAt(++e.position), G(e, !0, t), si(e, t, yr, !1, !0), _ = e.result), p ? qr(e, s, m, g, h, _, r, i, a) : d ? s.push(qr(e, null, m, g, h, _, r, i, a)) : s.push(h), G(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (n = !0, v = e.input.charCodeAt(++e.position)) : n = !1;
	}
	U(e, "unexpected end of the stream within a flow collection");
}
function ti(e, t) {
	var n, r, i = Cr, a = !1, o = !1, s = t, c = 0, l = !1, u, d = e.input.charCodeAt(e.position);
	if (d === 124) r = !1;
	else if (d === 62) r = !0;
	else return !1;
	for (e.kind = "scalar", e.result = ""; d !== 0;) if (d = e.input.charCodeAt(++e.position), d === 43 || d === 45) Cr === i ? i = d === 43 ? Tr : wr : U(e, "repeat of a chomping mode identifier");
	else if ((u = Fr(d)) >= 0) u === 0 ? U(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? U(e, "repeat of an indentation width identifier") : (s = t + u - 1, o = !0);
	else break;
	if (V(d)) {
		do
			d = e.input.charCodeAt(++e.position);
		while (V(d));
		if (d === 35) do
			d = e.input.charCodeAt(++e.position);
		while (!B(d) && d !== 0);
	}
	for (; d !== 0;) {
		for (Jr(e), e.lineIndent = 0, d = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && d === 32;) e.lineIndent++, d = e.input.charCodeAt(++e.position);
		if (!o && e.lineIndent > s && (s = e.lineIndent), B(d)) {
			c++;
			continue;
		}
		if (e.lineIndent < s) {
			i === Tr ? e.result += I.repeat("\n", a ? 1 + c : c) : i === Cr && a && (e.result += "\n");
			break;
		}
		for (r ? V(d) ? (l = !0, e.result += I.repeat("\n", a ? 1 + c : c)) : l ? (l = !1, e.result += I.repeat("\n", c + 1)) : c === 0 ? a && (e.result += " ") : e.result += I.repeat("\n", c) : e.result += I.repeat("\n", a ? 1 + c : c), a = !0, o = !0, c = 0, n = e.position; !B(d) && d !== 0;) d = e.input.charCodeAt(++e.position);
		W(e, n, e.position, !1);
	}
	return !0;
}
function ni(e, t) {
	var n, r = e.tag, i = e.anchor, a = [], o, s = !1, c;
	if (e.firstTabInLine !== -1) return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = a), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), !(c !== 45 || (o = e.input.charCodeAt(e.position + 1), !H(o))));) {
		if (s = !0, e.position++, G(e, !0, -1) && e.lineIndent <= t) {
			a.push(null), c = e.input.charCodeAt(e.position);
			continue;
		}
		if (n = e.line, si(e, t, xr, !1, !0), a.push(e.result), G(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && c !== 0) U(e, "bad indentation of a sequence entry");
		else if (e.lineIndent < t) break;
	}
	return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function ri(e, t, n) {
	var r, i, a, o, s, c, l = e.tag, u = e.anchor, d = {}, f = Object.create(null), p = null, m = null, h = null, g = !1, _ = !1, v;
	if (e.firstTabInLine !== -1) return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = d), v = e.input.charCodeAt(e.position); v !== 0;) {
		if (!g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, U(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), a = e.line, (v === 63 || v === 58) && H(r)) v === 63 ? (g && (qr(e, d, f, p, m, null, o, s, c), p = m = h = null), _ = !0, g = !0, i = !0) : g ? (g = !1, i = !0) : U(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, v = r;
		else {
			if (o = e.line, s = e.lineStart, c = e.position, !si(e, n, br, !1, !0)) break;
			if (e.line === a) {
				for (v = e.input.charCodeAt(e.position); V(v);) v = e.input.charCodeAt(++e.position);
				if (v === 58) v = e.input.charCodeAt(++e.position), H(v) || U(e, "a whitespace character is expected after the key-value separator within a block mapping"), g && (qr(e, d, f, p, m, null, o, s, c), p = m = h = null), _ = !0, g = !1, i = !1, p = e.tag, m = e.result;
				else if (_) U(e, "can not read an implicit mapping pair; a colon is missed");
				else return e.tag = l, e.anchor = u, !0;
			} else if (_) U(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
			else return e.tag = l, e.anchor = u, !0;
		}
		if ((e.line === a || e.lineIndent > t) && (g && (o = e.line, s = e.lineStart, c = e.position), si(e, t, Sr, !0, i) && (g ? m = e.result : h = e.result), g || (qr(e, d, f, p, m, h, o, s, c), p = m = h = null), G(e, !0, -1), v = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && v !== 0) U(e, "bad indentation of a mapping entry");
		else if (e.lineIndent < t) break;
	}
	return g && qr(e, d, f, p, m, null, o, s, c), _ && (e.tag = l, e.anchor = u, e.kind = "mapping", e.result = d), _;
}
function ii(e) {
	var t, n = !1, r = !1, i, a, o = e.input.charCodeAt(e.position);
	if (o !== 33) return !1;
	if (e.tag !== null && U(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (n = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (r = !0, i = "!!", o = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
		do
			o = e.input.charCodeAt(++e.position);
		while (o !== 0 && o !== 62);
		e.position < e.length ? (a = e.input.slice(t, e.position), o = e.input.charCodeAt(++e.position)) : U(e, "unexpected end of the stream within a verbatim tag");
	} else {
		for (; o !== 0 && !H(o);) o === 33 && (r ? U(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), kr.test(i) || U(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), o = e.input.charCodeAt(++e.position);
		a = e.input.slice(t, e.position), Or.test(a) && U(e, "tag suffix cannot contain flow indicator characters");
	}
	a && !Ar.test(a) && U(e, "tag name cannot contain such characters: " + a);
	try {
		a = decodeURIComponent(a);
	} catch {
		U(e, "tag name is malformed: " + a);
	}
	return n ? e.tag = a : z.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : U(e, "undeclared tag handle \"" + i + "\""), !0;
}
function ai(e) {
	var t, n = e.input.charCodeAt(e.position);
	if (n !== 38) return !1;
	for (e.anchor !== null && U(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !H(n) && !Mr(n);) n = e.input.charCodeAt(++e.position);
	return e.position === t && U(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function oi(e) {
	var t, n, r = e.input.charCodeAt(e.position);
	if (r !== 42) return !1;
	for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !H(r) && !Mr(r);) r = e.input.charCodeAt(++e.position);
	return e.position === t && U(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), z.call(e.anchorMap, n) || U(e, "unidentified alias \"" + n + "\""), e.result = e.anchorMap[n], G(e, !0, -1), !0;
}
function si(e, t, n, r, i) {
	var a, o, s, c = 1, l = !1, u = !1, d, f, p, m, h, g;
	if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = o = s = Sr === n || xr === n, r && G(e, !0, -1) && (l = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1) for (; ii(e) || ai(e);) G(e, !0, -1) ? (l = !0, s = a, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : s = !1;
	if (s &&= l || i, (c === 1 || Sr === n) && (h = yr === n || br === n ? t : t + 1, g = e.position - e.lineStart, c === 1 ? s && (ni(e, g) || ri(e, g, h)) || ei(e, h) ? u = !0 : (o && ti(e, h) || Qr(e, h) || $r(e, h) ? u = !0 : oi(e) ? (u = !0, (e.tag !== null || e.anchor !== null) && U(e, "alias node should not have any properties")) : Zr(e, h, yr === n) && (u = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (u = s && ni(e, g))), e.tag === null) e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
	else if (e.tag === "?") {
		for (e.result !== null && e.kind !== "scalar" && U(e, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + e.kind + "\""), d = 0, f = e.implicitTypes.length; d < f; d += 1) if (m = e.implicitTypes[d], m.resolve(e.result)) {
			e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
			break;
		}
	} else if (e.tag !== "!") {
		if (z.call(e.typeMap[e.kind || "fallback"], e.tag)) m = e.typeMap[e.kind || "fallback"][e.tag];
		else for (m = null, p = e.typeMap.multi[e.kind || "fallback"], d = 0, f = p.length; d < f; d += 1) if (e.tag.slice(0, p[d].tag.length) === p[d].tag) {
			m = p[d];
			break;
		}
		m || U(e, "unknown tag !<" + e.tag + ">"), e.result !== null && m.kind !== e.kind && U(e, "unacceptable node kind for !<" + e.tag + "> tag; it should be \"" + m.kind + "\", not \"" + e.kind + "\""), m.resolve(e.result, e.tag) ? (e.result = m.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : U(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
	}
	return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || u;
}
function ci(e) {
	var t = e.position, n, r, i, a = !1, o;
	for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = Object.create(null), e.anchorMap = Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (G(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37));) {
		for (a = !0, o = e.input.charCodeAt(++e.position), n = e.position; o !== 0 && !H(o);) o = e.input.charCodeAt(++e.position);
		for (r = e.input.slice(n, e.position), i = [], r.length < 1 && U(e, "directive name must not be less than one character in length"); o !== 0;) {
			for (; V(o);) o = e.input.charCodeAt(++e.position);
			if (o === 35) {
				do
					o = e.input.charCodeAt(++e.position);
				while (o !== 0 && !B(o));
				break;
			}
			if (B(o)) break;
			for (n = e.position; o !== 0 && !H(o);) o = e.input.charCodeAt(++e.position);
			i.push(e.input.slice(n, e.position));
		}
		o !== 0 && Jr(e), z.call(Gr, r) ? Gr[r](e, r, i) : Wr(e, "unknown document directive \"" + r + "\"");
	}
	if (G(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, G(e, !0, -1)) : a && U(e, "directives end mark is expected"), si(e, e.lineIndent - 1, Sr, !1, !0), G(e, !0, -1), e.checkLineBreaks && Dr.test(e.input.slice(t, e.position)) && Wr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Yr(e)) {
		e.input.charCodeAt(e.position) === 46 && (e.position += 3, G(e, !0, -1));
		return;
	}
	if (e.position < e.length - 1) U(e, "end of the stream or a document separator is expected");
	else return;
}
function li(e, t) {
	e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += "\n"), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
	var n = new Hr(e, t), r = e.indexOf("\0");
	for (r !== -1 && (n.position = r, U(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
	for (; n.position < n.length - 1;) ci(n);
	return n.documents;
}
function ui(e, t, n) {
	typeof t == "object" && t && n === void 0 && (n = t, t = null);
	var r = li(e, n);
	if (typeof t != "function") return r;
	for (var i = 0, a = r.length; i < a; i += 1) t(r[i]);
}
function di(e, t) {
	var n = li(e, t);
	if (n.length !== 0) {
		if (n.length === 1) return n[0];
		throw new L("expected a single document in the stream, but found more");
	}
}
var fi = {
	loadAll: ui,
	load: di
}, pi = Object.prototype.toString, mi = Object.prototype.hasOwnProperty, hi = 65279, gi = 9, _i = 10, vi = 13, yi = 32, bi = 33, xi = 34, Si = 35, Ci = 37, wi = 38, Ti = 39, Ei = 42, Di = 44, Oi = 45, ki = 58, Ai = 61, ji = 62, Mi = 63, Ni = 64, Pi = 91, Fi = 93, Ii = 96, Li = 123, Ri = 124, zi = 125, K = {};
K[0] = "\\0", K[7] = "\\a", K[8] = "\\b", K[9] = "\\t", K[10] = "\\n", K[11] = "\\v", K[12] = "\\f", K[13] = "\\r", K[27] = "\\e", K[34] = "\\\"", K[92] = "\\\\", K[133] = "\\N", K[160] = "\\_", K[8232] = "\\L", K[8233] = "\\P";
var Bi = [
	"y",
	"Y",
	"yes",
	"Yes",
	"YES",
	"on",
	"On",
	"ON",
	"n",
	"N",
	"no",
	"No",
	"NO",
	"off",
	"Off",
	"OFF"
], Vi = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Hi(e, t) {
	var n, r, i, a, o, s, c;
	if (t === null) return {};
	for (n = {}, r = Object.keys(t), i = 0, a = r.length; i < a; i += 1) o = r[i], s = String(t[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), c = e.compiledTypeMap.fallback[o], c && mi.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[o] = s;
	return n;
}
function Ui(e) {
	var t = e.toString(16).toUpperCase(), n, r;
	if (e <= 255) n = "x", r = 2;
	else if (e <= 65535) n = "u", r = 4;
	else if (e <= 4294967295) n = "U", r = 8;
	else throw new L("code point within a string may not be greater than 0xFFFFFFFF");
	return "\\" + n + I.repeat("0", r - t.length) + t;
}
var Wi = 1, Gi = 2;
function Ki(e) {
	this.schema = e.schema || vr, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = I.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Hi(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === "\"" ? Gi : Wi, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function qi(e, t) {
	for (var n = I.repeat(" ", t), r = 0, i = -1, a = "", o, s = e.length; r < s;) i = e.indexOf("\n", r), i === -1 ? (o = e.slice(r), r = s) : (o = e.slice(r, i + 1), r = i + 1), o.length && o !== "\n" && (a += n), a += o;
	return a;
}
function Ji(e, t) {
	return "\n" + I.repeat(" ", e.indent * t);
}
function Yi(e, t) {
	var n, r, i;
	for (n = 0, r = e.implicitTypes.length; n < r; n += 1) if (i = e.implicitTypes[n], i.resolve(t)) return !0;
	return !1;
}
function Xi(e) {
	return e === yi || e === gi;
}
function Zi(e) {
	return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== hi || 65536 <= e && e <= 1114111;
}
function Qi(e) {
	return Zi(e) && e !== hi && e !== vi && e !== _i;
}
function $i(e, t, n) {
	var r = Qi(e), i = r && !Xi(e);
	return (n ? r : r && e !== Di && e !== Pi && e !== Fi && e !== Li && e !== zi) && e !== Si && !(t === ki && !i) || Qi(t) && !Xi(t) && e === Si || t === ki && i;
}
function ea(e) {
	return Zi(e) && e !== hi && !Xi(e) && e !== Oi && e !== Mi && e !== ki && e !== Di && e !== Pi && e !== Fi && e !== Li && e !== zi && e !== Si && e !== wi && e !== Ei && e !== bi && e !== Ri && e !== Ai && e !== ji && e !== Ti && e !== xi && e !== Ci && e !== Ni && e !== Ii;
}
function ta(e) {
	return !Xi(e) && e !== ki;
}
function na(e, t) {
	var n = e.charCodeAt(t), r;
	return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function ra(e) {
	return /^\n* /.test(e);
}
var ia = 1, aa = 2, oa = 3, sa = 4, ca = 5;
function la(e, t, n, r, i, a, o, s) {
	var c, l = 0, u = null, d = !1, f = !1, p = r !== -1, m = -1, h = ea(na(e, 0)) && ta(na(e, e.length - 1));
	if (t || o) for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
		if (l = na(e, c), !Zi(l)) return ca;
		h &&= $i(l, u, s), u = l;
	}
	else {
		for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
			if (l = na(e, c), l === _i) d = !0, p && (f ||= c - m - 1 > r && e[m + 1] !== " ", m = c);
			else if (!Zi(l)) return ca;
			h &&= $i(l, u, s), u = l;
		}
		f ||= p && c - m - 1 > r && e[m + 1] !== " ";
	}
	return !d && !f ? h && !o && !i(e) ? ia : a === Gi ? ca : aa : n > 9 && ra(e) ? ca : o ? a === Gi ? ca : aa : f ? sa : oa;
}
function ua(e, t, n, r, i) {
	e.dump = function() {
		if (t.length === 0) return e.quotingType === Gi ? "\"\"" : "''";
		if (!e.noCompatMode && (Bi.indexOf(t) !== -1 || Vi.test(t))) return e.quotingType === Gi ? "\"" + t + "\"" : "'" + t + "'";
		var a = e.indent * Math.max(1, n), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), s = r || e.flowLevel > -1 && n >= e.flowLevel;
		function c(t) {
			return Yi(e, t);
		}
		switch (la(t, s, e.indent, o, c, e.quotingType, e.forceQuotes && !r, i)) {
			case ia: return t;
			case aa: return "'" + t.replace(/'/g, "''") + "'";
			case oa: return "|" + da(t, e.indent) + fa(qi(t, a));
			case sa: return ">" + da(t, e.indent) + fa(qi(pa(t, o), a));
			case ca: return "\"" + ha(t) + "\"";
			default: throw new L("impossible error: invalid scalar style");
		}
	}();
}
function da(e, t) {
	var n = ra(e) ? String(t) : "", r = e[e.length - 1] === "\n";
	return n + (r && (e[e.length - 2] === "\n" || e === "\n") ? "+" : r ? "" : "-") + "\n";
}
function fa(e) {
	return e[e.length - 1] === "\n" ? e.slice(0, -1) : e;
}
function pa(e, t) {
	for (var n = /(\n+)([^\n]*)/g, r = function() {
		var r = e.indexOf("\n");
		return r = r === -1 ? e.length : r, n.lastIndex = r, ma(e.slice(0, r), t);
	}(), i = e[0] === "\n" || e[0] === " ", a, o; o = n.exec(e);) {
		var s = o[1], c = o[2];
		a = c[0] === " ", r += s + (!i && !a && c !== "" ? "\n" : "") + ma(c, t), i = a;
	}
	return r;
}
function ma(e, t) {
	if (e === "" || e[0] === " ") return e;
	for (var n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = ""; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += "\n" + e.slice(i, a), i = a + 1), o = s;
	return c += "\n", e.length - i > t && o > i ? c += e.slice(i, o) + "\n" + e.slice(o + 1) : c += e.slice(i), c.slice(1);
}
function ha(e) {
	for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++) n = na(e, i), r = K[n], !r && Zi(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || Ui(n);
	return t;
}
function ga(e, t, n) {
	var r = "", i = e.tag, a, o, s;
	for (a = 0, o = n.length; a < o; a += 1) s = n[a], e.replacer && (s = e.replacer.call(n, String(a), s)), (q(e, t, s, !1, !1) || s === void 0 && q(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
	e.tag = i, e.dump = "[" + r + "]";
}
function _a(e, t, n, r) {
	var i = "", a = e.tag, o, s, c;
	for (o = 0, s = n.length; o < s; o += 1) c = n[o], e.replacer && (c = e.replacer.call(n, String(o), c)), (q(e, t + 1, c, !0, !0, !1, !0) || c === void 0 && q(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += Ji(e, t)), e.dump && _i === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
	e.tag = a, e.dump = i || "[]";
}
function va(e, t, n) {
	var r = "", i = e.tag, a = Object.keys(n), o, s, c, l, u;
	for (o = 0, s = a.length; o < s; o += 1) u = "", r !== "" && (u += ", "), e.condenseFlow && (u += "\""), c = a[o], l = n[c], e.replacer && (l = e.replacer.call(n, c, l)), q(e, t, c, !1, !1) && (e.dump.length > 1024 && (u += "? "), u += e.dump + (e.condenseFlow ? "\"" : "") + ":" + (e.condenseFlow ? "" : " "), q(e, t, l, !1, !1) && (u += e.dump, r += u));
	e.tag = i, e.dump = "{" + r + "}";
}
function ya(e, t, n, r) {
	var i = "", a = e.tag, o = Object.keys(n), s, c, l, u, d, f;
	if (e.sortKeys === !0) o.sort();
	else if (typeof e.sortKeys == "function") o.sort(e.sortKeys);
	else if (e.sortKeys) throw new L("sortKeys must be a boolean or a function");
	for (s = 0, c = o.length; s < c; s += 1) f = "", (!r || i !== "") && (f += Ji(e, t)), l = o[s], u = n[l], e.replacer && (u = e.replacer.call(n, l, u)), q(e, t + 1, l, !0, !0, !0) && (d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, d && (e.dump && _i === e.dump.charCodeAt(0) ? f += "?" : f += "? "), f += e.dump, d && (f += Ji(e, t)), q(e, t + 1, u, !0, d) && (e.dump && _i === e.dump.charCodeAt(0) ? f += ":" : f += ": ", f += e.dump, i += f));
	e.tag = a, e.dump = i || "{}";
}
function ba(e, t, n) {
	var r, i = n ? e.explicitTypes : e.implicitTypes, a, o, s, c;
	for (a = 0, o = i.length; a < o; a += 1) if (s = i[a], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
		if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
			if (c = e.styleMap[s.tag] || s.defaultStyle, pi.call(s.represent) === "[object Function]") r = s.represent(t, c);
			else if (mi.call(s.represent, c)) r = s.represent[c](t, c);
			else throw new L("!<" + s.tag + "> tag resolver accepts not \"" + c + "\" style");
			e.dump = r;
		}
		return !0;
	}
	return !1;
}
function q(e, t, n, r, i, a, o) {
	e.tag = null, e.dump = n, ba(e, n, !1) || ba(e, n, !0);
	var s = pi.call(e.dump), c = r, l;
	r &&= e.flowLevel < 0 || e.flowLevel > t;
	var u = s === "[object Object]" || s === "[object Array]", d, f;
	if (u && (d = e.duplicates.indexOf(n), f = d !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && t > 0) && (i = !1), f && e.usedDuplicates[d]) e.dump = "*ref_" + d;
	else {
		if (u && f && !e.usedDuplicates[d] && (e.usedDuplicates[d] = !0), s === "[object Object]") r && Object.keys(e.dump).length !== 0 ? (ya(e, t, e.dump, i), f && (e.dump = "&ref_" + d + e.dump)) : (va(e, t, e.dump), f && (e.dump = "&ref_" + d + " " + e.dump));
		else if (s === "[object Array]") r && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? _a(e, t - 1, e.dump, i) : _a(e, t, e.dump, i), f && (e.dump = "&ref_" + d + e.dump)) : (ga(e, t, e.dump), f && (e.dump = "&ref_" + d + " " + e.dump));
		else if (s === "[object String]") e.tag !== "?" && ua(e, e.dump, t, a, c);
		else if (s === "[object Undefined]") return !1;
		else {
			if (e.skipInvalid) return !1;
			throw new L("unacceptable kind of an object to dump " + s);
		}
		e.tag !== null && e.tag !== "?" && (l = encodeURI(e.tag[0] === "!" ? e.tag.slice(1) : e.tag).replace(/!/g, "%21"), l = e.tag[0] === "!" ? "!" + l : l.slice(0, 18) === "tag:yaml.org,2002:" ? "!!" + l.slice(18) : "!<" + l + ">", e.dump = l + " " + e.dump);
	}
	return !0;
}
function xa(e, t) {
	var n = [], r = [], i, a;
	for (Sa(e, n, r), i = 0, a = r.length; i < a; i += 1) t.duplicates.push(n[r[i]]);
	t.usedDuplicates = Array(a);
}
function Sa(e, t, n) {
	var r, i, a;
	if (typeof e == "object" && e) if (i = t.indexOf(e), i !== -1) n.indexOf(i) === -1 && n.push(i);
	else if (t.push(e), Array.isArray(e)) for (i = 0, a = e.length; i < a; i += 1) Sa(e[i], t, n);
	else for (r = Object.keys(e), i = 0, a = r.length; i < a; i += 1) Sa(e[r[i]], t, n);
}
function Ca(e, t) {
	t ||= {};
	var n = new Ki(t);
	n.noRefs || xa(e, n);
	var r = e;
	return n.replacer && (r = n.replacer.call({ "": r }, "", r)), q(n, 0, r, !0, !0) ? n.dump + "\n" : "";
}
var wa = { dump: Ca }, Ta = fi.load;
fi.loadAll, wa.dump;
//#endregion
//#region node_modules/.pnpm/valibot@1.3.1_typescript@6.0.3/node_modules/valibot/dist/index.mjs
var Ea;
/* @__NO_SIDE_EFFECTS__ */
function Da(e) {
	return {
		lang: e?.lang ?? Ea?.lang,
		message: e?.message,
		abortEarly: e?.abortEarly ?? Ea?.abortEarly,
		abortPipeEarly: e?.abortPipeEarly ?? Ea?.abortPipeEarly
	};
}
var Oa;
/* @__NO_SIDE_EFFECTS__ */
function ka(e) {
	return Oa?.get(e);
}
var Aa;
/* @__NO_SIDE_EFFECTS__ */
function ja(e) {
	return Aa?.get(e);
}
var Ma;
/* @__NO_SIDE_EFFECTS__ */
function Na(e, t) {
	return Ma?.get(e)?.get(t);
}
/* @__NO_SIDE_EFFECTS__ */
function Pa(e) {
	let t = typeof e;
	return t === "string" ? `"${e}"` : t === "number" || t === "bigint" || t === "boolean" ? `${e}` : t === "object" || t === "function" ? (e && Object.getPrototypeOf(e)?.constructor?.name) ?? "null" : t;
}
function J(e, t, n, r, i) {
	let a = i && "input" in i ? i.input : n.value, o = i?.expected ?? e.expects ?? null, s = i?.received ?? /* @__PURE__ */ Pa(a), c = {
		kind: e.kind,
		type: e.type,
		input: a,
		expected: o,
		received: s,
		message: `Invalid ${t}: ${o ? `Expected ${o} but r` : "R"}eceived ${s}`,
		requirement: e.requirement,
		path: i?.path,
		issues: i?.issues,
		lang: r.lang,
		abortEarly: r.abortEarly,
		abortPipeEarly: r.abortPipeEarly
	}, l = e.kind === "schema", u = i?.message ?? e.message ?? /* @__PURE__ */ Na(e.reference, c.lang) ?? (l ? /* @__PURE__ */ ja(c.lang) : null) ?? r.message ?? /* @__PURE__ */ ka(c.lang);
	u !== void 0 && (c.message = typeof u == "function" ? u(c) : u), l && (n.typed = !1), n.issues ? n.issues.push(c) : n.issues = [c];
}
/* @__NO_SIDE_EFFECTS__ */
function Y(e) {
	return {
		version: 1,
		vendor: "valibot",
		validate(t) {
			return e["~run"]({ value: t }, /* @__PURE__ */ Da());
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Fa(e, t) {
	let n = [...new Set(e)];
	return n.length > 1 ? `(${n.join(` ${t} `)})` : n[0] ?? "never";
}
/* @__NO_SIDE_EFFECTS__ */
function Ia(e, t, n) {
	return typeof e.fallback == "function" ? e.fallback(t, n) : e.fallback;
}
/* @__NO_SIDE_EFFECTS__ */
function La(e, t, n) {
	return typeof e.default == "function" ? e.default(t, n) : e.default;
}
/* @__NO_SIDE_EFFECTS__ */
function X(e, t) {
	return {
		kind: "schema",
		type: "array",
		reference: X,
		expects: "Array",
		async: !1,
		item: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (Array.isArray(n)) {
				e.typed = !0, e.value = [];
				for (let r = 0; r < n.length; r++) {
					let i = n[r], a = this.item["~run"]({ value: i }, t);
					if (a.issues) {
						let o = {
							type: "array",
							origin: "value",
							input: n,
							key: r,
							value: i
						};
						for (let t of a.issues) t.path ? t.path.unshift(o) : t.path = [o], e.issues?.push(t);
						if (e.issues ||= a.issues, t.abortEarly) {
							e.typed = !1;
							break;
						}
					}
					a.typed || (e.typed = !1), e.value.push(a.value);
				}
			} else J(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Ra(e) {
	return {
		kind: "schema",
		type: "boolean",
		reference: Ra,
		expects: "boolean",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return typeof e.value == "boolean" ? e.typed = !0 : J(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function za(e, t) {
	return {
		kind: "schema",
		type: "literal",
		reference: za,
		expects: /* @__PURE__ */ Pa(e),
		async: !1,
		literal: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return e.value === this.literal ? e.typed = !0 : J(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Ba(e) {
	return {
		kind: "schema",
		type: "number",
		reference: Ba,
		expects: "number",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return typeof e.value == "number" && !isNaN(e.value) ? e.typed = !0 : J(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Z(e, t) {
	return {
		kind: "schema",
		type: "object",
		reference: Z,
		expects: "Object",
		async: !1,
		entries: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (n && typeof n == "object") {
				e.typed = !0, e.value = {};
				for (let r in this.entries) {
					let i = this.entries[r];
					if (r in n || (i.type === "exact_optional" || i.type === "optional" || i.type === "nullish") && i.default !== void 0) {
						let a = r in n ? n[r] : /* @__PURE__ */ La(i), o = i["~run"]({ value: a }, t);
						if (o.issues) {
							let i = {
								type: "object",
								origin: "value",
								input: n,
								key: r,
								value: a
							};
							for (let t of o.issues) t.path ? t.path.unshift(i) : t.path = [i], e.issues?.push(t);
							if (e.issues ||= o.issues, t.abortEarly) {
								e.typed = !1;
								break;
							}
						}
						o.typed || (e.typed = !1), e.value[r] = o.value;
					} else if (i.fallback !== void 0) e.value[r] = /* @__PURE__ */ Ia(i);
					else if (i.type !== "exact_optional" && i.type !== "optional" && i.type !== "nullish" && (J(this, "key", e, t, {
						input: void 0,
						expected: `"${r}"`,
						path: [{
							type: "object",
							origin: "key",
							input: n,
							key: r,
							value: n[r]
						}]
					}), t.abortEarly)) break;
				}
			} else J(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Q(e, t) {
	return {
		kind: "schema",
		type: "optional",
		reference: Q,
		expects: `(${e.expects} | undefined)`,
		async: !1,
		wrapped: e,
		default: t,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return e.value === void 0 && (this.default !== void 0 && (e.value = /* @__PURE__ */ La(this, e, t)), e.value === void 0) ? (e.typed = !0, e) : this.wrapped["~run"](e, t);
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function $(e) {
	return {
		kind: "schema",
		type: "string",
		reference: $,
		expects: "string",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			return typeof e.value == "string" ? e.typed = !0 : J(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Va(e, t, n) {
	return {
		kind: "schema",
		type: "variant",
		reference: Va,
		expects: "Object",
		async: !1,
		key: e,
		options: t,
		message: n,
		get "~standard"() {
			return /* @__PURE__ */ Y(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (n && typeof n == "object") {
				let r, i = 0, a = this.key, o = [], s = (e, c) => {
					for (let l of e.options) {
						if (l.type === "variant") s(l, new Set(c).add(l.key));
						else {
							let e = !0, s = 0;
							for (let t of c) {
								let r = l.entries[t];
								if (t in n ? r["~run"]({
									typed: !1,
									value: n[t]
								}, { abortEarly: !0 }).issues : r.type !== "exact_optional" && r.type !== "optional" && r.type !== "nullish") {
									e = !1, a !== t && (i < s || i === s && t in n && !(a in n)) && (i = s, a = t, o = []), a === t && o.push(l.entries[t].expects);
									break;
								}
								s++;
							}
							if (e) {
								let e = l["~run"]({ value: n }, t);
								(!r || !r.typed && e.typed) && (r = e);
							}
						}
						if (r && !r.issues) break;
					}
				};
				if (s(this, new Set([this.key])), r) return r;
				J(this, "type", e, t, {
					input: n[a],
					expected: /* @__PURE__ */ Fa(o, "|"),
					path: [{
						type: "object",
						origin: "value",
						input: n,
						key: a,
						value: n[a]
					}]
				});
			} else J(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Ha(e, t, n) {
	let r = e["~run"]({ value: t }, /* @__PURE__ */ Da(n));
	return {
		typed: r.typed,
		success: !r.issues,
		output: r.value,
		issues: r.issues
	};
}
//#endregion
//#region src/helper/issue-tyepe.ts
var Ua = /* @__PURE__ */ Z({ required: /* @__PURE__ */ Q(/* @__PURE__ */ Ra()) }), Wa = /* @__PURE__ */ Z({
	name: /* @__PURE__ */ $(),
	description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
	title: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
	labels: /* @__PURE__ */ Q(/* @__PURE__ */ X(/* @__PURE__ */ $())),
	projects: /* @__PURE__ */ Q(/* @__PURE__ */ X(/* @__PURE__ */ $())),
	assignees: /* @__PURE__ */ Q(/* @__PURE__ */ X(/* @__PURE__ */ $())),
	type: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
	body: /* @__PURE__ */ X(/* @__PURE__ */ Va("type", [
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ za("markdown"),
			attributes: /* @__PURE__ */ Z({ value: /* @__PURE__ */ $() })
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ za("input"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				placeholder: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				value: /* @__PURE__ */ Q(/* @__PURE__ */ $())
			}),
			validations: /* @__PURE__ */ Q(Ua)
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ za("textarea"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				placeholder: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				value: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				render: /* @__PURE__ */ Q(/* @__PURE__ */ $())
			}),
			validations: /* @__PURE__ */ Q(Ua)
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ za("dropdown"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				multiple: /* @__PURE__ */ Q(/* @__PURE__ */ Ra()),
				options: /* @__PURE__ */ X(/* @__PURE__ */ $()),
				default: /* @__PURE__ */ Q(/* @__PURE__ */ Ba())
			}),
			validations: /* @__PURE__ */ Q(Ua)
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ za("checkboxes"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				options: /* @__PURE__ */ X(/* @__PURE__ */ Z({
					label: /* @__PURE__ */ $(),
					required: /* @__PURE__ */ Q(/* @__PURE__ */ Ra())
				}))
			}),
			validations: /* @__PURE__ */ Q(Ua)
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ za("upload"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $())
			}),
			validations: /* @__PURE__ */ Q(Ua)
		})
	]))
});
//#endregion
//#region src/helper/yml.ts
function Ga(e) {
	let t = f(process.cwd(), ".github", "ISSUE_TEMPLATE");
	return e.map((e) => {
		let n = /* @__PURE__ */ Ha(Wa, Ta(s(f(t, e), "utf8")));
		if (!n.success) throw Error(`Invalid issue template: ${e}`);
		return {
			fileName: e,
			name: n.output.name,
			contents: n.output
		};
	});
}
//#endregion
//#region src/command/create.ts
async function Ka(e) {
	return await Gt({
		message: "Select an issue template",
		options: e.map((e) => ({
			title: e.name,
			value: e.fileName
		})),
		cancelMessage: "No template selected. Canceled.",
		errorMessage: "Failed to select an issue template"
	});
}
//#endregion
//#region src/helper/checkboxes-parser.ts
function qa({ items: e, selectedItems: t, title: n }) {
	let r = new Set(t);
	return {
		title: n,
		contents: `${e.map((e) => `- [${r.has(e) ? "x" : " "}] ${e}`).join("\n")}\n`
	};
}
//#endregion
//#region src/helper/textarea-editor.ts
var Ja = "<!-- gh-issue:", Ya = "-->";
function Xa() {
	return f(oe(), `.gh-issue-${ae()}.md`);
}
function Za({ title: e, description: t, initialValue: n }) {
	let r = [
		e ? `${Ja} Title: ${e} ${Ya}` : `${Ja} Title: Enter content below ${Ya}`,
		t ? `${Ja} Details: ${t} ${Ya}` : `${Ja} Details: The guide comments at the top are not included ${Ya}`,
		`${Ja} Write your content below this line. ${Ya}\n`,
		""
	];
	return n.length === 0 ? r.join("\n") : `${r.join("\n")}${n}`;
}
function Qa(e) {
	return e.replace(/^(?:<!-- gh-issue:[\s\S]*?-->\s*)+/, "").trim();
}
function $a(e) {
	let t = ne("vim", [e], { stdio: "inherit" });
	if (t.error) throw t.error;
	if (t.status !== 0) throw Error(`vim exited with status ${t.status ?? "unknown"}`);
}
async function eo({ initialValue: e = "", title: t, description: n }) {
	let { checkPromiseReturn: o, checkPromiseVoid: s, createNg: c, createOk: l, checkResultVoid: u } = w, d = Xa();
	try {
		let i = await s({
			fn: async () => {
				await a(d, Za({
					title: t,
					description: n,
					initialValue: e
				}), { flag: "wx" });
			},
			err: (e) => c(e)
		});
		if (i.isErr) return i;
		let f = u({
			fn: () => $a(d),
			err: (e) => c(e)
		});
		if (f.isErr) return f;
		let p = await o({
			fn: async () => await r(d, "utf8"),
			err: (e) => c(e)
		});
		return p.isErr ? p : l(Qa(p.value));
	} finally {
		await i(d).catch(() => void 0);
	}
}
//#endregion
//#region src/helper/textarea-options.ts
function to(e) {
	let { createNone: t, createSome: n } = de;
	return e?.vim === !0 ? n("vim") : e?.vim === !1 || e?.noVim === !0 ? n("direct") : t();
}
//#endregion
//#region src/helper/create-contents.ts
async function no(e, t) {
	let { createOk: n, createNg: r } = w, { createNone: i, createSome: a } = de;
	switch (e.type) {
		case "markdown": return N.message((0, F.blue)(e.attributes.value)), n(i());
		case "input": {
			N.message(`${(0, F.bold)((0, F.blue)(e.attributes.label))} ${e.validations?.required ? (0, F.red)("*") : ""}\n\n`), N.message((0, F.blue)(e.attributes.description || "No description") + "\n");
			let t = await Ut({
				message: e.attributes.label,
				placeholder: e.attributes.placeholder
			});
			return t.isErr ? r(t.err) : e.validations?.required && t.value.trim().length === 0 ? r(/* @__PURE__ */ Error("This field is required")) : n(a({
				title: e.attributes.label,
				contents: t.value
			}));
		}
		case "textarea": {
			N.message(`${(0, F.bold)((0, F.blue)(e.attributes.label))} ${e.validations?.required ? (0, F.red)("*") : ""}\n\n`), N.message((0, F.blue)(e.attributes.description || "No description") + "\n");
			let i = e.validations?.required === !0, o = to(t), s;
			if (o.isNone) {
				let t = [{
					title: "Open in vim",
					value: "vim",
					hint: "Edit in a temporary hidden file",
					selected: !0
				}, {
					title: "Enter directly",
					value: "direct",
					hint: "Use the current multiline prompt"
				}];
				i || t.push({
					title: "Do not enter content",
					value: "skip",
					hint: "Store an empty string for this field"
				});
				let n = await Gt({
					message: `${e.attributes.label}\nChoose how to enter the textarea content`,
					options: t
				});
				if (n.isErr) return r(n.err);
				s = n.value;
			} else if (i) s = o.value;
			else {
				let t = await Gt({
					message: `${e.attributes.label}\nChoose whether to edit this textarea content`,
					options: [{
						title: o.value === "vim" ? "Edit in vim" : "Enter directly",
						value: "edit",
						selected: !0
					}, {
						title: "Do not enter content",
						value: "skip",
						hint: "Store an empty string for this field"
					}]
				});
				if (t.isErr) return r(t.err);
				s = t.value === "skip" ? "skip" : o.value;
			}
			let c = s === "skip" ? w.createOk("") : s === "vim" ? await eo({
				initialValue: e.attributes.value,
				title: e.attributes.label,
				description: e.attributes.description
			}) : await Wt({
				message: e.attributes.label,
				placeholder: e.attributes.placeholder
			});
			return c.isErr ? r(c.err) : i && c.value.trim().length === 0 ? r(/* @__PURE__ */ Error("This field is required")) : n(a({
				title: e.attributes.label,
				contents: c.value
			}));
		}
		case "checkboxes": {
			N.message(`${(0, F.bold)((0, F.blue)(e.attributes.label))} ${e.validations?.required ? (0, F.red)("*") : ""}\n\n`), N.message((0, F.blue)(e.attributes.description || "No description") + "\n");
			let t = e.attributes.options.map((e) => ({
				title: e.label,
				value: e.label,
				selected: e.required || !1
			})), i = await Kt({
				message: e.attributes.label,
				options: t
			});
			if (i.isErr) return r(i.err);
			if (e.validations?.required && i.value.length === 0) return r(/* @__PURE__ */ Error("At least one option must be selected"));
			for (let t of e.attributes.options) if (t.required && !i.value.includes(t.label)) return r(/* @__PURE__ */ Error(`The option "${t.label}" is required`));
			return n(a(qa({
				items: e.attributes.options.map((e) => e.label),
				selectedItems: i.value,
				title: e.attributes.label
			})));
		}
		case "dropdown": {
			N.message(`${(0, F.bold)((0, F.blue)(e.attributes.label))} ${e.validations?.required ? (0, F.red)("*") : ""}\n\n`), N.message((0, F.blue)(e.attributes.description || "No description") + "\n");
			let t = e.attributes.options.map((t, n) => ({
				title: t,
				value: t,
				selected: e.attributes.default === n
			})), i = await Gt({
				message: e.attributes.label,
				options: t
			});
			return i.isErr ? r(i.err) : e.validations?.required && i.value === "" ? r(/* @__PURE__ */ Error("This field is required")) : n(a({
				title: e.attributes.label,
				contents: i.value
			}));
		}
		case "upload": return N.message(`${(0, F.bold)((0, F.blue)(e.attributes.label))} ${e.validations?.required ? (0, F.red)("*") : ""}\n\n`), N.message((0, F.blue)(e.attributes.description || "No description") + "\n"), N.message((0, F.blue)("File upload is not supported in this version") + "\n"), n(i());
		default: return r(/* @__PURE__ */ Error(`Unsupported content type: ${e.type}`));
	}
}
//#endregion
//#region src/helper/write-issue-markdown.ts
var ro = "title", io = "assign", ao = [
	"ancient",
	"blue",
	"brave",
	"calm",
	"cool",
	"fancy",
	"gentle",
	"golden",
	"quiet",
	"swift"
], oo = [
	"cloud",
	"field",
	"forest",
	"moon",
	"ocean",
	"river",
	"shadow",
	"smoke",
	"stone",
	"wind"
];
function so(e) {
	let { createNg: t, createOk: n } = w, r = e.find((e) => e.title === ro), i = e.find((e) => e.title === io);
	if (!r) return t(/* @__PURE__ */ Error("Title content is required"));
	let a = e.filter((e) => e.title !== ro && e.title !== io), o = ["---", `title: ${r.contents}`];
	i && i.contents.trim().length > 0 && o.push(`assign: ${i.contents}`), o.push("---", "");
	for (let e of a) o.push(`## ${e.title}`, "", e.contents, "");
	return n(o.join("\n"));
}
function co() {
	return `${ao[ie(0, ao.length)]}-${oo[ie(0, oo.length)]}-${ie(1e3, 1e4)}.md`;
}
async function lo(e, t = process.cwd()) {
	let { checkPromiseReturn: r, createNg: i, createOk: o } = w, { optionConversion: s } = de, c = f(t, ".gh-issue"), l = so(e);
	if (l.isErr) return l;
	let u = await r({
		fn: async () => s(await n(c, { recursive: !0 })),
		err: (e) => i(e)
	});
	if (u.isErr) return u;
	for (let e = 0; e < 10; e++) {
		let e = f(c, co()), t = await r({
			fn: async () => s(await a(e, l.value, { flag: "wx" })),
			err: (e) => i(e)
		});
		if (t.isOk) return o(e);
		if (!(t.err instanceof Error && "code" in t.err && t.err.code === "EEXIST")) return t;
	}
	return i(/* @__PURE__ */ Error("Failed to generate a unique markdown file name"));
}
//#endregion
//#region src/action/create.ts
function uo() {
	let { checkResultReturn: e, createNg: t, createOk: n } = w, r = e({
		fn: () => te("gh", [
			"repo",
			"view",
			"--json",
			"nameWithOwner",
			"--jq",
			".nameWithOwner"
		], {
			encoding: "utf8",
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		}).trim(),
		err: (e) => t(/* @__PURE__ */ Error(`error:${e}`))
	});
	return r.isErr ? r : r.value.length === 0 ? n([]) : e({
		fn: () => te("gh", [
			"api",
			`repos/${r.value}/assignees`,
			"--jq",
			".[].login"
		], {
			encoding: "utf8",
			stdio: [
				"ignore",
				"pipe",
				"pipe"
			]
		}).trim().split("\n").filter(Boolean),
		err: (e) => t(`error: ${e}`)
	});
}
async function fo(e = {}) {
	let { checkResultReturn: t, createNg: n } = w, { optionConversion: r } = de;
	o(f(process.cwd(), ".gh-issue")) || (N.error(".gh-issue directory does not exist. Please run `gh-issue init` first."), process.exit(1));
	let i = en(), a = [];
	i.isErr && (N.error(`Error: ${i.err.message}`), process.exit(1));
	let s = t({
		fn: () => Ga(i.value),
		err: (e) => n(e)
	});
	s.isErr && (N.error(`Error: ${s.err.message}`), process.exit(1));
	let c = await Ka(s.value.map((e) => ({
		name: e.name,
		fileName: e.fileName
	})));
	c.isErr && (N.error(`Error: ${c.err.message}`), process.exit(1));
	let l = r(s.value.find((e) => e.fileName === c.value));
	l.isNone && (N.error("Error: Selected template not found"), process.exit(1)), N.message(`${(0, F.bold)((0, F.green)(l.value.name))}\n`), N.message(l.value.contents.description ? `${l.value.contents.description}\n` : "No contents provided.\n");
	let u = await Ut({
		message: "Enter the issue title",
		placeholder: "Issue title"
	});
	u.isErr && (N.error(`Error: ${u.err.message}`), process.exit(1)), a.push({
		title: "title",
		contents: u.value
	});
	for (let t of l.value.contents.body) {
		let n = await no(t, e);
		n.isErr && (N.error(`Error: ${n.err.message}`), process.exit(1)), n.value.isSome && a.push(n.value.value);
	}
	let d = uo();
	if (d.isErr) throw d.err;
	if (d.value.length > 0) {
		let e = await Kt({
			message: "Select assignees",
			required: !1,
			options: d.value.map((e) => ({
				title: e,
				value: e
			}))
		});
		e.isErr && (N.error(`Error: ${e.err.message}`), process.exit(1)), e.value.length > 0 && a.push({
			title: "assign",
			contents: e.value.join(",")
		});
	}
	let p = await lo(a);
	p.isErr && (N.error(`Error: ${p.err.message}`), process.exit(1)), N.success(`Saved issue draft: ${p.value}`);
}
//#endregion
//#region src/helper/draft-issue.ts
var po = ".gh-issue", mo = `${po}/README.md`;
async function ho(e = process.cwd()) {
	let { checkPromiseReturn: t, createNg: n, createOk: r } = se, i = await t({
		fn: () => h(`${po}/**/*.md`, {
			cwd: e,
			onlyFiles: !0,
			dot: !0
		}),
		err: (e) => n(e)
	});
	return i.isErr ? i : r(i.value.filter((e) => e !== mo));
}
function go(e, t = process.cwd()) {
	let n = s(f(t, e), "utf8").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!n) throw Error(`Missing front matter in ${e}`);
	let [, r, i] = n, a = r.match(/^title:\s*(.+)$/m), o = r.match(/^assign:\s*(.+)$/m);
	if (!a) throw Error(`Missing title in front matter: ${e}`);
	return {
		filePath: e,
		title: a[1].trim(),
		body: i.trim(),
		assignees: o?.[1]?.split(",").map((e) => e.trim()).filter(Boolean)
	};
}
//#endregion
//#region src/command/send.ts
async function _o(e) {
	return await Kt({
		message: "Select issue drafts to send",
		options: e.map((e) => ({
			title: e,
			value: e
		})),
		cancelMessage: "No issue drafts selected. Canceled.",
		errorMessage: "Failed to select issue drafts"
	});
}
//#endregion
//#region src/action/send.ts
function vo(e) {
	return te("gh", e, {
		encoding: "utf8",
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		]
	}).trim();
}
function yo() {
	vo(["auth", "status"]);
}
function bo() {
	return vo([
		"repo",
		"view",
		"--json",
		"nameWithOwner",
		"--jq",
		".nameWithOwner"
	]);
}
function xo(e) {
	let t = [
		"issue",
		"create",
		"--title",
		e.title,
		"--body",
		e.body
	];
	return e.assignees && e.assignees.length > 0 && t.push("--assignee", e.assignees.join(",")), vo(t);
}
async function So(e = {}) {
	let t = e.all || process.env.npm_config_all === "true", { checkResultReturn: n, checkResultVoid: r, createNg: i, createOk: a } = w, o = await ho();
	o.isErr && (N.error(`Error: ${o.err.message}`), process.exit(1)), o.value.length === 0 && (N.error("No issue drafts found in .gh-issue."), process.exit(1));
	let s = t ? a(o.value) : await _o(o.value);
	s.isErr && (N.error(`Error: ${s.err.message}`), process.exit(1));
	let c = r({
		fn: () => yo(),
		err: (e) => i(/* @__PURE__ */ Error(`gh authentication check failed. Please run \`gh auth login\`: ${e instanceof Error ? e.message : "Unknown error"}`))
	});
	c.isErr && (N.error(`Error: ${c.err.message}`), process.exit(1));
	let u = n({
		fn: () => bo(),
		err: (e) => i(/* @__PURE__ */ Error(`Failed to resolve the current GitHub repository. Please check the git remote and gh repository access: ${e instanceof Error ? e.message : "Unknown error"}`))
	});
	u.isErr && (N.error(`Error: ${u.err.message}`), process.exit(1));
	let d = It();
	d.start(`${(0, F.bold)((0, F.green)("Repository"))}\n${u.value}\n`);
	for (let e of s.value) {
		d.message(`Sending ${e}...`);
		let t = go(e), r = n({
			fn: () => xo(t),
			err: (t) => i(/* @__PURE__ */ Error(`Failed to create issue for ${e} with gh CLI: ${t instanceof Error ? t.message : "Unknown error"}`))
		});
		r.isErr && (d.cancel(`Failed to send issue draft: ${e}\nError: ${r.err.message}`), process.exit(1)), l(f(process.cwd(), e)), d.message(`Sent ${e}`), N.success(`${(0, F.bold)((0, F.green)("Issue created successfully"))}\n${r.value}\n`), N.success(`${(0, F.bold)((0, F.green)("Removed draft"))}\n${e}\n`);
	}
	d.stop("All selected drafts were sent.");
}
//#endregion
//#region src/action/add.ts
async function Co() {
	let e = await Yt(), t = It();
	e.isErr && (N.error(`Error: ${e.err.message}`), process.exit(1)), e.value.length === 0 && (P("No template types selected. Canceled."), process.exit(0));
	let r = await Xt();
	r.isErr && (N.error(`Error: ${r.err.message}`), process.exit(1)), r.value.length === 0 && (P("No languages selected. Canceled."), process.exit(0));
	let i = [];
	for (let t of r.value) for (let n of e.value) i.push({
		lang: t,
		file: `${n}_${t}.yml`
	});
	let a = C(process.cwd(), ".github"), s = C(a, "ISSUE_TEMPLATE"), c = C(re(ce(import.meta.url)), "template");
	await n(a, { recursive: !0 }), await n(s, { recursive: !0 }), t.start("Creating issue templates...");
	for (let e of i) {
		let n = C(s, e.file);
		if (o(n)) {
			t.error(`Already exists ${n}. Skipped.`);
			continue;
		}
		let r = C(c, e.lang);
		t.message(`Creating ${e.file}...`);
		let i = await ge(e.file, s, {
			parents: !1,
			cwd: r
		});
		i.isErr && (t.error(`Error: ${i.err.message}`), process.exit(1)), t.message(`Created ${n}\n`);
	}
	t.stop(), jt("All done!");
}
//#endregion
//#region src/command/core.ts
function wo() {
	let t = new e().description("Create GitHub issue templates").version("0.0.0");
	return t.command("init").description("Create bug report and feature request issue templates").action($t), t.command("create").description("Create an issue template").option("--vim", "Use Vim editor for textarea").option("--no-vim", "Use default editor for textarea").action((e) => fo(e)), t.command("send").description("Send an issue draft to GitHub").option("--all", "Send all issue drafts without selection prompt").action((e) => So(e)), t.command("add").description("Add a new issue template to .gh-issue").action(Co), t;
}
async function To(e = process.argv) {
	await wo().parseAsync(e);
}
//#endregion
//#region src/run.ts
var Eo = () => process.exit(0);
process.on("SIGTERM", Eo), process.on("SIGINT", Eo);
async function Do(e = process.argv) {
	await To(e);
}
//#endregion
//#region src/templates.ts
var Oo = "issue", ko = "en", Ao = ["bug_report", "feature_request"], jo = new Map([["bug", "bug_report"], ["feature", "feature_request"]]);
function Mo(e, t) {
	let n = Lo(e), r = t === "ja" ? `${n}_ja` : n, i = d(m(import.meta.url));
	return [f(i, "template", t, `${r}.yml`), f(i, "..", "template", t, `${r}.yml`)];
}
function No(e) {
	let t = e.findIndex((e) => e === "--lang" || e === "-l");
	return t === -1 ? ko : e[t + 1] ?? ko;
}
function Po(e, t) {
	return e[t - 1] === "--lang" || e[t - 1] === "-l";
}
async function Fo(e, t = ko) {
	let [n, i] = Mo(e, t);
	try {
		return await r(n, "utf8");
	} catch (e) {
		if (e instanceof Error && "code" in e && e.code === "ENOENT") return r(i, "utf8");
		throw e;
	}
}
function Io(e) {
	let t = e.includes("--force") || e.includes("-f"), n = No(e), r = e.find((t, n) => !t.startsWith("-") && !Po(e, n)) ?? Oo;
	return {
		force: t,
		language: n,
		name: Lo(r.endsWith(".yml") ? r.slice(0, -4) : r)
	};
}
function Lo(e) {
	return jo.get(e) ?? e;
}
async function Ro(e, t = process.cwd()) {
	let { force: n, language: r, name: i } = Io(e);
	return zo(i, n, r, t);
}
async function zo(e, t, r, i) {
	let o = f(i, ".github", "ISSUE_TEMPLATE"), s = f(o, `${e}.yml`), c = await Fo(e, r);
	return await n(o, { recursive: !0 }), await a(s, c, { flag: t ? "w" : "wx" }), s;
}
async function Bo(e, t = process.cwd()) {
	let n = e.includes("--force") || e.includes("-f"), r = No(e);
	return Promise.all(Ao.map((e) => zo(e, n, r, t)));
}
//#endregion
//#region src/index.ts
async function Vo(e = process.argv) {
	await Do(e);
}
await Vo();
//#endregion
export { Ro as createIssueTemplate, Fo as createIssueTemplateYaml, Bo as initIssueTemplates, Vo as main };

//# sourceMappingURL=index.mjs.map