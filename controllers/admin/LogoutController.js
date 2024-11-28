import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const UserLogoutController = (req, res) => {
  res.cookie('token', '', { maxAge: 0 }); 
  res.json({ message: 'User logged out successfully' });
};

export default UserLogoutController;
