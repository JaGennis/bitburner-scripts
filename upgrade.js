/** @param {NS} ns **/
export async function main(ns) {

	var serverName = "hwgw"

	while (true) {

		while (ns.getPurchasedServers().length < ns.getPurchasedServerLimit()) {
			var ram = 2
			while(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram*2) && ram <= 2048)
				ram *= 2
			ns.purchaseServer(serverName, ram)
			await ns.sleep(1000)
		}
		
		for (var i = 0; i < ns.getPurchasedServers().length; i++){
			var ram = ns.getServer(ns.getPurchasedServers()[i]).maxRam * 2
			while(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram*2))
				ram *= 2
			if(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)){
				var files = ns.ls(ns.getPurchasedServers()[i])
				// wait for script to finish
				ns.killall(ns.getPurchasedServers()[i])
				ns.deleteServer(ns.getPurchasedServers()[i])
				await ns.sleep(1000)
				ns.purchaseServer(serverName, ram)
				if (files.length > 0)
					await ns.scp(files, ns.getPurchasedServers()[i])
			}
		}
		await ns.sleep(1000)
	}
}