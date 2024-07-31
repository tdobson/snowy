exports.getAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll(); // This fetches all users from the 'wp_members_db' table
        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
}

exports.getUserById = (req, res) => {
  // Logic to get a user by ID
  res.send('A single user');
};

exports.createUser = (req, res) => {
  // Logic to create a new user
  res.send('User created');
};

exports.updateUser = (req, res) => {
  // Logic to update a user by ID
  res.send('User updated');
};

exports.deleteUser = (req, res) => {
  // Logic to delete a user by ID
  res.send('User deleted');
};
