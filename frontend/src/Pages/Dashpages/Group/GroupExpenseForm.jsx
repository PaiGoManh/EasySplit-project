import { useState, useEffect } from "react";

const FormSplitBill = ({ groupId, members = [], currency, onClose, userId }) => {
    const [bill, setBill] = useState('');
    const [splitMethod, setSplitMethod] = useState('equal');
    const [customAmounts, setCustomAmounts] = useState({});
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [currentGroupId, setCurrentGroupId] = useState(groupId); 

    const handleCustomAmountChange = (memberId, value) => {
        setCustomAmounts(prevAmounts => ({
            ...prevAmounts,
            [memberId]: value
        }));
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bill) {
            setError('Bill value is required.');
            return;
        }

        if (splitMethod === 'custom') {
            const totalCustomAmount = Object.values(customAmounts).reduce((acc, amount) => acc + amount, 0);

            if (totalCustomAmount !== Number(bill)) {
                setError('The total of custom amounts does not match the bill amount.');
                return;
            }
        }

        setError('');

        const splitDetails = members.map(member => ({
            memberId: member._id,
            amount: splitMethod === 'equal'
                ? bill / members.length
                : customAmounts[member._id] || 0,
        }));

        const expense = {
            groupId: currentGroupId,
            amount: Number(bill),
            title: title || 'No Title',
            description: description || 'No Description',
            splitDetails: JSON.stringify(splitDetails),
            file: file ? file.name : '',
            splitMethod,
        };

        try {
            const response = await fetch('http://api:5000/groupexpense/add', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(expense),
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Expense added successfully:', data);
        } catch (error) {
            console.error('Failed to add expense:', error);
        }

        setBill('');
        setCustomAmounts({});
        setTitle('');
        setDescription('');
        setFile(null);
        setSplitMethod('equal');
        setCurrentGroupId(groupId);
        onClose();
    };

    return (
        <form
            className="form-split-bill bg-white border rounded-lg shadow-lg p-6 max-h-[80vh] overflow-y-auto"
            onSubmit={handleSubmit}
        >
            <h2 className="text-xl font-bold mb-4">Split a bill</h2>

            <label className="block mb-2">💰 Bill value</label>
            <input
                type="number"
                value={bill}
                onChange={(e) => setBill(Number(e.target.value))}
                className="border border-gray-300 p-2 mb-4 w-full"
            />

            <label className="block mb-2">📑 Title</label>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border border-gray-300 p-2 mb-4 w-full"
            />

            <label className="block mb-2">📝 Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 mb-4 w-full"
                rows="4"
            />

            <label className="block mb-2">🗂️ File (optional)</label>
            <input
                type="file"
                onChange={handleFileChange}
                className="border border-gray-300 p-2 mb-4 w-full"
            />

            <label className="block mb-2">🔄 Split Method</label>
            <select
                value={splitMethod}
                onChange={(e) => setSplitMethod(e.target.value)}
                className="border border-gray-300 p-2 mb-4 w-full"
            >
                <option value="equal">Equal</option>
                <option value="custom">Custom</option>
            </select>

            {splitMethod === 'custom' && (
                <>
                    <h3 className="text-lg font-bold mb-2">Custom Amounts</h3>
                    {members.map(member => (
                        <div key={member._id} className="mb-4">
                            <label className="block mb-1">{member.username}'s expense</label>
                            <input
                                type="number"
                                value={customAmounts[member._id] || ''}
                                onChange={(e) => handleCustomAmountChange(member._id, Number(e.target.value))}
                                className="border border-gray-300 p-2 w-full"
                            />
                        </div>
                    ))}
                </>
            )}

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="mt-4">
                <h3 className="text-lg font-bold">Members and their expenses:</h3>
                <ul className="list-disc pl-5">
                    {members.map(member => (
                        <li key={member._id}>
                            {member.username}: ${splitMethod === 'equal'
                                ? (bill / members.length).toFixed(2)
                                : customAmounts[member._id] || 0}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-4 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Close
                </button>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default FormSplitBill;
