/** @param {NS} ns **/
export async function main(ns) {
	const allFactions = ns.getPlayer().factions
	const allAugs     = allFactions.map(faction => ns.getAugmentationsFromFaction(faction)).flat()
	const buyableAugs = allFactions .map(faction => ns.getAugmentationsFromFaction(faction)
		.filter(aug => ns.getAugmentationRepReq(aug) <= ns.getFactionRep(faction)))
		.flat()
	// const uniqueAugs  = [... new Set(allAugs)]
	const uniqueAugs  = [... new Set(buyableAugs)]
	const sortedAugs  = uniqueAugs.sort((a,b) => ns.getAugmentationPrice(a) - ns.getAugmentationPrice(b))
	const unownedAugs = uniqueAugs.filter(aug => !ns.getOwnedAugmentations().includes(aug))
	unownedAugs.map(aug => ns.tprint(aug + " : " + ns.getAugmentationPrice(aug) + " : "
		+ allFactions.filter(fac => ns.getAugmentationsFromFaction(fac).includes(aug))))
}