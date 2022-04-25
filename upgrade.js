/** @param {NS} ns **/
export async function main(ns) {

	ns.disableLog("ALL")

	const serverName = "hwgw"

	function getMinServer(){
		const sortedServers = ns.getPurchasedServers()
			.sort((a,b) => ns.getServer(a).maxRam - ns.getServer(b).maxRam)
		return sortedServers[0]
	}

	while (ns.getServer(getMinServer()).maxRam < 1048576) {

		while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
			let ram = 32
			while (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram * 2) && ram <= 2048)
				ram *= 2
			const newServerName = ns.purchaseServer(serverName, ram)
			ns.print("Bought server " + newServerName + " with " + ram + " RAM")
			await ns.sleep(1000)
		}

		let minServer = getMinServer()
		ns.print("Min server : " + minServer + " with " + ns.getServer(minServer).maxRam + " RAM")
		let ram = ns.getServer(minServer).maxRam * 2

		while (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram * 2) && ram < 1048576)
			ram *= 2

		const files = ns.ls(minServer)
		while (ns.ps(minServer).length > 0 
			&& ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)){
			await ns.sleep(50)
			ns.print("Waiting for " + ns.ps(minServer).length + " scripts to finish on " + minServer)
		}
		if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
			ns.deleteServer(minServer)
			ns.print("Deleted Server " + minServer)
			const newServer = ns.purchaseServer(serverName, ram)
			ns.print("Bought new Server " + newServer + " with " + ram + " RAM")
			if (files.length > 0)
				await ns.scp(files, newServer)
		}
		ns.print("Sleeping for a second")
		await ns.sleep(1000)
	}
}