/**
 * Community Response Adapter Utility
 * 
 * Adapts responses from the new acado-api community-posts endpoint to match the expected legacy format.
 * This is a HYBRID approach - migrates simple parts, keeps complex social features on legacy.
 */

/**
 * Adapts a single community category from new API format to legacy format
 * 
 * @param newCategory - Category from acado-api
 * @returns Category in legacy format
 */
export function adaptCommunityCategory(newCategory: any): any {
  if (!newCategory) return null;
  
  // If it's already in legacy format (has 'title' or 'category_name'), return as-is
  if ((newCategory.title || newCategory.category_name) && !newCategory.name) {
    return newCategory;
  }
  
  return {
    id: newCategory.id || newCategory._id,
    
    // Map to what Community component expects
    title: newCategory.name || newCategory.title || newCategory.category_name,
    image: newCategory.image || newCategory.category_image || newCategory.thumbnail || '', // Empty if no image - component will show default
    short_description: newCategory.description || newCategory.short_description || '',
    description: newCategory.description || '',
    
    // Also provide legacy field names for backward compatibility
    category_name: newCategory.name || newCategory.category_name,
    category_color: newCategory.color || newCategory.category_color || '#3B82F6',
    category_image: newCategory.image || newCategory.category_image || '', // Empty if no image
    
    // Social features - will be fetched from legacy if needed
    member_count: newCategory.member_count || 0,
    post_count: newCategory.post_count || 0,
    total_content: newCategory.post_count || newCategory.total_content || 0,
    is_joined: newCategory.is_joined || 0,
    user_mapping_id: newCategory.user_mapping_id || 0,
    
    // Metadata
    created_at: newCategory.createdAt || newCategory.created_at,
    updated_at: newCategory.updatedAt || newCategory.updated_at,
    created_by: newCategory.createdBy || newCategory.created_by,
    
    // Keep original for reference
    _original: newCategory,
  };
}

/**
 * Adapts an array of community categories
 * 
 * @param categories - Array of categories from acado-api
 * @returns Array of categories in legacy format
 */
export function adaptCommunityCategoriesArray(categories: any[]): any[] {
  if (!Array.isArray(categories)) return [];
  return categories.map(adaptCommunityCategory).filter(Boolean);
}

/**
 * Adapts community categories response from new API to legacy format
 * 
 * @param response - Response from API
 * @returns Adapted response in legacy format
 */
export function adaptCommunityCategoriesResponse(response: any): any {
  console.log('🔄 Adapting community categories response:', {
    hasSuccess: 'success' in response,
    hasData: 'data' in response,
    dataType: Array.isArray(response?.data) ? 'array' : typeof response?.data,
    dataCount: Array.isArray(response?.data) ? response.data.length : 0
  });
  
  // If response has 'success' field, it's from new API
  if (response && typeof response === 'object' && 'success' in response) {
    const categories = Array.isArray(response.data) ? response.data : [];
    const adapted = {
      data: adaptCommunityCategoriesArray(categories),
    };
    console.log('✅ Adapted categories:', adapted.data.length, 'categories');
    return adapted;
  }
  
  // If it's already in legacy format with 'data' array
  if (response && Array.isArray(response.data)) {
    return {
      data: adaptCommunityCategoriesArray(response.data),
    };
  }
  
  // If it's just an array
  if (Array.isArray(response)) {
    return {
      data: adaptCommunityCategoriesArray(response),
    };
  }
  
  console.warn('⚠️ Unknown response format:', response);
  return response;
}

/**
 * Adapts a single community post from new API format to legacy format
 * 
 * @param newPost - Post from acado-api
 * @returns Post in legacy format
 */
