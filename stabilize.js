/** @param {NS} ns **/
import { getBestServer, getFreeRam } from "helper-functions.js";
export async function main(ns) {

	const delay = 200
	const targetServer = ns.args[0]

	while (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer)) {

		const bestServer = getBestServer(ns)
		const cores = ns.getServer(bestServer).cores

		ns.print("Best Server: " + bestServer + " with " + getFreeRam(ns, bestServer) + " RAM")

		let metaWeak = { time: ns.getWeakenTime(targetServer), threads: 1, script: "/hwgw/weaken.js" }

		await ns.scp(metaWeak.script, bestServer)

		let newWeakenThreads = metaWeak.threads

		while (ns.getServerSecurityLevel(targetServer) - ns.weakenAnalyze(metaWeak.threads, cores)
				> ns.getServerMinSecurityLevel(targetServer)){
			newWeakenThreads++
			if (ns.getScriptRam(metaWeak.script) * newWeakenThreads > getFreeRam(ns, bestServer))
				break
			else 
				metaWeak.threads = newWeakenThreads
		}

		ns.run(metaWeak.script, metaWeak.threads, targetServer)
		await ns.sleep(ns.getWeakenTime(targetServer))

		await ns.sleep(100)
	}

	while (ns.getServerMaxMoney(targetServer) > ns.getServerMoneyAvailable(targetServer)) {

		const bestServer = getBestServer(ns)
		const cores = ns.getServer(bestServer).cores

		ns.print("Best Server: " + bestServer + " with " + getFreeRam(ns, bestServer) + " RAM")

		let metaWeak = { time: ns.getWeakenTime(targetServer), threads: 1, script: "/hwgw/weaken.js" }
		let metaGrow = { time: ns.getGrowTime(targetServer) + delay, threads: 1, script: "/hwgw/grow.js" }

		await ns.scp(metaWeak.script, bestServer)
		await ns.scp(metaGrow.script, bestServer)
		await ns.scp("/hwgw/dummy.js", bestServer)

		const percentNeeded = 1 / ((1 + ns.getServerMoneyAvailable(targetServer)) / ns.getServerMaxMoney(targetServer))
		while (metaGrow.threads < ns.growthAnalyze(targetServer, percentNeeded, cores)) {
			let newGrowThreads = metaGrow.threads + 1
			const growSecIncrease = ns.growthAnalyzeSecurity(newGrowThreads)

			let newWeakenThreads = metaWeak.threads
			while (growSecIncrease - ns.weakenAnalyze(newWeakenThreads, cores) > 0)
				newWeakenThreads++

			if (ns.getScriptRam(metaWeak.script) * newWeakenThreads
				+ ns.getScriptRam(metaGrow.script) * newGrowThreads
				> getFreeRam(ns, bestServer))
				break
			else {
				metaWeak.threads = newWeakenThreads
				metaGrow.threads = newGrowThreads
			}
		}

		const sorted = [metaWeak, metaGrow].sort(function (a, b) { return b.time - a.time })

		const dummyPID = ns.exec("/hwgw/dummy.js", bestServer, sorted[1].threads, targetServer)

		ns.exec(sorted[0].script, bestServer, sorted[0].threads, targetServer)
		await ns.sleep(sorted[0].time - sorted[1].time)
		
		ns.kill(dummyPID)
		ns.exec(sorted[1].script, bestServer, sorted[1].threads, targetServer)
		await ns.sleep(sorted[1].time)

		await ns.sleep(100)
	}

	while (getFreeRam(ns, ns.getHostname()) < ns.getScriptRam("hwgw.js"))
		await ns.sleep(100)
	ns.spawn("hwgw.js", 1, targetServer)
}