import { expect } from "chai";
import { ethers } from "hardhat";

describe("When Brasileirao is deployed", function () {
  it("initialize with four teams", async () => {
    const Brasileirao = await ethers.getContractFactory("Brasileirao");
    const brasileirao = await Brasileirao.deploy();
    const instance = await brasileirao._deployed();
    expect(await instance._teamsCount()).to.equal(4);
  });

  it("initialize the teams with the correct values", async () => {
    const Brasileirao = await ethers.getContractFactory("Brasileirao");
    const brasileirao = await Brasileirao.deploy();
    const instance = await brasileirao._deployed();
    const firstTeam = await instance.teams(1);
    const secondTeam = await instance.teams(2);
    const thirdTeam = await instance.teams(3);
    const fourthTeam = await instance.teams(4);

    // 1º team
    expect(await firstTeam.id).to.equal(1);
    expect(await firstTeam.name).to.equal("Sao Paulo");
    expect(await firstTeam.bets).to.equal(0);

    // 2º team
    expect(await secondTeam.id).to.equal(2);
    expect(await secondTeam.name).to.equal("Corinthians");
    expect(await secondTeam.bets).to.equal(0);

    // 3º team
    expect(await thirdTeam.id).to.equal(3);
    expect(await thirdTeam.name).to.equal("Santos");
    expect(await thirdTeam.bets).to.equal(0);

    // 4º team
    expect(await fourthTeam.id).to.equal(4);
    expect(await fourthTeam.name).to.equal("Palmeiras");
    expect(await fourthTeam.bets).to.equal(0);
  });

  it("allows a voter to cast a vote", async () => {
    const Brasileirao = await ethers.getContractFactory("Brasileirao");
    const accounts = await ethers.getSigners();
    const brasileirao = await Brasileirao.deploy();
    const instance = await brasileirao._deployed();
    await instance.bet(1, { from: await accounts[0].address });
    const bet = await instance.teams(1);
    expect(bet.bets).to.equal(1);
  });

  it("emits a Betted event", async () => {
    const Brasileirao = await ethers.getContractFactory("Brasileirao");
    const accounts = await ethers.getSigners();
    const brasileirao = await Brasileirao.deploy();
    const instance = await brasileirao._deployed();
    await instance.bet(1, { from: await accounts[0].address });
    const bettedEvents = await brasileirao.filters.Betted(1);
    expect(bettedEvents.topics?.length).to.equal(2);
  });
});
