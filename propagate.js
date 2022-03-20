/** @param {NS} ns **/
import { getAvailHacks, getAvailThreads, getAllServers } from "helper-functions.js";

export async function main(ns) {

	ns.disableLog("ALL")

	ns.print("Availabe hacks: " + getAvailHacks(ns))

	async function root(server) {
		if (ns.fileExists("BruteSSH.exe"))
			ns.brutessh(server)
		if (ns.fileExists("FTPCrack.exe"))
			ns.ftpcrack(server)
		if (ns.fileExists("relaySMTP.exe"))
			ns.relaysmtp(server)
		if (ns.fileExists("HTTPWorm.exe"))
			ns.httpworm(server)
		if (ns.fileExists("SQLInject.exe"))
			ns.sqlinject(server)
		ns.nuke(server)
		await ns.installBackdoor(server)
	}

	var allServers = getAllServers(ns).slice(1).filter(item => !ns.getPurchasedServers().includes(item))
	ns.print("All servers: " + allServers)

	while (allServers.length > 0) {

		var toRemove = []

		for (var i = 0; i < allServers.length; i++) {

			if (ns.getServerRequiredHackingLevel(allServers[i]) > ns.getHackingLevel())
				ns.print("Server " + allServers[i] + " hacking level is too high!")
			else if (ns.isRunning("hwgw.js", ns.getHostname(), allServers[i])) {
				ns.print("hwgw.js already running for the server " + allServers[i])
				toRemove.push(i);
			}
			else if (!ns.isRunning("hwgw.js", ns.getHostname(), allServers[i])) {

				if (!ns.hasRootAccess(allServers[i])) {
					if (ns.getServerNumPortsRequired(allServers[i]) <= getAvailHacks(ns)) {
						await root(allServers[i]);
						ns.print("Rooted " + allServers[i])
					}
					else {
						ns.print("Server " + allServers[i] + " needs " + ns.getServerNumPortsRequired(allServers[i])
							+ " open ports but only " + getAvailHacks(ns) + " can be opened!")
					}
				}

				if (ns.hasRootAccess(allServers[i])) {

					if (ns.getServerMaxMoney(allServers[i]) > 0) {
						// var threads = getAvailThreads(ns, "stabilize.script", "stabilize")
						var threads = getAvailThreads(ns, "stabilize.js", ns.getHostname())
						threads = 1
						ns.print("Stabilize " + allServers[i] + " with " + threads + " threads")
						// await ns.scp("stabilize.script", "stabilize")
						// ns.exec("stabilize.script", "stabilize", threads, allServers[i])
						ns.run("stabilize.js", threads, allServers[i])

						// while (ns.scriptRunning("stabilize.script", "stabilize"))
						// while (ns.isRunning("stabilize.script"))
						while (ns.scriptRunning("stabilize.js", ns.getHostname()))
							await ns.sleep(1000);

						ns.print("Stabilized " + allServers[i] + " with " + threads + " threads")

						ns.print("Starting hwgw.js for " + allServers[i])
						ns.run("hwgw.js", 1, allServers[i])
					}
                    else
                        ns.print("Server " + allServers[i] + " has only " + ns.getServerMaxMoney(allServers[i]) + " money")
					toRemove.push(i);
				}
			}
		}

		for (var i = 0; i < toRemove.length; i++) {
			allServers.splice(toRemove[i], 1);
			ns.print("Removed " + toRemove[i] + " from list")
		}

		ns.print(allServers)
	}
}
