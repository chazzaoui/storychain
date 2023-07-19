import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useAccount } from 'wagmi';
import Write from './write';
import Login from './login';

const Home: NextPage = () => {
  const { isConnected } = useAccount();
  return <>{isConnected ? <Write /> : <Login />}</>;
};

export default Home;
