#!/usr/bin/env node
import { Command as e } from "commander";
import { copyFile as t, mkdir as n, readFile as r, writeFile as i } from "node:fs/promises";
import { existsSync as a, readFileSync as o, readdirSync as s, rmSync as c } from "node:fs";
import { basename as l, dirname as u, join as d, resolve as f } from "node:path";
import { fileURLToPath as p } from "node:url";
import m from "fast-glob";
import { optionUtility as h, resultUtility as g } from "ts-shared";
import { stripVTControlCharacters as _, styleText as v } from "node:util";
import y, { stdin as b, stdout as x } from "node:process";
import * as S from "node:readline";
import ee from "node:readline";
import { ReadStream as te } from "node:tty";
import { join as ne } from "path";
import { randomInt as re } from "node:crypto";
import { execFileSync as ie } from "node:child_process";
//#region \0rolldown/runtime.js
var ae = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), oe = (e) => e, se = m.async;
async function ce(e, r, { cwd: i, rename: a = oe, parents: o = !0 }) {
	let { createNg: s, createOk: c, checkPromiseReturn: p } = g, m = typeof e == "string" ? [e] : e;
	if (m.length === 0 || r === "") return s(/* @__PURE__ */ Error("src or dest is empty"));
	let h = await p({
		fn: () => se(m, {
			cwd: i,
			dot: !0,
			absolute: !1,
			stats: !1,
			onlyFiles: !0
		}),
		err: () => s(/* @__PURE__ */ Error("Failed to glob source files"))
	});
	if (h.isErr) return h;
	let _ = i ? f(i, r) : r;
	for (let e of h.value) {
		let r = u(e), s = a(l(e)), c = i ? f(i, e) : e, p = o ? d(_, r, s) : d(_, s);
		await n(u(p), { recursive: !0 }), await t(c, p);
	}
	return c(() => {});
}
//#endregion
//#region src/shared/error.ts
function le(e, t) {
	return t instanceof Error ? /* @__PURE__ */ Error(`${e}: ${t.message}`) : /* @__PURE__ */ Error(`${e}: ${String(t)}`);
}
//#endregion
//#region node_modules/.pnpm/fast-string-truncated-width@3.0.3/node_modules/fast-string-truncated-width/dist/utils.js
var ue = (() => {
	let e = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	return (t) => {
		let n = 0;
		for (e.lastIndex = 0; e.test(t);) n += 1;
		return t.length - n;
	};
})(), de = (e) => e === 12288 || e >= 65281 && e <= 65376 || e >= 65504 && e <= 65510, fe = (e) => e === 8987 || e === 9001 || e >= 12272 && e <= 12287 || e >= 12289 && e <= 12350 || e >= 12441 && e <= 12543 || e >= 12549 && e <= 12591 || e >= 12593 && e <= 12686 || e >= 12688 && e <= 12771 || e >= 12783 && e <= 12830 || e >= 12832 && e <= 12871 || e >= 12880 && e <= 19903 || e >= 65040 && e <= 65049 || e >= 65072 && e <= 65106 || e >= 65108 && e <= 65126 || e >= 65128 && e <= 65131 || e >= 127488 && e <= 127490 || e >= 127504 && e <= 127547 || e >= 127552 && e <= 127560 || e >= 131072 && e <= 196605 || e >= 196608 && e <= 262141, pe = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]|\u001b\]8;[^;]*;.*?(?:\u0007|\u001b\u005c)/y, me = /[\x00-\x08\x0A-\x1F\x7F-\x9F]{1,1000}/y, he = /(?:(?![\uFF61-\uFF9F\uFF00-\uFFEF])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Tangut}]){1,1000}/uy, ge = /\t{1,1000}/y, _e = /[\u{1F1E6}-\u{1F1FF}]{2}|\u{1F3F4}[\u{E0061}-\u{E007A}]{2}[\u{E0030}-\u{E0039}\u{E0061}-\u{E007A}]{1,3}\u{E007F}|(?:\p{Emoji}\uFE0F\u20E3?|\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation})(?:\u200D(?:\p{Emoji_Modifier_Base}\p{Emoji_Modifier}?|\p{Emoji_Presentation}|\p{Emoji}\uFE0F\u20E3?))*/uy, ve = /(?:[\x20-\x7E\xA0-\xFF](?!\uFE0F)){1,1000}/y, ye = /\p{M}+/gu, be = {
	limit: Infinity,
	ellipsis: ""
}, xe = (e, t = {}, n = {}) => {
	let r = t.limit ?? Infinity, i = t.ellipsis ?? "", a = t?.ellipsisWidth ?? (i ? xe(i, be, n).width : 0), o = n.controlWidth ?? 0, s = n.tabWidth ?? 8, c = n.emojiWidth ?? 2, l = n.regularWidth ?? 1, u = n.wideWidth ?? 2, d = [
		[ve, l],
		[pe, 0],
		[me, o],
		[ge, s],
		[_e, c],
		[he, u]
	], f = 0, p = 0, m = e.length, h = 0, g = !1, _ = m, v = Math.max(0, r - a), y = 0, b = 0, x = 0, S = 0;
	outer: for (;;) {
		if (b > y || p >= m && p > f) {
			let t = e.slice(y, b) || e.slice(f, p);
			h = 0;
			for (let e of t.replaceAll(ye, "")) {
				let t = e.codePointAt(0) || 0;
				if (S = de(t) ? 2 : fe(t) ? u : l, x + S > v && (_ = Math.min(_, Math.max(y, f) + h)), x + S > r) {
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
				if (h = n === he ? ue(e.slice(p, n.lastIndex)) : n === _e ? 1 : n.lastIndex - p, S = h * i, x + S > v && (_ = Math.min(_, p + Math.floor((v - x) / i))), x + S > r) {
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
}, Se = {
	limit: Infinity,
	ellipsis: "",
	ellipsisWidth: 0
}, C = (e, t = {}) => xe(e, Se, t).width, Ce = "\x1B", we = "", Te = 39, Ee = "\x07", De = "[", Oe = "]", ke = "m", Ae = `${Oe}8;;`, je = RegExp(`(?:\\${De}(?<code>\\d+)m|\\${Ae}(?<uri>.*)${Ee})`, "y"), Me = (e) => {
	if (e >= 30 && e <= 37 || e >= 90 && e <= 97) return 39;
	if (e >= 40 && e <= 47 || e >= 100 && e <= 107) return 49;
	if (e === 1 || e === 2) return 22;
	if (e === 3) return 23;
	if (e === 4) return 24;
	if (e === 7) return 27;
	if (e === 8) return 28;
	if (e === 9) return 29;
	if (e === 0) return 0;
}, Ne = (e) => `${Ce}${De}${e}${ke}`, Pe = (e) => `${Ce}${Ae}${e}${Ee}`, Fe = (e, t, n) => {
	let r = t[Symbol.iterator](), i = !1, a = !1, o = e.at(-1), s = o === void 0 ? 0 : C(o), c = r.next(), l = r.next(), u = 0;
	for (; !c.done;) {
		let o = c.value, d = C(o);
		s + d <= n ? e[e.length - 1] += o : (e.push(o), s = 0), (o === Ce || o === we) && (i = !0, a = t.startsWith(Ae, u + 1)), i ? a ? o === Ee && (i = !1, a = !1) : o === ke && (i = !1) : (s += d, s === n && !l.done && (e.push(""), s = 0)), c = l, l = r.next(), u += o.length;
	}
	o = e.at(-1), !s && o !== void 0 && o.length && e.length > 1 && (e[e.length - 2] += e.pop());
}, Ie = (e) => {
	let t = e.split(" "), n = t.length;
	for (; n && !C(t[n - 1]);) n--;
	return n === t.length ? e : t.slice(0, n).join(" ") + t.slice(n).join("");
}, Le = (e, t, n = {}) => {
	if (n.trim !== !1 && e.trim() === "") return "";
	let r = "", i, a, o = e.split(" "), s = [""], c = 0;
	for (let e = 0; e < o.length; e++) {
		let r = o[e];
		if (n.trim !== !1) {
			let e = s.at(-1) ?? "", t = e.trimStart();
			e.length !== t.length && (s[s.length - 1] = t, c = C(t));
		}
		e !== 0 && (c >= t && (n.wordWrap === !1 || n.trim === !1) && (s.push(""), c = 0), (c || n.trim === !1) && (s[s.length - 1] += " ", c++));
		let i = C(r);
		if (n.hard && i > t) {
			let e = t - c, n = 1 + Math.floor((i - e - 1) / t);
			Math.floor((i - 1) / t) < n && s.push(""), Fe(s, r, t), c = C(s.at(-1) ?? "");
			continue;
		}
		if (c + i > t && c && i) {
			if (n.wordWrap === !1 && c < t) {
				Fe(s, r, t), c = C(s.at(-1) ?? "");
				continue;
			}
			s.push(""), c = 0;
		}
		if (c + i > t && n.wordWrap === !1) {
			Fe(s, r, t), c = C(s.at(-1) ?? "");
			continue;
		}
		s[s.length - 1] += r, c += i;
	}
	n.trim !== !1 && (s = s.map((e) => Ie(e)));
	let l = s.join("\n"), u = !1;
	for (let e = 0; e < l.length; e++) {
		let t = l[e];
		if (r += t, u) u = !1;
		else if (u = t >= "\ud800" && t <= "\udbff", u) continue;
		if (t === Ce || t === we) {
			je.lastIndex = e + 1;
			let t = je.exec(l)?.groups;
			if (t?.code !== void 0) {
				let e = Number.parseFloat(t.code);
				i = e === Te ? void 0 : e;
			} else t?.uri !== void 0 && (a = t.uri.length === 0 ? void 0 : t.uri);
		}
		if (l[e + 1] === "\n") {
			a && (r += Pe(""));
			let e = i ? Me(i) : void 0;
			i && e && (r += Ne(e));
		} else t === "\n" && (i && Me(i) && (r += Ne(i)), a && (r += Pe(a)));
	}
	return r;
}, Re = /\r?\n/;
function w(e, t, n) {
	return String(e).normalize().split(Re).map((e) => Le(e, t, n)).join("\n");
}
//#endregion
//#region node_modules/.pnpm/@clack+core@1.3.0/node_modules/@clack/core/dist/index.mjs
var T = (/* @__PURE__ */ ae(((e, t) => {
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
function E(e, t, n) {
	if (!n.some((e) => !e.disabled)) return e;
	let r = e + t, i = Math.max(n.length - 1, 0), a = r < 0 ? i : r > i ? 0 : r;
	return n[a].disabled ? E(a, t < 0 ? -1 : 1, n) : a;
}
function ze(e, t, n, r) {
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
var D = {
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
function Be(e, t) {
	if (typeof e == "string") return D.aliases.get(e) === t;
	for (let n of e) if (n !== void 0 && Be(n, t)) return !0;
	return !1;
}
function Ve(e, t) {
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
var He = globalThis.process.platform.startsWith("win"), Ue = Symbol("clack:cancel");
function We(e) {
	return e === Ue;
}
function Ge(e, t) {
	let n = e;
	n.isTTY && n.setRawMode(t);
}
function Ke({ input: e = b, output: t = x, overwrite: n = !0, hideCursor: r = !0 } = {}) {
	let i = S.createInterface({
		input: e,
		output: t,
		prompt: "",
		tabSize: 1
	});
	S.emitKeypressEvents(e, i), e instanceof te && e.isTTY && e.setRawMode(!0);
	let a = (i, { name: o, sequence: s }) => {
		if (Be([
			String(i),
			o,
			s
		], "cancel")) {
			r && t.write(T.cursor.show), process.exit(0);
			return;
		}
		if (!n) return;
		let c = o === "return" ? 0 : -1, l = o === "return" ? -1 : 0;
		S.moveCursor(t, c, l, () => {
			S.clearLine(t, 1, () => {
				e.once("keypress", a);
			});
		});
	};
	return r && t.write(T.cursor.hide), e.once("keypress", a), () => {
		e.off("keypress", a), r && t.write(T.cursor.show), e instanceof te && e.isTTY && !He && e.setRawMode(!1), i.terminal = !1, i.close();
	};
}
var qe = (e) => "columns" in e && typeof e.columns == "number" ? e.columns : 80, Je = (e) => "rows" in e && typeof e.rows == "number" ? e.rows : 20;
function O(e, t, n, r = n, i) {
	return w(t, qe(e ?? x) - n.length, {
		hard: !0,
		trim: !1
	}).split("\n").map((e, t) => {
		let a = i ? i(e, t) : e;
		return `${t === 0 ? r : n}${a}`;
	}).join("\n");
}
var Ye = class {
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
		let { input: n = b, output: r = x, render: i, signal: a, ...o } = e;
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
				if (this._abortSignal.aborted) return this.state = "cancel", this.close(), e(Ue);
				this._abortSignal.addEventListener("abort", () => {
					this.state = "cancel", this.close();
				}, { once: !0 });
			}
			this.rl = ee.createInterface({
				input: this.input,
				tabSize: 2,
				prompt: "",
				escapeCodeTimeout: 50,
				terminal: !0
			}), this.rl.prompt(), this.opts.initialUserInput !== void 0 && this._setUserInput(this.opts.initialUserInput, !0), this.input.on("keypress", this.onKeypress), Ge(this.input, !0), this.output.on("resize", this.render), this.render(), this.once("submit", () => {
				this.output.write(T.cursor.show), this.output.off("resize", this.render), Ge(this.input, !1), e(this.value);
			}), this.once("cancel", () => {
				this.output.write(T.cursor.show), this.output.off("resize", this.render), Ge(this.input, !1), e(Ue);
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
		}), this._cursor = this.rl?.cursor ?? 0, this._setUserInput(this.rl?.line)), this.state === "error" && (this.state = "active"), t?.name && (!this._track && D.aliases.has(t.name) && this.emit("cursor", D.aliases.get(t.name)), D.actions.has(t.name) && this.emit("cursor", t.name)), e && (e.toLowerCase() === "y" || e.toLowerCase() === "n") && this.emit("confirm", e.toLowerCase() === "y"), this.emit("key", e?.toLowerCase(), t), t?.name === "return" && this._shouldSubmit(e, t)) {
			if (this.opts.validate) {
				let e = this.opts.validate(this.value);
				e && (this.error = e instanceof Error ? e.message : e, this.state = "error", this.rl?.write(this.userInput));
			}
			this.state !== "error" && (this.state = "submit");
		}
		Be([
			e,
			t?.name,
			t?.sequence
		], "cancel") && (this.state = "cancel"), (this.state === "submit" || this.state === "cancel") && this.emit("finalize"), this.render(), (this.state === "submit" || this.state === "cancel") && this.close();
	}
	close() {
		this.input.unpipe(), this.input.removeListener("keypress", this.onKeypress), this.output.write("\n"), Ge(this.input, !1), this.rl?.close(), this.rl = void 0, this.emit(`${this.state}`, this.value), this.unsubscribe();
	}
	restoreCursor() {
		let e = w(this._prevFrame, process.stdout.columns, {
			hard: !0,
			trim: !1
		}).split("\n").length - 1;
		this.output.write(T.cursor.move(-999, e * -1));
	}
	render() {
		let e = w(this._render(this) ?? "", process.stdout.columns, {
			hard: !0,
			trim: !1
		});
		if (e !== this._prevFrame) {
			if (this.state === "initial") this.output.write(T.cursor.hide);
			else {
				let t = Ve(this._prevFrame, e), n = Je(this.output);
				if (this.restoreCursor(), t) {
					let r = Math.max(0, t.numLinesAfter - n), i = Math.max(0, t.numLinesBefore - n), a = t.lines.find((e) => e >= r);
					if (a === void 0) {
						this._prevFrame = e;
						return;
					}
					if (t.lines.length === 1) {
						this.output.write(T.cursor.move(0, a - i)), this.output.write(T.erase.lines(1));
						let t = e.split("\n");
						this.output.write(t[a]), this._prevFrame = e, this.output.write(T.cursor.move(0, t.length - a - 1));
						return;
					} else if (t.lines.length > 1) {
						if (r < i) a = r;
						else {
							let e = a - i;
							e > 0 && this.output.write(T.cursor.move(0, e));
						}
						this.output.write(T.erase.down());
						let t = e.split("\n").slice(a);
						this.output.write(t.join("\n")), this._prevFrame = e;
						return;
					}
				}
				this.output.write(T.erase.down());
			}
			this.output.write(e), this.state === "initial" && (this.state = "active"), this._prevFrame = e;
		}
	}
}, Xe = class extends Ye {
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
			this.output.write(T.cursor.move(0, -1)), this.value = e, this.state = "submit", this.close();
		}), this.on("cursor", () => {
			this.value = !this.value;
		});
	}
}, Ze = class extends Ye {
	#e = !1;
	#t;
	focused = "editor";
	get userInputWithCursor() {
		if (this.state === "submit") return this.userInput;
		let e = this.userInput;
		if (this.cursor >= e.length) return `${e}\u2588`;
		let t = e.slice(0, this.cursor), n = e[this.cursor], r = e.slice(this.cursor + 1);
		return n === "\n" ? `${t}\u2588
${r}` : `${t}${v("inverse", n)}${r}`;
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
				this._cursor = ze(this._cursor, 0, -1, t);
				return;
			case "down":
				this._cursor = ze(this._cursor, 0, 1, t);
				return;
			case "left":
				this._cursor = ze(this._cursor, -1, 0, t);
				return;
			case "right":
				this._cursor = ze(this._cursor, 1, 0, t);
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
			if (t?.name && D.actions.has(t.name)) {
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
}, Qe = class extends Ye {
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
		this.cursor = this.options[t].disabled ? E(t, 1, this.options) : t, this.on("key", (e) => {
			e === "a" && this.toggleAll(), e === "i" && this.toggleInvert();
		}), this.on("cursor", (e) => {
			switch (e) {
				case "left":
				case "up":
					this.cursor = E(this.cursor, -1, this.options);
					break;
				case "down":
				case "right":
					this.cursor = E(this.cursor, 1, this.options);
					break;
				case "space":
					this.toggleValue();
					break;
			}
		});
	}
}, $e = class extends Ye {
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
		this.cursor = this.options[n].disabled ? E(n, 1, this.options) : n, this.changeValue(), this.on("cursor", (e) => {
			switch (e) {
				case "left":
				case "up":
					this.cursor = E(this.cursor, -1, this.options);
					break;
				case "down":
				case "right":
					this.cursor = E(this.cursor, 1, this.options);
					break;
			}
			this.changeValue();
		});
	}
}, et = class extends Ye {
	get userInputWithCursor() {
		if (this.state === "submit") return this.userInput;
		let e = this.userInput;
		if (this.cursor >= e.length) return `${this.userInput}\u2588`;
		let t = e.slice(0, this.cursor), [n, ...r] = e.slice(this.cursor);
		return `${t}${v("inverse", n)}${r.join("")}`;
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
function tt() {
	return y.platform === "win32" ? !!y.env.CI || !!y.env.WT_SESSION || !!y.env.TERMINUS_SUBLIME || y.env.ConEmuTask === "{cmd::Cmder}" || y.env.TERM_PROGRAM === "Terminus-Sublime" || y.env.TERM_PROGRAM === "vscode" || y.env.TERM === "xterm-256color" || y.env.TERM === "alacritty" || y.env.TERMINAL_EMULATOR === "JetBrains-JediTerm" : y.env.TERM !== "linux";
}
var nt = tt(), rt = () => process.env.CI === "true", k = (e, t) => nt ? e : t, it = k("◆", "*"), at = k("■", "x"), ot = k("▲", "x"), st = k("◇", "o"), A = k("│", "|"), j = k("└", "—"), ct = k("●", ">"), lt = k("○", " "), ut = k("◻", "[•]"), dt = k("◼", "[+]"), ft = k("◻", "[ ]"), pt = k("●", "•"), mt = k("◆", "*"), ht = k("▲", "!"), gt = k("■", "x"), _t = (e) => {
	switch (e) {
		case "initial":
		case "active": return v("cyan", it);
		case "cancel": return v("red", at);
		case "error": return v("yellow", ot);
		case "submit": return v("green", st);
	}
}, vt = (e) => {
	switch (e) {
		case "initial":
		case "active": return v("cyan", A);
		case "cancel": return v("red", A);
		case "error": return v("yellow", A);
		case "submit": return v("green", A);
	}
}, yt = (e, t, n, r, i) => {
	let a = t, o = 0;
	for (let t = n; t < r; t++) {
		let n = e[t];
		if (a -= n.length, o++, a <= i) break;
	}
	return {
		lineCount: a,
		removals: o
	};
}, bt = ({ cursor: e, options: t, style: n, output: r = process.stdout, maxItems: i = Infinity, columnPadding: a = 0, rowPadding: o = 4 }) => {
	let s = qe(r) - a, c = Je(r), l = v("dim", "..."), u = Math.max(c - o, 0), d = Math.max(Math.min(i, u), 5), f = 0;
	e >= d - 3 && (f = Math.max(Math.min(e - d + 3, t.length - d), 0));
	let p = d < t.length && f > 0, m = d < t.length && f + d < t.length, h = Math.min(f + d, t.length), g = [], _ = 0;
	p && _++, m && _++;
	let y = f + +!!p, b = h - +!!m;
	for (let r = y; r < b; r++) {
		let i = w(n(t[r], r === e), s, {
			hard: !0,
			trim: !1
		}).split("\n");
		g.push(i), _ += i.length;
	}
	if (_ > u) {
		let t = 0, n = 0, r = _, i = e - y, a = (e, t) => yt(g, r, e, t, u);
		p ? ({lineCount: r, removals: t} = a(0, i), r > u && ({lineCount: r, removals: n} = a(i + 1, g.length))) : ({lineCount: r, removals: n} = a(i + 1, g.length), r > u && ({lineCount: r, removals: t} = a(0, i))), t > 0 && (p = !0, g.splice(0, t)), n > 0 && (m = !0, g.splice(g.length - n, n));
	}
	let x = [];
	p && x.push(l);
	for (let e of g) for (let t of e) x.push(t);
	return m && x.push(l), x;
}, xt = (e) => {
	let t = e.active ?? "Yes", n = e.inactive ?? "No";
	return new Xe({
		active: t,
		inactive: n,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValue: e.initialValue ?? !0,
		render() {
			let r = e.withGuide ?? D.withGuide, i = `${_t(this.state)}  `, a = r ? `${v("gray", A)}  ` : "", o = O(e.output, e.message, a, i), s = `${r ? `${v("gray", A)}
` : ""}${o}
`, c = this.value ? t : n;
			switch (this.state) {
				case "submit": return `${s}${r ? `${v("gray", A)}  ` : ""}${v("dim", c)}`;
				case "cancel": return `${s}${r ? `${v("gray", A)}  ` : ""}${v(["strikethrough", "dim"], c)}${r ? `
${v("gray", A)}` : ""}`;
				default: {
					let i = r ? `${v("cyan", A)}  ` : "", a = r ? v("cyan", j) : "";
					return `${s}${i}${this.value ? `${v("green", ct)} ${t}` : `${v("dim", lt)} ${v("dim", t)}`}${e.vertical ? r ? `
${v("cyan", A)}  ` : "\n" : ` ${v("dim", "/")} `}${this.value ? `${v("dim", lt)} ${v("dim", n)}` : `${v("green", ct)} ${n}`}
${a}
`;
				}
			}
		}
	}).prompt();
}, M = {
	message: (e = [], { symbol: t = v("gray", A), secondarySymbol: n = v("gray", A), output: r = process.stdout, spacing: i = 1, withGuide: a } = {}) => {
		let o = [], s = a ?? D.withGuide, c = s ? n : "", l = s ? `${t}  ` : "", u = s ? `${n}  ` : "";
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
		M.message(e, {
			...t,
			symbol: v("blue", pt)
		});
	},
	success: (e, t) => {
		M.message(e, {
			...t,
			symbol: v("green", mt)
		});
	},
	step: (e, t) => {
		M.message(e, {
			...t,
			symbol: v("green", st)
		});
	},
	warn: (e, t) => {
		M.message(e, {
			...t,
			symbol: v("yellow", ht)
		});
	},
	warning: (e, t) => {
		M.warn(e, t);
	},
	error: (e, t) => {
		M.message(e, {
			...t,
			symbol: v("red", gt)
		});
	}
}, St = (e) => new Ze({
	validate: e.validate,
	placeholder: e.placeholder,
	defaultValue: e.defaultValue,
	initialValue: e.initialValue,
	showSubmit: e.showSubmit,
	output: e.output,
	signal: e.signal,
	input: e.input,
	render() {
		let t = e?.withGuide ?? D.withGuide, n = `${`${t ? `${v("gray", A)}
` : ""}${_t(this.state)}  `}${e.message}
`, r = e.placeholder ? v("inverse", e.placeholder[0]) + v("dim", e.placeholder.slice(1)) : v(["inverse", "hidden"], "_"), i = this.userInput ? this.userInputWithCursor : r, a = this.value ?? "", o = e.showSubmit ? `
  ${v(this.focused === "submit" ? "cyan" : "dim", "[ submit ]")}` : "";
		switch (this.state) {
			case "error": {
				let r = `${v("yellow", A)}  `;
				return `${n}${t ? O(e.output, i, r, void 0) : i}
${v("yellow", j)}  ${v("yellow", this.error)}${o}
`;
			}
			case "submit": {
				let r = `${v("gray", A)}  `;
				return `${n}${t ? O(e.output, a, r, void 0, (e) => v("dim", e)) : a ? v("dim", a) : ""}`;
			}
			case "cancel": {
				let r = `${v("gray", A)}  `;
				return `${n}${t ? O(e.output, a, r, void 0, (e) => v(["strikethrough", "dim"], e)) : a ? v(["strikethrough", "dim"], a) : ""}`;
			}
			default: {
				let r = t ? `${v("cyan", A)}  ` : "", a = t ? v("cyan", j) : "";
				return `${n}${t ? O(e.output, i, r) : i}
${a}${o}
`;
			}
		}
	}
}).prompt(), Ct = (e, t) => e.split("\n").map((e) => t(e)).join("\n"), wt = (e) => {
	let t = (e, t) => {
		let n = e.label ?? String(e.value);
		return t === "disabled" ? `${v("gray", ft)} ${Ct(n, (e) => v(["strikethrough", "gray"], e))}${e.hint ? ` ${v("dim", `(${e.hint ?? "disabled"})`)}` : ""}` : t === "active" ? `${v("cyan", ut)} ${n}${e.hint ? ` ${v("dim", `(${e.hint})`)}` : ""}` : t === "selected" ? `${v("green", dt)} ${Ct(n, (e) => v("dim", e))}${e.hint ? ` ${v("dim", `(${e.hint})`)}` : ""}` : t === "cancelled" ? `${Ct(n, (e) => v(["strikethrough", "dim"], e))}` : t === "active-selected" ? `${v("green", dt)} ${n}${e.hint ? ` ${v("dim", `(${e.hint})`)}` : ""}` : t === "submitted" ? `${Ct(n, (e) => v("dim", e))}` : `${v("dim", ft)} ${Ct(n, (e) => v("dim", e))}`;
	}, n = e.required ?? !0;
	return new Qe({
		options: e.options,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValues: e.initialValues,
		required: n,
		cursorAt: e.cursorAt,
		validate(e) {
			if (n && (e === void 0 || e.length === 0)) return `Please select at least one option.
${v("reset", v("dim", `Press ${v([
				"gray",
				"bgWhite",
				"inverse"
			], " space ")} to select, ${v("gray", v("bgWhite", v("inverse", " enter ")))} to submit`))}`;
		},
		render() {
			let n = e.withGuide ?? D.withGuide, r = O(e.output, e.message, n ? `${vt(this.state)}  ` : "", `${_t(this.state)}  `), i = `${n ? `${v("gray", A)}
` : ""}${r}
`, a = this.value ?? [], o = (e, n) => {
				if (e.disabled) return t(e, "disabled");
				let r = a.includes(e.value);
				return n && r ? t(e, "active-selected") : r ? t(e, "selected") : t(e, n ? "active" : "inactive");
			};
			switch (this.state) {
				case "submit": {
					let r = this.options.filter(({ value: e }) => a.includes(e)).map((e) => t(e, "submitted")).join(v("dim", ", ")) || v("dim", "none");
					return `${i}${O(e.output, r, n ? `${v("gray", A)}  ` : "")}`;
				}
				case "cancel": {
					let r = this.options.filter(({ value: e }) => a.includes(e)).map((e) => t(e, "cancelled")).join(v("dim", ", "));
					return r.trim() === "" ? `${i}${v("gray", A)}` : `${i}${O(e.output, r, n ? `${v("gray", A)}  ` : "")}${n ? `
${v("gray", A)}` : ""}`;
				}
				case "error": {
					let t = n ? `${v("yellow", A)}  ` : "", r = this.error.split("\n").map((e, t) => t === 0 ? `${n ? `${v("yellow", j)}  ` : ""}${v("yellow", e)}` : `   ${e}`).join("\n"), a = i.split("\n").length, s = r.split("\n").length + 1;
					return `${i}${t}${bt({
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
					let t = n ? `${v("cyan", A)}  ` : "", r = i.split("\n").length, a = n ? 2 : 1;
					return `${i}${t}${bt({
						output: e.output,
						options: this.options,
						cursor: this.cursor,
						maxItems: e.maxItems,
						columnPadding: t.length,
						rowPadding: r + a,
						style: o
					}).join(`
${t}`)}
${n ? v("cyan", j) : ""}
`;
				}
			}
		}
	}).prompt();
}, Tt = (e) => v("magenta", e), Et = ({ indicator: e = "dots", onCancel: t, output: n = process.stdout, cancelMessage: r, errorMessage: i, frames: a = nt ? [
	"◒",
	"◐",
	"◓",
	"◑"
] : [
	"•",
	"o",
	"O",
	"0"
], delay: o = nt ? 80 : 120, signal: s, ...c } = {}) => {
	let l = rt(), u, d, f = !1, p = !1, m = "", h, g = performance.now(), _ = qe(n), y = c?.styleFrame ?? Tt, b = (e) => {
		let n = e > 1 ? i ?? D.messages.error : r ?? D.messages.cancel;
		p = e === 1, f && (se(n, e), p && typeof t == "function" && t());
	}, x = () => b(2), S = () => b(1), ee = () => {
		process.on("uncaughtExceptionMonitor", x), process.on("unhandledRejection", x), process.on("SIGINT", S), process.on("SIGTERM", S), process.on("exit", b), s && s.addEventListener("abort", S);
	}, te = () => {
		process.removeListener("uncaughtExceptionMonitor", x), process.removeListener("unhandledRejection", x), process.removeListener("SIGINT", S), process.removeListener("SIGTERM", S), process.removeListener("exit", b), s && s.removeEventListener("abort", S);
	}, ne = () => {
		if (h === void 0) return;
		l && n.write("\n");
		let e = w(h, _, {
			hard: !0,
			trim: !1
		}).split("\n");
		e.length > 1 && n.write(T.cursor.up(e.length - 1)), n.write(T.cursor.to(0)), n.write(T.erase.down());
	}, re = (e) => e.replace(/\.+$/, ""), ie = (e) => {
		let t = (performance.now() - e) / 1e3, n = Math.floor(t / 60), r = Math.floor(t % 60);
		return n > 0 ? `[${n}m ${r}s]` : `[${r}s]`;
	}, ae = c.withGuide ?? D.withGuide, oe = (t = "") => {
		f = !0, u = Ke({ output: n }), m = re(t), g = performance.now(), ae && n.write(`${v("gray", A)}
`);
		let r = 0, i = 0;
		ee(), d = setInterval(() => {
			if (l && m === h) return;
			ne(), h = m;
			let t = y(a[r]), o;
			if (l) o = `${t}  ${m}...`;
			else if (e === "timer") o = `${t}  ${m} ${ie(g)}`;
			else {
				let e = ".".repeat(Math.floor(i)).slice(0, 3);
				o = `${t}  ${m}${e}`;
			}
			let s = w(o, _, {
				hard: !0,
				trim: !1
			});
			n.write(s), r = r + 1 < a.length ? r + 1 : 0, i = i < 4 ? i + .125 : 0;
		}, o);
	}, se = (t = "", r = 0, i = !1) => {
		if (!f) return;
		f = !1, clearInterval(d), ne();
		let a = r === 0 ? v("green", st) : r === 1 ? v("red", at) : v("red", ot);
		m = t ?? m, i || (e === "timer" ? n.write(`${a}  ${m} ${ie(g)}
`) : n.write(`${a}  ${m}
`)), te(), u();
	};
	return {
		start: oe,
		stop: (e = "") => se(e, 0),
		message: (e = "") => {
			m = re(e ?? m);
		},
		cancel: (e = "") => se(e, 1),
		error: (e = "") => se(e, 2),
		clear: () => se("", 0, !0),
		get isCancelled() {
			return p;
		}
	};
}, Dt = (e, t) => e.includes("\n") ? e.split("\n").map((e) => t(e)).join("\n") : t(e), Ot = (e) => {
	let t = (e, t) => {
		let n = e.label ?? String(e.value);
		switch (t) {
			case "disabled": return `${v("gray", lt)} ${Dt(n, (e) => v("gray", e))}${e.hint ? ` ${v("dim", `(${e.hint ?? "disabled"})`)}` : ""}`;
			case "selected": return `${Dt(n, (e) => v("dim", e))}`;
			case "active": return `${v("green", ct)} ${n}${e.hint ? ` ${v("dim", `(${e.hint})`)}` : ""}`;
			case "cancelled": return `${Dt(n, (e) => v(["strikethrough", "dim"], e))}`;
			default: return `${v("dim", lt)} ${Dt(n, (e) => v("dim", e))}`;
		}
	};
	return new $e({
		options: e.options,
		signal: e.signal,
		input: e.input,
		output: e.output,
		initialValue: e.initialValue,
		render() {
			let n = e.withGuide ?? D.withGuide, r = `${_t(this.state)}  `, i = `${vt(this.state)}  `, a = O(e.output, e.message, i, r), o = `${n ? `${v("gray", A)}
` : ""}${a}
`;
			switch (this.state) {
				case "submit": {
					let r = n ? `${v("gray", A)}  ` : "";
					return `${o}${O(e.output, t(this.options[this.cursor], "selected"), r)}`;
				}
				case "cancel": {
					let r = n ? `${v("gray", A)}  ` : "";
					return `${o}${O(e.output, t(this.options[this.cursor], "cancelled"), r)}${n ? `
${v("gray", A)}` : ""}`;
				}
				default: {
					let r = n ? `${v("cyan", A)}  ` : "", i = n ? v("cyan", j) : "", a = o.split("\n").length, s = n ? 2 : 1;
					return `${o}${r}${bt({
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
}, kt = `${v("gray", A)}  `, N = {
	message: async (e, { symbol: t = v("gray", A) } = {}) => {
		process.stdout.write(`${v("gray", A)}
${t}  `);
		let n = 3;
		for await (let t of e) {
			t = t.replace(/\n/g, `
${kt}`), t.includes("\n") && (n = 3 + _(t.slice(t.lastIndexOf("\n"))).length);
			let e = _(t).length;
			n + e < process.stdout.columns ? (n += e, process.stdout.write(t)) : (process.stdout.write(`
${kt}${t.trimStart()}`), n = 3 + _(t.trimStart()).length);
		}
		process.stdout.write("\n");
	},
	info: (e) => N.message(e, { symbol: v("blue", pt) }),
	success: (e) => N.message(e, { symbol: v("green", mt) }),
	step: (e) => N.message(e, { symbol: v("green", st) }),
	warn: (e) => N.message(e, { symbol: v("yellow", ht) }),
	warning: (e) => N.warn(e),
	error: (e) => N.message(e, { symbol: v("red", gt) })
}, At = (e) => new et({
	validate: e.validate,
	placeholder: e.placeholder,
	defaultValue: e.defaultValue,
	initialValue: e.initialValue,
	output: e.output,
	signal: e.signal,
	input: e.input,
	render() {
		let t = e?.withGuide ?? D.withGuide, n = `${`${t ? `${v("gray", A)}
` : ""}${_t(this.state)}  `}${e.message}
`, r = e.placeholder ? v("inverse", e.placeholder[0]) + v("dim", e.placeholder.slice(1)) : v(["inverse", "hidden"], "_"), i = this.userInput ? this.userInputWithCursor : r, a = this.value ?? "";
		switch (this.state) {
			case "error": {
				let e = this.error ? `  ${v("yellow", this.error)}` : "", r = t ? `${v("yellow", A)}  ` : "", a = t ? v("yellow", j) : "";
				return `${n.trim()}
${r}${i}
${a}${e}
`;
			}
			case "submit": {
				let e = a ? `  ${v("dim", a)}` : "";
				return `${n}${t ? v("gray", A) : ""}${e}`;
			}
			case "cancel": {
				let e = a ? `  ${v(["strikethrough", "dim"], a)}` : "", r = t ? v("gray", A) : "";
				return `${n}${r}${e}${a.trim() ? `
${r}` : ""}`;
			}
			default: return `${n}${t ? `${v("cyan", A)}  ` : ""}${i}
${t ? v("cyan", j) : ""}
`;
		}
	}
}).prompt(), P = (/* @__PURE__ */ ae(((e, t) => {
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
function jt(e) {
	return e.hint ? {
		label: e.title,
		value: e.value,
		hint: e.hint
	} : {
		label: e.title,
		value: e.value
	};
}
async function Mt({ message: e, placeholder: t, cancelMessage: n = "Selection canceled.", errorMessage: r = "Failed to select an option" }) {
	let { checkPromiseReturn: i, createNg: a } = g, o = await i({
		fn: async () => await At({
			message: e,
			placeholder: t
		}),
		err: (e) => a(le(r, e))
	});
	return o.isErr || We(o.value) && (console.log(n), process.exit(0)), o;
}
async function Nt({ message: e, placeholder: t, cancelMessage: n = "Selection canceled.", errorMessage: r = "Failed to select an option" }) {
	let { checkPromiseReturn: i, createNg: a } = g;
	console.log(`${(0, P.bold)("To send, press the Tab key and then press Enter.")}\n`), D.actions.delete("space");
	let o = await i({
		fn: async () => await St({
			message: e,
			placeholder: t,
			showSubmit: !0
		}),
		err: (e) => a(le(r, e))
	});
	return D.actions.add("space"), o.isErr || We(o.value) && (console.log(n), process.exit(0)), o;
}
async function Pt({ message: e, options: t, cancelMessage: n = "Selection canceled.", errorMessage: r = "Failed to select an option" }) {
	let { createNg: i, createOk: a, checkPromiseReturn: o } = g, s = t.find((e) => e.selected)?.value, c = await o({
		fn: async () => await Ot({
			message: e,
			initialValue: s,
			options: t.map((e) => jt(e))
		}),
		err: (e) => i(le(r, e))
	});
	return c.isErr ? c : (We(c.value) && (console.log(n), process.exit(0)), a(c.value));
}
async function Ft({ message: e, options: t, cancelMessage: n = "Selection canceled.", errorMessage: r = "Failed to select options" }) {
	let { createNg: i, createOk: a, checkPromiseReturn: o } = g, s = t.filter((e) => e.selected).map((e) => e.value), c = await o({
		fn: async () => await wt({
			message: e,
			initialValues: s,
			options: t.map((e) => jt(e))
		}),
		err: (e) => i(le(r, e))
	});
	return c.isErr ? c : (We(c.value) && (console.log(n), process.exit(0)), a(c.value));
}
//#endregion
//#region src/command/init.ts
var It = [{
	title: "Bug report",
	value: "bug_report",
	selected: !0
}, {
	title: "Feature request",
	value: "feature_request",
	selected: !0
}], Lt = [{
	title: "English",
	value: "en",
	selected: !0
}, {
	title: "Japanese",
	value: "ja",
	selected: !1
}];
async function Rt() {
	return await Ft({
		message: "Select issue template types",
		options: It,
		cancelMessage: "No template types selected. Canceled.",
		errorMessage: "Failed to select issue template types"
	});
}
async function zt() {
	return await Ft({
		message: "Select template languages",
		options: Lt,
		cancelMessage: "No languages selected. Canceled.",
		errorMessage: "Failed to select template languages"
	});
}
async function Bt() {
	let { checkPromiseReturn: e, createNg: t, createOk: n } = g, r = await e({
		fn: async () => await xt({ message: "This will create issue templates in .github/ISSUE_TEMPLATE. Do you want to continue?" }),
		err: (e) => t(le("Failed to get user confirmation", e))
	});
	return r.isErr ? r : (We(r.value) && (console.log("Initialization canceled."), process.exit(0)), n(r.value));
}
//#endregion
//#region src/action/init.ts
async function Vt() {
	let e = await Rt();
	e.isErr && (console.error(`Error: ${e.err.message}`), process.exit(1)), e.value.length === 0 && (console.log("No template types selected. Canceled."), process.exit(0));
	let t = await zt();
	t.isErr && (console.error(`Error: ${t.err.message}`), process.exit(1)), t.value.length === 0 && (console.log("No languages selected. Canceled."), process.exit(0));
	let r = await Bt();
	r.isErr && (console.error(`Error: ${r.err.message}`), process.exit(1)), r.value || (console.log("Canceled."), process.exit(0));
	let o = [];
	for (let n of t.value) for (let t of e.value) o.push({
		lang: n,
		file: `${t}_${n}.yml`
	});
	let s = d(process.cwd(), ".github"), c = d(s, "ISSUE_TEMPLATE"), l = d(process.cwd(), ".gh-issue"), f = d(l, "README.md"), m = d(u(p(import.meta.url)), "template");
	await n(s, { recursive: !0 }), await n(c, { recursive: !0 });
	let h = Et();
	h.start("Creating issue templates...");
	for (let e of o) {
		let t = d(c, e.file);
		if (a(t)) {
			console.log(`Already exists ${t}. Skipped.`);
			continue;
		}
		let n = d(m, e.lang);
		h.message(`Creating ${e.file}...`);
		let r = await ce(e.file, c, {
			parents: !1,
			cwd: n
		});
		r.isErr && (console.error(`Error: ${r.err.message}`), process.exit(1)), h.message(`Created ${t}\n`);
	}
	await n(l, { recursive: !0 }), a(f) || await i(f, "# gh-issue\n\nThis directory is managed by gh-issue.\n"), h.stop("All done!");
}
//#endregion
//#region src/helper/find-template.ts
function Ht() {
	let { createNg: e, createOk: t } = g, n = ne(process.cwd(), ".github", "ISSUE_TEMPLATE");
	if (!a(n)) return e(/* @__PURE__ */ Error(".github/ISSUE_TEMPLATE directory does not exist"));
	let r = s(n, { withFileTypes: !0 }).filter((e) => e.isFile()).map((e) => e.name);
	return r.length === 0 ? e(/* @__PURE__ */ Error("No issue templates found in .github/ISSUE_TEMPLATE")) : t(r);
}
//#endregion
//#region node_modules/.pnpm/js-yaml@4.1.1/node_modules/js-yaml/dist/js-yaml.mjs
function Ut(e) {
	return e == null;
}
function Wt(e) {
	return typeof e == "object" && !!e;
}
function Gt(e) {
	return Array.isArray(e) ? e : Ut(e) ? [] : [e];
}
function Kt(e, t) {
	var n, r, i, a;
	if (t) for (a = Object.keys(t), n = 0, r = a.length; n < r; n += 1) i = a[n], e[i] = t[i];
	return e;
}
function qt(e, t) {
	var n = "", r;
	for (r = 0; r < t; r += 1) n += e;
	return n;
}
function Jt(e) {
	return e === 0 && 1 / e == -Infinity;
}
var F = {
	isNothing: Ut,
	isObject: Wt,
	toArray: Gt,
	repeat: qt,
	isNegativeZero: Jt,
	extend: Kt
};
function Yt(e, t) {
	var n = "", r = e.reason || "(unknown reason)";
	return e.mark ? (e.mark.name && (n += "in \"" + e.mark.name + "\" "), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet), r + " " + n) : r;
}
function Xt(e, t) {
	Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Yt(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (/* @__PURE__ */ Error()).stack || "";
}
Xt.prototype = Object.create(Error.prototype), Xt.prototype.constructor = Xt, Xt.prototype.toString = function(e) {
	return this.name + ": " + Yt(this, e);
};
var I = Xt;
function Zt(e, t, n, r, i) {
	var a = "", o = "", s = Math.floor(i / 2) - 1;
	return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
		str: a + e.slice(t, n).replace(/\t/g, "→") + o,
		pos: r - t + a.length
	};
}
function Qt(e, t) {
	return F.repeat(" ", t - e.length) + e;
}
function $t(e, t) {
	if (t = Object.create(t || null), !e.buffer) return null;
	t.maxLength ||= 79, typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
	for (var n = /\r?\n|\r|\0/g, r = [0], i = [], a, o = -1; a = n.exec(e.buffer);) i.push(a.index), r.push(a.index + a[0].length), e.position <= a.index && o < 0 && (o = r.length - 2);
	o < 0 && (o = r.length - 1);
	var s = "", c, l, u = Math.min(e.line + t.linesAfter, i.length).toString().length, d = t.maxLength - (t.indent + u + 3);
	for (c = 1; c <= t.linesBefore && !(o - c < 0); c++) l = Zt(e.buffer, r[o - c], i[o - c], e.position - (r[o] - r[o - c]), d), s = F.repeat(" ", t.indent) + Qt((e.line - c + 1).toString(), u) + " | " + l.str + "\n" + s;
	for (l = Zt(e.buffer, r[o], i[o], e.position, d), s += F.repeat(" ", t.indent) + Qt((e.line + 1).toString(), u) + " | " + l.str + "\n", s += F.repeat("-", t.indent + u + 3 + l.pos) + "^\n", c = 1; c <= t.linesAfter && !(o + c >= i.length); c++) l = Zt(e.buffer, r[o + c], i[o + c], e.position - (r[o] - r[o + c]), d), s += F.repeat(" ", t.indent) + Qt((e.line + c + 1).toString(), u) + " | " + l.str + "\n";
	return s.replace(/\n$/, "");
}
var en = $t, tn = [
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
], nn = [
	"scalar",
	"sequence",
	"mapping"
];
function rn(e) {
	var t = {};
	return e !== null && Object.keys(e).forEach(function(n) {
		e[n].forEach(function(e) {
			t[String(e)] = n;
		});
	}), t;
}
function an(e, t) {
	if (t ||= {}, Object.keys(t).forEach(function(t) {
		if (tn.indexOf(t) === -1) throw new I("Unknown option \"" + t + "\" is met in definition of \"" + e + "\" YAML type.");
	}), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
		return !0;
	}, this.construct = t.construct || function(e) {
		return e;
	}, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = rn(t.styleAliases || null), nn.indexOf(this.kind) === -1) throw new I("Unknown kind \"" + this.kind + "\" is specified for \"" + e + "\" YAML type.");
}
var L = an;
function on(e, t) {
	var n = [];
	return e[t].forEach(function(e) {
		var t = n.length;
		n.forEach(function(n, r) {
			n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
		}), n[t] = e;
	}), n;
}
function sn() {
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
function cn(e) {
	return this.extend(e);
}
cn.prototype.extend = function(e) {
	var t = [], n = [];
	if (e instanceof L) n.push(e);
	else if (Array.isArray(e)) n = n.concat(e);
	else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit))) e.implicit && (t = t.concat(e.implicit)), e.explicit && (n = n.concat(e.explicit));
	else throw new I("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
	t.forEach(function(e) {
		if (!(e instanceof L)) throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		if (e.loadKind && e.loadKind !== "scalar") throw new I("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
		if (e.multi) throw new I("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
	}), n.forEach(function(e) {
		if (!(e instanceof L)) throw new I("Specified list of YAML types (or a single Type object) contains a non-Type object.");
	});
	var r = Object.create(cn.prototype);
	return r.implicit = (this.implicit || []).concat(t), r.explicit = (this.explicit || []).concat(n), r.compiledImplicit = on(r, "implicit"), r.compiledExplicit = on(r, "explicit"), r.compiledTypeMap = sn(r.compiledImplicit, r.compiledExplicit), r;
};
var ln = new cn({ explicit: [
	new L("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: function(e) {
			return e === null ? "" : e;
		}
	}),
	new L("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: function(e) {
			return e === null ? [] : e;
		}
	}),
	new L("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: function(e) {
			return e === null ? {} : e;
		}
	})
] });
function un(e) {
	if (e === null) return !0;
	var t = e.length;
	return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function dn() {
	return null;
}
function fn(e) {
	return e === null;
}
var pn = new L("tag:yaml.org,2002:null", {
	kind: "scalar",
	resolve: un,
	construct: dn,
	predicate: fn,
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
function mn(e) {
	if (e === null) return !1;
	var t = e.length;
	return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function hn(e) {
	return e === "true" || e === "True" || e === "TRUE";
}
function gn(e) {
	return Object.prototype.toString.call(e) === "[object Boolean]";
}
var _n = new L("tag:yaml.org,2002:bool", {
	kind: "scalar",
	resolve: mn,
	construct: hn,
	predicate: gn,
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
function vn(e) {
	return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function yn(e) {
	return 48 <= e && e <= 55;
}
function bn(e) {
	return 48 <= e && e <= 57;
}
function xn(e) {
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
				if (!vn(e.charCodeAt(n))) return !1;
				r = !0;
			}
			return r && i !== "_";
		}
		if (i === "o") {
			for (n++; n < t; n++) if (i = e[n], i !== "_") {
				if (!yn(e.charCodeAt(n))) return !1;
				r = !0;
			}
			return r && i !== "_";
		}
	}
	if (i === "_") return !1;
	for (; n < t; n++) if (i = e[n], i !== "_") {
		if (!bn(e.charCodeAt(n))) return !1;
		r = !0;
	}
	return !(!r || i === "_");
}
function Sn(e) {
	var t = e, n = 1, r;
	if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
	if (r === "0") {
		if (t[1] === "b") return n * parseInt(t.slice(2), 2);
		if (t[1] === "x") return n * parseInt(t.slice(2), 16);
		if (t[1] === "o") return n * parseInt(t.slice(2), 8);
	}
	return n * parseInt(t, 10);
}
function Cn(e) {
	return Object.prototype.toString.call(e) === "[object Number]" && e % 1 == 0 && !F.isNegativeZero(e);
}
var wn = new L("tag:yaml.org,2002:int", {
	kind: "scalar",
	resolve: xn,
	construct: Sn,
	predicate: Cn,
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
}), Tn = /* @__PURE__ */ RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
function En(e) {
	return !(e === null || !Tn.test(e) || e[e.length - 1] === "_");
}
function Dn(e) {
	var t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1;
	return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Infinity : -Infinity : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var On = /^[-+]?[0-9]+e/;
function kn(e, t) {
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
	else if (F.isNegativeZero(e)) return "-0.0";
	return n = e.toString(10), On.test(n) ? n.replace("e", ".e") : n;
}
function An(e) {
	return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 != 0 || F.isNegativeZero(e));
}
var jn = new L("tag:yaml.org,2002:float", {
	kind: "scalar",
	resolve: En,
	construct: Dn,
	predicate: An,
	represent: kn,
	defaultStyle: "lowercase"
}), Mn = ln.extend({ implicit: [
	pn,
	_n,
	wn,
	jn
] }), Nn = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), Pn = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
function Fn(e) {
	return e === null ? !1 : Nn.exec(e) !== null || Pn.exec(e) !== null;
}
function In(e) {
	var t, n, r, i, a, o, s, c = 0, l = null, u, d, f;
	if (t = Nn.exec(e), t === null && (t = Pn.exec(e)), t === null) throw Error("Date resolve error");
	if (n = +t[1], r = t[2] - 1, i = +t[3], !t[4]) return new Date(Date.UTC(n, r, i));
	if (a = +t[4], o = +t[5], s = +t[6], t[7]) {
		for (c = t[7].slice(0, 3); c.length < 3;) c += "0";
		c = +c;
	}
	return t[9] && (u = +t[10], d = +(t[11] || 0), l = (u * 60 + d) * 6e4, t[9] === "-" && (l = -l)), f = new Date(Date.UTC(n, r, i, a, o, s, c)), l && f.setTime(f.getTime() - l), f;
}
function Ln(e) {
	return e.toISOString();
}
var Rn = new L("tag:yaml.org,2002:timestamp", {
	kind: "scalar",
	resolve: Fn,
	construct: In,
	instanceOf: Date,
	represent: Ln
});
function zn(e) {
	return e === "<<" || e === null;
}
var Bn = new L("tag:yaml.org,2002:merge", {
	kind: "scalar",
	resolve: zn
}), Vn = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
function Hn(e) {
	if (e === null) return !1;
	var t, n, r = 0, i = e.length, a = Vn;
	for (n = 0; n < i; n++) if (t = a.indexOf(e.charAt(n)), !(t > 64)) {
		if (t < 0) return !1;
		r += 6;
	}
	return r % 8 == 0;
}
function Un(e) {
	var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, a = Vn, o = 0, s = [];
	for (t = 0; t < i; t++) t % 4 == 0 && t && (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)), o = o << 6 | a.indexOf(r.charAt(t));
	return n = i % 4 * 6, n === 0 ? (s.push(o >> 16 & 255), s.push(o >> 8 & 255), s.push(o & 255)) : n === 18 ? (s.push(o >> 10 & 255), s.push(o >> 2 & 255)) : n === 12 && s.push(o >> 4 & 255), new Uint8Array(s);
}
function Wn(e) {
	var t = "", n = 0, r, i, a = e.length, o = Vn;
	for (r = 0; r < a; r++) r % 3 == 0 && r && (t += o[n >> 18 & 63], t += o[n >> 12 & 63], t += o[n >> 6 & 63], t += o[n & 63]), n = (n << 8) + e[r];
	return i = a % 3, i === 0 ? (t += o[n >> 18 & 63], t += o[n >> 12 & 63], t += o[n >> 6 & 63], t += o[n & 63]) : i === 2 ? (t += o[n >> 10 & 63], t += o[n >> 4 & 63], t += o[n << 2 & 63], t += o[64]) : i === 1 && (t += o[n >> 2 & 63], t += o[n << 4 & 63], t += o[64], t += o[64]), t;
}
function Gn(e) {
	return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Kn = new L("tag:yaml.org,2002:binary", {
	kind: "scalar",
	resolve: Hn,
	construct: Un,
	predicate: Gn,
	represent: Wn
}), qn = Object.prototype.hasOwnProperty, Jn = Object.prototype.toString;
function Yn(e) {
	if (e === null) return !0;
	var t = [], n, r, i, a, o, s = e;
	for (n = 0, r = s.length; n < r; n += 1) {
		if (i = s[n], o = !1, Jn.call(i) !== "[object Object]") return !1;
		for (a in i) if (qn.call(i, a)) if (!o) o = !0;
		else return !1;
		if (!o) return !1;
		if (t.indexOf(a) === -1) t.push(a);
		else return !1;
	}
	return !0;
}
function Xn(e) {
	return e === null ? [] : e;
}
var Zn = new L("tag:yaml.org,2002:omap", {
	kind: "sequence",
	resolve: Yn,
	construct: Xn
}), Qn = Object.prototype.toString;
function $n(e) {
	if (e === null) return !0;
	var t, n, r, i, a, o = e;
	for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) {
		if (r = o[t], Qn.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
		a[t] = [i[0], r[i[0]]];
	}
	return !0;
}
function er(e) {
	if (e === null) return [];
	var t, n, r, i, a, o = e;
	for (a = Array(o.length), t = 0, n = o.length; t < n; t += 1) r = o[t], i = Object.keys(r), a[t] = [i[0], r[i[0]]];
	return a;
}
var tr = new L("tag:yaml.org,2002:pairs", {
	kind: "sequence",
	resolve: $n,
	construct: er
}), nr = Object.prototype.hasOwnProperty;
function rr(e) {
	if (e === null) return !0;
	var t, n = e;
	for (t in n) if (nr.call(n, t) && n[t] !== null) return !1;
	return !0;
}
function ir(e) {
	return e === null ? {} : e;
}
var ar = new L("tag:yaml.org,2002:set", {
	kind: "mapping",
	resolve: rr,
	construct: ir
}), or = Mn.extend({
	implicit: [Rn, Bn],
	explicit: [
		Kn,
		Zn,
		tr,
		ar
	]
}), R = Object.prototype.hasOwnProperty, sr = 1, cr = 2, lr = 3, ur = 4, dr = 1, fr = 2, pr = 3, mr = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, hr = /[\x85\u2028\u2029]/, gr = /[,\[\]\{\}]/, _r = /^(?:!|!!|![a-z\-]+!)$/i, vr = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function yr(e) {
	return Object.prototype.toString.call(e);
}
function z(e) {
	return e === 10 || e === 13;
}
function B(e) {
	return e === 9 || e === 32;
}
function V(e) {
	return e === 9 || e === 32 || e === 10 || e === 13;
}
function br(e) {
	return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function xr(e) {
	var t;
	return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function Sr(e) {
	return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function Cr(e) {
	return 48 <= e && e <= 57 ? e - 48 : -1;
}
function wr(e) {
	return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? "\n" : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? "\"" : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? "\xA0" : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function Tr(e) {
	return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
}
function Er(e, t, n) {
	t === "__proto__" ? Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !0,
		writable: !0,
		value: n
	}) : e[t] = n;
}
for (var Dr = Array(256), Or = Array(256), kr = 0; kr < 256; kr++) Dr[kr] = +!!wr(kr), Or[kr] = wr(kr);
function Ar(e, t) {
	this.input = e, this.filename = t.filename || null, this.schema = t.schema || or, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function jr(e, t) {
	var n = {
		name: e.filename,
		buffer: e.input.slice(0, -1),
		position: e.position,
		line: e.line,
		column: e.position - e.lineStart
	};
	return n.snippet = en(n), new I(t, n);
}
function H(e, t) {
	throw jr(e, t);
}
function Mr(e, t) {
	e.onWarning && e.onWarning.call(null, jr(e, t));
}
var Nr = {
	YAML: function(e, t, n) {
		var r, i, a;
		e.version !== null && H(e, "duplication of %YAML directive"), n.length !== 1 && H(e, "YAML directive accepts exactly one argument"), r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]), r === null && H(e, "ill-formed argument of the YAML directive"), i = parseInt(r[1], 10), a = parseInt(r[2], 10), i !== 1 && H(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && Mr(e, "unsupported YAML version of the document");
	},
	TAG: function(e, t, n) {
		var r, i;
		n.length !== 2 && H(e, "TAG directive accepts exactly two arguments"), r = n[0], i = n[1], _r.test(r) || H(e, "ill-formed tag handle (first argument) of the TAG directive"), R.call(e.tagMap, r) && H(e, "there is a previously declared suffix for \"" + r + "\" tag handle"), vr.test(i) || H(e, "ill-formed tag prefix (second argument) of the TAG directive");
		try {
			i = decodeURIComponent(i);
		} catch {
			H(e, "tag prefix is malformed: " + i);
		}
		e.tagMap[r] = i;
	}
};
function U(e, t, n, r) {
	var i, a, o, s;
	if (t < n) {
		if (s = e.input.slice(t, n), r) for (i = 0, a = s.length; i < a; i += 1) o = s.charCodeAt(i), o === 9 || 32 <= o && o <= 1114111 || H(e, "expected valid JSON character");
		else mr.test(s) && H(e, "the stream contains non-printable characters");
		e.result += s;
	}
}
function Pr(e, t, n, r) {
	var i, a, o, s;
	for (F.isObject(n) || H(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), o = 0, s = i.length; o < s; o += 1) a = i[o], R.call(t, a) || (Er(t, a, n[a]), r[a] = !0);
}
function Fr(e, t, n, r, i, a, o, s, c) {
	var l, u;
	if (Array.isArray(i)) for (i = Array.prototype.slice.call(i), l = 0, u = i.length; l < u; l += 1) Array.isArray(i[l]) && H(e, "nested arrays are not supported inside keys"), typeof i == "object" && yr(i[l]) === "[object Object]" && (i[l] = "[object Object]");
	if (typeof i == "object" && yr(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge") if (Array.isArray(a)) for (l = 0, u = a.length; l < u; l += 1) Pr(e, t, a[l], n);
	else Pr(e, t, a, n);
	else !e.json && !R.call(n, i) && R.call(t, i) && (e.line = o || e.line, e.lineStart = s || e.lineStart, e.position = c || e.position, H(e, "duplicated mapping key")), Er(t, i, a), delete n[i];
	return t;
}
function Ir(e) {
	var t = e.input.charCodeAt(e.position);
	t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : H(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function W(e, t, n) {
	for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0;) {
		for (; B(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
		if (t && i === 35) do
			i = e.input.charCodeAt(++e.position);
		while (i !== 10 && i !== 13 && i !== 0);
		if (z(i)) for (Ir(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
		else break;
	}
	return n !== -1 && r !== 0 && e.lineIndent < n && Mr(e, "deficient indentation"), r;
}
function Lr(e) {
	var t = e.position, n = e.input.charCodeAt(t);
	return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || V(n)));
}
function Rr(e, t) {
	t === 1 ? e.result += " " : t > 1 && (e.result += F.repeat("\n", t - 1));
}
function zr(e, t, n) {
	var r, i, a, o, s, c, l, u, d = e.kind, f = e.result, p = e.input.charCodeAt(e.position);
	if (V(p) || br(p) || p === 35 || p === 38 || p === 42 || p === 33 || p === 124 || p === 62 || p === 39 || p === 34 || p === 37 || p === 64 || p === 96 || (p === 63 || p === 45) && (i = e.input.charCodeAt(e.position + 1), V(i) || n && br(i))) return !1;
	for (e.kind = "scalar", e.result = "", a = o = e.position, s = !1; p !== 0;) {
		if (p === 58) {
			if (i = e.input.charCodeAt(e.position + 1), V(i) || n && br(i)) break;
		} else if (p === 35) {
			if (r = e.input.charCodeAt(e.position - 1), V(r)) break;
		} else if (e.position === e.lineStart && Lr(e) || n && br(p)) break;
		else if (z(p)) if (c = e.line, l = e.lineStart, u = e.lineIndent, W(e, !1, -1), e.lineIndent >= t) {
			s = !0, p = e.input.charCodeAt(e.position);
			continue;
		} else {
			e.position = o, e.line = c, e.lineStart = l, e.lineIndent = u;
			break;
		}
		s &&= (U(e, a, o, !1), Rr(e, e.line - c), a = o = e.position, !1), B(p) || (o = e.position + 1), p = e.input.charCodeAt(++e.position);
	}
	return U(e, a, o, !1), e.result ? !0 : (e.kind = d, e.result = f, !1);
}
function Br(e, t) {
	var n = e.input.charCodeAt(e.position), r, i;
	if (n !== 39) return !1;
	for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0;) if (n === 39) if (U(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39) r = e.position, e.position++, i = e.position;
	else return !0;
	else z(n) ? (U(e, r, i, !0), Rr(e, W(e, !1, t)), r = i = e.position) : e.position === e.lineStart && Lr(e) ? H(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
	H(e, "unexpected end of the stream within a single quoted scalar");
}
function Vr(e, t) {
	var n, r, i, a, o, s = e.input.charCodeAt(e.position);
	if (s !== 34) return !1;
	for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (s = e.input.charCodeAt(e.position)) !== 0;) if (s === 34) return U(e, n, e.position, !0), e.position++, !0;
	else if (s === 92) {
		if (U(e, n, e.position, !0), s = e.input.charCodeAt(++e.position), z(s)) W(e, !1, t);
		else if (s < 256 && Dr[s]) e.result += Or[s], e.position++;
		else if ((o = Sr(s)) > 0) {
			for (i = o, a = 0; i > 0; i--) s = e.input.charCodeAt(++e.position), (o = xr(s)) >= 0 ? a = (a << 4) + o : H(e, "expected hexadecimal character");
			e.result += Tr(a), e.position++;
		} else H(e, "unknown escape sequence");
		n = r = e.position;
	} else z(s) ? (U(e, n, r, !0), Rr(e, W(e, !1, t)), n = r = e.position) : e.position === e.lineStart && Lr(e) ? H(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
	H(e, "unexpected end of the stream within a double quoted scalar");
}
function Hr(e, t) {
	var n = !0, r, i, a, o = e.tag, s, c = e.anchor, l, u, d, f, p, m = Object.create(null), h, g, _, v = e.input.charCodeAt(e.position);
	if (v === 91) u = 93, p = !1, s = [];
	else if (v === 123) u = 125, p = !0, s = {};
	else return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = s), v = e.input.charCodeAt(++e.position); v !== 0;) {
		if (W(e, !0, t), v = e.input.charCodeAt(e.position), v === u) return e.position++, e.tag = o, e.anchor = c, e.kind = p ? "mapping" : "sequence", e.result = s, !0;
		n ? v === 44 && H(e, "expected the node content, but found ','") : H(e, "missed comma between flow collection entries"), g = h = _ = null, d = f = !1, v === 63 && (l = e.input.charCodeAt(e.position + 1), V(l) && (d = f = !0, e.position++, W(e, !0, t))), r = e.line, i = e.lineStart, a = e.position, Yr(e, t, sr, !1, !0), g = e.tag, h = e.result, W(e, !0, t), v = e.input.charCodeAt(e.position), (f || e.line === r) && v === 58 && (d = !0, v = e.input.charCodeAt(++e.position), W(e, !0, t), Yr(e, t, sr, !1, !0), _ = e.result), p ? Fr(e, s, m, g, h, _, r, i, a) : d ? s.push(Fr(e, null, m, g, h, _, r, i, a)) : s.push(h), W(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (n = !0, v = e.input.charCodeAt(++e.position)) : n = !1;
	}
	H(e, "unexpected end of the stream within a flow collection");
}
function Ur(e, t) {
	var n, r, i = dr, a = !1, o = !1, s = t, c = 0, l = !1, u, d = e.input.charCodeAt(e.position);
	if (d === 124) r = !1;
	else if (d === 62) r = !0;
	else return !1;
	for (e.kind = "scalar", e.result = ""; d !== 0;) if (d = e.input.charCodeAt(++e.position), d === 43 || d === 45) dr === i ? i = d === 43 ? pr : fr : H(e, "repeat of a chomping mode identifier");
	else if ((u = Cr(d)) >= 0) u === 0 ? H(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? H(e, "repeat of an indentation width identifier") : (s = t + u - 1, o = !0);
	else break;
	if (B(d)) {
		do
			d = e.input.charCodeAt(++e.position);
		while (B(d));
		if (d === 35) do
			d = e.input.charCodeAt(++e.position);
		while (!z(d) && d !== 0);
	}
	for (; d !== 0;) {
		for (Ir(e), e.lineIndent = 0, d = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && d === 32;) e.lineIndent++, d = e.input.charCodeAt(++e.position);
		if (!o && e.lineIndent > s && (s = e.lineIndent), z(d)) {
			c++;
			continue;
		}
		if (e.lineIndent < s) {
			i === pr ? e.result += F.repeat("\n", a ? 1 + c : c) : i === dr && a && (e.result += "\n");
			break;
		}
		for (r ? B(d) ? (l = !0, e.result += F.repeat("\n", a ? 1 + c : c)) : l ? (l = !1, e.result += F.repeat("\n", c + 1)) : c === 0 ? a && (e.result += " ") : e.result += F.repeat("\n", c) : e.result += F.repeat("\n", a ? 1 + c : c), a = !0, o = !0, c = 0, n = e.position; !z(d) && d !== 0;) d = e.input.charCodeAt(++e.position);
		U(e, n, e.position, !1);
	}
	return !0;
}
function Wr(e, t) {
	var n, r = e.tag, i = e.anchor, a = [], o, s = !1, c;
	if (e.firstTabInLine !== -1) return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = a), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, H(e, "tab characters must not be used in indentation")), !(c !== 45 || (o = e.input.charCodeAt(e.position + 1), !V(o))));) {
		if (s = !0, e.position++, W(e, !0, -1) && e.lineIndent <= t) {
			a.push(null), c = e.input.charCodeAt(e.position);
			continue;
		}
		if (n = e.line, Yr(e, t, lr, !1, !0), a.push(e.result), W(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && c !== 0) H(e, "bad indentation of a sequence entry");
		else if (e.lineIndent < t) break;
	}
	return s ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = a, !0) : !1;
}
function Gr(e, t, n) {
	var r, i, a, o, s, c, l = e.tag, u = e.anchor, d = {}, f = Object.create(null), p = null, m = null, h = null, g = !1, _ = !1, v;
	if (e.firstTabInLine !== -1) return !1;
	for (e.anchor !== null && (e.anchorMap[e.anchor] = d), v = e.input.charCodeAt(e.position); v !== 0;) {
		if (!g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, H(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), a = e.line, (v === 63 || v === 58) && V(r)) v === 63 ? (g && (Fr(e, d, f, p, m, null, o, s, c), p = m = h = null), _ = !0, g = !0, i = !0) : g ? (g = !1, i = !0) : H(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, v = r;
		else {
			if (o = e.line, s = e.lineStart, c = e.position, !Yr(e, n, cr, !1, !0)) break;
			if (e.line === a) {
				for (v = e.input.charCodeAt(e.position); B(v);) v = e.input.charCodeAt(++e.position);
				if (v === 58) v = e.input.charCodeAt(++e.position), V(v) || H(e, "a whitespace character is expected after the key-value separator within a block mapping"), g && (Fr(e, d, f, p, m, null, o, s, c), p = m = h = null), _ = !0, g = !1, i = !1, p = e.tag, m = e.result;
				else if (_) H(e, "can not read an implicit mapping pair; a colon is missed");
				else return e.tag = l, e.anchor = u, !0;
			} else if (_) H(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
			else return e.tag = l, e.anchor = u, !0;
		}
		if ((e.line === a || e.lineIndent > t) && (g && (o = e.line, s = e.lineStart, c = e.position), Yr(e, t, ur, !0, i) && (g ? m = e.result : h = e.result), g || (Fr(e, d, f, p, m, h, o, s, c), p = m = h = null), W(e, !0, -1), v = e.input.charCodeAt(e.position)), (e.line === a || e.lineIndent > t) && v !== 0) H(e, "bad indentation of a mapping entry");
		else if (e.lineIndent < t) break;
	}
	return g && Fr(e, d, f, p, m, null, o, s, c), _ && (e.tag = l, e.anchor = u, e.kind = "mapping", e.result = d), _;
}
function Kr(e) {
	var t, n = !1, r = !1, i, a, o = e.input.charCodeAt(e.position);
	if (o !== 33) return !1;
	if (e.tag !== null && H(e, "duplication of a tag property"), o = e.input.charCodeAt(++e.position), o === 60 ? (n = !0, o = e.input.charCodeAt(++e.position)) : o === 33 ? (r = !0, i = "!!", o = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
		do
			o = e.input.charCodeAt(++e.position);
		while (o !== 0 && o !== 62);
		e.position < e.length ? (a = e.input.slice(t, e.position), o = e.input.charCodeAt(++e.position)) : H(e, "unexpected end of the stream within a verbatim tag");
	} else {
		for (; o !== 0 && !V(o);) o === 33 && (r ? H(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), _r.test(i) || H(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), o = e.input.charCodeAt(++e.position);
		a = e.input.slice(t, e.position), gr.test(a) && H(e, "tag suffix cannot contain flow indicator characters");
	}
	a && !vr.test(a) && H(e, "tag name cannot contain such characters: " + a);
	try {
		a = decodeURIComponent(a);
	} catch {
		H(e, "tag name is malformed: " + a);
	}
	return n ? e.tag = a : R.call(e.tagMap, i) ? e.tag = e.tagMap[i] + a : i === "!" ? e.tag = "!" + a : i === "!!" ? e.tag = "tag:yaml.org,2002:" + a : H(e, "undeclared tag handle \"" + i + "\""), !0;
}
function qr(e) {
	var t, n = e.input.charCodeAt(e.position);
	if (n !== 38) return !1;
	for (e.anchor !== null && H(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !V(n) && !br(n);) n = e.input.charCodeAt(++e.position);
	return e.position === t && H(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function Jr(e) {
	var t, n, r = e.input.charCodeAt(e.position);
	if (r !== 42) return !1;
	for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !V(r) && !br(r);) r = e.input.charCodeAt(++e.position);
	return e.position === t && H(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), R.call(e.anchorMap, n) || H(e, "unidentified alias \"" + n + "\""), e.result = e.anchorMap[n], W(e, !0, -1), !0;
}
function Yr(e, t, n, r, i) {
	var a, o, s, c = 1, l = !1, u = !1, d, f, p, m, h, g;
	if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, a = o = s = ur === n || lr === n, r && W(e, !0, -1) && (l = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1) for (; Kr(e) || qr(e);) W(e, !0, -1) ? (l = !0, s = a, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : s = !1;
	if (s &&= l || i, (c === 1 || ur === n) && (h = sr === n || cr === n ? t : t + 1, g = e.position - e.lineStart, c === 1 ? s && (Wr(e, g) || Gr(e, g, h)) || Hr(e, h) ? u = !0 : (o && Ur(e, h) || Br(e, h) || Vr(e, h) ? u = !0 : Jr(e) ? (u = !0, (e.tag !== null || e.anchor !== null) && H(e, "alias node should not have any properties")) : zr(e, h, sr === n) && (u = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (u = s && Wr(e, g))), e.tag === null) e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
	else if (e.tag === "?") {
		for (e.result !== null && e.kind !== "scalar" && H(e, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + e.kind + "\""), d = 0, f = e.implicitTypes.length; d < f; d += 1) if (m = e.implicitTypes[d], m.resolve(e.result)) {
			e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
			break;
		}
	} else if (e.tag !== "!") {
		if (R.call(e.typeMap[e.kind || "fallback"], e.tag)) m = e.typeMap[e.kind || "fallback"][e.tag];
		else for (m = null, p = e.typeMap.multi[e.kind || "fallback"], d = 0, f = p.length; d < f; d += 1) if (e.tag.slice(0, p[d].tag.length) === p[d].tag) {
			m = p[d];
			break;
		}
		m || H(e, "unknown tag !<" + e.tag + ">"), e.result !== null && m.kind !== e.kind && H(e, "unacceptable node kind for !<" + e.tag + "> tag; it should be \"" + m.kind + "\", not \"" + e.kind + "\""), m.resolve(e.result, e.tag) ? (e.result = m.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : H(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
	}
	return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || u;
}
function Xr(e) {
	var t = e.position, n, r, i, a = !1, o;
	for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = Object.create(null), e.anchorMap = Object.create(null); (o = e.input.charCodeAt(e.position)) !== 0 && (W(e, !0, -1), o = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || o !== 37));) {
		for (a = !0, o = e.input.charCodeAt(++e.position), n = e.position; o !== 0 && !V(o);) o = e.input.charCodeAt(++e.position);
		for (r = e.input.slice(n, e.position), i = [], r.length < 1 && H(e, "directive name must not be less than one character in length"); o !== 0;) {
			for (; B(o);) o = e.input.charCodeAt(++e.position);
			if (o === 35) {
				do
					o = e.input.charCodeAt(++e.position);
				while (o !== 0 && !z(o));
				break;
			}
			if (z(o)) break;
			for (n = e.position; o !== 0 && !V(o);) o = e.input.charCodeAt(++e.position);
			i.push(e.input.slice(n, e.position));
		}
		o !== 0 && Ir(e), R.call(Nr, r) ? Nr[r](e, r, i) : Mr(e, "unknown document directive \"" + r + "\"");
	}
	if (W(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, W(e, !0, -1)) : a && H(e, "directives end mark is expected"), Yr(e, e.lineIndent - 1, ur, !1, !0), W(e, !0, -1), e.checkLineBreaks && hr.test(e.input.slice(t, e.position)) && Mr(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Lr(e)) {
		e.input.charCodeAt(e.position) === 46 && (e.position += 3, W(e, !0, -1));
		return;
	}
	if (e.position < e.length - 1) H(e, "end of the stream or a document separator is expected");
	else return;
}
function Zr(e, t) {
	e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += "\n"), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
	var n = new Ar(e, t), r = e.indexOf("\0");
	for (r !== -1 && (n.position = r, H(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
	for (; n.position < n.length - 1;) Xr(n);
	return n.documents;
}
function Qr(e, t, n) {
	typeof t == "object" && t && n === void 0 && (n = t, t = null);
	var r = Zr(e, n);
	if (typeof t != "function") return r;
	for (var i = 0, a = r.length; i < a; i += 1) t(r[i]);
}
function $r(e, t) {
	var n = Zr(e, t);
	if (n.length !== 0) {
		if (n.length === 1) return n[0];
		throw new I("expected a single document in the stream, but found more");
	}
}
var ei = {
	loadAll: Qr,
	load: $r
}, ti = Object.prototype.toString, ni = Object.prototype.hasOwnProperty, ri = 65279, ii = 9, ai = 10, oi = 13, si = 32, ci = 33, li = 34, ui = 35, di = 37, fi = 38, pi = 39, mi = 42, hi = 44, gi = 45, _i = 58, vi = 61, yi = 62, bi = 63, xi = 64, Si = 91, Ci = 93, wi = 96, Ti = 123, Ei = 124, Di = 125, G = {};
G[0] = "\\0", G[7] = "\\a", G[8] = "\\b", G[9] = "\\t", G[10] = "\\n", G[11] = "\\v", G[12] = "\\f", G[13] = "\\r", G[27] = "\\e", G[34] = "\\\"", G[92] = "\\\\", G[133] = "\\N", G[160] = "\\_", G[8232] = "\\L", G[8233] = "\\P";
var Oi = [
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
], ki = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function Ai(e, t) {
	var n, r, i, a, o, s, c;
	if (t === null) return {};
	for (n = {}, r = Object.keys(t), i = 0, a = r.length; i < a; i += 1) o = r[i], s = String(t[o]), o.slice(0, 2) === "!!" && (o = "tag:yaml.org,2002:" + o.slice(2)), c = e.compiledTypeMap.fallback[o], c && ni.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[o] = s;
	return n;
}
function ji(e) {
	var t = e.toString(16).toUpperCase(), n, r;
	if (e <= 255) n = "x", r = 2;
	else if (e <= 65535) n = "u", r = 4;
	else if (e <= 4294967295) n = "U", r = 8;
	else throw new I("code point within a string may not be greater than 0xFFFFFFFF");
	return "\\" + n + F.repeat("0", r - t.length) + t;
}
var Mi = 1, Ni = 2;
function Pi(e) {
	this.schema = e.schema || or, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = F.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = Ai(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === "\"" ? Ni : Mi, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Fi(e, t) {
	for (var n = F.repeat(" ", t), r = 0, i = -1, a = "", o, s = e.length; r < s;) i = e.indexOf("\n", r), i === -1 ? (o = e.slice(r), r = s) : (o = e.slice(r, i + 1), r = i + 1), o.length && o !== "\n" && (a += n), a += o;
	return a;
}
function Ii(e, t) {
	return "\n" + F.repeat(" ", e.indent * t);
}
function Li(e, t) {
	var n, r, i;
	for (n = 0, r = e.implicitTypes.length; n < r; n += 1) if (i = e.implicitTypes[n], i.resolve(t)) return !0;
	return !1;
}
function Ri(e) {
	return e === si || e === ii;
}
function zi(e) {
	return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ri || 65536 <= e && e <= 1114111;
}
function Bi(e) {
	return zi(e) && e !== ri && e !== oi && e !== ai;
}
function Vi(e, t, n) {
	var r = Bi(e), i = r && !Ri(e);
	return (n ? r : r && e !== hi && e !== Si && e !== Ci && e !== Ti && e !== Di) && e !== ui && !(t === _i && !i) || Bi(t) && !Ri(t) && e === ui || t === _i && i;
}
function Hi(e) {
	return zi(e) && e !== ri && !Ri(e) && e !== gi && e !== bi && e !== _i && e !== hi && e !== Si && e !== Ci && e !== Ti && e !== Di && e !== ui && e !== fi && e !== mi && e !== ci && e !== Ei && e !== vi && e !== yi && e !== pi && e !== li && e !== di && e !== xi && e !== wi;
}
function Ui(e) {
	return !Ri(e) && e !== _i;
}
function Wi(e, t) {
	var n = e.charCodeAt(t), r;
	return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Gi(e) {
	return /^\n* /.test(e);
}
var Ki = 1, qi = 2, Ji = 3, Yi = 4, Xi = 5;
function Zi(e, t, n, r, i, a, o, s) {
	var c, l = 0, u = null, d = !1, f = !1, p = r !== -1, m = -1, h = Hi(Wi(e, 0)) && Ui(Wi(e, e.length - 1));
	if (t || o) for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
		if (l = Wi(e, c), !zi(l)) return Xi;
		h &&= Vi(l, u, s), u = l;
	}
	else {
		for (c = 0; c < e.length; l >= 65536 ? c += 2 : c++) {
			if (l = Wi(e, c), l === ai) d = !0, p && (f ||= c - m - 1 > r && e[m + 1] !== " ", m = c);
			else if (!zi(l)) return Xi;
			h &&= Vi(l, u, s), u = l;
		}
		f ||= p && c - m - 1 > r && e[m + 1] !== " ";
	}
	return !d && !f ? h && !o && !i(e) ? Ki : a === Ni ? Xi : qi : n > 9 && Gi(e) ? Xi : o ? a === Ni ? Xi : qi : f ? Yi : Ji;
}
function Qi(e, t, n, r, i) {
	e.dump = function() {
		if (t.length === 0) return e.quotingType === Ni ? "\"\"" : "''";
		if (!e.noCompatMode && (Oi.indexOf(t) !== -1 || ki.test(t))) return e.quotingType === Ni ? "\"" + t + "\"" : "'" + t + "'";
		var a = e.indent * Math.max(1, n), o = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - a), s = r || e.flowLevel > -1 && n >= e.flowLevel;
		function c(t) {
			return Li(e, t);
		}
		switch (Zi(t, s, e.indent, o, c, e.quotingType, e.forceQuotes && !r, i)) {
			case Ki: return t;
			case qi: return "'" + t.replace(/'/g, "''") + "'";
			case Ji: return "|" + $i(t, e.indent) + ea(Fi(t, a));
			case Yi: return ">" + $i(t, e.indent) + ea(Fi(ta(t, o), a));
			case Xi: return "\"" + ra(t) + "\"";
			default: throw new I("impossible error: invalid scalar style");
		}
	}();
}
function $i(e, t) {
	var n = Gi(e) ? String(t) : "", r = e[e.length - 1] === "\n";
	return n + (r && (e[e.length - 2] === "\n" || e === "\n") ? "+" : r ? "" : "-") + "\n";
}
function ea(e) {
	return e[e.length - 1] === "\n" ? e.slice(0, -1) : e;
}
function ta(e, t) {
	for (var n = /(\n+)([^\n]*)/g, r = function() {
		var r = e.indexOf("\n");
		return r = r === -1 ? e.length : r, n.lastIndex = r, na(e.slice(0, r), t);
	}(), i = e[0] === "\n" || e[0] === " ", a, o; o = n.exec(e);) {
		var s = o[1], c = o[2];
		a = c[0] === " ", r += s + (!i && !a && c !== "" ? "\n" : "") + na(c, t), i = a;
	}
	return r;
}
function na(e, t) {
	if (e === "" || e[0] === " ") return e;
	for (var n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = ""; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += "\n" + e.slice(i, a), i = a + 1), o = s;
	return c += "\n", e.length - i > t && o > i ? c += e.slice(i, o) + "\n" + e.slice(o + 1) : c += e.slice(i), c.slice(1);
}
function ra(e) {
	for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++) n = Wi(e, i), r = G[n], !r && zi(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || ji(n);
	return t;
}
function ia(e, t, n) {
	var r = "", i = e.tag, a, o, s;
	for (a = 0, o = n.length; a < o; a += 1) s = n[a], e.replacer && (s = e.replacer.call(n, String(a), s)), (K(e, t, s, !1, !1) || s === void 0 && K(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
	e.tag = i, e.dump = "[" + r + "]";
}
function aa(e, t, n, r) {
	var i = "", a = e.tag, o, s, c;
	for (o = 0, s = n.length; o < s; o += 1) c = n[o], e.replacer && (c = e.replacer.call(n, String(o), c)), (K(e, t + 1, c, !0, !0, !1, !0) || c === void 0 && K(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += Ii(e, t)), e.dump && ai === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
	e.tag = a, e.dump = i || "[]";
}
function oa(e, t, n) {
	var r = "", i = e.tag, a = Object.keys(n), o, s, c, l, u;
	for (o = 0, s = a.length; o < s; o += 1) u = "", r !== "" && (u += ", "), e.condenseFlow && (u += "\""), c = a[o], l = n[c], e.replacer && (l = e.replacer.call(n, c, l)), K(e, t, c, !1, !1) && (e.dump.length > 1024 && (u += "? "), u += e.dump + (e.condenseFlow ? "\"" : "") + ":" + (e.condenseFlow ? "" : " "), K(e, t, l, !1, !1) && (u += e.dump, r += u));
	e.tag = i, e.dump = "{" + r + "}";
}
function sa(e, t, n, r) {
	var i = "", a = e.tag, o = Object.keys(n), s, c, l, u, d, f;
	if (e.sortKeys === !0) o.sort();
	else if (typeof e.sortKeys == "function") o.sort(e.sortKeys);
	else if (e.sortKeys) throw new I("sortKeys must be a boolean or a function");
	for (s = 0, c = o.length; s < c; s += 1) f = "", (!r || i !== "") && (f += Ii(e, t)), l = o[s], u = n[l], e.replacer && (u = e.replacer.call(n, l, u)), K(e, t + 1, l, !0, !0, !0) && (d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, d && (e.dump && ai === e.dump.charCodeAt(0) ? f += "?" : f += "? "), f += e.dump, d && (f += Ii(e, t)), K(e, t + 1, u, !0, d) && (e.dump && ai === e.dump.charCodeAt(0) ? f += ":" : f += ": ", f += e.dump, i += f));
	e.tag = a, e.dump = i || "{}";
}
function ca(e, t, n) {
	var r, i = n ? e.explicitTypes : e.implicitTypes, a, o, s, c;
	for (a = 0, o = i.length; a < o; a += 1) if (s = i[a], (s.instanceOf || s.predicate) && (!s.instanceOf || typeof t == "object" && t instanceof s.instanceOf) && (!s.predicate || s.predicate(t))) {
		if (n ? s.multi && s.representName ? e.tag = s.representName(t) : e.tag = s.tag : e.tag = "?", s.represent) {
			if (c = e.styleMap[s.tag] || s.defaultStyle, ti.call(s.represent) === "[object Function]") r = s.represent(t, c);
			else if (ni.call(s.represent, c)) r = s.represent[c](t, c);
			else throw new I("!<" + s.tag + "> tag resolver accepts not \"" + c + "\" style");
			e.dump = r;
		}
		return !0;
	}
	return !1;
}
function K(e, t, n, r, i, a, o) {
	e.tag = null, e.dump = n, ca(e, n, !1) || ca(e, n, !0);
	var s = ti.call(e.dump), c = r, l;
	r &&= e.flowLevel < 0 || e.flowLevel > t;
	var u = s === "[object Object]" || s === "[object Array]", d, f;
	if (u && (d = e.duplicates.indexOf(n), f = d !== -1), (e.tag !== null && e.tag !== "?" || f || e.indent !== 2 && t > 0) && (i = !1), f && e.usedDuplicates[d]) e.dump = "*ref_" + d;
	else {
		if (u && f && !e.usedDuplicates[d] && (e.usedDuplicates[d] = !0), s === "[object Object]") r && Object.keys(e.dump).length !== 0 ? (sa(e, t, e.dump, i), f && (e.dump = "&ref_" + d + e.dump)) : (oa(e, t, e.dump), f && (e.dump = "&ref_" + d + " " + e.dump));
		else if (s === "[object Array]") r && e.dump.length !== 0 ? (e.noArrayIndent && !o && t > 0 ? aa(e, t - 1, e.dump, i) : aa(e, t, e.dump, i), f && (e.dump = "&ref_" + d + e.dump)) : (ia(e, t, e.dump), f && (e.dump = "&ref_" + d + " " + e.dump));
		else if (s === "[object String]") e.tag !== "?" && Qi(e, e.dump, t, a, c);
		else if (s === "[object Undefined]") return !1;
		else {
			if (e.skipInvalid) return !1;
			throw new I("unacceptable kind of an object to dump " + s);
		}
		e.tag !== null && e.tag !== "?" && (l = encodeURI(e.tag[0] === "!" ? e.tag.slice(1) : e.tag).replace(/!/g, "%21"), l = e.tag[0] === "!" ? "!" + l : l.slice(0, 18) === "tag:yaml.org,2002:" ? "!!" + l.slice(18) : "!<" + l + ">", e.dump = l + " " + e.dump);
	}
	return !0;
}
function la(e, t) {
	var n = [], r = [], i, a;
	for (ua(e, n, r), i = 0, a = r.length; i < a; i += 1) t.duplicates.push(n[r[i]]);
	t.usedDuplicates = Array(a);
}
function ua(e, t, n) {
	var r, i, a;
	if (typeof e == "object" && e) if (i = t.indexOf(e), i !== -1) n.indexOf(i) === -1 && n.push(i);
	else if (t.push(e), Array.isArray(e)) for (i = 0, a = e.length; i < a; i += 1) ua(e[i], t, n);
	else for (r = Object.keys(e), i = 0, a = r.length; i < a; i += 1) ua(e[r[i]], t, n);
}
function da(e, t) {
	t ||= {};
	var n = new Pi(t);
	n.noRefs || la(e, n);
	var r = e;
	return n.replacer && (r = n.replacer.call({ "": r }, "", r)), K(n, 0, r, !0, !0) ? n.dump + "\n" : "";
}
var fa = { dump: da }, pa = ei.load;
ei.loadAll, fa.dump;
//#endregion
//#region node_modules/.pnpm/valibot@1.3.1_typescript@6.0.3/node_modules/valibot/dist/index.mjs
var ma;
/* @__NO_SIDE_EFFECTS__ */
function ha(e) {
	return {
		lang: e?.lang ?? ma?.lang,
		message: e?.message,
		abortEarly: e?.abortEarly ?? ma?.abortEarly,
		abortPipeEarly: e?.abortPipeEarly ?? ma?.abortPipeEarly
	};
}
var ga;
/* @__NO_SIDE_EFFECTS__ */
function _a(e) {
	return ga?.get(e);
}
var va;
/* @__NO_SIDE_EFFECTS__ */
function ya(e) {
	return va?.get(e);
}
var ba;
/* @__NO_SIDE_EFFECTS__ */
function xa(e, t) {
	return ba?.get(e)?.get(t);
}
/* @__NO_SIDE_EFFECTS__ */
function Sa(e) {
	let t = typeof e;
	return t === "string" ? `"${e}"` : t === "number" || t === "bigint" || t === "boolean" ? `${e}` : t === "object" || t === "function" ? (e && Object.getPrototypeOf(e)?.constructor?.name) ?? "null" : t;
}
function q(e, t, n, r, i) {
	let a = i && "input" in i ? i.input : n.value, o = i?.expected ?? e.expects ?? null, s = i?.received ?? /* @__PURE__ */ Sa(a), c = {
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
	}, l = e.kind === "schema", u = i?.message ?? e.message ?? /* @__PURE__ */ xa(e.reference, c.lang) ?? (l ? /* @__PURE__ */ ya(c.lang) : null) ?? r.message ?? /* @__PURE__ */ _a(c.lang);
	u !== void 0 && (c.message = typeof u == "function" ? u(c) : u), l && (n.typed = !1), n.issues ? n.issues.push(c) : n.issues = [c];
}
/* @__NO_SIDE_EFFECTS__ */
function J(e) {
	return {
		version: 1,
		vendor: "valibot",
		validate(t) {
			return e["~run"]({ value: t }, /* @__PURE__ */ ha());
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Ca(e, t) {
	let n = [...new Set(e)];
	return n.length > 1 ? `(${n.join(` ${t} `)})` : n[0] ?? "never";
}
/* @__NO_SIDE_EFFECTS__ */
function wa(e, t, n) {
	return typeof e.fallback == "function" ? e.fallback(t, n) : e.fallback;
}
/* @__NO_SIDE_EFFECTS__ */
function Ta(e, t, n) {
	return typeof e.default == "function" ? e.default(t, n) : e.default;
}
/* @__NO_SIDE_EFFECTS__ */
function Y(e, t) {
	return {
		kind: "schema",
		type: "array",
		reference: Y,
		expects: "Array",
		async: !1,
		item: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ J(this);
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
			} else q(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Ea(e) {
	return {
		kind: "schema",
		type: "boolean",
		reference: Ea,
		expects: "boolean",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ J(this);
		},
		"~run"(e, t) {
			return typeof e.value == "boolean" ? e.typed = !0 : q(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function X(e, t) {
	return {
		kind: "schema",
		type: "literal",
		reference: X,
		expects: /* @__PURE__ */ Sa(e),
		async: !1,
		literal: e,
		message: t,
		get "~standard"() {
			return /* @__PURE__ */ J(this);
		},
		"~run"(e, t) {
			return e.value === this.literal ? e.typed = !0 : q(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Da(e) {
	return {
		kind: "schema",
		type: "number",
		reference: Da,
		expects: "number",
		async: !1,
		message: e,
		get "~standard"() {
			return /* @__PURE__ */ J(this);
		},
		"~run"(e, t) {
			return typeof e.value == "number" && !isNaN(e.value) ? e.typed = !0 : q(this, "type", e, t), e;
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
			return /* @__PURE__ */ J(this);
		},
		"~run"(e, t) {
			let n = e.value;
			if (n && typeof n == "object") {
				e.typed = !0, e.value = {};
				for (let r in this.entries) {
					let i = this.entries[r];
					if (r in n || (i.type === "exact_optional" || i.type === "optional" || i.type === "nullish") && i.default !== void 0) {
						let a = r in n ? n[r] : /* @__PURE__ */ Ta(i), o = i["~run"]({ value: a }, t);
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
					} else if (i.fallback !== void 0) e.value[r] = /* @__PURE__ */ wa(i);
					else if (i.type !== "exact_optional" && i.type !== "optional" && i.type !== "nullish" && (q(this, "key", e, t, {
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
			} else q(this, "type", e, t);
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
			return /* @__PURE__ */ J(this);
		},
		"~run"(e, t) {
			return e.value === void 0 && (this.default !== void 0 && (e.value = /* @__PURE__ */ Ta(this, e, t)), e.value === void 0) ? (e.typed = !0, e) : this.wrapped["~run"](e, t);
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
			return /* @__PURE__ */ J(this);
		},
		"~run"(e, t) {
			return typeof e.value == "string" ? e.typed = !0 : q(this, "type", e, t), e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function Oa(e, t, n) {
	return {
		kind: "schema",
		type: "variant",
		reference: Oa,
		expects: "Object",
		async: !1,
		key: e,
		options: t,
		message: n,
		get "~standard"() {
			return /* @__PURE__ */ J(this);
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
				q(this, "type", e, t, {
					input: n[a],
					expected: /* @__PURE__ */ Ca(o, "|"),
					path: [{
						type: "object",
						origin: "value",
						input: n,
						key: a,
						value: n[a]
					}]
				});
			} else q(this, "type", e, t);
			return e;
		}
	};
}
/* @__NO_SIDE_EFFECTS__ */
function ka(e, t, n) {
	let r = e["~run"]({ value: t }, /* @__PURE__ */ ha(n));
	return {
		typed: r.typed,
		success: !r.issues,
		output: r.value,
		issues: r.issues
	};
}
//#endregion
//#region src/helper/issue-tyepe.ts
var Aa = /* @__PURE__ */ Z({ required: /* @__PURE__ */ Q(/* @__PURE__ */ Ea()) }), ja = /* @__PURE__ */ Z({
	name: /* @__PURE__ */ $(),
	description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
	title: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
	labels: /* @__PURE__ */ Q(/* @__PURE__ */ Y(/* @__PURE__ */ $())),
	projects: /* @__PURE__ */ Q(/* @__PURE__ */ Y(/* @__PURE__ */ $())),
	assignees: /* @__PURE__ */ Q(/* @__PURE__ */ Y(/* @__PURE__ */ $())),
	type: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
	body: /* @__PURE__ */ Y(/* @__PURE__ */ Oa("type", [
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ X("markdown"),
			attributes: /* @__PURE__ */ Z({ value: /* @__PURE__ */ $() })
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ X("input"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				placeholder: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				value: /* @__PURE__ */ Q(/* @__PURE__ */ $())
			}),
			validations: /* @__PURE__ */ Q(Aa)
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ X("textarea"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				placeholder: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				value: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				render: /* @__PURE__ */ Q(/* @__PURE__ */ $())
			}),
			validations: /* @__PURE__ */ Q(Aa)
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ X("dropdown"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				multiple: /* @__PURE__ */ Q(/* @__PURE__ */ Ea()),
				options: /* @__PURE__ */ Y(/* @__PURE__ */ $()),
				default: /* @__PURE__ */ Q(/* @__PURE__ */ Da())
			}),
			validations: /* @__PURE__ */ Q(Aa)
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ X("checkboxes"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $()),
				options: /* @__PURE__ */ Y(/* @__PURE__ */ Z({
					label: /* @__PURE__ */ $(),
					required: /* @__PURE__ */ Q(/* @__PURE__ */ Ea())
				}))
			}),
			validations: /* @__PURE__ */ Q(Aa)
		}),
		/* @__PURE__ */ Z({
			type: /* @__PURE__ */ X("upload"),
			id: /* @__PURE__ */ $(),
			attributes: /* @__PURE__ */ Z({
				label: /* @__PURE__ */ $(),
				description: /* @__PURE__ */ Q(/* @__PURE__ */ $())
			}),
			validations: /* @__PURE__ */ Q(Aa)
		})
	]))
});
//#endregion
//#region src/helper/yml.ts
function Ma(e) {
	let t = d(process.cwd(), ".github", "ISSUE_TEMPLATE");
	return e.map((e) => {
		let n = /* @__PURE__ */ ka(ja, pa(o(d(t, e), "utf8")));
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
async function Na(e) {
	return await Pt({
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
function Pa({ items: e, selectedItems: t, title: n }) {
	let r = new Set(t);
	return {
		title: n,
		contents: `${e.map((e) => `- [${r.has(e) ? "x" : " "}] ${e}`).join("\n")}\n`
	};
}
//#endregion
//#region src/helper/create-contents.ts
async function Fa(e) {
	let { createOk: t, createNg: n } = g, { createNone: r, createSome: i } = h;
	switch (e.type) {
		case "markdown": return console.log((0, P.blue)(e.attributes.value)), t(r());
		case "input": {
			console.log(`${(0, P.bold)((0, P.blue)(e.attributes.label))} ${e.validations?.required ? (0, P.red)("*") : ""}\n\n`), console.log((0, P.blue)(e.attributes.description || "No description") + "\n");
			let r = await Mt({
				message: e.attributes.label,
				placeholder: e.attributes.placeholder
			});
			return r.isErr ? n(r.err) : e.validations?.required && r.value.trim().length === 0 ? n(/* @__PURE__ */ Error("This field is required")) : t(i({
				title: e.attributes.label,
				contents: r.value
			}));
		}
		case "textarea": {
			console.log(`${(0, P.bold)((0, P.blue)(e.attributes.label))} ${e.validations?.required ? (0, P.red)("*") : ""}\n\n`), console.log((0, P.blue)(e.attributes.description || "No description") + "\n");
			let r = await Nt({
				message: e.attributes.label,
				placeholder: e.attributes.placeholder
			});
			return r.isErr ? n(r.err) : e.validations?.required && r.value.trim().length === 0 ? n(/* @__PURE__ */ Error("This field is required")) : t(i({
				title: e.attributes.label,
				contents: r.value
			}));
		}
		case "checkboxes": {
			console.log(`${(0, P.bold)((0, P.blue)(e.attributes.label))} ${e.validations?.required ? (0, P.red)("*") : ""}\n\n`), console.log((0, P.blue)(e.attributes.description || "No description") + "\n");
			let r = e.attributes.options.map((e) => ({
				title: e.label,
				value: e.label,
				selected: e.required || !1
			})), a = await Ft({
				message: e.attributes.label,
				options: r
			});
			if (a.isErr) return n(a.err);
			if (e.validations?.required && a.value.length === 0) return n(/* @__PURE__ */ Error("At least one option must be selected"));
			for (let t of e.attributes.options) if (t.required && !a.value.includes(t.label)) return n(/* @__PURE__ */ Error(`The option "${t.label}" is required`));
			return t(i(Pa({
				items: e.attributes.options.map((e) => e.label),
				selectedItems: a.value,
				title: e.attributes.label
			})));
		}
		case "dropdown": {
			console.log(`${(0, P.bold)((0, P.blue)(e.attributes.label))} ${e.validations?.required ? (0, P.red)("*") : ""}\n\n`), console.log((0, P.blue)(e.attributes.description || "No description") + "\n");
			let r = e.attributes.options.map((t, n) => ({
				title: t,
				value: t,
				selected: e.attributes.default === n
			})), a = await Pt({
				message: e.attributes.label,
				options: r
			});
			return a.isErr ? n(a.err) : e.validations?.required && a.value === "" ? n(/* @__PURE__ */ Error("This field is required")) : t(i({
				title: e.attributes.label,
				contents: a.value
			}));
		}
		case "upload": return console.log(`${(0, P.bold)((0, P.blue)(e.attributes.label))} ${e.validations?.required ? (0, P.red)("*") : ""}\n\n`), console.log((0, P.blue)(e.attributes.description || "No description") + "\n"), console.log((0, P.blue)("File upload is not supported in this version") + "\n"), t(r());
		default: return n(/* @__PURE__ */ Error(`Unsupported content type: ${e.type}`));
	}
}
//#endregion
//#region src/helper/write-issue-markdown.ts
var Ia = "title", La = [
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
], Ra = [
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
function za(e) {
	let { createNg: t, createOk: n } = g, r = e.find((e) => e.title === Ia);
	if (!r) return t(/* @__PURE__ */ Error("Title content is required"));
	let i = e.filter((e) => e.title !== Ia), a = [
		"---",
		`title: ${r.contents}`,
		"---",
		""
	];
	for (let e of i) a.push(`## ${e.title}`, "", e.contents, "");
	return n(a.join("\n"));
}
function Ba() {
	return `${La[re(0, La.length)]}-${Ra[re(0, Ra.length)]}-${re(1e3, 1e4)}.md`;
}
async function Va(e, t = process.cwd()) {
	let { checkPromiseReturn: r, createNg: a, createOk: o } = g, { optionConversion: s } = h, c = d(t, ".gh-issue"), l = za(e);
	if (l.isErr) return l;
	let u = await r({
		fn: async () => s(await n(c, { recursive: !0 })),
		err: (e) => a(e)
	});
	if (u.isErr) return u;
	for (let e = 0; e < 10; e++) {
		let e = d(c, Ba()), t = await r({
			fn: async () => s(await i(e, l.value, { flag: "wx" })),
			err: (e) => a(e)
		});
		if (t.isOk) return o(e);
		if (!(t.err instanceof Error && "code" in t.err && t.err.code === "EEXIST")) return t;
	}
	return a(/* @__PURE__ */ Error("Failed to generate a unique markdown file name"));
}
//#endregion
//#region src/action/create.ts
async function Ha() {
	let { checkResultReturn: e, createNg: t } = g, { optionConversion: n } = h;
	a(d(process.cwd(), ".gh-issue")) || (console.error(".gh-issue directory does not exist. Please run `gh-issue init` first."), process.exit(1));
	let r = Ht(), i = [];
	r.isErr && (console.error(`Error: ${r.err.message}`), process.exit(1));
	let o = e({
		fn: () => Ma(r.value),
		err: (e) => t(e)
	});
	o.isErr && (console.error(`Error: ${o.err.message}`), process.exit(1));
	let s = await Na(o.value.map((e) => ({
		name: e.name,
		fileName: e.fileName
	})));
	s.isErr && (console.error(`Error: ${s.err.message}`), process.exit(1));
	let c = n(o.value.find((e) => e.fileName === s.value));
	c.isNone && (console.error("Error: Selected template not found"), process.exit(1)), console.log(`${(0, P.bold)((0, P.green)(c.value.name))}\n`), console.log(c.value.contents.description ? `${c.value.contents.description}\n` : "No contents provided.\n");
	let l = await Mt({
		message: "Enter the issue title",
		placeholder: "Issue title"
	});
	l.isErr && (console.error(`Error: ${l.err.message}`), process.exit(1)), i.push({
		title: "title",
		contents: l.value
	});
	for (let e of c.value.contents.body) {
		let t = await Fa(e);
		t.isErr && (console.error(`Error: ${t.err.message}`), process.exit(1)), t.value.isSome && i.push(t.value.value);
	}
	let u = await Va(i);
	u.isErr && (console.error(`Error: ${u.err.message}`), process.exit(1)), console.log(`Saved issue draft: ${u.value}`);
}
//#endregion
//#region src/helper/draft-issue.ts
var Ua = ".gh-issue", Wa = `${Ua}/README.md`;
async function Ga(e = process.cwd()) {
	let { checkPromiseReturn: t, createNg: n, createOk: r } = g, i = await t({
		fn: () => m(`${Ua}/**/*.md`, {
			cwd: e,
			onlyFiles: !0,
			dot: !0
		}),
		err: (e) => n(e)
	});
	return i.isErr ? i : r(i.value.filter((e) => e !== Wa));
}
function Ka(e, t = process.cwd()) {
	let n = o(d(t, e), "utf8").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!n) throw Error(`Missing front matter in ${e}`);
	let [, r, i] = n, a = r.match(/^title:\s*(.+)$/m);
	if (!a) throw Error(`Missing title in front matter: ${e}`);
	return {
		filePath: e,
		title: a[1].trim(),
		body: i.trim()
	};
}
//#endregion
//#region src/command/send.ts
async function qa(e) {
	return await Ft({
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
function Ja(e) {
	return ie("gh", e, {
		encoding: "utf8",
		stdio: [
			"ignore",
			"pipe",
			"pipe"
		]
	}).trim();
}
function Ya() {
	Ja(["auth", "status"]);
}
function Xa() {
	return Ja([
		"repo",
		"view",
		"--json",
		"nameWithOwner",
		"--jq",
		".nameWithOwner"
	]);
}
function Za(e) {
	return Ja([
		"issue",
		"create",
		"--title",
		e.title,
		"--body",
		e.body
	]);
}
async function Qa() {
	let { checkResultReturn: e, checkResultVoid: t, createNg: n } = g, r = await Ga();
	r.isErr && (console.error(`Error: ${r.err.message}`), process.exit(1)), r.value.length === 0 && (console.error("No issue drafts found in .gh-issue."), process.exit(1));
	let i = await qa(r.value);
	i.isErr && (console.error(`Error: ${i.err.message}`), process.exit(1)), i.value.length === 0 && (console.error("No issue drafts selected."), process.exit(1));
	let a = t({
		fn: () => Ya(),
		err: (e) => n(/* @__PURE__ */ Error(`gh authentication check failed. Please run \`gh auth login\`: ${e instanceof Error ? e.message : "Unknown error"}`))
	});
	a.isErr && (console.error(`Error: ${a.err.message}`), process.exit(1));
	let o = e({
		fn: () => Xa(),
		err: (e) => n(/* @__PURE__ */ Error(`Failed to resolve the current GitHub repository. Please check the git remote and gh repository access: ${e instanceof Error ? e.message : "Unknown error"}`))
	});
	o.isErr && (console.error(`Error: ${o.err.message}`), process.exit(1)), console.log(`${(0, P.bold)((0, P.green)("Repository"))}\n${o.value}\n`);
	let s = Et();
	s.start("Sending issue drafts...");
	for (let t of i.value) {
		s.message(`Sending ${t}...`);
		let r = Ka(t), i = e({
			fn: () => Za(r),
			err: (e) => n(/* @__PURE__ */ Error(`Failed to create issue for ${t} with gh CLI: ${e instanceof Error ? e.message : "Unknown error"}`))
		});
		i.isErr && (s.stop(`Failed while sending ${t}`), console.error(`Error: ${i.err.message}`), process.exit(1)), c(d(process.cwd(), t)), s.message(`Sent ${t}`), console.log(`${(0, P.bold)((0, P.green)("Issue created successfully"))}\n${i.value}\n`), console.log(`${(0, P.bold)((0, P.green)("Removed draft"))}\n${t}\n`);
	}
	s.stop("All selected drafts were sent.");
}
//#endregion
//#region src/command/core.ts
function $a() {
	let t = new e().description("Create GitHub issue templates").version("0.0.0");
	return t.command("init").description("Create bug report and feature request issue templates").action(Vt), t.command("create").description("Create an issue template").action(Ha), t.command("send").description("Send an issue draft to GitHub").action(Qa), t;
}
async function eo(e = process.argv) {
	await $a().parseAsync(e);
}
//#endregion
//#region src/run.ts
var to = () => process.exit(0);
process.on("SIGTERM", to), process.on("SIGINT", to);
async function no(e = process.argv) {
	await eo(e);
}
//#endregion
//#region src/templates.ts
var ro = "issue", io = "en", ao = ["bug_report", "feature_request"], oo = new Map([["bug", "bug_report"], ["feature", "feature_request"]]);
function so(e, t) {
	let n = po(e), r = t === "ja" ? `${n}_ja` : n, i = u(p(import.meta.url));
	return [d(i, "template", t, `${r}.yml`), d(i, "..", "template", t, `${r}.yml`)];
}
function co(e) {
	let t = e.findIndex((e) => e === "--lang" || e === "-l");
	return t === -1 ? io : e[t + 1] ?? io;
}
function lo(e, t) {
	return e[t - 1] === "--lang" || e[t - 1] === "-l";
}
async function uo(e, t = io) {
	let [n, i] = so(e, t);
	try {
		return await r(n, "utf8");
	} catch (e) {
		if (e instanceof Error && "code" in e && e.code === "ENOENT") return r(i, "utf8");
		throw e;
	}
}
function fo(e) {
	let t = e.includes("--force") || e.includes("-f"), n = co(e), r = e.find((t, n) => !t.startsWith("-") && !lo(e, n)) ?? ro;
	return {
		force: t,
		language: n,
		name: po(r.endsWith(".yml") ? r.slice(0, -4) : r)
	};
}
function po(e) {
	return oo.get(e) ?? e;
}
async function mo(e, t = process.cwd()) {
	let { force: n, language: r, name: i } = fo(e);
	return ho(i, n, r, t);
}
async function ho(e, t, r, a) {
	let o = d(a, ".github", "ISSUE_TEMPLATE"), s = d(o, `${e}.yml`), c = await uo(e, r);
	return await n(o, { recursive: !0 }), await i(s, c, { flag: t ? "w" : "wx" }), s;
}
async function go(e, t = process.cwd()) {
	let n = e.includes("--force") || e.includes("-f"), r = co(e);
	return Promise.all(ao.map((e) => ho(e, n, r, t)));
}
//#endregion
//#region src/index.ts
async function _o(e = process.argv) {
	await no(e);
}
await _o();
//#endregion
export { mo as createIssueTemplate, uo as createIssueTemplateYaml, go as initIssueTemplates, _o as main };

//# sourceMappingURL=index.mjs.map