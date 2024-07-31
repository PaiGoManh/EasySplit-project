import React, { useEffect, useState } from 'react';
import profile from '../../../assets/profile.png'
import Banner from '../../../assets/banner.png'

const IntegratedProfileDashboard = () => {
  const [user, setUser] = useState(null);
  const [groupCount, setGroupCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, groupRes, userRes, expenseRes] = await Promise.all([
          fetch('http://api:5000/auth/currentUser'),
          fetch('http://api:5000/group/groupcount'),
          fetch('http://api:5000/auth/userCount'),
          fetch('http://api:5000/groupexpense/totalexpensesofuser')
        ]);

        const profileData = await profileRes.json();
        const groupData = await groupRes.json();
        const userData = await userRes.json();
        const expenseData = await expenseRes.json();

        setUser(profileData);
        setGroupCount(groupData.count);
        setUserCount(userData.count);
        setTotalExpenses(expenseData.totalExpenses);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Error loading user data</div>;
  }

  return (
    <div className='text-black'>
      
      <div className="flex flex-col w-full px-[1vw] max-lg:px-5 2xl:px-[15vw] relative text-blackBg">
        <img
          width={175}
          height={175}
          src={user?.profileBanner ? `/api/uploads/${user.profileBanner}` : Banner}
          alt={"Profile background"}
          className="w-[1000px] border border-solid aspect-[5] border-stone-50 max-md:max-w-full"
        />
        <div className="flex z-10 flex-col pr-0.5 pl-3.5 w-[94%] lg:w-[84%] mt-4 2xl:w-[calc(84%-15vw)] absolute top-[80%]">
          <div className="flex gap-5 justify-between items-center w-full max-md:flex-wrap max-md:max-w-full">
            <div className="flex flex-col self-stretch">
              <div className="flex flex-auto gap-2 items-center">
                <img
                  width={130}
                  height={130}
                  src={user?.profilePicture ? `/api/uploads/${user.profilePicture}` : profile}
                  alt={"Profile picture"}
                  className="self-start max-w-full border-solid aspect-square border-[5px] rounded-button&card border-stone-50"
                />

              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="gap-[5%] flex justify-end mr-5 mt-5">
        {/* <div className="w-[160px] h-[90px] border-white border bg-gray-900 text-center pt-4">
          <h1 className="text-xl font-bold text-white">Total<span className='mr-1'></span>Expenses</h1>
          <h1 className="text-green-500 text-2xl mt-2">{totalExpenses} rs</h1>
        </div> */}
        {/* <div className="w-[160px] h-[90px] border-white border bg-gray-900 text-center pt-4">
          <h1 className="text-xl font-bold text-white">You Owe</h1>
          <h1 className="text-green-500 text-2xl mt-2">{youOwe} rs</h1>
        </div>
        <div className="w-[160px] h-[90px] bg-gray-900 border-white border text-center pt-4">
          <h1 className="text-xl font-bold text-white">You are Owed</h1>
          <h1 className="text-green-500 text-2xl mt-2">{youAreOwed} rs</h1>
        </div> */}
        <div className="w-[160px] h-[90px] bg-gray-900 border-white border text-center pt-4">
          <h1 className="text-xl font-bold text-white">Groups</h1>
          <h1 className="text-green-500 text-2xl mt-2">{groupCount}</h1>
        </div>
        <div className="w-[160px] h-[90px] bg-gray-900 border-white border text-center pt-4">
          <h1 className="text-xl font-bold text-white">Users</h1>
          <h1 className="text-green-500 text-2xl mt-2">{userCount}</h1>
        </div>
      </div>
      <div className="ml-8">
                  <div className="mt-3 text-4xl flex gap-3">
                    <h1>{user.firstName}</h1>
                    <h1>{user.lastName}</h1>
                  </div>
                  <div className=''>
                    <div className="mt-3 text-2xl">@{user.username}</div>
                    <div className="mt-1 text-l">{user.email}</div>
                    <div className="mt-1 text-l">{user.phoneNumber}</div>
                  </div>
                </div>
    </div>
  );
};

export default IntegratedProfileDashboard;
