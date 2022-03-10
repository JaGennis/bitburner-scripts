/** @param {NS} ns **/

export function getAvailThreads(ns, script, server) {
	var availRam = ns.getServerMaxRam(server) - ns.getServerUsedRam(server)
	return availRam / ns.getScriptRam(script)
}

export function getAvailHacks(ns){
	var hackScripts = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"]
	var availHacks = 0;
	
	for (var i = 0; i < hackScripts.length; i++) 
		if (ns.fileExists(hackScripts[i]))
			availHacks++;
	return availHacks;
}

export async function main(ns) {

}