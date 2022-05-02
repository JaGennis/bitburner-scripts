/** @param {NS} ns **/
import { getBestServer, getFreeRam } from "helper-functions.js";
export async function main(ns) {

	const delay = 200
	const targetServer = ns.args[0]

	while (true) {

		let metaHack  = {time:ns.getHackTime(targetServer) + (delay*3), threads:1, script:"/hwgw/hack.js"}
		let metaWeak  = {time:ns.getWeakenTime(targetServer) + (delay*2), threads:1, script:"/hwgw/weaken.js"}
		let metaGrow  = {time:ns.getGrowTime(targetServer) + delay, threads:1, script:"/hwgw/grow.js"}
		let metaWeak2 = {time:ns.getWeakenTime(targetServer), threads:1, script:"/hwgw/weaken2.js"}

		const bestServer = getBestServer(ns)
		const cores = ns.getServer(bestServer).cores

		ns.print("Best Server: " + bestServer + " with " + getFreeRam(ns, bestServer) + " RAM")

		await ns.scp(metaHack.script, bestServer)
		await ns.scp(metaWeak.script, bestServer)
		await ns.scp(metaGrow.script, bestServer)
		await ns.scp(metaWeak2.script, bestServer)
		await ns.scp("/hwgw/dummy.js", bestServer)

		while (true) {

			var newHackThreads = metaHack.threads + 1

			var hackSecIncrease = ns.hackAnalyzeSecurity(newHackThreads)
			var newWeakenThreads = metaWeak.threads
			while (hackSecIncrease - ns.weakenAnalyze(newWeakenThreads, cores) > 0)
				newWeakenThreads++

			var stolenPercent = ns.hackAnalyze(targetServer) * metaHack.threads
			if (stolenPercent > 1) {
				metaHack.threads--;
				break
			}
			var newGrowThreads = Math.ceil(ns.growthAnalyze(targetServer, 1 / (1 - stolenPercent), cores))

			var growSecIncrease = ns.growthAnalyzeSecurity(newGrowThreads)
			var newWeaken2Threads = metaWeak2.threads
			while (growSecIncrease - ns.weakenAnalyze(newWeaken2Threads, cores) > 0)
				newWeaken2Threads++

			if (stolenPercent >= 0.95 ||
				ns.getScriptRam(metaHack.script) * newHackThreads
				+ ns.getScriptRam(metaWeak.script) * newWeakenThreads
				+ ns.getScriptRam(metaGrow.script) * newGrowThreads
				+ ns.getScriptRam(metaWeak2.script) * newWeaken2Threads
				> getFreeRam(ns, bestServer))
				break
			else {
				metaHack.threads  = newHackThreads
				metaWeak.threads  = newWeakenThreads
				metaGrow.threads  = newGrowThreads
				metaWeak2.threads = newWeaken2Threads
			}
		}

		var sorted = [metaHack, metaWeak, metaGrow, metaWeak2].sort(function (a, b) { return b.time - a.time})

		const dummyPID1 = ns.exec("/hwgw/dummy.js", bestServer, sorted[1].threads, targetServer + "-0")
		const dummyPID2 = ns.exec("/hwgw/dummy.js", bestServer, sorted[2].threads, targetServer + "-1")
		const dummyPID3 = ns.exec("/hwgw/dummy.js", bestServer, sorted[3].threads, targetServer + "-2")

		ns.exec(sorted[0].script, bestServer, sorted[0].threads, targetServer)
		await ns.sleep(sorted[0].time - sorted[1].time)

		ns.kill(dummyPID1)
		ns.exec(sorted[1].script, bestServer, sorted[1].threads, targetServer)
		await ns.sleep(sorted[1].time - sorted[2].time)

		ns.kill(dummyPID2)
		ns.exec(sorted[2].script, bestServer, sorted[2].threads, targetServer)
		await ns.sleep(sorted[2].time - sorted[3].time)

		ns.kill(dummyPID3)
		ns.exec(sorted[3].script, bestServer, sorted[3].threads, targetServer)
		await ns.sleep(sorted[3].time)

		await ns.sleep(101)
	}
}