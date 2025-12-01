// src/controllers/communityPost.controller.ts
import { Request, Response } from 'express';
import * as service from '../services/communityPost.service.js';

// Category controllers
export async function listCategories(req: Request, res: Response) {
  try {
    const categories = await service.listCategories();
    res.json(categories);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getCategory(req: Request, res: Response) {
  try {
    const category = await service.getCategoryById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const category = await service.createCategory(req.body, userId);
    res.status(201).json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const category = await service.updateCategory(req.params.id, req.body);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json(category);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const category = await service.deleteCategory(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted successfully', category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

// Post controllers
export async function list(req: Request, res: Response) {
  try {
    const { categoryId, contentType, isPinned, search } = req.query;
    const filters: any = {};
    if (categoryId) filters.categoryId = categoryId as string;
    if (contentType) filters.contentType = contentType as string;
    if (isPinned !== undefined) filters.isPinned = isPinned === 'true';
    if (search) filters.search = search as string;
    
    const posts = await service.listCommunityPosts(filters);
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const post = await service.getCommunityPostById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function create(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const post = await service.createCommunityPost(req.body, userId);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const post = await service.updateCommunityPost(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const post = await service.deleteCommunityPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully', post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

