import React from 'react';
import SwitchText from '../../components/Styling/SwitchText';
import logo from '../../assets/easySplit_logo.png';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/frontpage.png';
import hou from '../../assets/home.png';
import events from '../../assets/events.png';
import trip from '../../assets/trip.png';
import friends from '../../assets/friensd.png';

const Home = () => {
  return (
    <>
        <div className='w-screen h-screen bg-gray-900'>
        <nav className='flex items-center text-white justify-between mr-[5%] ml-[-2%] overflow-y-auto'>
          <div className='flex items-center gap-[3%]'>
            <img src={logo} className='w-[150px]' alt='EasySplit Logo' />
            <h1 className='font-bold text-xl md:text-3xl ml-[-10%] md:ml-[-18%]'>EasySplit</h1>
          </div>
          <div className='flex gap-4 items-center'>
            <Link to='/login'>
              <h1 className='text-md md:text-l cursor-pointer hover:text-gray-500'>Log In</h1>
            </Link>
            <Link to='/signup'>
              <button className='w-[80px] h-8 md:w-[100px] lg:h-10 border rounded-md bg-[#1c1c1e] hover:bg-[#333] text-md md:text-xl'>
                Sign Up
              </button>
            </Link>
          </div>
        </nav>

        <div className='flex flex-col md:flex-row justify-between items-center ml-[4%]'>
          <div className='flex flex-col p-4 md:p-8'>
            <div className=''>
              <h1 className='text-white text-4xl md:text-4xl font-bold mb-2'>Less stress when</h1>
              <h1 className='text-white text-4xl md:text-4xl font-bold mb-2'>sharing expenses</h1>
              <h1 className='text-white text-3xl md:text-4xl font-bold mb-4'>
                <SwitchText />
              </h1>
            </div>
            <div className='text-white flex gap-5 md:gap-10 mt-5 mb-7'>
              <img src={hou} className='w-20 h-16 md:w-15 md:h-15' alt='Icon 1' />
              <img src={friends} className='w-20 h-16 md:w-15 md:h-15 ml-[-3%]' alt='Icon 2' />
              <img src={events} className='w-20 h-16 md:w-15 md:h-15 ml-[-3%] pt-1' alt='Icon 3' />
              <img src={trip} className='w-20 h-16 md:w-15 md:h-15 ml-[-4%]' alt='Icon 4' />
            </div>
            <div className='text-white md:mt- text-xl md:text-2xl'>
              <h1 className='mt-2 '>Keep track of your shared expenses and</h1>
              <h1 className='mt-2  '>balances with housemates, trips, groups, </h1>
              <h1 className='mt-2 '>friends, and family</h1>
            </div>

          </div>
          <div className='mr-[5%]'>
            <img src={heroImage} className='w-[520px]' alt='Hero' />
          </div>
        </div>
      </div>  
    </>
  );
};

export default Home;




  