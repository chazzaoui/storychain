import { useEffect, useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractRead, useContractWrite } from 'wagmi';
import { abi, contractAddress } from '../../constants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { pinJSONToIPFS } from '../../handleipfs';

const Home: NextPage = () => {
  const [inputValue, setInputValue] = useState('');
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'mintNFT',
    args: [inputValue]
  });
  async function generateImage(text: string): Promise<string> {
    // Use a library or custom logic to generate an image based on the text
    // For example, you can use a library like html-to-image to convert HTML text to an image
    // Here's a simplified example using a dummy implementation that returns a placeholder URL
    return `https://dummyimage.com/400x200/000000/ffffff&text=${text}`;
  }

  async function uploadMetadata(
    storyName: string,
    storyText: string
  ): Promise<any> {
    const metadata = {
      name: storyName,
      description: 'Written by the community, for the community',
      image: await generateImage(storyText), // Generate image based on the story text
      // Add other metadata fields as needed
      attributes: []
    };
    const ipfshash = await pinJSONToIPFS(JSON.stringify(metadata));
    setInputValue(ipfshash.pinataUrl);
  }

  const {
    data: dataStory,
    isLoading: isLoadingStory,
    isSuccess: isSuccessStory,
    error: storyError,
    refetch
  } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'getStory'
  });

  const {
    data: dataName,
    isLoading: isLoadingName,
    isSuccess: isSuccessName,
    error: nameError
  } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: 'getName'
  });

  useEffect(() => {
    // Show a success toast and clear input when isSuccess is true
    if (isSuccess) {
      toast.success('Nft minted successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }

    // Show an error toast when there is an error
    if (error || storyError) {
      toast.error('Error: ' + error, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }
  }, [isSuccess, error, storyError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await uploadMetadata(dataName as string, dataStory as string);
    write();
  };

  return (
    <>
      <Head>
        <title>Story chain</title>
        <meta
          content='Generated by @rainbow-me/create-rainbowkit'
          name='Help write your communities story'
        />
        <link href='/favicon.ico' rel='icon' />
      </Head>
      <main className='h-screen w-screen py-16 flex flex-col items-center justify-center'>
        <div className='flex-1 w-1/2 flex flex-col items-center justify-start py-16'>
          <h1
            suppressHydrationWarning={true}
            className='text-4xl md:text-6xl lg:text-7xl text-center mb-8'
          >
            Write part of your community&apos;s story
          </h1>
          <div className='bg-white shadow-md p-6 rounded-lg text-center mb-8 w-4/5 mx-auto md:w-4/5'>
            <h1 className='text-lg md:text-xl lg:text-2xl'>{dataStory}</h1>
          </div>

          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            <button
              type='submit'
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Mint'}
            </button>
          </form>
        </div>
        {isSuccess ? (
          <div className='flex flex-col items-center'>
            <h2 className='text-2xl font-bold mb-4'>Contract Address:</h2>
            <a
              href={`https://explorer.testnet.mantle.xyz/address/${contractAddress}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-500 underline'
            >
              {contractAddress}
            </a>
          </div>
        ) : null}
        <footer className='flex items-center justify-center py-8 border-t border-gray-300'>
          <a
            href='https://trooplabs.lol/'
            rel='noopener noreferrer'
            target='_blank'
          >
            Made with ❤️ by your frens at Troop labs
          </a>
        </footer>

        <ToastContainer />
      </main>
    </>
  );
};

export default Home;
