//const { inputToConfig } = require('@ethereum-waffle/compiler')
// const { expect } = require('chai')
const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("AucEngine", function() {
    let owner
    let seller
    let buyer
    let auct

    beforeEach(async function() {
        [owner, seller, buyer] = await ethers.getSigners()

        const AucEngine = await ethers.getContractFactory("AucEngine", owner)
        auct = await AucEngine.deploy()
        await auct.deployed()
        console.log(auct.address)
    })
    it("sets owner", async function() {
        const currentOwner = await auct.owner()
        console.log(currentOwner)
        expect(currentOwner).to.eq(owner.address)
    })

    async function getTimestamp(blockNumber) {
        return (
            await ethers.provider.getBlock(blockNumber)
        ).timestamp
    }

    describe("creacteAuction", function() {
        it("creates auction correctly", async function() {
            const duration = 60
            const tx = await auct.createAuction(
                ethers.utils.parseEther("0.0001"),
                3,
                "test item",
                duration
            )

            const curAuction = await auct.auctions(0)
            expect(curAuction.item).to.eq("test item")
            const ts = await getTimestamp(tx.blockNumber)
            expect(curAuction.endsAt).to.eq(ts + duration)
        })
    })

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }

    describe("buy", function() {
        it("should allows to buy", async function() {
            const duration = 60
            await auct.connect(seller).createAuction(
                ethers.utils.parseEther("0.0001"),
                3,
                "test item",
                duration
            )
            this.timeout(5000)
            await delay(1000)

            const stuffTx = await  auct.connect(buyer).buy(0, {value: ethers.utils.parseEther("0.0001")})
            
            const curAuction = await auct.auctions(0)
            const finPrice = curAuction.finalPrice

            await expect(() => stuffTx).to.changeEtherBalance(seller, finPrice - Math.floor((finPrice * 10) / 100))
        

            await expect(stuffTx).to.emit(auct, "AuctionEnded").withArgs(0, finPrice, buyer.address)

            await expect(auct.coonext(buyer).buy(0, {value: ethers.utils.parseEther("0.0001")}).to.be.revertedWith("stopped!"))
        })
    })
})