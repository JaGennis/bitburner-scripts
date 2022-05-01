/** @param {NS} ns **/
import { getAllServers, getAvailThreads } from "helper-functions.js";
export async function main(ns) {

	const delay = 200
	const targetServer = ns.args[0]

	let metaWeak = { time: ns.getWeakenTime(targetServer)	  , threads: 1, script: "/hwgw/weaken.js" }
	let metaGrow = { time: ns.getGrowTime(targetServer) + delay, threads: 1, script: "/hwgw/grow.js" }

	function getFreeRam(server) {
		return ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
	}

	const cores = ns.getServer(ns.getHostname()).cores

	while (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer)) {

		let newWeakenThreads = metaWeak.threads

		while (ns.getServerSecurityLevel(targetServer) - ns.weakenAnalyze(metaWeak.threads, cores)
				> ns.getServerMinSecurityLevel(targetServer)){
			newWeakenThreads++
			if (ns.getScriptRam(metaWeak.script) * newWeakenThreads > getFreeRam(ns.getHostname())) {
				break
			}
			else {
				metaWeak.threads = newWeakenThreads
			}
		}

		ns.run(metaWeak.script, metaWeak.threads, targetServer)
		while (ns.scriptRunning(metaWeak.script, ns.getHostname()))
			await ns.sleep(1000)

		metaWeak.threads = 1

		await ns.sleep(500)
	}

	while (ns.getServerMaxMoney(targetServer) > ns.getServerMoneyAvailable(targetServer)) {
		metaWeak = { time: ns.getWeakenTime(targetServer), threads: 1, script: "/hwgw/weaken.js" }
		metaGrow = { time: ns.getGrowTime(targetServer) + delay, threads: 1, script: "/hwgw/grow.js" }

		const percentNeeded = 1 / (ns.getServerMoneyAvailable(targetServer) / ns.getServerMaxMoney(targetServer))
		while (metaGrow.threads < ns.growthAnalyze(targetServer, percentNeeded, cores)) {
			let newGrowThreads = metaGrow.threads + 1
			const growSecIncrease = ns.growthAnalyzeSecurity(newGrowThreads)

			let newWeakenThreads = metaWeak.threads
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

		const sorted = [metaWeak, metaGrow].sort(function (a, b) { return b.time - a.time })

		ns.run(sorted[0].script, sorted[0].threads, targetServer)
		await ns.sleep(sorted[0].time - sorted[1].time)
		ns.run(sorted[1].script, sorted[1].threads, targetServer)
		await ns.sleep(sorted[1].time)

		metaWeak.threads = 1
		metaGrow.threads = 1

		await ns.sleep(100)
	}
}
