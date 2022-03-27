/** @param {NS} ns **/
import { getAllServers } from "helper-functions.js";
export async function main(ns) {

	function hackAnalyzeSecurity(i) {
		return i * 0.002
	}

	function weakenAnalyze(i) {
		return i * 0.05
	}

	while (true) {

		var delay = 200

		var metaHack  = {time:ns.getHackTime(ns.args[0]) + (delay*3), threads:1, script:"/hwgw/hack.js"}
		var metaWeak  = {time:ns.getWeakenTime(ns.args[0]) + (delay*2), threads:1, script:"/hwgw/weaken.js"}
		var metaGrow  = {time:ns.getGrowTime(ns.args[0]) + delay, threads:1, script:"/hwgw/grow.js"}
		var metaWeak2 = {time:ns.getWeakenTime(ns.args[0]), threads:1, script:"/hwgw/weaken2.js"}

		function getFreeRam(server){
			return ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
		}

		var biggestServer = getAllServers(ns)
			.filter(item => ns.hasRootAccess(item)
						&& !ns.scriptRunning("/hwgw/weaken2.js", item)
						&& item !== "home")
			.sort(function (a, b) { return getFreeRam(b) - getFreeRam(a)})[0]

		ns.print("Biggest Server: " + biggestServer + " with " + getFreeRam(biggestServer) + " RAM")

		await ns.scp(metaHack.script, biggestServer)
		await ns.scp(metaWeak.script, biggestServer)
		await ns.scp(metaGrow.script, biggestServer)
		await ns.scp(metaWeak2.script, biggestServer)

		var cores = ns.getServer(biggestServer).cores

		while (true) {

			var newHackThreads = metaHack.threads + 1

			var hackSecIncrease = ns.hackAnalyzeSecurity(newHackThreads)
			var newWeakenThreads = metaWeak.threads
			while (hackSecIncrease - ns.weakenAnalyze(newWeakenThreads, cores) > 0)
				newWeakenThreads++

			var stolenPercent = ns.hackAnalyze(ns.args[0]) * metaHack.threads
			var newGrowThreads = Math.ceil(ns.growthAnalyze(ns.args[0], 1 / (1 - stolenPercent), cores))

			var growSecIncrease = ns.growthAnalyzeSecurity(newGrowThreads)
			var newWeaken2Threads = metaWeak2.threads
			while (growSecIncrease - ns.weakenAnalyze(newWeaken2Threads, cores) > 0)
				newWeaken2Threads++

			if (stolenPercent >= 0.95 ||
				ns.getScriptRam(metaHack.script) * newHackThreads
				+ ns.getScriptRam(metaWeak.script) * newWeakenThreads
				+ ns.getScriptRam(metaGrow.script) * newGrowThreads
				+ ns.getScriptRam(metaWeak2.script) * newWeaken2Threads
				> getFreeRam(biggestServer))
				break
			else {
				metaHack.threads  = newHackThreads
				metaWeak.threads  = newWeakenThreads
				metaGrow.threads  = newGrowThreads
				metaWeak2.threads = newWeaken2Threads
			}
		}

		var sorted = [metaHack, metaWeak, metaGrow, metaWeak2].sort(function (a, b) { return b.time - a.time})

		ns.print(sorted)

		ns.exec(sorted[0].script, biggestServer, sorted[0].threads, ns.args[0])
		await ns.sleep(sorted[0].time - sorted[1].time)
		ns.exec(sorted[1].script, biggestServer, sorted[1].threads, ns.args[0])
		await ns.sleep(sorted[1].time - sorted[2].time)
		ns.exec(sorted[2].script, biggestServer, sorted[2].threads, ns.args[0])
		await ns.sleep(sorted[2].time - sorted[3].time)
		ns.exec(sorted[3].script, biggestServer, sorted[3].threads, ns.args[0])
		await ns.sleep(sorted[3].time)
	}
}
