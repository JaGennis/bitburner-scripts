/** @param {NS} ns **/
export async function main(ns) {

	function hackAnalyzeSecurity(i) {
		return i * 0.002
	}

	function weakenAnalyze(i) {
		return i * 0.05
	}

	while (true) {
		var hackTime = ns.getHackTime(ns.args[0])
		var growTime = ns.getGrowTime(ns.args[0])
		var weakenTime = ns.getWeakenTime(ns.args[0])

		var delay = 1000

		var hackThreads = 1
		var hackCores = ns.getServer("first-stage").cpuCores
		var growThreads = 1
		var growCores = ns.getServer("second-stage").cpuCores
		var weakenThreads = 1
		var weakenCores = ns.getServer("second-stage").cpuCores
		var weaken2Threads = 1
		var weaken2Cores = ns.getServer("third-stage").cpuCores

		while (true) {

			var hackSecIncrease = ns.hackAnalyzeSecurity(hackThreads)
			var newWeaken2Threads = weaken2Threads
			while (hackSecIncrease - ns.weakenAnalyze(newWeaken2Threads, weaken2Cores) > 0)
				newWeaken2Threads++

			var stolenPercent = ns.hackAnalyze(ns.args[0]) * hackThreads
			var newGrowThreads = Math.ceil(ns.growthAnalyze(ns.args[0], 1 / (1 - stolenPercent), growCores))
			var growSecIncrease = ns.growthAnalyzeSecurity(newGrowThreads)

			var newWeakenThreads = weakenThreads
			while (growSecIncrease - ns.weakenAnalyze(newWeakenThreads, weakenCores) > 0)
				newWeakenThreads++

			var newHackThreads = hackThreads + 1

			if (stolenPercent >= 0.99
				|| ns.getScriptRam("weaken.js") * newWeaken2Threads > ns.getServerMaxRam("third-stage")
				|| ns.getScriptRam("weaken.js") * newWeakenThreads
				+ ns.getScriptRam("grow.js") * newGrowThreads > ns.getServerMaxRam("second-stage")
				|| ns.getScriptRam("hack.js") * newHackThreads > ns.getServerMaxRam("first-stage"))
				break
			else {
				weaken2Threads = newWeaken2Threads
				growThreads = newGrowThreads
				weakenThreads = newWeakenThreads
				hackThreads++
			}
		}

		const zip = (...rows) => [...rows[0]].map((_, c) => rows.map(row => row[c]))

		var times = [weakenTime + (delay * 2), weakenTime, growTime + delay, hackTime + (delay * 3)]
		var scripts = ["weaken.js", "weaken.js", "grow.js", "hack.js"]
		var threads = [weaken2Threads, weakenThreads, growThreads, hackThreads]
		var servers = ["third-stage", "second-stage", "second-stage", "first-stage"]
		var sorted = zip(times, scripts, threads, servers).sort(function (a, b) { return b[0] - a[0] })

		ns.print(sorted)

		ns.exec(sorted[0][1], sorted[0][3], sorted[0][2], ns.args[0])
		await ns.sleep(sorted[0][0] - sorted[1][0])
		ns.exec(sorted[1][1], sorted[1][3], sorted[1][2], ns.args[0])
		await ns.sleep(sorted[1][0] - sorted[2][0])
		ns.exec(sorted[2][1], sorted[2][3], sorted[2][2], ns.args[0])
		await ns.sleep(sorted[2][0] - sorted[3][0])
		ns.exec(sorted[3][1], sorted[3][3], sorted[3][2], ns.args[0])
	}
}