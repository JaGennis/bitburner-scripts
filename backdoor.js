/** @param {NS} ns **/
import { getAllServers, root } from "helper-functions.js";
export async function main(ns) {

	var allServers = []

	async function recurBackdoor(home) {
		if (!ns.hasRootAccess(home))
			root(ns, home)
		if (!ns.getServer(home).backdoorInstalled 
			&& ns.getServerRequiredHackingLevel(home) <= ns.getHackingLevel())
			await ns.installBackdoor()
		var nearServers = ns.scan(home)
		for (var i = 0; i < nearServers.length; i++)
			if (!allServers.includes(nearServers[i])
				&& !ns.getPurchasedServers().includes(nearServers[i])
				&& nearServers[i] !== "home") {
				allServers.push(nearServers[i])
				ns.connect(nearServers[i])
				await recurBackdoor(nearServers[i])
				ns.connect(home)
			}
	}

	await recurBackdoor(ns.getHostname())
}