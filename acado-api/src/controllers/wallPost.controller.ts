// src/controllers/wallPost.controller.ts
import { Request, Response } from 'express';
import * as service from '../services/wallPost.service.js';

export async function list(req: Request, res: Response) {
  try {
    const { createdBy, search } = req.query;
    const filters: any = {};
    if (createdBy) filters.createdBy = createdBy as string;
    if (search) filters.search = search as string;
    
    const posts = await service.listWallPosts(filters);
    res.json(posts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

export async function getOne(req: Request, res: Response) {
  try {
    const post = await service.getWallPostById(req.params.id);
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
    
    const post = await service.createWallPost(req.body, userId);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const post = await service.updateWallPost(req.params.id, req.body);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const post = await service.deleteWallPost(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully', post });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}

