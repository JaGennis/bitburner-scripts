/** @param {NS} ns **/
export async function main(ns) {
	var hackTime = ns.getHackTime(ns.args[0])
	var growTime = ns.getGrowTime(ns.args[0])
	var weakenTime = ns.getWeakenTime(ns.args[0])

	var delay = 1000

	var threads = 1

	var weakenSec = -0.05
	ns.tprint(ns.growthAnalyze(ns.args[0]))

	const zip = (a, b) => a.map((k, i) => [k, b[i]]);

	var times = [weakenTime + (delay * 2), weakenTime, growTime + delay, hackTime + (delay * 3)]
	var scripts = ["weaken.js", "weaken.js", "grow.js", "hack.js"]
	var sorted = zip(times, scripts).sort(function (a, b) { return b[0] - a[0]})

	ns.run(sorted[0][1], threads, ns.args[0])
	await ns.sleep(sorted[0][0] - sorted[1][0])
	ns.run(sorted[1][1], threads, ns.args[0])
	await ns.sleep(sorted[1][0] - sorted[2][0])
	ns.run(sorted[2][1], threads, ns.args[0])
	await ns.sleep(sorted[2][0] - sorted[3][0])
	ns.run(sorted[3][1], threads, ns.args[0])

}
