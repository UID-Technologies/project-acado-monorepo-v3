/**
 * Test Authentication Page
 * 
 * Use this page to test if authentication is working and if you can create categories/fields.
 * 
 * Access: http://localhost:5173/test-auth
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { masterFieldsApi } from '@/api';

const TestAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [testResult, setTestResult] = useState<string>('');
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Check authentication status
    const tokenFromStorage = localStorage.getItem('token');
    const userFromStorage = localStorage.getItem('user');
    
    setToken(tokenFromStorage);
    if (userFromStorage) {
      try {
        setUser(JSON.parse(userFromStorage));
      } catch (e) {
        console.error('Failed to parse user:', e);
      }
    }
  }, []);

  const runAuthTest = async () => {
    setTestStatus('loading');
    setTestResult('Running authentication tests...\n\n');

    const addLog = (message: string) => {
      setTestResult(prev => prev + message + '\n');
    };

    try {
      // Test 1: Check if logged in
      addLog('=== TEST 1: Authentication Status ===');
      if (!token) {
        addLog('❌ FAIL: No token found in localStorage');
        addLog('You are NOT logged in!');
        addLog('\n👉 Solution: Click "Go to Login" button below');
        setTestStatus('error');
        return;
      }
      addLog('✅ Token exists in localStorage');

      // Test 2: Check user role
      addLog('\n=== TEST 2: User Role Check ===');
      if (!user) {
        addLog('❌ FAIL: No user data found');
        setTestStatus('error');
        return;
      }
      addLog(`User Email: ${user.email || 'N/A'}`);
      addLog(`User Role: ${user.role || 'N/A'}`);
      
      if (!['admin', 'editor'].includes(user.role)) {
        addLog(`❌ FAIL: Role "${user.role}" cannot create categories/fields`);
        addLog('Required roles: admin or editor');
        setTestStatus('error');
        return;
      }
      addLog('✅ User has required role');

      // Test 3: Test API call
      addLog('\n=== TEST 3: API Call Test ===');
      addLog('Attempting to create test category...');
      
      const testCategory = await masterFieldsApi.createCategory({
        name: `Test Category ${Date.now()}`,
        icon: 'TestTube',
        description: 'This is a test category created by authentication test'
      });

      addLog('✅ SUCCESS: Category created!');
      addLog(`Category ID: ${testCategory.id}`);
      addLog(`Category Name: ${testCategory.name}`);
      
      // Test 4: Verify it was saved
      addLog('\n=== TEST 4: Verify Saved ===');
      const categories = await masterFieldsApi.getCategories();
      const found = categories.find(c => c.id === testCategory.id);
      
      if (found) {
        addLog('✅ Category found in database');
      } else {
        addLog('⚠️ Category not found (might be a caching issue)');
      }

      // Test 5: Cleanup
      addLog('\n=== TEST 5: Cleanup ===');
      await masterFieldsApi.deleteCategory(testCategory.id);
      addLog('✅ Test category deleted');

      addLog('\n==================================');
      addLog('✅ ALL TESTS PASSED!');
      addLog('==================================');
      addLog('\nYou can now use Add Category and Add Field features.');
      addLog('If they still don\'t work, check browser console for errors.');
      
      setTestStatus('success');

    } catch (error: any) {
      addLog('\n❌ TEST FAILED!');
      addLog(`Error: ${error.message}`);
      
      if (error.response) {
        addLog(`Status Code: ${error.response.status}`);
        addLog(`Response: ${JSON.stringify(error.response.data, null, 2)}`);
        
        if (error.response.status === 401) {
          addLog('\n👉 Your token is invalid or expired');
          addLog('Solution: Logout and login again');
        } else if (error.response.status === 403) {
          addLog('\n👉 You don\'t have permission');
          addLog('Solution: Contact admin to change your role');
        }
      } else {
        addLog('\n👉 Network error or backend not running');
        addLog('Solution: Check if backend is running on port 4000');
      }
      
      setTestStatus('error');
    }
  };

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card className="p-6">
        <h1 className="text-3xl font-bold mb-4">Authentication Test Page</h1>
        <p className="text-muted-foreground mb-6">
          This page helps you diagnose why Add Category/Field might not be working.
        </p>

        <div className="space-y-4">
          {/* Current Status */}
          <div className="p-4 border rounded-lg">
            <h2 className="font-semibold mb-2">Current Status</h2>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">Logged In:</span>
                <span className={token ? 'text-green-600' : 'text-red-600'}>
                  {token ? '✅ Yes' : '❌ No'}
                </span>
              </div>
              {user && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Email:</span>
                    <span>{user.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Role:</span>
                    <span className={['admin', 'editor'].includes(user.role) ? 'text-green-600' : 'text-red-600'}>
                      {user.role || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Can Create Categories:</span>
                    <span className={['admin', 'editor'].includes(user.role) ? 'text-green-600' : 'text-red-600'}>
                      {['admin', 'editor'].includes(user.role) ? '✅ Yes' : '❌ No (need admin/editor role)'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={runAuthTest} 
              disabled={testStatus === 'loading'}
              className="flex-1"
            >
              {testStatus === 'loading' ? 'Running Tests...' : 'Run Authentication Test'}
            </Button>
            
            {!token && (
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/login'}
                className="flex-1"
              >
                Go to Login
              </Button>
            )}

            {token && (
              <Button 
                variant="outline"
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('user');
                  window.location.reload();
                }}
                className="flex-1"
              >
                Logout & Retry
              </Button>
            )}
          </div>

          {/* Test Results */}
          {testResult && (
            <div className={`p-4 rounded-lg font-mono text-sm whitespace-pre-wrap ${
              testStatus === 'success' ? 'bg-green-50 border-green-200' :
              testStatus === 'error' ? 'bg-red-50 border-red-200' :
              'bg-gray-50 border-gray-200'
            } border`}>
              {testResult}
            </div>
          )}

          {/* Instructions */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold mb-2">📝 What This Test Does:</h3>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Checks if you're logged in</li>
              <li>Verifies your user role (need admin/editor)</li>
              <li>Attempts to create a test category via API</li>
              <li>Verifies the category was saved</li>
              <li>Cleans up the test category</li>
            </ol>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold mb-2">⚠️ Common Issues:</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Not logged in:</strong> Click "Go to Login" and login first</li>
              <li><strong>Wrong role:</strong> Your account needs admin or editor role</li>
              <li><strong>Token expired:</strong> Click "Logout & Retry" to get a new token</li>
              <li><strong>Backend not running:</strong> Start backend service on port 4000</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TestAuth;

