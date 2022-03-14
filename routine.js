/** @param {NS} ns **/
export async function main(ns) {

	async function crime() {

		function moneyPerSec(crime) {
			return ns.getCrimeStats(crime).money * ns.getCrimeChance(crime) / ns.getCrimeStats(crime).time
		}

        function expPerSec(crime) {
            var sumExp = ns.getCrimeStats(crime).charisma_exp + ns.getCrimeStats(crime).defense_exp + ns.getCrimeStats(crime).dexterity_exp
            return (sumExp * ns.getCrimeChance(crime) + (sumExp / 2) * (1 - ns.getCrimeChance(crime))) / ns.getCrimeStats(crime).time
        }

		// var crimes = ["Shoplift", "Rob store", "Mug someone", "Larceny", "Deal Drugs", "Bond Forgery"
	    //		, "Traffick illegal Arms", "Homicide", "Grand theft Auto", "Kidnap and Ransom"
	    //		, "Assassinate", "Heist"]

		var crimes = ["Traffick illegal Arms", "Grand theft Auto", "Kidnap and Ransom" , "Heist"]

		var bestCrime = crimes[0]

		for (var i = 0; i < crimes.length; i++)
			if (moneyPerSec(crimes[i]) > moneyPerSec(bestCrime))
				bestCrime = crimes[i]

		ns.commitCrime(bestCrime)
		await ns.sleep(ns.getCrimeStats(bestCrime).time)
	}

	async function program() {
		var programs = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe",
						"DeepscanV1.exe", "DeepscanV2.exe", "ServerProfiler.exe", "AutoLink.exe"]
		var levels   = [50,100,250,500,750,75,400,75,25]
		for(var i = 0; i < programs.length; i++)
			if(!ns.fileExists(programs[i]) && ns.getHackingLevel() >= levels[i]){
				ns.createProgram(programs[i])
				while(ns.isBusy())
					await ns.sleep(1000)
			}
	}

	async function faction() {
		var cityFactions = ["Sector-12", "Chongqing", "New Tokyo", "Ishima", "Aevum", "Volhaven"]
        for(var i = 0; i < cityFactions.length; i++){
            var facAugs = (ns.getAugmentationsFromFaction(cityFactions[i]).filter(n => !ns.getOwnedAugmentations().includes(n)))
            if(facAugs.length > 0){
                ns.travelToCity(cityFactions[i])
                break
            }
        }

        var crimeFactions = ["Slum Snakes","Tetrads","Silhouette","Speakers for the Dead","The Dark Army","The Syndicate"]

        var invitations = ns.checkFactionInvitations()
        for (var i = 0; i < invitations.length; i++)
            join(invitations[i])

        var allFactions = ns.getPlayer().factions
        for (var i = 0; i < allFactions.length; i++) {
            var facAugs = (ns.getAugmentationsFromFaction(allFactions[i]).filter(n => !ns.getOwnedAugmentations().includes(n)))
            if(facAugs.length > 0) {
                while(ns.getFactionRep(allFactions[i]) < facAugs.max()) {
                    //ns.workForFaction(allFactions[i], )
                    await ns.sleep(5000)
                }
            }
        }
	}

	while (true) {
        await program()
		// await faction()
		await crime()
	}
}
