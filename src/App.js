import { useEffect, useState } from "react";
import {
  VStack,
  useDisclosure,
  Button,
  Text,
  HStack,
  Select,
  Input,
  Box
} from "@chakra-ui/react";
import SelectWalletModal from "./Modal";
import { useWeb3React } from "@web3-react/core";
import { CheckCircleIcon, WarningIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";
import { networkParams } from "./networks";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";
import { ethers } from 'ethers';
import contract from './abi.json';
import logo from './img/logo.jpg';
import qrcode from './img/verifica.png';
import { providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import './app.css';

const contractAddress = "0xB838D92019595C5d59735d9acd4B17C91Bba3337";
const abi = contract;


export default function Home() {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    library,
    chainId,
    account,
    activate,
    deactivate,
    active
  } = useWeb3React();
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  const [signedMessage, setSignedMessage] = useState("");
  const [verified, setVerified] = useState();
  const [passed, setTransaction] = useState(0);




  const handleNetwork = (e) => {
    const id = e.target.value;
    setNetwork(Number(id));

  };

  const handleInput = (e) => {
    const msg = e.target.value;
    setMessage(msg);
  };

  const switchNetwork = async () => {
    try {
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }]
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };

  const signMessage = async () => {
    if (!library) return;
    try {
      const signature = await library.provider.request({
        method: "personal_sign",
        params: [message, account]
      });
      setSignedMessage(message);
      setSignature(signature);
    } catch (error) {
      setError(error);
    }

  };

  const verifyMessage = async () => {
    if (!library) return;
    try {
      const verify = await library.provider.request({
        method: "personal_ecRecover",
        params: [signedMessage, signature]
      });
      setVerified(verify === account.toLowerCase());
    } catch (error) {
      setError(error);
    }
  };

  const testaccount = () =>{
    console.log("id:" + chainId);
    console.log("account:" + account);
    const provider = new WalletConnectProvider({
      infuraId: "f9118570e19b4e2aa80e3afd8da05d55", // Required
    });
    //await provider.enable();


    const _provider = new providers.Web3Provider(provider);
    const signer = _provider.getSigner();
    const nftContract = new ethers.Contract(contractAddress, abi, signer);
    console.log("contract address" + contractAddress);
    console.log(abi);
    console.log(_provider);
    console.log(signer);
    console.log(nftContract);

  }

  const verify_contract_conn = async () =>{

       console.log(passed);



       console.log("id:" + chainId);
       console.log("account:" + account);
       const provider2 = new WalletConnectProvider({
         infuraId: "f9118570e19b4e2aa80e3afd8da05d55", // Required
       });
       //await provider.enable();
       // const provider2 = new WalletConnectProvider({
       //      rpc: {  137: "https://polygon-mainnet.infura.io/v3/f9118570e19b4e2aa80e3afd8da05d55"}  });

       await provider2.enable();
       console.log(provider2);

       const provider = new ethers.providers.Web3Provider(provider2);
       console.log(provider);

       //const provider = new ethers.providers.Web3Provider(ethereum);

       const signer = provider.getSigner();

       console.log(signer);
       const nftContract = new ethers.Contract(contractAddress, abi, signer);
       console.log("Initialize payment");
       console.log(nftContract);
       //let nftTxn = await nftContract.entry_check();
       nftContract.entry_check().then(async(nftTxn) => {

          console.log("Matic...please wait");
          await nftTxn.wait();
          console.log("Transaction executed  ${nftTxn.hash}");
          console.log(nftTxn.hash);
          const hash = nftTxn.hash;

          // setVerified(verify === account.toLowerCase());
          setTransaction(1);
          console.log(passed)



          }).catch((err) => {
            console.log(err)
          })


  }

  const verify_contract_conn_desktop = async () =>{

       console.log(passed);



       console.log("id:" + chainId);
       console.log("account:" + account);
       const provider = new ethers.providers.Web3Provider(ethereum);
       const signer = provider.getSigner();
       console.log(signer);
       const nftContract = new ethers.Contract(contractAddress, abi, signer);
       console.log("Initialize payment");
       let nftTxn = await nftContract.entry_check();
       console.log("Matic...please wait");
       await nftTxn.wait();
       console.log("Transaction executed  ${nftTxn.hash}");
       console.log(nftTxn.hash);
       const hash = nftTxn.hash;

       // setVerified(verify === account.toLowerCase());
       setTransaction(1);
       console.log(passed)

  }



  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    setNetwork("");
    setMessage("");
    setSignature("");
    setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();
  };

  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    if (provider) activate(connectors[provider]);
  }, []);
  // <div>
  //   <Text>{`Network ID: ${chainId ? chainId : "No Network"}`}</Text>
  //
  // </div>


  return (


    <>

    <div className="App1">



        <div className = "content_small">

        </div>

        <div className="App2">


            <img src={logo} />


        </div>

        <div>
          <Text
            margin="0"
            lineHeight="1.15"
            fontSize={["1.5em", "2em", "3em", "4em"]}
            fontWeight="600"
          >
            Let's verify from Wallecto
          </Text>

        </div>



        <div className = "content_small">

        </div>

        <div>
            <div>
               <b>{passed ?

                <img src={qrcode} /> :

                 'The user is not authorized'}</b>
            </div>
        </div>

        <div className = "content_small">

        </div>






        <div className = "content_small">

        </div>


        <div>
          <Button onClick={verify_contract_conn_desktop}>VERIFICA</Button>

      </div>

      <div className = "content_small">

      </div>





        {!active ? (
          <Button onClick={onOpen}>Connect Wallet</Button>


        ) : (

          <Button onClick={disconnect}>Disconnect</Button>


        )



      }



      <div className = "content_small">

      </div>

      <div>
          <Text>{`Connection Status: `}</Text>
          {active ? (
            <CheckCircleIcon color="green" />
          ) : (
            <WarningIcon color="#cd5700" />
          )}

      </div>

      <div className = "content_small">

      </div>


      <div>
          <Text>{`Account: ${(account)}`}</Text>

      </div>

      <div className = "content_small">

      </div>




        <div className = "content_big">

        </div>


    </div>
    <SelectWalletModal isOpen={isOpen} closeModal={onClose} />

    </>
  );
}
