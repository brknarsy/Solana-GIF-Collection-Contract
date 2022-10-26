const anchor = require('@project-serum/anchor')

const { SystemProgram } = anchor.web3;

const main = async() => {
  console.log("Starting test...")
  
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider) // it gets this data from solana config get

  const program = anchor.workspace.Learnsolana;

  const baseAccount = anchor.web3.Keypair.generate();

  let tx = await program.rpc.startStuffOff({
    accounts:{
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId, 
    },
    signers: [baseAccount],
  });

  console.log("Your transaction signature:", tx)

  let account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  console.log("GIF Count", account.totalGifs.toString());

  await program.rpc.addGif("https://media.giphy.com/media/OhSwDM0GqX24a0ilbm/giphy.gif", {
    accounts:{
      baseAccount: baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  });

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);

  const doesLinkMatch = (element) => element.gifLink == "https://media.giphy.com/media/OhSwDM0GqX24a0ilbm/giphy.gif";

  let index = account.gifList.findIndex(doesLinkMatch)
  console.log("Upvote Count", account.gifList[index].upvotes.toString())
  console.log("GIF List", account.gifList)

  await program.rpc.updateItem("https://media.giphy.com/media/OhSwDM0GqX24a0ilbm/giphy.gif",{
    accounts:{
      baseAccount:baseAccount.publicKey,
      user: provider.wallet.publicKey,
    },
  })

  account = await program.account.baseAccount.fetch(baseAccount.publicKey);
  index = account.gifList.findIndex(doesLinkMatch)
  console.log("Upvote Count", account.gifList[index].upvotes.toString())
  console.log("GIF List", account.gifList)

}

const runMain = async() => {
  try {
    await main();
    process.exit(0);
  }
  catch (error) {
    console.log(error);
    process.exit(1);
  }
}

runMain();