export function adaptCommunityPost(newPost: any): any {
  if (!newPost) return null;
  
  // If it's already in legacy format (has 'content_type'), return as-is
  if (newPost.content_type && !newPost.contentType) {
    return newPost;
  }
  
  return {
    id: newPost.id || newPost._id,
    title: newPost.title,
    description: newPost.description,
    content_type: newPost.contentType || newPost.content_type,
    category_id: newPost.categoryId || newPost.category_id,
    thumbnail: newPost.thumbnail || '',
    media: newPost.media || '',
    is_pinned: newPost.isPinned ? 1 : 0,
    
    // User info - will be populated from legacy or kept if available
    user_id: newPost.createdBy || newPost.user_id,
    user_name: newPost.author?.name || newPost.user_name || 'Unknown User',
    user_image: newPost.author?.image || newPost.user_image || '',
    
    // Category info - will be populated from legacy or kept if available
    category_name: newPost.category?.name || newPost.category_name || '',
    category_color: newPost.category?.color || newPost.category_color || '#3B82F6',
    
    // Social features - keep legacy values if available, otherwise default to 0
    likes_count: newPost.likes_count || newPost.likesCount || 0,
    comments_count: newPost.comments_count || newPost.commentsCount || 0,
    user_liked: newPost.user_liked || (newPost.userLiked ? 1 : 0) || 0,
    
    // Metadata
    created_at: newPost.createdAt || newPost.created_at,
    updated_at: newPost.updatedAt || newPost.updated_at,
    
    // Keep original for reference
    _original: newPost,
  };
}

/**
 * Adapts an array of community posts
 * 
 * @param posts - Array of posts from acado-api
 * @returns Array of posts in legacy format
 */
export function adaptCommunityPostsArray(posts: any[]): any[] {
  if (!Array.isArray(posts)) return [];
  return posts.map(adaptCommunityPost).filter(Boolean);
}

/**
 * Adapts community posts response from new API to legacy format
 * 
 * @param response - Response from API
 * @returns Adapted response in legacy format
 */
export function adaptCommunityPostsResponse(response: any): any {
  console.log('🔄 Adapting community posts response:', {
    hasSuccess: 'success' in response,
    hasData: 'data' in response,
    dataType: Array.isArray(response?.data) ? 'array' : typeof response?.data,
    dataCount: Array.isArray(response?.data) ? response.data.length : 0
  });
  
  // If response has 'success' field, it's from new API
  if (response && typeof response === 'object' && 'success' in response) {
    const posts = Array.isArray(response.data) ? response.data : [];
    const adapted = {
      data: {
        post: adaptCommunityPostsArray(posts)
      }
    };
    console.log('✅ Adapted posts:', adapted.data.post.length, 'posts');
    return adapted;
  }
  
  // If it's already in legacy format with 'data.post' structure
  if (response?.data?.post && Array.isArray(response.data.post)) {
    return {
      data: {
        post: adaptCommunityPostsArray(response.data.post)
      }
    };
  }
  
  // If it's just an array
  if (Array.isArray(response)) {
    return {
      data: {
        post: adaptCommunityPostsArray(response)
      }
    };
  }
  
  console.warn('⚠️ Unknown response format:', response);
  return response;
}

/**
 * Adapts community post details response from new API to legacy format
 * 
 * @param response - Response from API
 * @returns Adapted post details
 */
export function adaptCommunityPostDetailsResponse(response: any): any {
  console.log('🔄 Adapting community post details response');
  
  let postData: any;
  
  // Extract post data from response
  if (response && typeof response === 'object' && 'success' in response) {
    postData = response.data;
  } else if (response && response.data) {
    postData = response.data;
  } else {
    postData = response;
  }
  
  // If it's already in legacy format, return as-is
  if (postData?.content_type) {
    console.log('✅ Already in legacy format');
    return postData;
  }
  
  const adapted = adaptCommunityPost(postData);
  console.log('✅ Adapted post details');
  return adapted;
}

/**
 * Checks if a response is from the new API
 * 
 * @param response - API response
 * @returns true if response is from new API
 */
export function isNewCommunityApiResponse(response: any): boolean {
  return response && typeof response === 'object' && 'success' in response;
}

