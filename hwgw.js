/** @param {NS} ns **/
export async function main(ns) {
    var hackTime = ns.getHackTime(ns.args[0])
    var growTime = ns.getGrowTime(ns.args[0])
    var weakenTime = ns.getWeakenTime(ns.args[0])

    //var maxTime = 0

    var delay = 1000
    //var waitTime = 0

    var timeFrame = 0

    const zip = (a, b) => a.map((k, i) => [k, b[i]]);

    var times = [weakenTime + (delay*2), weakenTime, growTime + delay, hackTime + (delay *3)]
    var scripts = ["weaken.js", "weaken.js", "grow.js", "hack.js"]
    var comb = zip(times, scripts)
    var lol = comb.sort(function(a,b) {return b[0] - a[0]})

    ns.tprint(lol)

    //if (weakenTime + (delay * 2) > hackTime + (delay * 3) && weakenTime + (delay * 2) > growTime + delay)
        //timeFrame = weakenTime + (delay * 2)
    //else if (hackTime + (delay * 3) > growTime + delay)
        //timeFrame = hackTime + (delay * 3)
    //else
        //timeFrame = growTime + delay

    //if (weakenTime + (delay * 2) > hackTime + (delay * 3) && weakenTime + (delay * 2) > growTime + delay){
        //timeFrame = weakenTime + (delay * 2)
        //run(maxjs, threads, ns.args[0])
        //ns.run("weaken.js", threads, ns.args[0])
        //ns.sleep(timeFrame - weakenTime)
        //ns.run("weaken.js", threads, ns.args[0])
    //}
    //else if (hackTime + (delay * 3) > growTime + delay)
        //timeFrame = hackTime + (delay * 3)
    //else
        //timeFrame = growTime + delay


    //if (growTime > hackTime && growTime > weakenTime){
        //maxTime = growTime

    //}
    //if (weakenTime > growTime && weakenTime > hackTime){
        //maxTime = weakenTime
        //if (growTime > hackTime){
            //run("weaken.js", threads, ns.args[0])
            //sleep(delay * 2)
            //run("weaken.js", threads, ns.args[0])
            //sleep(weakenTime - growTime - delay)
            //run("grow.js", threads, ns.args[0])
            //sleep(growTime - hackTime - delay*2)
            //run("hack.js", threads, ns.args[0])
        //}
    //}
    //else {
        //maxTime = hackTime
    //}



	//await ns.grow(ns.args[0])
}
