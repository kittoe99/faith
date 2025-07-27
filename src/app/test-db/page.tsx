'use client';

import { useState, useEffect } from 'react';
import { TestService } from '@/lib/db-service';

export default function TestDBPage() {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTest, setNewTest] = useState({ name: '', description: '', value: 0 });
  
  useEffect(() => {
    fetchTests();
    
    // Subscribe to real-time changes
    const subscription = TestService.subscribe((payload) => {
      console.log('Real-time change:', payload);
      fetchTests(); // Refresh data when changes occur
    });
    
    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const fetchTests = async () => {
    setLoading(true);
    try {
      const { data, error } = await TestService.getAll();
      if (error) throw error;
      setTests(data || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCreate = async () => {
    try {
      const { data, error } = await TestService.create(newTest);
      if (error) throw error;
      
      // Reset form and refresh data
      setNewTest({ name: '', description: '', value: 0 });
      fetchTests();
      
      console.log('Test created:', data);
    } catch (error) {
      console.error('Error creating test:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await TestService.delete(id);
      if (error) throw error;
      
      // Refresh data
      fetchTests();
      
      console.log('Test deleted:', id);
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };
  
  if (loading) {
    return <div className="p-4">Loading tests...</div>;
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Database Test Page</h1>
      
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Create New Test</h2>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={newTest.name}
            onChange={(e) => setNewTest({...newTest, name: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newTest.description}
            onChange={(e) => setNewTest({...newTest, description: e.target.value})}
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Value"
            value={newTest.value}
            onChange={(e) => setNewTest({...newTest, value: parseInt(e.target.value) || 0})}
            className="w-full p-2 border rounded"
          />
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Test
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Existing Tests</h2>
        {tests.length === 0 ? (
          <p className="text-gray-500">No tests found. Create one above!</p>
        ) : (
          <div className="space-y-3">
            {tests.map((test) => (
              <div key={test.id} className="p-3 border rounded flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{test.name}</h3>
                  <p className="text-sm text-gray-600">{test.description}</p>
                  <p className="text-sm text-gray-500">Value: {test.value}</p>
                  <p className="text-xs text-gray-400">Created: {new Date(test.created_at).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => handleDelete(test.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
