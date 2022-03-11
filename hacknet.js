/** @param {NS} ns **/
export async function main(ns) {

	while (true) {
		if (ns.hacknet.getPurchaseNodeCost() <= ns.getServerMoneyAvailable("home")
			&& ns.hacknet.numNodes() < 27) {
			var newNode = ns.hacknet.purchaseNode();
            while (ns.hacknet.getNodeStats(newNode).level < 10) {
				ns.hacknet.upgradeLevel(newNode, 1);
                await ns.sleep(1000)
            }
		}

		var maxLevel = 200;
		var maxRam   = 64;
		var maxCores = 16;

		var lowestLevel = maxLevel;
		var lowestRam   = maxRam;
		var lowestCores = maxCores;

		var lowestLevelInd = 0;
		var lowestRamInd   = 0;
		var lowestCoresInd = 0;

		for (var i = 0; i < ns.hacknet.numNodes(); i++) {

			if(ns.hacknet.getNodeStats(i).level < lowestLevel) {
				lowestLevel = ns.hacknet.getNodeStats(i).level;
				lowestLevelInd = i;
			}
			if(ns.hacknet.getNodeStats(i).ram < lowestRam) {
				lowestRam = ns.hacknet.getNodeStats(i).ram;
				lowestRamInd = i;
			}
			if(ns.hacknet.getNodeStats(i).cores < lowestCores) {
				lowestCores = ns.hacknet.getNodeStats(i).cores;
				lowestCoresInd = i;
			}
		}

		var lowestLevelCost = ns.hacknet.getLevelUpgradeCost(lowestLevelInd, 10);
		var lowestRamCost   = ns.hacknet.getRamUpgradeCost(lowestRamInd, 1);
		var lowestCoresCost = ns.hacknet.getCoreUpgradeCost(lowestCoresInd, 1);

		if (lowestLevelCost < lowestCoresCost && lowestLevelCost < lowestRamCost)
			ns.hacknet.upgradeLevel(lowestLevelInd, 10);
		else if (lowestRamCost < lowestLevelCost && lowestRamCost < lowestCoresCost)
			ns.hacknet.upgradeRam(lowestRamInd, 1);
		else if (lowestCoresCost < lowestLevelCost && lowestCoresCost < lowestRamCost)
			ns.hacknet.upgradeCore(lowestCoresInd, 1);

		await ns.sleep(500)
	}
}
