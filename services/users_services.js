const { User, Doctor, Patient} = require("./../models/user");


const fetchAllUsers = async ()=>{
    
    const users = await User.find({});
    return users;
};

const fetchUserById = async (id)=>{
    const user = await User.findOne({_id : id});
    return user;
}

const fetchByQuery = async (query) => {
    const users = await User.find(query);
    return users;
}

const createUser = async (userObject) => {
    var user = null;

    if(userObject.role.trim().toLowerCase() === 'patient')
        user = new Patient(userObject);
    else if(userObject.role.trim().toLowerCase() === 'doctor')
        user = new Doctor(userObject);
    else{
        user = new User(userObject);
    }
    return await user.save();
}

const removeUser = async (id) =>{
    const deletedUser = await User.findByIdAndDelete(id);
    return deletedUser;
}

const updateUser = async (user) =>{
    const updatedUser = await user.save();
    return updatedUser;
}

module.exports = {
    fetchAllUsers: fetchAllUsers,
    fetchUserById: fetchUserById,
    fetchByQuery: fetchByQuery,
    createUser: createUser,
    removeUser: removeUser,
    updateUser: updateUser
};