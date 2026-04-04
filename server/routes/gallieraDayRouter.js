const express = require('express');
const bodyParser = require('body-parser');
const cors = require('./cors');
const DOMParser = require('dom-parser');

const gallieraUrl = 'https://www.cinemateatrogalliera.it';
const categoryUrl = `${gallieraUrl}/category/cinema/`;

const italianMonths = {
    'gennaio': 0, 'febbraio': 1, 'marzo': 2, 'aprile': 3,
    'maggio': 4, 'giugno': 5, 'luglio': 6, 'agosto': 7,
    'settembre': 8, 'ottobre': 9, 'novembre': 10, 'dicembre': 11
};
const monthNamesShort = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];
const weekDaysShort = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

const { decodeEntities } = require('../parseUtils');

// "22 marzo" → "YYYY-MM-DD"
// Prefers current year; uses next year if date is more than 14 days in the past.
const parseItalianDate = (text) => {
    const match = text.match(/(\d{1,2})\s+(gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre)/i);
    if (!match) return null;
    const dayNum = parseInt(match[1]);
    const monthIdx = italianMonths[match[2].toLowerCase()];
    const now = new Date();
    const currentYear = now.getFullYear();
    const candidate = new Date(currentYear, monthIdx, dayNum);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    const year = candidate >= fourteenDaysAgo ? currentYear : currentYear + 1;
    const pad = n => String(n).padStart(2, '0');
    return `${year}-${pad(monthIdx + 1)}-${pad(dayNum)}`;
};

// "2026-03-22" → "Dom 22 Mar 26"
const isoToClientDate = (isoDate) => {
    const d = new Date(isoDate + 'T12:00:00');
    return `${weekDaysShort[d.getDay()]} ${d.getDate()} ${monthNamesShort[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`;
};

// Extract all times from a plain-text line.
// Handles: "ore 21:00", "ore 19:00 e 21:30"
const extractTimes = (plain) => {
    const times = [];
    const re = /ore\s+(\d{1,2})[.:](\d{2})(?:\s+e\s+(\d{1,2})[.:](\d{2}))?/gi;
    let m;
    while ((m = re.exec(plain)) !== null) {
        times.push(`${m[1].padStart(2, '0')}:${m[2]}`);
        if (m[3]) times.push(`${m[3].padStart(2, '0')}:${m[4]}`);
    }
    return times;
};

// Build text to show after movie link (prima visione, etc.), stripping time/VO noise
const buildExtras = (line, plain) => {
    const afterLink = decodeEntities(
        line.replace(/<a[^>]+>[\s\S]*?<\/a>/gi, '').replace(/<[^>]+>/g, ' ')
    )
        .replace(/ore\s+\d+[.:]\d+(\s+e\s+\d+[.:]\d+)?/gi, '')
        .replace(/V\.O\.S\.?\*?/gi, '')
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/^[–—\-\.\|\*\s]+/, '')
        .trim();
    return afterLink ? `<p>${afterLink}</p>` : '';
};

const buildEntry = (key, slug, title, time, day, movieUrl, imageMap, isVO, extras) => ({
    key,
    id: slug,
    categoryId: 'film',
    repeatId: `${slug}-${time.replace(':', '')}`,
    title,
    place: 'Cinema Teatro Galliera',
    date: isoToClientDate(day),
    time,
    url: `${movieUrl}/`,
    image: imageMap[slug] || '',
    isVO,
    isMUSIC: false,
    extras,
    durata: '',
    buyLink: ''
});

// In-memory cache for the category page HTML
let cachedHtml = null;
let cacheTime = 0;
let fetchPromise = null;
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const getCategoryPage = () => {
    const now = Date.now();
    if (cachedHtml && (now - cacheTime < CACHE_TTL)) return Promise.resolve(cachedHtml);
    if (fetchPromise) return fetchPromise;
    fetchPromise = fetch(categoryUrl)
        .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
        .then(html => {
            cachedHtml = html;
            cacheTime = Date.now();
            fetchPromise = null;
            return html;
        })
        .catch(err => { fetchPromise = null; throw err; });
    return fetchPromise;
};

