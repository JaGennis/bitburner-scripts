/** @param {NS} ns **/
import { getAllServers, root } from "helper-functions.js";
export async function main(ns) {

	let allServers = ns.getPurchasedServers()

	async function recurBackdoor(currentServer) {
		if (!ns.hasRootAccess(currentServer))
			root(ns, currentServer)
		if (!ns.getServer(currentServer).backdoorInstalled
			&& ns.getServerRequiredHackingLevel(currentServer) <= ns.getHackingLevel())
			await ns.installBackdoor()
		let nearServers = ns.scan(currentServer)
		for (let server of nearServers)
			if (!allServers.includes(server)) {
				allServers.push(server)
				ns.connect(server)
				await recurBackdoor(server)
				ns.connect(currentServer)
			}
	}
	await recurBackdoor(ns.getHostname())
}