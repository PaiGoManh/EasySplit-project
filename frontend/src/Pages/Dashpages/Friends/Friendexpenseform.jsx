import React, { useState, useEffect } from 'react';

const AddExpenseForm = ({ groupId, onClose }) => {
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [splitMethod, setSplitMethod] = useState('equal');
  const [splitDetails, setSplitDetails] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchGroupMembers = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://api:5000/group/${groupId}/members`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setMembers(data);
        setSplitDetails(data.map(member => ({ member: member._id, amount: 0 })));
      } catch (error) {
        setError('Failed to fetch group members.');
        console.error('Error fetching group members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupMembers();
  }, [groupId]);

  const handleSplitDetailsChange = (e, memberId) => {
    const value = e.target.value;
    setSplitDetails(prevDetails =>
      prevDetails.map(detail =>
        detail.member === memberId ? { ...detail, amount: parseFloat(value) } : detail
      )
    );
  };

  const handleCheckboxChange = (e, memberId) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      setSplitDetails(prevDetails => [
        ...prevDetails,
        { member: memberId, amount: 0 }
      ]);
    } else {
      setSplitDetails(prevDetails =>
        prevDetails.filter(detail => detail.member !== memberId)
      );
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let calculatedSplitDetails = [];

      if (splitMethod === 'equal') {
        const amountPerMember = parseFloat(amount) / members.length;
        calculatedSplitDetails = members.map(member => ({
          member: member._id,
          amount: amountPerMember
        }));
      } else if (splitMethod === 'percentage') {
        const totalPercentage = splitDetails.reduce((sum, detail) => sum + detail.amount, 0);
        if (totalPercentage !== 100) {
          setError('Total percentage must equal 100.');
          setLoading(false);
          return;
        }
        calculatedSplitDetails = splitDetails.map(detail => ({
          member: detail.member,
          amount: (parseFloat(amount) * detail.amount) / 100
        }));
      }

      const response = await fetch('http://api:5000/expense/addgroupexpense', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          category,
          description,
          amount: parseFloat(amount),
          payer: 'currentUserId', // Replace with actual user ID if needed
          group: groupId,
          notes,
          splitMethod,
          splitDetails: calculatedSplitDetails
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log(result);
      onClose(); // Close the form after successful submission

      // Reset form fields if needed
      setCategory('');
      setDescription('');
      setAmount('');
      setNotes('');
      setSplitMethod('equal');
      setSplitDetails([]);
    } catch (error) {
      console.error('Error adding group expense:', error);
      setError('Failed to add group expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Add Expense</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleAddExpense}>
        <label>
          Category:
          <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} />
        </label>
        <label>
          Description:
          <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Amount:
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <label>
          Notes:
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>
        <label>
          Split Method:
          <select value={splitMethod} onChange={(e) => setSplitMethod(e.target.value)}>
            <option value="equal">Equal</option>
            <option value="percentage">Percentage</option>
          </select>
        </label>
        {splitMethod === 'percentage' && (
          <div>
            {members.map((member) => (
              <div key={member._id}>
                <label>
                  {member.name}:
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      splitDetails.find((detail) => detail.member === member._id)?.amount || 0
                    }
                    onChange={(e) => handleSplitDetailsChange(e, member._id)}
                  />
                  %
                </label>
              </div>
            ))}
          </div>
        )}
        <button type="submit">Add Expense</button>
      </form>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default AddExpenseForm;
