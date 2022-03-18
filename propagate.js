/** @param {NS} ns **/
import { getAvailHacks, getAvailThreads, getAllServers } from "helper-functions.js";

export async function main(ns) {

	ns.disableLog("ALL")

	ns.print("Availabe hacks: " + getAvailHacks(ns))

	function root(server) {
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
		// installBackdoor(server)
	}

	var allServers = getAllServers(ns).slice(1).filter(item => !ns.getPurchasedServers().includes(item))
	ns.print("All servers: " + allServers)

	while (allServers.length > 0) {

		var toRemove = []

		for (var i = 0; i < allServers.length; i++) {

			if (ns.getServerMaxRam(allServers[i]) <= 0) {
				ns.print("Server " + " has " + ns.getServerMaxRam(allServers[i]) + " RAM!")
				toRemove.push(i);
			}
			else if (ns.getServerRequiredHackingLevel(allServers[i]) > ns.getHackingLevel())
				ns.print("Server " + allServers[i] + " hacking level is too high!")
			else if (ns.scriptRunning("selfsubstain.script", allServers[i])) {
				ns.print("selfsubstain already running on server " + allServers[i])
				toRemove.push(i);
			}
			else if (!ns.scriptRunning("selfsubstain.script", allServers[i])) {
				if (!ns.hasRootAccess(allServers[i])) {
					if (ns.getServerNumPortsRequired(allServers[i]) <= getAvailHacks(ns)) {
						root(allServers[i]);
						ns.print("Rooted " + allServers[i])
					}
					else {
						ns.print("Server " + allServers[i] + " needs " + ns.getServerNumPortsRequired(allServers[i])
							+ " open ports but only " + getAvailHacks(ns) + " can be opened!")
					}
				}

				if (ns.hasRootAccess(allServers[i])) {
					var threads = getAvailThreads(ns, "stabilize.script", ns.getHostname())
					ns.run("stabilize.script", threads, allServers[i])

					while (ns.scriptRunning("stabilize.script", ns.getHostname()))
						await ns.sleep(1000);

					ns.print("Stabilized " + allServers[i] + " with " + threads + " threads")

					await ns.scp("selfsubstain.script", allServers[i])

					var serverThreads = getAvailThreads(ns, "selfsubstain.script", allServers[i])
					ns.exec("selfsubstain.script", allServers[i], serverThreads)
					ns.print("Started " + allServers[i] + " with " + serverThreads + " threads")

					toRemove.push(i);
				}
			}
		}

		for (var i = 0; i < toRemove.length; i++) {
			allServers.splice(toRemove[i], 1);
			ns.print("Removed " + toRemove[i] + " from list")
		}

		ns.print(allServers)
		await ns.sleep(1000)
	}
}
