// One JSON object per line on stdout, so the host's log collector can aggregate
// events (sign-ups, reveals, solves, posted solutions) into usage metrics.
export function logEvent(event: string, data: Record<string, unknown> = {}) {
    console.log(JSON.stringify({ time: new Date().toISOString(), event, ...data }));
}
