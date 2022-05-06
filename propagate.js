/** @param {NS} ns **/
import { getAvailHacks, getAllServers, getFreeRam, root } from "helper-functions.js";

export async function main(ns) {

	ns.disableLog("ALL")

	const allServers = getAllServers(ns).slice(1)
						.filter(item => !ns.getPurchasedServers().includes(item))

	while (true) {

		for (let server of allServers) {

			if (ns.getServerRequiredHackingLevel(server) > ns.getHackingLevel())
				ns.print("Server " + server + " hacking level is "
					+ ns.getServerRequiredHackingLevel(server) + " and therefore too high!")
			else if (ns.isRunning("hwgw.js", ns.getHostname(), server))
				ns.print("hwgw.js already running for the server " + server)
			else if (!ns.isRunning("hwgw.js", ns.getHostname(), server)) {

				if (!ns.hasRootAccess(server)) {
					if (ns.getServerNumPortsRequired(server) <= getAvailHacks(ns)) {
						root(ns, server)
						ns.print("Rooted " + server)
					}
					else
						ns.print("Server " + server + " needs " + ns.getServerNumPortsRequired(server)
							+ " open ports but only " + getAvailHacks(ns) + " can be opened!")
				}

				if (ns.hasRootAccess(server)) {

					if (ns.getServerMaxMoney(server) > 0){
						if (!ns.isRunning("stabilize.js", ns.getHostname(), server)) {
							while (getFreeRam(ns, ns.getHostname()) < ns.getScriptRam("stabilize.js")){
								ns.print("Waiting for free RAM...")
								await ns.sleep(50)
							}
							ns.print("Stabilizing " + server)
							ns.run("stabilize.js", 1, server)
						}
						else 
							ns.print("stabilize.js is already running for server " + server)
					}
					else
						ns.print("Server " + server + " has only " + ns.getServerMaxMoney(server) + " money")
				}
			}
			await ns.sleep(1000)
		}
	}
}