const parseGallieraCategoryPage = (html, day) => {
    try {
        const parser = new DOMParser();
        const parsed = parser.parseFromString(html, 'text/html');

        // Build slug → image map from every linked image on the page
        const imageMap = {};
        const allLinks = parsed.getElementsByTagName('a');
        for (let i = 0; i < allLinks.length; i++) {
            const href = (allLinks[i].getAttribute('href') || '').replace(/\/$/, '');
            if (!href.startsWith(gallieraUrl)) continue;
            const slug = href.split('/').pop();
            if (!slug || imageMap[slug]) continue;
            const imgs = allLinks[i].getElementsByTagName('img');
            if (imgs.length) imageMap[slug] = imgs[0].getAttribute('src') || '';
        }

        const contentEls = parsed.getElementsByClassName('entry-content');
        if (!contentEls.length) return [{ day, movies: [] }];

        const movies = [];
        let key = 0;

        for (let ci = 0; ci < contentEls.length; ci++) {
            // Split content into lines on <br>
            const rawContent = contentEls[ci].innerHTML
                .replace(/<br\s*\/?>/gi, '\n')
                .replace(/&nbsp;/g, ' ');
            const lines = rawContent.split('\n');

            let currentDateStr = null; // date currently being parsed
            let pendingTimes = [];     // times waiting for a movie link (combined date+time lines)
            let lastSlug = null;       // last movie slug seen (for "in replica" lines)
            let lastTitle = null;
            let lastMovieUrl = null;
            let lastIsVO = 0;

            for (const line of lines) {
                const plain = line.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
                if (!plain) continue;

                const hasMonth = /gennaio|febbraio|marzo|aprile|maggio|giugno|luglio|agosto|settembre|ottobre|novembre|dicembre/i.test(plain);
                const hasBullet = plain.includes('●') || plain.includes('•');

                // ── Date header line ────────────────────────────────────────
                if (hasBullet && hasMonth) {
                    // "● da X aprile" — opening date, no specific screening time → skip
                    if (/\bda\s+\w+\s+\d{1,2}/i.test(plain)) {
                        currentDateStr = null;
                        pendingTimes = [];
                        continue;
                    }

                    // "● in replica DATE ore TIME" — reuse last seen movie on new date+time
                    if (/\bin\s+replica\b/i.test(plain)) {
                        const replicaDate = parseItalianDate(plain);
                        const replicaTimes = extractTimes(plain);
                        if (replicaDate === day && replicaTimes.length && lastSlug) {
                            const extras = '';
                            for (const t of replicaTimes) {
                                movies.push(buildEntry(key++, lastSlug, lastTitle, t, day, lastMovieUrl, imageMap, lastIsVO, extras));
                            }
                        }
                        // Don't change currentDateStr — this line belongs to the previous block
                        continue;
                    }

                    // Normal date header: "● domenica 05 aprile" or "● giovedì 09 aprile ore 21:00"
                    currentDateStr = parseItalianDate(plain);
                    pendingTimes = extractTimes(plain); // non-empty only for combined format
                    continue;
                }

                // Always track the last seen galliera link (needed for "in replica" cross-day detection)
                const anyLink = line.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
                if (anyLink && anyLink[1].startsWith(gallieraUrl)) {
                    lastSlug = anyLink[1].replace(/\/$/, '').split('/').pop() || null;
                    lastTitle = decodeEntities(anyLink[2].replace(/<[^>]+>/g, '').trim());
                    lastMovieUrl = anyLink[1].replace(/\/$/, '');
                    lastIsVO = /V\.O\.S/i.test(plain) ? 1 : 0;
                }

                // ── Lines that don't match the requested day → skip ─────────
                if (!currentDateStr || currentDateStr !== day) continue;

                // ── We're on the right day ───────────────────────────────────
                const linkMatch = line.match(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i);
                const isGallieraLink = linkMatch && linkMatch[1].startsWith(gallieraUrl);

                if (!linkMatch || !isGallieraLink) {
                    // No galliera link on this line — check for a time to store as pending
                    const times = extractTimes(plain);
                    if (times.length) pendingTimes = times;
                    continue;
                }

                // ── Has a Galliera link ──────────────────────────────────────
                const movieUrl = linkMatch[1].replace(/\/$/, '');
                const title = decodeEntities(linkMatch[2].replace(/<[^>]+>/g, '').trim());
                const slug = movieUrl.split('/').pop() || '';
                const isVO = /V\.O\.S/i.test(plain) ? 1 : 0;
                const extras = buildExtras(line, plain);

                // Does this line carry its own "ore HH:MM"?
                const inlineTimes = extractTimes(plain);

                const timesToUse = inlineTimes.length ? inlineTimes : pendingTimes;

                if (timesToUse.length) {
                    for (const t of timesToUse) {
                        movies.push(buildEntry(key++, slug, title, t, day, movieUrl, imageMap, isVO, extras));
                    }
                    if (!inlineTimes.length) pendingTimes = [];
                }
                // If no time at all: skip (can't place it in calendar)
            }
        }

        return [{ day, movies }];
    } catch (error) {
        console.log(error);
        return [{ day, movies: [] }];
    }
};

const gallieraDayRouter = express.Router();
gallieraDayRouter.use(bodyParser.json());

gallieraDayRouter.route('*')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); });

gallieraDayRouter.route('/:day')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, (req, res, next) => {
    return getCategoryPage()
        .then(html => {
            res.json(parseGallieraCategoryPage(html, req.params.day));
        })
        .catch((err) => { console.log(err); next(err); });
})
.post(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported for /galliera-day');
})
.put(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported for /galliera-day');
})
.delete(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported for /galliera-day');
});

module.exports = gallieraDayRouter;
