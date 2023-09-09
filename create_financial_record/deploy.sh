#!/bin/bash
WALLETADDRESS="aleo13u94svxm8arf7qncn8hj6ypaxcmcpkkkv3wrpgszsxmqfgdqmuys7z22ax"
PRIVATEKEY="APrivateKey1zkpHD6U9E2NoPkDsHR6DynzUWm1Ns2n2NKsMkRT4NKk6uQK"

APPNAME="create_financial_record"
PATHTOAPP=$(realpath -q $APPNAME)

RECORD="{
  owner: aleo13u94svxm8arf7qncn8hj6ypaxcmcpkkkv3wrpgszsxmqfgdqmuys7z22ax.private,
  microcredits: 50000000u64.private,
  _nonce: 8062641925491950253687433891516803275378281494800078525450670532452506358456group.public
}"

cd .. && snarkos developer deploy "${APPNAME}.aleo" --private-key "${PRIVATEKEY}" --query "https://vm.aleo.org/api" --path "./${APPNAME}/build/" --broadcast "https://vm.aleo.org/api/testnet3/transaction/broadcast" --fee 1000000 --record "${RECORD}"``

