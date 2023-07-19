import { useEffect, useState } from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useContractRead, useContractWrite } from 'wagmi';
import { abi, contractAddress } from '../constants';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/router';

const Write: NextPage = () => {
  const [inputValue, setInputValue] = useState('');
  const router = useRouter();
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: 'addPart',
    args: [inputValue]
  });

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

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    // Show a success toast and clear input when isSuccess is true
    if (isSuccess) {
      setInputValue('');
      refetch();
      toast.success('Story part added successfully!', {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      router.push(`/${contractAddress}/home`);
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
    await write();
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
      <main className='min-h-screen w-screen py-16 flex flex-col items-center justify-center'>
        <div className='flex-1 w-1/2 flex flex-col items-center justify-start py-16'>
          <h1
            suppressHydrationWarning={true}
            className='text-4xl md:text-6xl lg:text-7xl text-center mb-8'
          >
            Write part of your community's story
          </h1>
          <div
            style={{
              backgroundColor: '#ffffff',
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '24px',
              width: '50%',
              minHeight: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <h1 className='text-1xl md:text-2xl lg:text-3xl'>
              {dataStory + ' ' + inputValue}
            </h1>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            <textarea
              value={inputValue}
              onChange={handleInputChange}
              maxLength={50}
              placeholder='Insert here fren'
              className='px-4 py-2 border border-gray-300 rounded-lg resize-none mb-4'
              rows={4}
              disabled={isLoading}
            />
            <button
              type='submit'
              className={`bg-blue-500 text-white px-4 py-2 rounded-lg ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Submit'}
            </button>
          </form>
        </div>

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

export default Write;