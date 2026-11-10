// Minimal robots.txt evaluator (RFC 9309 subset): groups by user-agent,
// Allow/Disallow with `*` and `$`, longest match wins, Allow wins a tie.
// Kept local and dependency-free; it only ever reads one host's robots.txt.

type Rule = { allow: boolean; pattern: string };
type Group = { agents: string[]; rules: Rule[]; crawlDelay?: number };

export function parseRobots(text: string): Group[] {
  const groups: Group[] = [];
  let current: Group | null = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (!line) continue;
    const idx = line.indexOf(':');
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === 'user-agent') {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (!current) continue;
    if (key === 'allow' || key === 'disallow') {
      // An empty Disallow means "allow everything"; it adds no rule.
      if (value) current.rules.push({ allow: key === 'allow', pattern: value });
    } else if (key === 'crawl-delay') {
      const n = Number(value);
      if (Number.isFinite(n) && n >= 0) current.crawlDelay = n;
    }
  }
  return groups;
}

function patternToRegex(pattern: string): RegExp {
  const anchored = pattern.endsWith('$');
  const body = (anchored ? pattern.slice(0, -1) : pattern)
    .split('*')
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');
  return new RegExp(`^${body}${anchored ? '$' : ''}`);
}

function groupFor(groups: Group[], userAgentToken: string): Group | null {
  const token = userAgentToken.toLowerCase();
  const specific = groups.filter((g) => g.agents.some((a) => a !== '*' && token.includes(a)));
  if (specific.length) return { agents: [token], rules: specific.flatMap((g) => g.rules), crawlDelay: specific[0].crawlDelay };
  const star = groups.filter((g) => g.agents.includes('*'));
  if (star.length) return { agents: ['*'], rules: star.flatMap((g) => g.rules), crawlDelay: star[0].crawlDelay };
  return null;
}

export type RobotsVerdict = { allowed: boolean; matchedRule: string | null; crawlDelaySeconds?: number };

export function robotsAllows(robotsText: string, userAgentToken: string, pathWithQuery: string): RobotsVerdict {
  const group = groupFor(parseRobots(robotsText), userAgentToken);
  if (!group) return { allowed: true, matchedRule: null };
  let best: Rule | null = null;
  for (const rule of group.rules) {
    if (!patternToRegex(rule.pattern).test(pathWithQuery)) continue;
    if (!best || rule.pattern.length > best.pattern.length || (rule.pattern.length === best.pattern.length && rule.allow)) best = rule;
  }
  return {
    allowed: best ? best.allow : true,
    matchedRule: best ? `${best.allow ? 'Allow' : 'Disallow'}: ${best.pattern}` : null,
    crawlDelaySeconds: group.crawlDelay,
  };
}
