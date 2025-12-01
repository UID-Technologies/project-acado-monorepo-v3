/**
 * Test script to verify API connection and basic operations
 * 
 * Usage: Import and call these functions from a component to test the API
 * 
 * Example:
 * import { testApiConnection } from '@/api/test-api-connection';
 * await testApiConnection();
 */

import { masterFieldsApi } from './masterFields.api';
import { axiosInstance } from '@/lib/axios';

/**
 * Test basic API connectivity
 */
export const testApiConnection = async () => {
  console.log('🧪 Testing API Connection...');
  
  try {
    const response = await axiosInstance.get('/health');
    console.log('✅ API Connection Successful:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ API Connection Failed:', error.message);
    console.error('Check that backend is running on:', import.meta.env.VITE_API_BASE_URL);
    return false;
  }
};

/**
 * Test fetching categories
 */
export const testGetCategories = async () => {
  console.log('🧪 Testing Get Categories...');
  
  try {
    const categories = await masterFieldsApi.getCategories();
    console.log('✅ Categories fetched successfully:', categories.length, 'categories found');
    console.log('Categories:', categories);
    return categories;
  } catch (error: any) {
    console.error('❌ Failed to fetch categories:', error.message);
    throw error;
  }
};

/**
 * Test fetching fields
 */
export const testGetFields = async () => {
  console.log('🧪 Testing Get Fields...');
  
  try {
    const fields = await masterFieldsApi.getMasterFields();
    console.log('✅ Fields fetched successfully:', fields.length, 'fields found');
    console.log('Fields:', fields);
    return fields;
  } catch (error: any) {
    console.error('❌ Failed to fetch fields:', error.message);
    throw error;
  }
};

/**
 * Test creating a category (requires authentication)
 */
export const testCreateCategory = async () => {
  console.log('🧪 Testing Create Category...');
  
  try {
    const newCategory = await masterFieldsApi.createCategory({
      name: `Test Category ${Date.now()}`,
      icon: 'TestTube',
      description: 'This is a test category',
      order: 999
    });
    console.log('✅ Category created successfully:', newCategory);
    return newCategory;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('❌ Not authenticated. Please login first.');
    } else if (error.response?.status === 403) {
      console.error('❌ Not authorized. Admin or Editor role required.');
    } else {
      console.error('❌ Failed to create category:', error.message);
    }
    throw error;
  }
};

/**
 * Test creating a subcategory (requires authentication)
 */
export const testCreateSubcategory = async (categoryId: string) => {
  console.log('🧪 Testing Create Subcategory...');
  
  try {
    const newSubcategory = await masterFieldsApi.createSubcategory(categoryId, {
      name: `Test Subcategory ${Date.now()}`,
      description: 'This is a test subcategory',
      order: 1
    });
    console.log('✅ Subcategory created successfully:', newSubcategory);
    return newSubcategory;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('❌ Not authenticated. Please login first.');
    } else if (error.response?.status === 403) {
      console.error('❌ Not authorized. Admin or Editor role required.');
    } else {
      console.error('❌ Failed to create subcategory:', error.message);
    }
    throw error;
  }
};

/**
 * Test creating a field (requires authentication)
 */
export const testCreateField = async (categoryId: string) => {
  console.log('🧪 Testing Create Field...');
  
  try {
    const newField = await masterFieldsApi.createMasterField({
      name: `testField${Date.now()}`,
      label: `Test Field ${Date.now()}`,
      type: 'text',
      placeholder: 'Enter test value',
      required: false,
      categoryId: categoryId,
      description: 'This is a test field',
      order: 999
    });
    console.log('✅ Field created successfully:', newField);
    return newField;
  } catch (error: any) {
    if (error.response?.status === 401) {
      console.error('❌ Not authenticated. Please login first.');
    } else if (error.response?.status === 403) {
      console.error('❌ Not authorized. Admin or Editor role required.');
    } else {
      console.error('❌ Failed to create field:', error.message);
    }
    throw error;
  }
};

/**
 * Test getting category hierarchy
 */
export const testGetHierarchy = async () => {
  console.log('🧪 Testing Get Category Hierarchy...');
  
  try {
    const { categories, fields } = await masterFieldsApi.getCategoryHierarchy();
    console.log('✅ Hierarchy fetched successfully');
    console.log('Categories:', categories.length);
    console.log('Fields:', fields.length);
    
    // Log hierarchy structure
    categories.forEach(category => {
      console.log(`\n📁 ${category.name}`);
      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach(sub => {
          console.log(`  📂 ${sub.name}`);
          const subFields = fields.filter(
            f => f.categoryId === category.id && f.subcategoryId === sub.id
          );
          subFields.forEach(field => {
            console.log(`    📄 ${field.label} (${field.type})`);
          });
        });
      }
      
      const categoryFields = fields.filter(
        f => f.categoryId === category.id && !f.subcategoryId
      );
      if (categoryFields.length > 0) {
        console.log('  📄 Fields without subcategory:');
        categoryFields.forEach(field => {
          console.log(`    📄 ${field.label} (${field.type})`);
        });
      }
    });
    
    return { categories, fields };
  } catch (error: any) {
    console.error('❌ Failed to fetch hierarchy:', error.message);
    throw error;
  }
};

/**
 * Run all read-only tests (no authentication required)
 */
export const runReadOnlyTests = async () => {
  console.log('\n🚀 Running Read-Only API Tests...\n');
  
  try {
    await testApiConnection();
    await testGetCategories();
    await testGetFields();
    await testGetHierarchy();
    
    console.log('\n✅ All read-only tests passed!');
    return true;
  } catch (error) {
    console.error('\n❌ Some tests failed. Check the logs above.');
    return false;
  }
};

/**
 * Run all tests including write operations (requires authentication)
 */
export const runAllTests = async () => {
  console.log('\n🚀 Running All API Tests...\n');
  
  try {
    // Test connection
    await testApiConnection();
    
    // Test reads
    const categories = await testGetCategories();
    await testGetFields();
    await testGetHierarchy();
    
    // Test writes (requires auth)
    const newCategory = await testCreateCategory();
    const newSubcategory = await testCreateSubcategory(newCategory.id);
    const newField = await testCreateField(newCategory.id);
    
    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await masterFieldsApi.deleteMasterField(newField.id);
    await masterFieldsApi.deleteSubcategory(newCategory.id, newSubcategory.id);
    await masterFieldsApi.deleteCategory(newCategory.id);
    console.log('✅ Test data cleaned up');
    
    console.log('\n✅ All tests passed!');
    return true;
  } catch (error) {
    console.error('\n❌ Some tests failed. Check the logs above.');
    return false;
  }
};

/**
 * Quick check to verify basic connectivity and data
 */
export const quickCheck = async () => {
  console.log('⚡ Quick API Check...');
  
  try {
    const isConnected = await testApiConnection();
    if (!isConnected) return false;
    
    const categories = await masterFieldsApi.getCategories();
    const fields = await masterFieldsApi.getMasterFields();
    
    console.log(`✅ API is working! Found ${categories.length} categories and ${fields.length} fields`);
    return true;
  } catch (error) {
    console.error('❌ Quick check failed');
    return false;
  }
};

// Export test suite
export const apiTests = {
  testApiConnection,
  testGetCategories,
  testGetFields,
  testCreateCategory,
  testCreateSubcategory,
  testCreateField,
  testGetHierarchy,
  runReadOnlyTests,
  runAllTests,
  quickCheck
};

export default apiTests;

