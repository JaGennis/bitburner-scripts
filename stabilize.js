/** @param {NS} ns **/
import { getAllServers, getAvailThreads } from "helper-functions.js";
export async function main(ns) {

	function hackAnalyzeSecurity(i) {
		return i * 0.002
	}

	function weakenAnalyze(i) {
		return i * 0.05
	}

	var delay = 200

	var metaWeak = { time: ns.getWeakenTime(ns.args[0]), threads: 1, script: "/hwgw/weaken.js" }
	var metaGrow = { time: ns.getGrowTime(ns.args[0]) + delay, threads: 1, script: "/hwgw/grow.js" }

	function getFreeRam(server) {
		return ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
	}

	var cores = ns.getServer(ns.getHostname()).cores

	while (ns.getServerSecurityLevel(ns.args[0]) > ns.getServerMinSecurityLevel(ns.args[0])) {

		var newWeakenThreads = metaWeak.threads

		while (ns.getServerSecurityLevel(ns.args[0]) - ns.weakenAnalyze(metaWeak.threads, cores)
				> ns.getServerMinSecurityLevel(ns.args[0])){
			newWeakenThreads++
			if (ns.getScriptRam(metaWeak.script) * newWeakenThreads > getFreeRam(ns.getHostname())) {
				break
			}
			else {
				metaWeak.threads = newWeakenThreads
			}
		}

		ns.run(metaWeak.script, metaWeak.threads, ns.args[0])
		while (ns.scriptRunning(metaWeak.script, ns.getHostname()))
			await ns.sleep(1000)

		metaWeak.threads = 1
		
		await ns.sleep(500)
	}

	while (ns.getServerMaxMoney(ns.args[0]) > ns.getServerMoneyAvailable(ns.args[0])) {
		metaWeak = { time: ns.getWeakenTime(ns.args[0]), threads: 1, script: "/hwgw/weaken.js" }
		metaGrow = { time: ns.getGrowTime(ns.args[0]) + delay, threads: 1, script: "/hwgw/grow.js" }

		var percentNeeded = 1 / (ns.getServerMoneyAvailable(ns.args[0]) / ns.getServerMaxMoney(ns.args[0]))
		while (metaGrow.threads < ns.growthAnalyze(ns.args[0], percentNeeded, cores)) {
			var newGrowThreads = metaGrow.threads + 1
			var growSecIncrease = ns.growthAnalyzeSecurity(newGrowThreads)

			var newWeakenThreads = metaWeak.threads
			while (growSecIncrease - ns.weakenAnalyze(newWeakenThreads, cores) > 0)
				newWeakenThreads++

			if (ns.getScriptRam(metaWeak.script) * newWeakenThreads
				+ ns.getScriptRam(metaGrow.script) * newGrowThreads
				> getFreeRam(ns.getHostname()))
				break
			else {
				metaWeak.threads = newWeakenThreads
				metaGrow.threads = newGrowThreads
			}
		}

		var sorted = [metaWeak, metaGrow].sort(function (a, b) { return b.time - a.time })

		ns.run(sorted[0].script, sorted[0].threads, ns.args[0])
		await ns.sleep(sorted[0].time - sorted[1].time)
		ns.run(sorted[1].script, sorted[1].threads, ns.args[0])
		await ns.sleep(sorted[1].time)

		metaWeak.threads = 1
		metaGrow.threads = 1
	}
}
