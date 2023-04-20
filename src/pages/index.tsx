import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  Textarea,
} from "@chakra-ui/react";
import { BigNumber, ethers } from "ethers";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"] });

const Header = () => {
  return (
    <Box h="100%">
      <Container maxWidth="6xl" h="100%">
        <Flex align="center" h="100%">
          <Heading as="h1" fontSize="lg" fontWeight="light">
            ethereum Deploy Cost calculator
          </Heading>
        </Flex>
      </Container>
    </Box>
  );
};

const Body = () => {
  const [contract, setContract] =
    useState(`// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SimpleERC721 is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("SimpleERC721", "SE721") {}

    function mint(address to) public returns (uint256) {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _safeMint(to, newItemId);

        return newItemId;
    }
}
  `);
  const [gasLimitWei, setGasLimitWei] = useState("");
  const [gasLimitGwei, setGasLimitGwei] = useState("");
  const [gasLimitEther, setGasLimitEther] = useState("");
  const [gasPriceWei, setGasPriceWei] = useState("");
  const [gasPriceGwei, setGasPriceGwei] = useState("");
  const [gasPriceEther, setGasPriceEther] = useState("");
  const [transactionFeeWei, setTransactionFeeWei] = useState("");
  const [transactionFeeGwei, setTransactionFeeGwei] = useState("");
  const [transactionFeeEther, setTransactionFeeEther] = useState("");

  const clickEstimate = async () => {
    try {
      const resp = await fetch("/api/hello", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contract: contract }),
      });

      //res.status(200).json({ gasLimit, gasPrice, gasFee });
      if (resp) {
        const data = await resp.json();
        if (data.gasLimit) {
          const gasLimit = BigNumber.from(data.gasLimit);
          setGasLimitWei(gasLimit.toString());
          setGasLimitGwei(
            ethers.utils.formatUnits(gasLimit, "gwei").toString()
          );
          setGasLimitEther(
            ethers.utils.formatUnits(gasLimit, "ether").toString()
          );
        }
        if (data.gasPrice) {
          const gasPrice = BigNumber.from(data.gasPrice);
          setGasPriceWei(gasPrice.toString());
          setGasPriceGwei(
            ethers.utils.formatUnits(gasPrice, "gwei").toString()
          );
          setGasPriceEther(
            ethers.utils.formatUnits(gasPrice, "ether").toString()
          );
        }
        if (data.transactionFee) {
          const transactionFee = BigNumber.from(data.transactionFee);
          setTransactionFeeWei(transactionFee.toString());
          setTransactionFeeGwei(
            ethers.utils.formatUnits(transactionFee, "gwei").toString()
          );
          setTransactionFeeEther(
            ethers.utils.formatUnits(transactionFee, "ether").toString()
          );
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  return (
    <Box h="100%">
      <Container maxWidth="6xl" h="100%">
        <Grid templateColumns="repeat(12, 1fr)" gap={4} py={12}>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <FormControl h="calc(100% - 40px)">
              <FormLabel fontSize="sm">Contract</FormLabel>
              <Textarea
                value={contract}
                h="calc(100% - 21px)"
                onChange={(evt) => setContract(evt.target.value)}
              ></Textarea>
            </FormControl>
            <Button mt={4} w="100%" onClick={clickEstimate}>
              Estimate
            </Button>
          </GridItem>
          <GridItem colSpan={{ base: 12, md: 6 }}>
            <Heading as="h3" fontSize="xl" fontWeight="light">
              Gas Limit (Estimated)
            </Heading>
            <FormControl mt={2}>
              <FormLabel fontSize="sm">Wei</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={gasLimitWei} />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Gwei</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={gasLimitGwei} />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Ether</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={gasLimitEther} />
              </InputGroup>
            </FormControl>
            <Heading as="h3" fontSize="xl" fontWeight="light" mt={8}>
              Current Gas Price (Estimated)
            </Heading>
            <FormControl mt={2}>
              <FormLabel fontSize="sm">Wei</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={gasPriceWei} />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Gwei</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={gasPriceGwei} />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Ether</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={gasPriceEther} />
              </InputGroup>
            </FormControl>
            <Heading as="h3" fontSize="xl" fontWeight="light" mt={8}>
              Total Transaction Fee (Estimated)
            </Heading>
            <FormControl mt={2}>
              <FormLabel fontSize="sm">Wei</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={transactionFeeWei} />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Gwei</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={transactionFeeGwei} />
              </InputGroup>
            </FormControl>
            <FormControl>
              <FormLabel fontSize="sm">Ether</FormLabel>
              <InputGroup size="lg">
                <Input type="number" value={transactionFeeEther} />
              </InputGroup>
            </FormControl>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
const Footer = () => {
  return (
    <Box h="100%">
      <Container maxWidth="6xl" h="100%">
        <Flex align="center" h="100%" justify="center">
          <Heading as="h1" fontSize="lg" fontWeight="light">
            Created by yosuke.kmt@gmail.com
          </Heading>
        </Flex>
      </Container>
    </Box>
  );
};

export default function Home() {
  return (
    <>
      <Head>
        <title>ethereum Deploy Cost calculator</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box h="100vh">
        <Box as="header" h="48px" bg="gray.100">
          <Header />
        </Box>
        <Box as="main">
          <Body />
        </Box>
        <Box as="footer" h="48px" bg="gray.100">
          <Footer />
        </Box>
      </Box>
    </>
  );
}
