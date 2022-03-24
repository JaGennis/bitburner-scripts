/** @param {NS} ns **/
import { getAvailHacks, getAvailThreads, getAllServers, root } from "helper-functions.js";

export async function main(ns) {

	ns.disableLog("ALL")

	var allServers = getAllServers(ns).slice(1).filter(item => !ns.getPurchasedServers().includes(item))

	while (true) {

		for (var i = 0; i < allServers.length; i++) {

			if (ns.getServerRequiredHackingLevel(allServers[i]) > ns.getHackingLevel())
				ns.print("Server " + allServers[i] + " hacking level is "
					+ ns.getServerRequiredHackingLevel(allServers[i]) + " and therefore too high!")
			else if (ns.isRunning("hwgw.js", ns.getHostname(), allServers[i]))
				ns.print("hwgw.js already running for the server " + allServers[i])
			else if (!ns.isRunning("hwgw.js", ns.getHostname(), allServers[i])) {

				if (!ns.hasRootAccess(allServers[i])) {
					if (ns.getServerNumPortsRequired(allServers[i]) <= getAvailHacks(ns)) {
						root(ns, allServers[i]);
						ns.print("Rooted " + allServers[i])
					}
					else
						ns.print("Server " + allServers[i] + " needs " + ns.getServerNumPortsRequired(allServers[i])
							+ " open ports but only " + getAvailHacks(ns) + " can be opened!")
				}

				if (ns.hasRootAccess(allServers[i])) {

					if (ns.getServerMaxMoney(allServers[i]) > 0) {
						ns.print("Stabilize " + allServers[i])
						ns.run("stabilize.js", 1, allServers[i])

						while (ns.scriptRunning("stabilize.js", ns.getHostname()))
							await ns.sleep(1000);

						ns.print("Stabilized " + allServers[i])

						ns.print("Starting hwgw.js for " + allServers[i])
						ns.run("hwgw.js", 1, allServers[i])
					}
					else
						ns.print("Server " + allServers[i] + " has only " + ns.getServerMaxMoney(allServers[i]) + " money")
				}
			}
			await ns.sleep(1000)
		}
	}
}