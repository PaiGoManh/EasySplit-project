import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import FormSplitBill from './GroupExpenseForm';


const GroupProfile = () => {
    const navigate = useNavigate()
    const { id } = useParams();
    const [group, setGroup] = useState(null);
    const [splits, setSplits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [splitsLoading, setSplitsLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [payAmount, setPayAmount] = useState('');
    const formRef = useRef(null);
    const loggedInUserId = sessionStorage.getItem('loggedInUserId');

    const fetchGroupData = async () => {
        try {
            const groupResponse = await fetch(`http://api:5000/group/getgroup/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!groupResponse.ok) {
                throw new Error(`Network response was not ok: ${groupResponse.statusText}`);
            }

            const groupData = await groupResponse.json();
            setGroup(groupData.group);

            await fetchSplitsData();
        } catch (error) {
            console.error('Error fetching group data:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchSplitsData = async () => {
        setSplitsLoading(true);
        try {
            const splitsResponse = await fetch(`http://api:5000/groupexpense/splits/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!splitsResponse.ok) {
                throw new Error(`Network response was not ok: ${splitsResponse.statusText}`);
            }

            const splitsData = await splitsResponse.json();
            setSplits(splitsData);
        } catch (error) {
            console.error('Error fetching splits data:', error.message);
        } finally {
            setSplitsLoading(false);
        }
    };

    useEffect(() => {
        console.log("Fetching data for group ID:", id);
        fetchGroupData();
    }, [id]);

    const handleAddExpenseClick = () => {
        setShowForm(true);
        setTimeout(() => {
            if (formRef.current) {
                formRef.current.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleFormClose = async () => {
        setShowForm(false);
        await fetchSplitsData();
    };

    const handlePayClick = (detail) => {
        console.log("Pay button clicked for detail:", detail);
        setSelectedDetail(detail);
        setPayAmount(detail.amount);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setSelectedDetail(null);
        setPayAmount('');
    };

    const handleModalSubmit = async () => {
        try {
            const response = await fetch(`http://api:5000/groupexpense/pay/${selectedDetail._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: payAmount }),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            await fetchSplitsData();
            handleModalClose();
        } catch (error) {
            console.error('Error updating payment:', error.message);
        }
    };

    const handleSettleClick = async (splitId) => {
        try {
            const response = await fetch(`http://api:5000/groupexpense/settle/${splitId}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            await fetchSplitsData();
        } catch (error) {
            console.error('Error settling split:', error.message);
        }
    };

    if (loading) {
        return <h1>Loading...</h1>;
    }

    const totalAmount = splits.reduce((acc, split) => 
    acc + split.splitDetails.reduce((sum, detail) => 
        sum + detail.amount, 0
        ), 0
    );
    const formattedTotalAmount = totalAmount.toFixed(2);

    // // Calculate "You Owe"
    // const totalOwed = splits.reduce((acc, split) => 
    // acc + split.splitDetails.reduce((sum, detail) => 
    //     detail.memberId === loggedInUserId ? sum + detail.amount : sum, 0
    // ), 0
    // );
    // const formattedTotalOwed = totalOwed.toFixed(2);

    // // Calculate "You Are Owed"
    // const totalOwedToYou = splits.reduce((acc, split) => 
    // acc + (split.payer.toString() === loggedInUserId ? split.splitDetails.reduce((sum, detail) => 
    //     sum + detail.amount, 0
    // ) : 0), 0
    // );
    // const formattedTotalOwedToYou = totalOwedToYou.toFixed(2);

    return (
        <div className="w-full mx-auto p-4 text-black overflow-y-auto max-h-[80vh]">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-2xl font-bold">Group Profile</h1>
                    <button 
                        onClick={() => navigate('/Dashboard/groups')}  
                        className="text-xl font-bold w-40 h-10 bg-gray-900 text-white p-2 hover:ring-sky-100">
                        Back to Group List
                    </button>
            </div>
            <div className="gap-[5%] flex mb-4">
                <div className="w-[160px] h-[90px] border-white border bg-gray-900 text-center pt-4">
                <h1 className="text-xl font-bold text-white">Total<span className='mr-1'></span>Expenses</h1>
                <h1 className="text-green-500 text-xl mt-2">
                {formattedTotalAmount} rs
                </h1>
                </div>

                {/* <div className="w-[160px] h-[90px] border-white border bg-gray-900 text-center pt-4 ">
                <h1 className="text-xl font-bold text-white">You Owe</h1>
                <h1 className="text-green-500 text-xl mt-2">{formattedTotalOwed} rs</h1>
                </div>

                <div className="w-[160px] h-[90px] bg-gray-900 border-white border text-center pt-4 ">
                <h1 className="text-xl font-bold text-white">You are Owed</h1>
                <h1 className="text-green-500 text-xl mt-2">{formattedTotalOwedToYou} rs</h1>
                </div> */}
                
                <div className="w-[160px] h-[90px] bg-gray-900 border-white border text-center pt-4 ">
                <h1 className="text-xl font-bold text-white">Members</h1>
                    <h1 className="text-green-500 text-xl mt-2">{group?.members.length || 0}</h1>
                </div>
            </div>

            {group && (
                <div className="bg-white border rounded-lg shadow-lg p-4">
                    <h2 className="text-xl font-bold">{group.name}</h2>
                    <p className="mt-2 text-gray-700">{group.description}</p>
                    <p className="mt-2 font-semibold">Members:</p>
                    <ul className="list-disc pl-5">
                        {group.members.map((member) => (
                            <li key={member._id}>{member?.username || 'Unknown User'}</li>
                        ))}
                    </ul>
                    <p className="mt-2 font-semibold">Currency: {group.currency}</p>
                </div>
            )}

            <button
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleAddExpenseClick}
            >
                Add Expense
            </button>

            {splitsLoading ? (
                <div className="bg-white border rounded-lg shadow-lg p-4 mb-4">
                    <h2 className="text-xl font-bold">Loading Split Details...</h2>
                </div>
            ) : (
                splits.length > 0 && (
                    <div className="bg-white border rounded-lg shadow-lg p-4 mb-4">
                        <h2 className="text-xl font-bold">Split Details</h2>
                        <div className="grid grid-cols-3 gap-4">
                            {splits.map(split => {
                                const isLoggedInUserPayer = loggedInUserId && loggedInUserId.toString() === split.payer.toString();
                                const allPaid = split.splitDetails.every(detail => detail.paid);

                                return (
                                    <div key={split._id} className="w-full border rounded-lg p-4 mb-4 shadow-lg flex flex-col">
                                        <div className="flex items-center mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold">{split.title}</h3>
                                                <p className="text-gray-600">{split.description}</p>
                                                <p className="text-gray-600">Payer: {split.payer?.username || 'Unknown User'}</p>
                                            </div>
                                        </div>

                                        {split.splitDetails.map(detail => {
                                            const isPayer = split.payer && split.payer.toString() === detail.memberId.toString();
                                            const isPaid = detail.paid || (isLoggedInUserPayer && isPayer);

                                            return (
                                                <ul key={detail.memberId._id} className="split-details list-none pl-0">
                                                    <li className="flex items-center mb-2">
                                                        <div className="flex-grow">
                                                            <p className="font-semibold">{detail.memberId?.username || 'Unknown User'}</p>
                                                            <p className="text-gray-600">{detail.amount ? detail.amount.toFixed(2) : ''}</p>
                                                            <p className={`font-semibold ${isPaid ? 'text-green-500' : 'text-red-500'}`}>
                                                                {isPaid ? 'Paid' : 'Not Paid'}
                                                            </p>
                                                        </div>
                                                    </li>
                                                </ul>
                                            );
                                        })}

                                        {!isLoggedInUserPayer && (
                                            <button
                                                className="pay-button bg-blue-500 text-white px-4 py-2 rounded mt-2"
                                                onClick={() => handlePayClick(split)}
                                            >
                                                Pay
                                            </button>
                                        )}
                                        
                                        {isLoggedInUserPayer && allPaid && (
                                            <button
                                                className="settle-button bg-green-500 text-white px-4 py-2 rounded mt-2"
                                                onClick={() => handleSettleClick(split._id)}
                                            >
                                                Settle
                                            </button>
                                        )}
                                        
                                        {isLoggedInUserPayer && !allPaid && (
                                            <p className="text-red-500 font-bold mt-2">Complete All Others to Settle</p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )
            )}

            {showForm && group && (
                <div
                    ref={formRef}
                    className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center"
                >
                    <div className="bg-white border rounded-lg shadow-lg p-6 w-full max-h-[80vh] overflow-y-auto">
                        <FormSplitBill
                            groupId={group._id}
                            members={group.members}
                            currency={group.currency}
                            onClose={handleFormClose}
                        />
                    </div>
                </div>
            )}

            {showModal && selectedDetail && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white border rounded-lg shadow-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Pay {selectedDetail.memberId?.username || 'Unknown User'}</h2>
                        <div className="mb-4">
                            <label className="block text-gray-700">Amount:</label>
                            <input
                                type="number"
                                value={payAmount}
                                onChange={(e) => setPayAmount(e.target.value)}
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                                onClick={handleModalClose}
                            >
                                Cancel
                            </button>
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded"
                                onClick={handleModalSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupProfile;
