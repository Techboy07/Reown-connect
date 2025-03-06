import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";

// import the builder util
  import { WalletKit, WalletKitTypes } from '@reown/walletkit'
  import { buildApprovedNamespaces, getSdkError } from '@walletconnect/utils'

const projectId = import.meta.env.VITE__REOWN_PROJECT_ID;

if (!projectId) {
  throw new Error("projectId is not defined");
}

const core = new Core({
  projectId,
});

const metadata = {
  name: "Wallet connect demo",
  description: "AppKit Example",
  url: "https://reown.com/appkit", // origin must match your domain & subdomain
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

export const walletKit = await WalletKit.init({
  core, // <- pass the shared 'core' instance
  metadata,
});


async function onSessionProposal({ id, params} ){
  try{
    // ------- namespaces builder util ------------ //
    const approvedNamespaces = buildApprovedNamespaces({
      proposal: params,
      supportedNamespaces: {
        eip155: {
          chains: ['eip155:1', 'eip155:137'],
          methods: ['eth_sendTransaction', 'personal_sign'],
          events: ['accountsChanged', 'chainChanged'],
          accounts: [
            'eip155:1:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb',
            'eip155:137:0xab16a96d359ec26a11e2c2b3d8f8b8942d5bfcdb'
          ]
        }
      }
    })
    // ------- end namespaces builder util ------------ //

    const session = await walletKit.approveSession({
      id,
      namespaces: approvedNamespaces
    })
  }catch(error){
    // use the error.message to show toast/info-box letting the user know that the connection attempt was unsuccessful
    
    await walletKit.rejectSession({
      id: proposal.id,
      reason: getSdkError("USER_REJECTED")
    })
  }
}


walletKit.on('session_proposal', onSessionProposal)
