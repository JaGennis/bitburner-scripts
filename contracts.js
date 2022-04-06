/** @param {NS} ns **/
import { getAllServers } from "helper-functions.js";
export async function main(ns) {
    // TODO : Make pure
	getAllServers(ns)
        .filter(item => ns.ls(item, "contract").length > 0 && item !== "home")
	    .map(server => ns.tprint (server + " : " + ns.ls(server, "contract")
		    .map(contract => contract + " : " + ns.codingcontract.getContractType(contract, server))))
}
