import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { UserAttributes } from '../types/user';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

export const getUserById = (req: Request, res: Response): void => {
  // Logic to get a user by ID
  res.send('A single user');
};

export const createUser = (req: Request, res: Response): void => {
  // Logic to create a new user
  res.send('User created');
};

export const updateUser = (req: Request, res: Response): void => {
  // Logic to update a user by ID
  res.send('User updated');
};

export const deleteUser = (req: Request, res: Response): void => {
  // Logic to delete a user by ID
  res.send('User deleted');
};
