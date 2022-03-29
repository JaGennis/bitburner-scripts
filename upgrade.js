/** @param {NS} ns **/
export async function main(ns) {

	const serverName = "hwgw"

	while (true) {

		while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
			let ram = 8
			while (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram * 2) && ram <= 2048)
				ram *= 2
			ns.purchaseServer(serverName, ram)
			await ns.sleep(1000)
		}

		for (let server of ns.getPurchasedServers()) {
			let ram = ns.getServer(server).maxRam * 2
			while (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram * 2))
				ram *= 2
			if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
				const files = ns.ls(server)
				while (ns.ps(server).length > 0)
					await ns.sleep(100)
				ns.deleteServer(server)
				ns.purchaseServer(serverName, ram)
				if (files.length > 0)
					await ns.scp(files, server)
			}
		}
		await ns.sleep(1000)
	}
}