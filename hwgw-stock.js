/** @param {NS} ns **/
import { buyMax, shortMax, getBestServer, getFreeRam } from "helper-functions.js";
export async function main(ns) {

	async function weakenMax(targetServer) {
		while (ns.getServerSecurityLevel(targetServer) > ns.getServerMinSecurityLevel(targetServer)) {
	
			const bestServer = getBestServer(ns)
			const cores = ns.getServer(bestServer).cores
	
			ns.print("Best Server: " + bestServer + " with " + getFreeRam(ns, bestServer) + "GB RAM")
	
			let metaWeak = { time: ns.getWeakenTime(targetServer), threads: 1, script: "/hwgw/weaken.js" }
	
			await ns.scp(metaWeak.script, bestServer)
	
			while (ns.getServerSecurityLevel(targetServer) - ns.weakenAnalyze(metaWeak.threads+1, cores) 
						> ns.getServerMinSecurityLevel(targetServer)
					&& ns.getScriptRam(metaWeak.script) * (metaWeak.threads+1) < getFreeRam(ns, bestServer)){
				metaWeak.threads++
			}
	
			ns.exec(metaWeak.script, bestServer, metaWeak.threads, targetServer)
			await ns.sleep(ns.getWeakenTime(targetServer))
	
			await ns.sleep(100)
		}
	}

	async function growMax(targetServer, affectStock) {
		if (ns.getServerMaxMoney(targetServer) == ns.getServerMoneyAvailable(targetServer))
			await hackMax(targetServer, false)

		const delay = 200
	
		const bestServer = getBestServer(ns)
		const cores = ns.getServer(bestServer).cores

		ns.print("Best Server: " + bestServer + " with " + getFreeRam(ns, bestServer) + " GB RAM")

		let metaWeak = { time: ns.getWeakenTime(targetServer), threads: 1, script: "/hwgw/weaken.js" }
		let metaGrow = { time: ns.getGrowTime(targetServer) + delay, threads: 1, script: "/hwgw/grow.js" }
		if (affectStock)
			metaGrow.script = "/stock/grow.js"

		await ns.scp(metaWeak.script, bestServer)
		await ns.scp(metaGrow.script, bestServer)
		await ns.scp("/hwgw/dummy.js", bestServer)

		while (ns.getScriptRam(metaGrow.script) * (metaGrow.threads + 1) 
			 + ns.getScriptRam(metaWeak.script) * metaWeak.threads
			   < getFreeRam(ns, bestServer)) {
			metaGrow.threads++
			while (ns.growthAnalyzeSecurity(metaGrow.threads) - ns.weakenAnalyze(metaWeak.threads, cores) > 0)
				metaWeak.threads++
		}

		const sorted = [metaWeak, metaGrow].sort(function (a, b) { return b.time - a.time })

		const dummyPID = ns.exec("/hwgw/dummy.js", bestServer, sorted[1].threads, targetServer)

		ns.exec(sorted[0].script, bestServer, sorted[0].threads, targetServer)
		await ns.sleep(sorted[0].time - sorted[1].time)
		
		ns.kill(dummyPID)
		ns.exec(sorted[1].script, bestServer, sorted[1].threads, targetServer)
		await ns.sleep(sorted[1].time)
	}

	async function hackMax(targetServer, affectStock) {
		if (ns.getServerMoneyAvailable(targetServer) <= 0)
			await growMax(targetServer, false)

		const delay = 200
		let metaHack = {time:ns.getHackTime(targetServer) + delay, threads:1, script:"/hwgw/hack.js"}
		let metaWeak = {time:ns.getWeakenTime(targetServer), threads:1, script:"/hwgw/weaken.js"}
		if (affectStock)
			metaHack.script = "/stock/hack.js"

		const bestServer = getBestServer(ns)
		const cores = ns.getServer(bestServer).cores

		ns.print("Best Server: " + bestServer + " with " + getFreeRam(ns, bestServer) + " RAM")

		await ns.scp(metaHack.script, bestServer)
		await ns.scp(metaWeak.script, bestServer)
		await ns.scp("/hwgw/dummy.js", bestServer)

		while (ns.getScriptRam(metaHack.script) * (metaHack.threads + 1) 
			 + ns.getScriptRam(metaWeak.script) * metaWeak.threads
			   < getFreeRam(ns, bestServer)) {
			metaHack.threads++
			while (ns.hackAnalyzeSecurity(metaHack.threads) - ns.weakenAnalyze(metaWeak.threads, cores) > 0)
				metaWeak.threads++
		}

		const sorted = [metaHack, metaWeak].sort(function (a, b) { return b.time - a.time})
	
		const dummyPID = ns.exec("/hwgw/dummy.js", bestServer, sorted[1].threads, targetServer)
	
		ns.exec(sorted[0].script, bestServer, sorted[0].threads, targetServer)
		await ns.sleep(sorted[0].time - sorted[1].time)
	
		ns.kill(dummyPID)
		ns.exec(sorted[1].script, bestServer, sorted[1].threads, targetServer)
		await ns.sleep(sorted[1].time)
	}

	const targetServer = ns.args[0]

	let stockSym = ""
	switch (targetServer) {
		case "foodnstuff":
			stockSym = "FNS"
	}

	await weakenMax(targetServer)

	while (true) {
		const buyPrice = ns.stock.getAskPrice(stockSym)
		buyMax(ns, stockSym)
		await ns.sleep(4000)

		while (ns.stock.getBidPrice(stockSym) < buyPrice * 1.30
				&& ns.stock.getPosition(stockSym)[0] > 0)
			await growMax(targetServer, true)

		ns.stock.sell(stockSym, ns.stock.getPosition(stockSym)[0])

		await ns.sleep(4000)
		
		const sellPrice = ns.stock.getBidPrice(stockSym)
		shortMax(ns, stockSym)
		await ns.sleep(4000)

		while (ns.stock.getAskPrice(stockSym) < sellPrice * 1.30
				&& ns.stock.getPosition(stockSym)[2] > 0)
			await hackMax(targetServer, true)

		ns.stock.sellShort(stockSym, ns.stock.getPosition(stockSym)[2])

		await ns.sleep(4000)
	}
}