/** @param {NS} ns **/
export async function main(ns) {
	const allFactions = ns.getPlayer().factions
	const allAugs     = allFactions.map(faction => ns.getAugmentationsFromFaction(faction)).flat()
	const uniqueAugs  = [... new Set(allAugs)]
	const sortedAugs  = uniqueAugs.sort((a,b) => ns.getAugmentationPrice(a) - ns.getAugmentationPrice(b))
	const unownedAugs = uniqueAugs.filter(aug => !ns.getOwnedAugmentations().includes(aug))
	unownedAugs.map(aug => ns.tprint(aug + " : " + ns.getAugmentationPrice(aug) + " : "
		+ allFactions.filter(fac => ns.getAugmentationsFromFaction(fac).includes(aug))))
}
