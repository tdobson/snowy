import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, parseInt(process.env.SALT_ROUNDS || '10'));
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
};
